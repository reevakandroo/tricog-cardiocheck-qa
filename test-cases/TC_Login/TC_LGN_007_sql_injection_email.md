---
id: TC_LGN_007
module: Authentication
title: SQL Injection Payload in Email Field - System Must Reject Safely
type: Security
severity: Critical
preconditions: [PC_001, PC_002]
---

## Scenario
An attacker attempts SQL injection through the email field to bypass authentication or extract data. The system must handle the payload safely — rejecting it without exposing errors, crashing, or granting access.

## Preconditions
- [PC_001](../preconditions/PC_001_browser_ready.md) - Browser is open and network is available
- [PC_002](../preconditions/PC_002_app_accessible.md) - CardioCheck app is accessible at the target URL

## Test Data
| Field    | Value                                     | Notes                          |
|----------|------------------------------------------|--------------------------------|
| Email    | `' OR '1'='1`                            | Classic tautology injection    |
| Password | `anything`                               | Arbitrary                      |

### Additional Payloads to Test (run as sub-cases)
| Sub | Email Payload                                 | Intent                          |
|-----|----------------------------------------------|---------------------------------|
| A   | `' OR '1'='1`                               | Auth bypass tautology           |
| B   | `admin'--`                                  | Comment-out rest of query       |
| C   | `' OR 1=1--`                               | Numeric tautology               |
| D   | `'; DROP TABLE users;--`                    | Destructive injection           |
| E   | `" OR ""="`                                | Double-quote variant            |
| F   | `' UNION SELECT null, username, password FROM users--` | UNION-based data extraction |

## Steps
1. Navigate to `https://cardiocheck-releasev140.up.railway.app`
2. Wait for the Flutter CanvasKit app to fully load
3. Click `flt-semantics-placeholder` to enable Flutter accessibility
4. Locate the email input (`aria-label="Enter your email"`) and type the injection payload (start with `' OR '1'='1`)
5. Locate the password input (`aria-label="Enter your password"`) and type `anything`
6. Click the Login button: `flt-semantics[role="button"]:has-text("Login")`
7. Observe the response from the app (UI behavior and network tab)
8. Repeat steps 4–7 for each additional payload in the table above

## Expected Result
- The system does NOT grant access for any injection payload
- Authentication fails and the user remains on the login screen
- The error message is generic (e.g., "Incorrect username or password") and does not leak:
  - Stack traces
  - Database error messages (e.g., "SQL syntax error near...")
  - Internal query structure or table names
- The payload is treated as a literal string, not executed as a query (parameterized queries / ORM usage on the backend prevents execution)
- No crash, hang, or blank screen occurs
- Cognito handles the credential check server-side; since Cognito does not use SQL, the primary concern is whether payloads pass through to downstream UMS calls that might query a SQL database

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_

## Notes
- **Architecture context:** AWS Cognito itself does not use SQL for authentication, so classic SQL injection targeting the Cognito layer is not directly applicable. However, if the email is passed onward to the UMS (User Management Service) or any internal API after Cognito authentication, those downstream services could be vulnerable if they construct raw SQL queries.
- **What to look for:** Any response that takes significantly longer than a normal failed login, returns a 500 error, or returns partial data could indicate backend query execution.
- **HIPAA relevance:** A successful injection attack could expose PHI (patient records, ECG data). Severity is Critical.
- **Logging:** Confirm that injection attempts are logged with the IP address for audit purposes.
- Open the browser network tab before clicking Login to capture raw request/response payloads for evidence.
