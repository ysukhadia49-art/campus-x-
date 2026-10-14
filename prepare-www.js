const fs = require('fs');
const path = require('path');

// List of modules to bundle in exact dependency order (all located directly in root)
const bundleFiles = [
  'mock-data.js',
  'security.js',
  'state.js',
  'navigation.js',
  'motion.js',
  'auth-view.js',
  'student-view.js',
  'faculty-view.js',
  'admin-view.js',
  'stationery-view.js',
  'academics-view.js',
  'ai-chat-view.js',
  'complaints-view.js',
  'lost-found-view.js',
  'app.js'
];

// Clean up any stray www subfolder if it exists (ensures zero subfolders)
const wwwDir = path.join(__dirname, 'www');
if (fs.existsSync(wwwDir)) {
  fs.rmSync(wwwDir, { recursive: true, force: true });
}

// 1. Bundle all JS files
let bundleContent = '/* Campus X AI - Consolidated Application Bundle */\n\n';
let bundledCount = 0;

for (const file of bundleFiles) {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    bundleContent += `\n/* --- File: ${file} --- */\n`;
    bundleContent += fs.readFileSync(filePath, 'utf8') + '\n';
    bundledCount++;
  } else {
    console.warn(`Warning: File not found for bundle: ${file}`);
  }
}

// 2. Write bundle directly to root directory file only (zero subfolders created)
const rootBundleDest = path.join(__dirname, 'campusx.bundle.js');
fs.writeFileSync(rootBundleDest, bundleContent, 'utf8');
console.log(`Created consolidated bundle at: ${rootBundleDest} (${bundleContent.length} bytes from ${bundledCount} files). No subfolders created.`);
