---
id: TC_PRF_004
module: Profile
title: Omron Credentials Screen — Pairing Info Is Displayed
type: Positive
severity: Medium
preconditions: [PC_001, PC_002]
---

## Scenario
A logged-in user navigates to the Omron credentials screen at `/profile/omron-credentials` and confirms that the screen renders and displays the Omron device pairing information (such as connection ID, pairing token, QR code, or setup instructions).

## Preconditions
- [PC_001](../preconditions/PC_001_browser_ready.md) - Browser is open, JavaScript is enabled, and network is available
- [PC_002](../preconditions/PC_002_authenticated_user.md) - User `reeva.kandroo+8@tricog.com` is logged in and on the ECG dashboard

## Test Data
| Field           | Value                          |
|-----------------|-------------------------------|
| Email           | reeva.kandroo+8@tricog.com    |
| Route           | /profile/omron-credentials     |
| OmronConnectId  | 86f66e18-494a-4232-8f76-530276b38d3c |

## Steps
1. From the ECG dashboard, navigate to `/profile` (via profile icon or navigation menu)
2. Click `flt-semantics-placeholder` to re-activate the Flutter accessibility tree
3. Locate the **Omron Credentials** or **Device Pairing** menu item in the profile menu
4. Click the item to navigate to `/profile/omron-credentials`
5. Click `flt-semantics-placeholder` again after the route change
6. Observe the content of the Omron credentials screen:
   - Is a pairing/connection ID displayed?
   - Is a QR code or pairing token shown?
   - Are setup instructions or a "Connect Omron Device" prompt visible?
7. Check the Network tab for any API requests made to fetch credentials (e.g. `GET /user/omron-credentials` or similar)
8. Confirm the displayed credentials match what was provisioned for this test account (OmronConnectId: `86f66e18-494a-4232-8f76-530276b38d3c`)

## Expected Result
- The `/profile/omron-credentials` screen loads without error
- Omron device pairing information is displayed — at minimum one of: connection ID, QR code, pairing token, or setup instructions
- The pairing info is associated with the correct `omronConnectId` for this user
- No raw API error messages, unformatted JSON, or loading spinners that do not resolve within 3 seconds are shown
- The screen includes a clear label or heading identifying it as Omron device pairing or credentials

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_

## Notes
- The OmronConnectId for the test account is `86f66e18-494a-4232-8f76-530276b38d3c`. This is the same ID used by the mock ingest API to associate ECG records with this user.
- If a QR code is displayed, verify it encodes a valid pairing payload (can be decoded using a QR scanner or browser DevTools canvas inspection).
- Security check: the Omron credentials screen should only be accessible when authenticated. Verify that navigating directly to `/profile/omron-credentials` without a session redirects to `/login` (covered in TC_SEC_001/TC_SEC_002).
- If credentials are fetched from the backend, check that the request uses the Bearer JWT from secure storage and does not expose credentials in URL query parameters.
