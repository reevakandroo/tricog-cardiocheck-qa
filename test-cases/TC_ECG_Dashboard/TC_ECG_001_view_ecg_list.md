---
id: TC_ECG_001
module: ECG Dashboard
title: View paginated ECG list after login
type: Positive
severity: Critical
preconditions: [PC_001, PC_002]
---

## Scenario
After a successful login, the authenticated user lands on the ECG Dashboard and sees a paginated list of ECG records belonging to their center. Each card must display the key fields from the ECG model: patient name, patient ID, age, gender, risk category, and acquisition time.

## Preconditions

| ID | Description | File |
|----|-------------|------|
| PC_001 | Browser is open and app URL is loaded | [PC_001_browser_ready.md](../preconditions/PC_001_browser_ready.md) |
| PC_002 | User is authenticated with valid credentials | [PC_002_authenticated_user.md](../preconditions/PC_002_authenticated_user.md) |

## Test Data

| Field | Value |
|-------|-------|
| App URL | https://cardiocheck-releasev140.up.railway.app |
| Login email | reeva.kandroo+8@tricog.com |
| Login password | Tricog@1234 |
| Expected page size | 10 records per page (default) |
| Backend endpoint | GET /v1/ecgs?skip=0&perPage=10 |

## Steps

1. Open the app at `https://cardiocheck-releasev140.up.railway.app` in a supported browser.
2. Enter email `reeva.kandroo+8@tricog.com` and password `Tricog@1234` on the login screen.
3. Tap / click the **Login** button and wait for the dashboard to load.
4. Observe the ECG list rendered on the dashboard.
5. Verify that up to 10 ECG cards are visible without any user interaction (first page).
6. For each visible card, confirm the following fields are rendered:
   - **Patient name** (non-empty string)
   - **Patient ID** (`patientId`)
   - **Age** (numeric value)
   - **Gender** (Male / Female / Other)
   - **Risk category** badge (Low / Moderate / High)
   - **Acquisition time** (`deviceAcquisitionTime`) in a human-readable format
7. Open browser DevTools → Network tab and confirm a `GET /v1/ecgs?skip=0&perPage=10` request was made and returned HTTP 200 with a JSON body containing an array of ECG objects.
8. Confirm the request does **not** expose raw PHI in query parameters or headers beyond what is necessary.

## Expected Result

- The ECG Dashboard loads within 5 seconds of navigation.
- A list of ECG cards is displayed; up to 10 records shown on the first page.
- Each card contains: patient name, patient ID, age, gender, risk category, and acquisition time — all populated and readable.
- The backend call is `GET /v1/ecgs?skip=0&perPage=10` returning HTTP 200.
- No JavaScript console errors or unhandled promise rejections are present.
- HIPAA: No sensitive PHI (e.g., full DOB, SSN, raw ECG waveform data) is exposed in the network request URL.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_

## Notes
- Flutter Web renders UI through a canvas / semantic layer. Use the selector `flt-semantics[role="group"] flt-semantics[role="button"]` to locate ECG list items in accessibility-mode tests.
- If the center has fewer than 10 ECGs, the list will show however many exist — that is acceptable here; TC_ECG_002 covers the empty-state scenario.
- Verify that the `Authorization` header (JWT/Bearer token) is present on the API call and that it is transmitted over HTTPS only.
