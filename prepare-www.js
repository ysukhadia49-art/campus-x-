const fs = require('fs');
const path = require('path');

const wwwDir = path.join(__dirname, 'www');

// List of modules to bundle in exact dependency order
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

/**
 * Resolves a file location across flat or nested repository structures
 */
function resolveFilePath(fileName) {
  const baseName = path.basename(fileName);
  const candidates = [
    path.join(__dirname, fileName),
    path.join(__dirname, baseName),
    path.join(__dirname, 'js', fileName),
    path.join(__dirname, 'js', baseName),
    path.join(__dirname, 'js', 'views', baseName),
    path.join(__dirname, 'views', baseName)
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }
  return null;
}

// 1. Bundle all JS files
let bundleContent = '/* Campus X AI - Consolidated Application Bundle */\n\n';
let bundledCount = 0;

for (const file of bundleFiles) {
  const resolved = resolveFilePath(file);
  if (resolved) {
    bundleContent += `\n/* --- File: ${file} (${path.relative(__dirname, resolved)}) --- */\n`;
    bundleContent += fs.readFileSync(resolved, 'utf8') + '\n';
    bundledCount++;
  } else {
    console.warn(`Warning: File not found for bundle: ${file}`);
  }
}

// Write bundle to root directory
const rootBundleDest = path.join(__dirname, 'campusx.bundle.js');
fs.writeFileSync(rootBundleDest, bundleContent, 'utf8');
console.log(`Created consolidated bundle at: ${rootBundleDest} (${bundleContent.length} bytes from ${bundledCount} files)`);

// If js/ directory exists or is needed, sync bundle there as well
const jsDir = path.join(__dirname, 'js');
if (fs.existsSync(jsDir)) {
  fs.writeFileSync(path.join(jsDir, 'campusx.bundle.js'), bundleContent, 'utf8');
}

// Helper to copy directory recursively
function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
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

// 2. Clean and recreate www directory for Capacitor/Android & distribution
if (fs.existsSync(wwwDir)) {
  fs.rmSync(wwwDir, { recursive: true, force: true });
}
fs.mkdirSync(wwwDir, { recursive: true });

// 3. Copy index.html
if (fs.existsSync(path.join(__dirname, 'index.html'))) {
  fs.copyFileSync(path.join(__dirname, 'index.html'), path.join(wwwDir, 'index.html'));
}

// 4. Copy bundle to www root and www/js
fs.copyFileSync(rootBundleDest, path.join(wwwDir, 'campusx.bundle.js'));
const wwwJsDir = path.join(wwwDir, 'js');
fs.mkdirSync(wwwJsDir, { recursive: true });
fs.copyFileSync(rootBundleDest, path.join(wwwJsDir, 'campusx.bundle.js'));

// 5. Copy css, js, and img directories if they exist
if (fs.existsSync(path.join(__dirname, 'css'))) {
  copyDir(path.join(__dirname, 'css'), path.join(wwwDir, 'css'));
}
if (fs.existsSync(path.join(__dirname, 'js'))) {
  copyDir(path.join(__dirname, 'js'), path.join(wwwDir, 'js'));
}
if (fs.existsSync(path.join(__dirname, 'img'))) {
  copyDir(path.join(__dirname, 'img'), path.join(wwwDir, 'img'));
}

// 6. Copy flat root assets into www for complete distribution
const rootEntries = fs.readdirSync(__dirname, { withFileTypes: true });
for (const entry of rootEntries) {
  if (entry.isFile()) {
    const ext = path.extname(entry.name).toLowerCase();
    if (['.css', '.svg', '.png', '.jpg', '.jpeg', '.gif', '.webp', '.ico', '.json'].includes(ext)) {
      fs.copyFileSync(path.join(__dirname, entry.name), path.join(wwwDir, entry.name));
    }
  }
}

console.log('Successfully prepared www/ folder with all updated assets.');
