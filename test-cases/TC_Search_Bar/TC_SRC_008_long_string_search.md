---
id: TC_SRC_008
module: Search Bar
title: 500-character search string does not crash the app and is handled gracefully
type: Edge
severity: Medium
preconditions: [PC_001, PC_002]
---

## Scenario
An operator may paste an extremely long string into the search bar (accidentally or from a clipboard containing a long text block). The app must handle this gracefully — either truncating the input at a defined maximum length, rejecting it with a helpful message, or passing it to the backend safely. Neither the frontend nor the backend should crash.

## Preconditions

| ID | Description | File |
|----|-------------|------|
| PC_001 | Browser is open and app URL is loaded | [PC_001_browser_ready.md](../preconditions/PC_001_browser_ready.md) |
| PC_002 | User is authenticated with valid credentials | [PC_002_authenticated_user.md](../preconditions/PC_002_authenticated_user.md) |

## Test Data

| Input Label | Input Value / Generation Method | Length |
|-------------|----------------------------------|--------|
| 500 alphanumeric chars | `python3 -c "print('A' * 500)"` | 500 |
| 500 special chars | `python3 -c "print('!@#$' * 125)"` | 500 |
| 1000 chars | `python3 -c "print('A' * 1000)"` | 1000 |
| 10,000 chars | `python3 -c "print('A' * 10000)"` | 10,000 |
| 500 unicode chars | `python3 -c "print('α' * 500)"` | 500 chars (multi-byte) |

**Quick 500-char alphanumeric string for manual testing:**
```
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
```
(500 × 'A')

## Steps

### Sub-scenario A — 500-character alphanumeric string
1. Click the search bar.
2. Paste the 500-character string (all 'A's).
3. Observe whether the input field:
   - Accepts all 500 characters.
   - Silently truncates to a maximum (document the max length).
   - Shows a validation error for exceeding a limit.
4. Wait for the search to execute.
5. Open DevTools → Network tab:
   - If the full 500-char string is sent: verify the URL is correctly formed and within URL length limits (~2000 chars total).
   - Confirm the API returns HTTP 200 (empty results) or HTTP 400 (input too long) — never HTTP 500.
6. Confirm the UI remains stable — no layout overflow, no text escaping the input container, no crash.

### Sub-scenario B — 1,000-character string
1. Repeat Sub-scenario A with a 1,000-character string.
2. Specifically check for:
   - URL too long (HTTP 414) response from the backend.
   - Browser-side URL truncation causing a different query than expected.
3. Confirm the app handles any of these gracefully without crashing.

### Sub-scenario C — 10,000-character string
1. Paste a 10,000-character string.
2. Check whether the browser tab freezes or slows significantly during input handling (performance regression).
3. Confirm the app does not crash or throw a stack overflow.
4. If the input is sent to the backend, confirm the backend responds with HTTP 400 or 414 — not HTTP 500.

### Sub-scenario D — Long unicode / multi-byte string
1. Paste 500 unicode characters (e.g., 500× `α`).
2. Confirm the multi-byte encoding is handled correctly — 500 characters, not 500 bytes.
3. Confirm the URL encoding of unicode characters does not produce a malformed URL.

### Sub-scenario E — Input field max-length constraint
1. Identify whether the input field has an HTML `maxlength` attribute or Flutter-equivalent character limit.
2. Document the maximum allowed input length.
3. Verify the limit is enforced on the frontend (not just the backend) to prevent unnecessary API calls.

## Expected Result

- The search bar accepts long input without freezing the browser tab.
- The UI does not overflow, wrap incorrectly, or crash.
- If a max-length is enforced client-side, input beyond the limit is silently truncated or rejected with a counter ("X characters remaining").
- API call is either within acceptable URL length limits, or the backend returns HTTP 400/414 (not 500).
- The app recovers gracefully and the full ECG list is accessible after clearing the search.
- No JavaScript errors or crashes for any input length.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_

## Notes
- Maximum URL length varies by server (Apache: ~8,000 chars; Nginx: ~8,192 chars; browsers: ~65,000 chars). A 500-char patient ID will likely hit the backend; a 10,000-char one may return HTTP 414.
- Recommended best practice: enforce a max-length of 50–100 characters on the `patientId` search field client-side. If no limit is set, flag as Low severity.
- HIPAA: Extremely long inputs sent to the backend could expose server internals in error messages — ensure error responses are sanitised.
