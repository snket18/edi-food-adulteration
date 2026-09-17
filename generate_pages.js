const fs = require('fs');
const path = require('path');

const pages = [
  'Login.tsx', 'Dashboard.tsx', 'TestNew.tsx', 'TestCapture.tsx', 'TestProcessing.tsx',
  'TestResult.tsx', 'History.tsx', 'HistoryDetail.tsx', 'Profile.tsx', 'Settings.tsx',
  'Monitoring.tsx', 'Analytics.tsx', 'Map.tsx', 'AdminTests.tsx', 'AdminTestDetail.tsx', 'Reports.tsx'
];

pages.forEach(file => {
  const name = file.replace('.tsx', '');
  const content = `export default function ${name}() {\n  return <div className="p-4 text-xl">${name} Page (Placeholder)</div>;\n}\n`;
  fs.writeFileSync(path.join(__dirname, 'client/src/pages', file), content);
});

console.log('Placeholder pages created.');
