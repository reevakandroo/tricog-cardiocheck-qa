---
id: TC_SRC_009
module: Search Bar
title: Whitespace-only search input is treated as empty and returns all or no results gracefully
type: Edge
severity: Medium
preconditions: [PC_001, PC_002, PC_003]
---

## Scenario
When an operator types only spaces, tabs, or other whitespace characters into the search bar, the application should either treat the input as empty (returning the full list) or gracefully show no results — but must not crash, freeze, or fire unexpected API calls with a whitespace-only `patientId` parameter. This edge case is particularly important because pressing the spacebar is an easy accidental input.

## Preconditions

| ID | Description | File |
|----|-------------|------|
| PC_001 | Browser is open and app URL is loaded | [PC_001_browser_ready.md](../preconditions/PC_001_browser_ready.md) |
| PC_002 | User is authenticated with valid credentials | [PC_002_authenticated_user.md](../preconditions/PC_002_authenticated_user.md) |
| PC_003 | At least one ECG record exists in the list | [PC_003_ecg_available.md](../preconditions/PC_003_ecg_available.md) |

## Test Data

| Input Label | Input Value | Expected Behaviour |
|-------------|-------------|-------------------|
| Single space | ` ` (1 space) | Treated as empty OR no results |
| Multiple spaces | `     ` (5 spaces) | Treated as empty OR no results |
| Leading + trailing spaces | `  ABC  ` | Trimmed to `ABC`, search for `ABC` |
| Tab character | `\t` (paste/type Tab) | Treated as empty OR no results |
| Mixed whitespace | `  \t  ` | Treated as empty OR no results |
| Non-breaking space | ` ` (paste) | Treated as whitespace, not a valid char |
| Zero-width space | `​` (paste) | Stripped silently |

## Steps

### Sub-scenario A — Single space
1. Open the ECG Dashboard and note the current list (N records).
2. Click the search bar and press the **spacebar once**.
3. Wait for any debounce to expire.
4. Observe what happens:
   - **Option A (preferred):** No API call is fired; the full list remains unchanged.
   - **Option B (acceptable):** An API call fires with `patientId=%20` (URL-encoded space) and returns 0 results with an empty state.
   - **FAIL condition:** API call fires with raw space parameter and returns **all** records (backend did not trim the whitespace).
5. Open DevTools → Network tab and confirm the API call behaviour matches one of the acceptable options above.
6. Confirm no JavaScript console errors.

### Sub-scenario B — Multiple spaces
1. Clear the search bar.
2. Type 5 consecutive spaces.
3. Repeat steps 3–6 from Sub-scenario A.

### Sub-scenario C — Leading and trailing spaces around valid ID
1. Type `  ABC  ` (spaces before and after a valid partial patient ID).
2. Confirm the application **trims** the input and searches for `ABC` (not `  ABC  `).
3. Verify the API call uses `patientId=ABC` (trimmed), not `patientId=++ABC++` or similar.
4. Confirm results match the trimmed search term.

### Sub-scenario D — Tab character
1. Click the search bar.
2. Paste a Tab character (`\t`) into the field.
3. Confirm the tab does not move focus to another UI element (focus should stay in the search bar).
4. Confirm the search treats the tab as whitespace and behaves the same as Sub-scenario A.

### Sub-scenario E — Non-breaking space (Unicode U+00A0)
1. Paste a non-breaking space character into the search bar.
2. Confirm the app treats it as whitespace (not as a valid patient ID character).
3. Confirm the API call does not include a non-breaking space as a meaningful search token.

### Sub-scenario F — Multiple rapid spaces (stress test)
1. Click the search bar.
2. Hold the spacebar for 3 seconds (generating ~30–60 space characters).
3. Confirm the app does not fire 30–60 API calls (debounce should prevent this).
4. Confirm the app does not freeze or slow down during rapid whitespace input.

## Expected Result

- Single or multiple spaces: either no API call fires (silent empty treatment) or API call fires and returns 0 results gracefully.
- Leading/trailing spaces around a valid ID: input is trimmed and the search runs on the trimmed value.
- Tab character: stays in the input field (does not shift focus), treated as whitespace.
- Non-breaking space: treated as whitespace, not as a valid search character.
- Rapid spacebar input: debounce prevents API call flooding.
- No JavaScript errors, crashes, or layout issues in any sub-scenario.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_

## Notes
- The most important outcome here is that whitespace-only input does **not** return **all** records (which would be a data exposure issue equivalent to skipping the filter entirely).
- Client-side input trimming is the recommended approach — trim whitespace before evaluating whether to fire the search call.
- If the app already blocks spaces from being typed in the search field (some patient ID formats are alphanumeric-only), document this and mark the sub-scenarios as N/A.
