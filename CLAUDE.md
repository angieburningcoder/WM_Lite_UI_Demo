# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.

## Project Overview

Watchmen Lite Demo: A frontend MVP for a social media impersonation monitoring platform. Helps individuals and brands detect and manage fake/impersonated accounts on Instagram, Facebook, and Threads. Core positioning is "de-risk and de-fear" — not just alerting users but actively supporting them through the resolution process.

This is a **demo-only frontend** with no backend. All data is hardcoded mock data.

## Running the Application

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
npm run lint
```

**Basic Auth required** (configured in `.env.local`):
- Username: `watchmen lite`
- Password: `demo 2026`

## Tech Stack

- **Next.js 15** with App Router, TypeScript strict mode
- **React 19**, Tailwind CSS v4, Recharts, Lucide React
- **Fonts**: M PLUS Rounded 1c (Japanese), Noto Sans TC (Chinese)
- No backend — all state is client-side (localStorage via `useSettings` hook)

## Architecture

### Key Files

| File | Purpose |
|------|---------|
| `src/data/types.ts` | All domain type definitions (32 types) |
| `src/data/mockData.ts` | Single source of truth for all mock data |
| `src/lib/useSettings.ts` | Custom hook for localStorage-persisted user settings |
| `src/lib/utils.ts` | Shared utilities (formatting, risk colors, clipboard) |
| `middleware.ts` | Basic Auth protection for the entire app |

### Pages (App Router)

- `/` — Landing/hero page with cosmic animation
- `/cases` — Case list; `/cases/[id]` — Case detail with timeline
- `/alerts` — Alert list; `/alerts/[id]` — Alert detail
- `/evidence/[id]` — Evidence package viewer
- `/report/weekly` — Weekly report with Recharts trend charts
- `/email/weekly` — Email template preview
- `/settings` — User settings (localStorage)
- `/onboarding` — Onboarding flow

### Domain Model

- `RiskLevel`: `'H' | 'M' | 'L'`
- `Platform`: `'Instagram' | 'Facebook' | 'Threads'`
- `CaseStatus`: `detected → scheduled → submitted → accepted → success/failed/taken_down/monitoring`
- `Case`: Main entity with evidence, timeline, recommended actions, risk assessment
- `Alert`: Notification with types (new_case, status_update, environment_change, weekly_summary)

### Design System

- **Theme**: Deep space / glassmorphism with frosted glass panels
- **Background**: `#0B0E17`
- **Accents**: Cyan `#22D3EE`, Purple `#C084FC`, Pink `#F472B6`, Blue `#60A5FA`
- **Risk colors**: Red (High), Amber (Medium), Green (Low)
- Animations: nebula pulse, float, fade-in, glow on hover

## Important Notes

- All components that use hooks or interactivity must have `'use client'` directive
- Dynamic route params in Next.js 15 App Router are Promise-based — always `await params`
- Date formatting uses `Asia/Taipei` timezone
- Mock data is the **only** data source — to add cases/alerts, edit `mockData.ts`
- Print-friendly styles use `no-print` class for hiding elements
