// Renders the Vitest coverage-summary.json as a Markdown table.
// Used by CI to write into the GitHub Job Summary, and locally for a quick view.
// Usage: node scripts/coverage-summary.js [path-to-coverage-summary.json]

const fs = require('fs');
const path = require('path');

// Find the first coverage-summary.json under the given directory.
// The Angular builder writes to coverage/<projectName>/, and the project
// name differs per repo, so we discover it rather than hardcode it.
function findSummary(dir) {
  if (!fs.existsSync(dir)) return null;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      const found = findSummary(full);
      if (found) return found;
    } else if (entry.name === 'coverage-summary.json') {
      return full;
    }
  }
  return null;
}

const summaryPath = process.argv[2]
  || findSummary(path.join(__dirname, '..', 'coverage'));

if (!summaryPath || !fs.existsSync(summaryPath)) {
  console.error('Coverage summary not found under ./coverage. Run "npm run test:coverage" first.');
  process.exit(1);
}

const summary = JSON.parse(fs.readFileSync(summaryPath, 'utf8'));
const total = summary.total;

// Turn an absolute file path into a "component/file.ts" label.
const label = (file) => {
  const parts = file.split(/[\\/]/);
  const i = parts.lastIndexOf('src');
  return i === -1 ? file : parts.slice(i + 1).join('/');
};

const pct = (v) => `${v.pct.toFixed(1)}%`;

const files = Object.entries(summary)
  .filter(([key]) => key !== 'total')
  .map(([file, m]) => ({ file: label(file), lines: m.lines, branches: m.branches, functions: m.functions }))
  .sort((a, b) => a.lines.pct - b.lines.pct);

const lines = [];
lines.push('## Test coverage');
lines.push('');
lines.push('| | Lines | Statements | Functions | Branches |');
lines.push('|---|---|---|---|---|');
lines.push(`| **Total** | ${pct(total.lines)} (${total.lines.covered}/${total.lines.total}) | ${pct(total.statements)} | ${pct(total.functions)} | ${pct(total.branches)} |`);
lines.push('');
lines.push('<details><summary>Per-component (worst first)</summary>');
lines.push('');
lines.push('| Component | Lines | Functions | Branches |');
lines.push('|---|---|---|---|');
for (const f of files) {
  lines.push(`| ${f.file} | ${pct(f.lines)} | ${pct(f.functions)} | ${pct(f.branches)} |`);
}
lines.push('');
lines.push('</details>');

console.log(lines.join('\n'));
