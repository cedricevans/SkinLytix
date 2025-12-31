# MVP Document
## SkinLytix - Minimum Viable Product Specification

**Document Version:** 2.0  
**Last Updated:** December 31, 2025  
**Status:** Active Development → Beta  
**Owner:** Product & Engineering Teams

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [MVP Vision & Scope](#mvp-vision--scope)
3. [Core Features (Implemented)](#core-features-implemented)
4. [Subscription & Monetization](#subscription--monetization)
5. [Technical Implementation](#technical-implementation)
6. [Launch Criteria](#launch-criteria)
7. [Metrics & Success Indicators](#metrics--success-indicators)
8. [Post-Launch Iteration Plan](#post-launch-iteration-plan)

---

## Executive Summary

### What is the MVP?

SkinLytix MVP is a **web-based skincare ingredient analysis platform** that enables users to instantly analyze product ingredients using AI, receive personalized recommendations based on their skin profile, build optimized skincare routines, and discover affordable product alternatives.

### Key Features Delivered

1. ✅ AI-powered ingredient analysis with EpiQ Score
2. ✅ Personalized skin profile onboarding
3. ✅ SkinLytixGPT conversational AI chat
4. ✅ Routine builder with AI optimization
5. ✅ Dupe discovery for affordable alternatives
6. ✅ Freemium subscription model (Free/Premium/Pro)
7. ✅ 7-day premium trial for new users
8. ✅ Stripe payment integration

### MVP Timeline

- **Development:** Weeks 1-12 (✅ Complete)
- **Beta Testing:** Ongoing (current phase)
- **Academic Partnership:** Q1 2026 (Spelman Cosmetic Science)
- **Public Launch:** Q2 2026

### MVP Success Metrics

- 1,000+ beta signups
- 70%+ trial-to-paid conversion
- 4.0+ average satisfaction rating
- 60% 30-day retention rate
- 5+ analyses per user in first month

---

## MVP Vision & Scope

### MVP Core Value Proposition

**"Analyze any skincare product in 30 seconds and know if it's right for YOUR skin"**

### What Makes It Minimal?

The MVP includes **only** the features required to:
1. ✅ Capture user skin profile
2. ✅ Extract ingredient lists from product images (OCR)
3. ✅ Analyze ingredients with AI personalization
4. ✅ Generate personalized recommendations
5. ✅ Enable conversational AI follow-up questions
6. ✅ Allow users to build and optimize routines
7. ✅ Discover affordable product alternatives
8. ✅ Collect feedback for iteration
9. ✅ Monetize through subscriptions

### What Makes It Viable?

- **Fast:** 10-15 second analysis time (OCR + AI)
- **Accurate:** 85%+ user satisfaction with recommendations
- **Personal:** Scoring adapts to each user's skin profile
- **Actionable:** Clear recommendations, not just ratings
- **Scalable:** Built on Lovable Cloud for auto-scaling
- **Monetizable:** Tiered subscription with clear value props

---

## Core Features (Implemented)

### 1. User Authentication & Onboarding

**Status:** ✅ Complete

- Email/password signup and login (Supabase Auth)
- Auto-confirm email signups (beta)
- Protected routes with authentication guards
- Onboarding flow to capture skin profile
- 7-day premium trial auto-enrollment

**Skin Profile Data:**
- Skin Type: Normal, Oily, Dry, Combination, Sensitive
- Skin Concerns: Acne, Aging, Dark Spots, Dryness, Redness, etc.
- Body Concerns (optional)
- Scalp Type (optional)
- Product Preferences: Face, Body, Hair

---

### 2. Product Image Upload & OCR

**Status:** ✅ Complete

- Drag-and-drop file upload
- File picker for mobile/desktop
- Tesseract.js OCR engine for text extraction
- AI-powered ingredient extraction (vision model)
- Progress indicator during processing
- Editable text field for manual corrections
- Support for JPG, PNG, HEIC (up to 10MB)

**Edge Function:** `extract-ingredients`

---

### 3. AI-Powered Ingredient Analysis

**Status:** ✅ Complete

- Personalized EpiQ Score (0-100) based on skin profile
- Sub-scores: Safety, Compatibility, Active Quality, Preservatives
- Identification of beneficial ingredients
- Flagging of problematic ingredients (irritants, allergens)
- Integration with PubChem API for molecular data
- Integration with Open Beauty Facts for product metadata
- AI-generated recommendations for usage, timing, application
- Professional referral recommendations when needed

**Edge Function:** `analyze-product`
**AI Model:** Lovable AI - Gemini 2.5 Flash

---

### 4. SkinLytixGPT Chat

**Status:** ✅ Complete

- Context-aware conversational AI about product analysis
- Streaming responses (Server-Sent Events)
- Conversation persistence to database
- Usage limits by subscription tier (3/50/unlimited)
- Professional guardrails (no medical diagnosis)

**Edge Function:** `chat-skinlytix`

---

### 5. Routine Builder & Optimization

**Status:** ✅ Complete

- Create multiple named routines (Morning, Evening, etc.)
- Add analyzed products to routines
- Specify usage frequency (AM, PM, AM/PM, Weekly)
- Optional product price input
- Total routine cost calculation
- AI-powered routine optimization:
  - Ingredient redundancy detection
  - Conflicting actives identification
  - Cost optimization suggestions
  - Product order recommendations
  - Savings calculations

**Edge Function:** `optimize-routine`

---

### 6. Dupe Discovery

**Status:** ✅ Complete

- AI-powered product alternative finder
- Similarity scoring based on ingredients
- Price comparison
- Save dupes to favorites
- Shared ingredient highlighting

**Edge Function:** `find-dupes`

---

### 7. Analysis Results Display

**Status:** ✅ Complete

- Prominent EpiQ Score display (animated gauge)
- Score interpretation (Excellent, Good, Fair, Poor)
- Sub-score breakdown (Premium feature)
- Ingredient risk heatmap
- AI explanation accordion (Premium feature)
- List of beneficial ingredients with explanations
- List of problematic ingredients with warnings
- Actionable recommendations
- Product metadata display
- Post-analysis feedback collection
- Professional referral banner when needed

---

## Subscription & Monetization

### Subscription Tiers

| Feature | Free | Premium ($7.99/mo) | Pro ($14.99/mo) |
|---------|------|---------------------|------------------|
| Product Analysis | ✅ Unlimited | ✅ Unlimited | ✅ Unlimited |
| EpiQ Score | ✅ | ✅ | ✅ |
| Score Breakdown | ❌ | ✅ | ✅ |
| AI Explanation | ❌ | ✅ | ✅ |
| SkinLytixGPT | 3/month | 50/month | ✅ Unlimited |
| Routines | 1 | 5 | ✅ Unlimited |
| Routine Optimization | ❌ | 3/month | ✅ Unlimited |
| Dupe Discovery | ✅ | ✅ | ✅ |
| PDF Export | ❌ | 5/month | ✅ Unlimited |

### Trial System

- 7-day free trial for all new signups
- Full Premium features during trial
- Automatic downgrade if not converted
- Trial countdown banner displayed

### Payment Integration

**Provider:** Stripe

**Edge Functions:**
- `create-checkout` - Generate Stripe checkout session
- `check-subscription` - Verify subscription status
- `customer-portal` - Manage subscription

**Database Fields:**
- `subscription_tier` (free/premium/pro)
- `stripe_customer_id`
- `stripe_subscription_id`
- `trial_started_at`
- `trial_ends_at`

---

## Technical Implementation

### Edge Functions

| Function | Purpose | Auth Required |
|----------|---------|---------------|
| `analyze-product` | AI ingredient analysis | ✅ Yes |
| `chat-skinlytix` | Conversational AI chat | ❌ No |
| `optimize-routine` | AI routine optimization | ✅ Yes |
| `find-dupes` | Product dupe discovery | ❌ No |
| `extract-ingredients` | Image-to-ingredients | ❌ No |
| `query-open-beauty-facts` | Product data lookup | ❌ No |
| `query-pubchem` | Ingredient data lookup | ❌ No |
| `create-checkout` | Stripe checkout | ✅ Yes |
| `check-subscription` | Subscription status | ✅ Yes |
| `customer-portal` | Billing management | ✅ Yes |

### Database Tables

**Core:**
- `profiles` - User data + subscription
- `user_analyses` - Product analyses
- `routines` - User routines
- `routine_products` - Routine-product links
- `routine_optimizations` - Optimization results

**Chat:**
- `chat_conversations` - Chat sessions
- `chat_messages` - Chat messages

**Engagement:**
- `usage_limits` - Feature usage tracking
- `user_badges` - Gamification
- `saved_dupes` - Saved alternatives
- `feedback` - User feedback
- `beta_feedback` - PMF survey responses
- `user_events` - Analytics events

**Cache:**
- `product_cache` - Open Beauty Facts cache
- `ingredient_cache` - PubChem cache

**Security:**
- `user_roles` - Role-based access
- `rate_limit_log` - Rate limiting

---

## Launch Criteria

### Must-Have for Beta

- [x] Core analysis workflow complete
- [x] Authentication and profiles working
- [x] Chat feature functional
- [x] Routine builder operational
- [x] Subscription system integrated
- [x] Payment processing working
- [x] Usage tracking implemented
- [x] Feedback collection enabled

### Must-Have for Public Launch

- [ ] Academic partnership validated (Spelman 2026)
- [ ] 500+ beta user analyses
- [ ] 4.0+ average satisfaction rating
- [ ] < 2% error rate on analyses
- [ ] Email notification system
- [ ] Terms of Service and Privacy Policy

---

## Metrics & Success Indicators

### Engagement Metrics

| Metric | Target | Current |
|--------|--------|---------|
| Daily Active Users | 100+ | Tracking |
| Analyses per User | 5+/month | Tracking |
| Chat Messages per User | 10+/month | Tracking |
| Routine Creation Rate | 50% | Tracking |

### Conversion Metrics

| Metric | Target | Current |
|--------|--------|---------|
| Demo → Signup | 40% | Tracking |
| Signup → Onboarding | 90% | Tracking |
| Onboarding → First Analysis | 80% | Tracking |
| Trial → Paid | 30% | Tracking |

### Retention Metrics

| Metric | Target | Current |
|--------|--------|---------|
| Day 1 Retention | 70% | Tracking |
| Day 7 Retention | 50% | Tracking |
| Day 30 Retention | 30% | Tracking |
| Monthly Churn | < 5% | Tracking |

---

## Post-Launch Iteration Plan

### Phase 1: Academic Partnership (Q1 2026)

- Spelman Cosmetic Science student validation
- Expert review queue system
- "Validated by Experts" trust badges
- Student-authored ingredient articles

### Phase 2: Mobile Optimization (Q2 2026)

- PWA implementation
- Camera-first experience
- Push notifications
- Offline support

### Phase 3: Social Features (Q3 2026)

- Routine sharing
- Product reviews
- Community recommendations
- Influencer partnerships

### Phase 4: Enterprise (Q4 2026)

- API access for brands
- White-label solutions
- Retail partnerships
- B2B analytics
