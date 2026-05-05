---
id: TC_LGN_008
module: Authentication
title: XSS Payload in Password Field - System Must Not Execute Script
type: Security
severity: Critical
preconditions: [PC_001, PC_002]
---

## Scenario
An attacker submits a Cross-Site Scripting (XSS) payload in the password field. The application must treat it as a literal string — it must never be rendered as HTML or executed as JavaScript on any screen.

## Preconditions
- [PC_001](../preconditions/PC_001_browser_ready.md) - Browser is open and network is available
- [PC_002](../preconditions/PC_002_app_accessible.md) - CardioCheck app is accessible at the target URL

## Test Data
| Field    | Value                                          | Notes                      |
|----------|-----------------------------------------------|----------------------------|
| Email    | reeva.kandroo+8@tricog.com                    | Valid registered email     |
| Password | `<script>alert('XSS')</script>`               | Primary XSS payload        |

### Additional Payloads to Test (run as sub-cases)
| Sub | Password Payload                                         | Intent                           |
|-----|----------------------------------------------------------|----------------------------------|
| A   | `<script>alert('XSS')</script>`                          | Classic script tag               |
| B   | `<img src=x onerror=alert('XSS')>`                       | Image onerror event handler      |
| C   | `<svg onload=alert(1)>`                                  | SVG-based XSS                    |
| D   | `javascript:alert('XSS')`                                | JavaScript URI scheme            |
| E   | `"><script>alert(document.cookie)</script>`              | Cookie-stealing attempt          |
| F   | `' onmouseover='alert(1)`                                | Attribute injection              |
| G   | `{{7*7}}`                                                | Template injection probe (SSTI)  |

## Steps
1. Navigate to `https://cardiocheck-releasev140.up.railway.app`
2. Wait for the Flutter CanvasKit app to fully load
3. Click `flt-semantics-placeholder` to enable Flutter accessibility
4. Locate the email input (`aria-label="Enter your email"`) and type `reeva.kandroo+8@tricog.com`
5. Locate the password input (`aria-label="Enter your password"`) and type `<script>alert('XSS')</script>`
6. Click the Login button: `flt-semantics[role="button"]:has-text("Login")`
7. Observe:
   - Does a JavaScript `alert()` dialog pop up?
   - Does the UI render any HTML elements or execute any script?
   - What error message is shown?
8. Repeat steps 4–7 for each additional payload in the table above
9. For payload E (cookie theft), open the browser console and check if `document.cookie` was accessed or if any outbound XHR/fetch requests carry session tokens to unexpected destinations

## Expected Result
- No JavaScript alert or script executes at any point
- The password payload is treated as a plain string and rejected by Cognito as an incorrect password
- The app remains on the login screen with a standard "incorrect credentials" error
- The payload is never reflected back in the DOM or rendered as HTML in any error message, toast, or log display
- Flutter CanvasKit architecture (canvas rendering) provides an inherent layer of XSS resistance since the UI is not DOM-based; however, any server-rendered error pages, JSON responses shown in-app, or log viewers must still be verified
- Template injection probe (`{{7*7}}`) does not return `49` in any response

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_

## Notes
- **Flutter CanvasKit advantage:** Because the UI is rendered on a `<canvas>` element rather than the DOM, most reflected XSS attacks are neutralized at the rendering layer. However, this does not protect:
  1. Server-side systems that receive and store the payload
  2. Admin dashboards or other web UIs that may later display error logs or user inputs using conventional DOM rendering
  3. Any JavaScript interop (`js` package) used within Flutter Web
- **Stored XSS concern:** If the payload reaches the backend (even as a failed login attempt) and is later displayed in an admin audit log or dashboard using a non-Flutter web UI, stored XSS could occur. Verify with the backend team whether login attempt payloads are logged and how they are displayed.
- **HIPAA relevance:** A successful XSS attack could be used to steal session tokens and access patient PHI.
- Capture browser console output during each sub-case as evidence.
