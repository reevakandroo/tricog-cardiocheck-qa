---
id: PC_007
title: A mock ECG has been generated via the mock Omron API with a specified risk level
---

## Description
A synthetic ECG record has been injected into the system using the mock Omron ingest API. The record is associated with `omronConnectId: 86f66e18-494a-4232-8f76-530276b38d3c` and carries a pre-defined risk level (`low`, `moderate`, or `high`). This ensures that tests requiring a specific risk outcome have a predictable, controlled record to work with.

## Setup Steps
1. Confirm network access to the mock API host (`https://mock-omron-releasev140.up.railway.app`).
2. Run the following `curl` command, substituting `<risk>` with the desired risk level (`low`, `moderate`, or `high`):
   ```bash
   curl -X POST "https://mock-omron-releasev140.up.railway.app/_mock/ingest/sample" \
     -H "x-mock-token: mock-ingest-s3cr3t" \
     -H "content-type: application/json" \
     -d '{"omronConnectId":"86f66e18-494a-4232-8f76-530276b38d3c","risk":"<risk>"}'
   ```
   **Default (moderate risk):**
   ```bash
   curl -X POST "https://mock-omron-releasev140.up.railway.app/_mock/ingest/sample" \
     -H "x-mock-token: mock-ingest-s3cr3t" \
     -H "content-type: application/json" \
     -d '{"omronConnectId":"86f66e18-494a-4232-8f76-530276b38d3c","risk":"moderate"}'
   ```
3. Confirm the API returns HTTP 200 and a success body (e.g., `{"status":"ok"}` or similar).
4. Log in to the CardioCheck app (PC_002) and refresh the ECG dashboard.
5. Confirm the newly seeded ECG appears in the list as a new/unprocessed entry.

## Verification
- `curl` command returns HTTP 200.
- The ECG dashboard shows a new entry for `omronConnectId: 86f66e18-494a-4232-8f76-530276b38d3c` that was not present before the API call.
- The entry is marked as new / unprocessed (no patient data attached).

## Teardown
- Seeded ECG records persist in the test environment. No automated cleanup is provided by the mock API.
- If record isolation is needed between test runs, coordinate with the backend team to purge records, or use a different `omronConnectId` per test run.

## Referenced By
- TC_ECG_Dashboard
- TC_Omron_Integration
- TC_Patient_Info
- TC_Risk_Assessment
- TC_HIPAA
