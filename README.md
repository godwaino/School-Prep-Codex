# Lawrence Sheriff 2027 Admissions Planner

A calm, parent-friendly admissions planner for Lawrence Sheriff School Year 7 entry in September 2027.

## UX direction

- Clear value in under 5 seconds (hero + next deadline + key dates).
- Guided onboarding before readiness scoring.
- Plain language labels and trust-first copy.
- Mobile-first spacing, tap targets, and sticky next-deadline behaviour.

## UK date formatting

All visible date rendering is standardised to UK format (`en-GB`) using `formatDateUK` in `script.js`.

Examples in product UI:
- 7 May 2026
- 30 June 2026
- 12–13 September 2026
- Week commencing 1 December 2026
- 31 December 2026, 23:59

## Run

Open `index.html` in a browser.

## Practice data sanity check

To validate practice content integrity and syntax before sharing:

```bash
node --check script.js
```

Then open the app once in a browser and check the console for any `Practice integrity checks` warnings emitted by `runPracticeIntegrityChecks()` in `script.js`.
