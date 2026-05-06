#!/usr/bin/env node
'use strict';
/**
 * Merges multiple Playwright JSON result files into one combined file.
 * Usage: node scripts/merge_results.js <out.json> <file1.json> [file2.json ...]
 */

const fs   = require('fs');
const path = require('path');

const [,, outFile, ...inputs] = process.argv;

if (!outFile || inputs.length === 0) {
  console.error('Usage: node merge_results.js <output.json> <file1.json> [file2.json ...]');
  process.exit(1);
}

const merged = {
  config: {},
  suites: [],
  errors: [],
  stats: { startTime: new Date().toISOString(), duration: 0, expected: 0, unexpected: 0, skipped: 0, flaky: 0 },
};

for (const f of inputs) {
  if (!fs.existsSync(f)) { console.warn(`Skipping missing file: ${f}`); continue; }
  const data = JSON.parse(fs.readFileSync(f, 'utf8'));
  if (data.config && !merged.config.rootDir) merged.config = data.config;
  if (data.suites) merged.suites.push(...data.suites);
  if (data.errors) merged.errors.push(...data.errors);
  if (data.stats) {
    merged.stats.expected   += data.stats.expected   || 0;
    merged.stats.unexpected += data.stats.unexpected || 0;
    merged.stats.skipped    += data.stats.skipped    || 0;
    merged.stats.flaky      += data.stats.flaky      || 0;
    merged.stats.duration   += data.stats.duration   || 0;
  }
}

fs.writeFileSync(outFile, JSON.stringify(merged, null, 2));
const total = merged.stats.expected + merged.stats.unexpected + merged.stats.skipped + merged.stats.flaky;
console.log(`Merged ${inputs.length} files → ${total} tests total → ${outFile}`);
