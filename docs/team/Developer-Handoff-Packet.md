# Developer Handoff Packet

**Document Version:** 1.0  
**Last Updated:** November 11, 2025  
**Owner:** Engineering Team  
**Status:** Active

---

## Executive Summary

**SkinLytix** is an AI-powered skincare ingredient analysis platform built with React, TypeScript, and Lovable Cloud (Supabase). This handoff packet provides everything needed to set up, deploy, and maintain the application.

**Tech Stack:**
- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, Shadcn UI
- **Backend:** Lovable Cloud (Supabase PostgreSQL + Edge Functions)
- **AI:** Lovable AI Gateway (Gemini 2.5 Flash)
- **OCR:** Tesseract.js
- **Deployment:** Lovable Cloud (auto-deploy)

**Repository:** `github.com/skinlytix/skinlytix-app`  
**Production URL:** `skinlytix.lovable.app`  
**Staging URL:** `staging.skinlytix.lovable.app`

---

## Table of Contents

1. [Repository Setup](#repository-setup)
2. [Documentation Map](#documentation-map)
3. [Quick Start Guide](#quick-start-guide)
4. [Deployment Checklist](#deployment-checklist)
5. [Key Files & Folders](#key-files--folders)
6. [Critical Access & Credentials](#critical-access--credentials)
7. [Common Tasks Quick Reference](#common-tasks-quick-reference)
8. [Support & Escalation](#support--escalation)

---

## Repository Setup

### GitHub Repository Configuration

**Repository Name:** `skinlytix-app`  
**Visibility:** Private  
**Branch Protection Rules:**

```yaml
Branch: main
- Require pull request reviews (1 approval minimum)
- Require status checks to pass
- Require branches to be up to date
- No force pushes
- No deletions

Branch: production
- Not used (Lovable handles production deploys)
```

**Repository Topics (for discoverability):**
```
skincare, ai, ingredient-analysis, react, typescript, supabase, vite, tailwind
```

### GitHub Secrets (NOT USED)

⚠️ **Important:** This project uses **Lovable Cloud** for backend and secrets management. Do NOT add secrets to GitHub Actions. All secrets are managed via Lovable Cloud dashboard.

### Commit Message Convention

**Format:** [Conventional Commits](https://www.conventionalcommits.org/)

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Code style (formatting, no logic change)
- `refactor`: Code refactoring
- `perf`: Performance improvement
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```bash
feat(analytics): add CTA performance tracking
fix(ocr): prevent memory leak in Tesseract worker
docs(readme): update setup instructions
refactor(routine): extract optimization logic to hook
```

### Branch Naming Convention

```
feature/short-description
bugfix/issue-number-description
hotfix/critical-issue-description
refactor/component-name
docs/documentation-update
```

**Examples:**
```
feature/exit-intent-popup
bugfix/123-ocr-memory-leak
hotfix/analytics-admin-check
refactor/analysis-result-component
docs/add-api-documentation
```

---

## Documentation Map

### Complete Documentation Index

All documentation is located in `docs/` directory:

```
docs/
├── README.md                          # Documentation index (start here)
├── business/
│   ├── PRD.md                        # Product Requirements Document
│   ├── MVP.md                        # MVP Scope & Features
│   └── Scaling-Strategy.md          # Growth & scaling plan
├── technical/
│   ├── Technical-Stack-Setup.md     # Architecture & setup
│   ├── Engineering-SOPs.md          # Development workflows
│   ├── API-Documentation.md         # API reference guide
│   ├── Data-Models.md               # Database schemas & JSON
│   └── Database-Migration-Guide.md  # Migration procedures
├── product/
│   ├── User-Flows.md                # User journey maps
│   └── Analytics-Implementation.md  # Event tracking guide
├── quality/
│   └── QA-Testing-SOPs.md           # Testing procedures
├── operations/
│   ├── Deployment-Runbook.md        # Deploy procedures
│   └── Incident-Response.md         # Incident handling
└── team/
    ├── Developer-Onboarding.md      # 4-week onboarding
    └── Developer-Handoff-Packet.md  # This document
```

### Documentation Reading Order for New Team Members

**Week 1 (Essential):**
1. This handoff packet (20 min)
2. `MVP.md` - What we're building (45 min)
3. `Technical-Stack-Setup.md` - Architecture (1 hour)
4. `Engineering-SOPs.md` - Development workflow (45 min)

**Week 2 (Deep Dive):**
5. `User-Flows.md` - User journeys (30 min)
6. `Data-Models.md` - Database schema (45 min)
7. `API-Documentation.md` - Edge functions (1 hour)

**As Needed (Reference):**
8. `QA-Testing-SOPs.md` - When testing
9. `Deployment-Runbook.md` - When deploying
10. `Incident-Response.md` - When issues arise
11. `Database-Migration-Guide.md` - When changing schema
12. `Analytics-Implementation.md` - When adding tracking

---

## Quick Start Guide

### Prerequisites Installation

```bash
# Check versions
node --version   # Required: 18+
bun --version    # Required: 1.0+
git --version    # Required: 2.30+

# Install Node.js (if needed)
# Visit: https://nodejs.org/

# Install Bun (if needed)
curl -fsSL https://bun.sh/install | bash

# Install Git (if needed)
# Visit: https://git-scm.com/
```

### Local Development Setup (15 minutes)

**Step 1: Clone Repository**
```bash
git clone https://github.com/skinlytix/skinlytix-app.git
cd skinlytix-app
```

**Step 2: Install Dependencies**
```bash
bun install
```

**Step 3: Environment Variables**

The `.env` file is **auto-generated** by Lovable Cloud. You should already have:
```bash
VITE_SUPABASE_URL=https://yflbjaetupvakadqjhfb.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_SUPABASE_PROJECT_ID=yflbjaetupvakadqjhfb
```

⚠️ **NEVER edit `.env` manually.** It's auto-managed by Lovable.

**Step 4: Start Development Server**
```bash
bun run dev
```

**Step 5: Verify It Works**
- Open http://localhost:8080
- Homepage should load with hero section
- Click "Try Demo Analysis" - should work
- Check browser console - no red errors

✅ **Setup complete!** You're ready to develop.

### First PR Workflow (30 minutes)

```bash
# 1. Create feature branch
git checkout main
git pull origin main
git checkout -b feature/your-feature-name

# 2. Make your changes
# ... edit files ...

# 3. Test locally
bun run dev
# Verify no console errors

# 4. Commit changes
git add .
git commit -m "feat(scope): description"

# 5. Push to GitHub
git push origin feature/your-feature-name

# 6. Open Pull Request
# Go to GitHub → Pull Requests → New PR
# Fill out PR template
# Request review from team member

# 7. Address feedback
# ... make changes based on review ...
git add .
git commit -m "fix: address PR feedback"
git push origin feature/your-feature-name

# 8. Merge once approved
# Click "Squash and merge" on GitHub

# 9. Clean up
git checkout main
git pull origin main
git branch -d feature/your-feature-name
```

---

## Deployment Checklist

### Pre-Deployment Checklist (1 day before)

**Code Quality:**
- [ ] All PRs merged to `main` branch
- [ ] Code reviewed and approved by at least 1 team member
- [ ] No `console.log` statements in production code
- [ ] TypeScript compilation succeeds with no errors
- [ ] ESLint passes with no errors
- [ ] No hardcoded environment variables or secrets

**Testing:**
- [ ] All QA regression tests passing
- [ ] Core user flows verified in staging
- [ ] Cross-browser testing complete (Chrome, Safari, Firefox)
- [ ] Mobile responsive testing complete (iOS, Android)
- [ ] Performance testing passed (Lighthouse score >90)
- [ ] No P0 or P1 bugs in staging environment

**Database:**
- [ ] Database migrations tested in staging
- [ ] RLS policies verified working
- [ ] No risky schema changes (column drops, constraint changes)
- [ ] Backup verified (auto-backup via Lovable Cloud)
- [ ] Migration rollback plan documented (if applicable)

**Documentation:**
- [ ] Release notes drafted
- [ ] Changelog updated
- [ ] Known issues documented
- [ ] User-facing changes documented for support team

**Stakeholders:**
- [ ] Product Manager approval obtained
- [ ] CTO approval obtained (for major releases)
- [ ] Customer support team briefed on changes
- [ ] Marketing team notified (if user-facing features)

**Monitoring:**
- [ ] Analytics tracking events verified
- [ ] Error tracking confirmed working
- [ ] Performance monitoring active
- [ ] Alert thresholds reviewed

### Deployment Procedure

#### Staging Deployment (Automatic)

**Trigger:** Merge to `main` branch

```bash
# Staging deploys automatically when you merge PR
git checkout main
git merge feature/new-feature
git push origin main

# Wait 3-5 minutes for deployment
# Check: staging.skinlytix.lovable.app
```

**What Gets Deployed:**
- Frontend build (React + Vite)
- Edge functions (all functions in `supabase/functions/`)
- Database migrations (if any)
- Configuration updates

**Verification:**
- [ ] Staging URL loads
- [ ] No console errors
- [ ] Demo analysis works
- [ ] Authentication works
- [ ] Product analysis completes

#### Production Deployment (Manual)

**Timing:** Weekdays 10 AM - 2 PM PST (avoid Fridays, weekends, holidays)

**Steps:**

1. **Final Verification (30 min before)**
   - [ ] Staging stable for 24+ hours
   - [ ] All stakeholder approvals obtained
   - [ ] Team notified in Slack #engineering
   - [ ] Monitoring dashboard open

2. **Deploy via Lovable**
   - Open project in Lovable
   - Click "Publish" button (top-right)
   - Review changes diff
   - Click "Update" to publish to production
   - Monitor deployment progress (2-5 minutes)

3. **Initial Verification (First 5 minutes)**
   - [ ] Homepage loads (curl check)
   - [ ] No JavaScript errors in console
   - [ ] Authentication works (test login)
   - [ ] Database queries working

4. **Comprehensive Testing (15-30 minutes)**
   - [ ] All core user flows working
   - [ ] Run Lighthouse audit (>90 score)
   - [ ] Check edge function logs for errors
   - [ ] Check database logs for issues
   - [ ] Verify analytics tracking active

5. **Post-Deployment Announcement**
   ```markdown
   🚀 **Production Deployment Complete**
   
   **Version:** [Version/Release name]
   **Deployed at:** [Timestamp]
   **Changes:**
   - [Feature 1]
   - [Bug fix 1]
   
   **Verification:** ✅ All systems operational
   **Monitoring:** Active for next 24 hours
   ```

### Rollback Procedure (If Issues Arise)

**When to Rollback:**
- Site completely down (500 errors for all users)
- Critical authentication failure
- Data corruption detected
- Security vulnerability introduced

**Rollback Steps:**

1. **Via Lovable History**
   - Open project in Lovable
   - Click project name → History
   - Find last stable version
   - Click "Restore"
   - Click "Publish" → "Update"

2. **Verify Rollback**
   - Test core user flows
   - Check error logs cleared
   - Monitor for 30 minutes

3. **Post-Rollback Communication**
   ```markdown
   🔄 **Production Rollback Executed**
   
   **Issue:** [Brief description]
   **Rolled back to:** [Version/timestamp]
   **Current Status:** Stable
   **Next Steps:** Root cause analysis + fix
   ```

**Rollback Time:** 5-10 minutes total

---

## Key Files & Folders

### Critical Files (Never Delete!)

| File | Purpose | Can Edit? |
|------|---------|-----------|
| `.env` | Environment variables | ❌ Auto-generated |
| `src/integrations/supabase/client.ts` | Supabase client | ❌ Auto-generated |
| `src/integrations/supabase/types.ts` | Database types | ❌ Auto-generated |
| `supabase/config.toml` | Supabase config | ❌ Auto-generated |
| `package.json` | Dependencies | ⚠️ Use lov-add-dependency tool |
| `tailwind.config.ts` | Tailwind theme | ✅ Yes, customize |
| `src/index.css` | Design system tokens | ✅ Yes, customize |
| `src/App.tsx` | App router | ✅ Yes, add routes |

### Project Structure

```
skinlytix-app/
├── .env                          # ❌ Auto-generated, don't edit
├── .gitignore                    # ❌ Read-only
├── package.json                  # ⚠️ Use tools to modify
├── tailwind.config.ts            # ✅ Customize design system
├── vite.config.ts                # ⚠️ Rarely needs changes
├── docs/                         # ✅ Documentation (you are here)
│   ├── README.md                 # Documentation index
│   ├── business/                 # Business docs (PRD, MVP)
│   ├── technical/                # Technical docs (APIs, SOPs)
│   ├── product/                  # Product docs (User flows)
│   ├── quality/                  # QA docs (Testing SOPs)
│   ├── operations/               # Ops docs (Deployment, Incidents)
│   └── team/                     # Team docs (Onboarding, Handoff)
├── public/                       # ✅ Static assets
│   ├── robots.txt                # SEO configuration
│   └── favicon.ico               # Site icon
├── src/                          # ✅ Frontend source code
│   ├── main.tsx                  # App entry point
│   ├── App.tsx                   # Router configuration
│   ├── index.css                 # Global styles + design tokens
│   ├── components/               # React components
│   │   ├── ui/                   # Shadcn UI components
│   │   ├── Hero.tsx              # Landing page hero
│   │   ├── Navigation.tsx        # Top navigation
│   │   ├── ProtectedRoute.tsx    # Admin access control
│   │   └── ...                   # Other components
│   ├── pages/                    # Route pages
│   │   ├── Index.tsx             # Landing page (/)
│   │   ├── Auth.tsx              # Login/signup (/auth)
│   │   ├── Upload.tsx            # Product upload (/upload)
│   │   ├── Analysis.tsx          # Analysis results (/analysis/:id)
│   │   ├── Routine.tsx           # Routine view (/routine/:id)
│   │   ├── Analytics.tsx         # Admin dashboard (/analytics)
│   │   └── ...                   # Other pages
│   ├── hooks/                    # Custom React hooks
│   │   ├── useTracking.ts        # Event tracking
│   │   ├── useAnalytics.ts       # Analytics data
│   │   └── use-toast.ts          # Toast notifications
│   ├── integrations/             # External integrations
│   │   └── supabase/             # Supabase integration
│   │       ├── client.ts         # ❌ Auto-generated
│   │       └── types.ts          # ❌ Auto-generated
│   ├── lib/                      # Utility functions
│   │   └── utils.ts              # Helper utilities
│   └── assets/                   # Images, icons
├── supabase/                     # ✅ Backend code
│   ├── functions/                # Deno Edge Functions
│   │   ├── analyze-product/      # Product analysis AI
│   │   │   └── index.ts
│   │   ├── extract-ingredients/  # OCR processing
│   │   │   └── index.ts
│   │   ├── optimize-routine/     # Routine optimization
│   │   │   └── index.ts
│   │   └── ...                   # Other functions
│   ├── migrations/               # ❌ Auto-generated SQL
│   │   └── *.sql                 # Database migrations
│   └── config.toml               # ❌ Auto-generated config
└── README.md                     # Project README
```

### Environment-Specific Files

**Local Development:**
- `.env` - Environment variables (auto-generated)
- `node_modules/` - Dependencies (run `bun install`)

**Staging:**
- Deploys automatically from `main` branch
- Same environment variables as production
- URL: `staging.skinlytix.lovable.app`

**Production:**
- Manual publish via Lovable
- Production environment variables
- URL: `skinlytix.lovable.app`

---

## Critical Access & Credentials

### Required Access for Engineers

**Accounts Needed:**
- [ ] GitHub access to `skinlytix/skinlytix-app` (write permissions)
- [ ] Lovable Cloud project access (editor role)
- [ ] Slack workspace (skinlytix.slack.com)
- [ ] Email account (firstname@skinlytix.com)
- [ ] Notion workspace (for roadmap, optional)

**How to Request Access:**
1. Contact: Your manager or CTO
2. Slack: Post in #engineering channel
3. Email: cto@skinlytix.com

### Lovable Cloud Access

**Project ID:** `yflbjaetupvakadqjhfb`  
**Dashboard:** https://lovable.app/projects/[project-id]

**Key Dashboard Sections:**
- **Cloud → Database:** View tables, run SQL queries
- **Cloud → Functions:** View edge function logs, test functions
- **Cloud → Auth:** Manage users, view auth logs
- **History:** View version history, restore previous versions
- **Publish:** Deploy to production

**Permissions:**
- **Viewer:** Read-only access (for QA, stakeholders)
- **Editor:** Full access (for engineers)
- **Admin:** Project ownership (CTO only)

### Supabase Direct Access

**URL:** https://yflbjaetupvakadqjhfb.supabase.co  
**Anon Key:** (in `.env` file)

⚠️ **Important:** Users do NOT have direct Supabase dashboard access. All backend management is through Lovable Cloud interface.

### GitHub Repository Access

**Repository:** https://github.com/skinlytix/skinlytix-app  
**Access Level:** Write access required for all engineers

**Protected Branches:**
- `main` - Requires PR approval before merge

### Secrets Management

**Location:** Lovable Cloud → Secrets

**Existing Secrets:**
- `LOVABLE_API_KEY` - AI analysis (auto-provisioned)
- `SUPABASE_URL` - Database URL (auto-provisioned)
- `SUPABASE_SERVICE_ROLE_KEY` - Admin access (auto-provisioned)

**Adding New Secrets:**
```
Tell AI: "I need to add a [SECRET_NAME] secret"
AI will trigger secret addition flow
Enter secret value in secure form
Secret available as Deno.env.get('SECRET_NAME') in edge functions
```

**Never:**
- ❌ Commit secrets to Git
- ❌ Hardcode API keys in code
- ❌ Share secrets in Slack/email
- ❌ Log secrets to console

---

## Common Tasks Quick Reference

### Adding a New Page

```bash
# 1. Create page component
src/pages/NewPage.tsx

# 2. Add route to App.tsx
<Route path="/new-page" element={<NewPage />} />

# 3. Add navigation link (if needed)
src/components/Navigation.tsx

# 4. Test locally
bun run dev
# Navigate to localhost:8080/new-page

# 5. Commit and push
git add .
git commit -m "feat(routing): add new page"
git push
```

### Adding Event Tracking

```typescript
// In your component
import { trackEvent } from '@/hooks/useTracking';

const handleAction = async () => {
  // Perform action
  await doSomething();
  
  // Track event
  await trackEvent({
    eventName: 'new_action_taken',
    eventCategory: 'engagement',
    eventProperties: {
      context: 'specific_context',
      value: someValue
    }
  });
};
```

### Creating a Database Migration

```bash
# 1. Tell Lovable AI what you need
"I need to add a column to track user's notification preferences"

# 2. AI generates migration SQL
# Review the SQL carefully

# 3. Approve migration
# Click approval button in Lovable interface

# 4. Migration executes immediately
# Affects both staging and production

# 5. Verify in Lovable Cloud
# Cloud → Database → Tables
# Check new column exists

# 6. Update application code if needed
# Update types, queries, UI
```

### Deploying a Hotfix

```bash
# 1. Get CTO approval
# Slack DM or call

# 2. Create hotfix branch
git checkout -b hotfix/critical-issue

# 3. Make minimal fix
# Edit only affected files

# 4. Test locally
bun run dev

# 5. Create PR and merge
# Tag CTO for immediate review

# 6. Wait for staging deploy
# Verify fix in staging

# 7. Publish to production
# Lovable → Publish → Update

# 8. Monitor closely
# Watch logs for 30 minutes

# 9. Document in incident report
# See Incident Response guide
```

### Checking Logs

**Edge Function Logs:**
```
Lovable Cloud → Functions → [function name] → Logs tab
Filter by time range or search term
```

**Database Logs:**
```
Lovable Cloud → Database → Logs
Filter by error severity
```

**Browser Console:**
```
Open DevTools (F12)
Console tab
Look for red errors
```

### Running Database Queries

```sql
-- Via Lovable Cloud SQL Editor:
-- Cloud → Database → SQL Editor

-- Example: View recent analyses
SELECT 
  product_name, 
  epiq_score, 
  analyzed_at 
FROM user_analyses 
ORDER BY analyzed_at DESC 
LIMIT 10;

-- Example: Count users by skin type
SELECT 
  skin_type, 
  COUNT(*) as user_count 
FROM profiles 
WHERE skin_type IS NOT NULL 
GROUP BY skin_type;
```

---

## Support & Escalation

### Engineering Team Structure

| Role | Name | Slack | Email | Responsibilities |
|------|------|-------|-------|------------------|
| **CTO** | [Name] | @cto | cto@skinlytix.com | Architecture, security, incidents |
| **Engineering Lead** | [Name] | @eng-lead | [email] | Code review, deployment, team |
| **Frontend Engineer** | [Name] | @frontend-1 | [email] | UI/UX, React components |
| **Backend Engineer** | [Name] | @backend-1 | [email] | Edge functions, database |
| **QA Lead** | [Name] | @qa-lead | [email] | Testing, quality assurance |

### Slack Channels

| Channel | Purpose |
|---------|---------|
| **#general** | Company-wide announcements |
| **#engineering** | Engineering team discussions |
| **#frontend** | Frontend-specific discussions |
| **#backend** | Backend-specific discussions |
| **#qa-testing** | QA coordination |
| **#incidents** | Incident alerts and response |
| **#analytics** | Analytics and metrics discussions |
| **#random** | Non-work chat |

### Getting Help

**Technical Questions:**
1. Check documentation first (docs/README.md)
2. Search Slack history (#engineering)
3. Ask in #engineering channel
4. Tag specific person if you know who can help
5. DM as last resort (prefer public channels)

**Stuck on a Bug:**
1. Check browser console for errors
2. Check edge function logs (Lovable Cloud)
3. Check database logs (Lovable Cloud)
4. Try to reproduce in staging
5. Ask in #engineering with:
   - What you're trying to do
   - What's happening instead
   - Error messages
   - Steps to reproduce

**Production Issue:**
1. Assess severity (P0/P1/P2/P3)
2. If P0 or P1: Page CTO immediately
3. Create incident channel (#incident-YYYYMMDD-description)
4. Follow Incident Response guide (docs/operations/Incident-Response.md)

### Escalation Matrix

```
Issue Detected
     ↓
Is it production? → No → Create bug ticket → Assign to engineer
     ↓ Yes
Is it P0/P1? → No → Create bug ticket → Notify team lead
     ↓ Yes
Page CTO + all engineers
     ↓
Create incident channel
     ↓
Follow Incident Response guide
```

**Response Time SLAs:**
- **P0 (Critical):** 15 minutes, resolve in <1 hour
- **P1 (High):** 1 hour, resolve in <4 hours
- **P2 (Medium):** 4 hours, resolve in <1 day
- **P3 (Low):** Next sprint planning

### External Support

**Lovable Cloud Support:**
- **Email:** support@lovable.dev
- **Discord:** Lovable Discord community
- **Include:** Project ID (yflbjaetupvakadqjhfb), detailed issue description, logs

**When to Contact:**
- Platform bugs or outages
- Infrastructure issues
- Database restore requests
- Feature questions

---

## Notion Setup (Optional)

### Creating Workspace

**Workspace Name:** SkinLytix Engineering

**Recommended Structure:**
```
SkinLytix Engineering Workspace
├── 🎯 Roadmap
│   ├── Q1 2025 Goals
│   ├── Current Sprint (linked database)
│   └── Backlog (linked database)
├── 📊 Dashboards
│   ├── Team Dashboard (links to key resources)
│   ├── Metrics Dashboard (analytics snapshots)
│   └── On-Call Schedule
├── 📚 Documentation
│   ├── Quick Links (links to GitHub docs)
│   ├── Runbooks (emergency procedures)
│   └── Meeting Notes (weekly sync notes)
├── 🐛 Bug Tracker (database)
│   ├── Status: Open, In Progress, Fixed, Won't Fix
│   ├── Severity: P0, P1, P2, P3
│   ├── Assignee: Team members
│   └── Sprint: Current sprint number
└── 📝 RFCs (Request for Comments)
    ├── Active RFCs (under discussion)
    ├── Approved RFCs (ready to implement)
    └── Archived RFCs (completed or rejected)
```

### Linking Documentation

**Option 1: Embed GitHub Docs**
```markdown
[Technical Stack](https://github.com/skinlytix/skinlytix-app/blob/main/docs/technical/Technical-Stack-Setup.md)
[Engineering SOPs](https://github.com/skinlytix/skinlytix-app/blob/main/docs/technical/Engineering-SOPs.md)
```

**Option 2: Import Markdown to Notion**
- Copy markdown content from GitHub
- Paste into Notion page
- Notion auto-converts formatting

**Recommendation:** Keep GitHub as source of truth, Notion for quick access and project management.

---

## Maintenance Checklist

### Daily

- [ ] Check Slack for incidents or alerts
- [ ] Review open PRs and provide feedback
- [ ] Monitor staging deployment success

### Weekly

- [ ] Review analytics dashboard (admin users)
- [ ] Check error rate trends in logs
- [ ] Update roadmap based on progress
- [ ] Triage new bug reports

### Monthly

- [ ] Review and update documentation
- [ ] Analyze performance metrics (Lighthouse)
- [ ] Review security scan results
- [ ] Dependency updates (check for vulnerabilities)
- [ ] Team retrospective and feedback

### Quarterly

- [ ] Major documentation review and updates
- [ ] Infrastructure cost review
- [ ] Team skills assessment and training plan
- [ ] Long-term roadmap planning

---

## Frequently Asked Questions

### How do I get access to the project?

Contact your manager or CTO. You'll need:
- GitHub repository access
- Lovable Cloud project access
- Slack workspace invitation

### Where are environment variables stored?

`.env` file in project root. It's **auto-generated** by Lovable Cloud. Never edit manually.

### How do I add a new npm package?

**Don't edit `package.json` manually!** Use Lovable AI:
```
"I need to add [package-name] to the project"
```
Or use the add-dependency tool if available.

### How do I deploy to production?

1. Merge changes to `main` (auto-deploys to staging)
2. Verify in staging for 24 hours
3. Get approvals (PM + CTO)
4. Lovable → Publish → Update

See full checklist in [Deployment Checklist](#deployment-checklist).

### What if I accidentally break production?

1. Don't panic!
2. Assess severity (is it P0?)
3. If P0: Page CTO immediately
4. Consider rollback (Lovable History → Restore)
5. Follow Incident Response guide

### How do I add a new edge function?

```typescript
// 1. Tell Lovable AI
"I need to create an edge function that [does X]"

// 2. AI creates function in supabase/functions/

// 3. Test locally and in staging

// 4. Auto-deploys with next merge to main
```

### How do I change the database schema?

Use the database migration tool via Lovable AI:
```
"I need to add a column to [table] to store [data]"
```
See [Database Migration Guide](../technical/Database-Migration-Guide.md) for details.

### Where do I report bugs?

1. Check if bug already reported (GitHub Issues or Notion)
2. If new, create GitHub Issue with template
3. Tag with severity label (P0/P1/P2/P3)
4. Notify team in #engineering Slack

### How do I access the analytics dashboard?

Navigate to `/analytics` (requires admin role). Non-admin users are redirected to homepage.

### Can I edit `.env`, `client.ts`, or `types.ts`?

**No.** These files are auto-generated by Lovable Cloud. Any manual edits will be overwritten.

### How do I test edge functions locally?

Edge functions can't be tested locally. Use staging environment:
1. Deploy to staging (merge to `main`)
2. Test via staging URL
3. Check logs in Lovable Cloud → Functions

### What if Lovable Cloud is down?

1. Check https://status.lovable.dev
2. If confirmed outage, notify team in Slack
3. Wait for resolution (no manual workaround available)
4. Contact support@lovable.dev if critical

---

## Additional Resources

### External Documentation

| Resource | URL | Purpose |
|----------|-----|---------|
| **React Docs** | https://react.dev | React 18 reference |
| **TypeScript Handbook** | https://www.typescriptlang.org/docs/ | TypeScript features |
| **Tailwind CSS** | https://tailwindcss.com/docs | Styling utility classes |
| **Supabase Docs** | https://supabase.com/docs | Backend features |
| **Lovable Docs** | https://docs.lovable.dev | Platform documentation |
| **Shadcn UI** | https://ui.shadcn.com | UI component library |
| **Tanstack Query** | https://tanstack.com/query | Data fetching |

### Learning Resources

**For Frontend:**
- React 18 crash course (YouTube)
- TypeScript fundamentals (TypeScript Handbook)
- Tailwind CSS tutorial (Tailwind Labs)

**For Backend:**
- Supabase tutorial series (Supabase YouTube)
- Deno runtime docs (deno.land)
- PostgreSQL basics (PostgreSQL Tutorial)

**For Skincare Domain:**
- Paula's Choice Ingredient Dictionary
- INCI nomenclature basics (cosmeticsinfo.org)
- Skincare subreddit (r/SkincareAddiction)

---

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Nov 11, 2025 | Engineering Team | Initial comprehensive developer handoff packet |

---

## Final Checklist

Before considering handoff complete, verify:

**Documentation:**
- [ ] All 10+ documentation files reviewed and accessible
- [ ] Documentation index (docs/README.md) updated
- [ ] This handoff packet reviewed by team

**Access:**
- [ ] GitHub repository access granted
- [ ] Lovable Cloud project access granted
- [ ] Slack workspace invitation sent
- [ ] Email account created (if applicable)

**Setup:**
- [ ] Local development environment working
- [ ] Can deploy to staging successfully
- [ ] Can view edge function logs
- [ ] Can run database queries

**Knowledge Transfer:**
- [ ] Walkthrough of codebase completed
- [ ] Key architectural decisions explained
- [ ] Known issues and workarounds documented
- [ ] Contact list for questions provided

**Handoff Meeting:**
- [ ] 1-hour handoff meeting scheduled
- [ ] Screen share of local environment
- [ ] Demonstration of deployment process
- [ ] Q&A session completed

---

**For Questions or Updates:**  
Contact: CTO or Engineering Lead  
Slack Channel: #engineering  
Email: cto@skinlytix.com

---

**🎉 Welcome to the SkinLytix engineering team!**

This handoff packet is your starting point. Refer to the detailed documentation in `docs/` for deep dives into specific topics. Don't hesitate to ask questions in Slack - we're here to help you succeed!

---

**End of Developer Handoff Packet**
