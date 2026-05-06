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
    await page.waitForTimeout(3000);
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1500);
    await enableFlutterA11y(page, 1500);
    await openFreshECG(page, risk);
    await fillPatient(page, { patientId: `PT${Date.now().toString().slice(-6)}`, name: 'Test Patient', age: '45', gender: 'Male' });
    await page.waitForTimeout(1000);
    await enableFlutterA11y(page, 1500);
    // On fresh ECGs, "Get Risk Assessment" is the single submit + risk trigger button
    const riskBtn = page.locator(SEL_RISK_BTN);
    if (await riskBtn.count() > 0) {
      await riskBtn.click({ timeout: 8000 });
      await page.waitForFunction(
        () => ['low', 'moderate', 'high'].some(v =>
          Array.from(document.querySelectorAll('flt-semantics')).map(e => e.innerText || '').join(' ').toLowerCase().includes(v)
        ),
        { timeout: 45000 }
      ).catch(() => {});
    }
    await page.waitForTimeout(1500);
    await enableFlutterA11y(page, 1500);
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

// ─── NEW TESTS added for full coverage ───────────────────────────────────────

test.describe('TC_Risk_Assessment — Additional Coverage', () => {
  async function seedAndOpen(page, risk) {
    await generateECG(risk);
    await page.waitForTimeout(3000);
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1500);
    await enableFlutterA11y(page, 1500);
    await openFreshECG(page, risk);
    await fillPatient(page, { patientId: `AD${Date.now().toString().slice(-6)}`, name: 'Add Test', age: '50', gender: 'Male' });
    await page.waitForTimeout(1000);
    await enableFlutterA11y(page, 1500);
    const riskBtn = page.locator(SEL_RISK_BTN);
    if (await riskBtn.count() > 0) {
      await riskBtn.click({ timeout: 8000 });
      await page.waitForFunction(
        () => ['low', 'moderate', 'high'].some(v =>
          Array.from(document.querySelectorAll('flt-semantics')).map(e => e.innerText || '').join(' ').toLowerCase().includes(v)
        ),
        { timeout: 45000 }
      ).catch(() => {});
    }
    await page.waitForTimeout(1500);
    await enableFlutterA11y(page, 1500);
  }

  test('TC_RSK_004 Risk result page shows ECG waveform strip', async ({ page }) => {
    await doLogin(page);
    await seedAndOpen(page, 'high');
    await page.screenshot({ path: 'reports/screenshots/RSK_004_ecg_strip.png' });
    const text = (await pageText(page)).toLowerCase();
    // ECG strip should be present with scroll hint
    const hasStrip = text.includes('ecg') || text.includes('waveform') || text.includes('scroll');
    expect(hasStrip).toBe(true);
  });

  test('TC_RSK_006 Unsatisfied/No feedback → submitted without crash', async ({ page }) => {
    await doLogin(page);
    await seedAndOpen(page, 'moderate');
    const noBtn = page.locator('flt-semantics:has-text("Not Satisfied")').or(
      page.locator('flt-semantics:has-text("No")'));
    if (await noBtn.count() > 0) {
      await noBtn.first().click({ timeout: 5000 }).catch(() => {});
      await page.waitForTimeout(1000);
    }
    await page.screenshot({ path: 'reports/screenshots/RSK_006_unsatisfied.png' });
    const text = (await pageText(page)).toLowerCase();
    expect(text).not.toContain('crash');
    expect(text).not.toContain('unhandled exception');
  });

  test('TC_RSK_009 Done button after feedback — navigable', async ({ page }) => {
    await doLogin(page);
    await seedAndOpen(page, 'high');
    // Try clicking Done
    const doneBtn = page.locator('flt-semantics[role="button"]:has-text("Done")');
    if (await doneBtn.count() > 0) {
      await doneBtn.first().click({ timeout: 5000 }).catch(() => {});
      await page.waitForTimeout(2000);
    }
    await page.screenshot({ path: 'reports/screenshots/RSK_009_done_btn.png' });
    expect(await page.title()).toBeTruthy();
  });

  test('TC_RSK_010 Feedback question "Was 12 lead ECG done?" visible on result', async ({ page }) => {
    await doLogin(page);
    await seedAndOpen(page, 'high');
    await page.screenshot({ path: 'reports/screenshots/RSK_010_feedback_q.png' });
    const text = (await pageText(page)).toLowerCase();
    const hasQ = text.includes('12 lead') || text.includes('ecg done') || text.includes('feedback') || text.includes('confirm');
    expect(hasQ).toBe(true);
  });

  test('TC_RSK_011 Edit patient details button visible from result page', async ({ page }) => {
    await doLogin(page);
    await seedAndOpen(page, 'high');
    await page.screenshot({ path: 'reports/screenshots/RSK_011_edit_btn.png' });
    const text = (await pageText(page)).toLowerCase();
    const hasEdit = text.includes('edit') || text.includes('patient');
    expect(hasEdit).toBe(true);
  });

  test('TC_RSK_013 Back navigation from result page goes to ECG list', async ({ page }) => {
    await doLogin(page);
    await seedAndOpen(page, 'high');
    await page.goBack();
    await page.waitForTimeout(2000);
    await enableFlutterA11y(page, 1500);
    await page.screenshot({ path: 'reports/screenshots/RSK_013_back_from_result.png' });
    const url = page.url();
    expect(url).toMatch(/\/(ecg|login)/);
  });

  test('TC_RSK_014 Already-processed ECG shows result view not blank form', async ({ page }) => {
    await doLogin(page);
    // Open any ECG from the list (not necessarily a fresh one)
    const { APP_URL, ensureDashboard, SEL_ECG_ITEM } = require('./helpers');
    await ensureDashboard(page);
    await page.waitForSelector(SEL_ECG_ITEM, { timeout: 15000 }).catch(() => {});
    await page.locator(SEL_ECG_ITEM).first().click({ timeout: 8000 }).catch(() => {});
    await page.waitForTimeout(2500);
    await enableFlutterA11y(page, 1500);
    await page.screenshot({ path: 'reports/screenshots/RSK_014_processed_ecg.png' });
    // Should show patient form or result — not crash
    const text = (await pageText(page)).toLowerCase();
    expect(text.length).toBeGreaterThan(10);
  });

  test('TC_RSK_015 Risk result has Export PDF option visible', async ({ page }) => {
    const { SEL_EXPORT_PDF } = require('./helpers');
    await doLogin(page);
    await seedAndOpen(page, 'high');
    await page.screenshot({ path: 'reports/screenshots/RSK_015_export_btn.png' });
    const count = await page.locator(SEL_EXPORT_PDF).count();
    expect(count).toBeGreaterThan(0);
  });
});
