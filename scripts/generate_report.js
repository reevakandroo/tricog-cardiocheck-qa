#!/usr/bin/env node
'use strict';
/**
 * Generates a self-contained HTML execution report from Playwright JSON results.
 * Usage: node scripts/generate_report.js [results.json] [output.html]
 */

const fs   = require('fs');
const path = require('path');

const resultsPath = process.argv[2] || path.join(__dirname, '../reports/results.json');
const outputPath  = process.argv[3] || path.join(__dirname, `../reports/execution_report_${new Date().toISOString().split('T')[0]}.html`);

if (!fs.existsSync(resultsPath)) {
  console.error(`Results file not found: ${resultsPath}`);
  process.exit(1);
}

const raw  = JSON.parse(fs.readFileSync(resultsPath, 'utf8'));
const date = new Date().toISOString().replace('T', ' ').slice(0, 19);

// ── Parse Playwright JSON ──────────────────────────────────────────────────────
const rows = [];
let totalPassed = 0, totalFailed = 0, totalSkipped = 0, totalBlocked = 0;

const SEVERITY_MAP = {
  'authentication': 'Critical', 'login': 'Critical',
  'ecg_dashboard': 'Critical', 'patient': 'High',
  'risk': 'Critical', 'report': 'High',
  'search': 'Medium', 'profile': 'Medium',
  'network': 'High', 'security': 'Critical',
  'hipaa': 'Critical', 'omron': 'High',
};

// Recursively walk suite tree — Playwright nests: file > describe > specs
function walkSuites(suites, moduleName) {
  for (const suite of (suites || [])) {
    const mod = suite.title || moduleName || 'Unknown';
    // Process specs at this level
    for (const spec of (suite.specs || [])) {
      const tests = spec.tests || [];
      for (const result of tests) {
        // Determine final outcome across all retries
        const outcomes = (result.results || []);
        const lastAttempt = outcomes[outcomes.length - 1] || {};
        const overallStatus = result.status; // 'expected','unexpected','skipped','flaky'
        const status = overallStatus === 'expected' ? 'Pass' :
                       overallStatus === 'skipped'  ? 'Skipped' :
                       overallStatus === 'flaky'    ? 'Pass' :
                       lastAttempt.status === 'timedOut' ? 'Blocked' : 'Fail';

        const id  = spec.title.match(/TC_[A-Z0-9]+_\d+/) ? spec.title.match(/TC_[A-Z0-9]+_\d+/)[0] : 'TC_UNKNOWN';
        const sev = Object.entries(SEVERITY_MAP).find(([k]) => mod.toLowerCase().includes(k))?.[1] || 'Medium';
        const duration = ((lastAttempt.duration || 0) / 1000).toFixed(1) + 's';
        const type = spec.title.match(/sql|xss|injection|security|hipaa|auth bypass/i) ? 'Security' :
                     spec.title.match(/empty|null|missing|invalid|negative/i) ? 'Negative' :
                     spec.title.match(/boundary|long|zero|max|min/i) ? 'Edge' : 'Positive';
        const errors = (lastAttempt.errors || []).map(e => e.message || '').join('\n');
        const screenshots = (lastAttempt.attachments || [])
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
    // Recurse into nested suites
    walkSuites(suite.suites, mod);
  }
}
walkSuites(raw.suites);

const total  = totalPassed + totalFailed + totalSkipped + totalBlocked;
const pct    = total > 0 ? ((totalPassed / total) * 100).toFixed(1) : '0.0';

// ── Group by module ────────────────────────────────────────────────────────────
const byModule = {};
for (const r of rows) {
  (byModule[r.module] = byModule[r.module] || []).push(r);
}

// ── Screenshot links ───────────────────────────────────────────────────────────
function screenshotHtml(shots) {
  if (!shots || shots.length === 0) return '<span style="color:#a0aec0;font-size:11px">—</span>';
  return shots.map(s => {
    const name = path.basename(s || 'screenshot.png');
    const relPath = `screenshots/${name}`;
    return `<a href="${relPath}" target="_blank" style="font-size:11px;color:#3182ce;margin-right:4px">[📸 ${name}]</a>`;
  }).join('');
}

// ── Table rows ─────────────────────────────────────────────────────────────────
function buildRows() {
  let html = '';
  for (const [mod, cases] of Object.entries(byModule)) {
    const mPassed  = cases.filter(r => r.status === 'Pass').length;
    const mFailed  = cases.filter(r => r.status === 'Fail').length;
    const mBlocked = cases.filter(r => r.status === 'Blocked').length;
    const mSkipped = cases.filter(r => r.status === 'Skipped').length;
    html += `<tr class="module-header">
      <td colspan="9">${mod} &nbsp;
        <span style="font-weight:normal;font-size:11px;opacity:0.85">
          ${cases.length} tests — ✅ ${mPassed} Pass &nbsp; ❌ ${mFailed} Fail &nbsp; ⚠️ ${mBlocked} Blocked &nbsp; ⏭️ ${mSkipped} Skipped
        </span>
      </td></tr>`;
    for (const r of cases) {
      const rowClass = `status-${r.status}`;
      const badgeClass = { Positive: 'badge-Positive', Negative: 'badge-Negative', Edge: 'badge-Edge', Security: 'badge-Security' }[r.type] || 'badge-Positive';
      const statusIcon = { Pass: '✅', Fail: '❌', Blocked: '⚠️', Skipped: '⏭️' }[r.status] || '';
      const bugHtml = r.status === 'Fail' && r.errors ?
        `<details><summary style="cursor:pointer;color:#e53e3e;font-size:11px;font-weight:600">🐛 Bug Details</summary>
          <pre style="font-size:10px;background:#fff5f5;padding:8px;border-radius:4px;white-space:pre-wrap;max-height:120px;overflow-y:auto">${r.errors.slice(0, 800)}</pre>
         </details>` : '';
      html += `<tr class="${rowClass}">
        <td><span class="tc-id">${r.id}</span></td>
        <td class="scenario-text">${r.scenario}</td>
        <td><span class="badge ${badgeClass}">${r.type}</span></td>
        <td><span class="sev-${r.severity.toLowerCase()}">${r.severity}</span></td>
        <td><strong>${statusIcon} ${r.status}</strong></td>
        <td>${r.duration}</td>
        <td>${screenshotHtml(r.screenshots)}</td>
        <td>${bugHtml}</td>
        <td style="font-size:11px;color:#718096">—</td>
      </tr>`;
    }
  }
  return html;
}

// ── HTML template ──────────────────────────────────────────────────────────────
const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>CardioCheck QA — Execution Report</title>
<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; font-size: 13px; background: #f0f2f5; color: #1a1a2e; }

.page-header { background: linear-gradient(135deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%); color: #fff; padding: 24px 32px 20px; box-shadow: 0 2px 12px rgba(0,0,0,0.35); }
.page-header h1 { font-size: 22px; font-weight: 700; margin-bottom: 4px; }
.page-header .subtitle { font-size: 12px; color: #a0aec0; margin-bottom: 18px; }

.meta-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 12px; }
.meta-field { display: flex; flex-direction: column; gap: 4px; }
.meta-field label { font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.8px; color: #90cdf4; }
.meta-field .val { background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); border-radius: 5px; color: #e2e8f0; padding: 5px 9px; font-size: 13px; }

.stats-bar { display: flex; gap: 12px; flex-wrap: wrap; margin: 16px 32px; }
.stat-card { background: #fff; border-radius: 8px; padding: 14px 20px; flex: 1; min-width: 110px; text-align: center; box-shadow: 0 1px 4px rgba(0,0,0,0.1); border-top: 3px solid #cbd5e0; }
.stat-card.total { border-top-color: #4a5568; } .stat-card.passed { border-top-color: #38a169; }
.stat-card.failed { border-top-color: #e53e3e; } .stat-card.blocked { border-top-color: #d69e2e; }
.stat-card.skipped { border-top-color: #718096; } .stat-card.pct { border-top-color: #3182ce; }
.stat-card .num { font-size: 28px; font-weight: 700; line-height: 1; }
.stat-card.total .num { color: #4a5568; } .stat-card.passed .num { color: #38a169; }
.stat-card.failed .num { color: #e53e3e; } .stat-card.blocked .num { color: #d69e2e; }
.stat-card.skipped .num { color: #718096; } .stat-card.pct .num { color: #3182ce; }
.stat-card .lbl { font-size: 11px; font-weight: 600; text-transform: uppercase; color: #718096; margin-top: 4px; }

.table-wrap { margin: 0 32px 24px; background: #fff; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.09); overflow: hidden; overflow-x: auto; }
table { width: 100%; border-collapse: collapse; }
tr.module-header td { background: #2d3748; color: #e2e8f0; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; padding: 8px 14px; }
thead tr th { background: #edf2f7; color: #4a5568; font-size: 11px; font-weight: 700; text-transform: uppercase; padding: 10px 8px; border-bottom: 2px solid #cbd5e0; white-space: nowrap; position: sticky; top: 0; z-index: 10; }
tbody tr { border-bottom: 1px solid #edf2f7; }
tbody td { padding: 7px 8px; vertical-align: top; }
.status-Pass { background: #f0fff4 !important; } .status-Fail { background: #fff5f5 !important; }
.status-Blocked { background: #fffff0 !important; } .status-Skipped { background: #f7fafc !important; }
.tc-id { color: #3182ce; font-weight: 600; font-size: 12px; white-space: nowrap; }
.badge { display: inline-block; padding: 2px 8px; border-radius: 999px; font-size: 10px; font-weight: 700; text-transform: uppercase; }
.badge-Positive { background: #c6f6d5; color: #276749; } .badge-Negative { background: #fed7d7; color: #9b2c2c; }
.badge-Edge { background: #e9d8fd; color: #553c9a; } .badge-Security { background: #feebc8; color: #7b341e; }
.sev-critical { color: #e53e3e; font-weight: 700; } .sev-high { color: #d69e2e; font-weight: 600; }
.sev-medium { color: #3182ce; } .sev-low { color: #718096; }
.scenario-text { font-size: 12px; max-width: 300px; }

.filter-bar { display: flex; gap: 10px; flex-wrap: wrap; margin: 0 32px 16px; align-items: center; }
.filter-bar select, .filter-bar input { padding: 6px 10px; border: 1px solid #cbd5e0; border-radius: 6px; font-size: 12px; }
.btn { padding: 7px 16px; border: none; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer; }
.btn-primary { background: #3182ce; color: #fff; } .btn-export { background: #805ad5; color: #fff; }

footer { margin: 32px; font-size: 11px; color: #718096; text-align: center; }
</style>
</head>
<body>

<div class="page-header">
  <h1>Tricog CardioCheck — QA Execution Report</h1>
  <div class="subtitle">Automated E2E · Playwright · Cycle 2</div>
  <div class="meta-grid">
    <div class="meta-field"><label>Test Date</label><div class="val">${date}</div></div>
    <div class="meta-field"><label>Tester</label><div class="val">Wrex QA Agent</div></div>
    <div class="meta-field"><label>App URL</label><div class="val">cardiocheck-releasev140.up.railway.app</div></div>
    <div class="meta-field"><label>Framework</label><div class="val">Playwright v1.44 · Node.js</div></div>
    <div class="meta-field"><label>Test Account</label><div class="val">reeva.kandroo+8@tricog.com</div></div>
    <div class="meta-field"><label>Browser</label><div class="val">Chromium (headless)</div></div>
    <div class="meta-field"><label>Total Modules</label><div class="val">${Object.keys(byModule).length}</div></div>
    <div class="meta-field"><label>Retry Policy</label><div class="val">3 retries with delay variation</div></div>
  </div>
</div>

<div class="stats-bar">
  <div class="stat-card total"><div class="num">${total}</div><div class="lbl">Total</div></div>
  <div class="stat-card passed"><div class="num">${totalPassed}</div><div class="lbl">Passed</div></div>
  <div class="stat-card failed"><div class="num">${totalFailed}</div><div class="lbl">Failed</div></div>
  <div class="stat-card blocked"><div class="num">${totalBlocked}</div><div class="lbl">Blocked</div></div>
  <div class="stat-card skipped"><div class="num">${totalSkipped}</div><div class="lbl">Skipped</div></div>
  <div class="stat-card pct"><div class="num">${pct}%</div><div class="lbl">Pass Rate</div></div>
</div>

<div class="filter-bar">
  <select id="statusFilter" onchange="filterRows()">
    <option value="">All Statuses</option>
    <option value="Pass">Pass</option>
    <option value="Fail">Fail</option>
    <option value="Blocked">Blocked</option>
    <option value="Skipped">Skipped</option>
  </select>
  <select id="sevFilter" onchange="filterRows()">
    <option value="">All Severities</option>
    <option value="Critical">Critical</option>
    <option value="High">High</option>
    <option value="Medium">Medium</option>
    <option value="Low">Low</option>
  </select>
  <input type="text" id="searchFilter" placeholder="Search test ID or scenario..." oninput="filterRows()" style="width:250px">
  <button class="btn btn-primary" onclick="exportCSV()">Export CSV</button>
  <button class="btn btn-export" onclick="window.print()">Print / PDF</button>
</div>

<div class="table-wrap">
  <table id="resultsTable">
    <thead>
      <tr>
        <th>TC ID</th>
        <th>Scenario</th>
        <th>Type</th>
        <th>Severity</th>
        <th>Status</th>
        <th>Duration</th>
        <th>Screenshots</th>
        <th>Bug Details</th>
        <th>Notes</th>
      </tr>
    </thead>
    <tbody id="tableBody">
      ${buildRows()}
    </tbody>
  </table>
</div>

<footer>
  Generated by Wrex QA Agent · Tricog CardioCheck Cycle 2 · ${date}<br>
  Total: ${total} | Pass: ${totalPassed} | Fail: ${totalFailed} | Blocked: ${totalBlocked} | Skipped: ${totalSkipped} | Pass Rate: ${pct}%
</footer>

<script>
function filterRows() {
  const status = document.getElementById('statusFilter').value.toLowerCase();
  const sev    = document.getElementById('sevFilter').value.toLowerCase();
  const search = document.getElementById('searchFilter').value.toLowerCase();
  const rows   = document.querySelectorAll('#tableBody tr:not(.module-header)');
  rows.forEach(row => {
    const text = row.textContent.toLowerCase();
    const show = (!status || text.includes(status)) &&
                 (!sev || text.includes(sev)) &&
                 (!search || text.includes(search));
    row.style.display = show ? '' : 'none';
  });
}

function exportCSV() {
  const rows = document.querySelectorAll('#tableBody tr:not(.module-header)');
  let csv = 'TC ID,Scenario,Type,Severity,Status,Duration\\n';
  rows.forEach(row => {
    const cells = row.querySelectorAll('td');
    if (cells.length > 0) {
      csv += [cells[0],cells[1],cells[2],cells[3],cells[4],cells[5]]
        .map(c => '"' + (c.textContent || '').replace(/"/g,'""').trim() + '"')
        .join(',') + '\\n';
    }
  });
  const a = document.createElement('a');
  a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
  a.download = 'cardiocheck_results.csv';
  a.click();
}
</script>
</body>
</html>`;

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, html, 'utf8');
console.log(`✅ Report written to: ${outputPath}`);
console.log(`   Total: ${total} | Pass: ${totalPassed} | Fail: ${totalFailed} | Blocked: ${totalBlocked} | Pass Rate: ${pct}%`);
