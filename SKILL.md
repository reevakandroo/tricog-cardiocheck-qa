# SKILL.md — CardioCheck QA Skills Reference

Peer-shareable guide to the skills, patterns, and tools used in this QA framework.

---

## 1. Flutter Web Testing with Playwright

**Problem:** Flutter Web (CanvasKit) renders all UI on `<canvas>`. Standard DOM selectors fail — buttons, inputs, text are not in the DOM.

**Solution:** Flutter exposes an accessibility tree via `flt-semantics` elements. You must explicitly activate it.

```js
// Enable Flutter accessibility tree after every page load / navigation
async function enableFlutterA11y(page, waitMs = 2500) {
  await page.evaluate(() => {
    const ph = document.querySelector('flt-semantics-placeholder');
    if (ph) ph.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });
  await page.waitForTimeout(waitMs);
}
```

**Key Selectors:**
```js
// Inputs (appear in accessibility tree as real <input> elements)
'input[aria-label="Enter your email"]'
'input[aria-label="Patient ID *"]'

// Buttons
'flt-semantics[role="button"]:has-text("Login")'
'flt-semantics[role="button"]:has-text("Get Risk Assessment")'

// List items
'flt-semantics[role="group"] flt-semantics[role="button"]'

// Dropdown menu items
'flt-semantics[role="menuitem"][aria-label="Male"]'
```

---

## 2. Flutter-Safe Input Filling

**Problem:** `page.fill()` fails on Flutter inputs. The Flutter widget rebuild cycle detaches the DOM element after receiving input.

**Solution:** Use `pressSequentially` with per-character key events which Flutter processes correctly.

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

---

## 3. Mock ECG Generation

**Endpoint:** `POST https://mock-omron-releasev140.up.railway.app/_mock/ingest/sample`

```bash
# CLI (one-liner)
curl -X POST "https://mock-omron-releasev140.up.railway.app/_mock/ingest/sample" \
  -H "x-mock-token: mock-ingest-s3cr3t" \
  -H "content-type: application/json" \
  -d '{"omronConnectId":"86f66e18-494a-4232-8f76-530276b38d3c","risk":"high"}'

# Risk levels: "low" | "moderate" | "high"
```

```js
// Node.js helper (in tests)
async function generateECG(risk = 'high') { /* ... see helpers.js */ }
```

ECG appears in the app within ~30s (datasync worker polls every 15s).

---

## 4. Auth Flow (Cognito → UMS JWT)

1. User enters email/password → Cognito `authenticateUser()`
2. App calls `POST /v1/users/verify/login` with Cognito tokens → gets UMS JWT
3. UMS JWT stored in `flutter_secure_storage` (not accessible cookies)
4. All API calls use `Authorization: Bearer <UMS_JWT>`
5. On 401 → `refreshSession()` → re-exchange → retry original request
6. JWT TTL ~1h, Redis session cache TTL 300s

**Test Login:**
```js
await doLogin(page); // handles EULA, a11y, waits for /ecgs
```

---

## 5. Validation Rules (from source)

| Field | Rule | Error Hint |
|-------|------|------------|
| Patient ID | `^[a-zA-Z0-9]{6,12}$` | "Should use 6-12 characters" |
| Age | Integer, 18–150 | "Value must be between 18 and 150" |
| Patient Name | Optional, letters+spaces, max 100 | "Must be 100 characters or less" |
| Gender | Required: Male/Female/Other | — |

---

## 6. Boundary Value Analysis (BVA) Applied

For every numeric/length field, test: `min-1, min, min+1, max-1, max, max+1`

| Field | BVA Values Tested |
|-------|------------------|
| Patient ID length | 5, 6, 7, 11, 12, 13 chars |
| Age | 0, 17, 18, 19, 149, 150, 151 |
| Patient Name | 0, 99, 100, 101 chars |

---

## 7. Network Simulation (Playwright CDP)

```js
const client = await page.context().newCDPSession(page);

// Go offline
await client.send('Network.emulateNetworkConditions', {
  offline: true, latency: 0, downloadThroughput: 0, uploadThroughput: 0,
});

// Slow 3G (~40kbps)
await client.send('Network.emulateNetworkConditions', {
  offline: false, latency: 400,
  downloadThroughput: 40 * 1024 / 8,
  uploadThroughput:   20 * 1024 / 8,
});

// Restore
await client.send('Network.emulateNetworkConditions', {
  offline: false, latency: 0, downloadThroughput: -1, uploadThroughput: -1,
});
```

---

## 8. Security Testing Checklist

For every user-facing input field, test:
- `' OR '1'='1' --`  (SQL injection)
- `<script>alert(1)</script>` (XSS)
- `<img src=x onerror=alert(1)>` (DOM XSS)
- `' ; DROP TABLE users; --` (destructive SQL)

For auth:
- Access protected routes without session → expect redirect to /login
- Expired/deleted JWT → expect re-auth, not crash

---

## 9. HIPAA Test Patterns

1. **PHI in URL?** Capture all navigated URLs, assert no patient name/SSN appears
2. **Auth required?** Navigate to each protected route from incognito — expect /login redirect
3. **API over-exposure?** Intercept `/v1/ecgs` responses, assert no SSN/insurance fields
4. **Center isolation?** Verify `WHERE center_id IN (user's centers)` enforced — no cross-center leak

---

## 10. Running Tests

```bash
# Full suite
npm run full

# Individual modules
npm run test:login
npm run test:ecg
npm run test:patient
npm run test:risk
npm run test:security

# Generate HTML report from existing results.json
npm run report
```

---

## 11. Adding Tests for New Features

When a new feature is added to CardioCheck:

1. **Understand** — read the new Flutter screen/route + backend endpoint
2. **Add test cases** — create `test-cases/TC_NewModule/TC_NM_XXX.md` files
3. **Add spec file** — create `tests/playwright/12_new_module.spec.js`
4. **Update** `playwright.config.js` testMatch regex if needed
5. **Run** `npm run test` → `npm run report`
6. **Push** to `tricog-cardiocheck-qa` repo
7. **CI** auto-runs on push to main

---

## 12. Retry Strategy

- Playwright `retries: 2` in config (3 total attempts)
- Each retry adds variation: different timing, re-login if needed
- `robustFill()` has internal retry loop with exponential backoff
- Mock ECG polling: 6 attempts × 5s = 30s max wait

---

*Maintained by Wrex QA Agent | Tricog Engineering | Last updated: 2026-05-04*
