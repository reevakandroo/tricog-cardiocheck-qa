---
id: TC_SRC_002
module: Search Bar
title: Partial patient ID (first 3 characters) returns all matching results
type: Positive
severity: High
preconditions: [PC_001, PC_002, PC_003]
---

## Scenario
When an operator types only the first few characters of a patient ID (partial input), the search must return all ECG records whose `patientId` begins with or contains those characters. Partial search reduces friction in busy clinical environments where operators may not remember full IDs.

## Preconditions

| ID | Description | File |
|----|-------------|------|
| PC_001 | Browser is open and app URL is loaded | [PC_001_browser_ready.md](../preconditions/PC_001_browser_ready.md) |
| PC_002 | User is authenticated with valid credentials | [PC_002_authenticated_user.md](../preconditions/PC_002_authenticated_user.md) |
| PC_003 | At least one ECG record exists and its patient ID is known | [PC_003_ecg_available.md](../preconditions/PC_003_ecg_available.md) |

## Test Data

| Field | Value |
|-------|-------|
| Full patient ID example | e.g., `ABC123` |
| Partial input — 3-char prefix | e.g., `ABC` |
| Partial input — 1-char prefix | e.g., `A` |
| Partial input — mid-string | e.g., `C12` (tests contains-match vs. prefix-only) |
| Backend query (prefix) | `GET /v1/ecgs?skip=0&perPage=10&patientId=ABC` |

## Steps

### Sub-scenario A — 3-character prefix
1. Open the ECG Dashboard with the full list visible.
2. Note the `patientId` of at least one ECG (e.g., `ABC123`).
3. Type the **first 3 characters** of the patient ID into the search bar (e.g., `ABC`).
4. Observe the results returned.
5. Verify that the matching record (`ABC123`) appears in the results.
6. Verify that every displayed record's `patientId` contains the search prefix.
7. Open DevTools → Network and confirm the API call includes `patientId=ABC`.

### Sub-scenario B — Single-character prefix
1. Clear the search bar and type only the **first character** of the patient ID (e.g., `A`).
2. Observe results — the system should return all patients whose ID starts with or contains `A`.
3. Verify no crash or error state.
4. Note: if the result set is large, confirm pagination still functions correctly.

### Sub-scenario C — Mid-string partial (contains match)
1. Type characters from the **middle** of a known patient ID (e.g., `C12` for `ABC123`).
2. Observe whether the system supports contains-match (prefix + infix) or only prefix-match.
3. Document the actual behaviour — if only prefix-match is supported, note it as a UX limitation (Low severity) but not a defect.

### Sub-scenario D — Progressively refining search
1. Start by typing `A` → observe results.
2. Append `B` → `AB` → confirm results narrow down.
3. Append `C` → `ABC` → confirm results narrow further.
4. Each step should trigger a new debounced search call with the updated query parameter.
5. Confirm results update in real time as each character is added.

## Expected Result

- 3-character prefix returns all ECGs whose `patientId` matches the prefix.
- Single-character prefix returns all matching ECGs without error.
- Results narrow down correctly as more characters are typed.
- Each keystroke (after debounce) triggers an updated API call with the current search string.
- No crash, blank screen, or console error at any stage.
- Response time per search ≤3 seconds.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_

## Notes
- The backend `patientId` filter behaviour (prefix vs. contains vs. exact) should be documented based on actual API behaviour.
- If the backend performs case-sensitive matching, partial input in a different case may produce no results — see TC_SRC_010 for case sensitivity testing.
- UX recommendation: display a character count hint if the search requires a minimum of N characters to execute.
