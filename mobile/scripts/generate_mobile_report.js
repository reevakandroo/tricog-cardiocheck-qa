#!/usr/bin/env node
'use strict';
const fs   = require('fs');
const path = require('path');

const resultsPath = process.argv[2] || path.join(__dirname, '../reports/results.json');
const outputPath  = process.argv[3] || path.join(__dirname, `../reports/mobile_report_${new Date().toISOString().split('T')[0]}.html`);

if (!fs.existsSync(resultsPath)) { console.error('Results not found: ' + resultsPath); process.exit(1); }

const raw  = JSON.parse(fs.readFileSync(resultsPath, 'utf8'));
const date = new Date().toISOString().replace('T', ' ').slice(0, 19);

const MODULE_LABEL_MAP = {
  'TC_Mobile_Login — Authentication'         : '01 · Mobile Login',
  'TC_Mobile_Dashboard — ECG List'           : '02 · Mobile Dashboard',
  'TC_Mobile_PatientForm — Patient Entry'    : '03 · Mobile Patient Form',
  'TC_Mobile_Risk — Risk Assessment'         : '04 · Mobile Risk Assessment',
  'TC_Mobile_Export — PDF Export'            : '05 · Mobile Report Export',
  'TC_Mobile_Search — ECG Search'            : '06 · Mobile Search',
  'TC_Mobile_Profile — User Profile'         : '07 · Mobile Profile',
  'TC_Mobile_Gestures — Touch Interaction'   : '08 · Mobile Touch Gestures',
  'TC_Mobile_Network — Connectivity'         : '09 · Mobile Network',
  'TC_Mobile_Orientation — Screen Rotation'  : '10 · Mobile Orientation',
  'TC_Mobile_A11y — Accessibility'           : '11 · Mobile Accessibility',
  'TC_Mobile_Security — App Security'        : '12 · Mobile Security',
  'TC_Mobile_HIPAA — Compliance'             : '13 · Mobile HIPAA',
  'TC_Mobile_Performance — Benchmarks'       : '14 · Mobile Performance',
  'TC_Mobile_Lifecycle — App State'          : '15 · Mobile App Lifecycle',
};

const SEVERITY_MAP = {
  'login': 'Critical', 'authentication': 'Critical',
  'dashboard': 'Critical', 'ecg': 'Critical',
  'patient': 'High', 'risk': 'Critical',
  'export': 'High', 'search': 'Medium',
  'profile': 'Medium', 'gestures': 'Medium',
  'network': 'High', 'orientation': 'Medium',
  'a11y': 'High', 'accessibility': 'High',
  'security': 'Critical', 'hipaa': 'Critical',
  'performance': 'Medium', 'lifecycle': 'High',
};

function getSeverity(mod) {
  const lower = mod.toLowerCase();
  for (const [k, v] of Object.entries(SEVERITY_MAP)) { if (lower.includes(k)) return v; }
  return 'Medium';
}

const rows = [];
let totalPassed = 0, totalFailed = 0, totalSkipped = 0, totalBlocked = 0;

function walkSuites(suites, moduleName) {
  for (const suite of (suites || [])) {
    const rawTitle = suite.title || moduleName || 'Unknown';
    const mod = MODULE_LABEL_MAP[rawTitle] || rawTitle;
    for (const spec of (suite.specs || [])) {
      const tests = spec.tests || [];
      for (const result of tests) {
        const outcomes   = result.results || [];
        const last       = outcomes[outcomes.length - 1] || {};
        const overall    = result.status;
        const status     = overall === 'expected' ? 'Pass' :
                           overall === 'skipped'  ? 'Skipped' :
                           overall === 'flaky'    ? 'Pass' :
                           last.status === 'timedOut' ? 'Blocked' : 'Fail';
        const idMatch    = spec.title.match(/TC_M[A-Z0-9_]+\d+/);
        const id         = idMatch ? idMatch[0] : 'TC_UNKNOWN';
        const sev        = getSeverity(mod);
        const duration   = ((last.duration || 0) / 1000).toFixed(1) + 's';
        const type       = spec.title.match(/sql|xss|inject|security|hipaa/i) ? 'Security' :
                           spec.title.match(/empty|null|invalid|negative|wrong/i) ? 'Negative' :
                           spec.title.match(/boundary|long|zero|max|min|overflow/i) ? 'Edge' :
                           spec.title.match(/performance|benchmark|load time/i) ? 'Performance' : 'Positive';
        const errors     = (last.errors || []).map(e => e.message || '').join('\n');
        const screenshots = (last.attachments || [])
          .filter(a => a.contentType && a.contentType.startsWith('image/'))
          .map(a => a.path || a.name || '');
        const retries = outcomes.length - 1;
        if (status === 'Pass') totalPassed++;
        else if (status === 'Fail') totalFailed++;
        else if (status === 'Skipped') totalSkipped++;
        else totalBlocked++;
        rows.push({ id, module: mod, scenario: spec.title, type, severity: sev, status, duration, errors, screenshots, retries });
      }
    }
    walkSuites(suite.suites, mod);
  }
}
walkSuites(raw.suites);

const total = totalPassed + totalFailed + totalSkipped + totalBlocked;
const pct   = total > 0 ? ((totalPassed / total) * 100).toFixed(1) : '0.0';

const byModule = {};
for (const r of rows) (byModule[r.module] = byModule[r.module] || []).push(r);

const sortedModules = Object.keys(byModule).sort((a, b) => {
  const na = parseInt(a.match(/^(\d+)/)?.[1] || '99');
  const nb = parseInt(b.match(/^(\d+)/)?.[1] || '99');
  return na !== nb ? na - nb : a.includes('Extended') ? 1 : -1;
});

const screenshotsDir = path.join(__dirname, '../reports/screenshots');

function screenshotBase64(filename) {
  if (!filename) return null;
  const candidates = [
    path.join(screenshotsDir, filename),
    path.join(screenshotsDir, path.basename(filename)),
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) return 'data:image/png;base64,' + fs.readFileSync(p).toString('base64');
  }
  return null;
}

function screenshotHtml(shots) {
  if (!shots || shots.length === 0) return '<span style="color:#a0aec0;font-size:11px">—</span>';
  return shots.map(s => {
    const name = path.basename(s || 'screenshot.png');
    const b64  = screenshotBase64(name);
    if (b64) return `<img src="${b64}" onclick="openLightbox(this)" style="height:40px;border:1px solid #e2e8f0;border-radius:3px;vertical-align:middle;cursor:zoom-in;margin-right:4px" title="${name}"/>`;
    return `<span style="color:#a0aec0;font-size:10px">📸 ${name}</span>`;
  }).join('');
}

function getScreenshotsForTC(tcId) {
  if (!tcId || !fs.existsSync(screenshotsDir)) return [];
  const prefix = tcId.replace(/^TC_/, '').toLowerCase();
  try {
    return fs.readdirSync(screenshotsDir)
      .filter(f => {
        const lower = f.toLowerCase();
        return (lower.startsWith(prefix + '_') || lower.startsWith(prefix + '.')) && /\.(png|jpe?g)$/i.test(f);
      }).sort();
  } catch (e) { return []; }
}

const statusColor = { Pass:'#16a34a', Fail:'#dc2626', Skipped:'#b45309', Blocked:'#d97706' };
const statusBg    = { Pass:'#f0fdf4', Fail:'#fff5f5', Skipped:'#fffbeb', Blocked:'#fffbeb' };
const statusIcon  = { Pass:'✅', Fail:'❌', Skipped:'⏭️', Blocked:'⚠️' };
const sevColor    = { Critical:'#7f1d1d', High:'#92400e', Medium:'#1e3a5f', Low:'#14532d' };
const sevBg       = { Critical:'#fee2e2', High:'#fef3c7', Medium:'#dbeafe', Low:'#dcfce7' };
const typeColor   = { Positive:'#166534', Negative:'#9a3412', Edge:'#4c1d95', Security:'#7f1d1d', Performance:'#1e3a5f' };

function modRows(mod) {
  return (byModule[mod] || []).map((r, i) => {
    const sc  = getScreenshotsForTC(r.id);
    const allShots = [...new Set([...r.screenshots, ...sc])];
    return `<tr style="background:${i%2===0?'#fff':'#f9fafb'}">
      <td style="padding:8px 10px;font-family:monospace;font-size:12px;color:#1e40af;white-space:nowrap">${r.id}</td>
      <td style="padding:8px 10px;font-size:12px;max-width:340px">${r.scenario.replace(/^TC_M[A-Z0-9_]+\d+\s*[-–]?\s*/,'')}</td>
      <td style="padding:8px 10px;text-align:center"><span style="background:${typeColor[r.type]||'#374151'};color:#fff;border-radius:3px;padding:2px 7px;font-size:10px;font-weight:700">${r.type}</span></td>
      <td style="padding:8px 10px;text-align:center"><span style="background:${sevBg[r.severity]};color:${sevColor[r.severity]};border-radius:3px;padding:2px 7px;font-size:10px;font-weight:700">${r.severity}</span></td>
      <td style="padding:8px 10px;text-align:center"><span style="background:${statusBg[r.status]};color:${statusColor[r.status]};border-radius:4px;padding:3px 10px;font-size:11px;font-weight:700">${statusIcon[r.status]} ${r.status}</span></td>
      <td style="padding:8px 10px;font-size:11px;color:#64748b;text-align:center">${r.duration}</td>
      <td style="padding:8px 10px;text-align:center">${screenshotHtml(allShots)}</td>
    </tr>
    ${r.status==='Fail'&&r.errors?`<tr style="background:#fff5f5"><td colspan="7" style="padding:6px 10px 10px 24px;font-family:monospace;font-size:11px;color:#b91c1c;white-space:pre-wrap;max-width:900px;word-break:break-all">${r.errors.substring(0,400)}</td></tr>`:''}`;
  }).join('');
}

function moduleSection(mod) {
  const mrows   = byModule[mod] || [];
  const mp      = mrows.filter(r=>r.status==='Pass').length;
  const mf      = mrows.filter(r=>r.status==='Fail').length;
  const ms      = mrows.filter(r=>r.status==='Skipped').length;
  const mb      = mrows.filter(r=>r.status==='Blocked').length;
  const mt      = mrows.length;
  const mpct    = mt > 0 ? ((mp/mt)*100).toFixed(0) : '0';
  const barColor= mf > 0 ? '#dc2626' : ms+mb > 0 ? '#d97706' : '#16a34a';
  return `
  <div style="margin-bottom:32px;background:#fff;border:1px solid #e2e8f0;border-radius:10px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.06)">
    <div style="background:linear-gradient(135deg,#1e3a5f,#2563eb);padding:14px 20px;display:flex;align-items:center;justify-content:space-between">
      <div>
        <span style="color:#fff;font-size:15px;font-weight:800;letter-spacing:0.3px">${mod}</span>
        <span style="color:#93c5fd;font-size:12px;margin-left:12px">📱 Mobile · ${mt} tests</span>
      </div>
      <div style="display:flex;gap:8px;align-items:center">
        ${mp?`<span style="background:#16a34a;color:#fff;border-radius:12px;padding:2px 10px;font-size:11px;font-weight:700">✅ ${mp} Pass</span>`:''}
        ${mf?`<span style="background:#dc2626;color:#fff;border-radius:12px;padding:2px 10px;font-size:11px;font-weight:700">❌ ${mf} Fail</span>`:''}
        ${ms?`<span style="background:#b45309;color:#fff;border-radius:12px;padding:2px 10px;font-size:11px;font-weight:700">⏭️ ${ms} Skip</span>`:''}
        ${mb?`<span style="background:#d97706;color:#fff;border-radius:12px;padding:2px 10px;font-size:11px;font-weight:700">⚠️ ${mb} Blocked</span>`:''}
        <div style="background:rgba(255,255,255,0.15);border-radius:8px;padding:4px 12px;font-size:13px;font-weight:800;color:#fff">${mpct}%</div>
      </div>
    </div>
    <div style="height:4px;background:#e2e8f0"><div style="height:4px;background:${barColor};width:${mpct}%;transition:width 0.4s"></div></div>
    <div style="overflow-x:auto">
      <table style="width:100%;border-collapse:collapse">
        <thead><tr style="background:#f8fafc;border-bottom:2px solid #e2e8f0">
          <th style="padding:10px;text-align:left;font-size:11px;color:#64748b;font-weight:700;white-space:nowrap">TC ID</th>
          <th style="padding:10px;text-align:left;font-size:11px;color:#64748b;font-weight:700">Scenario</th>
          <th style="padding:10px;text-align:center;font-size:11px;color:#64748b;font-weight:700">Type</th>
          <th style="padding:10px;text-align:center;font-size:11px;color:#64748b;font-weight:700">Severity</th>
          <th style="padding:10px;text-align:center;font-size:11px;color:#64748b;font-weight:700">Status</th>
          <th style="padding:10px;text-align:center;font-size:11px;color:#64748b;font-weight:700">Time</th>
          <th style="padding:10px;text-align:center;font-size:11px;color:#64748b;font-weight:700">Screenshots</th>
        </tr></thead>
        <tbody>${modRows(mod)}</tbody>
      </table>
    </div>
  </div>`;
}

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>CardioCheck v1.4.0 — Mobile QA Execution Report</title>
<style>
  *{box-sizing:border-box}
  body{margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f1f5f9;color:#1e293b}
  .container{max-width:1200px;margin:0 auto;padding:24px}
  #lightbox{display:none;position:fixed;inset:0;background:rgba(0,0,0,0.9);z-index:9999;align-items:center;justify-content:center}
  #lightbox.open{display:flex}
  #lightbox img{max-width:94vw;max-height:94vh;border-radius:6px;box-shadow:0 8px 40px rgba(0,0,0,0.6)}
  #lightbox-close{position:fixed;top:18px;right:24px;color:#fff;font-size:32px;cursor:pointer;line-height:1}
</style>
</head>
<body>
<div id="lightbox" onclick="closeLightbox()"><span id="lightbox-close">✕</span><img id="lightbox-img" src="" alt=""/></div>

<div style="background:linear-gradient(135deg,#0f172a 0%,#1e3a5f 50%,#0f172a 100%);color:#fff;padding:36px 0;margin-bottom:32px">
  <div class="container">
    <div style="display:flex;align-items:center;gap:16px;margin-bottom:16px">
      <div style="background:#2563eb;border-radius:12px;padding:12px 18px;font-size:28px">📱</div>
      <div>
        <h1 style="margin:0;font-size:26px;font-weight:800;letter-spacing:-0.5px">CardioCheck v1.4.0 — Mobile QA</h1>
        <p style="margin:4px 0 0;color:#93c5fd;font-size:14px">Execution Report · Playwright Mobile Emulation (Pixel 5)</p>
      </div>
    </div>
    <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:16px;margin-top:24px">
      <div style="background:rgba(255,255,255,0.08);border-radius:10px;padding:16px;text-align:center">
        <div style="font-size:30px;font-weight:800">${total}</div>
        <div style="font-size:12px;color:#93c5fd;margin-top:4px">Total Tests</div>
      </div>
      <div style="background:rgba(22,163,74,0.2);border-radius:10px;padding:16px;text-align:center">
        <div style="font-size:30px;font-weight:800;color:#4ade80">${totalPassed}</div>
        <div style="font-size:12px;color:#86efac;margin-top:4px">Passed ✅</div>
      </div>
      <div style="background:rgba(220,38,38,0.2);border-radius:10px;padding:16px;text-align:center">
        <div style="font-size:30px;font-weight:800;color:#f87171">${totalFailed}</div>
        <div style="font-size:12px;color:#fca5a5;margin-top:4px">Failed ❌</div>
      </div>
      <div style="background:rgba(180,83,9,0.2);border-radius:10px;padding:16px;text-align:center">
        <div style="font-size:30px;font-weight:800;color:#fb923c">${totalSkipped}</div>
        <div style="font-size:12px;color:#fdba74;margin-top:4px">Skipped ⏭️</div>
      </div>
      <div style="background:rgba(37,99,235,0.2);border-radius:10px;padding:16px;text-align:center">
        <div style="font-size:30px;font-weight:800;color:#60a5fa">${pct}%</div>
        <div style="font-size:12px;color:#93c5fd;margin-top:4px">Pass Rate</div>
      </div>
    </div>
    <div style="margin-top:20px;display:flex;gap:24px;font-size:13px;color:#94a3b8">
      <span>📅 ${date}</span>
      <span>📱 Device: Pixel 5 (393×851, PixelRatio 2.75)</span>
      <span>🔗 https://cardiocheck-releasev140.up.railway.app</span>
      <span>📦 15 Modules</span>
    </div>
  </div>
</div>

<div class="container">
  ${sortedModules.map(moduleSection).join('\n')}
</div>

<div style="background:#0f172a;color:#64748b;padding:20px;text-align:center;font-size:12px;margin-top:32px">
  CardioCheck v1.4.0 · Mobile QA Execution Report · Generated ${date} · Tricog Health
</div>

<script>
function openLightbox(img){
  document.getElementById('lightbox-img').src=img.src;
  document.getElementById('lightbox').classList.add('open');
}
function closeLightbox(){
  document.getElementById('lightbox').classList.remove('open');
}
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeLightbox();});
</script>
</body></html>`;

fs.writeFileSync(outputPath, html);
console.log(`\n✅ Mobile report generated: ${outputPath}`);
console.log(`   Total: ${total} | Pass: ${totalPassed} | Fail: ${totalFailed} | Skip: ${totalSkipped} | Rate: ${pct}%`);
