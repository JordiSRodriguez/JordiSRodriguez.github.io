const fs = require('fs');
const report = JSON.parse(fs.readFileSync('./lh-detailed-cls', 'utf8'));

console.log('\n=== LAYOUT SHIFT ELEMENTS DETAILS ===\n');

const shiftElements = report.audits['layout-shift-elements'];
if (shiftElements && shiftElements.details && shiftElements.details.items) {
  console.log(`Total shifts: ${shiftElements.details.items.length}\n`);
  shiftElements.details.items.forEach((item, i) => {
    console.log(`Shift #${i + 1}`);
    console.log(`  Score: ${item.score.toFixed(4)}`);
    if (item.node) {
      console.log(`  Selector: ${item.node.selector || item.node.snippet || 'unknown'}`);
      console.log(`  Type: ${item.node.type || 'unknown'}`);
    }
    console.log('');
  });
} else {
  console.log('No layout shift elements found');
}

// Also check the main CLS audit
console.log('\n=== CLS AUDIT DETAILS ===\n');
const clsAudit = report.audits['cumulative-layout-shift'];
console.log(`Total CLS: ${clsAudit.displayValue}`);
if (clsAudit.details && clsAudit.details.items) {
  console.log(`Number of shifts: ${clsAudit.details.items.length}`);
  clsAudit.details.items.slice(0, 10).forEach((item, i) => {
    console.log(`\nShift #${i + 1}:`);
    console.log(`  Score: ${item.score}`);
    if (item.nodes) {
      item.nodes.forEach((node) => {
        console.log(`  Node: ${node.selector || node.snippet || 'unknown'}`);
      });
    }
  });
}
