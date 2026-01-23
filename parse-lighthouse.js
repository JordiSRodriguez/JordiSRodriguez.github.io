const fs = require('fs');
const report = JSON.parse(fs.readFileSync('./lighthouse-vercel', 'utf8'));

console.log('\n=== TOP ISSUES TO FIX ===\n');

const perfAudits = Object.values(report.audits)
  .filter(a => a.score !== null && a.score < 0.85)
  .sort((a, b) => a.score - b.score);

perfAudits.slice(0, 15).forEach(a => {
  const score = '[' + Math.round(a.score * 100) + ']';
  const value = a.displayValue || '';
  console.log('  ' + score + ' ' + a.title + (value ? ': ' + value : ''));
});

console.log('\n=== LAYOUT SHIFT CULPRITS ===');
const clsCulprits = report.audits['layout-shift-culprits'];
if (clsCulprits && clsCulprits.details && clsCulprits.details.items) {
  clsCulprits.details.items.slice(0, 10).forEach(item => {
    console.log('  - ' + item.node);
  });
}
