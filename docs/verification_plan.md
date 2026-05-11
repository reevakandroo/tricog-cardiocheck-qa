# Tricog CardioCheck — Verification Plan

**Project:** Tricog CardioCheck QA
**Prepared by:** Wrex (QA Agent)
**Prepared for:** Reeva Kandroo, Tricog Health
**Date:** 2026-05-04
**Version:** 1.0
**Status:** Draft — Pending Managerial Review

---

## Table of Contents

0. [User Stories](#0-user-stories)
1. [Scope](#1-scope)
2. [Test Approach](#2-test-approach)
3. [Test Types](#3-test-types)
4. [Test Environment](#4-test-environment)
5. [Entry and Exit Criteria](#5-entry-and-exit-criteria)
6. [Risk-Based Prioritization](#6-risk-based-prioritization)
7. [Test Data Strategy](#7-test-data-strategy)
8. [Six Mandatory Test Dimensions](#8-six-mandatory-test-dimensions)
9. [Defect Management](#9-defect-management)
10. [Test Metrics](#10-test-metrics)
11. [Automation Strategy](#11-automation-strategy)
12. [Verification Matrix](#12-verification-matrix)

---

## 0. User Stories

These are plain English descriptions of what a doctor (the primary user) needs from CardioCheck, written from their perspective. Each story explains who needs it, what they need, and why it matters to them.

### Authentication & Access

- **As a doctor, I want to log in with my email and password** so that only I can access my patients' ECG data and no one else can see it.
- **As a doctor, I want the app to remember my session** so that I don't have to log in again every time I open it within a working session.
- **As a doctor, I want to be automatically logged out when my session expires** so that a shared or unattended computer cannot be used to access patient data.
- **As a doctor, I want to reset my password via email** so that I can regain access to the app if I forget my credentials.
- **As a doctor, I want to review and accept the terms of use (EULA) before I can use the app** so that I understand my responsibilities when handling patient data.
- **As a doctor, I want to be able to log out at any time** so that I can secure my account when I'm done or stepping away.

### ECG Dashboard

- **As a doctor, I want to see a list of all ECGs sent from the Omron device at my clinic** so that I know which patients are waiting for a risk assessment.
- **As a doctor, I want new, unprocessed ECGs to be clearly marked** so that I can immediately identify which ones need my attention.
- **As a doctor, I want to search for a specific ECG by patient name or ID** so that I can quickly find a patient's record without scrolling through the full list.
- **As a doctor, I want ECGs to be sorted with the newest first** so that the most urgent cases appear at the top of my list.

### Patient Information & Risk Assessment

- **As a doctor, I want to enter a patient's ID, name, age, and gender for each ECG** so that the risk assessment is calculated correctly for that specific patient.
- **As a doctor, I want the form to tell me clearly if I've entered invalid data** (e.g., age out of range, ID too short) so that I can correct it before submitting.
- **As a doctor, I want to click a single "Get Risk Assessment" button** so that the app processes the ECG and gives me the risk result right away — no extra steps.
- **As a doctor, I want the risk result to be clearly displayed as Low, Moderate, or High** so that I can make an informed clinical decision quickly.
- **As a doctor, I want to see the patient's name and age on the result screen** so that I can confirm I'm looking at the right patient before acting on the result.

### Clinical Feedback

- **As a doctor, I want to submit my own clinical feedback on an ECG result** so that my professional judgement is recorded alongside the automated risk score.
- **As a doctor, I want my submitted feedback to be saved and visible when I return to that ECG** so that there's a complete record of my assessment.

### PDF Export

- **As a doctor, I want to export a risk assessment result as a PDF** so that I can print it, attach it to the patient's physical file, or share it with a specialist.
- **As a doctor, I want the exported PDF to include the patient's details and risk result** so that it is a complete, self-contained clinical document.

### Profile & Multi-Center Support

- **As a doctor, I want to view and update my profile details** so that my name and contact information in the system are always accurate.
- **As a doctor working across multiple clinics, I want to switch between clinic centers** so that I only see the ECGs that belong to the clinic I'm currently working at.

### Security & Privacy

- **As a doctor, I want to know that patient data is never exposed in a browser URL** so that sensitive information is not accidentally shared or logged.
- **As a doctor, I want the app to be inaccessible to anyone without a valid login** so that patient records are protected at all times, even if someone shares a direct link.

---

## 1. Scope

### 1.1 In Scope

The following application modules and quality dimensions are within the scope of this verification effort for CardioCheck v1.4.0:

| # | Module | Coverage Level |
|---|--------|---------------|
| 1 | Authentication (Login, Logout, Session, EULA, Forgot/Reset Password) | Full |
| 2 | ECG Dashboard (List, Search, Pagination, New ECG badge) | Full |
| 3 | Patient Information Form (Validation, Submission) | Full |
| 4 | Risk Assessment Result (Low/Moderate/High, Error states) | Full |
| 5 | Clinical Feedback Submission | Full |
| 6 | PDF Export | Full |
| 7 | Profile (View, Edit) | Full |
| 8 | Multi-Center Support (Center switching) | Full |
| 9 | Omron ECG Integration (via mock endpoint) | Full |
| 10 | Network Connectivity (Offline/Online banners) | Full |
| 11 | Route Protection / Access Control | Full |
| 12 | Session Management (TTL, Silent Refresh, Expiry) | Full |
| 13 | Security (Auth bypass, Injection, Session abuse) | Full |
| 14 | HIPAA Compliance (PHI handling, audit, encryption) | Audit-level review |
| 15 | Browser Compatibility (Chrome, Firefox, Edge, Safari iOS, Chrome Android) | Full |
| 16 | Accessibility (Flutter CanvasKit, WCAG 2.1 AA) | Targeted |
| 17 | Performance (Response times, PDF generation, List load) | Targeted |
| 18 | API Endpoint Validation (Input handling, error responses, auth enforcement) | Full |

### 1.2 Out of Scope

The following are explicitly excluded from this verification cycle:

| # | Exclusion | Reason |
|---|-----------|--------|
| 1 | Firebase integration | Commented out in pubspec.yaml; not active in v1.4.0 |
| 2 | Native mobile app builds (iOS/Android) | CardioCheck is Flutter Web only for v1.4.0 |
| 3 | Tricog UMS internal API | External service; tested only at the integration boundary |
| 4 | AWS Cognito configuration changes | Managed by backend team; QA observes behavior only |
| 5 | Production data migration | No production data in test environment |
| 6 | Omron physical hardware device | Mock ingest API used; physical device integration is out of scope |
| 7 | Algorithm service internals | ECG risk scoring algorithm is a black-box dependency |
| 8 | Backend database schema changes | Code-level changes are a dev responsibility |
| 9 | Penetration testing / Red team exercises | Beyond scope of functional QA; separate engagement required |
| 10 | Load / soak testing at scale (>50 concurrent users) | Infrastructure constraints on Railway.app free tier |

### 1.3 Scope Boundaries

- **Version under test:** v1.4.0
- **Primary URL:** `https://cardiocheck-releasev140.up.railway.app`
- **Testing perspective:** Primarily black-box (end-to-end behavioral verification); supplemented by white-box review of known architectural anomalies
- **Data environment:** Synthetic test data only; no real patient PHI

---

## 2. Test Approach

### 2.1 Strategy Overview

The verification strategy combines **black-box behavioral testing** (does the system do what it should, from the user's perspective?) with **grey-box testing** (using knowledge of the architecture, validation rules, and known anomalies to construct targeted adversarial scenarios). Full white-box (source code) analysis is applied only to the specific anomalies already identified in the Application Understanding document.

### 2.2 Black-Box Testing

Tests are derived from user stories, acceptance criteria, and functional specifications without reference to internal implementation details. This approach ensures the application meets its declared behavioral contract and that real users encounter the system as intended.

Techniques applied:
- **Equivalence Partitioning:** Divide input domains into valid and invalid classes. Test one representative from each class.
- **Boundary Value Analysis:** Test values at and immediately adjacent to specified boundaries (e.g., Age: 17, 18, 150, 151 for a valid range of 18–150).
- **Decision Table Testing:** For forms with multiple interacting validation rules, enumerate combinations to ensure all rule interactions are correct.
- **State Transition Testing:** Map the ECG record through its lifecycle states (PENDING → PROCESSING → COMPLETED / POOR_QUALITY_ECG / ERROR) and verify all transitions are handled correctly in the UI.
- **Use Case Testing:** Walk through each user story end-to-end in a realistic workflow sequence.
- **Exploratory Testing:** Unscripted investigation sessions (time-boxed to 1 hour per module) to discover defects that scripted tests may miss.

### 2.3 Grey-Box / Adversarial Testing

Using knowledge of the architecture and known anomalies:
- Construct inputs that specifically target ANOMALY-001 (UUID/BIGINT coercion) — cross-center record access using manipulated center IDs
- Test ANOMALY-004 behavior — verify automation correctly uses pressSequentially() and that fill() consistently fails
- Target ANOMALY-006 — attempt brute-force login sequences to confirm or deny rate limiting
- Direct API testing via curl/Postman to bypass UI validation and test server-side guards independently

### 2.4 Risk-Informed Focus

Given the medical context and HIPAA obligations, this verification plan applies a risk-informed prioritization model. Modules that directly affect:
- Patient safety (risk assessment accuracy, error state clarity)
- Data security and PHI exposure (access control, session management, encryption)
- Regulatory compliance (HIPAA audit trail, data minimization)

...receive the highest test coverage and are treated as blocking defects if failures are found.

---

## 3. Test Types

### 3.1 Functional Testing

**Purpose:** Verify each feature behaves as specified in the user stories and acceptance criteria.

**Coverage:** All 20 user stories, all routes, all form validations, all module interactions.

**Approach:**
- Positive tests: valid inputs, expected sequences, happy paths
- Negative tests: invalid inputs, unexpected sequences, error handling
- Boundary tests: min/max/edge values on all numeric and string fields

**Tooling:** Playwright (automated); manual exploratory sessions for UX and accessibility dimensions

---

### 3.2 Regression Testing

**Purpose:** Ensure that bug fixes and new features do not break previously verified functionality.

**Scope:** Full regression of P1 user stories after any defect fix is merged. Targeted regression of P2/P3 stories on major feature changes.

**Approach:**
- Automated Playwright regression suite executes on every build (see Section 11)
- Regression scope is defined per-sprint based on code change impact analysis

---

### 3.3 Security Testing

**Purpose:** Verify that the application resists known attack vectors and does not expose patient data to unauthorized parties.

**Coverage areas:**
- Authentication bypass (direct URL access without token, tampered JWT, expired token)
- Input injection: SQL injection, XSS, HTML injection, script tags in Patient ID, Name, Feedback fields
- Session abuse: token replay after logout, concurrent session manipulation
- Privilege escalation: Doctor A attempting to access Doctor B's center records
- Brute-force login: repeated credential attempts to confirm/deny rate limiting
- Insecure direct object reference (IDOR): accessing /ecg/:id/result with a valid token but mismatched center

**Tooling:** Playwright for auth bypass tests; curl/Postman for API-level injection and IDOR tests; manual verification for session handling

---

### 3.4 Performance Testing

**Purpose:** Verify that the application meets acceptable response time thresholds under normal usage conditions.

**Target thresholds:**
| Scenario | Acceptable Response Time |
|----------|--------------------------|
| Login (Cognito + UMS exchange) | ≤ 3 seconds |
| ECG list load (first page) | ≤ 2 seconds |
| ECG list load with 100+ records | ≤ 4 seconds |
| Patient form submission | ≤ 2 seconds |
| Risk result page load | ≤ 2 seconds |
| PDF export generation | ≤ 5 seconds |
| Mock Omron ingest to ECG list appearance | ≤ 10 seconds |

**Approach:** Playwright `page.metrics()` and Network tab timings; manual stopwatch for PDF generation; limited synthetic load (5–10 concurrent users) using k6 or similar if infrastructure permits.

---

### 3.5 Compatibility Testing

**Purpose:** Verify that the application renders correctly and functions fully across supported browsers and device sizes.

**Browser matrix:**
| Browser | Version | OS | Priority |
|---------|---------|----|---------|
| Google Chrome | Latest stable | Windows 10, macOS | P1 |
| Mozilla Firefox | Latest stable | Windows 10 | P2 |
| Microsoft Edge | Latest stable | Windows 10 | P2 |
| Safari | Latest (iOS 17+) | iPhone 13/14 | P2 |
| Chrome | Latest | Android 12+ | P2 |

**Viewport sizes:**
| Category | Dimensions |
|----------|-----------|
| Desktop HD | 1920 × 1080 |
| Desktop Standard | 1440 × 900 |
| Tablet | 768 × 1024 |
| Mobile | 375 × 812 |

**Approach:** Playwright's `devices` configuration for mobile viewports; BrowserStack or manual testing for Safari iOS and Android Chrome.

---

### 3.6 HIPAA Compliance Testing

**Purpose:** Verify that the application's handling of Protected Health Information (PHI) meets HIPAA Security Rule requirements (45 CFR Part 164).

**Coverage areas:**
- Access control: only authorized doctors can view patient ECG data (164.312(a)(1))
- Automatic session timeout after inactivity (164.312(a)(2)(iii))
- Authentication: unique user identification, credential management (164.312(d))
- Transmission security: HTTPS enforcement, no plaintext PHI in URLs or logs (164.312(e)(1))
- Audit controls: evidence of access logging for PHI views (164.312(b))
- Data minimization: PDF export contains only necessary PHI
- Emergency access procedure: behavior when primary auth path is unavailable

**Approach:** Combination of UI test verification, network traffic inspection (DevTools), and documentation review (audit log evidence from backend team).

---

### 3.7 Accessibility Testing

**Purpose:** Verify the application is operable by users with disabilities, specifically addressing the unique constraints of Flutter CanvasKit rendering.

**Standard:** WCAG 2.1 Level AA

**Key focus areas:**
- Keyboard navigability after flt-semantics-placeholder activation
- Screen reader compatibility (NVDA on Windows + Chrome; VoiceOver on iOS + Safari)
- Color contrast ratios for risk level indicators (Low/Moderate/High)
- Focus management during route transitions
- Form field labeling in the accessibility tree

---

## 4. Test Environment

### 4.1 Environment Configuration

| Component | Details |
|-----------|---------|
| Application URL | https://cardiocheck-releasev140.up.railway.app |
| Mock Omron URL | https://mock-omron-releasev140.up.railway.app |
| Backend runtime | Go (Gin/GORM) on Railway.app |
| Database | MySQL (hosted; test data isolated from production) |
| Auth provider | AWS Cognito (test user pool — must be confirmed separate from prod) |
| Token service | Tricog UMS (shared dev/staging instance — to be confirmed) |
| Algorithm service | Tricog ECG Algorithm (dev/staging endpoint — to be confirmed) |
| Test runner | Playwright (Node.js v18+) |
| CI platform | To be determined (GitHub Actions recommended) |

### 4.2 Test Account Requirements

The following account types are required before testing begins:

| Account Type | Quantity | Purpose |
|-------------|----------|---------|
| Standard doctor (single center) | 2 | Core functional testing |
| Doctor with multiple centers | 1 | Center-switching tests |
| Fresh account (never logged in) | 1 | EULA first-login test |
| Account with Omron credentials configured | 1 | Omron integration tests |
| Account with no center affiliation | 1 | Edge case: zero-center state |

**All accounts must use synthetic identity data. No real clinical credentials or patient data.**

### 4.3 Infrastructure Requirements

- Stable internet connection (test machine to Railway.app)
- Node.js v18+ for Playwright test runner
- Playwright browsers installed: `npx playwright install chromium firefox webkit`
- curl or Postman for direct API testing
- Browser DevTools access (Network tab, Application tab for storage inspection)
- Access to Railway.app deployment logs (for backend error correlation)

### 4.4 Setup Checklist

- [ ] Test accounts provisioned in Cognito test user pool
- [ ] Omron mock token configured in at least one test account's profile
- [ ] Dev team has confirmed API endpoint paths match Section 8 of Application Understanding
- [ ] Algorithm service is confirmed available in test environment
- [ ] Playwright project initialized and baseline smoke test passes
- [ ] Test data document prepared with all synthetic patient IDs and names

---

## 5. Entry and Exit Criteria

### 5.1 Entry Criteria (Testing Starts When)

All of the following conditions must be met before formal testing begins:

| # | Criterion |
|---|-----------|
| EC-001 | Application v1.4.0 is successfully deployed at the test URL and returns HTTP 200 |
| EC-002 | At least one test doctor account can successfully log in and reach /ecgs |
| EC-003 | Mock Omron ingest endpoint returns a successful ECG record for at least one test account |
| EC-004 | Test accounts for all required types (Section 4.2) have been provisioned |
| EC-005 | Development team has responded to critical open questions (Q-001 through Q-011 at minimum) |
| EC-006 | Playwright test project is initialized with smoke test passing in Chrome |
| EC-007 | QA team has been granted read access to Railway.app deployment logs |

### 5.2 Exit Criteria (Testing Completes When)

Testing is considered complete when all of the following are satisfied:

| # | Criterion |
|---|-----------|
| EX-001 | All P1 test cases have been executed with a result (PASS, FAIL, or BLOCKED) |
| EX-002 | All P2 test cases have been executed with a result |
| EX-003 | Zero open Critical-severity defects remain unresolved |
| EX-004 | Zero open High-severity defects related to patient safety remain unresolved |
| EX-005 | All High-severity security defects have been either resolved or formally risk-accepted by the product owner |
| EX-006 | Test pass rate for P1 cases ≥ 95% |
| EX-007 | Test pass rate for all cases ≥ 85% |
| EX-008 | All open defects have been triaged, assigned, and have an agreed resolution target |
| EX-009 | Final test summary report has been reviewed and signed off by Reeva Kandroo |

### 5.3 Suspension Criteria (Testing Paused When)

| # | Criterion |
|---|-----------|
| SC-001 | More than 20% of P1 test cases are BLOCKED by a single Critical defect |
| SC-002 | The test environment becomes inaccessible for more than 4 working hours |
| SC-003 | A Critical security vulnerability is found that risks production data — immediate escalation required before continuing |
| SC-004 | Algorithm service is unavailable for more than 2 working days |

---

## 6. Risk-Based Prioritization

### 6.1 Prioritization Framework

Modules are prioritized based on two dimensions:
1. **Clinical impact** — could a defect here harm a patient or result in incorrect treatment?
2. **Security/compliance impact** — could a defect here expose PHI or breach HIPAA?

### 6.2 P1 Modules — Must Pass Before Release

These modules represent the critical path. Any unresolved Critical or High defect in a P1 module is a release blocker.

| Module | Reason for P1 |
|--------|---------------|
| Authentication (Login/Logout/Session/Refresh) | Gateway to all PHI; failure exposes all data |
| Route Protection / Access Control | Unauthenticated access = HIPAA breach |
| Patient Information Form | Invalid data submission corrupts patient records |
| Risk Assessment Result | Direct patient safety impact — incorrect or missing result |
| EULA Acceptance | Regulatory/legal requirement for medical software |
| Multi-Center Access Control | ANOMALY-001 makes this high-risk; center data isolation is a HIPAA requirement |
| Omron ECG Ingest | Primary data ingestion path; failure means no new ECGs |

### 6.3 P2 Modules — Should Pass Before Release

Defects in P2 modules are release blockers only if Critical severity. High severity defects require product owner sign-off to release.

| Module | Reason for P2 |
|--------|---------------|
| Forgot Password / Reset Password | User recovery path; blocked users cannot access patient data |
| PDF Export | Clinical record keeping; High severity if PHI leaks |
| Clinical Feedback | Audit trail; Medium-High if feedback not persisted |
| Profile (View/Edit) | Low direct risk but affects user identity management |
| Network Connectivity (Offline/Online banners) | UX risk; data loss possible if offline is silent |
| Session Expiry (Silent Refresh) | UX risk; abrupt logouts during clinical workflow |
| POOR_QUALITY_ECG State (ANOMALY-005) | Patient safety risk if not handled clearly |

### 6.4 P3 Modules — Nice to Have Before Release

P3 defects are tracked but not release blockers unless they escalate.

| Module | Reason for P3 |
|--------|---------------|
| Deep link / Post-login redirect | UX convenience only |
| Multi-tab logout behavior | Edge case; low clinical impact |
| Accessibility (WCAG AA) | Important but unlikely in current clinical deployment context |
| Performance benchmarks (non-blocking) | Flagged for monitoring; not a hard blocker |
| Center selection UX details | Minor UX issues |

---

## 7. Test Data Strategy

### 7.1 Guiding Principles

- **No real PHI.** All patient names, IDs, and demographics are synthetic and follow a deterministic naming convention for traceability.
- **Reproducibility.** Test data sets are versioned and checked into the QA repository so any team member can reproduce a test run.
- **State coverage.** Test data is designed to exercise every system state (PENDING, PROCESSED, POOR_QUALITY_ECG, ERROR) and every risk level (LOW, MODERATE, HIGH).
- **Boundary coverage.** Patient ID, Age, and Name datasets include values at, below, and above every defined boundary.

### 7.2 Patient ID Test Dataset

| Dataset ID | Value | Category | Expected Outcome |
|------------|-------|----------|-----------------|
| PID-001 | `TEST01` | Valid — minimum length (6) | Accepted |
| PID-002 | `TESTPATIENT12` | Valid — maximum length (12, mapped to TESTPATIENT12 → exactly 12) | Accepted |
| PID-003 | `QA12345` | Valid — mixed alphanumeric | Accepted |
| PID-004 | `ABCDEFGHIJ12` | Valid — 12 chars | Accepted |
| PID-005 | `TE` | Invalid — too short (2 chars) | Rejected with validation error |
| PID-006 | `TESTA` | Invalid — too short (5 chars) | Rejected with validation error |
| PID-007 | `TOOLONGPAT001` | Invalid — too long (13 chars) | Rejected with validation error |
| PID-008 | `PAT-001` | Invalid — hyphen (special char) | Rejected with validation error |
| PID-009 | `PAT 001` | Invalid — space (special char) | Rejected with validation error |
| PID-010 | `пациент` | Invalid — Cyrillic unicode | Rejected with validation error |
| PID-011 | `<script>` | Security — XSS attempt | Rejected; must not execute |
| PID-012 | `1'; DROP` | Security — SQL injection attempt | Rejected; must not execute |
| PID-013 | `` (empty) | Invalid — blank field | Rejected with "required" error |
| PID-014 | `       ` | Invalid — whitespace only | Rejected with validation error |

### 7.3 Age Test Dataset

| Dataset ID | Value | Category | Expected Outcome |
|------------|-------|----------|-----------------|
| AGE-001 | `18` | Valid — minimum boundary | Accepted |
| AGE-002 | `25` | Valid — typical | Accepted |
| AGE-003 | `100` | Valid — mid range | Accepted |
| AGE-004 | `150` | Valid — maximum boundary | Accepted |
| AGE-005 | `17` | Invalid — one below minimum | Rejected with validation error |
| AGE-006 | `151` | Invalid — one above maximum | Rejected with validation error |
| AGE-007 | `0` | Invalid — zero | Rejected with validation error |
| AGE-008 | `-1` | Invalid — negative | Rejected with validation error |
| AGE-009 | `18.5` | Invalid — decimal | Rejected with validation error |
| AGE-010 | `abc` | Invalid — non-numeric | Rejected with validation error |
| AGE-011 | `` (empty) | Invalid — blank | Rejected with "required" error |
| AGE-012 | `999` | Invalid — extreme value | Rejected with validation error |

### 7.4 Name Test Dataset

| Dataset ID | Value | Category | Expected Outcome |
|------------|-------|----------|-----------------|
| NAM-001 | `` (empty) | Valid — optional field | Accepted |
| NAM-002 | `John` | Valid — single word | Accepted |
| NAM-003 | `Jane Smith` | Valid — name with space | Accepted |
| NAM-004 | `A` × 100 chars | Valid — maximum length | Accepted |
| NAM-005 | `A` × 101 chars | Invalid — exceeds max | Rejected with validation error |
| NAM-006 | `John123` | Invalid — contains digits | Rejected with validation error |
| NAM-007 | `Jane@Smith` | Invalid — special character | Rejected with validation error |
| NAM-008 | `<script>alert(1)</script>` | Security — XSS | Rejected; must not execute |
| NAM-009 | `José García` | Edge — accented characters | Behavior to be confirmed (Q-020) |
| NAM-010 | `王小明` | Edge — CJK unicode | Behavior to be confirmed (Q-020) |
| NAM-011 | `   ` | Invalid — whitespace only | Behavior to be confirmed |

### 7.5 ECG Record States — Required Coverage

| State | How to Create | Test Purpose |
|-------|--------------|--------------|
| LOW risk, processed | Mock ingest with `risk=low` | Result page happy path |
| MODERATE risk, processed | Mock ingest with `risk=moderate` | Amber indicator display |
| HIGH risk, processed | Mock ingest with `risk=high` | Red indicator + urgency cues |
| POOR_QUALITY_ECG | Dev team mock OR API stub | Error state UX (ANOMALY-005) |
| PENDING/PROCESSING | Intercept before algorithm completes | Loading state display |
| New (unreviewed) badge | Fresh ingest before doctor views | New badge indicator on list |

### 7.6 Test Data Isolation

- Each test run creates records with a timestamp-prefixed Patient ID (e.g., `QA240501` for May 1, 2024) to distinguish test data from other sessions.
- After each test session, created records should be cleaned up via the backend API or database if a cleanup endpoint is available.
- Do not delete records created by previous test sessions until those sessions' results are archived.

---

## 8. Six Mandatory Test Dimensions

Per Wrex testing philosophy, every test effort must validate six dimensions regardless of whether they were explicitly requested. The following sections define how each dimension applies to CardioCheck.

### 8.1 Security

**Why it matters for CardioCheck:** The application handles PHI (patient names, ages, ECG data, risk assessments). A single access control failure could expose a patient's cardiac health data to unauthorized parties, constituting a HIPAA breach with significant legal and reputational consequences.

**Test scenarios:**

| Scenario ID | Scenario Description | Severity if Fails |
|------------|---------------------|-------------------|
| SEC-001 | Direct navigation to /ecgs without a JWT — must redirect to /login | Critical |
| SEC-002 | Manually crafted JWT with valid signature but wrong user ID — must be rejected | Critical |
| SEC-003 | Expired JWT (past 1h TTL) — must not grant access | Critical |
| SEC-004 | XSS in Patient ID field: `<script>alert(1)</script>` | Critical |
| SEC-005 | XSS in Name field: `<img src=x onerror=alert(1)>` | Critical |
| SEC-006 | XSS in Feedback field: `<script>document.cookie</script>` | Critical |
| SEC-007 | SQL injection in Patient ID: `' OR '1'='1` | Critical |
| SEC-008 | IDOR: access /ecg/:id/result where :id belongs to a different center | Critical |
| SEC-009 | Brute-force login: 20 rapid attempts with wrong password — must be throttled | High |
| SEC-010 | After logout, attempt to call /ecgs with the old JWT — must return 401 | High |
| SEC-011 | Access /profile/omron-credentials — Omron token must not be displayed in plaintext after save | High |
| SEC-012 | Inspect browser storage after logout — JWT must be cleared | High |
| SEC-013 | HTML injection in Feedback: `<b>bold</b>` — must render as text, not HTML | Medium |
| SEC-014 | HTTPS enforcement — attempt HTTP access, must redirect to HTTPS | High |
| SEC-015 | Network traffic inspection — no PHI in URL query parameters or unencrypted channels | High |

---

### 8.2 HIPAA Compliance

**Why it matters for CardioCheck:** CardioCheck is a healthcare application handling PHI. HIPAA Security Rule (45 CFR Part 164) mandates specific technical safeguards. Non-compliance exposes Tricog to OCR audits, civil penalties ($100–$50,000+ per violation), and reputational harm.

**HIPAA test scenarios:**

| Scenario ID | HIPAA Rule Reference | Test Description | Severity if Fails |
|------------|---------------------|-----------------|-------------------|
| HIPAA-001 | 164.312(a)(1) — Access Control | Center A doctor cannot see Center B records | Critical |
| HIPAA-002 | 164.312(a)(2)(iii) — Auto Logoff | Session expires after 1 hour of inactivity | High |
| HIPAA-003 | 164.312(d) — Authentication | Unique credentials required; no shared accounts in system | High |
| HIPAA-004 | 164.312(e)(1) — Transmission Security | All API calls over HTTPS; no plaintext PHI in transit | Critical |
| HIPAA-005 | 164.312(b) — Audit Controls | Confirm with dev team: access log exists for PHI views | High |
| HIPAA-006 | 164.312(c)(1) — Integrity | ECG results cannot be modified by end user after processing | High |
| HIPAA-007 | 164.514(b) — Minimum Necessary | PDF export contains only PHI fields required for clinical record | Medium |
| HIPAA-008 | 164.312(a)(2)(i) — Unique User ID | Confirm each doctor has unique Cognito identity; no shared logins | High |
| HIPAA-009 | General — PHI in URLs | Patient ID and other PHI must not appear in browser address bar | High |
| HIPAA-010 | General — PHI in Logs | Confirm with dev team: PHI not written to application error logs | High |

---

### 8.3 Compatibility

**Why it matters for CardioCheck:** Doctors use a variety of devices and browsers in clinical environments. A rendering failure in Firefox or Safari could prevent a doctor from accessing a critical ECG result. Flutter CanvasKit adds additional compatibility risk because it relies on WebAssembly and Canvas2D APIs.

**Compatibility test matrix:**

| Test ID | Browser/Device | Viewport | Key Scenarios |
|---------|---------------|----------|---------------|
| COMPAT-001 | Chrome (latest) / Windows | 1920×1080 | Full regression |
| COMPAT-002 | Chrome (latest) / macOS | 1440×900 | Full regression |
| COMPAT-003 | Firefox (latest) / Windows | 1920×1080 | Login, ECG list, result page, form |
| COMPAT-004 | Edge (latest) / Windows | 1920×1080 | Login, ECG list, result page |
| COMPAT-005 | Safari / iOS 17+ | 390×844 (iPhone 14) | Login, ECG list, form interaction |
| COMPAT-006 | Chrome / Android 12 | 412×915 | Login, ECG list, form interaction |
| COMPAT-007 | Chrome / Windows | 768×1024 (tablet) | Layout integrity, form usability |
| COMPAT-008 | Any browser | 320×568 (small mobile) | Minimum viable layout — no overflow |

**Flutter CanvasKit-specific checks (all browsers):**
- flt-semantics-placeholder is present and clickable
- Accessibility tree activates after click
- Form inputs respond to pressSequentially()
- No canvas rendering artifacts on non-Chrome browsers

---

### 8.4 User Friendliness

**Why it matters for CardioCheck:** In a clinical environment, a doctor under time pressure cannot afford to struggle with an opaque error message or an unexpected UI state. Poor UX can delay diagnosis or cause the doctor to retry an action that should have been a single submission.

**User friendliness test scenarios:**

| Scenario ID | Scenario | Good UX Criteria |
|------------|----------|-----------------|
| UX-001 | Login with wrong password | Clear "Invalid credentials" message; not a generic 500 error |
| UX-002 | Form submission with validation errors | Inline errors next to each field; does not scroll to top |
| UX-003 | POOR_QUALITY_ECG result | Clear explanation + actionable next step (retake instruction) |
| UX-004 | Network goes offline mid-flow | Offline banner appears within 2 seconds; no silent failure |
| UX-005 | Session expires mid form-fill | User's form data is not lost; redirect preserves state if possible |
| UX-006 | PDF export takes >3s | Loading indicator is shown; button is disabled to prevent double-submit |
| UX-007 | High risk ECG result | Visual urgency is unambiguous; color + icon + text (not color alone) |
| UX-008 | Empty ECG list (no records yet) | Friendly empty state with instructions to create first ECG |
| UX-009 | New ECG badge | Badge is visually distinct and labeled clearly (not just a dot) |
| UX-010 | Forgot password with unregistered email | Generic success message (no user enumeration); user is not confused |
| UX-011 | Long patient name (100 chars) | Name renders without truncation or overflow on result page |
| UX-012 | Logout from profile | Confirmation prompt or immediate logout? Consistent with user expectation |
| UX-013 | Center switch with many centers | List is scrollable; selected center is visually highlighted |
| UX-014 | Loading states on ECG list | Skeleton loader or spinner; never a blank white screen |

---

### 8.5 Scalability

**Why it matters for CardioCheck:** Medical centers accumulate ECG records continuously. A center that has been using CardioCheck for 12 months may have thousands of records. Pagination and search must not degrade as the dataset grows. Concurrent access by multiple doctors at a center is a normal use case.

**Scalability test scenarios:**

| Scenario ID | Scenario | Pass Criteria |
|------------|----------|--------------|
| SCALE-001 | ECG list with 500+ records | Page 1 loads in ≤ 4 seconds; pagination navigates without reload freeze |
| SCALE-002 | Search across 500+ records | Results appear in ≤ 2 seconds |
| SCALE-003 | 5 concurrent doctors on same center | No cross-contamination of data; all see correct records |
| SCALE-004 | Rapid successive mock ECG ingests (10 in 60s) | All records appear in the list; no records dropped |
| SCALE-005 | PDF export queue: 3 simultaneous requests | All 3 PDFs generate correctly; no timeout on any |
| SCALE-006 | Center with 10 centers in selection list | All centers rendered; scroll is smooth; selection applies correctly |

*Note: Full load testing (100+ concurrent users) is deferred due to Railway.app infrastructure constraints. Flag for performance testing in a dedicated load environment.*

---

### 8.6 Performance

**Why it matters for CardioCheck:** A 10-second wait for a patient's ECG result in a clinical consultation is unacceptable. Performance gates must be defined and verified, not assumed.

**Performance benchmark targets:**

| Scenario ID | Scenario | Target | Measurement Method |
|------------|----------|--------|-------------------|
| PERF-001 | Time to first paint (login page) | ≤ 3 seconds on 10 Mbps connection | Playwright `page.metrics()` / Lighthouse |
| PERF-002 | Login → /ecgs navigation (post-auth) | ≤ 3 seconds total | Network tab timing |
| PERF-003 | ECG list first load (≤ 50 records) | ≤ 2 seconds | Network tab timing |
| PERF-004 | Patient form page load | ≤ 1.5 seconds | Network tab timing |
| PERF-005 | Risk result page load (existing result) | ≤ 2 seconds | Network tab timing |
| PERF-006 | PDF export generation | ≤ 5 seconds | Manual stopwatch + network timing |
| PERF-007 | Mock ECG ingest → list appearance | ≤ 10 seconds | Manual stopwatch (end-to-end) |
| PERF-008 | CanvasKit initial WASM download | ≤ 5 seconds on 10 Mbps | Network waterfall |
| PERF-009 | Memory usage after 30 minutes of use | No memory leak (heap stable) | Chrome Memory tab |

---

## 9. Defect Management

### 9.1 Severity Classification

| Severity | Definition | Examples |
|----------|------------|---------|
| **Critical** | System is unusable; patient safety or PHI is at risk; HIPAA violation; data loss is possible | ECG result incorrect, unauthenticated access to patient records, SQL injection succeeds, data corruption |
| **High** | Major feature is broken; significant security or compliance gap; no workaround exists | Login fails, PDF export never generates, XSS possible in feedback, brute force unrestricted, POOR_QUALITY_ECG state crashes app |
| **Medium** | Feature partially works; workaround exists; no immediate safety risk | Validation error message is unclear, center-switching requires refresh, session refresh shows brief error flash |
| **Low** | Minor cosmetic or UX issue; no functional impact | Label alignment off by 2px, button text truncated on mobile, hover state color incorrect |

### 9.2 Defect Priority vs. Severity

Severity measures the impact of the defect. Priority measures the urgency of fixing it. In most cases they align, but a cosmetic issue on the login page of a demo build may be Low severity but High priority (customer demo tomorrow). This distinction must be made explicit on every defect ticket.

### 9.3 Defect Workflow

```
FOUND → OPEN → ASSIGNED → IN PROGRESS → FIXED → IN REVIEW (QA) → CLOSED
                                                              ↓
                                                          REOPENED (if fix fails)
```

**States:**
- **OPEN:** Defect identified and logged; not yet assigned to a developer
- **ASSIGNED:** Developer has accepted ownership
- **IN PROGRESS:** Developer is actively working on the fix
- **FIXED:** Developer has deployed a fix to the test environment; awaiting QA verification
- **IN REVIEW (QA):** QA is re-running the failed test case(s) against the fix
- **CLOSED:** QA has confirmed the fix is effective and no regression was introduced
- **REOPENED:** QA re-verification failed; defect is not resolved

### 9.4 Defect Report Template

Every logged defect must contain:

```
Defect ID    : DEF-[sequential number]
Title        : [Short, specific description]
Severity     : Critical / High / Medium / Low
Priority     : P1 / P2 / P3
Module       : [Authentication / ECG Dashboard / Patient Form / ...]
User Story   : [US-XXX if applicable]
Environment  : [Browser, OS, App version, URL]

Steps to Reproduce:
  1. [Exact action]
  2. [Exact action]
  3. [Exact action]

Expected Result:
  [What should have happened]

Actual Result:
  [What actually happened]

Root Cause (if known):
  [Validation missing / No error handling / State assumption / ...]

Impact:
  [Data loss? / Security hole? / Patient safety? / UX confusion? / Silent failure?]

Attachments:
  [Screenshot / Video / Network trace / Console log]
```

### 9.5 Resolution SLAs

| Severity | Fix Target | Retest Target |
|----------|------------|---------------|
| Critical | 24 hours from report | 4 hours after fix deployed |
| High | 3 business days | 1 business day after fix deployed |
| Medium | Within current sprint | Within current sprint |
| Low | Backlog; prioritized at sprint planning | Next sprint |

---

## 10. Test Metrics

### 10.1 Coverage Goals

| Metric | Target |
|--------|--------|
| User Story coverage (US-001 to US-020) | 100% — every user story has at least one test case |
| P1 test case execution rate | 100% — all P1 cases executed before release |
| P2 test case execution rate | 95% — allow max 5% blocked by environment issues |
| P3 test case execution rate | 70% — best effort |
| Automated test coverage (P1 flows) | ≥ 80% of P1 test cases automated |

### 10.2 Quality Gates (Release Readiness)

| Gate | Threshold |
|------|-----------|
| P1 test pass rate | ≥ 95% |
| P2 test pass rate | ≥ 85% |
| Open Critical defects | 0 |
| Open High defects (patient safety) | 0 |
| Open High defects (security/HIPAA) | 0 (or formally risk-accepted) |
| Open High defects (other) | ≤ 2 with documented workaround |
| Test execution complete | ≥ 90% of all planned cases executed |

### 10.3 Reporting Cadence

| Report | Frequency | Audience |
|--------|-----------|---------|
| Daily test execution summary | Daily (during active testing) | Reeva, QA team |
| Defect status report | Every 2 days | Reeva, Dev lead |
| Weekly QA status update | Weekly | Manager, Dev lead, Product |
| Final test summary report | End of test cycle | Manager, Product, Dev lead |

### 10.4 Metrics to Track

- Total test cases: planned / executed / passed / failed / blocked
- Defects logged per day / per module
- Defect resolution rate (fixed vs. open over time)
- Automation test execution time (trend over cycles)
- Flaky test rate (tests that produce inconsistent results)
- Regression defect rate (bugs re-introduced by fixes)

---

## 11. Automation Strategy

### 11.1 Framework: Playwright (TypeScript)

**Rationale:** Playwright provides native support for Chromium, Firefox, and WebKit in a single framework. It supports the accessibility tree interaction model required for Flutter CanvasKit (via `page.locator()` with accessibility role and label selectors). TypeScript provides type safety and improves maintainability of the test suite.

### 11.2 Project Structure

```
tricog-cardiocheck-qa/
├── playwright.config.ts          # Browser config, base URL, retries
├── tests/
│   ├── auth/
│   │   ├── login.spec.ts         # US-001, US-002 (EULA), US-004 (logout)
│   │   ├── forgot-password.spec.ts  # US-003, US-019
│   │   └── session.spec.ts       # US-016, US-017
│   ├── ecg-dashboard/
│   │   ├── list.spec.ts          # US-005
│   │   └── search.spec.ts        # US-006
│   ├── patient-form/
│   │   └── patient-form.spec.ts  # US-007 (all validation scenarios)
│   ├── risk-assessment/
│   │   ├── result.spec.ts        # US-008
│   │   └── feedback.spec.ts      # US-009
│   ├── pdf/
│   │   └── pdf-export.spec.ts    # US-010
│   ├── profile/
│   │   ├── profile.spec.ts       # US-011
│   │   ├── center-selection.spec.ts  # US-012
│   │   └── omron-credentials.spec.ts # US-013
│   ├── omron/
│   │   └── ingest.spec.ts        # US-014
│   ├── network/
│   │   └── connectivity.spec.ts  # US-015
│   ├── security/
│   │   └── security.spec.ts      # SEC-001 through SEC-015
│   └── compatibility/
│       └── responsive.spec.ts    # COMPAT-001 through COMPAT-008
├── fixtures/
│   ├── auth.fixture.ts           # Login helper, token management
│   ├── ecg.fixture.ts            # Mock ECG creation via Omron mock API
│   └── test-data.ts              # All test datasets (PIDs, ages, names)
├── helpers/
│   ├── flutter-input.ts          # pressSequentially wrapper, semantics activation
│   └── api-client.ts             # Direct API calls (curl equivalent in TypeScript)
└── reports/
    └── [generated by Playwright]
```

### 11.3 Flutter CanvasKit Interaction Pattern

All tests that interact with form inputs must follow this pattern:

```typescript
// Step 1: Activate Flutter accessibility tree
await page.locator('flt-semantics-placeholder').click();

// Step 2: Locate input by accessible label (NOT by CSS selector)
const patientIdField = page.getByRole('textbox', { name: 'Patient ID' });

// Step 3: Use pressSequentially — NEVER fill()
await patientIdField.click();
await patientIdField.pressSequentially('TEST01');
```

This pattern is encapsulated in `helpers/flutter-input.ts` to ensure consistency.

### 11.4 Test Tagging Strategy

Tests are tagged to enable selective execution:

| Tag | Usage |
|-----|-------|
| `@smoke` | Minimal set for deployment verification (login + ECG list) |
| `@p1` | All P1 priority tests |
| `@p2` | All P2 priority tests |
| `@security` | All security test scenarios |
| `@hipaa` | All HIPAA compliance scenarios |
| `@regression` | Full regression suite |
| `@flaky` | Tests known to have intermittent behavior; isolated from CI gate |

### 11.5 CI/CD Integration

**Recommended pipeline:** GitHub Actions

```yaml
# Trigger: on every pull request merge to main
on:
  push:
    branches: [main, staging]

jobs:
  playwright-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      - run: npx playwright test --grep @p1 --reporter=html
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

**Gate policy:**
- `@smoke` tests: run on every PR; failure blocks merge
- `@p1` tests: run on every merge to main; failure blocks deployment to staging
- Full regression (`@regression`): run nightly; failure triggers Slack alert to Reeva

### 11.6 Manual Testing Scope

The following scenarios are NOT automated and remain as permanent manual tests:

| Scenario | Reason for Manual |
|----------|------------------|
| HIPAA-005 (Audit log verification) | Requires backend log access; not browser-testable |
| UX-003 (POOR_QUALITY_ECG UX review) | Subjective UX assessment |
| UX-007 (High risk urgency perception) | Subjective visual assessment |
| Accessibility (Screen reader testing) | Requires NVDA + Chrome setup; not automatable in CI |
| PDF content review | PDF rendering assertion requires visual inspection |
| Performance — memory leak (PERF-009) | Requires extended manual session |
| Compatibility — Safari iOS | Requires physical device or BrowserStack |

---

## 12. Verification Matrix

This matrix maps every User Story to its associated test case IDs, the module under test, priority, and automation status.

| User Story | Title | Module | Priority | Test Case IDs | Automated? |
|-----------|-------|--------|----------|--------------|------------|
| US-001 | Login with Valid Credentials | Authentication | P1 | TC_LGN_001, TC_LGN_002, TC_LGN_003 | Yes |
| US-001 | Login — Invalid Credentials | Authentication | P1 | TC_LGN_004, TC_LGN_005, TC_LGN_006 | Yes |
| US-001 | Login — Empty Fields | Authentication | P1 | TC_LGN_007, TC_LGN_008 | Yes |
| US-002 | EULA — First Login Display | Authentication | P1 | TC_EULA_001, TC_EULA_002 | Yes |
| US-002 | EULA — Accept Flow | Authentication | P1 | TC_EULA_003 | Yes |
| US-002 | EULA — Decline Flow | Authentication | P1 | TC_EULA_004 | Yes |
| US-002 | EULA — Not Re-shown on Return Login | Authentication | P1 | TC_EULA_005 | Yes |
| US-003 | Forgot Password — Valid Email | Auth / Forgot PW | P1 | TC_FPW_001 | Yes |
| US-003 | Forgot Password — Invalid Email | Auth / Forgot PW | P1 | TC_FPW_002, TC_FPW_003 | Yes |
| US-003 | Reset Password — Valid Token | Auth / Reset PW | P1 | TC_RPW_001, TC_RPW_002 | Yes |
| US-003 | Reset Password — Mismatched Passwords | Auth / Reset PW | P1 | TC_RPW_003 | Yes |
| US-004 | Logout — Successful | Authentication | P1 | TC_LGT_001, TC_LGT_002 | Yes |
| US-004 | Logout — Back Nav After Logout | Authentication | P1 | TC_LGT_003 | Yes |
| US-004 | Logout — Token Cleared from Storage | Authentication | P1 | TC_LGT_004 | Yes |
| US-005 | ECG List — Default Load | ECG Dashboard | P1 | TC_DSH_001, TC_DSH_002 | Yes |
| US-005 | ECG List — Pagination | ECG Dashboard | P1 | TC_DSH_003, TC_DSH_004 | Yes |
| US-005 | ECG List — New ECG Badge | ECG Dashboard | P1 | TC_DSH_005 | Yes |
| US-005 | ECG List — Empty State | ECG Dashboard | P2 | TC_DSH_006 | Yes |
| US-006 | Search — Valid Patient ID | ECG Dashboard | P1 | TC_SCH_001, TC_SCH_002 | Yes |
| US-006 | Search — No Results | ECG Dashboard | P1 | TC_SCH_003 | Yes |
| US-006 | Search — Case Insensitive | ECG Dashboard | P2 | TC_SCH_004 | Yes |
| US-006 | Search — Special Characters | ECG Dashboard | P2 | TC_SCH_005 | Yes |
| US-007 | Patient Form — Valid Submission | Patient Form | P1 | TC_PAT_001 | Yes |
| US-007 | Patient Form — Patient ID Boundaries | Patient Form | P1 | TC_PAT_002 through TC_PAT_015 | Yes |
| US-007 | Patient Form — Age Boundaries | Patient Form | P1 | TC_PAT_016 through TC_PAT_027 | Yes |
| US-007 | Patient Form — Name Validation | Patient Form | P1 | TC_PAT_028 through TC_PAT_038 | Yes |
| US-007 | Patient Form — Gender Selection | Patient Form | P1 | TC_PAT_039, TC_PAT_040 | Yes |
| US-007 | Patient Form — XSS / Injection | Patient Form | P1 | TC_PAT_041, TC_PAT_042, TC_PAT_043 | Yes |
| US-008 | Risk Result — Low Risk Display | Risk Assessment | P1 | TC_RSK_001 | Yes |
| US-008 | Risk Result — Moderate Risk Display | Risk Assessment | P1 | TC_RSK_002 | Yes |
| US-008 | Risk Result — High Risk Display | Risk Assessment | P1 | TC_RSK_003 | Yes |
| US-008 | Risk Result — POOR_QUALITY_ECG State | Risk Assessment | P1 | TC_RSK_004, TC_RSK_005 | Manual |
| US-009 | Feedback — Submit Valid Feedback | Risk Assessment | P2 | TC_FBK_001, TC_FBK_002 | Yes |
| US-009 | Feedback — XSS in Feedback | Risk Assessment | P1 | TC_FBK_003, TC_FBK_004 | Yes |
| US-009 | Feedback — Persists on Reload | Risk Assessment | P2 | TC_FBK_005 | Yes |
| US-010 | PDF Export — Generates Successfully | PDF Export | P1 | TC_PDF_001 | Yes |
| US-010 | PDF Export — Content Verification | PDF Export | P1 | TC_PDF_002 | Manual |
| US-010 | PDF Export — PHI Scope | PDF Export | P2 | TC_PDF_003 | Manual |
| US-011 | Profile — View Profile Data | Profile | P2 | TC_PRF_001 | Yes |
| US-012 | Center Selection — Switch Center | Profile / Centers | P2 | TC_CTR_001, TC_CTR_002 | Yes |
| US-012 | Center Selection — ECG List Scoped to New Center | Profile / Centers | P1 | TC_CTR_003 | Yes |
| US-013 | Omron Credentials — Save Token | Profile / Omron | P2 | TC_OMR_001 | Yes |
| US-013 | Omron Credentials — Masked After Save | Profile / Omron | P2 | TC_OMR_002 | Manual |
| US-014 | Omron Ingest — Low Risk ECG Appears | Omron Integration | P1 | TC_ING_001 | Yes |
| US-014 | Omron Ingest — Moderate Risk ECG | Omron Integration | P1 | TC_ING_002 | Yes |
| US-014 | Omron Ingest — High Risk ECG | Omron Integration | P1 | TC_ING_003 | Yes |
| US-014 | Omron Ingest — Invalid Token | Omron Integration | P2 | TC_ING_004 | Yes |
| US-015 | Offline Banner — Appears on Disconnect | Network | P2 | TC_NET_001 | Yes |
| US-015 | Online Banner — Appears on Reconnect | Network | P2 | TC_NET_002 | Yes |
| US-015 | Offline — API Failure Communicated | Network | P2 | TC_NET_003 | Yes |
| US-016 | Session Refresh — Silent on 401 | Session Management | P1 | TC_SES_001, TC_SES_002 | Yes |
| US-016 | Session Refresh — Redirect on Failure | Session Management | P1 | TC_SES_003 | Yes |
| US-017 | Route Protection — No Token → /login | Access Control | P1 | TC_ACS_001 through TC_ACS_007 | Yes |
| US-017 | Route Protection — Expired Token | Access Control | P1 | TC_ACS_008 | Yes |
| US-017 | Route Protection — Cross-Center IDOR | Access Control | P1 | TC_ACS_009, TC_ACS_010 | Yes |
| US-018 | Accessibility — Keyboard Navigation | Accessibility | P2 | TC_A11_001, TC_A11_002 | Manual |
| US-018 | Accessibility — Screen Reader | Accessibility | P2 | TC_A11_003 | Manual |
| US-018 | Accessibility — Color Contrast | Accessibility | P2 | TC_A11_004 | Manual |
| US-019 | Reset Password — Expired Token | Auth / Reset PW | P2 | TC_RPW_004, TC_RPW_005 | Yes |
| US-020 | Multi-Tab — Logout Propagation | Session Management | P3 | TC_MTB_001, TC_MTB_002 | Manual |

**Matrix Summary:**
| Category | Count |
|----------|-------|
| Total User Stories | 20 |
| Total Test Case IDs | ~90 |
| Automated | ~72 (80%) |
| Manual | ~18 (20%) |
| P1 Test Cases | ~52 |
| P2 Test Cases | ~28 |
| P3 Test Cases | ~10 |

---

## 13. Black Box Test Cases — Full Combination Suite

Black box tests treat the system as an opaque unit — only inputs and observable outputs are used. No knowledge of internal code or implementation is assumed. Each module is tested across three categories: **Positive** (valid inputs → correct behavior), **Negative** (invalid/bad inputs → graceful rejection), and **Edge** (boundary values, injection, unusual sequences → predictable behavior).

---

### 13.1 Authentication — Black Box (Module 14)

| Test ID | Type | Preconditions | Steps | Expected Result | Automated |
|---------|------|---------------|-------|-----------------|-----------|
| TC_LGN_BB_001 | Positive | App reachable | Navigate to /login, enter valid email with dots and domain, enter correct password, click Login | Redirected to /ecgs dashboard | Yes |
| TC_LGN_BB_002 | Positive | Logged in | Login successfully, reload page | Still on /ecgs — session persists | Yes |
| TC_LGN_BB_003 | Positive | On login page | Fill email + password, press Enter key (not click) | Navigates away from login | Yes |
| TC_LGN_BB_004 | Positive | Not authenticated | Navigate directly to /login | Stays on /login — not redirected away | Yes |
| TC_LGN_BB_005 | Positive | On login page | Enter wrong password → error; re-enter correct credentials → click Login | Login succeeds on second attempt | Yes |
| TC_LGN_BB_006 | Positive | On login page | Navigate to /login | App version string visible in UI | Yes |
| TC_LGN_BB_007 | Positive | On login page | Navigate to /login | Email and Password labels visible | Yes |
| TC_LGN_BB_008 | Negative | On login page | Enter valid email, enter wrong password, click Login | Stays on login page; no redirect | Yes |
| TC_LGN_BB_009 | Negative | On login page | Enter non-existent email, enter any password, click Login | Stays on login; no 500 error exposed | Yes |
| TC_LGN_BB_010 | Negative | On login page | Leave email blank, enter password, click Login | Cannot proceed — stays on login | Yes |
| TC_LGN_BB_011 | Negative | On login page | Enter email, leave password blank, click Login | Cannot proceed — stays on login | Yes |
| TC_LGN_BB_012 | Negative | On login page | Enter email, enter spaces-only password, click Login | Cannot proceed — stays on login | Yes |
| TC_LGN_BB_013 | Negative | On login page | Enter "notanemail" (no @), enter password, click Login | Cannot proceed — stays on login | Yes |
| TC_LGN_BB_014 | Negative | On login page | Leave both fields empty, click Login | Cannot proceed — stays on login | Yes |
| TC_LGN_BB_015 | Negative | On login page | Enter non-existent email + wrong password, click Login | Error message does not say "user not found" or "email not found" (security) | Yes |
| TC_LGN_BB_016 | Edge | On login page | Enter SQL injection string `' OR '1'='1' --` in email, click Login | Stays on login; no SQL error text visible | Yes |
| TC_LGN_BB_017 | Edge | On login page | Enter `<script>alert("xss")</script>` in password, click Login | No alert dialog fires; no script executes | Yes |
| TC_LGN_BB_018 | Edge | On login page | Enter 300-character email, click Login | No JS crash; gracefully handled | Yes |
| TC_LGN_BB_019 | Edge | On login page | Enter 300-character password, click Login | No JS crash; gracefully handled | Yes |
| TC_LGN_BB_020 | Edge | On login page | Attempt 5 rapid failed logins in sequence | No crash; app still functional after 5 attempts | Yes |
| TC_LGN_BB_021 | Edge | Not authenticated | Navigate directly to /ecgs | Redirected to /login | Yes |
| TC_LGN_BB_022 | Edge | Not authenticated | Navigate directly to /profile | Redirected to /login | Yes |
| TC_LGN_BB_023 | Edge | On login page | Enter null byte `\x00` in email, click Login | No crash; no 500 error exposed | Yes |

---

### 13.2 Patient Information Form — Black Box (Module 15)

| Test ID | Type | Preconditions | Steps | Expected Result | Automated |
|---------|------|---------------|-------|-----------------|-----------|
| TC_PAT_BB_001 | Positive | ECG open, on patient form | Enter age = 18 (minimum boundary), fill all required fields, submit | Form accepted; risk assessment proceeds | Yes |
| TC_PAT_BB_002 | Positive | ECG open, on patient form | Enter age = 150 (maximum boundary), fill all fields, submit | Form accepted; risk assessment proceeds | Yes |
| TC_PAT_BB_003 | Positive | ECG open, on patient form | Enter age = 99 (midpoint), fill all fields, submit | Form accepted; risk assessment proceeds | Yes |
| TC_PAT_BB_004 | Positive | ECG open, on patient form | Enter patient ID with exactly 6 characters, submit | Form accepted | Yes |
| TC_PAT_BB_005 | Positive | ECG open, on patient form | Enter patient ID with exactly 12 characters, submit | Form accepted | Yes |
| TC_PAT_BB_006 | Positive | ECG open, on patient form | Enter patient name with hyphen (e.g., "Mary-Jane"), submit | Form accepted | Yes |
| TC_PAT_BB_007 | Positive | ECG open, on patient form | Select gender = Male, submit | Form accepted | Yes |
| TC_PAT_BB_008 | Positive | ECG open, on patient form | Select gender = Female, submit | Form accepted | Yes |
| TC_PAT_BB_009 | Negative | ECG open, on patient form | Enter age = 17 (below minimum), attempt submit | Form rejected or submit button disabled | Yes |
| TC_PAT_BB_010 | Negative | ECG open, on patient form | Enter age = 151 (above maximum), attempt submit | Form rejected or submit button disabled | Yes |
| TC_PAT_BB_011 | Negative | ECG open, on patient form | Enter age = 0, attempt submit | Form rejected | Yes |
| TC_PAT_BB_012 | Negative | ECG open, on patient form | Enter age = -1, attempt submit | Form rejected | Yes |
| TC_PAT_BB_013 | Negative | ECG open, on patient form | Enter age = "abc" (non-numeric), attempt submit | Form rejected | Yes |
| TC_PAT_BB_014 | Negative | ECG open, on patient form | Enter age = 1000, attempt submit | Form rejected | Yes |
| TC_PAT_BB_015 | Negative | ECG open, on patient form | Enter patient name with only spaces, attempt submit | Form rejected | Yes |
| TC_PAT_BB_016 | Negative | ECG open, on patient form | Enter patient ID with 5 characters (below min), attempt submit | Form rejected or button disabled | Yes |
| TC_PAT_BB_017 | Negative | ECG open, on patient form | Enter patient ID with 13 characters (above max), attempt submit | Form rejected or button disabled | Yes |
| TC_PAT_BB_018 | Negative | ECG open, on patient form | Enter numbers-only name (e.g., "12345"), attempt submit | Form rejected | Yes |
| TC_PAT_BB_019 | Negative | ECG open, on patient form | Enter patient name > 100 characters, attempt submit | Form rejected or truncated | Yes |
| TC_PAT_BB_020 | Negative | ECG open, on patient form | Leave all fields blank, attempt submit | Cannot proceed | Yes |
| TC_PAT_BB_021 | Negative | ECG open, on patient form | Enter special characters in patient ID (e.g., `!@#$`), attempt submit | Form rejected | Yes |
| TC_PAT_BB_022 | Negative | ECG open, on patient form | Enter SQL injection in patient ID (`' OR 1=1 --`), attempt submit | No SQL error; no auth bypass | Yes |
| TC_PAT_BB_023 | Negative | ECG open, on patient form | Enter XSS in patient name (`<script>alert(1)</script>`), attempt submit | No alert fires; input sanitized | Yes |
| TC_PAT_BB_024 | Edge | ECG open, on patient form | Enter decimal age (e.g., "25.5"), attempt submit | Gracefully handled — rejected or rounded | Yes |
| TC_PAT_BB_025 | Edge | ECG open, on patient form | Enter age with leading zero (e.g., "025"), attempt submit | Gracefully handled | Yes |
| TC_PAT_BB_026 | Edge | ECG open, on patient form | Enter emoji in name field (e.g., "John 😊"), attempt submit | Gracefully handled — no crash | Yes |
| TC_PAT_BB_027 | Edge | ECG open, on patient form | Enter apostrophe in name (e.g., "O'Brien"), attempt submit | Accepted or gracefully rejected — no SQL error | Yes |
| TC_PAT_BB_028 | Edge | ECG open, on patient form | Enter Unicode/accented name (e.g., "Ñoño García"), attempt submit | Gracefully handled — no crash | Yes |
| TC_PAT_BB_029 | Edge | ECG open, on patient form | Enter spaces-only patient ID, attempt submit | Rejected | Yes |
| TC_PAT_BB_030 | Edge | ECG open, on patient form | Fill valid form, click submit twice rapidly | Only one submission triggered; no duplicate or crash | Yes |

---

### 13.3 ECG Flow — Black Box (Module 16)

| Test ID | Type | Preconditions | Steps | Expected Result | Automated |
|---------|------|---------------|-------|-----------------|-----------|
| TC_ECG_BB_001 | Positive | Logged in | Navigate to dashboard | ECG list loads with at least one item | Yes |
| TC_ECG_BB_002 | Positive | Logged in, ECGs present | View ECG card list | Date/time on cards is human-readable (not epoch/null) | Yes |
| TC_ECG_BB_003 | Positive | Logged in, ECGs present | Click first ECG item | Navigates to ECG detail/patient form | Yes |
| TC_ECG_BB_004 | Positive | Logged in, on ECG detail | Press browser back | Returns to dashboard with ECG list | Yes |
| TC_ECG_BB_005 | Positive | Logged in | Use generate-ECG helper to inject a new ECG | New ECG appears in list after reload | Yes |
| TC_ECG_BB_006 | Positive | After risk assessment | View result page | Patient name and age visible on result | Yes |
| TC_ECG_BB_007 | Positive | After risk assessment | View result page | Risk banner shows Low/Moderate/High (human-readable) | Yes |
| TC_ECG_BB_008 | Positive | After risk assessment | View result page | Waveform or ECG image present in view | Yes |
| TC_ECG_BB_009 | Positive | After risk assessment | View result page | Done button (or close action) is visible | Yes |
| TC_ECG_BB_010 | Positive | Logged in, ECG in progress | Complete ECG patient form and get risk result | Full flow completes without error | Yes |
| TC_ECG_BB_011 | Negative | Logged in | Navigate to non-existent ECG URL | Does not crash; shows redirect or not-found | Yes |
| TC_ECG_BB_012 | Negative | Logged in, ECG list visible | Click same ECG item twice rapidly | No crash; navigates correctly | Yes |
| TC_ECG_BB_013 | Negative | Not authenticated | Navigate directly to /ecgs | Redirected to /login | Yes |
| TC_ECG_BB_014 | Negative | On patient form, no data submitted | Observe risk button state | Risk/submit button disabled before patient data entered | Yes |
| TC_ECG_BB_015 | Edge | Logged in, ECG list visible | Scroll ECG list with 10+ items | List scrollable; no layout break | Yes |
| TC_ECG_BB_016 | Edge | After completing ECG flow | View result page | Patient identity (name/ID) visible in result | Yes |
| TC_ECG_BB_017 | Edge | Logged in | Load dashboard and full ECG flow | No unhandled JS console errors throughout | Yes |
| TC_ECG_BB_018 | Edge | On ECG detail page | Refresh page mid-flow | Gracefully handled — no blank crash | Yes |

---

### 13.4 UX & Accessibility — Black Box (Module 17)

| Test ID | Type | Preconditions | Steps | Expected Result | Automated |
|---------|------|---------------|-------|-----------------|-----------|
| TC_UX_BB_001 | Positive | App reachable | Navigate to /login, read page title | Page title is non-empty and not "undefined" | Yes |
| TC_UX_BB_002 | Positive | Logged in | Navigate to dashboard, read page title | Page title is non-empty | Yes |
| TC_UX_BB_003 | Positive | On login page | Enter wrong email/password, click Login | Error message is plain English — no stack trace, no "exception", no "null pointer" | Yes |
| TC_UX_BB_004 | Positive | Logged in, on profile | Click Logout button | Confirmation dialog appears with "confirm", "cancel", or "sure" | Yes |
| TC_UX_BB_005 | Positive | On login page | View login page | App version string visible somewhere in UI | Yes |
| TC_UX_BB_006 | Positive | After risk assessment | View risk result | Risk label is human-readable (Low/Moderate/High), not a numeric code | Yes |
| TC_UX_BB_007 | Positive | Logged in, ECG list visible | View ECG cards | Date/time is human-readable (year 2024-2026 or month abbreviation) | Yes |
| TC_UX_BB_008 | Positive | Logged in | Navigate to /profile | User email, name, or "tricog" is visible on profile page | Yes |
| TC_UX_BB_009 | Positive | After risk assessment | View feedback/result screen | Feedback question text is clearly worded ("12 lead", "ecg done", "feedback", or "confirm") | Yes |
| TC_UX_BB_010 | Positive | On login page | Apply 150% zoom via JS, view page | Login elements still visible; no broken layout | Yes |
| TC_UX_BB_011 | Negative | — | Navigate to /login, observe for JS errors | Zero unhandled JS page errors on login page load | Yes |
| TC_UX_BB_012 | Negative | Logged in | Load ECG dashboard, observe for JS errors | Zero unhandled JS page errors on dashboard | Yes |
| TC_UX_BB_013 | Negative | Logged in | Load ECG dashboard, read page text | No "error 500", "internal server error", or "stack trace" text visible | Yes |
| TC_UX_BB_014 | Negative | Logged in | Navigate to /does-not-exist-route-xyz | Page title is truthy — not a blank white crash | Yes |
| TC_UX_BB_015 | Edge | On login page | Inspect password input type attribute | Input type is "password" — field is masked by default | Yes |
| TC_UX_BB_016 | Edge | On login page | Fill credentials, click Login | Page title remains truthy immediately after click (loading state, no crash) | Yes |
| TC_UX_BB_017 | Edge | On login page | View login page text | "Forgot", "reset", or "password?" link/text is visible | Yes |
| TC_UX_BB_018 | Edge | After risk assessment | Complete patient form with patientId="PHICHECK01", view final URL | URL does not contain patient name, "phicheck", or encoded PHI | Yes |
| TC_UX_BB_019 | Edge | Logged in | Navigate to /profile/center-selection | Page renders with visible content (text length > 10 chars) | Yes |
| TC_UX_BB_020 | Edge | Logged in | Rapidly navigate between /ecgs, /profile, /ecgs, /profile/center-selection, /ecgs | Zero unhandled JS errors throughout rapid navigation | Yes |

---

## 14. Black Box Testing Summary

| Module | Spec File | Total Tests | Positive | Negative | Edge |
|--------|-----------|-------------|----------|----------|------|
| Authentication | 14_auth_blackbox.spec.js | 23 | 7 | 8 | 8 |
| Patient Form | 15_patient_form_blackbox.spec.js | 30 | 8 | 15 | 7 |
| ECG Flow | 16_ecg_flow_blackbox.spec.js | 18 | 10 | 4 | 4 |
| UX & Accessibility | 17_ux_accessibility_blackbox.spec.js | 20 | 10 | 4 | 6 |
| **Total** | **4 spec files** | **91** | **35** | **31** | **25** |

**Coverage Rationale:**
- All critical user-facing inputs validated at min/max/invalid boundaries
- All injection vectors (SQL, XSS, null byte, Unicode) tested in every input field
- Session handling, route protection, and PHI exposure verified
- UX quality gates (plain-English errors, readable dates, version visibility, password masking) enforced
- Zero PHI in URL parameters verified end-to-end

---

**Matrix Summary (Updated):**
| Category | Count |
|----------|-------|
| Total User Stories | 20 |
| Total Test Case IDs | ~181 |
| Automated | ~163 (90%) |
| Manual | ~18 (10%) |
| P1 Test Cases | ~87 |
| P2 Test Cases | ~64 |
| P3 Test Cases | ~30 |
| Black Box Test Cases | 91 |

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-05-04 | Wrex | Initial draft |
| 2.0 | 2026-05-06 | Wrex | Added Section 13 (Black Box Test Cases — 91 tests across 4 modules) and Section 14 (Black Box Summary); updated Matrix Summary |

*This document is maintained by the QA team and reviewed at the start of each test cycle. Changes to application architecture, user stories, or validated modules must be reflected here within 5 business days of the change.*

---

*Verification Plan — Tricog CardioCheck v1.4.0 | Prepared by Wrex for Reeva Kandroo, Tricog Health*
