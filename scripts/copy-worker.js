const fs = require('fs');
const path = require('path');

const pdfjsDistPath = path.dirname(require.resolve('react-pdf/package.json'));
const pdfWorkerPath = path.join(pdfjsDistPath, 'node_modules', 'pdfjs-dist', 'build', 'pdf.worker.min.js');

const targetDir = 'public';
const targetPath = path.join(targetDir, 'pdf.worker.js');

// Ensure target directory exists
fs.mkdirSync(targetDir, { recursive: true });

// Copy file
fs.copyFileSync(pdfWorkerPath, targetPath);
