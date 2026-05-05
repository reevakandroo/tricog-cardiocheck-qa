---
id: PC_005
title: Patient data has been saved and a risk assessment result is displayed
---

## Description
An ECG has been fully processed: all required patient data fields have been filled in and saved, and the application has returned and is displaying a risk assessment result (e.g., Low / Moderate / High risk label, score, or recommendation). This is the starting state for test cases that validate the risk result view, report generation, or downstream actions triggered by a completed assessment.

## Setup Steps
1. Confirm PC_004 is met (ECG detail / patient form is open for an unprocessed ECG).
2. Fill in all required patient data fields in the form. Use the following test values:
   - **Name**: Test Patient
   - **Age**: 45
   - **Gender**: Male (or as required by the form)
   - Any other mandatory fields (height, weight, symptoms — use valid typical values).
3. Click the **Save** / **Submit** / **Process** button.
4. Wait for the app to process and return a risk result (loading spinner should disappear).
5. Confirm the risk assessment result is displayed on screen (risk level label, colour indicator, or summary card).
6. If the ECG was seeded with `"risk":"moderate"` via the mock API, the expected result is **Moderate Risk**.

## Verification
- A risk level indicator (e.g., "Moderate Risk", "Low Risk", "High Risk") is visible on the page.
- No error toast or failure message is shown.
- The form is no longer editable (view-only state) OR a confirmation/result screen has replaced the form.
- The ECG entry in the dashboard list now shows a processed/completed status.

## Teardown
- No teardown required for most tests using this state.
- If a fresh unprocessed ECG is needed again, seed a new mock ECG via the mock API (see PC_007).

## Referenced By
- TC_Risk_Assessment
- TC_Report_Export
- TC_HIPAA
