---
id: TC_SAUD_002
module: Storage API Audit
title: IndexedDB contains no plaintext Protected Health Information (PHI)
type: Positive
severity: Critical
preconditions: [PC_001, PC_002, PC_003]
---

## Scenario
Verify that the CardioCheck application does not store plaintext PHI in the browser's IndexedDB. Flutter web applications commonly use IndexedDB for local data persistence. Any patient data stored there without encryption represents a HIPAA-reportable exposure risk on shared or compromised devices.

## Preconditions
- [PC_001](../preconditions/PC_001_browser_ready.md) - Browser is open
- [PC_002](../preconditions/PC_002_valid_credentials.md) - Valid credentials available
- [PC_003](../preconditions/PC_003_ecg_available.md) - ECG with patient data is available

## Test Data
| Field | Value |
|-------|-------|
| Test Account | reeva.kandroo@tricog.com |
| PHI to Check For | Patient name, DOB, gender, diagnosis, ECG waveform data |
| Tool | Chrome DevTools → Application → IndexedDB |

## Steps
1. Log in with valid credentials.
2. Open Chrome DevTools → Application tab → IndexedDB.
3. Expand all IndexedDB databases created by the application.
4. Before viewing patient data, record all object store names and sample entries.
5. Navigate through multiple ECG records, opening patient detail views.
6. Return to DevTools → IndexedDB — refresh the view.
7. Inspect all object stores for plaintext PHI: patient names, dates, diagnosis text, or raw ECG data.
8. Document all IndexedDB contents and flag any PHI found.

## Expected Result
- No plaintext PHI found in any IndexedDB object store.
- If patient data is stored locally (e.g., for offline access), it must be encrypted before storage.
- Application state or non-PHI UI preferences may be present — acceptable.
- No raw ECG waveform data stored in plaintext.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_

## Notes
- Flutter web uses IndexedDB for the Hive or sqflite plugins — check for any Dart-generated databases.
- Plaintext PHI in IndexedDB is a Critical HIPAA violation — same severity as an unencrypted database file.
- Look for database names matching Flutter plugin patterns: `flutterfire`, `hive`, or the app's bundle name.
