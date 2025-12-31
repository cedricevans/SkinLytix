# API Documentation

**Document Version:** 2.0  
**Last Updated:** December 31, 2025  
**Owner:** Engineering Team  
**Status:** Active

---

## Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Edge Functions Reference](#edge-functions-reference)
4. [Rate Limiting](#rate-limiting)
5. [Error Handling](#error-handling)
6. [Example cURL Commands](#example-curl-commands)
7. [Webhook Integrations](#webhook-integrations)

---

## Overview

### API Architecture

SkinLytix uses **Supabase Edge Functions** (Deno runtime) for all backend logic. Edge functions are serverless functions that run on-demand, scaling automatically with traffic.

**Base URL:**
```
https://yflbjaetupvakadqjhfb.supabase.co/functions/v1/
```

**Function URL Pattern:**
```
{BASE_URL}/{function-name}
```

### Technology Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Runtime** | Deno (TypeScript) | Edge function execution |
| **Database** | PostgreSQL (Supabase) | Data persistence |
| **AI Provider** | Lovable AI Gateway | Gemini 2.5 Flash models |
| **OCR** | Tesseract.js | Ingredient extraction |
| **External APIs** | Open Beauty Facts, PubChem | Product & ingredient data |
| **Payments** | Stripe | Subscription management |
| **Real-time** | Server-Sent Events (SSE) | Streaming chat responses |

### API Design Principles

1. **RESTful**: Standard HTTP methods (POST, GET)
2. **JSON**: All request/response bodies in JSON
3. **Stateless**: No server-side sessions (JWT auth)
4. **Idempotent**: Safe to retry failed requests
5. **Rate Limited**: Protect against abuse

---

## Authentication

### Authentication Methods

**Method 1: JWT Token (Required for User-Specific Operations)**

```http
POST /functions/v1/analyze-product
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**How to Get JWT Token:**

```typescript
import { supabase } from '@/integrations/supabase/client';

// Get current user's JWT token
const { data: { session } } = await supabase.auth.getSession();
const token = session?.access_token;

// Use in API calls
const response = await fetch(`${SUPABASE_URL}/functions/v1/analyze-product`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ productName, ingredients })
});
```

### Authentication Requirements by Function

| Function | Auth Required | Notes |
|----------|---------------|-------|
| `analyze-product` | ✅ Yes | User JWT required |
| `chat-skinlytix` | ❌ No | Optional for persistence |
| `optimize-routine` | ✅ Yes | User JWT required |
| `find-dupes` | ❌ No | Public access |
| `query-open-beauty-facts` | ❌ No | Public access |
| `query-pubchem` | ❌ No | Public access |
| `create-checkout` | ✅ Yes | User JWT required |
| `check-subscription` | ✅ Yes | User JWT required |
| `customer-portal` | ✅ Yes | User JWT required |

---

## Edge Functions Reference

### 1. analyze-product

**Purpose:** Analyze a skincare product's ingredients using AI and return EpiQ score + insights.

**Endpoint:** `POST /functions/v1/analyze-product`

**Authentication:** Required (JWT token)

**Request Body:**

```typescript
interface AnalyzeProductRequest {
  productName: string;        // Required: Product name
  ingredients: string;        // Required: Comma-separated ingredient list
  brand?: string;            // Optional: Brand name
  category?: string;         // Optional: Product category (e.g., "Moisturizer")
  price?: number;            // Optional: Product price (USD)
  userProfile?: {            // Optional: User's skin profile
    skin_type?: string;      // "oily" | "dry" | "combination" | "normal"
    skin_concerns?: string[];// ["acne", "sensitivity", "aging", etc.]
  };
}
```

**Response:**

```typescript
interface AnalyzeProductResponse {
  epiq_score: number;        // 0-100 overall quality score
  sub_scores: {
    ingredient_safety: number;
    skin_compatibility: number;
    active_quality: number;
    preservative_safety: number;
  };
  recommendations_json: {
    overall_assessment: string;
    product_metadata: {
      product_type: string;
      product_type_label: string;
      brand: string;
      category: string;
    };
    enriched_ingredients: Array<{
      name: string;
      role: string;
      explanation: string;
      molecular_weight: number | null;
      safety_profile: string;
      risk_score: number;
      category: "safe" | "beneficial" | "problematic" | "unverified";
    }>;
    key_actives: Array<{
      name: string;
      function: string;
      benefits: string[];
    }>;
    red_flags: Array<{
      ingredient: string;
      concern: string;
      severity: "low" | "medium" | "high";
    }>;
    suitable_for: string[];
    avoid_if: string[];
    routine_placement: string;
    ai_explanation: {
      answer_markdown: string;
      summary_one_liner: string;
      safety_level: "low" | "moderate" | "high" | "unknown";
      professional_referral: {
        needed: boolean;
        reason: string;
        suggested_professional_type: "none" | "dermatologist" | "esthetician" | "either";
      };
    };
  };
  analysis_id: string;
}
```

---

### 2. chat-skinlytix

**Purpose:** Enable conversational AI chat about product analysis with context awareness and conversation persistence.

**Endpoint:** `POST /functions/v1/chat-skinlytix`

**Authentication:** Optional (JWT token recommended for persistence)

**Request Body:**

```typescript
interface ChatRequest {
  analysisId: string;        // UUID of product analysis
  conversationId?: string;   // Optional: existing conversation ID
  userId?: string;           // Optional: user ID for persistence
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
}
```

**Response:** Server-Sent Events (SSE) stream

```
data: {"choices":[{"delta":{"content":"Hello"}}]}
data: {"choices":[{"delta":{"content":" there"}}]}
data: {"choices":[{"delta":{"content":"!"}}]}
data: [DONE]
```

**Response Headers:**
- `Content-Type: text/event-stream`
- `X-Conversation-Id: <uuid>` - Conversation UUID for follow-up messages

---

### 3. optimize-routine

**Purpose:** Analyze a user's skincare routine and provide optimization recommendations.

**Endpoint:** `POST /functions/v1/optimize-routine`

**Authentication:** Required (JWT token)

**Request Body:**

```typescript
interface OptimizeRoutineRequest {
  routineId: string;  // UUID of routine to optimize
}
```

**Response:**

```typescript
interface OptimizeRoutineResponse {
  optimization_id: string;
  routine_id: string;
  optimization_data: {
    summary: {
      current_cost: number;
      optimized_cost: number;
      savings: number;
      savings_percentage: number;
      products_analyzed: number;
    };
    insights: {
      redundancies: Array<{
        products: string[];
        ingredient: string;
        recommendation: string;
      }>;
      order_optimization: Array<{
        product: string;
        current_position: number;
        recommended_position: number;
        reason: string;
      }>;
      better_alternatives: Array<{
        current_product: string;
        alternative: string;
        price_difference: number;
        why_better: string;
      }>;
      missing_essentials: Array<{
        product_type: string;
        reason: string;
        recommendations: string[];
      }>;
    };
    routine_type: "face" | "body" | "hair" | "mixed";
  };
}
```

---

### 4. find-dupes

**Purpose:** Find affordable alternatives (dupes) for skincare products.

**Endpoint:** `POST /functions/v1/find-dupes`

**Authentication:** Not required

**Request Body:**

```typescript
interface FindDupesRequest {
  productName: string;
  brand?: string;
  ingredients?: string;
  category?: string;
  priceRange?: string;
  maxResults?: number;
}
```

**Response:**

```typescript
interface FindDupesResponse {
  dupes: Array<{
    product_name: string;
    brand: string;
    price_estimate: string;
    image_url?: string;
    reasons: string[];
    shared_ingredients: string[];
    similarity_score: number;
  }>;
}
```

---

### 5. query-open-beauty-facts

**Purpose:** Query Open Beauty Facts API for product data.

**Endpoint:** `POST /functions/v1/query-open-beauty-facts`

**Authentication:** Not required

**Request Body:**

```typescript
interface OBFRequest {
  barcode: string;
}
```

---

### 6. query-pubchem

**Purpose:** Query PubChem for ingredient molecular data.

**Endpoint:** `POST /functions/v1/query-pubchem`

**Authentication:** Not required

**Request Body:**

```typescript
interface PubChemRequest {
  ingredientName: string;
}
```

---

### 7. create-checkout

**Purpose:** Create a Stripe checkout session for subscription purchase.

**Endpoint:** `POST /functions/v1/create-checkout`

**Authentication:** Required (JWT token)

**Request Body:**

```typescript
interface CreateCheckoutRequest {
  plan: 'premium' | 'pro';
  billingCycle: 'monthly' | 'annual';
}
```

**Response:**

```typescript
interface CreateCheckoutResponse {
  url: string;  // Stripe checkout URL
}
```

**Stripe Price IDs:**

| Plan | Billing | Price ID |
|------|---------|----------|
| Premium | Monthly | `price_premium_monthly` |
| Premium | Annual | `price_premium_annual` |
| Pro | Monthly | `price_pro_monthly` |
| Pro | Annual | `price_pro_annual` |

---

### 8. check-subscription

**Purpose:** Verify user's subscription status with Stripe.

**Endpoint:** `POST /functions/v1/check-subscription`

**Authentication:** Required (JWT token)

**Response:**

```typescript
interface CheckSubscriptionResponse {
  subscribed: boolean;
  tier: 'free' | 'premium' | 'pro';
  subscription_end: string | null;
}
```

---

### 9. customer-portal

**Purpose:** Generate Stripe customer portal URL for subscription management.

**Endpoint:** `POST /functions/v1/customer-portal`

**Authentication:** Required (JWT token)

**Response:**

```typescript
interface CustomerPortalResponse {
  url: string;  // Stripe customer portal URL
}
```

---

### 10. extract-ingredients

**Purpose:** Extract product information from images using AI vision.

**Endpoint:** `POST /functions/v1/extract-ingredients`

**Authentication:** Not required

**Request Body:**

```typescript
interface ExtractIngredientsRequest {
  image: string;           // Base64 encoded image
  productType?: string;    // 'face' | 'body' | 'hair'
}
```

**Response:**

```typescript
interface ExtractIngredientsResponse {
  product_name: string;
  brand: string;
  category: string;
  ingredients: string;
}
```

---

## Rate Limiting

### Rate Limit Configuration

| Endpoint | Limit | Window |
|----------|-------|--------|
| `analyze-product` | 10 requests | 5 minutes |
| `chat-skinlytix` | 20 requests | 5 minutes |
| `optimize-routine` | 5 requests | 5 minutes |
| `find-dupes` | 20 requests | 5 minutes |
| `create-checkout` | 5 requests | 5 minutes |

### Rate Limit Response

```json
{
  "error": "Rate limit exceeded. Please try again later.",
  "retry_after_seconds": 300
}
```

**HTTP Status:** 429 Too Many Requests

---

## Error Handling

### Standard Error Response

```typescript
interface ErrorResponse {
  error: string;
  code?: string;
  details?: object;
  retry_after_seconds?: number;
}
```

### HTTP Status Codes

| Code | Meaning | When Used |
|------|---------|-----------|
| 200 | OK | Successful request |
| 400 | Bad Request | Invalid input |
| 401 | Unauthorized | Missing/invalid auth |
| 402 | Payment Required | AI credits depleted |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |

---

## Example cURL Commands

### Analyze Product

```bash
curl -X POST \
  'https://yflbjaetupvakadqjhfb.supabase.co/functions/v1/analyze-product' \
  -H 'Authorization: Bearer <JWT_TOKEN>' \
  -H 'Content-Type: application/json' \
  -d '{
    "productName": "CeraVe Moisturizing Cream",
    "ingredients": "Water, Glycerin, Cetearyl Alcohol...",
    "brand": "CeraVe",
    "category": "Moisturizer"
  }'
```

### Create Checkout Session

```bash
curl -X POST \
  'https://yflbjaetupvakadqjhfb.supabase.co/functions/v1/create-checkout' \
  -H 'Authorization: Bearer <JWT_TOKEN>' \
  -H 'Content-Type: application/json' \
  -d '{
    "plan": "premium",
    "billingCycle": "monthly"
  }'
```

### Find Dupes

```bash
curl -X POST \
  'https://yflbjaetupvakadqjhfb.supabase.co/functions/v1/find-dupes' \
  -H 'Content-Type: application/json' \
  -d '{
    "productName": "La Mer Moisturizing Cream",
    "brand": "La Mer",
    "category": "Moisturizer"
  }'
```

---

## Webhook Integrations

### Stripe Webhooks

**Endpoint:** `POST /functions/v1/stripe-webhook` (future implementation)

**Events Handled:**
- `checkout.session.completed` - Subscription created
- `customer.subscription.updated` - Subscription changed
- `customer.subscription.deleted` - Subscription cancelled
- `invoice.payment_failed` - Payment failed

**Webhook Signature Verification:**

```typescript
const sig = request.headers.get('stripe-signature');
const event = stripe.webhooks.constructEvent(
  body,
  sig,
  Deno.env.get('STRIPE_WEBHOOK_SECRET')
);
```

---

## Environment Variables

### Required Secrets

| Variable | Description | Used By |
|----------|-------------|---------|
| `LOVABLE_API_KEY` | Lovable AI Gateway key | analyze-product, chat-skinlytix, optimize-routine, find-dupes |
| `STRIPE_SECRET_KEY` | Stripe API key | create-checkout, check-subscription, customer-portal |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing | stripe-webhook |

### Auto-Configured (Supabase)

| Variable | Description |
|----------|-------------|
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_ANON_KEY` | Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key |
