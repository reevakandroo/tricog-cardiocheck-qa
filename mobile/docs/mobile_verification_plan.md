# CardioCheck v1.4.0 — Mobile QA Verification Plan
**Version:** 1.0  
**Date:** 2026-05-12  
**Author:** Reeva Kandroo — QA Lead, Tricog Health  
**Status:** Active  

---

## 1. Executive Summary

This verification plan documents the end-to-end mobile QA strategy for CardioCheck v1.4.0. The primary objective is to validate all functional, security, compliance, accessibility, and performance requirements of the CardioCheck mobile experience — replicating the conditions under which a doctor in a clinic or hospital would use the application on an Android device.

CardioCheck is a Flutter-based web application deployed via Railway. It is accessed on mobile through a web browser (Chrome on Android), making Playwright mobile device emulation against the live Railway deployment the primary test execution mode. This plan covers 15 test modules, 126 test cases, and 4 test types (Positive, Negative, Edge, Security/Compliance). All tests have been designed with the Tricog testing philosophy: break the system before a real user does, verify HIPAA compliance at every layer, and document root causes — not just pass/fail outcomes.

---

## 2. Scope

### 2.1 In Scope
| # | Module ID | Module Name | Test Count | Description | Risk Level |
|---|-----------|-------------|-----------|-------------|------------|
| 1 | TC_MLGN | Mobile Login | 12 | Authentication flows, boundary inputs, security payloads | Critical |
| 2 | TC_MDSH | Mobile Dashboard | 8 | ECG list rendering, navigation, center isolation | Critical |
| 3 | TC_MPAT | Mobile Patient Form | 10 | Field validation, boundary values, input types | High |
| 4 | TC_MRSK | Mobile Risk Assessment | 8 | Risk result display, navigation, timeout handling | Critical |
| 5 | TC_MRPT | Mobile Report Export | 6 | PDF export, download, share sheet on mobile | High |
| 6 | TC_MSRC | Mobile Search | 8 | Search functionality, filtering, edge cases | Medium |
| 7 | TC_MPRF | Mobile Profile | 6 | Profile page content, logout, layout | Medium |
| 8 | TC_MGES | Mobile Gestures | 8 | Touch interactions, scroll, swipe, tap targets | Medium |
| 9 | TC_MNET | Mobile Network | 10 | Connectivity simulation, offline, 3G/4G, timeouts | High |
| 10 | TC_MORI | Mobile Orientation | 8 | Portrait/landscape rendering, rotation mid-flow | Medium |
| 11 | TC_MA11 | Mobile Accessibility | 8 | WCAG 2.1 AA compliance, axe audit, touch targets | High |
| 12 | TC_MSEC | Mobile Security | 10 | Storage, headers, injection, brute force, session | Critical |
| 13 | TC_MHPA | Mobile HIPAA | 8 | PHI storage, URL exposure, center isolation, TLS | Critical |
| 14 | TC_MPER | Mobile Performance | 8 | Load times, memory, scroll performance, TTI | Medium |
| 15 | TC_MINT | Mobile Lifecycle | 8 | Cold start, resume, refresh, deep link, rapid taps | High |
| **Total** | | | **126** | | |

### 2.2 Out of Scope
- Native Android APK testing (requires fresh signed URL from developer — current URL expired 2026-05-04)
- Push notifications (not implemented in v1.4.0)
- Biometric authentication (Android fingerprint/face unlock)
- Hardware sensor integration (beyond network simulation)
- iOS Safari testing (out of scope for this cycle)

---

## 3. Testing Approach

### 3.1 Primary Execution Mode: Playwright Mobile Emulation
All 126 test cases are automated using **Playwright with Pixel 5 device profile** against the live Railway deployment.

| Parameter | Value |
|-----------|-------|
| Device | Pixel 5 (393×851 viewport, deviceScaleFactor: 2.75) |
| Browser | Chromium (headless) |
| isMobile | true |
| hasTouch | true |
| App URL | https://cardiocheck-releasev140.up.railway.app |
| Test Runner | Playwright Test v1.44+ |
| Workers | 1 (sequential) |
| Retries | 0 |

### 3.2 Coverage Map
| Test Category | Method | Coverage |
|---------------|--------|----------|
| Functional flows | Playwright automation | ✅ Full |
| Touch gestures | `page.touchscreen.tap()`, mouse events | ✅ Full |
| Network conditions | CDP `Network.emulateNetworkConditions` | ✅ Full |
| Orientation | `page.setViewportSize()` | ✅ Full |
| Accessibility | axe-core injection + element inspection | ✅ Full |
| Security | Storage inspection, header checks, cookie audit | ✅ Full |
| HIPAA | PHI storage scan, URL inspection, TLS check | ✅ Full |
| Performance | `Date.now()` benchmarks, memory API | ✅ Full |
| Native keystore | Android Keystore / hardware-backed storage | ❌ Requires real device |
| File picker | Native Android file picker | ❌ Requires real device |
| Biometrics | Fingerprint / Face ID | ❌ Not in scope v1.4.0 |

### 3.3 Flutter Web Specifics
CardioCheck uses Flutter CanvasKit renderer. Key automation patterns:
- **A11y activation**: `flt-semantics-placeholder` must be clicked before any interaction
- **Input fill**: `page.fill()` on `input[aria-label="..."]` selectors
- **Button interaction**: `flt-semantics[role="button"]:has-text("...")`
- **Known limitation**: `page.fill()` bypasses Flutter's `onChange` event — form buttons may remain disabled in automation even when fields are filled. This is a test tooling limitation, not an app bug.

---

## 4. Environment

| Item | Value |
|------|-------|
| App URL | https://cardiocheck-releasev140.up.railway.app |
| Account A | reeva.kandroo+8@tricog.com / Tricog@1234 |
| Account B | reeva.kandroo+16@tricog.com / Tricog@1234 (different center) |
| Hosting | Railway (free tier — may sleep after 5min inactivity) |
| Flutter version | Web (CanvasKit renderer) |
| Test machine | Ubuntu 22.04, Intel i3-1115G4, 8GB RAM |
| Node version | v18+ |
| Playwright version | 1.44.0 |

### 4.1 Railway Infrastructure Note
Railway free-tier services sleep after ~5 minutes of inactivity. When the server is cold, the first 1-3 test executions may experience extended load times (30-90 seconds). This is an infrastructure limitation, not an app bug. Tests that fail solely due to Railway cold-start are **reclassified as "Infrastructure Blocked"** and re-verified manually.

---

## 5. Preconditions

| ID | Precondition | How to Verify |
|----|-------------|---------------|
| MPC_001 | Mobile browser open, network available | curl https://cardiocheck-releasev140.up.railway.app → HTTP 200 |
| MPC_002 | CardioCheck app accessible | Page loads within 30s, shows login form |
| MPC_003 | Account A credentials valid | Login succeeds with reeva.kandroo+8@tricog.com |
| MPC_004 | Account B credentials valid (different center) | Login succeeds with reeva.kandroo+16@tricog.com |
| MPC_005 | ECG records available for Account A | At least 1 seeded ECG visible on dashboard |

---

## 6. Module Descriptions

### Module 1: Mobile Login (TC_MLGN)
**Objective**: Verify that the login form works correctly on a mobile viewport (393×851), handles all boundary conditions, rejects invalid inputs, and exposes no security vulnerabilities. Validates that a doctor can log in reliably on a phone.

**Test Cases**: TC_MLGN_001–012 cover valid login, invalid credentials, empty fields, SQL injection, XSS, 300-char inputs, touch tap behavior, and brute force.

### Module 2: Mobile Dashboard (TC_MDSH)
**Objective**: Verify that the ECG list renders correctly on a mobile screen, scrollable via touch, and that each center sees only its own ECG records (data isolation).

**Test Cases**: TC_MDSH_001–008 cover dashboard load, ECG list display, pull-to-refresh, scroll, New ECG button, center isolation, long names, and back navigation.

### Module 3: Mobile Patient Form (TC_MPAT)
**Objective**: Validate all patient data entry fields on mobile: correct input acceptance, boundary values for age (1-120), rejection of invalid values, handling of special characters, and that the numeric keyboard type is used for age.

**Test Cases**: TC_MPAT_001–010 cover valid submission, age min/max/boundary, empty name, special chars, unicode, long name, and keyboard type.

### Module 4: Mobile Risk Assessment (TC_MRSK)
**Objective**: Verify that risk assessment results load and display correctly on a mobile viewport after ECG seeding, with proper back navigation, layout fit, and graceful timeout handling.

**Test Cases**: TC_MRSK_001–008 cover low/high risk load, Get Risk Assessment button, back nav, layout overflow check, scroll, network timeout, and multi-ECG list.

### Module 5: Mobile Report Export (TC_MRPT)
**Objective**: Validate that the PDF export function is accessible and functional on mobile, including touch tap behavior, download trigger, and graceful handling of slow networks.

**Test Cases**: TC_MRPT_001–006 cover export button presence, tap behavior, PDF download, unavailability without result, slow network export, and share sheet.

### Module 6: Mobile Search (TC_MSRC)
**Objective**: Verify the ECG search bar functions correctly on mobile: real-time filtering, empty state, case insensitivity, special character handling, and list restoration on clear.

**Test Cases**: TC_MSRC_001–008 cover visibility, partial match, no match, empty input, special chars, case insensitivity, real-time filtering, and clear.

### Module 7: Mobile Profile (TC_MPRF)
**Objective**: Validate that the profile page is accessible from mobile, displays key user information (email, center, version), supports logout, and fits within the mobile viewport.

**Test Cases**: TC_MPRF_001–006 cover profile access, version display, email display, center name, logout, and layout overflow.

### Module 8: Mobile Touch Gestures (TC_MGES)
**Objective**: Verify that all primary touch interactions function correctly: tap, swipe, pull-to-refresh, double-tap, long press, and that touch targets meet the 44×44dp minimum size requirement.

**Test Cases**: TC_MGES_001–008 cover single tap, swipe up/down, pull-to-refresh, double tap, long press, New ECG touch, scroll to bottom, and touch target size audit.

### Module 9: Mobile Network (TC_MNET)
**Objective**: Test app behavior under various network conditions simulated via Chrome DevTools Protocol: WiFi, 4G, 3G, offline, network recovery, slow network, server timeout, server 500 error, and cache loading.

**Test Cases**: TC_MNET_001–010 cover fast network, 4G, 3G, offline, recovery, slow loading, login timeout, server 500, airplane mode mid-flow, and cache offline.

### Module 10: Mobile Orientation (TC_MORI)
**Objective**: Validate that the app renders correctly in both portrait and landscape orientations, with no horizontal overflow, and that data is not lost when rotating the device mid-form.

**Test Cases**: TC_MORI_001–008 cover login portrait/landscape, dashboard portrait/landscape, form portrait/landscape, rotation mid-form data retention, and ECG detail in landscape.

### Module 11: Mobile Accessibility (TC_MA11)
**Objective**: Verify WCAG 2.1 AA compliance on mobile: automated axe-core audits, large text scaling, touch target sizes, ARIA labels, color contrast, and keyboard navigation focus indicators.

**Test Cases**: TC_MA11_001–008 cover login axe audit, dashboard axe audit, large text 200%, touch targets ≥44px, ARIA labels, color contrast, orientation reporting, and focus ring.

### Module 12: Mobile Security (TC_MSEC)
**Objective**: Audit security posture on mobile: JWT storage, security headers, sensitive data in URLs, HTTPS enforcement, XSS/SQL injection in forms, brute force protection, cookie security flags, PHI in console, and session invalidation after logout.

**Test Cases**: TC_MSEC_001–010 cover localStorage JWT, headers, URL params, HTTPS, XSS in patient name, SQL in search, brute force 7 attempts, cookie HttpOnly/Secure, PHI in console, and session after logout.

### Module 13: Mobile HIPAA (TC_MHPA)
**Objective**: Verify HIPAA compliance on mobile: PHI not in unencrypted storage, PHI not in URL params, minimum necessary data, TLS enforcement, cross-center isolation, session expiry, PHI not in API URLs, and PHI not via browser history.

**Test Cases**: TC_MHPA_001–008 cover storage PHI, URL PHI, minimum necessary, TLS, center isolation, session timeout, API URL PHI, and back history PHI.

### Module 14: Mobile Performance (TC_MPER)
**Objective**: Benchmark critical mobile performance metrics: login response time (<30s), dashboard load (<15s), ECG list render (<5s), search response (<3s), memory stability, rapid navigation cycles, first paint TTI, and scroll performance.

**Test Cases**: TC_MPER_001–008 cover login time, dashboard load, ECG render, search speed, memory growth, rapid nav cycles, first paint, and scroll fps.

### Module 15: Mobile App Lifecycle (TC_MINT)
**Objective**: Validate app stability across lifecycle events common on mobile: cold start, background→foreground resume, page refresh, deep link navigation, rapid taps, back button handling, browser tab switching, and heavy computation response.

**Test Cases**: TC_MINT_001–008 cover cold start, background resume, refresh, deep link, rapid taps, back button mid-form, tab switch, and slow script handling.

---

## 7. Bug Reporting Criteria

| Severity | Definition | Examples |
|----------|------------|---------|
| **Critical** | App crash, data loss, PHI exposed, auth bypass, HIPAA violation | JWT in localStorage, cross-center data leak, session not expiring |
| **High** | Feature broken, blocks primary workflow | Login fails on valid credentials, ECG list doesn't load |
| **Medium** | Feature partially broken, workaround exists | Export button invisible, search not real-time |
| **Low** | Cosmetic, minor UX issue | Text truncation, alignment off by 2px |

---

## 8. Exit Criteria

| Criterion | Threshold |
|-----------|-----------|
| Pass rate | ≥ 80% of automated tests |
| Critical bugs open | 0 (all Critical bugs must be resolved or reclassified) |
| HIPAA violations | 0 unresolved |
| Security holes | 0 unresolved Critical/High |
| Test coverage | All 15 modules executed |
| Report generated | HTML report saved to mobile/reports/ |

---

## 9. Known Limitations

| Limitation | Impact | Mitigation |
|-----------|--------|-----------|
| Flutter `onChange` bypass | Form buttons may stay disabled after programmatic fill | Marked as test tooling limitation; verified manually |
| Railway free-tier sleep | Cold-start failures on first 1-3 tests per session | Pre-warm with curl before test run; reclassify as Infrastructure Blocked |
| Canvas-based waveform | ECG waveform not readable via DOM text | Use screenshot comparison for waveform presence |
| Native Android behaviors | Hardware keystore, file picker, biometrics untestable | Documented in setup guide; requires real device |
| APK URL expired | Cannot install native APK for direct Android testing | Request fresh signed URL from developer |
| No KVM on test machine | Android emulator cannot run (no hardware virtualization) | Playwright mobile emulation covers 90%+ of functional scope |

---

## 10. Test Deliverables

| Deliverable | Location |
|-------------|----------|
| Verification Plan | mobile/docs/mobile_verification_plan.md |
| User Stories | mobile/docs/mobile_user_stories.md |
| Setup Guide | mobile/docs/mobile_setup_guide.md |
| Test Case Files | mobile/test-cases/ (126 .md files across 15 modules) |
| Playwright Specs | mobile/tests/playwright/ (15 .spec.js files) |
| Test Helpers | mobile/tests/playwright/helpers.js |
| Playwright Config | mobile/tests/playwright/playwright.config.js |
| Test Screenshots | mobile/reports/screenshots/ |
| Results JSON | mobile/reports/results.json |
| HTML Report | mobile/reports/mobile_report_YYYY-MM-DD.html |
| Report Generator | mobile/scripts/generate_mobile_report.js |

---

## 11. Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-05-12 | Reeva Kandroo | Initial mobile verification plan — 15 modules, 126 test cases, Playwright mobile emulation |
