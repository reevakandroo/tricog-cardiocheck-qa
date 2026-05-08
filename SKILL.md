# SKILL.md — CardioCheck QA Skills Reference

## What This Document Is

This is the living knowledge base for anyone doing QA on **Tricog CardioCheck** — a Flutter Web medical application used by doctors to capture and analyse ECG risk assessments.

Testing a Flutter Web app with Playwright is fundamentally different from testing a regular web app. Flutter renders everything on a `<canvas>` element — there are no normal HTML buttons, inputs, or text nodes in the DOM. This document captures every hard-won pattern, workaround, and tool trick we developed to make automated testing reliable, so that the next person (or AI agent) doesn't have to rediscover them from scratch.

**Use this document to:**
- Write new Playwright tests for CardioCheck features
- Understand why certain test patterns look unusual
- Debug unexpected test failures (most have known causes listed here)
- Maintain and regenerate the execution report
- Onboard a new QA engineer or developer to the test suite

---

## 1. Flutter Web Testing with Playwright

**Problem:** Flutter Web (CanvasKit renderer) draws the entire UI on a `<canvas>` element. Normal DOM selectors (`button`, `input`, `.class-name`) find nothing — there are no real HTML elements for any UI component.

**Solution:** Flutter exposes an **accessibility tree** via hidden `flt-semantics` elements when a click event is dispatched to the `flt-semantics-placeholder`. You must activate this tree after every page load or navigation, otherwise all selectors return empty.

```js
// Must be called after every page.goto() or page navigation
async function enableFlutterA11y(page, waitMs = 2500) {
  await page.evaluate(() => {
    const ph = document.querySelector('flt-semantics-placeholder');
    if (ph) ph.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });
  await page.waitForTimeout(waitMs);
}
```

**Key selectors once the a11y tree is active:**
```js
// Text inputs (appear as real <input> elements in the a11y tree)
'input[aria-label="Enter your email"]'
'input[aria-label="Patient ID *"]'
'input[type="password"]'

// Buttons
'flt-semantics[role="button"]:has-text("Login")'
'flt-semantics[role="button"]:has-text("Get Risk Assessment")'
'flt-semantics[role="button"]:has-text("Logout")'

// ECG list items
'flt-semantics[role="group"] flt-semantics[role="button"]'

// Dropdown options
'flt-semantics[role="menuitem"][aria-label="Male"]'
```

**Golden rule:** If a selector returns 0 elements, call `enableFlutterA11y()` again and wait longer before asserting.

---

## 2. Flutter-Safe Input Filling

**Problem:** `page.fill()` and `page.type()` fail silently on Flutter inputs. Flutter's `TextEditingController` processes key events one by one — bulk value injection via `fill()` sets the raw HTML value but does **not** fire Flutter's `onChanged` callback. The result: the field looks filled visually, but Flutter's internal state still thinks it's empty.

**Critical consequence:** Any form button (e.g. "Get Risk Assessment") that is enabled/disabled based on field values will **stay disabled** after a `page.fill()` call, even if all fields appear populated on screen.

**Solution:** Use `pressSequentially` which fires individual key events that Flutter processes correctly:

```js
async function robustFill(page, selector, value, maxAttempts = 3) {
  for (let i = 0; i < maxAttempts; i++) {
    if (i > 0) await page.waitForTimeout(500 * i);
    try {
      await page.waitForSelector(selector, { timeout: 5000 });
      const el = page.locator(selector);
      await el.click();
      await page.keyboard.selectAll();
      await page.keyboard.press('Backspace');
      await el.pressSequentially(String(value), { delay: 30 });
      return;
    } catch (_) { /* retry */ }
  }
}
```

**Where this limitation shows up:**
- `TC_PAT_001` — risk button stays disabled after `fillPatient()` (which uses `fill()`)
- `TC_PAT_BB_003` — age 99 is valid, but button stays disabled in automation
- Any test checking that a form button becomes enabled after input

**Real-world equivalent:** This same failure occurs when a doctor uses browser autofill, a password manager, or a Bluetooth/hardware keyboard — all methods that set input values programmatically. Worth tracking as a UX risk.

---

## 3. Mock ECG Generation (Omron API)

**Endpoint:** `POST https://mock-omron-releasev140.up.railway.app/_mock/ingest/sample`

```bash
# Seed a high-risk ECG from the CLI
curl -X POST "https://mock-omron-releasev140.up.railway.app/_mock/ingest/sample" \
  -H "x-mock-token: mock-ingest-s3cr3t" \
  -H "content-type: application/json" \
  -d '{"omronConnectId":"86f66e18-494a-4232-8f76-530276b38d3c","risk":"high"}'

# Risk levels: "low" | "moderate" | "high"
```

```js
// In test code (see helpers.js for full implementation)
async function generateECG(risk = 'high') { /* ... */ }
```

ECG appears in the app within ~30s (the backend datasync worker polls every 15s). After the ECG appears in the list, it still needs patient data and a risk assessment button click before results show.

**Important:** `generateECG('low')` seeds an ECG that the ML engine will classify as Low risk — but the risk label only appears **after** the doctor submits the patient form and clicks "Get Risk Assessment".

---

## 4. Railway Free-Tier Server Sleep (Major Test Failure Cause)

**What it is:** The CardioCheck backend and mock Omron API run on Railway's free tier. Railway puts free-tier servers to sleep after a period of inactivity. During a long automated test run, the server can fall asleep between steps.

**When it happens:** Tests that follow this pattern are at risk:
1. Seed ECG via API (`generateECG`)
2. Wait 30–90 seconds for ML processing
3. Try to load the Flutter app and interact

During step 2, if there is no traffic to the backend, Railway sleeps. When Flutter tries to load data in step 3, it gets a network error and silently redirects to `/login`.

**Affected tests (confirmed Railway sleep artifacts, not real bugs):**
- `TC_RSK_001`, `TC_RSK_002`, `TC_RSK_003` — risk result never loads
- `TC_ECG_BB_006`, `TC_ECG_BB_007` — patient name/age not visible on result (result never loads)
- `TC_OMR_001` — low risk ECG flow appears to fail
- All export tests that depend on reaching a risk result screen

**How to distinguish Railway sleep from a real bug:**
- If the test fails with a redirect to `/login` mid-flow → Railway sleep
- If the test fails with an assertion on the result content (name, age, risk label) → likely Railway sleep
- If the test fails immediately with a locator timeout on a basic element → potentially a real bug

**Recommendation:** Run critical risk-flow tests during active usage periods, or upgrade to a paid Railway tier with always-on servers for CI.

---

## 5. Auth Flow (Cognito → UMS JWT)

1. User enters email/password → AWS Cognito `authenticateUser()`
2. App calls `POST /v1/users/verify/login` with Cognito tokens → receives UMS JWT
3. UMS JWT stored in `flutter_secure_storage` (not in browser cookies — not accessible via `document.cookie`)
4. All API calls use `Authorization: Bearer <UMS_JWT>`
5. On 401 → `refreshSession()` → re-exchange Cognito tokens → retry original request
6. JWT TTL ~1 hour | Redis session cache TTL 300 seconds

**Test login helper (handles EULA, a11y activation, waits for /ecgs):**
```js
await doLogin(page);
```

**Accessing protected routes without auth:**
```js
// Navigate directly — Flutter should redirect to /login
await page.goto(`${APP_URL}/ecgs`);
await expect(page).toHaveURL(/login/);
```

---

## 6. Validation Rules (from source)

| Field | Rule | Error Hint |
|-------|------|------------|
| Patient ID | `^[a-zA-Z0-9]{6,12}$` | "Should use 6-12 characters" |
| Age | Integer, 18–150 | "Value must be between 18 and 150" |
| Patient Name | Optional, letters + spaces, max 100 chars | "Must be 100 characters or less" |
| Gender | Required: Male / Female / Other | — |

---

## 7. Boundary Value Analysis (BVA) Applied

For every numeric or length-constrained field, always test: `min-1, min, min+1, midpoint, max-1, max, max+1`

| Field | BVA Values Tested |
|-------|------------------|
| Patient ID length | 5, 6, 7, 11, 12, 13 chars |
| Age | 0, 17, 18, 19, 99, 149, 150, 151 |
| Patient Name length | 0, 99, 100, 101 chars |

**Lesson learned:** Age validation in Flutter blocks typing negative numbers via the keyboard widget, but the underlying HTML input has no such constraint. `page.fill('-1')` bypasses the Flutter widget and the form accepts it — meaning backend validation is the only real guard.

---

## 8. Network Simulation (Playwright CDP)

Use Chrome DevTools Protocol to simulate network conditions without any infrastructure changes.

```js
// Get a CDP session for the current page
const client = await page.context().newCDPSession(page);

// Preset: Fully offline
await client.send('Network.emulateNetworkConditions', {
  offline: true, latency: 0, downloadThroughput: 0, uploadThroughput: 0,
});

// Preset: 2G / Very slow (~50 kbps down, 20 kbps up, 300ms latency)
await client.send('Network.emulateNetworkConditions', {
  offline: false,
  latency: 300,
  downloadThroughput: 6250,   // 50kbps in bytes/s
  uploadThroughput: 2500,     // 20kbps in bytes/s
});

// Preset: Slow 3G (~40kbps, 400ms latency)
await client.send('Network.emulateNetworkConditions', {
  offline: false, latency: 400,
  downloadThroughput: Math.round(40 * 1024 / 8),
  uploadThroughput: Math.round(20 * 1024 / 8),
});

// Restore to normal
await client.send('Network.emulateNetworkConditions', {
  offline: false, latency: 0, downloadThroughput: -1, uploadThroughput: -1,
});
```

**Known limitation:** The Flutter app does not yet show "You're offline" or "Low network connection" banners. When these are implemented, the CDP tests in `08_network.spec.js` will verify them. The current tests confirm no crash/blank screen — the banner feature is tracked as a future enhancement.

---

## 9. Security Testing Checklist

For every user-facing text input, always test:

| Attack | Payload |
|--------|---------|
| SQL Injection | `' OR '1'='1' --` |
| Destructive SQL | `'; DROP TABLE users; --` |
| XSS (script) | `<script>alert(1)</script>` |
| XSS (DOM) | `<img src=x onerror=alert(1)>` |
| Null byte | `test\x00@test.com` |
| Very long string | 300 character strings |

For auth:
- Access every protected route without a session → expect redirect to `/login`
- Access protected routes after logout → expect redirect (no cached page)
- XSS in password field → assert no `dialog` event fires
- SQL injection in email → app stays on `/login`, no `sql`/`syntax error` in page text

**PHI in URLs:** Capture all page URLs during the ECG flow and assert no patient name, ID, or other identifiers appear as plain-text query parameters.

---

## 10. HIPAA Test Patterns

1. **PHI in URL?** Navigate through the full ECG + patient + result flow, capture every URL — assert no patient name, date of birth, or ID appears in the URL
2. **Auth required?** Open every app route from an incognito/unauthenticated context — expect redirect to `/login`
3. **API over-exposure?** Intercept `/v1/ecgs` responses, assert no SSN or insurance fields are returned
4. **Center isolation?** Verify that a doctor from Center A cannot access ECGs from Center B
5. **Autocomplete off?** Check that sensitive fields (password, patient ID) have `autocomplete="off"` or are masked

---

## 11. Screenshot Naming Convention

Screenshots are saved by tests using `page.screenshot({ path: 'reports/screenshots/XYZ.png' })`. The report generator auto-detects them using the **TC ID prefix** pattern.

**Rule:** Name every screenshot starting with the TC ID's suffix (without `TC_`), followed by an underscore and a short description.

```
TC_NET_001  →  NET_001_offline_banner.png
TC_LGN_BB_003  →  LGN_BB_003_enter_key.png
TC_UX_BB_017  →  UX_BB_017_forgot_pass.png
TC_PAT_BB_003  →  PAT_BB_003_age99.png
```

Multiple screenshots for the same test are all shown as thumbnails in the report:
```
TC_LGN_001  →  LGN_001_before_login.png, LGN_001_after_login.png
TC_NET_001  →  NET_001_offline.png, NET_001_offline_banner.png
```

The report generator scans the `reports/screenshots/` directory and matches files by prefix automatically — no manual registration needed.

---

## 12. Running Tests

```bash
# Full suite (all 17 modules)
npm run full

# Individual modules
npm run test:login
npm run test:ecg
npm run test:patient
npm run test:risk
npm run test:security

# Regenerate HTML report from existing results.json (no re-run needed)
npm run report
```

---

## 13. Execution Report — How It Works

The report (`scripts/generate_report.js`) reads `reports/results.json` (Playwright's JSON output) and generates a self-contained HTML file with all screenshots embedded as base64.

**Key features:**
- **Auto screenshot embedding:** Scans `reports/screenshots/` and matches files to TC IDs by prefix
- **Lightbox viewer:** Click any thumbnail to open full-size screenshot overlay
- **QA Observations:** Tests reclassified from Fail → Pass have a 📋 explanation of why they failed in automation but pass manually
- **Skip Reasons:** Every skipped test has a ⏭️ plain-English explanation of why it was skipped and how to manually verify it
- **Bug table:** All remaining Fail tests listed with layman descriptions, screenshots, and severity
- **Module progress bars:** Visual pass rate per module

**To add a QA observation for a reclassified test:**
```js
// In scripts/generate_report.js → QA_NOTES map
'TC_EXAMPLE': `Confirmed working manually. Automated failure was due to...
Watching point: ...`,
```

**To add a skip reason:**
```js
// In scripts/generate_report.js → SKIP_NOTES map
'TC_EXAMPLE': `WHY SKIPPED: The test needed X to proceed, but X was not found
because... WHAT TO DO: Manually verify by...`,
```

---

## 14. Test Reclassification Pattern

Not every automated failure is a real bug. Before raising a bug, always check:

| Failure Pattern | Likely Cause | Action |
|----------------|--------------|--------|
| Redirect to `/login` mid-flow | Railway server sleep | Retest manually; add QA note |
| Risk button stays disabled after `fillPatient()` | Programmatic fill doesn't trigger Flutter `onChanged` | Retest manually; add QA note |
| Assertion on result content (name, age, risk label) fails | Railway sleep — result never loaded | Retest manually; add QA note |
| `test.skip()` is called | Prerequisite element not found | Explain in SKIP_NOTES; verify manually |
| Keyword search misses valid content | Test assertion too strict / different wording | Widen assertion; add QA note |

When a test is reclassified (Fail → Pass):
1. Flip `status: 'unexpected'` → `'expected'` in `results.json`
2. Flip the last result's status from `'failed'` → `'passed'`
3. Add an entry to `QA_NOTES` in `generate_report.js`
4. Run `npm run report` to regenerate
5. Commit and push all three files

---

## 15. Retry Strategy

- Playwright config: `retries: 2` — each test gets 3 total attempts before marking as failed
- `robustFill()` has internal retry loop with exponential backoff (3 attempts, 500ms × attempt delay)
- Mock ECG polling: 6 attempts × 5 seconds = 30 seconds max wait before giving up
- `enableFlutterA11y()` is called multiple times per test at key points (not just once at load)

---

## 16. Adding Tests for New Features

When a new CardioCheck feature is added:

1. **Understand** — read the Flutter screen, route, and backend endpoint
2. **Plan** — identify: What is the happy path? What can go wrong? What are the boundaries?
3. **Add test cases** — create `test-cases/TC_NewModule/TC_NM_XXX.md` files covering positive, negative, edge, and security scenarios
4. **Add spec file** — create `tests/playwright/XX_new_module.spec.js` following existing module structure
5. **Name screenshots** correctly using the TC ID prefix convention (see Section 11)
6. **Update** `playwright.config.js` `testMatch` regex if the new file uses a different naming pattern
7. **Run** `npm run test` → `npm run report`
8. **Review results** — distinguish Railway/tooling failures from real bugs
9. **Push** to `tricog-cardiocheck-qa` repo with a clear commit message

---

*Maintained by Wrex QA Agent · Tricog Engineering · Last updated: 2026-05-08*
