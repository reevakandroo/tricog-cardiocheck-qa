---
id: TC_PAT_019
module: Patient Information
title: Emojis in Patient Name — name containing emoji → validation behavior observed
type: Edge
severity: Low
preconditions: [PC_001, PC_002, PC_004, PC_007]
---

## Scenario
A user enters a patient name that includes emoji characters (e.g., `John 😊 Doe`). Emojis are Unicode characters outside the standard letters-and-spaces character set. This test documents how the system handles such input — whether it rejects it, strips the emoji, or accepts it silently.

## Preconditions
- [PC_001](../preconditions/PC_001_browser_ready.md) — Browser is open and network is available
- [PC_002](../preconditions/PC_002_authenticated_user.md) — User is logged in and on the ECG dashboard with Flutter accessibility enabled
- [PC_004](../preconditions/PC_004_ecg_detail_open.md) — An ECG detail / patient data form is open for an unprocessed ECG
- [PC_007](../preconditions/PC_007_mock_ecg_seeded.md) — A mock ECG has been generated via the mock Omron API

## Test Data
| Field        | Value        | Notes                                    |
|--------------|--------------|------------------------------------------|
| Patient ID   | PAT00099     | Valid 8-char ID                          |
| Patient Name | John 😊 Doe  | Contains an emoji — outside letters+spaces rule |
| Age          | 40           | Valid, not under test                    |
| Gender       | Male         | Valid, not under test                    |

## Steps
1. Verify the patient information form is open and all fields are empty/editable.
2. Click the `flt-semantics-placeholder` to ensure the Flutter accessibility tree is active.
3. Fill in Patient ID with `PAT00099`.
4. Click the Patient Name field (`aria-label="Patient Name"`).
5. Paste `John 😊 Doe` into the field (copy the emoji from a separate source or use a Unicode input method).
6. Tab out of the field or click elsewhere to trigger validation.
7. Observe the field value displayed — does the emoji appear, get stripped, or get replaced?
8. Observe any error/hint text displayed near the Patient Name field.
9. Fill in Age (`40`) and Gender (`Male`).
10. Attempt to click the Save / Submit button.
11. If submission is attempted, inspect the network request payload to see what name value was sent.

## Expected Result
- **Expected (strict validation):** A validation error is displayed because the emoji is not a letter or space. The form is not submitted.
- **Alternative acceptable behavior:** The field rejects emoji input at the keyboard/paste level (emoji cannot be typed into the field).
- **Unacceptable behavior:** The emoji is silently accepted, stored in the patient record, and/or exported to the PDF — this could cause encoding issues and corrupted reports.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_

## Notes
- Emojis are multi-byte Unicode code points (e.g., U+1F60A). A simple `letters and spaces` regex in Dart (Flutter) must use the correct Unicode-aware pattern to reject them reliably.
- Character length note: some emojis count as 2 characters in Dart's string length (due to UTF-16 surrogate pairs). This could interact with the 100-character limit in unexpected ways.
- HIPAA risk: if emojis are stored and later exported, the PDF renderer may display garbled characters or substitute boxes — verify the PDF export handles this gracefully.
- Additional test variants: Devanagari script (`रोगी`), Arabic (`مريض`), Chinese (`患者`) — the letters-and-spaces rule may or may not intend to block non-Latin scripts.
