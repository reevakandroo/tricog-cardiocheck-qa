---
id: TC_ECG_004
module: ECG Dashboard
title: Click an ECG card and navigate to patient form or result view
type: Positive
severity: Critical
preconditions: [PC_001, PC_002, PC_003]
---

## Scenario
When the user clicks on an ECG card in the dashboard list, the app must navigate to the correct detail view — either a patient information form (for unprocessed ECGs) or an ECG result / report view (for processed ECGs). Navigation must be smooth, the detail view must load the correct record, and the back navigation must return the user to the list in its previous state.

## Preconditions

| ID | Description | File |
|----|-------------|------|
| PC_001 | Browser is open and app URL is loaded | [PC_001_browser_ready.md](../preconditions/PC_001_browser_ready.md) |
| PC_002 | User is authenticated with valid credentials | [PC_002_authenticated_user.md](../preconditions/PC_002_authenticated_user.md) |
| PC_003 | At least one ECG record is available in the list | [PC_003_ecg_available.md](../preconditions/PC_003_ecg_available.md) |

## Test Data

| Field | Value |
|-------|-------|
| Target ECG | First visible ECG in the list (seed via TC_ECG_003 if needed) |
| ECG selector (Flutter a11y) | `flt-semantics[role="group"] flt-semantics[role="button"]` |
| New/unprocessed ECG selector | `flt-semantics[role="button"]:has-text("New ECG")` |
| Expected navigation | Route change or overlay open with ECG detail |

## Steps

### Sub-scenario A — Unprocessed (New) ECG
1. Identify an ECG card marked as **New ECG** (unprocessed) in the list.
2. Click / tap the card.
3. Observe the transition: confirm a patient information form (name, age, gender fields) is displayed and populated or editable.
4. Verify the form is pre-filled with any data already associated with the ECG (e.g., `patientId`, `age`, `gender` from the ECG model).
5. Note the URL or app route — it should reflect the specific ECG `uuid` or `id`.
6. Press the browser **Back** button (or in-app back arrow).
7. Confirm the user is returned to the ECG list at the same scroll position and page.

### Sub-scenario B — Processed ECG
1. Identify an ECG card that has already been processed (no "New ECG" badge).
2. Click / tap the card.
3. Observe the transition: confirm an ECG result or report view is displayed, showing risk assessment details and/or waveform information.
4. Verify the data shown (patient name, risk category) matches the card that was clicked.
5. Press the browser **Back** button (or in-app back arrow).
6. Confirm the user returns to the ECG list without re-triggering a full page reload.

### Sub-scenario C — Rapid double-click
1. Double-click an ECG card quickly.
2. Confirm the app navigates to the detail view only **once** — no duplicate navigation or stacked routes.

## Expected Result

- Sub-scenario A: Patient info form loads within 3 seconds; form fields are editable and pre-populated where data exists.
- Sub-scenario B: ECG result view loads within 3 seconds; displayed data matches the clicked record.
- Sub-scenario C: Single navigation regardless of double-click.
- Back navigation returns the user to the list view without data loss or a full reload.
- No console errors on navigation or return.
- HIPAA: The detail route URL must not expose raw PHI (e.g., full patient name) in plain text — use opaque IDs (`uuid`) in the URL path.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_

## Notes
- Flutter SPA routing may not change the browser URL; verify navigation by observing the rendered widget tree / semantics tree.
- If the detail view loads a different ECG than the one clicked, this is a Critical data integrity bug — document the `id` of both the clicked and loaded records.
- Test on both desktop (1440×900) and tablet (768×1024) viewports for responsive layout validation.
