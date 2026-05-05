---
id: TC_LGN_014
module: Authentication
title: First Login - EULA Screen Appears and Acceptance Proceeds to Dashboard
type: Positive
severity: High
preconditions: [PC_001, PC_002, PC_005]
---

## Scenario
A user who has never previously accepted the End User License Agreement (EULA) logs in for the first time (or from a fresh session with no prior EULA acceptance recorded). The EULA screen must appear after successful Cognito authentication and the user must accept it before accessing the dashboard. Declining or bypassing the EULA must block access.

## Preconditions
- [PC_001](../preconditions/PC_001_browser_ready.md) - Browser is open and network is available
- [PC_002](../preconditions/PC_002_app_accessible.md) - CardioCheck app is accessible at the target URL
- [PC_005](../preconditions/PC_005_eula_not_accepted.md) - Test user account exists, is confirmed in Cognito, and has **not** previously accepted the EULA (use a fresh account or reset EULA state via the backend)

## Test Data
| Field    | Value                          |
|----------|-------------------------------|
| Email    | reeva.kandroo+8@tricog.com _(or a fresh test account with EULA state reset)_ |
| Password | Tricog@1234                   |

## Steps

### Sub-case A: Accept EULA → Access Dashboard
1. Navigate to `https://cardiocheck-releasev140.up.railway.app`
2. Wait for the Flutter CanvasKit app to fully load
3. Click `flt-semantics-placeholder` to enable Flutter accessibility
4. Log in with valid credentials (email + password)
5. Wait for the login to complete (Cognito authentication + UMS JWT exchange)
6. Observe whether the EULA screen is displayed before the dashboard
7. Click `flt-semantics-placeholder` again to activate accessibility on the EULA screen
8. Read through the EULA content (note: verify the full EULA text is visible/scrollable)
9. Click the `flt-semantics[role="button"]:has-text("I Agree")` button
10. Observe navigation to the dashboard
11. Verify that subsequent logins (log out and log in again) do **not** show the EULA again

### Sub-case B: Bypass EULA (Do Not Click "I Agree")
12. Reset EULA state for the test account (backend/admin step)
13. Repeat steps 1–6 until the EULA screen appears
14. Attempt to navigate directly to the dashboard URL (if known) without clicking "I Agree"
15. Observe whether the app enforces the EULA gate or allows access

### Sub-case C: Decline / Close EULA
16. Reset EULA state again
17. Repeat steps 1–6 until the EULA screen appears
18. Click `flt-semantics-placeholder` for accessibility
19. Look for a "Decline", "Cancel", or close button — if present, click it
20. Observe behavior: Is the user logged out? Shown an error? Left on the EULA screen?

## Expected Result
**Sub-case A:**
- The EULA screen is displayed immediately after Cognito login, before the dashboard
- The EULA content is readable (proper font size, scrollable if it exceeds the viewport)
- Clicking "I Agree" records the user's acceptance server-side (timestamp + user ID)
- The app navigates to the dashboard after acceptance
- On subsequent logins, the EULA screen does **not** appear again (acceptance is persisted)

**Sub-case B:**
- Direct URL navigation to the dashboard while the EULA has not been accepted is blocked
- The user is redirected back to the EULA screen (or login screen)

**Sub-case C:**
- If a decline option exists, clicking it logs the user out and returns them to the login screen
- The user is NOT granted access to the dashboard without accepting the EULA
- If no decline option exists, the user is trapped on the EULA screen until they accept (acceptable) — but must be able to log out

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_

## Notes
- **Flutter CanvasKit reminder:** After each navigation (login page → EULA screen → dashboard), the Flutter semantic tree is rebuilt. `flt-semantics-placeholder` must be clicked again on each screen to enable accessibility before interacting with buttons.
- **Legal requirement:** The EULA acceptance must be recorded server-side with a timestamp and user identifier for audit/legal purposes. A purely client-side flag is insufficient.
- **HIPAA:** If the EULA covers terms related to PHI handling and data consent, it may also constitute part of the authorization agreement. Bypassing it is both a security and compliance issue.
- **UX check:** Verify that the EULA text is legible on both desktop and mobile viewport sizes. Confirm there is no "I Agree" button visible without first scrolling through the full EULA (some implementations require the user to scroll to the bottom before the button becomes active).
- **Accessibility:** The "I Agree" button must be reachable via keyboard (Tab key) and screen reader (ARIA role="button").
