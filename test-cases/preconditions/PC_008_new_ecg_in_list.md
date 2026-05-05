---
id: PC_008
title: At least one "New ECG" (unprocessed, no patient data) appears in the dashboard list
---

## Description
The ECG dashboard contains at least one ECG entry that is in an unprocessed state — it has been received from the device but no patient information has been entered or saved for it yet. These entries are typically labelled "New", "Pending", or show no patient name. This precondition is required for tests that specifically target the initial processing flow of a fresh ECG.

## Setup Steps
1. Confirm PC_002 is met (authenticated user on `/ecgs`, Flutter a11y enabled).
2. Inspect the ECG list for any entry that:
   - Has no patient name attached, OR
   - Is labelled "New" / "Unprocessed" / "Pending", OR
   - Shows a blank or placeholder patient identifier.
3. If no such entry exists:
   a. Seed a new mock ECG using the mock Omron API:
      ```bash
      curl -X POST "https://mock-omron-releasev140.up.railway.app/_mock/ingest/sample" \
        -H "x-mock-token: mock-ingest-s3cr3t" \
        -H "content-type: application/json" \
        -d '{"omronConnectId":"86f66e18-494a-4232-8f76-530276b38d3c","risk":"moderate"}'
      ```
   b. Confirm HTTP 200 response.
   c. Reload the ECG dashboard and re-click `flt-semantics-placeholder`.
4. Identify and note the list entry to be used in the test (position, ID, or visible label).

## Verification
- At least one ECG entry is visible in the list that has no associated patient name.
- Clicking the entry opens a blank or empty patient data form (not a read-only processed view).
- No error is shown when the entry is clicked.

## Teardown
- Do not process (save patient data for) this ECG entry if it needs to remain in "new" state for subsequent test steps.
- If the entry was clicked and the form was opened, close without saving to preserve the unprocessed state.

## Referenced By
- TC_ECG_Dashboard
- TC_Patient_Info
- TC_Omron_Integration
