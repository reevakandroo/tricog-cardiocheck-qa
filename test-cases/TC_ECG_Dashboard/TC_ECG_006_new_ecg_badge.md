---
id: TC_ECG_006
module: ECG Dashboard
title: Unprocessed ECG displays "New ECG" badge or label
type: Positive
severity: High
preconditions: [PC_001, PC_002, PC_007, PC_008]
---

## Scenario
An ECG that has been ingested but not yet processed (patient info not filled, risk assessment not completed) must be visually distinguished in the list with a "New ECG" badge or equivalent label. This prevents operators from overlooking pending records. The badge must disappear once the ECG has been processed.

## Preconditions

| ID | Description | File |
|----|-------------|------|
| PC_001 | Browser is open and app URL is loaded | [PC_001_browser_ready.md](../preconditions/PC_001_browser_ready.md) |
| PC_002 | User is authenticated with valid credentials | [PC_002_authenticated_user.md](../preconditions/PC_002_authenticated_user.md) |
| PC_007 | A mock ECG has been seeded and is available in the list | [PC_007_mock_ecg_seeded.md](../preconditions/PC_007_mock_ecg_seeded.md) |
| PC_008 | The seeded ECG is confirmed as new/unprocessed in the list | [PC_008_new_ecg_in_list.md](../preconditions/PC_008_new_ecg_in_list.md) |

## Test Data

| Field | Value |
|-------|-------|
| Mock ECG seed command | `curl -X POST "https://mock-omron-releasev140.up.railway.app/_mock/ingest/sample" -H "x-mock-token: mock-ingest-s3cr3t" -H "content-type: application/json" -d '{"omronConnectId":"86f66e18-494a-4232-8f76-530276b38d3c","risk":"moderate"}'` |
| Flutter a11y selector for new ECG | `flt-semantics[role="button"]:has-text("New ECG")` |
| Expected badge text | "New ECG" (or equivalent: "Unprocessed", "Pending") |

## Steps

### Sub-scenario A — Badge presence on new ECG
1. Seed a fresh mock ECG using the curl command above.
2. Wait for the ECG to appear in the dashboard list (see TC_ECG_003).
3. Locate the newly seeded ECG card.
4. Verify a **"New ECG"** badge (or equivalent label) is visually present on the card.
5. Confirm the badge is rendered using the Flutter accessibility selector: `flt-semantics[role="button"]:has-text("New ECG")`.
6. Confirm the badge is visually distinct — e.g., a coloured chip or icon — and not just plain text.

### Sub-scenario B — Badge absence on processed ECG
1. Locate an ECG card that has already been processed (patient form completed, risk assessed).
2. Confirm **no** "New ECG" badge appears on this card.
3. Verify this card is not matched by the `flt-semantics[role="button"]:has-text("New ECG")` selector.

### Sub-scenario C — Badge disappears after processing
1. Start with the newly seeded ECG from Sub-scenario A (badge present).
2. Click the card to open the patient form.
3. Fill in all required patient information fields and submit.
4. Navigate back to the ECG list.
5. Locate the same ECG card and confirm the "New ECG" badge is **no longer present**.

### Sub-scenario D — Multiple unprocessed ECGs
1. Seed 3 mock ECGs in rapid succession.
2. Confirm each of the 3 new cards shows the "New ECG" badge.
3. Confirm pre-existing processed ECGs do not gain a badge spuriously.

## Expected Result

- Sub-scenario A: "New ECG" badge is present on the freshly seeded card.
- Sub-scenario B: Processed ECG cards have no badge.
- Sub-scenario C: Badge is removed after the ECG is fully processed.
- Sub-scenario D: All 3 new cards show badges; processed cards remain unchanged.
- Accessibility: The badge text is exposed to screen readers via the Flutter semantic layer.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_

## Notes
- If the badge text differs from "New ECG" (e.g., "Pending", "Unprocessed"), update the selector and document the actual text.
- Sub-scenario C is a regression guard — a badge that never disappears would cause operators to re-process already-processed ECGs.
- Check badge visibility on dark mode if the app supports it.
