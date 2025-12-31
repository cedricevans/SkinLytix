# User Flows & Journey Maps

**Document Version:** 2.0  
**Last Updated:** December 31, 2025  
**Owner:** Product Team  
**Status:** Active

---

## Table of Contents

1. [User Personas](#user-personas)
2. [Onboarding Flow](#onboarding-flow)
3. [Product Analysis Flow](#product-analysis-flow)
4. [Routine Building Flow](#routine-building-flow)
5. [Subscription & Upgrade Flow](#subscription--upgrade-flow)
6. [Chat & AI Interaction Flow](#chat--ai-interaction-flow)
7. [Dupe Discovery Flow](#dupe-discovery-flow)
8. [Conversion Funnels](#conversion-funnels)
9. [Drop-off Points & Mitigation](#drop-off-points--mitigation)

---

## User Personas

### Primary Personas

#### 1. Emma - The Skincare Enthusiast (24, Student)

**Demographics:**
- Age: 24
- Location: Los Angeles, CA
- Occupation: Graduate student
- Income: $20k/year (part-time + student loans)

**Behaviors:**
- Spends 30+ min daily on skincare routine
- Active on r/SkincareAddiction, TikTok #SkincareTok
- Reads ingredient lists but doesn't fully understand them
- Owns 15+ skincare products
- Budget-conscious but willing to invest in "good" products

**Pain Points:**
- "I don't know if this product is actually good for my skin"
- "I see conflicting information online about ingredients"
- "I've wasted money on products that broke me out"
- "My routine is getting too expensive"

**Goals:**
- Understand what's really in her products
- Build an evidence-based routine
- Avoid ingredients that cause breakouts
- Save money without sacrificing quality

**How SkinLytix Helps:**
- Instant ingredient analysis → Confidence in purchases
- EpiQ Score → Simple quality metric
- Routine optimization → Cost savings
- Dupe Discovery → Affordable alternatives
- SkinLytixGPT Chat → Personalized advice

---

## Onboarding Flow

### Entry Points

```mermaid
graph LR
    A[Discovery] --> B{Entry Point}
    B -->|Instagram Ad| C[Instagram Landing]
    B -->|Organic Search| D[Homepage]
    B -->|Reddit Post| D
    B -->|Friend Referral| E[Direct to Demo]
    B -->|Waitlist Email| F[Direct to Signup]
    
    C --> G[Demo Analysis]
    D --> G
    E --> G
    F --> H[Signup]
    G --> I{Impressed?}
    I -->|Yes| H
    I -->|No| J[Exit]
    
    style C fill:#ffd93d
    style G fill:#6bcf7f
    style H fill:#4ecdc4
    style J fill:#ff6b6b
```

### Complete Onboarding Flow

```mermaid
graph TD
    A[Sign Up Complete] --> B[Welcome Screen]
    B --> C{Skip or Continue?}
    C -->|Skip| D[Incomplete Profile Flag]
    C -->|Continue| E[Skin Type Selection]
    
    E --> F{Skin Type?}
    F -->|Oily| G[Oily Skin Concerns]
    F -->|Dry| H[Dry Skin Concerns]
    F -->|Combination| I[Combination Concerns]
    F -->|Normal| J[Normal Skin Concerns]
    F -->|Sensitive| K[Sensitive Concerns]
    
    G --> L[Product Preferences]
    H --> L
    I --> L
    J --> L
    K --> L
    
    L --> M{Face/Body/Hair?}
    M --> N[Onboarding Complete]
    N --> O[Start 7-Day Trial]
    O --> P[Redirect to Upload]
    D --> Q[Prompt Later]
    
    style N fill:#6bcf7f
    style O fill:#4ecdc4
    style Q fill:#ffd93d
```

---

## Product Analysis Flow

### Upload Methods & User Paths

```mermaid
graph TB
    A[User Wants to Analyze Product] --> B{Upload Method}
    
    B -->|Camera| C[Take Photo]
    B -->|Drag & Drop| D[Drop Image]
    B -->|File Picker| E[Browse Files]
    B -->|Manual Entry| F[Type Ingredients]
    
    C --> G[Image Preview]
    D --> G
    E --> G
    
    G --> H{Image Quality?}
    H -->|Good| I[Start OCR]
    H -->|Poor| J[Prompt Retake]
    
    J --> K[Show Tips]
    K --> B
    
    I --> L[OCR Processing]
    L --> M{OCR Success?}
    M -->|Yes| N[Extract Ingredients]
    M -->|Partial| O[Manual Correction]
    M -->|Failed| F
    
    N --> P[AI Analysis]
    O --> P
    F --> P
    
    P --> Q[Results Display]
    Q --> R{Next Action}
    R -->|Save| S[Add to Routine]
    R -->|Chat| T[Ask SkinLytixGPT]
    R -->|Compare| U[Find Dupes]
    R -->|Share| V[Generate Share Link]
    R -->|New| W[Upload Another]
    
    style I fill:#ffd93d
    style P fill:#ffd93d
    style Q fill:#6bcf7f
```

### Analysis Results Actions

```mermaid
graph LR
    A[Analysis Results] --> B[EpiQ Score Display]
    B --> C{User Actions}
    
    C --> D[View Score Breakdown]
    C --> E[Read AI Explanation]
    C --> F[Chat with SkinLytixGPT]
    C --> G[Add to Routine]
    C --> H[Find Dupes]
    C --> I[Export PDF]
    
    D --> J{Premium?}
    E --> J
    J -->|No| K[Paywall Modal]
    J -->|Yes| L[Show Content]
    
    F --> M{Messages Left?}
    M -->|No| K
    M -->|Yes| N[Open Chat]
    
    style K fill:#ff6b6b
    style L fill:#6bcf7f
```

---

## Routine Building Flow

### Create Routine Flow

```mermaid
graph TD
    A[Routine Page] --> B{Has Routines?}
    B -->|No| C[Create First Routine]
    B -->|Yes| D[View Routines]
    
    C --> E[Enter Routine Name]
    E --> F[Select Routine Type]
    F --> G[Routine Created]
    
    D --> H{Routine Limit?}
    H -->|Free: 1| I{Has 1?}
    H -->|Premium: 5| J{Has 5?}
    H -->|Pro| K[Unlimited]
    
    I -->|Yes| L[Upgrade Prompt]
    I -->|No| C
    J -->|Yes| L
    J -->|No| C
    K --> C
    
    G --> M[Add Products]
    M --> N[Select from Analyses]
    N --> O[Set Usage Frequency]
    O --> P[Product Added]
    
    style L fill:#ff6b6b
    style G fill:#6bcf7f
```

### Routine Optimization Flow

```mermaid
graph TD
    A[View Routine] --> B[Click Optimize]
    B --> C{Subscription Tier?}
    
    C -->|Free| D[Show Preview]
    D --> E[Blurred Results]
    E --> F[Upgrade CTA]
    
    C -->|Premium| G{Optimizations Left?}
    G -->|No| F
    G -->|Yes| H[Run Optimization]
    
    C -->|Pro| H
    
    H --> I[AI Processing]
    I --> J[Show Results]
    J --> K[Redundancies Found]
    J --> L[Conflicts Identified]
    J --> M[Cost Savings]
    J --> N[Product Order]
    
    F --> O[Paywall Modal]
    
    style E fill:#ffd93d
    style J fill:#6bcf7f
    style O fill:#ff6b6b
```

---

## Subscription & Upgrade Flow

### Upgrade Journey

```mermaid
graph TD
    A[User Hits Feature Gate] --> B[Paywall Modal Opens]
    B --> C[View Plan Comparison]
    
    C --> D{Select Plan}
    D -->|Premium| E[Premium $7.99/mo]
    D -->|Pro| F[Pro $14.99/mo]
    
    E --> G{Billing Cycle}
    F --> G
    G -->|Monthly| H[Full Price]
    G -->|Annual| I[17% Discount]
    
    H --> J[Click Subscribe]
    I --> J
    
    J --> K[Create Checkout Session]
    K --> L[Redirect to Stripe]
    L --> M[Enter Payment]
    M --> N{Payment Success?}
    
    N -->|Yes| O[Redirect to Profile]
    N -->|No| P[Show Error]
    
    O --> Q[Subscription Active]
    Q --> R[Feature Unlocked]
    
    style B fill:#ffd93d
    style Q fill:#6bcf7f
    style R fill:#4ecdc4
```

### Trial Flow

```mermaid
graph TD
    A[New User Signup] --> B[Auto-Start Trial]
    B --> C[7-Day Premium Access]
    
    C --> D{Day 5}
    D --> E[Show Trial Banner]
    E --> F[2 Days Remaining]
    
    F --> G{Day 7}
    G -->|Convert| H[Upgrade Flow]
    G -->|Expire| I[Downgrade to Free]
    
    H --> J[Active Subscription]
    I --> K[Feature Gates Activated]
    
    style C fill:#6bcf7f
    style E fill:#ffd93d
    style I fill:#ff6b6b
```

---

## Chat & AI Interaction Flow

### SkinLytixGPT Chat Flow

```mermaid
graph TD
    A[View Analysis] --> B[Click Ask SkinLytixGPT]
    B --> C{Check Usage}
    
    C -->|Free: 3/mo| D{Messages Used?}
    C -->|Premium: 50/mo| E{Messages Used?}
    C -->|Pro| F[Unlimited]
    
    D -->|< 3| G[Open Chat]
    D -->|>= 3| H[Paywall]
    E -->|< 50| G
    E -->|>= 50| H
    F --> G
    
    G --> I[Show Context]
    I --> J[Product Analysis Summary]
    J --> K[User Asks Question]
    
    K --> L[Stream Response]
    L --> M[Increment Usage]
    M --> N[Continue Conversation]
    N --> K
    
    H --> O[Upgrade Modal]
    
    style G fill:#6bcf7f
    style H fill:#ff6b6b
    style L fill:#4ecdc4
```

### Chat Context

```
┌─────────────────────────────────────┐
│ Chatting about: CeraVe Moisturizer  │
│ EpiQ Score: 87/100                  │
├─────────────────────────────────────┤
│                                     │
│ User: Is this good for oily skin?   │
│                                     │
│ SkinLytixGPT: Based on your oily    │
│ skin profile, this product has...   │
│                                     │
│ [Usage: 2 of 3 messages]            │
│                                     │
│ [Type your question...]             │
└─────────────────────────────────────┘
```

---

## Dupe Discovery Flow

### Find Dupes Flow

```mermaid
graph TD
    A[View Analysis] --> B[Click Find Dupes]
    B --> C[AI Searches for Alternatives]
    C --> D[Display Dupe Cards]
    
    D --> E{User Action}
    E -->|Save| F{Save Limit?}
    E -->|Compare| G[Side-by-Side]
    E -->|Dismiss| H[Remove from List]
    
    F -->|Free: 5| I{Saved 5?}
    F -->|Premium+| J[Unlimited]
    
    I -->|Yes| K[Upgrade Prompt]
    I -->|No| L[Save to Favorites]
    J --> L
    
    L --> M[View in Favorites]
    
    style D fill:#6bcf7f
    style K fill:#ff6b6b
```

### Dupe Card Display

```
┌─────────────────────────────────────┐
│ [Product Image]                     │
│                                     │
│ The Ordinary Moisturizing Factors   │
│ Brand: The Ordinary                 │
│ Est. Price: $12-15                  │
│                                     │
│ Why it's a dupe:                    │
│ • Similar ceramide formula          │
│ • Contains hyaluronic acid          │
│ • Same humectant base               │
│                                     │
│ [Save Dupe] [Compare] [Dismiss]     │
└─────────────────────────────────────┘
```

---

## Conversion Funnels

### Primary Conversion Funnel

```mermaid
graph TD
    A[Homepage View] -->|30% drop| B[Demo CTA Click]
    B -->|15% drop| C[Demo Loading]
    C -->|10% drop| D[Demo Results]
    D -->|40% drop| E[Signup Click]
    E -->|10% drop| F[Signup Complete]
    F -->|5% drop| G[Onboarding Complete]
    G -->|5% drop| H[First Analysis]
    H -->|70% drop| I[Upgrade to Premium]
    
    style A fill:#95e1d3
    style E fill:#ffd93d
    style I fill:#4ecdc4
```

### Upgrade Funnel

```mermaid
graph TD
    A[Free User] --> B{Hits Feature Gate}
    B --> C[Paywall View]
    C --> D{Select Plan}
    D --> E[Checkout Start]
    E --> F{Payment Complete}
    F -->|Yes| G[Subscribed]
    F -->|No| H[Abandoned]
    
    style C fill:#ffd93d
    style G fill:#6bcf7f
    style H fill:#ff6b6b
```

---

## Drop-off Points & Mitigation

### Risk Point 1: Homepage → Demo (30% drop)

**Why:** Not convinced of value, overwhelmed

**Mitigation:**
- Clear value proposition above fold
- Social proof (user count, ratings)
- Video demonstration
- Single primary CTA
- Trust signals (expert validation badge)

### Risk Point 2: Demo Results → Signup (40% drop)

**Why:** Got their answer, don't see account value

**Mitigation:**
- Highlight locked features (grayed buttons)
- "Save this analysis" prompt
- Exit-intent popup
- One-click social signup
- Show what they'll lose without account

### Risk Point 3: Free → Premium (70% drop)

**Why:** Price objection, unsure of value

**Mitigation:**
- 7-day free trial (auto-enrolled)
- Usage counter showing limits
- Blurred preview of premium content
- Annual discount (17% savings)
- Social proof in paywall
- Feature comparison table

### Risk Point 4: Trial → Paid (estimated 50% drop)

**Why:** Forgot, didn't use enough, price

**Mitigation:**
- Day 5 trial reminder banner
- Email reminders (Day 3, 5, 7)
- Show usage summary in trial
- Downgrade loss notification
- Easy upgrade flow (1-click)

---

## A/B Testing Opportunities

### High-Impact Tests

1. **Hero CTA Copy**
   - "Try Demo" vs "Analyze Your Product Free"
   - Expected lift: 10-20%

2. **Paywall Design**
   - Feature list vs comparison table
   - Monthly-first vs Annual-first
   - Expected lift: 15-25%

3. **Trial Duration**
   - 7 days vs 14 days
   - Expected lift: 5-15% conversion

4. **Usage Counter Visibility**
   - Always visible vs only when low
   - Expected lift: 10-20% upgrades

5. **Social Proof Placement**
   - Hero section vs above CTA
   - Expected lift: 5-10%
