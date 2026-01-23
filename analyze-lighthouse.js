const fs = require('fs');
const report = JSON.parse(fs.readFileSync('./lighthouse-gh', 'utf8'));

console.log('\n=== GITHUB PAGES - DETAILED ISSUES ===\n');

const perfAudits = Object.values(report.audits)
  .filter(a => a.score !== null && a.score < 0.85)
  .sort((a, b) => a.score - b.score);

console.log('TOP PERFORMANCE ISSUES:');
perfAudits.filter(a => a.id.startsWith('cls') || a.id.startsWith('lcp') || a.id.includes('layout') || a.id.includes('shift') || a.id.includes('render-blocking')).forEach(a => {
  const score = '[' + Math.round(a.score * 100) + ']';
  const value = a.displayValue || '';
  console.log('  ' + score + ' ' + a.title + (value ? ': ' + value : ''));
  if (a.details && a.details.items) {
    a.details.items.slice(0, 3).forEach(item => {
      if (item.node) console.log('      - ' + item.node?.snippet || item.node?.selector || JSON.stringify(item).substring(0, 100));
    });
  }
});

console.log('\nTOP ACCESSIBILITY ISSUES:');
perfAudits.filter(a => a.id.startsWith('color-contrast') || a.id.includes('button') || a.id.includes('label') || a.id.includes('heading') || a.id.includes('aria')).forEach(a => {
  const score = '[' + Math.round(a.score * 100) + ']';
  const value = a.displayValue || '';
  console.log('  ' + score + ' ' + a.title + (value ? ': ' + value : ''));
});
