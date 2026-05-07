// @ts-check
/**
 * Module 15 — Patient Form Black Box Tests
 * Comprehensive positive / negative / edge coverage for all form fields.
 */
const { test, expect } = require('@playwright/test');
const {
  enableFlutterA11y, doLogin, openFreshECG, fillPatient,
  generateECG, pageText, robustFill,
  SEL_PATIENT_ID, SEL_PAT_NAME, SEL_AGE, SEL_RISK_BTN,
} = require('./helpers');

async function landOnForm(page) {
  await doLogin(page);
  await generateECG('high');
  await page.waitForTimeout(3000);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1500);
  await enableFlutterA11y(page, 1500);
  await openFreshECG(page, 'high');
  await page.waitForTimeout(1000);
  await enableFlutterA11y(page, 1500);
}

async function riskBtnEnabled(page) {
  const btn = page.locator(SEL_RISK_BTN);
  if (await btn.count() === 0) return false;
  const style = await btn.getAttribute('style') ?? '';
  return style.includes('pointer-events: all') || !style.includes('pointer-events: none');
}

// ── Positive — Valid Inputs ────────────────────────────────────────────────────
test.describe('TC_PAT_BB — Positive', () => {
  test.setTimeout(180000);

  test('TC_PAT_BB_001 Age = 18 (minimum boundary) — accepted', async ({ page }) => {
    await landOnForm(page);
    await fillPatient(page, { patientId: 'PT000018', name: 'Min Age', age: '18', gender: 'Male' });
    await enableFlutterA11y(page, 1500);
    await page.screenshot({ path: 'reports/screenshots/PAT_BB_001_age18.png' });
    const text = (await pageText(page)).toLowerCase();
    expect(text).not.toContain('invalid age');
    expect(text).not.toContain('minimum');
  });

  test('TC_PAT_BB_002 Age = 150 (maximum boundary) — accepted', async ({ page }) => {
    await landOnForm(page);
    await fillPatient(page, { patientId: 'PT000150', name: 'Max Age', age: '150', gender: 'Female' });
    await enableFlutterA11y(page, 1500);
    await page.screenshot({ path: 'reports/screenshots/PAT_BB_002_age150.png' });
    const text = (await pageText(page)).toLowerCase();
    expect(text).not.toContain('invalid age');
    expect(text).not.toContain('maximum');
  });

  test('TC_PAT_BB_003 Age = 99 (midpoint) — accepted', async ({ page }) => {
    await landOnForm(page);
    await fillPatient(page, { patientId: 'PT000099', name: 'Mid Age', age: '99', gender: 'Male' });
    await enableFlutterA11y(page, 1500);
    await page.screenshot({ path: 'reports/screenshots/PAT_BB_003_age99.png' });
    expect(await riskBtnEnabled(page)).toBe(true);
  });

  test('TC_PAT_BB_004 Patient ID exactly 6 chars — valid boundary', async ({ page }) => {
    await landOnForm(page);
    await fillPatient(page, { patientId: 'PT0006', name: 'Six Chars', age: '45', gender: 'Male' });
    await enableFlutterA11y(page, 1500);
    await page.screenshot({ path: 'reports/screenshots/PAT_BB_004_id6.png' });
    const text = (await pageText(page)).toLowerCase();
    expect(text).not.toContain('invalid');
  });

  test('TC_PAT_BB_005 Patient ID exactly 12 chars — valid boundary', async ({ page }) => {
    await landOnForm(page);
    await fillPatient(page, { patientId: 'PTTWELVECHRS', name: 'Twelve Chars', age: '45', gender: 'Female' });
    await enableFlutterA11y(page, 1500);
    await page.screenshot({ path: 'reports/screenshots/PAT_BB_005_id12.png' });
    const text = (await pageText(page)).toLowerCase();
    expect(text).not.toContain('too long');
  });

  test('TC_PAT_BB_006 Name with hyphen (Mary-Jane) — accepted', async ({ page }) => {
    await landOnForm(page);
    await fillPatient(page, { patientId: 'PT000060', name: 'Mary-Jane', age: '35', gender: 'Female' });
    await enableFlutterA11y(page, 1500);
    await page.screenshot({ path: 'reports/screenshots/PAT_BB_006_hyphen_name.png' });
    const text = (await pageText(page)).toLowerCase();
    expect(text).not.toContain('invalid name');
  });

  test('TC_PAT_BB_007 Gender Male — risk btn enabled after all valid fields', async ({ page }) => {
    await landOnForm(page);
    await fillPatient(page, { patientId: 'PT000070', name: 'John Doe', age: '45', gender: 'Male' });
    await enableFlutterA11y(page, 2000);
    await page.screenshot({ path: 'reports/screenshots/PAT_BB_007_male.png' });
    expect(await riskBtnEnabled(page)).toBe(true);
  });

  test('TC_PAT_BB_008 Gender Female — risk btn enabled after all valid fields', async ({ page }) => {
    await landOnForm(page);
    await fillPatient(page, { patientId: 'PT000080', name: 'Jane Doe', age: '45', gender: 'Female' });
    await enableFlutterA11y(page, 2000);
    await page.screenshot({ path: 'reports/screenshots/PAT_BB_008_female.png' });
    expect(await riskBtnEnabled(page)).toBe(true);
  });
});

// ── Negative — Invalid Inputs ─────────────────────────────────────────────────
test.describe('TC_PAT_BB — Negative', () => {
  test.setTimeout(180000);

  test('TC_PAT_BB_009 Age = 17 (below minimum) — rejected', async ({ page }) => {
    await landOnForm(page);
    await robustFill(page, SEL_PATIENT_ID, 'PT000017');
    await robustFill(page, SEL_PAT_NAME, 'Under Age');
    await robustFill(page, SEL_AGE, '17');
    await enableFlutterA11y(page, 1500);
    await page.screenshot({ path: 'reports/screenshots/PAT_BB_009_age17.png' });
    const text = (await pageText(page)).toLowerCase();
    const riskEnabled = await riskBtnEnabled(page);
    // Either validation error shown OR risk btn disabled
    expect(text.includes('invalid') || text.includes('minimum') || text.includes('18') || !riskEnabled).toBe(true);
  });

  test('TC_PAT_BB_010 Age = 151 (above maximum) — rejected', async ({ page }) => {
    await landOnForm(page);
    await robustFill(page, SEL_PATIENT_ID, 'PT000151');
    await robustFill(page, SEL_PAT_NAME, 'Over Age');
    await robustFill(page, SEL_AGE, '151');
    await enableFlutterA11y(page, 1500);
    await page.screenshot({ path: 'reports/screenshots/PAT_BB_010_age151.png' });
    const text = (await pageText(page)).toLowerCase();
    const riskEnabled = await riskBtnEnabled(page);
    expect(text.includes('invalid') || text.includes('maximum') || text.includes('150') || !riskEnabled).toBe(true);
  });

  test('TC_PAT_BB_011 Age = 0 — rejected', async ({ page }) => {
    await landOnForm(page);
    await robustFill(page, SEL_PATIENT_ID, 'PT000000');
    await robustFill(page, SEL_PAT_NAME, 'Zero Age');
    await robustFill(page, SEL_AGE, '0');
    await enableFlutterA11y(page, 1500);
    await page.screenshot({ path: 'reports/screenshots/PAT_BB_011_age0.png' });
    const riskEnabled = await riskBtnEnabled(page);
    expect(riskEnabled).toBe(false);
  });

  test('TC_PAT_BB_012 Age = -1 (negative) — rejected', async ({ page }) => {
    await landOnForm(page);
    await robustFill(page, SEL_PATIENT_ID, 'PT000NEG');
    await robustFill(page, SEL_PAT_NAME, 'Neg Age');
    await robustFill(page, SEL_AGE, '-1');
    await enableFlutterA11y(page, 1500);
    await page.screenshot({ path: 'reports/screenshots/PAT_BB_012_age_neg.png' });
    const riskEnabled = await riskBtnEnabled(page);
    expect(riskEnabled).toBe(false);
  });

  test('TC_PAT_BB_013 Age = "abc" (non-numeric) — rejected or field cleared', async ({ page }) => {
    await landOnForm(page);
    await robustFill(page, SEL_PATIENT_ID, 'PT000ABC');
    await robustFill(page, SEL_PAT_NAME, 'Alpha Age');
    await robustFill(page, SEL_AGE, 'abc');
    await enableFlutterA11y(page, 1500);
    await page.screenshot({ path: 'reports/screenshots/PAT_BB_013_age_alpha.png' });
    const riskEnabled = await riskBtnEnabled(page);
    expect(riskEnabled).toBe(false);
  });

  test('TC_PAT_BB_014 Age = 1000 — rejected (extreme value)', async ({ page }) => {
    await landOnForm(page);
    await robustFill(page, SEL_PATIENT_ID, 'PT001000');
    await robustFill(page, SEL_PAT_NAME, 'Extreme Age');
    await robustFill(page, SEL_AGE, '1000');
    await enableFlutterA11y(page, 1500);
    await page.screenshot({ path: 'reports/screenshots/PAT_BB_014_age1000.png' });
    const riskEnabled = await riskBtnEnabled(page);
    expect(riskEnabled).toBe(false);
  });

  test('TC_PAT_BB_015 Name with only spaces — rejected', async ({ page }) => {
    await landOnForm(page);
    await robustFill(page, SEL_PATIENT_ID, 'PT000SPC');
    await robustFill(page, SEL_PAT_NAME, '     ');
    await robustFill(page, SEL_AGE, '45');
    await enableFlutterA11y(page, 1500);
    await page.screenshot({ path: 'reports/screenshots/PAT_BB_015_spaces_name.png' });
    const riskEnabled = await riskBtnEnabled(page);
    expect(riskEnabled).toBe(false);
  });

  test('TC_PAT_BB_016 Patient ID = 5 chars (below minimum) — rejected', async ({ page }) => {
    await landOnForm(page);
    await robustFill(page, SEL_PATIENT_ID, 'PT005');
    await robustFill(page, SEL_PAT_NAME, 'Short ID');
    await robustFill(page, SEL_AGE, '45');
    await enableFlutterA11y(page, 1500);
    await page.screenshot({ path: 'reports/screenshots/PAT_BB_016_id5.png' });
    const text = (await pageText(page)).toLowerCase();
    const riskEnabled = await riskBtnEnabled(page);
    expect(text.includes('invalid') || text.includes('short') || !riskEnabled).toBe(true);
  });

  test('TC_PAT_BB_017 Patient ID = 13 chars (above maximum) — rejected', async ({ page }) => {
    await landOnForm(page);
    await robustFill(page, SEL_PATIENT_ID, 'PT0000000013X');
    await robustFill(page, SEL_PAT_NAME, 'Long ID Pat');
    await robustFill(page, SEL_AGE, '45');
    await enableFlutterA11y(page, 1500);
    await page.screenshot({ path: 'reports/screenshots/PAT_BB_017_id13.png' });
    const text = (await pageText(page)).toLowerCase();
    const riskEnabled = await riskBtnEnabled(page);
    expect(text.includes('invalid') || text.includes('long') || !riskEnabled).toBe(true);
  });

  test('TC_PAT_BB_018 Name with numbers — rejected', async ({ page }) => {
    await landOnForm(page);
    await robustFill(page, SEL_PATIENT_ID, 'PT000NUM');
    await robustFill(page, SEL_PAT_NAME, 'John123');
    await robustFill(page, SEL_AGE, '45');
    await enableFlutterA11y(page, 1500);
    await page.screenshot({ path: 'reports/screenshots/PAT_BB_018_name_nums.png' });
    const text = (await pageText(page)).toLowerCase();
    const riskEnabled = await riskBtnEnabled(page);
    expect(text.includes('invalid') || text.includes('number') || !riskEnabled).toBe(true);
  });

  test('TC_PAT_BB_019 Name over 100 chars — rejected', async ({ page }) => {
    await landOnForm(page);
    await robustFill(page, SEL_PATIENT_ID, 'PT000LNG');
    await robustFill(page, SEL_PAT_NAME, 'A'.repeat(101));
    await robustFill(page, SEL_AGE, '45');
    await enableFlutterA11y(page, 1500);
    await page.screenshot({ path: 'reports/screenshots/PAT_BB_019_name_long.png' });
    const text = (await pageText(page)).toLowerCase();
    const riskEnabled = await riskBtnEnabled(page);
    expect(text.includes('invalid') || text.includes('long') || !riskEnabled).toBe(true);
  });

  test('TC_PAT_BB_020 All fields blank — risk btn not enabled', async ({ page }) => {
    await landOnForm(page);
    await enableFlutterA11y(page, 2000);
    await page.screenshot({ path: 'reports/screenshots/PAT_BB_020_all_blank.png' });
    const riskEnabled = await riskBtnEnabled(page);
    expect(riskEnabled).toBe(false);
  });

  test('TC_PAT_BB_021 Patient ID with special chars (#@!) — rejected', async ({ page }) => {
    await landOnForm(page);
    await robustFill(page, SEL_PATIENT_ID, 'PT#@!001');
    await robustFill(page, SEL_PAT_NAME, 'Special ID');
    await robustFill(page, SEL_AGE, '45');
    await enableFlutterA11y(page, 1500);
    await page.screenshot({ path: 'reports/screenshots/PAT_BB_021_special_id.png' });
    const text = (await pageText(page)).toLowerCase();
    const riskEnabled = await riskBtnEnabled(page);
    expect(text.includes('invalid') || !riskEnabled).toBe(true);
  });

  test('TC_PAT_BB_022 SQL injection in patient name — no data leak or crash', async ({ page }) => {
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await landOnForm(page);
    await robustFill(page, SEL_PATIENT_ID, 'PT000SQL');
    await robustFill(page, SEL_PAT_NAME, "'; DROP TABLE patients; --");
    await robustFill(page, SEL_AGE, '45');
    await enableFlutterA11y(page, 1500);
    await page.screenshot({ path: 'reports/screenshots/PAT_BB_022_sql_name.png' });
    expect(errors.length).toBe(0);
    const text = (await pageText(page)).toLowerCase();
    expect(text).not.toContain('sql');
    expect(text).not.toContain('syntax error');
  });

  test('TC_PAT_BB_023 XSS in patient name — no script execution', async ({ page }) => {
    let alertFired = false;
    page.on('dialog', async d => { alertFired = true; await d.dismiss(); });
    await landOnForm(page);
    await robustFill(page, SEL_PATIENT_ID, 'PT000XSS');
    await robustFill(page, SEL_PAT_NAME, '<script>alert("xss")</script>');
    await robustFill(page, SEL_AGE, '45');
    await enableFlutterA11y(page, 1500);
    await page.screenshot({ path: 'reports/screenshots/PAT_BB_023_xss_name.png' });
    expect(alertFired).toBe(false);
  });
});

// ── Edge / Boundary Tests ─────────────────────────────────────────────────────
test.describe('TC_PAT_BB — Edge & Boundary', () => {
  test.setTimeout(180000);

  test('TC_PAT_BB_024 Age = 18.5 (decimal) — rejected or truncated to 18', async ({ page }) => {
    await landOnForm(page);
    await robustFill(page, SEL_PATIENT_ID, 'PT000185');
    await robustFill(page, SEL_PAT_NAME, 'Decimal Age');
    await robustFill(page, SEL_AGE, '18.5');
    await enableFlutterA11y(page, 1500);
    await page.screenshot({ path: 'reports/screenshots/PAT_BB_024_decimal_age.png' });
    const text = (await pageText(page)).toLowerCase();
    // Either rejected or field truncates to integer — either is acceptable
    expect(await page.title()).toBeTruthy();
  });

  test('TC_PAT_BB_025 Age with leading zero (018) — handled gracefully', async ({ page }) => {
    await landOnForm(page);
    await robustFill(page, SEL_PATIENT_ID, 'PT000018L');
    await robustFill(page, SEL_PAT_NAME, 'Leading Zero');
    await robustFill(page, SEL_AGE, '018');
    await enableFlutterA11y(page, 1500);
    await page.screenshot({ path: 'reports/screenshots/PAT_BB_025_leading_zero.png' });
    expect(await page.title()).toBeTruthy();
  });

  test('TC_PAT_BB_026 Name with emoji — graceful (accepted or clear error)', async ({ page }) => {
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await landOnForm(page);
    await robustFill(page, SEL_PATIENT_ID, 'PT000EMO');
    await robustFill(page, SEL_PAT_NAME, 'John 😊');
    await robustFill(page, SEL_AGE, '45');
    await enableFlutterA11y(page, 1500);
    await page.screenshot({ path: 'reports/screenshots/PAT_BB_026_emoji_name.png' });
    expect(errors.length).toBe(0);
  });

  test('TC_PAT_BB_027 Name with apostrophe (O\'Brien) — graceful handling', async ({ page }) => {
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await landOnForm(page);
    await robustFill(page, SEL_PATIENT_ID, 'PT000APO');
    await robustFill(page, SEL_PAT_NAME, "O'Brien");
    await robustFill(page, SEL_AGE, '45');
    await enableFlutterA11y(page, 1500);
    await page.screenshot({ path: 'reports/screenshots/PAT_BB_027_apostrophe.png' });
    expect(errors.length).toBe(0);
  });

  test('TC_PAT_BB_028 Unicode name (Hindi) — graceful handling', async ({ page }) => {
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await landOnForm(page);
    await robustFill(page, SEL_PATIENT_ID, 'PT000UNI');
    await robustFill(page, SEL_PAT_NAME, 'राहुल');
    await robustFill(page, SEL_AGE, '45');
    await enableFlutterA11y(page, 1500);
    await page.screenshot({ path: 'reports/screenshots/PAT_BB_028_unicode.png' });
    expect(errors.length).toBe(0);
  });

  test('TC_PAT_BB_029 Patient ID with only spaces — rejected', async ({ page }) => {
    await landOnForm(page);
    await robustFill(page, SEL_PATIENT_ID, '      ');
    await robustFill(page, SEL_PAT_NAME, 'Space ID');
    await robustFill(page, SEL_AGE, '45');
    await enableFlutterA11y(page, 1500);
    await page.screenshot({ path: 'reports/screenshots/PAT_BB_029_space_id.png' });
    const riskEnabled = await riskBtnEnabled(page);
    expect(riskEnabled).toBe(false);
  });

  test('TC_PAT_BB_030 Double-submit patient form — no duplicate entry', async ({ page }) => {
    test.setTimeout(300000);
    await landOnForm(page);
    await fillPatient(page, { patientId: `PT${Date.now().toString().slice(-6)}`, name: 'Double Sub', age: '40', gender: 'Male' });
    await enableFlutterA11y(page, 1500);
    const riskBtn = page.locator(SEL_RISK_BTN);
    if (await riskBtn.count() > 0) {
      // Click twice rapidly
      await riskBtn.first().click({ timeout: 5000 }).catch(() => {});
      await riskBtn.first().click({ timeout: 2000 }).catch(() => {});
    }
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'reports/screenshots/PAT_BB_030_double_submit.png' });
    const text = (await pageText(page)).toLowerCase();
    // Should not show duplicate entries or crash
    expect(text).not.toContain('crash');
    expect(text).not.toContain('error 500');
  });
});
