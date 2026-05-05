---
id: TC_SRC_005
module: Search Bar
title: Special characters in search bar are handled gracefully without crash
type: Edge
severity: Medium
preconditions: [PC_001, PC_002]
---

## Scenario
Operators may accidentally or intentionally type special characters (`!@#$%^&*()`) into the search bar. The application must handle this gracefully — returning no results or an appropriate message — without crashing, throwing JavaScript errors, or producing unexpected API behaviour. This also forms a baseline for more targeted injection tests (TC_SRC_006, TC_SRC_007).

## Preconditions

| ID | Description | File |
|----|-------------|------|
| PC_001 | Browser is open and app URL is loaded | [PC_001_browser_ready.md](../preconditions/PC_001_browser_ready.md) |
| PC_002 | User is authenticated with valid credentials | [PC_002_authenticated_user.md](../preconditions/PC_002_authenticated_user.md) |

## Test Data

| Input Label | Input Value | Notes |
|-------------|-------------|-------|
| Basic special chars | `!@#$%` | Common keyboard symbols |
| Extended special chars | `^&*()_+-=[]{}` | More keyboard symbols |
| Pipe and backslash | `\|/\\` | Often breaks parsers |
| Angle brackets (non-script) | `<>` | HTML delimiters without payload |
| Unicode symbols | `™®©¶§` | Non-ASCII symbols |
| Emoji | `😀🔥💉` | Medical app may receive emoji |
| Null character | `\0` (if injectable) | Can break C-based backends |
| Newline / tab | `\n\t` (paste into field) | Control characters |

## Steps

For each input value in the Test Data table:
1. Click the search bar and clear any existing input.
2. Type or paste the special character string.
3. Wait for the search to execute (debounce / Enter).
4. Open DevTools → Network tab and observe the API call:
   - Verify the `patientId` parameter is **URL-encoded** correctly (e.g., `%21%40%23%24%25` for `!@#$%`).
   - Confirm the API returns HTTP 200 (or a graceful 4xx, not a 500).
5. Observe the UI:
   - Confirm no JavaScript error is thrown (check Console tab).
   - Confirm no crash or white screen.
   - Confirm the app shows either "No results" or an empty list — never partial data from other patients.
6. Clear the search bar after each test and confirm the full list is restored.

### Sub-scenario — Input length + special chars combined
1. Type a string containing both alphanumeric and special characters: `ABC!@#`.
2. Confirm the search fires with the combined value URL-encoded.
3. Confirm graceful handling (no crash, no unexpected results).

### Sub-scenario — Null byte injection via paste
1. Attempt to paste a null byte (`\0`) or control characters into the search field.
2. Confirm the field either silently strips them or the API handles them without a 500 error.

## Expected Result

- All special character inputs are URL-encoded before being sent to the API.
- API returns HTTP 200 with empty results (or a 400 Bad Request with a helpful error message) — never HTTP 500.
- No JavaScript errors or crashes in the browser.
- No results from unrelated patients are displayed.
- Full list is correctly restored after clearing the search.
- Emoji and unicode symbols are encoded and handled without breaking the UI layout.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_

## Notes
- A backend HTTP 500 response for any of these inputs is a High severity defect — it indicates missing input sanitisation server-side.
- If the input field rejects special characters (silently drops them or shows a validation error), document this behaviour — it is acceptable as long as it is user-friendly.
- This test is a functional baseline; for security-specific payloads see TC_SRC_006 (SQL injection) and TC_SRC_007 (XSS).
- UX check: the search field should not allow pasting values that visually corrupt the field layout (e.g., very tall emoji breaking the input height).
