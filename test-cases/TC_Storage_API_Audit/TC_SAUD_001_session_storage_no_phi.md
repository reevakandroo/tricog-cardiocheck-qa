---
id: TC_SAUD_001
module: Storage API Audit
title: sessionStorage contains no plaintext Protected Health Information (PHI)
type: Positive
severity: Critical
preconditions: [PC_001, PC_002, PC_003]
---

## Scenario
Verify that the CardioCheck application does not store any plaintext Protected Health Information (PHI) in the browser's `sessionStorage`. PHI in client-side storage is a HIPAA violation risk — if a shared device or malicious script accesses sessionStorage, patient data would be exposed.

## Preconditions
- [PC_001](../preconditions/PC_001_browser_ready.md) - Browser is open
- [PC_002](../preconditions/PC_002_valid_credentials.md) - Valid credentials available
- [PC_003](../preconditions/PC_003_ecg_available.md) - ECG with patient data is available

## Test Data
| Field | Value |
|-------|-------|
| Test Account | reeva.kandroo@tricog.com |
| PHI to Check For | Patient name, date of birth, gender, diagnosis, ECG data, phone/email |
| Tool | Chrome DevTools → Application → Session Storage |

## Steps
1. Log in with valid credentials.
2. Open Chrome DevTools → Application tab → Session Storage.
3. Before interacting with patient data, record all keys and values in sessionStorage.
4. Open an ECG record with patient information.
5. Navigate to the patient data form and view patient details.
6. Return to DevTools — inspect all sessionStorage keys and values again.
7. Search for any plaintext PHI patterns: patient names, dates of birth, diagnosis strings, or ECG raw data.
8. Document all sessionStorage contents found and flag any PHI.

## Expected Result
- No plaintext PHI (names, DOB, diagnosis, ECG waveform data) is present in sessionStorage.
- Auth tokens may be present in sessionStorage — this is expected and acceptable.
- Non-PHI application state (route info, UI state) may be present — acceptable.
- Any patient-related data in sessionStorage is either absent or cryptographically opaque.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_

## Notes
- PHI in plaintext sessionStorage is a Critical HIPAA finding — it constitutes unencrypted PHI on a client device.
- Auth tokens in sessionStorage are a separate security discussion (XSS risk) — flag separately if found.
- Repeat this test after viewing multiple patient records to catch any caching behavior.
