---
id: TC_SRC_010
module: Search Bar
title: Search by uppercase patient ID matches stored lowercase (or vice versa) — case sensitivity validated
type: Edge
severity: Medium
preconditions: [PC_001, PC_002, PC_003]
---

## Scenario
Patient IDs may be stored in a specific case (e.g., all uppercase, all lowercase, or mixed), but operators may type them in any case. This test determines whether the search is case-insensitive (recommended for usability) or case-sensitive (must be clearly communicated to users). Either is acceptable, but undefined or inconsistent behaviour is a defect.

## Preconditions

| ID | Description | File |
|----|-------------|------|
| PC_001 | Browser is open and app URL is loaded | [PC_001_browser_ready.md](../preconditions/PC_001_browser_ready.md) |
| PC_002 | User is authenticated with valid credentials | [PC_002_authenticated_user.md](../preconditions/PC_002_authenticated_user.md) |
| PC_003 | At least one ECG record exists with a known patient ID containing letters | [PC_003_ecg_available.md](../preconditions/PC_003_ecg_available.md) |

## Test Data

| Scenario | Stored `patientId` | Input to search | Expected if case-insensitive | Expected if case-sensitive |
|----------|--------------------|-----------------|------------------------------|---------------------------|
| Uppercase input vs lowercase stored | `abc123` | `ABC123` | Match found | No match |
| Lowercase input vs uppercase stored | `ABC123` | `abc123` | Match found | No match |
| Mixed case input vs stored | `Abc123` | `ABC123` or `abc123` | Match found | No match (unless exact) |
| Exact case match | `ABC123` | `ABC123` | Match found | Match found |
| All lowercase | `abc123` | `abc123` | Match found | Match found |

> **Determine the stored case** by reading the `patientId` from the API response in DevTools (Network tab → `GET /v1/ecgs` response body) or from the ECG card display.

## Steps

### Sub-scenario A — Uppercase input against stored value
1. Note the exact `patientId` of a known ECG record from the API response (e.g., `abc123` if stored lowercase).
2. Type the **uppercase version** into the search bar: `ABC123`.
3. Wait for the search to execute.
4. Observe the results:
   - If case-insensitive: the matching ECG should appear.
   - If case-sensitive: 0 results should appear (acceptable, but must be consistent).
5. Open DevTools → Network tab and confirm the API call sends the input as-is: `patientId=ABC123`.

### Sub-scenario B — Lowercase input against stored uppercase value
1. Use an ECG whose `patientId` is stored in uppercase (e.g., `ABC123`).
2. Type the lowercase version into the search bar: `abc123`.
3. Observe and document the results using the same criteria as Sub-scenario A.

### Sub-scenario C — Mixed case input
1. Use a known patient ID (e.g., `ABC123`).
2. Search for `Abc123` (mixed case).
3. Document whether this matches, to determine whether the system is fully case-insensitive or only handles all-upper / all-lower transformations.

### Sub-scenario D — Consistency check
1. Search for the same patient ID three times using the same case variation (e.g., all uppercase three times).
2. Confirm the result is identical all three times — the behaviour must be deterministic, not randomly matching.

### Sub-scenario E — Backend vs. frontend case handling
1. From the Network tab, confirm whether the case transformation (if any) happens client-side (the UI sends a transformed value) or server-side (the UI sends the raw input and the backend normalises it).
2. Document this behaviour — it affects where a future bug fix or enhancement should be applied.

## Expected Result

**Acceptable outcomes (either is valid — document which one applies):**
- Case-insensitive: all case variations of a valid patient ID return the correct matching records.
- Case-sensitive: only the exact-case match returns results; all other cases return 0 results consistently.

**Unacceptable outcomes (defects):**
- Inconsistent behaviour: the same input sometimes matches and sometimes does not.
- Uppercase returns results but lowercase does not (or vice versa) without a documented, consistent rule.
- A case variation returns results from a **different** patient (data integrity failure).

No JavaScript errors in any sub-scenario. Search responds within 3 seconds.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_

## Notes
- **Recommendation:** Case-insensitive search (`ILIKE` in PostgreSQL, `COLLATE NOCASE` in SQLite, or `.toLowerCase()` normalisation) is strongly preferred in clinical workflows — operators should not need to remember the exact casing of a patient ID.
- If the search is case-sensitive, the UI should display a hint to the user (e.g., "Patient IDs are case-sensitive").
- Document the actual stored case format for patient IDs (all caps, all lower, mixed) — this informs whether the ID comes from the device, is entered manually, or is system-generated.
- HIPAA relevance: case sensitivity misconfiguration could cause an operator to believe a patient has no ECG records when in fact they do (failure to find due to case mismatch), potentially delaying care.
