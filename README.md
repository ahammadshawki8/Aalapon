# Aalapon (আলাপন)

An AI companion that calls elderly parents daily in Bangla, listens, remembers, and turns conversations into help.
Built for Grameenphone FutureMakers 2026 (AI for Social Good).

Read `project.md` first. It is the single source of truth for this project: problem, features, architecture, tiers, rules, and current status.

## Run

```bash
npm install
npm run dev      # local dev server
npm run build    # production build + PWA service worker
npm run preview  # serve the production build
```

## Portals

- `#/elder` - elder portal in Bangla (big text, need tiles, medicine, watch summary, AI call)
- `#/care` - caregiver portal (wellbeing, insights, requests and approvals, agents, watch health)
