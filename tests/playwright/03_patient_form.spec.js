// @ts-check
const { test, expect } = require('@playwright/test');
const {
  SEL_PATIENT_ID, SEL_PAT_NAME, SEL_AGE, SEL_RISK_BTN,
  enableFlutterA11y, robustFill, doLogin,
  openFreshECG, fillPatient, pageText, hasValidationHint, hasText,
} = require('./helpers');

test.describe('TC_Patient_Info — Patient Form Validation', () => {
  test.beforeEach(async ({ page }) => {
    await doLogin(page);
    await openFreshECG(page, 'high');
  });

  test('TC_PAT_001 Valid patient details — risk button enabled', async ({ page }) => {
    await fillPatient(page, { patientId: 'PT10012', name: 'John Doe', age: '45', gender: 'Male' });
    await page.screenshot({ path: 'reports/screenshots/PAT_001_valid.png' });
    // Submit
    const submitBtn = page.locator('flt-semantics[role="button"]:has-text("Save")').or(
      page.locator('flt-semantics[role="button"]:has-text("Submit")'));
    if (await submitBtn.count() > 0) await submitBtn.first().click({ timeout: 5000 }).catch(() => {});
    await page.waitForTimeout(3000);
    await enableFlutterA11y(page, 2000);
    const riskBtn = await page.locator(SEL_RISK_BTN).count();
    await page.screenshot({ path: 'reports/screenshots/PAT_001_after_submit.png' });
    expect(riskBtn).toBeGreaterThan(0);
  });

  test('TC_PAT_003 Patient ID too short (5 chars) → validation error', async ({ page }) => {
    await robustFill(page, SEL_PATIENT_ID, 'ABCDE');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'reports/screenshots/PAT_003_short_id.png' });
    const hint = await hasValidationHint(page);
    const text = (await pageText(page)).toLowerCase();
    expect(hint || text.includes('6')).toBe(true);
  });

  test('TC_PAT_004 Patient ID too long (13 chars) → validation error', async ({ page }) => {
    await robustFill(page, SEL_PATIENT_ID, 'ABCDEF1234567');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'reports/screenshots/PAT_004_long_id.png' });
    const hint = await hasValidationHint(page);
    const text = (await pageText(page)).toLowerCase();
    expect(hint || text.includes('12')).toBe(true);
  });

  test('TC_PAT_005 Patient ID with special chars → validation error', async ({ page }) => {
    await robustFill(page, SEL_PATIENT_ID, 'PT-001!');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'reports/screenshots/PAT_005_special_chars.png' });
    const hint = await hasValidationHint(page);
    expect(hint).toBe(true);
  });

  test('TC_PAT_006 Patient ID exactly 6 chars → valid (boundary)', async ({ page }) => {
    await fillPatient(page, { patientId: 'ABCDEF', name: 'Test User', age: '30', gender: 'Female' });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'reports/screenshots/PAT_006_6chars.png' });
    const hint = await hasValidationHint(page);
    // With exactly 6 valid chars, no validation error expected
    const text = (await pageText(page)).toLowerCase();
    const hasIdError = text.includes('should use 6-12');
    expect(hasIdError).toBe(false);
  });

  test('TC_PAT_007 Patient ID exactly 12 chars → valid (boundary)', async ({ page }) => {
    await fillPatient(page, { patientId: 'ABCDEF123456', name: 'Test', age: '25', gender: 'Male' });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'reports/screenshots/PAT_007_12chars.png' });
    const text = (await pageText(page)).toLowerCase();
    expect(text.includes('should use 6-12')).toBe(false);
  });

  test('TC_PAT_009 Age below 18 → validation error', async ({ page }) => {
    await robustFill(page, SEL_AGE, '17');
    await page.waitForTimeout(800);
    await page.screenshot({ path: 'reports/screenshots/PAT_009_age_17.png' });
    const text = (await pageText(page)).toLowerCase();
    expect(text.includes('18') || text.includes('must be between')).toBe(true);
  });

  test('TC_PAT_010 Age exactly 18 → valid (boundary)', async ({ page }) => {
    await fillPatient(page, { patientId: 'PT1001A', name: 'Min Age', age: '18', gender: 'Male' });
    await page.waitForTimeout(800);
    await page.screenshot({ path: 'reports/screenshots/PAT_010_age_18.png' });
    const text = (await pageText(page)).toLowerCase();
    expect(text.includes('must be between')).toBe(false);
  });

  test('TC_PAT_011 Age exactly 150 → valid (boundary)', async ({ page }) => {
    await fillPatient(page, { patientId: 'PT1001B', name: 'Max Age', age: '150', gender: 'Female' });
    await page.waitForTimeout(800);
    await page.screenshot({ path: 'reports/screenshots/PAT_011_age_150.png' });
    const text = (await pageText(page)).toLowerCase();
    expect(text.includes('must be between')).toBe(false);
  });

  test('TC_PAT_012 Age 151 → validation error', async ({ page }) => {
    await robustFill(page, SEL_AGE, '151');
    await page.waitForTimeout(800);
    await page.screenshot({ path: 'reports/screenshots/PAT_012_age_151.png' });
    const text = (await pageText(page)).toLowerCase();
    expect(text.includes('150') || text.includes('must be between')).toBe(true);
  });

  test('TC_PAT_013 Age zero → validation error', async ({ page }) => {
    await robustFill(page, SEL_AGE, '0');
    await page.waitForTimeout(800);
    await page.screenshot({ path: 'reports/screenshots/PAT_013_age_0.png' });
    const text = (await pageText(page)).toLowerCase();
    expect(text.includes('18') || text.includes('must be between')).toBe(true);
  });

  test('TC_PAT_014 Negative age → validation error', async ({ page }) => {
    await robustFill(page, SEL_AGE, '-1');
    await page.waitForTimeout(800);
    await page.screenshot({ path: 'reports/screenshots/PAT_014_neg_age.png' });
    const text = (await pageText(page)).toLowerCase();
    expect(text.includes('must be between') || text.includes('invalid')).toBe(true);
  });

  test('TC_PAT_016 Name with numbers → validation error', async ({ page }) => {
    await robustFill(page, SEL_PAT_NAME, 'John123');
    await page.waitForTimeout(800);
    await page.screenshot({ path: 'reports/screenshots/PAT_016_name_numbers.png' });
    const hint = await hasValidationHint(page);
    expect(hint).toBe(true);
  });

  test('TC_PAT_018 Name over 100 chars → validation error', async ({ page }) => {
    await robustFill(page, SEL_PAT_NAME, 'A'.repeat(101));
    await page.waitForTimeout(800);
    await page.screenshot({ path: 'reports/screenshots/PAT_018_long_name.png' });
    const text = (await pageText(page)).toLowerCase();
    expect(text.includes('100') || text.includes('must be 100')).toBe(true);
  });

  test('TC_PAT_019 Emoji in name → handled gracefully', async ({ page }) => {
    let crashed = false;
    page.on('pageerror', () => { crashed = true; });
    await robustFill(page, SEL_PAT_NAME, 'John 😀 Doe');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'reports/screenshots/PAT_019_emoji.png' });
    expect(crashed).toBe(false);
  });
});
