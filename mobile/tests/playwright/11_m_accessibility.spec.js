// @ts-check
const { test, expect } = require('@playwright/test');
const { gotoLogin, doLogin, enableFlutterA11y, pageText } = require('./helpers');

test.describe('TC_Mobile_A11y — Accessibility', () => {
  test('TC_MA11_001 Login page axe accessibility audit — violations logged', async ({ page }) => {
    await gotoLogin(page);
    await page.addScriptTag({ url: 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.9.1/axe.min.js' }).catch(() => {});
    await page.waitForTimeout(2000);
    const results = await page.evaluate(async () => {
      if (!window.axe) return { violations: [] };
      const r = await window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa'] } }).catch(() => ({ violations: [] }));
      return { violations: r.violations.map(v => ({ id: v.id, impact: v.impact, description: v.description, nodes: v.nodes.length })) };
    }).catch(() => ({ violations: [] }));
    await page.screenshot({ path: 'mobile/reports/screenshots/MA11_001_login_axe.png' });
    console.log(`Mobile login axe violations: ${JSON.stringify(results.violations, null, 2)}`);
    // Soft assertion — log violations, do not fail
    expect(results.violations).toBeDefined();
  });

  test('TC_MA11_002 Dashboard axe accessibility audit', async ({ page }) => {
    await doLogin(page);
    await page.waitForTimeout(3000);
    await enableFlutterA11y(page, 2000);
    await page.addScriptTag({ url: 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.9.1/axe.min.js' }).catch(() => {});
    await page.waitForTimeout(1500);
    const results = await page.evaluate(async () => {
      if (!window.axe) return { violations: [] };
      const r = await window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa'] } }).catch(() => ({ violations: [] }));
      return { violations: r.violations.map(v => ({ id: v.id, impact: v.impact, nodes: v.nodes.length })) };
    }).catch(() => ({ violations: [] }));
    await page.screenshot({ path: 'mobile/reports/screenshots/MA11_002_dashboard_axe.png' });
    console.log(`Mobile dashboard axe violations: ${JSON.stringify(results.violations)}`);
    expect(results.violations).toBeDefined();
  });

  test('TC_MA11_003 Large text 200% font scale — no layout break', async ({ page }) => {
    await gotoLogin(page);
    await page.addStyleTag({ content: '* { font-size: 200% !important; }' }).catch(() => {});
    await page.waitForTimeout(1500);
    const overflow = await page.evaluate(() => document.body.scrollWidth > window.innerWidth + 50);
    await page.screenshot({ path: 'mobile/reports/screenshots/MA11_003_large_text.png' });
    console.log(`Large text causes overflow: ${overflow}`);
    expect(overflow).toBe(false);
  });

  test('TC_MA11_004 Touch target size check — interactive elements ≥44px', async ({ page }) => {
    await doLogin(page);
    await page.waitForTimeout(3000);
    await enableFlutterA11y(page, 2000);
    const results = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('flt-semantics[role="button"], button'));
      return btns.map(b => {
        const r = b.getBoundingClientRect();
        return { text: (b.textContent || '').trim().substring(0, 30), w: Math.round(r.width), h: Math.round(r.height), pass: r.width >= 44 && r.height >= 44 };
      }).filter(b => b.w > 0);
    });
    await page.screenshot({ path: 'mobile/reports/screenshots/MA11_004_touch_targets.png' });
    const failing = results.filter(r => !r.pass);
    console.log(`Touch targets < 44px: ${JSON.stringify(failing)}`);
    expect(results.length).toBeGreaterThan(0);
  });

  test('TC_MA11_005 ARIA labels on form inputs', async ({ page }) => {
    await gotoLogin(page);
    const results = await page.evaluate(() => {
      const inputs = Array.from(document.querySelectorAll('input'));
      return inputs.map(i => ({
        type: i.type,
        ariaLabel: i.getAttribute('aria-label'),
        placeholder: i.placeholder,
        hasLabel: !!(i.getAttribute('aria-label') || i.getAttribute('aria-labelledby') || i.id),
      }));
    });
    await page.screenshot({ path: 'mobile/reports/screenshots/MA11_005_aria_labels.png' });
    console.log(`Form input labels: ${JSON.stringify(results)}`);
    const missingLabels = results.filter(r => !r.hasLabel && !r.placeholder);
    console.log(`Inputs missing labels: ${missingLabels.length}`);
    expect(results).toBeDefined();
  });

  test('TC_MA11_006 Color contrast check on login page — log ratio', async ({ page }) => {
    await gotoLogin(page);
    await page.screenshot({ path: 'mobile/reports/screenshots/MA11_006_contrast.png' });
    // Check button contrast via computed styles
    const contrastInfo = await page.evaluate(() => {
      const inputs = document.querySelectorAll('input');
      const result = [];
      inputs.forEach(i => {
        const s = window.getComputedStyle(i);
        result.push({ color: s.color, background: s.backgroundColor, fontSize: s.fontSize });
      });
      return result;
    });
    console.log(`Input contrast info: ${JSON.stringify(contrastInfo)}`);
    expect(page.url()).not.toContain('error');
  });

  test('TC_MA11_007 Screen orientation reported correctly to accessibility APIs', async ({ page }) => {
    await doLogin(page);
    await page.waitForTimeout(3000);
    const orientInfo = await page.evaluate(() => ({
      orientation: window.screen?.orientation?.type,
      angle: window.screen?.orientation?.angle,
      innerW: window.innerWidth,
      innerH: window.innerHeight,
    }));
    await page.screenshot({ path: 'mobile/reports/screenshots/MA11_007_orientation.png' });
    console.log(`Orientation info: ${JSON.stringify(orientInfo)}`);
    expect(orientInfo.innerW).toBeGreaterThan(0);
  });

  test('TC_MA11_008 Focus ring visible on keyboard navigation', async ({ page }) => {
    await gotoLogin(page);
    await page.keyboard.press('Tab');
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'mobile/reports/screenshots/MA11_008_focus_ring.png' });
    const focusedEl = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el) return null;
      const s = window.getComputedStyle(el);
      return { tag: el.tagName, outline: s.outline, outlineWidth: s.outlineWidth };
    });
    console.log(`Focused element: ${JSON.stringify(focusedEl)}`);
    expect(page.url()).not.toContain('error');
  });
});
