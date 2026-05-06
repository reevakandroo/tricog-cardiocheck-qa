'use strict';
/**
 * Helpers for Tricog CardioCheck v1.4.0.
 *
 * The app is Flutter Web. On domcontentloaded, the HTML form is available.
 * If the a11y tree isn't enabled, a "Enable accessibility" button appears.
 * Clicking it (or the underlying flt-semantics-placeholder) reveals form inputs.
 * Use page.fill() — NOT pressSequentially — for reliable input in this version.
 */

const https = require('https');

const APP_URL    = 'https://cardiocheck-releasev140.up.railway.app';
const LOGIN_URL  = `${APP_URL}/`;
const USERNAME   = 'reeva.kandroo+8@tricog.com';
const PASSWORD   = 'Tricog@1234';
const MOCK_URL   = 'https://mock-omron-releasev140.up.railway.app/_mock/ingest/sample';
const MOCK_TOKEN = 'mock-ingest-s3cr3t';
const OMRON_ID   = '86f66e18-494a-4232-8f76-530276b38d3c';

// ── Selectors ─────────────────────────────────────────────────────────────────
const SEL_EMAIL      = 'input[aria-label="Enter your email"], input[placeholder="Enter your email"]';
const SEL_PASSWORD   = 'input[aria-label="Enter your password"], input[placeholder="Enter your password"]';
const SEL_LOGIN_BTN  = 'button:has-text("Login")';
const SEL_A11Y_BTN   = 'button:has-text("Enable accessibility"), flt-semantics-placeholder';

// ECG list items — target list cards specifically (not app-bar icon buttons)
const SEL_ECG_ITEM   = 'flt-semantics[role="button"]:has-text("New ECG"), flt-semantics[role="button"]:has-text("ECG")';
const SEL_NEW_ECG    = 'flt-semantics:has-text("New ECG")';

// Patient form
const SEL_PATIENT_ID = 'input[aria-label*="Patient ID"], input[placeholder*="Patient ID"]';
const SEL_PAT_NAME   = 'input[aria-label*="Patient Name"], input[placeholder*="Patient Name"]';
const SEL_AGE        = 'input[aria-label*="Age"], input[placeholder*="Age"]';
const SEL_GENDER_BTN = 'button:has-text("Gender"), [aria-label*="Gender"]';
const SEL_RISK_BTN   = 'flt-semantics[role="button"]:has-text("Get Risk Assessment")';
const SEL_EXPORT_PDF = [
  'flt-semantics[role="button"][aria-label*="Export" i]',
  'flt-semantics[role="button"][aria-label*="Share" i]',
  'flt-semantics[role="button"][aria-label*="PDF" i]',
  'flt-semantics[role="button"][aria-label*="Download" i]',
  'flt-semantics[role="button"]:has-text("Export PDF")',
  'flt-semantics[role="button"]:has-text("Export")',
  'flt-semantics[role="button"]:has-text("PDF")',
  'button:has-text("Export PDF")',
].join(', ');

// ── Enable Flutter accessibility ──────────────────────────────────────────────
async function enableFlutterA11y(page, waitMs = 2500) {
  // Try clicking flt-semantics-placeholder via evaluate (works on CanvasKit)
  await page.evaluate(() => {
    const ph = document.querySelector('flt-semantics-placeholder');
    if (ph) ph.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  }).catch(() => {});

  // Also try clicking "Enable accessibility" button if it appears (Flutter 3.x HTML renderer)
  const a11yBtn = page.locator(SEL_A11Y_BTN).first();
  if (await a11yBtn.count() > 0) {
    await a11yBtn.click({ timeout: 3000 }).catch(() => {});
  }

  await page.waitForTimeout(waitMs);
}

// ── Standard fill (HTML inputs respond to page.fill) ─────────────────────────
async function robustFill(page, selector, value, maxAttempts = 3) {
  if (value === null || value === undefined) return;
  for (let i = 0; i < maxAttempts; i++) {
    if (i > 0) await page.waitForTimeout(400 * i);
    try {
      const el = page.locator(selector).first();
      await el.waitFor({ state: 'visible', timeout: 6000 });
      await el.click({ timeout: 3000 });
      await el.fill(String(value));
      // Verify value was set
      const val = await el.inputValue().catch(() => null);
      if (val === String(value)) return;
    } catch (_) { /* retry */ }
  }
}

// ── Mock ECG seeding ──────────────────────────────────────────────────────────
function generateECG(risk = 'high') {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ omronConnectId: OMRON_ID, risk });
    const req = https.request({
      hostname: 'mock-omron-releasev140.up.railway.app',
      path: '/_mock/ingest/sample',
      method: 'POST',
      headers: {
        'x-mock-token': MOCK_TOKEN,
        'content-type': 'application/json',
        'content-length': Buffer.byteLength(body),
      },
    }, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

// ── Navigate to login and activate form ───────────────────────────────────────
async function gotoLogin(page) {
  await page.goto(LOGIN_URL, { waitUntil: 'domcontentloaded', timeout: 40000 });
  await page.waitForTimeout(2500);

  // Try up to 3 times to activate Flutter a11y and reveal the login form
  for (let attempt = 0; attempt < 3; attempt++) {
    const a11yBtn = page.locator('button:has-text("Enable accessibility")');
    if (await a11yBtn.count() > 0) {
      await a11yBtn.click({ timeout: 5000 }).catch(() => {});
    } else {
      await page.evaluate(() => {
        const ph = document.querySelector('flt-semantics-placeholder');
        if (ph) ph.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      }).catch(() => {});
    }
    await page.waitForTimeout(2000);
    const emailVisible = await page.locator(SEL_EMAIL).isVisible().catch(() => false);
    if (emailVisible) break;
    // If still not visible, reload and retry
    if (attempt < 2) {
      await page.reload({ waitUntil: 'domcontentloaded' }).catch(() => {});
      await page.waitForTimeout(2000);
    }
  }

  // Wait for the email input to be ready
  await page.waitForSelector(SEL_EMAIL, { state: 'visible', timeout: 30000 });
}

// ── Robust button click — works after Flutter re-render ────────────────────────
async function clickButton(page, text, maxAttempts = 3) {
  for (let i = 0; i < maxAttempts; i++) {
    if (i > 0) await page.waitForTimeout(800);
    try {
      // Strategy 1: standard button
      const btn = page.locator(`button:has-text("${text}")`).first();
      if (await btn.count() > 0) {
        await btn.click({ timeout: 5000 });
        return;
      }
    } catch (_) {}
    try {
      // Strategy 2: flt-semantics role button
      const btn = page.locator(`flt-semantics[role="button"]:has-text("${text}")`).first();
      if (await btn.count() > 0) {
        await btn.click({ timeout: 5000 });
        return;
      }
    } catch (_) {}
    // Strategy 3: JS click by text content
    await page.evaluate((t) => {
      const btns = Array.from(document.querySelectorAll('button, [role="button"]'));
      const el = btns.find(b => (b.textContent || b.innerText || '').trim().includes(t));
      if (el) el.click();
    }, text).catch(() => {});
    await page.waitForTimeout(500);
  }
}

// ── Login ─────────────────────────────────────────────────────────────────────
async function doLogin(page, username = USERNAME, password = PASSWORD) {
  await gotoLogin(page);
  await robustFill(page, SEL_EMAIL, username);
  await robustFill(page, SEL_PASSWORD, password);
  await page.waitForTimeout(500);
  await clickButton(page, 'Login');

  // Wait until URL changes away from login
  await page.waitForURL(url => !url.href.includes('login'), { timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(1000);

  // Handle EULA
  if (page.url().includes('eula')) {
    await page.locator('button:has-text("I Agree"), button:has-text("Agree")').first()
      .click({ timeout: 5000 }).catch(() => {});
    await page.waitForURL(url => !url.href.includes('eula'), { timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(1000);
  }

  return page.url().includes('/ecg');
}

// ── Ensure on dashboard ───────────────────────────────────────────────────────
async function ensureDashboard(page) {
  if (!page.url().includes('/ecg')) {
    await page.goto(`${APP_URL}/ecgs`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(1500);
    await enableFlutterA11y(page, 1000);
  }
}

// ── Open a fresh (unprocessed) ECG ────────────────────────────────────────────
async function openFreshECG(page, risk = 'high') {
  await ensureDashboard(page);
  await page.waitForTimeout(1000);

  let hasNew = (await page.locator(SEL_NEW_ECG).count()) > 0;
  if (!hasNew) {
    await generateECG(risk);
    for (let i = 0; i < 6; i++) {
      await page.waitForTimeout(5000);
      await page.reload({ waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(1500);
      await enableFlutterA11y(page, 1000);
      if ((await page.locator(SEL_NEW_ECG).count()) > 0) { hasNew = true; break; }
    }
  }

  if (hasNew) {
    await page.locator(SEL_NEW_ECG).first().click({ timeout: 8000 });
  } else {
    await page.locator(SEL_ECG_ITEM).first().click({ timeout: 8000 }).catch(() => {});
  }
  await page.waitForTimeout(1500);
  await enableFlutterA11y(page, 1000);

  await page.waitForSelector(
    `${SEL_PATIENT_ID}, ${SEL_RISK_BTN}, button:has-text("Export PDF")`,
    { timeout: 15000 }
  ).catch(() => {});
}

// ── Fill patient form ─────────────────────────────────────────────────────────
async function fillPatient(page, { patientId = 'PT1001', name = 'John Doe', age = '45', gender = 'Male' } = {}) {
  if (patientId !== null) await robustFill(page, SEL_PATIENT_ID, patientId);
  // name and age filled AFTER gender — gender coordinate click causes Flutter re-render
  // that clears any text input filled before the dropdown interaction

  // Select gender BEFORE filling age — Flutter dropdown interaction causes re-render
  // that clears any previously typed age value
  if (gender) {
    try {
      const sel = page.locator('select').first();
      if (await sel.count() > 0) {
        await sel.selectOption({ label: gender });
      } else {
        // The gender button is flt-semantics[role=button][aria-label="Gender *"]
        // After robustFill calls reset the a11y tree, use coordinate-based click
        // Form layout (1280×800 viewport): Age x=364,y=300,w=276 | Gender x=648,y=300,w=268
        // Gender button center ≈ (782, 334)
        const genderBtnCenter = { x: 782, y: 334 };

        // Try selector first (works if a11y tree is still up)
        const gBtn = page.locator('flt-semantics[role="button"][aria-label*="Gender"], [aria-label*="Gender"]');
        if (await gBtn.count() > 0) {
          await gBtn.first().click({ timeout: 3000 }).catch(() => {});
        } else {
          // Fallback: coordinate-based click on gender button area
          await page.mouse.click(genderBtnCenter.x, genderBtnCenter.y);
        }
        await page.waitForTimeout(1000);

        // Now click the gender option. Dropdown options appear as innerText elements.
        // Option Y positions (from screenshot analysis, viewport 1280×800):
        //   Male ≈ y=333, Female ≈ y=381, Other ≈ y=430, center X ≈ 785
        const optionY = { Male: 333, Female: 381, Other: 430 };
        const targetY = optionY[gender] || 333;
        await page.mouse.click(785, targetY);
        await page.waitForTimeout(600);

        // Verify dropdown closed (Female option should no longer be visible as innerText)
        const stillOpen = await page.evaluate(() => {
          for (const el of document.querySelectorAll('*')) {
            if ((el.innerText || '').trim() === 'Female' &&
                el.getBoundingClientRect().width > 0) return true;
          }
          return false;
        });
        if (stillOpen) {
          // Last resort: click the Male text element directly
          await page.evaluate((g) => {
            for (const el of document.querySelectorAll('*')) {
              if ((el.innerText || '').trim() === g) {
                el.dispatchEvent(new MouseEvent('click', { bubbles: true }));
                break;
              }
            }
          }, gender).catch(() => {});
          await page.waitForTimeout(400);
        }
      }
    } catch (_) {}
  }

  // Fill name and age AFTER gender — safe from Flutter re-render clearing
  if (name !== null) await robustFill(page, SEL_PAT_NAME, name);
  if (age !== null)  await robustFill(page, SEL_AGE, age);
}

// ── Page text ─────────────────────────────────────────────────────────────────
async function pageText(page) {
  return page.evaluate(() => document.body.innerText || '').catch(() => '');
}

async function hasText(page, ...words) {
  const t = (await pageText(page)).toLowerCase();
  return words.every(w => t.includes(w.toLowerCase()));
}

async function hasValidationHint(page) {
  const t = (await pageText(page)).toLowerCase();
  return ['must be', 'should use', 'required', 'invalid', 'characters', 'error'].some(k => t.includes(k));
}

module.exports = {
  APP_URL, LOGIN_URL, USERNAME, PASSWORD, MOCK_URL, MOCK_TOKEN, OMRON_ID,
  SEL_EMAIL, SEL_PASSWORD, SEL_LOGIN_BTN, SEL_ECG_ITEM, SEL_NEW_ECG,
  SEL_PATIENT_ID, SEL_PAT_NAME, SEL_AGE, SEL_GENDER_BTN, SEL_RISK_BTN, SEL_EXPORT_PDF,
  enableFlutterA11y, robustFill, clickButton, generateECG,
  gotoLogin, doLogin, ensureDashboard, openFreshECG, fillPatient,
  pageText, hasText, hasValidationHint,
};
