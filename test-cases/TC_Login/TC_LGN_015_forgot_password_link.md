---
id: TC_LGN_015
module: Authentication
title: Forgot Password Link - Visible on Login Screen and Navigates Correctly
type: Positive
severity: Medium
preconditions: [PC_001, PC_002]
---

## Scenario
A user who has forgotten their password clicks the "Forgot Password" link on the login screen. The link must be visible, accessible, and navigate the user to the appropriate password recovery flow without errors.

## Preconditions
- [PC_001](../preconditions/PC_001_browser_ready.md) - Browser is open and network is available
- [PC_002](../preconditions/PC_002_app_accessible.md) - CardioCheck app is accessible at the target URL

## Test Data
| Field | Value                         |
|-------|-------------------------------|
| Email | reeva.kandroo+8@tricog.com   |

_(Password is intentionally not used in this test — the user has forgotten it)_

## Steps

### Sub-case A: Forgot Password Link Visibility
1. Navigate to `https://cardiocheck-releasev140.up.railway.app`
2. Wait for the Flutter CanvasKit app to fully load
3. Click `flt-semantics-placeholder` to enable Flutter accessibility
4. Visually inspect the login screen for a "Forgot Password", "Forgot your password?", or equivalent link/button
5. Verify the link is visible without scrolling (above the fold)
6. Verify the link is visually distinct from the Login button (different style — typically a text link)

### Sub-case B: Clicking Forgot Password Navigates Correctly
7. Click the Forgot Password link/button
8. Click `flt-semantics-placeholder` on the new screen to enable accessibility
9. Observe the screen/flow that appears:
   - Does it ask for the registered email address?
   - Does it provide instructions for receiving a reset code?
10. Enter `reeva.kandroo+8@tricog.com` in the email field (if prompted)
11. Submit the form
12. Check the registered inbox for a password reset email from Cognito
13. Record: Is the email received? What does it contain? (Do NOT click the reset link — just confirm receipt and structure)

### Sub-case C: Back Navigation from Forgot Password
14. Navigate back to the login screen from the Forgot Password screen (using the app's back button or navigation element)
15. Click `flt-semantics-placeholder` to re-enable accessibility
16. Confirm the login form is displayed correctly and both email/password fields are intact

### Sub-case D: Forgot Password for Non-Existent Email
17. Navigate back to the Forgot Password screen
18. Enter a non-existent email: `doesnotexist.xyz@tricog-test.com`
19. Submit the form
20. Observe the response — does the app reveal whether the email is registered?

## Expected Result
**Sub-case A:**
- The "Forgot Password" link/button is visible on the login screen without scrolling
- It is accessible via the Flutter semantics tree (tappable, correct ARIA role)

**Sub-case B:**
- Clicking the link navigates to a password recovery screen (not a broken screen or error)
- After submitting a valid registered email, a Cognito password reset email is sent (containing a reset code or magic link)
- The app displays a confirmation message (e.g., "Check your email for a password reset code")
- The app does NOT display the reset code directly on screen

**Sub-case C:**
- Back navigation from the Forgot Password screen returns the user to the login screen cleanly
- The login form fields are reset and ready for new input

**Sub-case D:**
- The app responds with the **same message** as for a valid email (e.g., "If this email is registered, you will receive a reset link") — this prevents email enumeration
- No email is sent for non-existent accounts, but the UI does not reveal this

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_

## Notes
- **Flutter CanvasKit reminder:** Every screen navigation requires re-clicking `flt-semantics-placeholder` to re-enable Flutter accessibility semantics.
- **Security — Email Enumeration:** Sub-case D is critical. If the app returns "Email not found" for an unregistered email but "Check your inbox" for a registered one, an attacker can enumerate valid user accounts. Both responses must be identical from the user's perspective.
- **Cognito password reset flow:** Cognito sends a 6-digit OTP code by default. The next step (entering the OTP and setting a new password) is out of scope for this test case — that belongs to a dedicated "Reset Password" module. This test only covers link visibility and the initiation of the flow.
- **UX check:** Confirm the reset email arrives promptly (within 2 minutes). Long delays (>5 minutes) are a usability issue. If email is not received, check Cognito SES configuration and spam folders.
- **Accessibility:** The Forgot Password link must be reachable by keyboard (Tab navigation) and must have an appropriate accessible label for screen readers.
- **HIPAA:** Password reset emails must not include PHI or the user's full name in a way that discloses their status as a patient.
