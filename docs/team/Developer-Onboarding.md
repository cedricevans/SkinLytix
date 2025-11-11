# Developer Onboarding Guide

**Document Version:** 1.0  
**Last Updated:** November 11, 2025  
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
   - Team standup (9:30 AM PST daily)
   - Quick intro in #general Slack channel

2. **Verify Access**
   - [ ] Log in to GitHub - can you see the repo?
   - [ ] Log in to Lovable Cloud - can you view the project?
   - [ ] Join Slack channels:
     - #general (company-wide)
     - #engineering (team discussions)
     - #frontend (frontend-specific)
     - #backend (backend-specific)
     - #qa-testing (QA coordination)
     - #incidents (incident alerts)
     - #random (non-work chat)

**Afternoon: Environment Setup (3-4 hours)**

Follow the [Engineering SOPs - Local Development Setup](../technical/Engineering-SOPs.md#local-development-setup) guide:

1. **Install Prerequisites**
   ```bash
   # Check versions
   node --version  # Should be 18+
   bun --version   # Should be 1.0+
   git --version   # Should be 2.30+
   ```

2. **Clone Repository**
   ```bash
   git clone https://github.com/skinlytix/skinlytix-app.git
   cd skinlytix-app
   ```

3. **Install Dependencies**
   ```bash
   bun install
   ```

4. **Start Development Server**
   ```bash
   bun run dev
   ```

5. **Verify It Works**
   - Open http://localhost:8080
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
│   │   ├── Hero.tsx         # Landing page hero
│   │   ├── Navigation.tsx   # Top nav bar
│   │   └── ...
│   ├── pages/               # Route pages
│   │   ├── Index.tsx        # Landing page
│   │   ├── Auth.tsx         # Login/signup
│   │   ├── Upload.tsx       # Product upload
│   │   ├── Analysis.tsx     # Analysis results
│   │   └── Analytics.tsx    # Admin dashboard
│   ├── hooks/               # Custom React hooks
│   │   ├── useTracking.ts   # Event tracking
│   │   └── useAnalytics.ts  # Analytics data
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
│   │   ├── optimize-routine/# Routine optimization
│   │   └── ...
│   ├── migrations/          # Database migrations
│   └── config.toml          # Supabase config (auto-generated)
├── docs/                    # Documentation
│   ├── business/            # PRD, MVP, Scaling
│   ├── technical/           # Technical docs
│   ├── operations/          # Runbooks
│   └── team/                # Team guides (you are here!)
├── public/                  # Static assets
└── tailwind.config.ts       # Tailwind configuration
```

**Key Files to Understand:**

| File | Purpose | When to Edit |
|------|---------|--------------|
| `src/index.css` | Design system tokens (colors, fonts) | Changing app theme |
| `src/App.tsx` | Routing configuration | Adding new pages |
| `src/components/ProtectedRoute.tsx` | Admin access control | Changing auth logic |
| `src/hooks/useTracking.ts` | Analytics event tracking | Adding new events |
| `supabase/functions/analyze-product/` | Core AI analysis logic | Improving analysis |
| `tailwind.config.ts` | Tailwind theme extension | Adding design tokens |

**Afternoon: Read Documentation (3 hours)**

Must-read documentation (in this order):

1. **[MVP Document](../business/MVP.md)** (45 min)
   - What are we building and why?
   - What features are in scope?
   - Success metrics

2. **[Technical Stack & Setup](../technical/Technical-Stack-Setup.md)** (1 hour)
   - Architecture overview
   - Technology choices
   - Database schema

3. **[User Flows](../product/User-Flows.md)** (30 min)
   - How users interact with the product
   - Conversion funnels
   - Psychological insights

4. **[Engineering SOPs](../technical/Engineering-SOPs.md)** (45 min)
   - Git workflow
   - Code review process
   - Deployment process

**End of Day 2:**
- [ ] Post 3 questions you have in #engineering
- [ ] Update your Slack status: "Onboarding - Day 2 ✅"

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
   - Add a small utility function

**Afternoon: Implement & Submit PR (3-4 hours)**

1. **Create Feature Branch**
   ```bash
   git checkout main
   git pull origin main
   git checkout -b fix/your-issue-description
   ```

2. **Make Your Changes**
   - Edit the file(s)
   - Test locally (`bun run dev`)
   - Verify no console errors

3. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "fix: update error message for OCR failure"
   git push origin fix/your-issue-description
   ```

4. **Open Pull Request**
   - Go to GitHub repository
   - Click "Compare & pull request"
   - Fill out PR template (see [Engineering SOPs](../technical/Engineering-SOPs.md#pull-request-process))
   - Request review from your manager or senior engineer

**End of Day 3:**
- [ ] PR submitted for review
- [ ] Celebrate in #engineering: "First PR is up! 🎉"

---

### Day 4: Code Review & Iteration

**Morning: Respond to PR Feedback (2-3 hours)**

1. **Review Feedback**
   - Your reviewer will leave comments on your PR
   - Read each comment carefully
   - Ask questions if anything is unclear

2. **Make Requested Changes**
   ```bash
   # Make edits
   git add .
   git commit -m "fix: address PR feedback - improve error handling"
   git push origin fix/your-issue-description
   ```

3. **Re-Request Review**
   - Comment on PR: "Updated! Ready for another look"
   - Tag reviewer

**Afternoon: Learn by Reviewing Others' PRs (2 hours)**

1. **Find Recent Merged PRs**
   - GitHub → Pull Requests → Closed (merged)
   - Read through 3-5 recent PRs

2. **Understand What Good PRs Look Like**
   - Clear title and description
   - Small, focused changes (<300 lines ideally)
   - Tests included (if applicable)
   - No unrelated changes

3. **Shadow a Code Review** (if possible)
   - Ask a senior engineer if you can observe their next code review
   - Take notes on what they look for

**End of Day 4:**
- [ ] PR approved and merged (hopefully!)
- [ ] If not merged yet, that's okay - continue iterating

---

### Day 5: Ship It! + Codebase Exploration

**Morning: Merge Your First PR (1 hour)**

1. **Final Approval**
   - Once approved, merge your PR (squash and merge)
   - Delete your feature branch

2. **Celebrate!**
   - Post in #engineering: "First PR merged! 🚀"
   - You're now officially a SkinLytix contributor

3. **Verify in Staging**
   - Wait 5 minutes for staging to deploy
   - Check staging.skinlytix.lovable.app
   - Verify your change is live

**Afternoon: Exploratory Coding (3 hours)**

Pick one area to explore deeply:

**Option A: Frontend Deep Dive**
- Open `src/pages/Analysis.tsx`
- Trace the data flow from upload → OCR → AI analysis → results
- Modify the UI (change colors, layout) just to see what happens
- Revert changes (don't commit experimental code)

**Option B: Backend Deep Dive**
- Open `supabase/functions/analyze-product/index.ts`
- Read the entire function
- Understand how AI analysis works
- Check Lovable Cloud → Functions → Logs to see live invocations

**Option C: Database Deep Dive**
- Open `src/integrations/supabase/types.ts`
- Study the database schema
- Write a test query in Lovable Cloud → Database → SQL Editor:
  ```sql
  SELECT product_name, epiq_score
  FROM user_analyses
  ORDER BY epiq_score DESC
  LIMIT 10;
  ```

**End of Week 1:**
- [ ] Reflection: Write down 3 things you learned and 3 questions you still have
- [ ] Share in #engineering for discussion

---

## Week 2: Domain Knowledge Deep Dive

### Goal: Understand Skincare Ingredients & EpiQ Score

**By end of Week 2, you should:**
- Understand basic skincare ingredient science
- Know how the EpiQ Score algorithm works
- Understand user personas and use cases

### Day 6-7: Skincare Ingredient Crash Course

**Self-Study Resources (4-6 hours total):**

1. **Ingredient Basics**
   - Read: [Paula's Choice Ingredient Dictionary](https://www.paulaschoice.com/ingredient-dictionary)
   - Focus on: Common actives (niacinamide, retinol, hyaluronic acid)
   - Understand: Comedogenicity, pH, penetration

2. **Regulatory Background**
   - Read: [INCI Nomenclature Basics](https://www.cosmeticsinfo.org/inci-nomenclature-faqs)
   - Understand: Why ingredients have scientific names
   - Example: "Vitamin E" = "Tocopherol" or "Tocopheryl Acetate"

3. **Product Analysis Example**
   - Pick a real product (e.g., CeraVe Moisturizing Cream)
   - Look up ingredients on Paula's Choice
   - Analyze in SkinLytix (staging environment)
   - Compare AI analysis to your understanding

**Practical Exercise:**

Analyze 3 products and document your findings:

| Product | Key Actives | Red Flags | Your Expected Score | AI Score | Difference |
|---------|-------------|-----------|---------------------|----------|------------|
| Product 1 | | | | | |
| Product 2 | | | | | |
| Product 3 | | | | | |

Share your findings in #engineering - "Here's what I learned about ingredients this week..."

---

### Day 8-9: EpiQ Score Algorithm Deep Dive

**Study the Algorithm (3-4 hours):**

1. **Read the Analysis Function**
   - Open `supabase/functions/analyze-product/index.ts`
   - Read the AI prompt carefully
   - Understand scoring criteria

2. **EpiQ Score Components**
   ```
   EpiQ Score (0-100) considers:
   1. Ingredient quality (30%)
      - Evidence-backed actives
      - Appropriate concentrations
      - Effective delivery systems
   
   2. Skin compatibility (25%)
      - Match to user's skin type
      - Allergen/irritant presence
      - pH compatibility
   
   3. Formulation transparency (20%)
      - Clear ingredient listing
      - No greenwashing
      - Claims backed by ingredients
   
   4. Safety profile (15%)
      - No harmful ingredients
      - Proper preservatives
      - Stable formulation
   
   5. Value proposition (10%)
      - Price vs. benefit
      - Redundancy check
      - Better alternatives available
   ```

3. **Test Score Consistency**
   - Run the same product through analysis 3 times
   - Scores should be within ±5 points
   - If high variance, investigate why

**Improvement Exercise:**

Think about how to improve the EpiQ Score:
- What factors are missing?
- What factors are weighted incorrectly?
- How could we make it more accurate?

Write a proposal doc and share in #engineering (optional, but good practice!)

---

### Day 10: User Personas & Use Cases

**Study Our Users (2-3 hours):**

1. **Read User Personas** (in [PRD](../business/PRD.md#user-personas))
   - Skincare Enthusiast (Emma, 24)
   - Concerned Consumer (Michael, 35)
   - Professional Esthetician (Dr. Sarah Chen, 42)

2. **Read Beta Feedback**
   - Check #feedback Slack channel
   - Read recent feedback in database:
     ```sql
     SELECT feedback_type, message, rating, created_at
     FROM feedback
     ORDER BY created_at DESC
     LIMIT 20;
     ```
   - Identify patterns: What do users love? What confuses them?

3. **User Journey Exercise**
   - Map out Emma's journey:
     1. Discovers SkinLytix on Instagram
     2. Tries demo analysis
     3. Signs up
     4. Uploads first product
     5. Views analysis results
     6. Creates routine
     7. Optimizes routine
   - At each step: What's her goal? What could go wrong?

**End of Week 2:**
- [ ] Write a summary: "My understanding of SkinLytix users"
- [ ] Share 1 idea for improving the user experience

---

## Week 3: Feature Development

### Goal: Build a Small Feature End-to-End

**Your manager will assign you a small feature to build. Example features:**
- Add a "Share Analysis" button that generates a shareable link
- Implement a "Favorite Products" feature
- Add a "Compare 2 Products" side-by-side view
- Build a "Routine Cost Calculator" widget

### Day 11-12: Feature Planning & Design

**Planning Process (4-6 hours):**

1. **Understand Requirements**
   - Meet with Product Manager (or your manager)
   - Ask clarifying questions:
     - What's the user problem we're solving?
     - What's the expected behavior?
     - What's out of scope?
     - What's the success metric?

2. **Design Technical Approach**
   - [ ] Database changes needed? (new tables, columns)
   - [ ] Frontend components needed? (new pages, components)
   - [ ] Backend changes needed? (edge functions, APIs)
   - [ ] Third-party integrations needed?

3. **Write Technical Design Doc**
   ```markdown
   # Feature: [Name]
   
   ## Problem
   [What user problem are we solving?]
   
   ## Solution
   [High-level approach]
   
   ## Technical Design
   
   ### Frontend
   - New components: [List]
   - Modified components: [List]
   - New pages/routes: [List]
   
   ### Backend
   - New edge functions: [List]
   - Database changes: [List]
   - External APIs: [List]
   
   ### Data Flow
   [Diagram or description of data flow]
   
   ## Testing Plan
   - [ ] Unit tests
   - [ ] Integration tests
   - [ ] Manual testing checklist
   
   ## Rollout Plan
   - Deploy to staging
   - QA testing
   - Beta user feedback
   - Deploy to production
   ```

4. **Get Feedback on Design**
   - Share design doc in #engineering
   - Schedule 30-min review with senior engineer
   - Incorporate feedback before coding

---

### Day 13-14: Implementation

**Coding Time! (8-12 hours)**

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Start with Backend (if needed)**
   - Create database migration (if needed)
   - Create or modify edge function
   - Test edge function locally

3. **Build Frontend**
   - Create new components
   - Integrate with backend
   - Style with design system tokens

4. **Test as You Go**
   - Manual testing after each component
   - Check console for errors
   - Test edge cases

5. **Commit Frequently**
   ```bash
   git add .
   git commit -m "feat(feature-name): implement X component"
   ```

**Tips:**
- Don't try to build everything at once - break it down
- Ask for help when stuck (post in #engineering)
- Pair program with senior engineer if available

---

### Day 15: Testing & PR Submission

**Morning: Testing (2-3 hours)**

1. **Self QA**
   - Follow [QA Testing SOPs](../quality/QA-Testing-SOPs.md#regression-testing)
   - Test all user flows affected by your feature
   - Test on different screen sizes
   - Test edge cases

2. **Write Tests** (if applicable)
   ```typescript
   // Example unit test
   import { describe, it, expect } from 'vitest';
   import { calculateRoutineCost } from './utils';
   
   describe('calculateRoutineCost', () => {
     it('sums product prices correctly', () => {
       const products = [
         { price: 29.99 },
         { price: 15.50 },
         { price: 42.00 }
       ];
       expect(calculateRoutineCost(products)).toBe(87.49);
     });
   });
   ```

**Afternoon: PR Submission (2 hours)**

1. **Create Pull Request**
   - Follow [PR template](../technical/Engineering-SOPs.md#pull-request-process)
   - Add before/after screenshots if UI changes
   - Link to design doc
   - Request review from 2 people (1 senior + 1 peer)

2. **Demo Your Feature**
   - Record a quick Loom video showing your feature
   - Share in #engineering: "New feature ready for review! [Loom link]"

**End of Week 3:**
- [ ] Feature PR submitted
- [ ] Feeling confident about your development workflow
- [ ] Ask for feedback: "How can I improve my code quality?"

---

## Week 4: Independence & Ownership

### Goal: Take Full Ownership of a Feature

**By end of Week 4, you should:**
- Work independently on features
- Participate actively in code reviews
- Help with incident response (if any occur)

### Day 16-18: Feature Iteration & Shipping

**Code Review & Iteration:**

1. **Respond to PR Feedback**
   - Address all comments
   - Ask questions if feedback is unclear
   - Make changes promptly

2. **Get Approval & Merge**
   - Once approved, merge to main
   - Verify deployment to staging
   - Perform smoke test in staging

3. **QA Approval**
   - Work with QA team to test in staging
   - Fix any issues found
   - Get QA sign-off

4. **Ship to Production**
   - Coordinate with team on deploy timing
   - Monitor after deployment
   - Celebrate! 🎉

---

### Day 19: Participate in Code Review

**Review 2-3 PRs from teammates:**

1. **Read Code Carefully**
   - Understand what the PR is trying to achieve
   - Check if implementation matches description
   - Look for edge cases not handled

2. **Leave Constructive Feedback**
   - Use code review checklist from [Engineering SOPs](../technical/Engineering-SOPs.md#code-review-checklist)
   - Be specific: Point to exact lines
   - Suggest solutions, not just problems
   - Acknowledge good code too!

3. **Approve or Request Changes**
   - If looks good: Approve ✅
   - If issues found: Request changes and explain why

**Goal:** By end of Month 1, you should be doing regular code reviews.

---

### Day 20: Reflection & Planning

**End of Month 1 Reflection:**

1. **Self-Assessment**
   - What went well this month?
   - What was challenging?
   - What do you want to learn next?

2. **1:1 with Manager**
   - Discuss your progress
   - Get feedback on your work
   - Set goals for Month 2

3. **Update Personal OKRs** (if applicable)
   - Technical skills to develop
   - Features to ship
   - Impact to make

**End of Week 4:**
- [ ] You've shipped 2+ features
- [ ] You're comfortable with the codebase
- [ ] You're ready to take on bigger challenges
- [ ] Celebrate your first month! 🎉🎉🎉

---

## Key Resources

### Documentation

| Resource | Link | When to Use |
|----------|------|-------------|
| **PRD** | [docs/business/PRD.md](../business/PRD.md) | Understanding product vision |
| **MVP** | [docs/business/MVP.md](../business/MVP.md) | Current feature scope |
| **Technical Stack** | [docs/technical/Technical-Stack-Setup.md](../technical/Technical-Stack-Setup.md) | Architecture questions |
| **User Flows** | [docs/product/User-Flows.md](../product/User-Flows.md) | Understanding user journeys |
| **API Docs** | [docs/technical/API-Documentation.md](../technical/API-Documentation.md) | Backend integration |
| **Engineering SOPs** | [docs/technical/Engineering-SOPs.md](../technical/Engineering-SOPs.md) | Development workflow |
| **QA SOPs** | [docs/quality/QA-Testing-SOPs.md](../quality/QA-Testing-SOPs.md) | Testing procedures |
| **Deployment Runbook** | [docs/operations/Deployment-Runbook.md](../operations/Deployment-Runbook.md) | Deploying to production |

### External Resources

| Resource | Purpose |
|----------|---------|
| [React 18 Docs](https://react.dev) | React fundamentals |
| [TypeScript Handbook](https://www.typescriptlang.org/docs/) | TypeScript features |
| [Tailwind CSS Docs](https://tailwindcss.com/docs) | Styling components |
| [Supabase Docs](https://supabase.com/docs) | Backend features |
| [Tanstack Query Docs](https://tanstack.com/query) | Data fetching |
| [Shadcn UI](https://ui.shadcn.com) | UI component library |

### Tools

| Tool | Access | Purpose |
|------|--------|---------|
| **GitHub** | github.com/skinlytix | Code repository |
| **Lovable Cloud** | lovable.app | Backend dashboard |
| **Slack** | skinlytix.slack.com | Team communication |
| **Notion** | notion.so/skinlytix | Documentation + roadmap |
| **Figma** | figma.com (if applicable) | Design system |

---

## Learning Checklist

### Technical Skills

By end of Month 1, you should understand:

**Frontend:**
- [ ] React hooks (useState, useEffect, useQuery)
- [ ] React Router (routing, navigation)
- [ ] Tailwind CSS (utility classes, design tokens)
- [ ] Shadcn UI components (customization, variants)
- [ ] Form handling with React Hook Form
- [ ] TypeScript basics (types, interfaces, generics)

**Backend:**
- [ ] Supabase client usage
- [ ] Edge functions (Deno runtime)
- [ ] RLS policies (Row-Level Security)
- [ ] Database queries (select, insert, update, delete)
- [ ] Authentication flows (signup, login, JWT)

**Development Tools:**
- [ ] Git workflow (branching, commits, PRs)
- [ ] VS Code (debugging, extensions)
- [ ] Browser DevTools (console, network, React DevTools)
- [ ] Lovable Cloud dashboard (functions, database, logs)

### Domain Knowledge

- [ ] Skincare ingredient basics (common actives, irritants, allergens)
- [ ] INCI nomenclature (how ingredients are named)
- [ ] EpiQ Score algorithm (scoring criteria, weights)
- [ ] User personas (who uses SkinLytix and why)
- [ ] Product strategy (freemium model, growth tactics)

### Process Knowledge

- [ ] Git workflow (feature branches, PRs, code review)
- [ ] Deployment process (staging → production)
- [ ] Testing procedures (manual QA, regression testing)
- [ ] Incident response (how to handle bugs in production)
- [ ] Code review best practices (giving and receiving feedback)

---

## Team Culture & Norms

### Communication

**Slack Etiquette:**
- Use threads for discussions (keeps channels clean)
- @mention people when you need their attention
- Use emojis for quick acknowledgments (👍, ✅, 🎉)
- Status updates: Set Slack status when AFK, in meetings, etc.

**Meeting Norms:**
- Daily standup: 9:30 AM PST (15 min)
  - What did you do yesterday?
  - What are you doing today?
  - Any blockers?
- Weekly planning: Monday 2 PM PST (1 hour)
- Biweekly retro: Every other Friday 3 PM PST (1 hour)

**Asking for Help:**
- Don't struggle silently! Ask questions in Slack
- "Can someone help me understand X?" is totally fine
- Tag specific people if you know who can help
- Use `#engineering` for technical questions

### Code Quality Standards

**We Value:**
- **Clarity over cleverness** - Write code others can understand
- **Small PRs** - Easier to review, faster to merge
- **Tests** - Especially for critical functionality
- **Documentation** - Update docs when changing behavior
- **Design system consistency** - Use semantic tokens, not hardcoded colors

**Code Review Culture:**
- **Be kind** - Assume positive intent
- **Be specific** - Point to lines, suggest alternatives
- **Praise good code** - Not just critique!
- **Respond promptly** - Aim for 24-hour turnaround
- **Learn from reviews** - Both giving and receiving

### Work-Life Balance

**Working Hours:**
- Core hours: 10 AM - 4 PM PST (overlap for meetings)
- Flexible schedule otherwise
- No expectation to work nights/weekends (except on-call in future)

**Time Off:**
- Take time off when you need it!
- Update Slack status + notify team in advance
- Set Slack to "Away" when offline

**Remote Work:**
- Fully remote team
- Over-communicate in Slack/Notion
- Video on for meetings (camera optional)
- Coworking days (optional, if local)

---

## Your First Month Checklist

**Week 1:**
- [ ] Set up local development environment
- [ ] Read core documentation (MVP, Technical Stack, User Flows)
- [ ] Ship first PR (even if small!)
- [ ] Meet all team members

**Week 2:**
- [ ] Learn skincare ingredient basics
- [ ] Understand EpiQ Score algorithm
- [ ] Study user personas and feedback
- [ ] Shadow 2-3 code reviews

**Week 3:**
- [ ] Build and ship a small feature end-to-end
- [ ] Write technical design doc
- [ ] Get comfortable with testing procedures
- [ ] Participate in team meetings

**Week 4:**
- [ ] Work independently on features
- [ ] Review teammates' PRs
- [ ] Help with incident response (if needed)
- [ ] 1:1 reflection with manager

---

## Feedback & Questions

**This onboarding guide is a living document!**

If you have feedback or suggestions:
- Open a PR to improve this doc
- Share in #engineering Slack channel
- Talk to your manager

**Common questions from past new hires:**
- "How do I know if my code is good enough?" → It's good enough when it's reviewed and approved! Trust the process.
- "Should I ask questions or figure it out myself?" → Always ask! We value your time.
- "What if I break something in production?" → We have rollback procedures. Mistakes are learning opportunities.

---

## Welcome Again!

We're excited to have you on the team! SkinLytix is still early-stage, which means:

✅ **Your impact is huge** - Features you build will be used by thousands
✅ **You have ownership** - Take initiative, propose ideas, drive decisions
✅ **You'll learn fast** - Wear many hats, touch full stack
✅ **You'll shape culture** - Early team members define how we work

**Let's build something amazing together! 🚀**

---

## Document Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Nov 11, 2025 | Engineering Team | Initial comprehensive onboarding guide |

---

**For Questions:**  
Contact: Your Manager or CTO  
Slack Channel: #engineering

**Related Documentation:**
- [Engineering SOPs](../technical/Engineering-SOPs.md)
- [Technical Stack & Setup](../technical/Technical-Stack-Setup.md)
- [Team Handbook](./Team-Handbook.md) (future)

---

**End of Developer Onboarding Guide**
