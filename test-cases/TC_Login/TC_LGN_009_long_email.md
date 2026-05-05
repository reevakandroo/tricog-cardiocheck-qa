---
id: TC_LGN_009
module: Authentication
title: Extremely Long Email (255+ Characters) - Graceful Rejection
type: Edge
severity: Medium
preconditions: [PC_001, PC_002]
---

## Scenario
A user (or attacker probing for buffer-overflow or denial-of-service vectors) submits an email address that exceeds the standard maximum length of 254 characters (RFC 5321). The system must handle it gracefully without crashing, hanging, or exposing errors.

## Preconditions
- [PC_001](../preconditions/PC_001_browser_ready.md) - Browser is open and network is available
- [PC_002](../preconditions/PC_002_app_accessible.md) - CardioCheck app is accessible at the target URL

## Test Data
| Field    | Value                                                          | Length |
|----------|---------------------------------------------------------------|--------|
| Email    | `aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@tricog.com` | 255 chars |
| Password | `Tricog@1234`                                                 | Normal |

### Additional Length Test Cases
| Sub | Length   | Description                           |
|-----|----------|---------------------------------------|
| A   | 254 chars| RFC 5321 boundary — should be valid   |
| B   | 255 chars| One over the RFC maximum              |
| C   | 512 chars| Well above limit                      |
| D   | 1000 chars| Extreme length                       |
| E   | 10000 chars| Potential DoS / buffer overflow probe |

**Generating test emails:**
- 255-char: `[244 × 'a']@tricog.com` (244 + 1 '@' + 10 'tricog.com' = 255)
- 512-char: `[501 × 'a']@tricog.com`
- 1000-char: `[989 × 'a']@tricog.com`

## Steps
1. Navigate to `https://cardiocheck-releasev140.up.railway.app`
2. Wait for the Flutter CanvasKit app to fully load
3. Click `flt-semantics-placeholder` to enable Flutter accessibility
4. Locate the email input (`aria-label="Enter your email"`) and paste the 255-character email address
5. Locate the password input (`aria-label="Enter your password"`) and type `Tricog@1234`
6. Click the Login button: `flt-semantics[role="button"]:has-text("Login")`
7. Observe the UI response, network request, and any error messages
8. Check the browser network tab: what is the request payload size? Was the full string sent?
9. Repeat for each sub-case in the table above

## Expected Result
- The app does not crash, hang, or become unresponsive for any of the test email lengths
- For emails exceeding 254 characters:
  - The input field either: (a) enforces a max-length and stops accepting characters, or (b) accepts the input but validation rejects it with a clear error message
  - No network call is made with an obviously invalid email length (ideally blocked client-side)
  - If the payload reaches the server, the server returns an error that is surfaced clearly to the user
- No stack trace, raw exception, or internal server error (500) is displayed
- The page does not freeze or become unresponsive, even for the 10,000-character case
- Memory usage in the browser tab does not spike abnormally after pasting a very long string

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_

## Notes
- **Source code finding:** No explicit client-side length validation is implemented on the login form. This means all payloads will likely be sent to the server — making server-side validation and error handling critical.
- **RFC 5321:** The maximum total length of a valid email address is 254 characters (local-part max 64, domain max 255, separator 1). Any email exceeding 254 chars is definitionally invalid.
- **Security note:** Very long strings can probe for buffer overflows (C/C++ backends), ReDoS in email regex validators, or memory exhaustion.
- **Performance:** Measure the time taken for the server to respond to extremely long payloads. A disproportionately long response time could indicate inefficient regex or a DoS vector.
- This test should not be run against a production environment — use the designated test/staging environment.
