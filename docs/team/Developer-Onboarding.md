# Developer Onboarding Guide

**Document Version:** 2.0  
**Last Updated:** December 31, 2025  
**Owner:** Engineering Team  
**Status:** Active

---

## Welcome to SkinLytix! 🎉

Welcome to the SkinLytix engineering team! This guide will help you get up to speed with our codebase, tools, processes, and team culture. By the end of your first month, you'll have shipped real features and be fully integrated into the team.

---

## Table of Contents

1. [Before You Start](#before-you-start)
2. [Week 1: Environment Setup & First PR](#week-1-environment-setup--first-pr)
3. [Week 2: Domain Knowledge Deep Dive](#week-2-domain-knowledge-deep-dive)
4. [Week 3: Feature Development](#week-3-feature-development)
5. [Week 4: Independence & Ownership](#week-4-independence--ownership)
6. [Key Resources](#key-resources)
7. [Learning Checklist](#learning-checklist)
8. [Team Culture & Norms](#team-culture--norms)

---

## Before You Start

### Pre-Onboarding Checklist

**Your manager should have set these up for you:**

- [ ] GitHub access to `skinlytix/skinlytix-app` repository
- [ ] Lovable Cloud access (project editor permissions)
- [ ] Slack workspace invitation
- [ ] Email account (firstname@skinlytix.com)
- [ ] Notion workspace access (documentation + roadmap)
- [ ] Calendar invites for recurring team meetings

**If anything is missing, reach out to your manager or CTO.**

### Your First Week Goals

By end of Week 1, you should:
- ✅ Have local development environment running
- ✅ Understand the codebase structure
- ✅ Ship your first PR (even if small!)
- ✅ Know your team members and their roles

---

## Week 1: Environment Setup & First PR

### Day 1: Welcome & Access Setup

**Morning: Orientation (2-3 hours)**

1. **Meet the Team**
   - 1:1 intro meeting with your manager
   - Team standup (daily)
   - Quick intro in #general Slack channel

2. **Verify Access**
   - [ ] Log in to GitHub - can you see the repo?
   - [ ] Log in to Lovable Cloud - can you view the project?
   - [ ] Join Slack channels:
     - #general (company-wide)
     - #engineering (team discussions)
     - #product (product updates)
     - #incidents (incident alerts)

**Afternoon: Environment Setup (2-3 hours)**

1. **Install Prerequisites**
   ```bash
   # Check versions
   node --version  # Should be 18+
   npm --version   # or bun --version
   git --version   # Should be 2.30+
   ```

2. **Clone Repository**
   ```bash
   git clone https://github.com/skinlytix/skinlytix-app.git
   cd skinlytix-app
   ```

3. **Install Dependencies**
   ```bash
   npm install
   # or
   bun install
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

5. **Verify It Works**
   - Open http://localhost:5173 (Vite default port)
   - Homepage should load
   - Click "Try Demo Analysis" - should work
   - Check browser console - no red errors

**End of Day 1:**
- [ ] Post in #engineering: "Day 1 complete! Environment is up and running 🚀"
- [ ] Note any setup issues you encountered (we'll improve docs based on feedback)

---

### Day 2: Codebase Tour & Documentation

**Morning: Guided Codebase Walkthrough (2 hours)**

Your manager or a senior engineer will give you a live walkthrough. Ask questions!

**Project Structure:**

```
skinlytix-app/
├── src/                      # Frontend code
│   ├── components/           # React components
│   │   ├── ui/              # Shadcn UI components
│   │   ├── paywall/         # Subscription gates
│   │   ├── subscription/    # Subscription UI
│   │   ├── analytics/       # Analytics charts
│   │   └── ...
│   ├── pages/               # Route pages
│   │   ├── Index.tsx        # Landing page
│   │   ├── Auth.tsx         # Login/signup
│   │   ├── Upload.tsx       # Product upload
│   │   ├── Analysis.tsx     # Analysis results
│   │   ├── Routine.tsx      # Routine builder
│   │   ├── Compare.tsx      # Product comparison
│   │   ├── Favorites.tsx    # Saved dupes
│   │   ├── Profile.tsx      # User settings
│   │   └── Analytics.tsx    # Admin dashboard
│   ├── hooks/               # Custom React hooks
│   │   ├── useSubscription.ts  # Subscription state
│   │   ├── useUsageLimits.ts   # Usage tracking
│   │   ├── useTracking.ts      # Event tracking
│   │   └── useAnalytics.ts     # Analytics data
│   ├── integrations/        # External integrations
│   │   └── supabase/
│   │       ├── client.ts    # Supabase client (auto-generated)
│   │       └── types.ts     # DB types (auto-generated)
│   ├── lib/                 # Utility functions
│   │   └── utils.ts
│   ├── index.css            # Global styles + design tokens
│   ├── App.tsx              # App router
│   └── main.tsx             # App entry point
├── supabase/                # Backend code
│   ├── functions/           # Edge functions
│   │   ├── analyze-product/ # Product analysis
│   │   ├── chat-skinlytix/  # SkinLytixGPT chat
│   │   ├── optimize-routine/# Routine optimization
│   │   ├── find-dupes/      # Dupe discovery
│   │   ├── extract-ingredients/ # Image extraction
│   │   ├── create-checkout/ # Stripe checkout
│   │   ├── check-subscription/ # Subscription status
│   │   ├── customer-portal/ # Stripe portal
│   │   ├── query-pubchem/   # PubChem API
│   │   └── query-open-beauty-facts/ # OBF API
│   └── config.toml          # Supabase config (auto-generated)
├── docs/                    # Documentation
│   ├── business/            # PRD, MVP, Revenue Model
│   ├── technical/           # API, Data Models, Security
│   ├── product/             # User Flows, Analytics
│   ├── operations/          # Runbooks, Incident Response
│   └── team/                # Onboarding (you are here!)
├── public/                  # Static assets
└── tailwind.config.ts       # Tailwind configuration
```

**Key Files to Understand:**

| File | Purpose | When to Edit |
|------|---------|--------------|
| `src/index.css` | Design system tokens (colors, fonts) | Changing app theme |
| `src/App.tsx` | Routing configuration | Adding new pages |
| `src/components/ProtectedRoute.tsx` | Admin access control | Changing auth logic |
| `src/hooks/useSubscription.ts` | Subscription logic | Tier access changes |
| `src/hooks/useUsageLimits.ts` | Free tier limits | Usage tracking |
| `supabase/functions/analyze-product/` | Core AI analysis | Improving analysis |
| `supabase/functions/chat-skinlytix/` | SkinLytixGPT | Chat improvements |

**Afternoon: Read Documentation (3 hours)**

Must-read documentation (in this order):

1. **[MVP Document](../business/MVP.md)** (45 min)
   - What are we building and why?
   - Current feature status
   - Success metrics

2. **[Subscription System](../technical/Subscription-System.md)** (30 min)
   - Tier structure (Free/Premium/Pro)
   - Feature gating
   - Stripe integration

3. **[API Documentation](../technical/API-Documentation.md)** (45 min)
   - Edge function reference
   - Authentication requirements
   - Request/response formats

4. **[User Flows](../product/User-Flows.md)** (30 min)
   - How users interact with the product
   - Conversion funnels
   - Drop-off mitigation

5. **[Security Best Practices](../technical/Security-Best-Practices.md)** (30 min)
   - RLS policies
   - Admin role handling
   - Input validation

---

### Day 3: First Bug Fix (Good First Issue)

**Goal:** Ship your first PR! Even a small fix counts.

**Morning: Find a Good First Issue (1 hour)**

1. **Check GitHub Issues**
   - Look for issues labeled `good-first-issue`
   - Or ask in #engineering: "Looking for a good first issue - any suggestions?"

2. **Good First Issue Examples**
   - Fix a typo in user-facing text
   - Update a component to use design system tokens
   - Add a missing loading state
   - Improve error message clarity
   - Add a tooltip or help text

**Afternoon: Implement & Submit PR (3-4 hours)**

1. **Create Feature Branch**
   ```bash
   git checkout main
   git pull origin main
   git checkout -b fix/your-issue-description
   ```

2. **Make Your Changes**
   - Edit the file(s)
   - Test locally (`npm run dev`)
   - Verify at http://localhost:5173
   - Check browser console - no errors

3. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "fix: update error message for OCR failure"
   git push origin fix/your-issue-description
   ```

4. **Open Pull Request**
   - Go to GitHub repository
   - Click "Compare & pull request"
   - Fill out PR template
   - Request review from your manager

---

## Week 2: Domain Knowledge Deep Dive

### Goal: Understand Subscription System & Core Features

**By end of Week 2, you should:**
- Understand the freemium model and tier gates
- Know how SkinLytixGPT chat works
- Understand the routine optimization flow
- Be familiar with the dupe discovery feature

### Day 6-7: Subscription & Monetization

**Self-Study (4-6 hours total):**

1. **Read Subscription System Docs**
   - [Subscription System](../technical/Subscription-System.md)
   - Study `src/hooks/useSubscription.ts`
   - Study `src/hooks/useUsageLimits.ts`

2. **Understand Feature Gating**
   ```typescript
   // How features are gated
   const FEATURE_ACCESS = {
     score_breakdown: ['premium', 'pro'],
     ai_explanation: ['premium', 'pro'],
     chat: ['free', 'premium', 'pro'],  // All, but limited
     routine_optimization: ['premium', 'pro'],
   };
   
   // Usage limits for free tier
   const FREE_LIMITS = {
     chat_messages: 3,        // per month
     routines: 1,             // total
     routine_optimizations: 0, // preview only
   };
   ```

3. **Study Paywall Components**
   - `src/components/paywall/PaywallModal.tsx`
   - `src/components/paywall/BlurredPreview.tsx`
   - `src/components/paywall/UsageCounter.tsx`

4. **Test Stripe Flow**
   - Create test account
   - Try upgrade flow
   - Use Stripe test cards
   - Verify subscription updates

### Day 8-9: SkinLytixGPT Chat Deep Dive

**Study the Chat System (3-4 hours):**

1. **Read Chat Edge Function**
   - Open `supabase/functions/chat-skinlytix/index.ts`
   - Understand streaming response (SSE)
   - Note context injection (product analysis)

2. **Study Frontend Chat Component**
   - Open `src/components/SkinLytixGPTChat.tsx`
   - Understand message persistence
   - Note usage limit enforcement

3. **Database Schema**
   ```sql
   -- chat_conversations table
   id, user_id, analysis_id, title, created_at
   
   -- chat_messages table
   id, conversation_id, role, content, metadata
   ```

4. **Test Chat Feature**
   - Analyze a product
   - Open chat
   - Ask questions
   - Observe streaming behavior

### Day 10: Routine & Dupe Features

**Study Additional Features (3-4 hours):**

1. **Routine Optimization**
   - Read `supabase/functions/optimize-routine/index.ts`
   - Study `src/pages/RoutineOptimization.tsx`
   - Understand AI output structure

2. **Dupe Discovery**
   - Read `supabase/functions/find-dupes/index.ts`
   - Study `src/components/DupeCard.tsx`
   - Understand similarity scoring

3. **Test Both Features**
   - Create routine with 3+ products
   - Run optimization
   - Find dupes for analyzed product
   - Save dupe to favorites

---

## Week 3: Feature Development

### Goal: Build a Small Feature End-to-End

**Your manager will assign you a small feature. Examples:**
- Add "Share Analysis" button
- Implement routine export
- Add ingredient search
- Build comparison history

### Day 11-12: Feature Planning

1. **Understand Requirements**
   - Meet with Product Manager
   - Define acceptance criteria
   - Identify edge cases

2. **Technical Design**
   - Database changes needed?
   - New edge function?
   - Frontend components?
   - Which subscription tier?

3. **Create Implementation Plan**
   - Break into tasks
   - Estimate effort
   - Identify dependencies

### Day 13-14: Implementation

1. **Backend First** (if applicable)
   - Create database migration
   - Implement edge function
   - Test with curl/Postman

2. **Frontend Implementation**
   - Build UI components
   - Integrate with backend
   - Add loading/error states
   - Implement subscription gates

3. **Testing**
   - Test happy path
   - Test error cases
   - Test on mobile
   - Test with free/premium accounts

### Day 15: Polish & Deploy

1. **Code Review**
   - Submit PR
   - Address feedback
   - Get approval

2. **Documentation**
   - Update relevant docs
   - Add code comments
   - Update changelog

3. **Deploy & Verify**
   - Merge to main
   - Verify in staging
   - Monitor for errors

---

## Week 4: Independence & Ownership

### Goal: Own a Feature Area

By Week 4, you should:
- Work independently on features
- Review others' PRs
- Contribute to technical decisions
- Help onboard future developers

### Responsibilities

1. **Feature Ownership**
   - Pick an area to own
   - Maintain documentation
   - Be the go-to person

2. **Code Review**
   - Review 2+ PRs per week
   - Provide constructive feedback
   - Learn from others' code

3. **Process Improvement**
   - Identify friction points
   - Suggest improvements
   - Update documentation

---

## Key Resources

### Documentation

| Document | Purpose |
|----------|---------|
| [MVP](../business/MVP.md) | Current feature scope |
| [PRD](../business/PRD.md) | Product requirements |
| [API Docs](../technical/API-Documentation.md) | Edge function reference |
| [Data Models](../technical/Data-Models.md) | Database schema |
| [Subscription System](../technical/Subscription-System.md) | Tier & gating |
| [Security](../technical/Security-Best-Practices.md) | Security practices |
| [User Flows](../product/User-Flows.md) | User journeys |
| [Analytics](../product/Analytics-Implementation.md) | Event tracking |

### Quick Reference

| Task | Command |
|------|---------|
| Start dev server | `npm run dev` |
| Build production | `npm run build` |
| Run tests | `npm run test` |
| Check types | `npx tsc --noEmit` |
| Lint code | `npm run lint` |

### Environment

| URL | Purpose |
|-----|---------|
| http://localhost:5173 | Local development |
| staging.skinlytix.lovable.app | Staging environment |
| skinlytix.com | Production |

---

## Learning Checklist

### Week 1
- [ ] Development environment running
- [ ] Understand project structure
- [ ] Read MVP and PRD documents
- [ ] Submit first PR
- [ ] Join all Slack channels

### Week 2
- [ ] Understand subscription tiers
- [ ] Study feature gating
- [ ] Test SkinLytixGPT chat
- [ ] Understand routine optimization
- [ ] Test dupe discovery

### Week 3
- [ ] Complete assigned feature
- [ ] Write tests
- [ ] Update documentation
- [ ] Get PR merged

### Week 4
- [ ] Review others' PRs
- [ ] Own a feature area
- [ ] Contribute to discussions
- [ ] Help improve processes

---

## Team Culture & Norms

### Communication

- **Async by default**: Use Slack threads, document decisions
- **Over-communicate**: Better to share too much than too little
- **Ask questions**: No question is dumb, especially during onboarding
- **Weekly syncs**: Team standup, 1:1 with manager

### Code Standards

- **Small PRs**: Aim for <300 lines changed
- **Clear commits**: Use conventional commits (`feat:`, `fix:`, `docs:`)
- **Test locally**: Always test before pushing
- **Document changes**: Update docs alongside code

### Decision Making

- **ADRs**: Document architectural decisions
- **RFC process**: Propose major changes in docs
- **Consensus**: Discuss in Slack, decide in meetings
- **Ownership**: Feature owner has final say

### Work-Life Balance

- **Sustainable pace**: 40-hour weeks
- **Flexible hours**: Core hours 10am-3pm
- **PTO encouraged**: Take time off
- **No weekend work**: Unless incident

---

Welcome aboard! 🚀
