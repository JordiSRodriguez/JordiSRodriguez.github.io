const fs = require('fs');
const report = JSON.parse(fs.readFileSync('./lh-detailed', 'utf8'));

console.log('\n=== DETAILED CLS ANALYSIS ===\n');

const clsAudit = report.audits['cumulative-layout-shift'];
console.log('Total CLS Score: ' + clsAudit.displayValue);
console.log('Total Shifts: ' + clsAudit.details?.items?.length || 0);

// Get layout shift elements
const shiftElements = report.audits['layout-shift-elements'];
if (shiftElements && shiftElements.details && shiftElements.details.items) {
  console.log('\n=== ELEMENTS CAUSING LAYOUT SHIFTS ===\n');
  shiftElements.details.items.slice(0, 15).forEach((item, i) => {
    console.log(`${i + 1}. Score: ${item.score.toFixed(4)}`);
    if (item.node) {
      console.log('   Selector: ' + (item.node.selector || item.node.snippet || 'unknown').substring(0, 100));
      console.log('   Type: ' + (item.node.type || 'unknown'));
    }
    console.log('');
  });
}

// Check for render blocking resources
console.log('\n=== RENDER BLOCKING RESOURCES ===');
const renderBlocking = report.audits['render-blocking-resources'];
if (renderBlocking && renderBlocking.details && renderBlocking.details.items) {
  renderBlocking.details.items.forEach(item => {
    console.log('  - ' + item.url?.substring(0, 80) + ' (' + (item.totalBytes / 1024).toFixed(1) + ' KB)');
  });
}

// Check unused JavaScript
console.log('\n=== UNUSED JAVASCRIPT ===');
const unusedJS = report.audits['unused-javascript'];
if (unusedJS && unusedJS.details && unusedJS.details.items) {
  console.log('Total unused: ' + unusedJS.details.totalWastedBytes + ' bytes');
  unusedJS.details.items.slice(0, 5).forEach(item => {
    console.log('  - ' + item.url?.substring(0, 80) + ' (' + (item.wastedBytes / 1024).toFixed(1) + ' KB wasted)');
  });
}

// LCP element details
console.log('\n=== LARGEST CONTENTFUL PAINT ELEMENT ===');
const lcpElement = report.audits['largest-contentful-paint-element'];
if (lcpElement && lcpElement.details && lcpElement.details.items) {
  lcpElement.details.items.forEach(item => {
    console.log('  Element: ' + (item.node?.selector || item.node?.snippet || 'unknown'));
    console.log('  URL: ' + (item.url || 'N/A'));
    console.log('  Size: ' + (item.node?.boundingRect?.width || 0) + 'x' + (item.node?.boundingRect?.height || 0));
  });
}
