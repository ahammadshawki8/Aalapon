# Aalapon (আলাপন)

**Every conversation is a chance to care.**

Aalapon is an AI companion that calls elderly parents every day in Bangla, listens, remembers, and turns what they say into help. It works over a normal phone call, so even a button phone is enough. Families get short wellbeing updates and approve actions from their own app.

Built for Grameenphone FutureMakers 2026, theme "AI for Social Good", category Healthcare & Mental Wellbeing.

---

## The problem

Elderly parents in Bangladesh increasingly live alone while their children work in other cities or abroad. When a child calls, the parent says "আমি ভালো আছি" (I'm fine) so as not to be a burden. Small signals like poor sleep, a skipped medicine, or running out of groceries go unnoticed until they become a crisis.

- About 1 in 4 older adults worldwide experience social isolation ([WHO, 2025](https://www.who.int/news/item/30-06-2025-social-connection-linked-to-improved-heath-and-reduced-risk-of-early-death)).
- Bangladesh has around 12.3 million people aged 65 or older ([UNFPA World Population Dashboard](https://www.unfpa.org/data/world-population/BD)).
- Among Bangladeshi older adults, living alone roughly doubles the odds of loneliness ([PMC9635750](https://pmc.ncbi.nlm.nih.gov/articles/PMC9635750/)).

## How it works

1. **Calls.** Aalapon calls the elder at a set time every day. It is a normal voice call, so it works on any phone.
2. **Talks.** It speaks natural Bangla, remembers past calls, and asks follow-up questions: "মা, সকালের ওষুধটা খেয়েছেন?"
3. **Understands.** It picks out needs (medicine, food, doctor, a call from family), medicine adherence, mood, sleep, and pain mentions.
4. **Reads the watch (optional).** Heart rate, SpO2, sleep and steps from a smartwatch add context to the conversation and to alerts.
5. **Acts.** Agents handle requests. Some run on their own (reorder groceries), some wait for a caregiver's approval (medicine refill, doctor booking). If no agent exists for a new kind of request, the admin is asked to approve creating one.
6. **Tells the family.** Caregivers get updates like: "Your mother mentioned poor sleep three times this week. Consider checking in."

## Two apps

| App | For | Highlights |
|---|---|---|
| Elder app (Bangla) | The parent | Big call button, one-tap needs (medicine, groceries, doctor, call my son, I feel unwell), next medicine with a "taken" button, watch summary, request status |
| Family app (English) | Children and grandchildren | "Ma's day" with wellbeing score and trend, insights with the exact quote behind each one, approvals, agents, watch health, call transcripts, care plan and consent |

## Responsible AI

- A wellbeing companion, never a diagnosis. Health insights say "consider checking in", not what is wrong.
- Every insight shows the calls and readings it came from.
- Spending money, booking doctors, and creating new agents always need a human approval.
- Video, watch data and transcripts are opt-in per type and can be switched off at any time.
- Agents come only from a vetted registry. The AI cannot invent new actions on its own.

## Demo

This repository currently contains the **demo frontend** (Tier 0). It runs on mock data, with no backend yet.

- `#/` - landing page
- `#/elder` - elder app
- `#/elder/call?mode=incoming` - an incoming AI call with a scripted Bangla conversation (tap the caption to skip ahead)
- `#/care` - family app

Requests made in the elder app, or during the call, show up in the family app's Requests screen. This also works across two browser tabs. "Reset demo data" is at the bottom of the Requests screen.

## Tech

- React 19, TypeScript, Vite
- Tailwind CSS v4
- Progressive Web App (installable, works offline) via vite-plugin-pwa
- React Router (hash routing), lucide-react icons
- Fonts: Anek Bangla and Onest

Planned stack for the next tiers: a telephony gateway for real phone calls, Bangla speech recognition and text-to-speech, an LLM with tool use for conversation and agents, Postgres, and wearable connectors (Health Connect, Fitbit, Garmin). See `project.md` for the full architecture.

## Run locally

```bash
npm install
npm run dev      # development server
npm run build    # production build with service worker
npm run preview  # serve the production build
```

## Project docs

`project.md` is the single source of truth for this project: problem, features, sources, architecture, design system, implementation tiers, rules for contributors, and current status. Read it before making changes.

## Roadmap

| Tier | Scope | Status |
|---|---|---|
| 0 | Demo frontend (this repo) | Done |
| 1 | Backend: auth with phone OTP, family data model, API | Planned |
| 2 | Voice calls: scheduled calls, Bangla speech, conversation memory | Planned |
| 3 | Understanding: extraction, trends, caregiver notifications | Planned |
| 4 | Agent system: registry, approvals, admin console | Planned |
| 5 | Smartwatch connectors and consented video signals | Planned |
| 6 | Pilot with families and partners | Planned |
