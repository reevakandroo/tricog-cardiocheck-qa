---
id: PC_011
title: Access to the reeva.kandroo+8@tricog.com email inbox for password reset link retrieval
---

## Description
The tester has live access to the inbox of `reeva.kandroo+8@tricog.com` to receive and open the password reset email sent by the CardioCheck application. This is required for all Forgot Password flow tests that involve verifying the reset link delivery, link validity, expiry, and one-time-use behaviour.

## Setup Steps
1. Open a separate browser tab or email client logged into `reeva.kandroo+8@tricog.com`.
   - If using Gmail / Google Workspace: navigate to `https://mail.google.com` and sign in with the `reeva.kandroo@tricog.com` Google account that owns the `+8` alias.
   - If using a mail client: ensure IMAP/POP is configured and the inbox is syncing in real time.
2. Clear or archive any existing password reset emails in the inbox to avoid confusion with a newly triggered one.
3. Note the current time before triggering the reset — this helps identify the correct email if multiple reset requests are made.
4. Keep this inbox tab open and visible during the test.

## Verification
- You can log into the `reeva.kandroo+8@tricog.com` inbox without error.
- The inbox is empty of existing CardioCheck password reset emails (or prior ones are clearly distinguishable by timestamp).
- A test email sent to the address appears in the inbox within 2 minutes (validate deliverability before the test run if required).

## Teardown
- After the reset link has been used or the test is complete, delete the password reset email from the inbox to keep it clean.
- If the password was changed during testing, reset it back to `Tricog@1234` to maintain the standard test account credentials.
- Log out of the email client / close the inbox tab if it is no longer needed.

## Referenced By
- TC_Forgot_Password
- TC_Security (password reset abuse scenarios)
