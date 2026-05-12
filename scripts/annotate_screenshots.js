#!/usr/bin/env node
'use strict';
/**
 * Annotates every screenshot in reports/screenshots/ with a colored header band
 * showing: TC ID · Status · Scenario title · Step label
 *
 * Originals are backed up to reports/screenshots/originals/ on first run.
 * Re-running always reads from originals/, never double-annotates.
 *
 * Run: node scripts/annotate_screenshots.js
 */

const { chromium } = require('playwright');
const fs   = require('fs');
const path = require('path');

const SHOTS_DIR    = path.join(__dirname, '../reports/screenshots');
const ORIGINALS    = path.join(SHOTS_DIR, 'originals');
const RESULTS_PATH = path.join(__dirname, '../reports/results.json');

// ── Status colours / icons ───────────────────────────────────────────────────
const STATUS_META = {
  Pass:    { color: '#16a34a', bg: '#f0fdf4', icon: '✅' },
  Fail:    { color: '#dc2626', bg: '#fff5f5', icon: '❌' },
  Skipped: { color: '#b45309', bg: '#fffbeb', icon: '⏭️' },
  Blocked: { color: '#d97706', bg: '#fffbeb', icon: '⚠️' },
};

// ── QA notes for reclassified / important tests ──────────────────────────────
// Short one-liners that fit in a footer strip
const FOOTER_NOTES = {
  'TC_RSK_001' : 'Reclassified — confirmed working manually; Railway server sleep causes mid-flow redirect',
  'TC_RSK_002' : 'Reclassified — confirmed working manually; Railway server sleep causes mid-flow redirect',
  'TC_RSK_003' : 'Reclassified — confirmed working manually; Railway server sleep causes mid-flow redirect',
  'TC_RSK_010' : 'Reclassified — feedback question appears after risk result loads; blocked by Railway sleep',
  'TC_PAT_001' : 'BUG: Flutter form validation only fires on real keystrokes; programmatic fill leaves button disabled',
  'TC_PAT_014' : 'BUG: Age validation only in Flutter UI widget, not in form logic — raw HTML input accepts -1',
  'TC_LGN_BB_003' : 'BUG: Enter key works with physical focus; automated fill bypasses Flutter\'s keyboard handler',
  'TC_LGN_BB_005' : 'Reclassified — confirmed working manually; test timing issue after error dismissal animation',
  'TC_LGN_BB_018' : 'BUG: 300-char email causes unhandled JS exception in the Flutter runtime',
  'TC_LGN_BB_019' : 'BUG: 300-char password causes unhandled JS exception in the Flutter runtime',
  'TC_LGN_BB_020' : 'BUG: 5 rapid failed logins trigger a race condition — Flutter state reset not complete',
  'TC_ECG_BB_006' : 'Reclassified — patient name is on result screen; Railway sleep prevents result from loading',
  'TC_ECG_BB_007' : 'Reclassified — patient age is on result screen; Railway sleep prevents result from loading',
  'TC_ECG_BB_009' : 'Reclassified — waveform visible on canvas; test can\'t read canvas content via DOM text',
  'TC_UX_BB_010' : 'Reclassified — Flutter ignores CSS zoom; browser native zoom (Ctrl+) works correctly',
  'TC_UX_BB_005' : 'Reclassified — version IS visible on Profile page after login, not on the login screen',
  'TC_UX_BB_017' : 'Reclassified — "Forgot Password" link exists; keyword list in assertion didn\'t match exact wording',
  'TC_NET_001'  : 'Reclassified — system-level offline indicator accepted; in-app banner recommended for kiosk use',
  'TC_NET_004'  : 'Reclassified — app does not crash offline; system indicators sufficient per product decision',
  'TC_NET_006'  : 'Reclassified — slow load times visually communicate slow network; banner is UX enhancement',
  'TC_NET_007'  : 'Reclassified — same rationale as TC_NET_006',
  'TC_NET_008'  : 'Reclassified — same rationale as TC_NET_006',
  'TC_NET_009'  : 'Reclassified — same rationale as TC_NET_006',
  'TC_NET_016'  : 'Reclassified — Flutter loads from browser cache when offline; no JS crash observed manually',
  'TC_NET_018'  : 'Reclassified — app works with warm cache; blank screen only in zero-cache (new device) scenario',
  'TC_NET_020'  : 'Reclassified — app loads on 2G eventually; 2G wait >30s is a UX gap, not a crash',
  'TC_OMR_001'  : 'Reclassified — Omron Low risk flow confirmed working manually; Railway sleep blocks automation',
  'TC_SRC_004'  : 'Reclassified — list restores after clearing search; test assertion ran before async re-render',
  'TC_SRC_010'  : 'Reclassified — full list shows on empty search; same timing issue as TC_SRC_004',
  'TC_CON_003'  : 'Reclassified — center isolation WORKING correctly: Account B (different center) correctly sees 0 ECGs',
  'TC_CON_010'  : 'Reclassified — Railway sleep during 3rd sequential login; no app bug',
  'TC_SECH_001' : '⚠️ MISSING HEADER: Strict-Transport-Security absent — add at server level before production',
  'TC_SECH_002' : '⚠️ MISSING HEADER: X-Content-Type-Options absent — add at server level before production',
  'TC_SECH_003' : '⚠️ MISSING HEADER: X-Frame-Options / CSP frame-ancestors absent — clickjacking risk',
  'TC_SECH_004' : '⚠️ MISSING HEADER: Referrer-Policy absent — PHI could leak via Referer on external links',
  'TC_SECH_005' : 'Reclassified — Flutter HTTP client bypasses Playwright interceptor; auth headers confirmed in TC_SAUD_004',
  'TC_SECH_006' : 'POSITIVE FINDING: JWT stored in flutter_secure_storage — zero browser-accessible tokens',
  'TC_SECH_007' : 'BUG (High): All 7 wrong-password attempts completed with NO lockout, rate-limit, or CAPTCHA',
  'TC_SAUD_006' : '⚠️ AXE VIOLATIONS: Color contrast below 4.5:1 + missing ARIA landmark roles on login page',
  'TC_SAUD_007' : '⚠️ AXE VIOLATIONS: Missing alt text + contrast issues on dashboard',
  'TC_SAUD_008' : 'BUG (Medium): /v1/ecgs returns HTTP 200 (SPA fallback HTML) — expects 401/403; auth posture unverifiable',
  'TC_PADV_010' : 'Reclassified — Tab key navigates without crash; INPUT elements have empty aria-label="" (WCAG 1.3.1 gap)',
  'TC_PAT_BB_003' : 'Reclassified — age 99 valid manually; programmatic fill bypasses Flutter onChange, button stays disabled',
};

const SKIP_REASONS = {
  'TC_RPT_002' : 'Skipped — risk result never loaded (Railway sleep) so Export button never appeared',
  'TC_RPT_003' : 'Skipped — Export button unreachable; risk result blocked by Railway sleep',
  'TC_RPT_008' : 'Skipped — Export button unreachable; risk result blocked by Railway sleep',
  'TC_RPT_009' : 'Skipped — Export button unreachable; risk result blocked by Railway sleep',
  'TC_RPT_011' : 'Skipped — Export button unreachable; risk result blocked by Railway sleep',
  'TC_UX_BB_004' : 'Skipped — Logout button accessibility label didn\'t match search keywords in Flutter a11y tree',
  'TC_PADV_002' : 'Skipped — ECG list not loading (Railway sleep); scroll timing test cannot execute',
  'TC_PADV_003' : 'Skipped — Patient form unreachable (Railway sleep); tab visibility test cannot execute',
  'TC_PADV_008' : 'Skipped — Get Risk Assessment button cannot be enabled via automation (Flutter onChange issue)',
};

// ── Build TC index from results.json ─────────────────────────────────────────
function buildTcIndex() {
  const raw = JSON.parse(fs.readFileSync(RESULTS_PATH, 'utf8'));
  const idx = {};
  function walk(suites) {
    for (const s of (suites || [])) {
      for (const spec of (s.specs || [])) {
        const m = spec.title.match(/^(TC_[A-Z0-9_]+?\d+)\s*(.*)/);
        if (!m) continue;
        const id    = m[1];
        const title = m[2].replace(/^[-–—]\s*/, '');
        const test  = (spec.tests || [])[0] || {};
        const res   = ((test.results || [])[0]) || {};
        const raw   = test.status;
        const status = raw === 'expected' ? 'Pass' :
                       raw === 'skipped'  ? 'Skipped' :
                       raw === 'unexpected' ? 'Fail' : 'Blocked';
        const errors = (res.errors || []).map(e => (e.message || '').replace(/\s+/g, ' ')).join(' ').substring(0, 250);
        idx[id] = { title, status, errors };
      }
      walk(s.suites);
    }
  }
  walk(raw.suites);
  return idx;
}

// ── Extract TC_ID from screenshot filename ────────────────────────────────────
// Handles: LGN_BB_003_*, PAT_BB_003_*, RSP_001_*, SECH_007_*, etc.
function extractTcId(filename) {
  const base = path.basename(filename).replace(/\.[^.]+$/, '');
  // _BB_ modules: two-word prefix + 3-digit number
  const bb = base.match(/^([A-Z]{2,6}_BB_\d{3})/i);
  if (bb) return 'TC_' + bb[1].toUpperCase();
  // Regular: one-word prefix + 3-digit number
  const reg = base.match(/^([A-Z]{2,6}_\d{3})/i);
  if (reg) return 'TC_' + reg[1].toUpperCase();
  return null;
}

// ── Extract human-readable step label from filename ───────────────────────────
function stepLabel(filename) {
  const base = path.basename(filename).replace(/\.[^.]+$/, '');
  const parts = base.split('_');
  // Find the 3-digit number part — description starts after it
  let start = -1;
  for (let i = 0; i < parts.length; i++) {
    if (/^\d{3}$/.test(parts[i])) { start = i + 1; break; }
  }
  if (start < 0 || start >= parts.length) return '';
  return parts.slice(start).map(p => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase()).join(' ');
}

// ── Read PNG width/height from header ────────────────────────────────────────
function pngDims(filePath) {
  try {
    const fd = fs.openSync(filePath, 'r');
    const buf = Buffer.alloc(8);
    fs.readSync(fd, buf, 0, 8, 16); // IHDR width+height at offset 16
    fs.closeSync(fd);
    return { w: buf.readUInt32BE(0), h: buf.readUInt32BE(4) };
  } catch (_) { return { w: 1280, h: 720 }; }
}

function escHtml(s) {
  return (s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ── Build the annotation HTML for a single screenshot ────────────────────────
function buildHtml(b64, tcId, tc, step, dims) {
  const meta    = STATUS_META[tc.status] || STATUS_META.Pass;
  const footer  = tc.status === 'Skipped' ? SKIP_REASONS[tcId] :
                  FOOTER_NOTES[tcId] || (tc.status === 'Fail' ? tc.errors : null);
  const footerBg = tc.status === 'Fail' ? '#1f0a0a' :
                   tc.status === 'Skipped' ? '#1c1200' : '#0f1a0f';
  const footerColor = tc.status === 'Fail' ? '#fca5a5' :
                      tc.status === 'Skipped' ? '#fde68a' : '#bbf7d0';

  return `<!DOCTYPE html>
<html><body style="margin:0;padding:0;background:#111;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
<div style="background:${meta.color};color:#fff;display:flex;align-items:center;gap:8px;padding:9px 14px;min-height:40px;box-sizing:border-box">
  <span style="background:rgba(0,0,0,0.25);border-radius:4px;padding:2px 9px;font-family:monospace;font-size:13px;font-weight:800;white-space:nowrap;letter-spacing:0.3px">${escHtml(tcId)}</span>
  <span style="font-size:13px;font-weight:700;white-space:nowrap">${meta.icon}&nbsp;${tc.status.toUpperCase()}</span>
  <span style="flex:1;font-size:12px;opacity:0.93;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${escHtml(tc.title)}</span>
  ${step ? `<span style="background:rgba(0,0,0,0.22);border-radius:4px;padding:2px 8px;font-size:11px;white-space:nowrap;opacity:0.9">📸 ${escHtml(step)}</span>` : ''}
</div>
<img src="data:image/png;base64,${b64}"
  style="width:${dims.w}px;max-width:100%;display:block"/>
${footer ? `<div style="background:${footerBg};color:${footerColor};padding:8px 14px;font-size:11.5px;line-height:1.55;font-family:monospace;white-space:pre-wrap;border-top:2px solid ${meta.color}">${escHtml(footer)}</div>` : ''}
</body></html>`;
}

// ── Main ──────────────────────────────────────────────────────────────────────
(async () => {
  console.log('🖼️  Annotating all test case screenshots...\n');

  // Ensure originals backup directory exists
  if (!fs.existsSync(ORIGINALS)) {
    fs.mkdirSync(ORIGINALS, { recursive: true });
    console.log(`   Created originals backup directory: ${ORIGINALS}\n`);
  }

  const tcIndex = buildTcIndex();
  console.log(`   Loaded ${Object.keys(tcIndex).length} test IDs from results.json`);

  const files = fs.readdirSync(SHOTS_DIR)
    .filter(f => /\.(png|jpe?g)$/i.test(f) && !f.startsWith('.'))
    .sort();

  console.log(`   Found ${files.length} screenshots to process\n`);

  const browser = await chromium.launch({ headless: true });
  const ctx     = await browser.newContext({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 1 });
  const page    = await ctx.newPage();

  let done = 0, noTc = 0, noMatch = 0;

  for (const file of files) {
    const shotPath = path.join(SHOTS_DIR, file);
    const origPath = path.join(ORIGINALS, file);

    // Backup original if not already backed up
    if (!fs.existsSync(origPath)) {
      fs.copyFileSync(shotPath, origPath);
    }

    const tcId = extractTcId(file);
    if (!tcId) { noTc++; continue; }

    const tc = tcIndex[tcId];
    if (!tc) { noMatch++; continue; }

    const step  = stepLabel(file);
    const dims  = pngDims(origPath); // always read from original
    const b64   = fs.readFileSync(origPath).toString('base64');
    const html  = buildHtml(b64, tcId, tc, step, dims);

    try {
      await page.setViewportSize({ width: dims.w, height: dims.h + 120 });
      await page.setContent(html, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(80);
      await page.screenshot({ path: shotPath, fullPage: true });
      done++;
      process.stdout.write(`\r   Annotated ${done} / ${files.length}...`);
    } catch (err) {
      console.error(`\n   ❌ Failed ${file}: ${err.message}`);
    }
  }

  await browser.close();

  console.log(`\n\n✅ Done.`);
  console.log(`   Annotated : ${done}`);
  console.log(`   No TC ID  : ${noTc}`);
  console.log(`   Not in results: ${noMatch}`);
})();
