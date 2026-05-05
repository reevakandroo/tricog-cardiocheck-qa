---
id: PC_009
title: At least one processed ECG with patient data and a completed risk assessment exists in the list
---

## Description
The ECG dashboard contains at least one ECG entry that has been fully processed: patient information has been saved and the risk assessment result has been generated and stored. These entries should display a patient name and a risk level indicator in the list. This precondition is required for tests that target viewing, searching, filtering, exporting, or auditing already-completed ECG assessments.

## Setup Steps
1. Confirm PC_002 is met (authenticated user on `/ecgs`, Flutter a11y enabled).
2. Inspect the ECG list for any entry that:
   - Shows a patient name (not blank or "Unknown"), AND
   - Displays a risk level (e.g., "Low", "Moderate", "High", or a colour-coded indicator).
3. If no such entry exists:
   a. Seed a new mock ECG (see PC_007):
      ```bash
      curl -X POST "https://mock-omron-releasev140.up.railway.app/_mock/ingest/sample" \
        -H "x-mock-token: mock-ingest-s3cr3t" \
        -H "content-type: application/json" \
        -d '{"omronConnectId":"86f66e18-494a-4232-8f76-530276b38d3c","risk":"moderate"}'
      ```
   b. Reload the dashboard and open the new ECG entry.
   c. Fill in all required patient data fields (Name: "Test Patient", Age: 45, Gender: Male, plus any other required fields).
   d. Save / submit the form and confirm the risk assessment result appears.
   e. Navigate back to the ECG dashboard (`/ecgs`).
   f. Verify the entry now shows patient name and risk level in the list.
4. Note the entry to be used in the test.

## Verification
- At least one ECG entry in the list shows a visible patient name.
- The entry shows a risk level label or indicator.
- Clicking the entry opens a read-only or view-mode detail page (not a blank form).

## Teardown
- No teardown required; processed ECGs persist and can be reused across multiple test cases.
- If a fresh processed ECG is needed (e.g., to test the initial post-processing state), seed and process a new ECG per the setup steps above.

## Referenced By
- TC_Report_Export
- TC_Search_Bar
- TC_Risk_Assessment (viewing existing results)
- TC_HIPAA
- TC_Security
