---
id: PC_010
title: The logged-in user account has access to multiple centers
---

## Description
The test account (`reeva.kandroo+8@tricog.com`) is configured in the backend to be associated with more than one diagnostic center. This enables tests that verify center-switching functionality, data isolation between centers, and correct scoping of ECG records and permissions per center.

## Setup Steps
1. Confirm PC_002 is met (authenticated user on `/ecgs`).
2. Navigate to the center selector or profile/account settings in the app to check which centers are currently assigned to the account.
3. If only one center is assigned:
   a. Contact the backend team or use the admin panel to add a second center to the `reeva.kandroo+8@tricog.com` account.
   b. Alternatively, use a pre-configured multi-center test account if one has been provisioned.
   c. Log out and log back in to ensure the updated center list is reflected in the session.
4. Re-activate the Flutter accessibility tree by clicking `flt-semantics-placeholder` after login.
5. Confirm the center switcher UI (dropdown, sidebar, or menu) shows two or more center options.

## Verification
- The center selector UI element is visible and lists at least two centers.
- Switching between centers updates the ECG list to show data scoped to the selected center.
- The currently active center name is displayed somewhere in the app header or navigation.

## Teardown
- Switch back to the primary / default center after multi-center tests are complete to avoid affecting other test cases that assume a specific center context.
- Do not remove centers from the account during teardown; leave the configuration intact for future test runs.

## Referenced By
- TC_Multi_Center
- TC_Security (cross-center data isolation)
- TC_HIPAA (access control per center)
