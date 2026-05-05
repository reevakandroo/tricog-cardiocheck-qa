---
id: PC_004
title: An ECG detail / patient data form is open for an unprocessed ECG
---

## Description
The user has clicked on an unprocessed ECG (one with no patient data yet) from the dashboard list, and the ECG detail view or patient information form is currently open and visible. This is the starting state for any test case that involves entering or editing patient data, or processing an ECG.

## Setup Steps
1. Confirm PC_003 is met (at least one ECG exists in the list).
2. On the ECG dashboard (`/ecgs`), identify an ECG entry that is marked as "New", "Unprocessed", or lacks a patient name.
   - If none exist, seed a new mock ECG first (see PC_007).
3. Click the `flt-semantics-placeholder` element to ensure the accessibility tree is active.
4. Click the target unprocessed ECG entry to open its detail view.
5. Wait for the ECG detail view / patient form to fully render (form fields, ECG waveform, or summary card should be visible).
6. Confirm the form is in an editable (empty or pre-populated) state — not a read-only processed view.

## Verification
- The browser URL has changed to an ECG detail route (e.g., `/ecgs/<id>` or a modal has opened).
- Patient data input fields (e.g., Name, Age, Gender, or equivalent) are visible and focusable.
- No error toast or "ECG not found" message is displayed.

## Teardown
- Navigate back to the ECG dashboard (`/ecgs`) using the Back button or browser back navigation.
- If the form was partially filled during setup, discard or clear the form before the next test if isolation is required.

## Referenced By
- TC_Patient_Info
- TC_Risk_Assessment
