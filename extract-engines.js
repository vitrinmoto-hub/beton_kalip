const fs = require('fs');
const zlib = require('zlib');
const path = require('path');

const enginesDir = path.join(__dirname, 'prisma', 'engines');
const files = [
  'libquery_engine.so.node.gz',
  'schema-engine.gz',
  'query-engine.gz'
];

files.forEach(file => {
  const sourcePath = path.join(enginesDir, file);
  const targetPath = path.join(enginesDir, file.replace('.gz', ''));

  try {
    const gzipData = fs.readFileSync(sourcePath);
    const extractedData = zlib.gunzipSync(gzipData);
    fs.writeFileSync(targetPath, extractedData);
    console.log(`Extracted: ${file} -> ${file.replace('.gz', '')}`);
  } catch (error) {
    console.error(`Error extracting ${file}:`, error.message);
  }
});