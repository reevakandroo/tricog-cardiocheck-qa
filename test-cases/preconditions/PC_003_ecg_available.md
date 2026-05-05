---
id: PC_003
title: At least one ECG record exists in the dashboard list
---

## Description
The ECG dashboard (`/ecgs`) displays at least one ECG entry in the list, whether new (unprocessed) or previously processed. This ensures tests that require selecting or interacting with an ECG have a record to work with. If the list is empty, a mock ECG must be seeded before proceeding.

## Setup Steps
1. Confirm PC_002 is met (authenticated, on `/ecgs`, Flutter a11y enabled).
2. Check the ECG list for any visible entries.
3. If the list is empty or shows an "No ECGs" / empty state:
   a. Seed a mock ECG via the mock Omron API:
      ```bash
      curl -X POST "https://mock-omron-releasev140.up.railway.app/_mock/ingest/sample" \
        -H "x-mock-token: mock-ingest-s3cr3t" \
        -H "content-type: application/json" \
        -d '{"omronConnectId":"86f66e18-494a-4232-8f76-530276b38d3c","risk":"moderate"}'
      ```
   b. Wait for the API to return a 200 response confirming the record was created.
   c. Refresh the ECG dashboard (F5 or Playwright `page.reload()`).
   d. Re-click `flt-semantics-placeholder` after reload to re-enable the accessibility tree.
4. Confirm at least one ECG card/row is visible in the list.

## Verification
- At least one ECG entry is rendered in the list on `/ecgs`.
- The entry is interactable (click does not result in an error).
- Mock API call returned HTTP 200 if seeding was required.

## Teardown
- No automated teardown required; seeded ECGs persist for the test session.
- If a clean state is needed for the next run, coordinate with the backend team to purge test ECG records for `omronConnectId: 86f66e18-494a-4232-8f76-530276b38d3c`.

## Referenced By
- TC_ECG_Dashboard
- TC_Patient_Info
- TC_Risk_Assessment
- TC_Report_Export
- TC_Search_Bar
