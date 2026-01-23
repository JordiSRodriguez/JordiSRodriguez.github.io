const fs = require('fs');
const report = JSON.parse(fs.readFileSync('./lh-final-no-animations', 'utf8'));

console.log('\n=== FINAL CLS FIX RESULTS ===\n');

const perfScore = Math.round(report.categories.performance.score * 100);
const a11yScore = Math.round(report.categories.accessibility.score * 100);
const bpScore = Math.round(report.categories['best-practices'].score * 100);
const seoScore = Math.round(report.categories.seo.score * 100);

console.log('Category Scores:');
console.log('  Performance: ' + perfScore + '/100');
console.log('  Accessibility: ' + a11yScore + '/100');
console.log('  Best Practices: ' + bpScore + '/100');
console.log('  SEO: ' + seoScore + '/100');

console.log('\nKey Metrics:');
const audits = report.audits;
const clsValue = parseFloat(audits['cumulative-layout-shift'].displayValue);
const lcpValue = parseFloat(audits['largest-contentful-paint'].displayValue);

console.log('  CLS: ' + audits['cumulative-layout-shift'].displayValue);
console.log('  LCP: ' + audits['largest-contentful-paint'].displayValue);
console.log('  TBT: ' + audits['total-blocking-time'].displayValue);
console.log('  FCP: ' + audits['first-contentful-paint'].displayValue);
console.log('  SI: ' + audits['speed-index'].displayValue);

console.log('\n=== CLS PROGRESS ===');
console.log('  Before fixes: 0.891');
console.log('  After fixes:  ' + audits['cumulative-layout-shift'].displayValue);
console.log('  Change:      ' + (clsValue - 0.891).toFixed(3));
console.log('  Goal:        < 0.1');
console.log('  Status:      ' + (clsValue < 0.1 ? '✅ GOAL ACHIEVED!' : '⚠️ Still working'));

console.log('\n=== OVERALL PROGRESS (from initial 53/86/93/100) ===');
console.log('  Performance: 53 → ' + perfScore + ' (' + (perfScore - 53) + ')');
console.log('  Accessibility: 86 → ' + a11yScore + ' (' + (a11yScore - 86) + ')');
console.log('  Best Practices: 93 → ' + bpScore + ' (' + (bpScore - 93) + ')');
console.log('  SEO: 100 → ' + seoScore);

if (clsValue >= 0.1) {
  console.log('\n=== REMAINING ISSUES ===');
  const issues = Object.values(report.audits)
    .filter(a => a.score !== null && a.score < 0.75)
    .sort((a, b) => a.score - b.score)
    .slice(0, 5);

  issues.forEach(a => {
    console.log('  [' + Math.round(a.score * 100) + '] ' + a.title + (a.displayValue ? ': ' + a.displayValue : ''));
  });
}
