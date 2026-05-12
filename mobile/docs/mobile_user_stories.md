# CardioCheck v1.4.0 — Mobile User Stories
**Version:** 1.0 | **Date:** 2026-05-12 | **Author:** Reeva Kandroo — QA Lead

---

## Module 1: Mobile Login (TC_MLGN)

**US-MLGN-001**: As a doctor using a mobile phone at a clinic, I want to log in securely with my email and password so that I can access patient ECG data on the go.
**Acceptance Criteria:**
- [ ] Login completes within 10 seconds on 4G
- [ ] Dashboard loads after successful authentication
- [ ] Error message shown within 5 seconds for wrong credentials
- [ ] No sensitive data appears in the URL after login

**US-MLGN-002**: As a security-conscious QA engineer, I want the login form to reject SQL injection and XSS payloads so that the app cannot be exploited to expose patient records.
**Acceptance Criteria:**
- [ ] `' OR '1'='1` in email field does not grant access
- [ ] `<script>alert("xss")</script>` in password does not fire an alert
- [ ] No stack trace or SQL error exposed in the UI

**US-MLGN-003**: As a doctor who may accidentally leave their phone unattended, I want brute force protection so that a bad actor cannot guess my password repeatedly without being blocked.
**Acceptance Criteria:**
- [ ] After 5+ consecutive wrong-password attempts, the app applies rate-limiting, lockout, or CAPTCHA
- [ ] No unhandled JavaScript exception thrown during rapid login attempts

**US-MLGN-004**: As a mobile user with autofill enabled, I want extremely long inputs to be handled gracefully so that the app never crashes if my password manager pastes an oversized string.
**Acceptance Criteria:**
- [ ] 300-character email handled without crash or JS exception
- [ ] 300-character password handled without crash or JS exception

---

## Module 2: Mobile Dashboard (TC_MDSH)

**US-MDSH-001**: As a doctor viewing the ECG dashboard on a mobile phone, I want the ECG list to load and display correctly in portrait orientation so that I can quickly scan recent patient ECGs.
**Acceptance Criteria:**
- [ ] ECG list visible within 10 seconds of login
- [ ] Each entry shows enough patient info to identify the case
- [ ] No horizontal overflow cuts off content

**US-MDSH-002**: As a mobile user, I want to be able to pull down on the ECG list to refresh it so that I always see the most recent ECGs without having to navigate away.
**Acceptance Criteria:**
- [ ] Pull-to-refresh gesture triggers a list reload
- [ ] No crash during pull-to-refresh
- [ ] App remains on the ECG list after refresh

**US-MDSH-003**: As an admin responsible for data privacy, I want doctors to only see ECGs from their own medical center so that patient data from other facilities is never accidentally exposed.
**Acceptance Criteria:**
- [ ] Account A sees only Center A ECGs
- [ ] Account B sees only Center B ECGs (0 ECGs if none seeded)
- [ ] No cross-center data leak after concurrent login test

---

## Module 3: Mobile Patient Form (TC_MPAT)

**US-MPAT-001**: As a nurse entering patient data on a mobile device, I want the patient form to validate age correctly so that impossible values (0, -1, 200+) are rejected before triggering a risk assessment.
**Acceptance Criteria:**
- [ ] Age 1 (minimum valid) accepted
- [ ] Age 120 (maximum valid) accepted
- [ ] Age 0 and -1 rejected or disabled
- [ ] Get Risk Assessment button stays disabled for invalid age

**US-MPAT-002**: As a mobile user, I want the age field to show a numeric keyboard automatically so that I do not have to manually switch keyboard types on my phone.
**Acceptance Criteria:**
- [ ] Age input field has `type="number"` or `inputmode="numeric"` attribute
- [ ] Mobile keyboard opens in numeric mode when age field is tapped

**US-MPAT-003**: As a QA engineer testing input handling, I want patient name fields to safely handle special characters, emojis, and unicode so that data entry for international patients does not cause errors.
**Acceptance Criteria:**
- [ ] `O'Brien & <Test>` in name field does not cause XSS or SQL error
- [ ] Emoji in name field does not crash the form
- [ ] 200-character name does not overflow the field visually

---

## Module 4: Mobile Risk Assessment (TC_MRSK)

**US-MRSK-001**: As a cardiologist reviewing results on a mobile device, I want the risk assessment result to display fully within the mobile viewport so that I can read the diagnosis without horizontal scrolling.
**Acceptance Criteria:**
- [ ] No horizontal overflow on the risk result page
- [ ] All risk score components visible without scrolling horizontally
- [ ] Back button returns to the ECG list

**US-MRSK-002**: As a doctor working in a clinic with intermittent connectivity, I want the app to handle network timeouts on the risk result gracefully so that I am not left with a blank screen or a crash.
**Acceptance Criteria:**
- [ ] No unhandled JS exception when risk API times out
- [ ] User can navigate back to the ECG list after a timeout
- [ ] App does not freeze or become unresponsive

---

## Module 5: Mobile Report Export (TC_MRPT)

**US-MRPT-001**: As a doctor who needs to share a patient's ECG risk report, I want the PDF export button to be visible and functional on my mobile screen so that I can email or print the report directly from my phone.
**Acceptance Criteria:**
- [ ] Export button visible after risk result loads on mobile
- [ ] Tapping the export button triggers a download or share sheet
- [ ] No crash when export is triggered on a slow network

**US-MRPT-002**: As a privacy-conscious user, I want the export feature to only be available after a completed risk assessment so that blank or partial reports cannot be accidentally shared.
**Acceptance Criteria:**
- [ ] Export button not visible on the patient entry form (before risk assessment)
- [ ] Export button appears only after a complete risk result is displayed

---

## Module 6: Mobile Search (TC_MSRC)

**US-MSRC-001**: As a doctor looking for a specific patient's ECG on mobile, I want the search bar to filter results in real time as I type so that I can find the right ECG quickly without scrolling.
**Acceptance Criteria:**
- [ ] List updates within 1 second of each keystroke
- [ ] Case-insensitive search (typing "TEST" matches "test patient")
- [ ] Clearing the search field restores the full ECG list

**US-MSRC-002**: As a QA engineer, I want the search bar to handle SQL injection and special characters safely so that malicious input cannot affect backend data.
**Acceptance Criteria:**
- [ ] `'; DROP TABLE ecgs;--` in search does not produce a server error
- [ ] No SQL syntax error displayed in the UI

---

## Module 7: Mobile Profile (TC_MPRF)

**US-MPRF-001**: As a doctor using the app, I want my profile page to show my registered email, medical center name, and app version so that I can verify my account details and report the correct version if I need IT support.
**Acceptance Criteria:**
- [ ] Registered email visible on profile page
- [ ] Medical center name displayed
- [ ] App version number (e.g., v1.4.0) visible

**US-MPRF-002**: As a doctor who has finished a clinic session, I want the Logout button on the profile page to fully terminate my session so that the next user of this device cannot access my patient data.
**Acceptance Criteria:**
- [ ] Logout button visible and tappable on mobile
- [ ] After logout, navigating to /#/ecg redirects to login
- [ ] No PHI visible after logout

---

## Module 8: Mobile Touch Gestures (TC_MGES)

**US-MGES-001**: As a mobile user, I want all interactive elements (buttons, list items) to have touch targets of at least 44×44dp so that I can reliably tap them without accidentally hitting the wrong element.
**Acceptance Criteria:**
- [ ] All primary action buttons have bounding box ≥ 44×44px
- [ ] Tapping an ECG list item consistently opens the correct detail page

**US-MGES-002**: As a doctor browsing a long ECG list, I want smooth swipe scrolling so that I can quickly scan through 50+ ECGs without the interface lagging or glitching.
**Acceptance Criteria:**
- [ ] Swipe up/down scrolls the ECG list without freezing
- [ ] Pull-to-refresh swipe down triggers a reload
- [ ] No crash during any touch interaction

---

## Module 9: Mobile Network (TC_MNET)

**US-MNET-001**: As a doctor in a rural clinic with poor connectivity, I want the app to load on a 3G connection (1.6 Mbps) so that I can use it even without WiFi.
**Acceptance Criteria:**
- [ ] App loads and shows login form on 3G simulation
- [ ] No JavaScript error on 3G
- [ ] Loading latency is visible to the user (spinner or progress indicator)

**US-MNET-002**: As a mobile user who may lose connectivity mid-session, I want the app to handle going offline without crashing so that I do not lose my current work.
**Acceptance Criteria:**
- [ ] Going offline after login does not crash the app
- [ ] No unhandled JS exception in offline mode
- [ ] App recovers gracefully when connectivity is restored

**US-MNET-003**: As a doctor using the app in a location with unstable connectivity, I want the app to inform me visually when I am offline or on a slow connection so that I understand why data is loading slowly.
**Acceptance Criteria:**
- [ ] Visible offline indicator or loading state on slow/no network
- [ ] No blank white screen without any indication of network state

---

## Module 10: Mobile Orientation (TC_MORI)

**US-MORI-001**: As a doctor who switches between portrait and landscape while viewing ECG data, I want the app to adapt its layout correctly so that no content is cut off or overflows the screen.
**Acceptance Criteria:**
- [ ] No horizontal overflow in landscape orientation on login, dashboard, or patient form
- [ ] Content remains readable in both orientations

**US-MORI-002**: As a nurse filling in a patient form, I want data I've entered to be preserved when I rotate my device so that I don't have to re-enter information after an accidental rotation.
**Acceptance Criteria:**
- [ ] Patient ID field retains its value after portrait→landscape rotation
- [ ] Form does not reset or navigate away on orientation change

---

## Module 11: Mobile Accessibility (TC_MA11)

**US-MA11-001**: As a doctor with low vision using TalkBack on Android, I want all interactive elements to have meaningful accessible labels so that I can navigate the app using a screen reader.
**Acceptance Criteria:**
- [ ] Email and password inputs have non-empty `aria-label` attributes
- [ ] All buttons have accessible names announced by TalkBack
- [ ] axe-core detects no Critical WCAG 2.1 AA violations

**US-MA11-002**: As a doctor with large text enabled on their device, I want the app to scale correctly at 200% font size so that text is legible without overflowing its container.
**Acceptance Criteria:**
- [ ] No horizontal overflow when font size is set to 200%
- [ ] All labels and button text remain visible

**US-MA11-003**: As a QA engineer auditing WCAG compliance, I want color contrast ratios to meet the 4.5:1 minimum so that text is readable for doctors with color vision deficiencies.
**Acceptance Criteria:**
- [ ] axe-core reports no contrast violations of impact "serious" or "critical"
- [ ] Placeholder text meets 3:1 contrast ratio minimum

---

## Module 12: Mobile Security (TC_MSEC)

**US-MSEC-001**: As a security auditor, I want to confirm that JWT tokens are stored in Flutter's secure storage (not in browser localStorage) so that an attacker with physical access to the device browser cannot steal the token.
**Acceptance Criteria:**
- [ ] `localStorage` contains no token or JWT after login
- [ ] `sessionStorage` contains no token or JWT after login
- [ ] No auth cookie with `HttpOnly: false` or `Secure: false`

**US-MSEC-002**: As a HIPAA compliance officer, I want the app to enforce HTTPS and include security headers (HSTS, X-Content-Type-Options, X-Frame-Options) so that the app meets baseline web security standards.
**Acceptance Criteria:**
- [ ] All requests go over HTTPS (no HTTP requests)
- [ ] Strict-Transport-Security header present (or confirmed at CDN layer)
- [ ] X-Frame-Options or CSP frame-ancestors present to prevent clickjacking

**US-MSEC-003**: As a security tester, I want to confirm that after logout the session is fully invalidated so that navigating back (or restoring a session cookie) does not re-grant access to PHI.
**Acceptance Criteria:**
- [ ] POST-logout navigation to /#/ecg redirects to login
- [ ] Re-using a stale session cookie does not re-authenticate

---

## Module 13: Mobile HIPAA (TC_MHPA)

**US-MHPA-001**: As a HIPAA compliance officer, I want to verify that patient health information (PHI) is never stored unencrypted in the browser's localStorage or sessionStorage so that accidental device sharing does not expose patient records.
**Acceptance Criteria:**
- [ ] No patient name, age, ECG ID, or risk result stored in plain-text browser storage
- [ ] All API responses containing PHI are ephemeral (not persisted by the browser)

**US-MHPA-002**: As a HIPAA auditor, I want to verify that PHI never appears in URL query parameters so that patient data is not logged in proxy servers, browser history, or CDN logs.
**Acceptance Criteria:**
- [ ] No `?name=`, `?dob=`, `?ssn=`, or `?patient=` in any request URL
- [ ] ECG detail pages use opaque IDs, not patient-identifying strings, in the URL

**US-MHPA-003**: As a privacy officer, I want the app to only display the minimum necessary PHI so that doctors see only what they need for clinical decisions — no excessive data collection.
**Acceptance Criteria:**
- [ ] SSN, date of birth, and home address fields do not appear in the app
- [ ] Only clinically relevant fields (name, age, gender, risk score) are displayed

---

## Module 14: Mobile Performance (TC_MPER)

**US-MPER-001**: As a doctor with patients waiting, I want the app to load and be ready to use within 30 seconds so that I can start reviewing ECGs without long waits.
**Acceptance Criteria:**
- [ ] Login to dashboard completes within 30 seconds on 4G
- [ ] ECG list visible within 5 seconds of login
- [ ] Search results update within 3 seconds of input

**US-MPER-002**: As a mobile user making multiple visits, I want the app's memory usage to remain stable across repeated navigation so that the browser does not crash or slow down after extended use.
**Acceptance Criteria:**
- [ ] JS heap size does not grow by more than 50MB across 5 consecutive login cycles
- [ ] No out-of-memory error during normal usage

---

## Module 15: Mobile App Lifecycle (TC_MINT)

**US-MINT-001**: As a doctor who launches the app fresh each morning, I want the cold start time to show the login form within 15 seconds so that I am not waiting before starting my clinical rounds.
**Acceptance Criteria:**
- [ ] Login form visible within 15 seconds of navigating to the URL on a cold browser
- [ ] No blank white screen for more than 10 seconds

**US-MINT-002**: As a mobile user who often switches apps mid-task, I want my session to remain active after briefly switching to another app so that I do not have to log in again after checking a notification.
**Acceptance Criteria:**
- [ ] Navigating away and back within 5 minutes preserves the authenticated session
- [ ] ECG list is still visible after returning from background

**US-MINT-003**: As a doctor using the app on a clinic tablet, I want rapid multi-tap on buttons to be handled gracefully so that accidentally double-tapping does not create duplicate submissions or crash the app.
**Acceptance Criteria:**
- [ ] Three rapid taps on New ECG do not create duplicate entries or navigation loops
- [ ] No JS exception from rapid tap events
