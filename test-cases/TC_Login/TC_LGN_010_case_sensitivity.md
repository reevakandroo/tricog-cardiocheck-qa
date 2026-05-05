---
id: TC_LGN_010
module: Authentication
title: Email Case Sensitivity - Upper vs Lowercase Login
type: Edge
severity: Medium
preconditions: [PC_001, PC_002, PC_003]
---

## Scenario
A user types their email address in a different case than it was registered with (e.g., all uppercase, mixed case). The system should handle email case-insensitively, consistent with RFC 5321 (local-part is case-sensitive by spec but most providers treat it as case-insensitive). AWS Cognito normalizes email to lowercase by default.

## Preconditions
- [PC_001](../preconditions/PC_001_browser_ready.md) - Browser is open and network is available
- [PC_002](../preconditions/PC_002_app_accessible.md) - CardioCheck app is accessible at the target URL
- [PC_003](../preconditions/PC_003_user_account_active.md) - Test user account exists and is confirmed (registered as lowercase: `reeva.kandroo+8@tricog.com`)

## Test Data
| Sub | Email Variant                          | Password     | Expected Outcome              |
|-----|----------------------------------------|--------------|-------------------------------|
| A   | `REEVA.KANDROO+8@TRICOG.COM`           | Tricog@1234  | Login succeeds (Cognito normalizes) |
| B   | `Reeva.Kandroo+8@Tricog.Com`           | Tricog@1234  | Login succeeds                |
| C   | `REEVA.kandroo+8@tricog.com`           | Tricog@1234  | Login succeeds                |
| D   | `reeva.KANDROO+8@tricog.com`           | Tricog@1234  | Login succeeds                |
| E   | `reeva.kandroo+8@tricog.com`           | Tricog@1234  | Login succeeds (baseline)     |

## Steps
1. Navigate to `https://cardiocheck-releasev140.up.railway.app`
2. Wait for the Flutter CanvasKit app to fully load
3. Click `flt-semantics-placeholder` to enable Flutter accessibility
4. **Sub-case A:** Type `REEVA.KANDROO+8@TRICOG.COM` in the email field
5. Type `Tricog@1234` in the password field
6. Click the Login button: `flt-semantics[role="button"]:has-text("Login")`
7. Record outcome (success / failure + error message if any)
8. If login succeeds, log out before proceeding to the next sub-case
9. Navigate back to the login screen and click `flt-semantics-placeholder` to re-enable accessibility
10. Repeat steps 4–9 for sub-cases B, C, D, and E

## Expected Result
- Sub-cases A through D: Login **succeeds** — Cognito treats email as case-insensitive by normalizing the input to lowercase before authentication lookup
- Sub-case E (baseline): Login succeeds as the canonical control
- In all success cases, the user is navigated to the dashboard (or EULA if applicable)
- Behavior is **consistent** across all case variants — no sub-case fails when others succeed
- The displayed username/email within the app (if shown on the dashboard) uses the canonical registered form (lowercase), not the typed variant

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_

## Notes
- **AWS Cognito default behavior:** When `CaseSensitive` is `false` (the default for the `username` attribute), Cognito automatically normalizes email addresses to lowercase before looking up users. All uppercase/mixed-case variants should resolve to the same user.
- **Risk if case-sensitive:** If Cognito is configured with `CaseSensitive: true`, sub-cases A–D would fail with "user not found", which is a **UX deficiency** — users reasonably expect case-insensitive email matching.
- **UX check:** Verify whether the email input field itself converts characters to lowercase as the user types. If so, confirm this transformation is visible to the user (so they understand what will be submitted).
- If any case variant fails, document the exact Cognito configuration and whether this is intentional or a misconfiguration.
