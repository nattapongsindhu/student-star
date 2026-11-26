# Student Star 🌟

[![Website](https://img.shields.io/badge/Live_App-student--star.vercel.app-0052cc?style=for-the-badge&logo=vercel&logoColor=white)](https://student-star.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Canvas LMS](https://img.shields.io/badge/Canvas_LMS-REST_API-E13F2B?style=for-the-badge&logo=instructure&logoColor=white)](https://canvas.instructure.com/)
[![Vitest](https://img.shields.io/badge/Vitest-39%20Tests%20Passing-6E9F18?style=for-the-badge&logo=vitest&logoColor=white)](https://vitest.dev/)
[![Status](https://img.shields.io/badge/GPA_Target-4.00%20(Dean's_Honor_List)-0A5C36?style=for-the-badge&logo=google-scholar&logoColor=white)](#)

> **"Zero Missed Assignments → Protect an A in Every Class."**  
> *Personal Academic Command Center & Cross-Enrollment Planner for the Associate of Science in Cybersecurity at Los Angeles City College (LACCD).*

---

## 📌 Overview

**Student Star** is a private, mission-critical academic command center built specifically to eliminate grade attrition, automate course workload tracking, and protect a 4.00 GPA across intensive STEM terms (18 units / 6 courses per term).

It connects directly to the **Canvas LMS REST API (`ilearn.laccd.edu`)**, reconciles external learning platform submissions (Cengage MindTap, NetLab), and features an **All-District LACCD Professor Intel & Course Planner** covering 9 campuses to steer registration decisions away from harsh graders and GPA crushers.

🌐 **Production Deployment**: [https://student-star.vercel.app/](https://student-star.vercel.app/)

---

## 🚀 Key Capabilities & Modules

### 1. 🛡️ Deterministic Priority Risk Engine
- **Early-Warning Engine**: Scans active assignments against deadline urgency, point weights (high-value milestones $\ge 100$ pts), and Canvas submission states.
- **Triage Focus Modes**:
  - `Due in 7 days`: Live Canvas work due soon and unconfirmed.
  - `At risk`: Assignments flagged with High or Critical deadline risk.
  - `Missing / mismatch`: Overdue Canvas items plus student-submitted external work awaiting Canvas gradebook reconciliation.
- **LTI Glitch Protection (Cengage / NetLab)**: When third-party platforms fail to sync grades back to Canvas, items can be designated `USER_MARKED_SUBMITTED` ($100\%$ progress) with proof notes, properly categorized under `mismatch` rather than overdue `missing`.
- **Ghost Assignment Reconciliation**: Assignments that disappear or get unpublished by professors are marked `CANCELLED` and safely excluded from course totals, completion rates, and warnings.

### 2. ⚡ Canvas LMS Live Sync (`/sync`)
- Automated daily synchronization via **Vercel Serverless Cron** (`0 13 * * *` UTC / 6:00 AM PST).
- Interactive **Manual Sync Console** for real-time pull, change-detection diffing (new, updated, cancelled assignments), and token expiration monitoring.
- Safe token isolation: Secure server-side credential handling with zero browser exposure.

### 3. 🎓 All-District Professor Intel & Course Planner (`/professors`)
Academic defense system designed to evaluate professors across all 9 LACCD colleges (*City, East LA, Valley, Pierce, West LA, Trade-Tech, Harbor, Mission, Southwest*):
- **Live Spring 2027 Schedule Mappings**: Direct synchronization with PeopleSoft/SIS class search results:
  - `MATH 260` (Precalculus — 5 Units, 6 City options)
  - `PHYS 101` (Physics for Engineers & Scientists I — 5 Units, 10 LACCD options)
  - `CHEM 101` (General Chemistry I — 5 Units, 40 LACCD options)
  - `STAT C1000` (Introduction to Statistics — 3 Units, 17 Spring options)
  - `ENGL 102` (Academic Writing and Literature — 3 Units, 114 LACCD options)
  - `MATH 261`, `MATH 262`, `MATH 263`, `MATH 275`, `PHYS 102`
- **Rate My Professors (RMP) Deep Metrics**: Overall quality ratings, difficulty ratings, "Would take again" percentages, direct RMP profile links, and student-reported pros/cons.
- **Smart Recommendation Tiers**:
  - 🏆 **TOP_PICK**: Proven track record of high clarity, fair evaluation, open-notes exams, extra credit, or essay revision policies.
  - ⭐ **FAIR_SOLID**: Reliable instruction with equitable grading standards.
  - ⚠️ **STRICT_TOUGH**: Demanding workload, strict time constraints, or heavy self-study required.
  - 🚫 **AVOID**: Flagged GPA crushers with history of grade deflation, disorganization, or severe drop rates.
- **Collapsible UI**: Individual course cards feature collapse/expand toggles, quick top-pick tag previews when minimized, bottom quick-collapse buttons, and top batch controls (`ยุบการ์ดทั้งหมด` / `ขยายการ์ดทั้งหมด`).

### 4. 📅 Academic Multi-Term Timeline
- **Spring 2026**: Dean's Honor List completed term.
- **Summer 2026**: Perfect Summer Session (4.00 GPA).
- **Fall 2026**: Active 18-unit full-time course load:
  - `ASIAN 001` · Asian American History
  - `CIS 112` · Operating Systems Technologies
  - `CIS 162` · Cyber Security I
  - `CIS 166` · Computer Forensics I
  - `CIS 214` · Introduction to Network Security
  - `CS 119` · Programming in Python
- **Winter 2027 & Spring 2027**: Upcoming cross-enrollment terms.

---

## 🛠️ Tech Stack & Architecture

| Layer | Technology | Purpose |
|---|---|---|
| **Framework** | Next.js 16 (App Router) | Server Components (RSC), API routes, high performance |
| **UI Library** | React 19 + Lucide Icons | Reactive dashboard, modern iconography |
| **Styling** | Tailwind CSS 3.4 | Clean, accessible, high-contrast academic UI |
| **Database** | Supabase (PostgreSQL) | Course & assignment persistence, sync audit logs |
| **Integration** | Canvas LMS REST API | Live assignment, course, and announcement feeds |
| **Testing** | Vitest | Comprehensive deterministic unit test suite |
| **Deployment** | Vercel | Production edge hosting, automated daily cron jobs |

---

## 🧪 Testing & Verification

The test suite ensures zero regression in grade calculation, risk priority ordering, token handling, and course dataset integrity:

```bash
# Run unit test suite (Vitest)
npm test

# Run TypeScript typecheck
npx tsc --noEmit

# Run Next.js production build
npm run build
```

**Current Test Status**: `39 / 39 tests passing (100%)` across 8 test suites.

---

## ⚙️ Environment Variables

Create a `.env.local` file with the following variables:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Canvas LMS API (ilearn.laccd.edu)
CANVAS_ACCESS_TOKEN=your-canvas-access-token
CANVAS_COURSE_IDS=12345,67890 # Optional: comma-separated Canvas course IDs

# Sync Security
CRON_SECRET=your-cron-secret-for-scheduled-pulls
```

---

## 📂 Repository Structure

```text
student-star/
├── src/
│   ├── app/
│   │   ├── page.tsx               # Home Command Center & Focus Triage
│   │   ├── professors/            # Professor Intel & Registration Planner
│   │   ├── sync/                  # Canvas Sync Console & Change Log
│   │   ├── courses/[id]/          # Individual Course Assignment Breakdown
│   │   └── api/sync/canvas/       # Canvas API Sync Webhook Endpoint
│   ├── components/
│   │   ├── ProfessorIntelView.tsx # Collapsible Intel UI with SIS mapping
│   │   ├── AssignmentStatusActions.tsx # LTI & manual submission handler
│   │   ├── CourseDetailModal.tsx  # Course detail & outcome cards
│   │   └── WeeklySchedule.tsx     # Calendar block schedule
│   ├── lib/
│   │   ├── professor-intel.ts     # Curated RMP intelligence & SIS sections
│   │   ├── risk-engine.ts         # Priority risk calculation
│   │   ├── canvas-sync.ts         # Canvas API client & diff detector
│   │   ├── semester.ts            # Term configs & academic schedule
│   │   └── course-meta.ts         # Course code mapping & instructors
├── supabase/
│   └── migrations/                # Sequenced SQL migrations (001 to 024)
└── docs/
    └── architecture.md            # Detailed product architecture blueprint
```

---

## 📄 License & Confidentiality

Private repository for personal academic workload management and registration optimization. All rights reserved.
