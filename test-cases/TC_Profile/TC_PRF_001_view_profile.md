---
id: TC_PRF_001
module: Profile
title: View Profile — User Name, Email, and Center Info Are Displayed
type: Positive
severity: High
preconditions: [PC_001, PC_002]
---

## Scenario
A logged-in user navigates to `/profile` and confirms that their name, email address, and currently active center information are all rendered on screen.

## Preconditions
- [PC_001](../preconditions/PC_001_browser_ready.md) - Browser is open, JavaScript is enabled, and network is available
- [PC_002](../preconditions/PC_002_authenticated_user.md) - User `reeva.kandroo+8@tricog.com` is logged in and on the ECG dashboard

## Test Data
| Field            | Value                          |
|------------------|-------------------------------|
| Email            | reeva.kandroo+8@tricog.com    |
| Password         | Tricog@1234                   |
| Expected route   | /profile                      |

## Steps
1. Starting from the ECG dashboard (`/ecgs`), locate the profile or account icon in the navigation bar or hamburger menu
2. Click `flt-semantics-placeholder` if the accessibility tree needs refreshing
3. Click the profile navigation item (typically a person icon or the user's name/initials)
4. Wait for the app to navigate to `/profile`
5. Click `flt-semantics-placeholder` to re-enable the Flutter accessibility tree after route change
6. Inspect the profile screen for the following elements:
   - User's display name or full name
   - User's email address (`reeva.kandroo+8@tricog.com`)
   - Currently active diagnostic center name

## Expected Result
- The browser URL reflects `/profile` (or a sub-path under profile)
- The user's **full name** (or display name) is visible on screen
- The user's **email address** (`reeva.kandroo+8@tricog.com`) is visible and correctly displayed
- The **active center name** is visible, matching the center the user is currently assigned to or has selected
- No error banners, empty states, or loading spinners that do not resolve within 3 seconds
- No raw IDs, UUIDs, or backend field names are exposed in place of human-readable labels

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_

## Notes
- Flutter CanvasKit renders all UI on `<canvas>`. After every route change, click `flt-semantics-placeholder` again to re-activate the Flutter semantic tree before querying elements.
- Profile data is fetched from the UMS (User Management Service) using the Bearer JWT stored in secure storage. If the profile screen shows empty fields, check the Network tab for a failed `GET /user/profile` or similar request.
- If the center info is missing, verify that the user account has at least one center assigned in the backend (see PC_010 for multi-center setup).
- HIPAA note: confirm the profile page does not display any patient PHI alongside user account info.
