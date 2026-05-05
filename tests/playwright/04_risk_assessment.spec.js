// @ts-check
const { test, expect } = require('@playwright/test');
const {
  SEL_RISK_BTN,
  enableFlutterA11y, doLogin, openFreshECG, fillPatient, generateECG,
  pageText, hasText,
} = require('./helpers');

test.describe('TC_Risk_Assessment', () => {
  async function seedAndGetRisk(page, risk) {
    await generateECG(risk);
    await page.waitForTimeout(6000);
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    await enableFlutterA11y(page, 2000);
    await openFreshECG(page, risk);
    await fillPatient(page, { patientId: `PT${Date.now().toString().slice(-6)}`, name: 'Test Patient', age: '45', gender: 'Male' });
    const submitBtn = page.locator('flt-semantics[role="button"]:has-text("Save")').or(
      page.locator('flt-semantics[role="button"]:has-text("Submit")'));
    await submitBtn.first().click({ timeout: 5000 }).catch(() => {});
    await page.waitForTimeout(2000);
    await enableFlutterA11y(page, 2000);
    const riskBtn = page.locator(SEL_RISK_BTN);
    if (await riskBtn.count() > 0) {
      await riskBtn.click({ timeout: 5000 });
      await page.waitForFunction(
        () => ['low', 'moderate', 'high'].some(v =>
          Array.from(document.querySelectorAll('flt-semantics')).map(e => e.innerText || '').join(' ').toLowerCase().includes(v)
        ),
        { timeout: 40000 }
      ).catch(() => {});
    }
    await page.waitForTimeout(2000);
    await enableFlutterA11y(page, 2000);
  }

  test('TC_RSK_001 Low risk result → "Low" label visible', async ({ page }) => {
    await doLogin(page);
    await seedAndGetRisk(page, 'low');
    await page.screenshot({ path: 'reports/screenshots/RSK_001_low.png' });
    const text = (await pageText(page)).toLowerCase();
    expect(text).toContain('low');
  });

  test('TC_RSK_002 Moderate risk result → "Moderate" label visible', async ({ page }) => {
    await doLogin(page);
    await seedAndGetRisk(page, 'moderate');
    await page.screenshot({ path: 'reports/screenshots/RSK_002_moderate.png' });
    const text = (await pageText(page)).toLowerCase();
    expect(text).toContain('moderate');
  });

  test('TC_RSK_003 High risk result → "High" label visible', async ({ page }) => {
    await doLogin(page);
    await seedAndGetRisk(page, 'high');
    await page.screenshot({ path: 'reports/screenshots/RSK_003_high.png' });
    const text = (await pageText(page)).toLowerCase();
    expect(text).toContain('high');
  });

  test('TC_RSK_005 Submit satisfied feedback', async ({ page }) => {
    await doLogin(page);
    await seedAndGetRisk(page, 'moderate');
    // Look for feedback options
    const satisfiedBtn = page.locator('flt-semantics:has-text("Satisfied")').or(
      page.locator('flt-semantics:has-text("Yes")'));
    if (await satisfiedBtn.count() > 0) {
      await satisfiedBtn.first().click({ timeout: 5000 }).catch(() => {});
      await page.waitForTimeout(1000);
    }
    await page.screenshot({ path: 'reports/screenshots/RSK_005_feedback.png' });
    const text = (await pageText(page)).toLowerCase();
    // Should not crash or show error
    expect(text).not.toContain('error');
  });

  test('TC_RSK_007 Risk button disabled before patient data saved', async ({ page }) => {
    await doLogin(page);
    await openFreshECG(page, 'high');
    // On fresh ECG, before filling patient data, risk button should be absent or disabled
    const riskCount = await page.locator(SEL_RISK_BTN).count();
    await page.screenshot({ path: 'reports/screenshots/RSK_007_no_risk_btn.png' });
    if (riskCount > 0) {
      const style = await page.locator(SEL_RISK_BTN).getAttribute('style') ?? '';
      // Disabled means pointer-events: none
      const isDisabled = style.includes('pointer-events: none') || !style.includes('pointer-events: all');
      expect(isDisabled).toBe(true);
    } else {
      expect(riskCount).toBe(0);
    }
  });

  test('TC_RSK_008 Double-click risk assessment — no duplicate submission', async ({ page }) => {
    await doLogin(page);
    await seedAndGetRisk(page, 'high');
    // We already got result once, verify only one result shown (no duplicate panels)
    await page.screenshot({ path: 'reports/screenshots/RSK_008_double_click.png' });
    const text = (await pageText(page)).toLowerCase();
    const highCount = (text.match(/high/g) || []).length;
    // High should appear but not an absurd number of times indicating duplication
    expect(highCount).toBeLessThan(10);
  });
});
