const fs = require('fs');
const path = require('path');

const wwwDir = path.join(__dirname, 'www');

// 1. Bundle all JS files in exact dependency order
const bundleFiles = [
  'js/mock-data.js',
  'js/security.js',
  'js/state.js',
  'js/navigation.js',
  'js/motion.js',
  'js/views/auth-view.js',
  'js/views/student-view.js',
  'js/views/faculty-view.js',
  'js/views/admin-view.js',
  'js/views/stationery-view.js',
  'js/views/academics-view.js',
  'js/views/ai-chat-view.js',
  'js/views/complaints-view.js',
  'js/views/lost-found-view.js',
  'js/app.js'
];

let bundleContent = '/* Campus X AI - Consolidated Application Bundle */\n\n';
for (const file of bundleFiles) {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    bundleContent += `\n/* --- File: ${file} --- */\n`;
    bundleContent += fs.readFileSync(filePath, 'utf8') + '\n';
  } else {
    console.warn(`Warning: File not found for bundle: ${file}`);
  }
}

const bundleDest = path.join(__dirname, 'js', 'campusx.bundle.js');
fs.writeFileSync(bundleDest, bundleContent, 'utf8');
console.log(`Created consolidated bundle at: ${bundleDest} (${bundleContent.length} bytes)`);

// 2. Clean and recreate www directory
if (fs.existsSync(wwwDir)) {
  fs.rmSync(wwwDir, { recursive: true, force: true });
}
fs.mkdirSync(wwwDir, { recursive: true });

// 3. Copy index.html
fs.copyFileSync(path.join(__dirname, 'index.html'), path.join(wwwDir, 'index.html'));

// Helper to copy directory recursively
function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// 4. Copy css, js, and img to www
copyDir(path.join(__dirname, 'css'), path.join(wwwDir, 'css'));
copyDir(path.join(__dirname, 'js'), path.join(wwwDir, 'js'));
if (fs.existsSync(path.join(__dirname, 'img'))) {
  copyDir(path.join(__dirname, 'img'), path.join(wwwDir, 'img'));
}

console.log('Successfully prepared www/ folder with all updated assets.');
