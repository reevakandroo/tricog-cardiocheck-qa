---
id: TC_LGN_011
module: Authentication
title: Multiple Consecutive Wrong Passwords - Account Lockout Behavior
type: Edge
severity: High
preconditions: [PC_001, PC_002, PC_004]
---

## Scenario
A user (or brute-force attacker) submits 5 or more consecutive failed login attempts for a valid account. The system should implement an account lockout or rate-limiting mechanism to prevent brute-force attacks.

## Preconditions
- [PC_001](../preconditions/PC_001_browser_ready.md) - Browser is open and network is available
- [PC_002](../preconditions/PC_002_app_accessible.md) - CardioCheck app is accessible at the target URL
- [PC_004](../preconditions/PC_004_dedicated_lockout_test_account.md) - A **dedicated test account** is available for lockout testing (do NOT use the primary test account — it may become locked and block other tests)

## Test Data
| Field          | Value                                |
|----------------|--------------------------------------|
| Email          | lockout-test@tricog.com _(dedicated)_ |
| Wrong Password | WrongPass@001 through WrongPass@010  |
| Correct Password | _(known, held in reserve for recovery test)_ |

> **Warning:** Using the primary test account (`reeva.kandroo+8@tricog.com`) for this test may lock it out and block TC_LGN_001 and other tests. Always use a dedicated lockout test account.

## Steps
1. Navigate to `https://cardiocheck-releasev140.up.railway.app`
2. Wait for the Flutter CanvasKit app to fully load
3. Click `flt-semantics-placeholder` to enable Flutter accessibility

**Attempt loop (repeat 10 times or until lockout is observed):**

4. Enter the dedicated test account email in the email field
5. Enter an incorrect password (use a different wrong password each attempt: `WrongPass@001`, `WrongPass@002`, etc.)
6. Click the Login button: `flt-semantics[role="button"]:has-text("Login")`
7. Record:
   - HTTP status code of the Cognito response (from network tab)
   - Error message displayed in the app
   - Response time
   - Attempt number at which behavior changes
8. If lockout is not triggered after 10 attempts, try 5 more (15 total)

**After potential lockout:**

9. Attempt login with the **correct** password for the dedicated account
10. Record whether the correct password is accepted or the account remains locked
11. Note any cooldown period or unlock mechanism

## Expected Result
- After a defined threshold of failed attempts (Cognito default: typically 5 within a short window), the account is temporarily locked or further attempts are rate-limited
- Once locked:
  - The app shows a clear message (e.g., "Too many failed attempts. Please try again later" or "Account temporarily locked")
  - Logging in with the **correct** password is also rejected until the lockout period expires
  - Lockout duration and unlock mechanism are communicated to the user (e.g., "Try again in 15 minutes" or "Check your email to unlock")
- All failed attempts are logged server-side with timestamps and the originating IP address (HIPAA audit trail requirement)
- Lockout is **per account**, not per device — the same account locked from one browser remains locked from a different browser

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_

## Notes
- **Cognito default lockout:** AWS Cognito User Pools implement temporary account lockout after 5 consecutive failed sign-in attempts within a configurable time window. The account is locked for a cooldown period before another attempt is allowed.
- **Security impact:** If no lockout or rate limiting is implemented, the login endpoint is vulnerable to brute-force attacks. Against a medical application holding PHI, this is a **Critical** security finding if absent.
- **HIPAA:** Brute-force prevention is an addressable implementation specification under the Security Rule (§ 164.312(a)(2)(iii)). The absence of lockout should be filed as a HIPAA compliance gap.
- **Rate limiting vs. lockout:** Distinguish between: (a) Cognito account-level lockout and (b) WAF/API Gateway rate limiting. Both should be verified.
- **Recovery path:** Document the exact steps to unlock a test account after this test (e.g., admin console reset, wait period, email link).
- **Do not run this test against production.**
