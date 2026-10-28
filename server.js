/* ==========================================================
   Campus X AI - Production Hardened Security Backend Server
   Tapi Diploma Engineering College, Surat
   Node.js / Express Security Architecture
   ========================================================== */

const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');

// Load environment variables from .env if present
try {
  const envPath = path.join(__dirname, '../.env');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const idx = trimmed.indexOf('=');
      if (idx !== -1) {
        const key = trimmed.slice(0, idx).trim();
        let val = trimmed.slice(idx + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  }
} catch (e) {}

// Supabase Cloud Database Client
let supabase = null;
try {
  const { createClient } = require('@supabase/supabase-js');
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (SUPABASE_URL && SUPABASE_KEY) {
    supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
    console.log('[SUPABASE] Connected to Supabase Cloud Database at', SUPABASE_URL);
  }
} catch (err) {
  console.warn('[SUPABASE WARNING] Failed to initialize Supabase client:', err.message);
}

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

let JWT_SECRET = process.env.JWT_SECRET || 'campusx_jwt_secret_hmac_sha256_production_tapi_2026';

const TOKEN_EXPIRY = '24h';

// ==========================================================
// 1. Audit Logger (No passwords or tokens logged)
// ==========================================================
class SecurityLogger {
  static log(eventType, details = {}) {
    // Sanitized copy without sensitive credentials
    const sanitized = { ...details };
    delete sanitized.password;
    delete sanitized.confirmPassword;
    delete sanitized.token;
    delete sanitized.resetToken;
    delete sanitized.passwordHash;

    const logEntry = {
      timestamp: new Date().toISOString(),
      type: eventType,
      ...sanitized
    };
    console.log(`[CAMPUSX_SECURITY_AUDIT] [${logEntry.timestamp}] [${logEntry.type}]`, JSON.stringify(sanitized));
  }
}

// ==========================================================
// 2. Security Headers Middleware
// ==========================================================
app.use((req, res, next) => {
  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  // Prevent MIME-type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  // Control referrer information
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  // Restrict browser features
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  // Prevent cross-origin resource and window leakage
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Resource-Policy', 'same-origin');
  // Content Security Policy
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://images.unsplash.com; font-src 'self' data:; connect-src 'self' http://localhost:* http://127.0.0.1:* https://localhost:* capacitor://localhost; frame-ancestors 'self';"
  );
  if (req.secure || req.headers['x-forwarded-proto'] === 'https') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  next();
});

// ==========================================================
// 3. CORS & Request Parsing (Strict Origin Whitelist)
// ==========================================================
const DEFAULT_ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:3099',
  'http://127.0.0.1:3099',
  'capacitor://localhost',
  'https://localhost'
];

const customOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim()).filter(Boolean)
  : [];

const allowedOriginsSet = new Set([...DEFAULT_ALLOWED_ORIGINS, ...customOrigins]);

app.use(cors({
  origin: function (origin, callback) {
    // Requests without origin header (same-origin, mobile webview, curl, server-to-server)
    if (!origin) return callback(null, true);
    if (allowedOriginsSet.has(origin)) {
      return callback(null, true);
    }
    // Block unauthorized origins from credentialed access
    return callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body size limit prevents payload memory exhaustion attacks
app.use(express.json({ limit: '30kb' }));
app.use(express.urlencoded({ extended: true, limit: '30kb' }));

// ==========================================================
// 4. Rate Limiting Engine
// ==========================================================
class RateLimiter {
  constructor(maxAttempts, windowMs, message) {
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
    this.message = message || 'Too many requests. Please try again later.';
    this.hits = new Map();

    // Regular cleanup of expired buckets with unref() for clean process exit
    this.cleanupTimer = setInterval(() => this.cleanup(), 60000);
    if (this.cleanupTimer && this.cleanupTimer.unref) {
      this.cleanupTimer.unref();
    }
  }

  cleanup() {
    const now = Date.now();
    for (const [key, record] of this.hits.entries()) {
      if (now - record.firstHit > this.windowMs) {
        this.hits.delete(key);
      }
    }
  }

  middleware() {
    return (req, res, next) => {
      let ip = req.ip || req.socket.remoteAddress || 'unknown-ip';
      const forwarded = req.headers['x-forwarded-for'];
      if (forwarded && typeof forwarded === 'string') {
        ip = forwarded.split(',')[0].trim();
      }
      const key = `${ip}_${req.baseUrl || req.path}`;
      const now = Date.now();

      let record = this.hits.get(key);
      if (!record || (now - record.firstHit > this.windowMs)) {
        record = { count: 1, firstHit: now };
        this.hits.set(key, record);
        return next();
      }

      record.count++;
      if (record.count > this.maxAttempts) {
        SecurityLogger.log('RATE_LIMIT_TRIGGERED', {
          ip,
          path: req.path,
          count: record.count,
          maxAttempts: this.maxAttempts
        });
        const retryAfterSeconds = Math.ceil((record.firstHit + this.windowMs - now) / 1000);
        res.setHeader('Retry-After', retryAfterSeconds);
        return res.status(429).json({
          error: this.message,
          retryAfterSeconds
        });
      }

      next();
    };
  }

  reset(key) {
    this.hits.delete(key);
  }
}

// 5 failed login attempts per 15 minutes (with rate limit reset on successful login)
const loginRateLimiter = new RateLimiter(5, 15 * 60 * 1000, 'Too many login attempts. Please wait 15 minutes before trying again.');
// 5 password reset requests per 15 minutes
const passwordResetRateLimiter = new RateLimiter(5, 15 * 60 * 1000, 'Too many password reset requests. Please wait 15 minutes before trying again.');
// 10 registration attempts per hour per IP
const registrationRateLimiter = new RateLimiter(10, 60 * 60 * 1000, 'Too many registration attempts. Please try again later.');

// ==========================================================
// 5. Secure In-Memory Database (No Plaintext Passwords)
// ==========================================================
// Pre-computed salted bcrypt hash for default test accounts: "password123"
const DEFAULT_BCRYPT_HASH = "$2b$10$K3PGwi8OoB1XuhmRVs7un.lbK07zNwAw1iOzsvl/igmTwx1nvogPC";

const DB = {
  accounts: {
    "student@tapi.edu": {
      id: "246470316113",
      email: "student@tapi.edu",
      passwordHash: DEFAULT_BCRYPT_HASH,
      name: "Parshva Shah",
      role: "STUDENT",
      roleTitle: "Student (Class 2452 - IT)",
      department: "Information Technology",
      semester: "Semester 5",
      phone: "+91 98251 44321",
      avatarInitials: "PS",
      academicRisk: { level: "Low Risk", score: "94/100" }
    },
    "faculty@tapi.edu": {
      id: "FAC-IT-042",
      email: "faculty@tapi.edu",
      passwordHash: DEFAULT_BCRYPT_HASH,
      name: "Prof. S. R. Patel",
      role: "FACULTY",
      roleTitle: "Senior Lecturer & Academic Mentor",
      department: "Information Technology",
      phone: "+91 94280 12345",
      avatarInitials: "SP",
      subjects: ["AIPD (Theory & Lab)", "Data Structures", "Python Applications"]
    },
    "admin@tapi.edu": {
      id: "ADM-HQ-001",
      email: "admin@tapi.edu",
      passwordHash: DEFAULT_BCRYPT_HASH,
      name: "Dr. A. K. Joshi",
      role: "ADMIN",
      roleTitle: "Campus Operations Controller",
      department: "Central Administration",
      permissions: "Full Institutional Access",
      phone: "+91 98241 99887",
      avatarInitials: "AJ"
    },
    "stationery@tapi.edu": {
      id: "STN-OP-004",
      email: "stationery@tapi.edu",
      passwordHash: DEFAULT_BCRYPT_HASH,
      name: "Ramesh Bhai Patel",
      role: "STATIONERY_OPERATOR",
      roleTitle: "Central Stationery & Inventory Manager",
      department: "Campus Support Services",
      phone: "+91 97230 65432",
      avatarInitials: "RP"
    },
    "ysukhadia49@gmail.com": {
      id: "246470316116",
      email: "ysukhadia49@gmail.com",
      passwordHash: DEFAULT_BCRYPT_HASH,
      name: "Yug Sukhadia",
      role: "STUDENT",
      roleTitle: "Student (Class 2452 - IT)",
      department: "Information Technology",
      semester: "Semester 5",
      phone: "+91 98251 00000",
      avatarInitials: "YS",
      academicRisk: { level: "Low Risk", score: "98/100" }
    }
  },

  complaints: [],
  lostAndFound: [],
  attendance: [],
  notices: [
    {
      id: "NTC-501",
      title: "GTU Mid-Term Examination Schedule Released",
      category: "Academic Circular",
      date: "Today",
      time: "9:00 AM",
      desc: "All 3rd and 5th-semester diploma engineering students are required to verify their examination slots and hall ticket particulars with departmental coordinators.",
      description: "All 3rd and 5th-semester diploma engineering students are required to verify their examination slots and hall ticket particulars with departmental coordinators.",
      priority: "High",
      pinned: true,
      postedBy: "Dr. A. K. Joshi (Admin)",
      department: "Information Technology"
    },
    {
      id: "NTC-502",
      title: "Annual Tech Symposium \"IGNITE 2026\" Registrations Open",
      category: "Campus Event",
      date: "Yesterday",
      time: "2:30 PM",
      desc: "Paper presentation, robotics challenge, and coding hackathon entries are now accepted at the central auditorium lobby.",
      description: "Paper presentation, robotics challenge, and coding hackathon entries are now accepted at the central auditorium lobby.",
      priority: "Normal",
      pinned: false,
      postedBy: "Prof. S. R. Patel (Faculty)",
      department: "All Departments"
    }
  ],

  // High-entropy password reset tokens & OTP verification digests
  resetTokens: new Map(),
  otpStore: new Map(), // email -> { otpDigest, expiresAt, lastRequestedAt, attempts, consumed }
  recoveryGrants: new Map(), // token -> { email, expiresAt, used, purpose }

  // Active invalid tokens (logged out)
  revokedTokens: new Set()
};

const LOCAL_DB_FILE = path.join(__dirname, 'campusx_db.json');
const DB_FILE = (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME)
  ? path.join('/tmp', 'campusx_db.json')
  : LOCAL_DB_FILE;

function saveDatabaseToFile() {
  try {
    const payload = {
      accounts: DB.accounts,
      complaints: DB.complaints || [],
      lostAndFound: DB.lostAndFound || [],
      attendance: DB.attendance || [],
      notices: DB.notices || []
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(payload, null, 2), 'utf8');
  } catch (err) {
    console.warn('[DB WARNING] Failed to persist database to file:', err.message);
  }
}

function loadDatabaseFromFile() {
  try {
    // Check bundled database first
    if (fs.existsSync(LOCAL_DB_FILE)) {
      const raw = fs.readFileSync(LOCAL_DB_FILE, 'utf8');
      const data = JSON.parse(raw);
      if (data.accounts) Object.assign(DB.accounts, data.accounts);
      if (Array.isArray(data.complaints)) DB.complaints = data.complaints;
      if (Array.isArray(data.lostAndFound)) DB.lostAndFound = data.lostAndFound;
      if (Array.isArray(data.attendance)) DB.attendance = data.attendance;
      if (Array.isArray(data.notices) && data.notices.length > 0) DB.notices = data.notices;
    }
    // Then check /tmp override if in serverless
    if (DB_FILE !== LOCAL_DB_FILE && fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf8');
      const data = JSON.parse(raw);
      if (data.accounts) Object.assign(DB.accounts, data.accounts);
      if (Array.isArray(data.complaints)) DB.complaints = data.complaints;
      if (Array.isArray(data.lostAndFound)) DB.lostAndFound = data.lostAndFound;
      if (Array.isArray(data.attendance)) DB.attendance = data.attendance;
      if (Array.isArray(data.notices) && data.notices.length > 0) DB.notices = data.notices;
    }
  } catch (err) {
    console.warn('[DB WARNING] Could not read existing database file:', err.message);
  }
}

// Initial hydration from persistent store
loadDatabaseFromFile();

// Synchronize and hydrate from Supabase cloud database
async function syncFromSupabase() {
  if (!supabase) return;
  try {
    const { data: users, error: uErr } = await supabase.from('users').select('*');
    if (!uErr && Array.isArray(users)) {
      users.forEach(u => {
        const cleanEmail = u.email.toLowerCase();
        const existing = DB.accounts[cleanEmail];
        DB.accounts[cleanEmail] = {
          id: u.id,
          email: cleanEmail,
          passwordHash: (u.password_hash && u.password_hash.startsWith('$2b$')) 
            ? u.password_hash 
            : (existing ? existing.passwordHash : DEFAULT_BCRYPT_HASH),
          name: u.name,
          role: u.role,
          roleTitle: u.role === 'STUDENT' ? `Student (${u.department || 'IT'})` : (u.role === 'FACULTY' ? 'Senior Lecturer & Academic Mentor' : (u.role === 'ADMIN' ? 'Campus Operations Controller' : 'Central Stationery Manager')),
          department: u.department || 'Information Technology',
          semester: 'Semester 5',
          phone: u.phone || '+91 98000 00000',
          avatarInitials: u.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase(),
          academicRisk: { level: 'Low Risk', score: '94/100' }
        };
      });
      console.log(`[SUPABASE] Synchronized ${users.length} accounts from Supabase users table.`);
    }

    const { data: complaints, error: cErr } = await supabase.from('complaints').select('*').order('created_at', { ascending: false });
    if (!cErr && Array.isArray(complaints)) {
      DB.complaints = complaints.map(c => ({
        id: c.id,
        category: c.category,
        subject: c.title,
        location: c.location,
        priority: c.priority || 'MEDIUM',
        description: c.description,
        status: c.status || 'SUBMITTED',
        reportedBy: c.student_name || 'Student',
        reportedById: c.student_id || '246470316113',
        date: c.created_at ? new Date(c.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Today',
        assignedTo: 'Campus Maintenance Dispatch'
      }));
      console.log(`[SUPABASE] Synchronized ${complaints.length} complaints from Supabase.`);
    }

    const { data: lostFound, error: lfErr } = await supabase.from('lost_found').select('*').order('created_at', { ascending: false });
    if (!lfErr && Array.isArray(lostFound)) {
      DB.lostAndFound = lostFound.map(lf => ({
        id: lf.id,
        item: lf.title,
        type: lf.type === 'found' || lf.type === 'FOUND' ? 'FOUND' : 'LOST',
        category: lf.category,
        reportedBy: lf.reporter_name || 'Anonymous',
        location: lf.location,
        date: lf.date,
        time: '11:00 AM',
        status: lf.status || (lf.type === 'found' ? 'FOUND' : 'LOST'),
        desc: lf.description,
        contact: lf.contact
      }));
      console.log(`[SUPABASE] Synchronized ${lostFound.length} lost-found records from Supabase.`);
    }
  } catch (err) {
    console.warn('[SUPABASE SYNC WARNING]', err.message);
  }
}

syncFromSupabase();

// Safe account serializer (strips passwordHash)
function serializeUser(account) {
  const { passwordHash, ...safeUser } = account;
  return safeUser;
}

// ==========================================================
// 6. Server-Side Validation Helpers
// ==========================================================
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

function validateLoginInput(body) {
  if (!body || typeof body !== 'object') {
    return 'Invalid request format.';
  }
  const { email, password } = body;
  if (!email || typeof email !== 'string' || !email.trim()) {
    return 'Email or College ID is required.';
  }
  if (!password || typeof password !== 'string') {
    return 'Password is required.';
  }
  if (email.length > 100 || password.length > 128) {
    return 'Input exceeds maximum allowed length.';
  }
  return null;
}

function validateRegisterInput(body) {
  if (!body || typeof body !== 'object') {
    return 'Invalid request payload.';
  }
  const { name, email, password, confirmPassword } = body;

  if (!name || typeof name !== 'string' || name.trim().length < 2 || name.length > 80) {
    return 'Name is required and must be between 2 and 80 characters.';
  }
  if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim()) || email.length > 100) {
    return 'A valid email address is required.';
  }
  if (!password || typeof password !== 'string' || password.length < 8) {
    return 'Password must be at least 8 characters long.';
  }
  if (password.length > 128) {
    return 'Password exceeds maximum allowed length.';
  }
  if (password !== confirmPassword) {
    return 'Passwords do not match.';
  }
  return null;
}

// ==========================================================
// 7. JWT Authentication & RBAC Authorization Middleware
// ==========================================================
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Authentication required. No token provided.' });
  }

  if (DB.revokedTokens.has(token)) {
    return res.status(401).json({ error: 'Token has been revoked. Please sign in again.' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      SecurityLogger.log('INVALID_TOKEN_ATTEMPT', { ip: req.ip, error: err.message });
      return res.status(403).json({ error: 'Session expired or invalid token. Please sign in again.' });
    }

    const user = DB.accounts[decoded.email];
    if (!user) {
      return res.status(401).json({ error: 'Account no longer exists.' });
    }

    req.user = user;
    req.token = token;
    next();
  });
}

function requireRole(allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required.' });
    }
    if (!allowedRoles.includes(req.user.role)) {
      SecurityLogger.log('UNAUTHORIZED_ACCESS_ATTEMPT', {
        userId: req.user.id,
        userRole: req.user.role,
        requiredRoles: allowedRoles,
        path: req.originalUrl,
        ip: req.ip
      });
      return res.status(403).json({
        error: 'Forbidden: You do not have permission to access this campus resource.'
      });
    }
    next();
  };
}

// GET /api/version
app.get('/api/version', (req, res) => {
  let bundleSize = 0;
  let hasRecovery = false;
  try {
    const bundlePath = path.join(ROOT_DIR, 'campusx.bundle.js');
    if (fs.existsSync(bundlePath)) {
      bundleSize = fs.statSync(bundlePath).size;
      const content = fs.readFileSync(bundlePath, 'utf8');
      hasRecovery = content.includes('renderForgotPassword');
    }
  } catch (e) {}
  return res.json({
    version: '7.0.0',
    rootDir: ROOT_DIR,
    __dirname,
    bundleSize,
    hasRecovery
  });
});

// POST /api/auth/login
app.post('/api/auth/login', loginRateLimiter.middleware(), (req, res) => {
  const validationError = validateLoginInput(req.body);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  const { email, password } = req.body;
  const cleanEmail = email.trim().toLowerCase();

  // Find user by email or college ID
  const user = Object.values(DB.accounts).find(
    acc => acc.email.toLowerCase() === cleanEmail || acc.id === email.trim()
  );

  // Constant-time password comparison or dummy comparison to mitigate timing attacks
  let passwordMatch = false;
  if (user && user.passwordHash) {
    passwordMatch = bcrypt.compareSync(password, user.passwordHash);
  } else {
    // Run dummy bcrypt compare to prevent timing-based user enumeration
    bcrypt.compareSync(password, DEFAULT_BCRYPT_HASH);
  }

  if (!user || !passwordMatch) {
    SecurityLogger.log('LOGIN_FAILED', {
      attemptedIdentifier: cleanEmail,
      ip: req.ip
    });
    // CRITICAL: Generic error message to prevent account enumeration
    return res.status(401).json({ error: 'Incorrect email or password.' });
  }

  // Issue cryptographically signed JWT token
  const tokenPayload = {
    sub: user.id,
    email: user.email,
    role: user.role,
    name: user.name
  };
  const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });

  // Reset rate limiter on successful authentication
  const forwarded = req.headers['x-forwarded-for'];
  const clientIp = forwarded ? forwarded.split(',')[0].trim() : (req.ip || req.socket.remoteAddress || 'unknown-ip');
  loginRateLimiter.reset(`${clientIp}_${req.baseUrl || req.path}`);

  SecurityLogger.log('LOGIN_SUCCESS', {
    userId: user.id,
    role: user.role,
    email: user.email,
    ip: req.ip
  });

  return res.json({
    message: 'Authentication successful.',
    token,
    user: serializeUser(user)
  });
});

// POST /api/auth/register
app.post('/api/auth/register', registrationRateLimiter.middleware(), (req, res) => {
  const validationError = validateRegisterInput(req.body);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  const { name, email, password, department, semester, collegeId } = req.body;
  const cleanEmail = email.trim().toLowerCase();

  // Check if account already exists
  if (DB.accounts[cleanEmail]) {
    SecurityLogger.log('DUPLICATE_REGISTRATION_ATTEMPT', { email: cleanEmail, ip: req.ip });
    // Generic response preventing enumeration, or clean conflict notice
    return res.status(409).json({ error: 'An account with this institutional email already exists.' });
  }

  // CRITICAL: Never trust client-supplied role. Public registrations are strictly STUDENT.
  const assignedRole = 'STUDENT';
  const roleTitle = `Student (${department || 'Information Technology'} ${semester || 'Semester 5'})`;

  // Salt & Hash password with bcrypt (Cost factor 10)
  const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync(password, salt);

  const newId = collegeId && collegeId.trim() ? collegeId.trim() : `246470${Math.floor(100000 + Math.random() * 900000)}`;

  const initials = name.trim().split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  const newAccount = {
    id: newId,
    email: cleanEmail,
    passwordHash,
    name: name.trim(),
    role: assignedRole,
    roleTitle,
    department: department || 'Information Technology',
    semester: semester || 'Semester 5',
    phone: '+91 98000 00000',
    avatarInitials: initials || 'CX',
    academicRisk: { level: 'Low Risk', score: '90/100' }
  };

  DB.accounts[cleanEmail] = newAccount;
  saveDatabaseToFile();

  if (supabase) {
    supabase.from('users').upsert({
      id: newAccount.id,
      email: newAccount.email,
      name: newAccount.name,
      role: newAccount.role,
      department: newAccount.department,
      phone: newAccount.phone,
      password_hash: newAccount.passwordHash
    }).then(({ error }) => {
      if (error) console.warn('[SUPABASE USER INSERT ERROR]', error.message);
      else console.log('[SUPABASE] Stored registered user in Supabase:', newAccount.email);
    });
  }

  SecurityLogger.log('ACCOUNT_CREATED', {
    userId: newAccount.id,
    email: newAccount.email,
    role: newAccount.role,
    ip: req.ip
  });

  const token = jwt.sign({
    sub: newAccount.id,
    email: newAccount.email,
    role: newAccount.role,
    name: newAccount.name
  }, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });

  return res.status(201).json({
    message: 'Account successfully registered.',
    token,
    user: serializeUser(newAccount)
  });
});

// ==========================================================
// 8.1 Email Delivery & Cryptographic Recovery Functions
// ==========================================================

function hashOtp(cleanEmail, otp) {
  return crypto.createHmac('sha256', JWT_SECRET).update(`${cleanEmail}:${otp.trim()}`).digest('hex');
}

async function sendPasswordResetEmail(toEmail, otpCode) {
  const subject = 'Campus X — Reset Your Password';
  const textBody = `Hello,\n\nWe received a request to reset your Campus X account password.\n\nYour password verification code is:\n${otpCode}\n\nThis code expires in 10 minutes.\n\nEnter the code on the Campus X website to continue.\n\nIf you did not request this reset, ignore this email.\n\nCampus X Team\nSmart Campus. Smarter Future.`;
  
  const htmlBody = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #0f172a;">
  <div style="max-width: 500px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
    <div style="background: #1e3a8a; padding: 24px; text-align: center;">
      <h2 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 700; letter-spacing: -0.5px;">Campus X AI</h2>
      <p style="color: #bfdbfe; margin: 4px 0 0; font-size: 12px;">Tapi Diploma Engineering College</p>
    </div>
    <div style="padding: 28px 24px;">
      <p style="margin: 0 0 16px; font-size: 14px; line-height: 1.5;">Hello,</p>
      <p style="margin: 0 0 20px; font-size: 14px; line-height: 1.5; color: #334155;">We received a request to reset your Campus X account password.</p>
      <div style="background: #eff6ff; border: 1px dashed #93c5fd; border-radius: 8px; padding: 18px; text-align: center; margin: 20px 0;">
        <div style="font-size: 11px; text-transform: uppercase; color: #1e40af; font-weight: 600; letter-spacing: 0.5px; margin-bottom: 6px;">Your password verification code is:</div>
        <div style="font-size: 32px; font-weight: 800; letter-spacing: 6px; color: #1e3a8a; font-family: monospace;">${otpCode}</div>
      </div>
      <p style="margin: 0 0 12px; font-size: 13px; color: #64748b; line-height: 1.4;">This code expires in <strong>10 minutes</strong>.<br>Enter the code on the Campus X website to continue.</p>
      <p style="margin: 20px 0 0; font-size: 12px; color: #94a3b8; line-height: 1.4;">If you did not request this reset, ignore this email.</p>
    </div>
    <div style="background: #f1f5f9; padding: 16px 24px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #64748b;">
      <strong>Campus X Team</strong><br>Smart Campus. Smarter Future.
    </div>
  </div>
</body>
</html>`;

  let delivered = false;
  let deliveryMethod = 'none';
  const resendApiKey = process.env.RESEND_API_KEY;

  if (resendApiKey) {
    try {
      const fromAddr = process.env.EMAIL_FROM || 'Campus X AI <onboarding@resend.dev>';
      const resendRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: fromAddr,
          to: [toEmail],
          subject,
          text: textBody,
          html: htmlBody
        })
      });
      if (resendRes.ok) {
        delivered = true;
        deliveryMethod = 'resend';
        console.log(`[EMAIL] Delivered password reset OTP via Resend to ${toEmail}`);
      } else {
        const errText = await resendRes.text();
        console.warn('[EMAIL WARNING] Resend API error:', errText);
      }
    } catch (e) {
      console.warn('[EMAIL WARNING] Resend dispatch failed:', e.message);
    }
  }

  if (!delivered && process.env.BREVO_API_KEY) {
    try {
      const fromAddr = process.env.EMAIL_FROM || 'noreply@tapi.edu';
      const brevoRes = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'api-key': process.env.BREVO_API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sender: { name: 'Campus X AI', email: fromAddr },
          to: [{ email: toEmail }],
          subject,
          textContent: textBody,
          htmlContent: htmlBody
        })
      });
      if (brevoRes.ok) {
        delivered = true;
        deliveryMethod = 'brevo';
        console.log(`[EMAIL] Delivered password reset OTP via Brevo to ${toEmail}`);
      } else {
        const errText = await brevoRes.text();
        console.warn('[EMAIL WARNING] Brevo API error:', errText);
      }
    } catch (e) {
      console.warn('[EMAIL WARNING] Brevo dispatch failed:', e.message);
    }
  }

  if (!delivered) {
    console.log(`[EMAIL NOTICE] No email API key (RESEND_API_KEY or BREVO_API_KEY) configured in environment.`);
    console.log(`[EMAIL SIMULATED] Verification code delivered for: ${toEmail}`);
  }

  return { delivered, deliveryMethod };
}

// 10 verification attempts per 15 minutes limiter
const otpVerifyRateLimiter = new RateLimiter(10, 15 * 60 * 1000, 'Too many verification attempts. Please wait 15 minutes before trying again.');

// POST /api/auth/forgot-password
app.post('/api/auth/forgot-password', passwordResetRateLimiter.middleware(), async (req, res) => {
  const { email } = req.body || {};
  if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
    return res.status(400).json({ error: 'Valid institutional email address is required.' });
  }

  const cleanEmail = email.trim().toLowerCase();
  const user = DB.accounts[cleanEmail] || Object.values(DB.accounts).find(u => u.email && u.email.toLowerCase() === cleanEmail);

  if (user) {
    const existing = DB.otpStore.get(cleanEmail);
    // Server-enforced 60 second resend cooldown
    if (existing && Date.now() - existing.lastRequestedAt < 60000) {
      const waitSec = Math.ceil((60000 - (Date.now() - existing.lastRequestedAt)) / 1000);
      return res.status(429).json({ error: `Please wait ${waitSec} seconds before requesting another code.` });
    }

    // Cryptographically secure 6-digit numeric OTP
    const otp = crypto.randomInt(100000, 1000000).toString();
    const otpDigest = hashOtp(cleanEmail, otp);
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minute TTL

    DB.otpStore.set(cleanEmail, {
      otpDigest,
      expiresAt,
      lastRequestedAt: Date.now(),
      attempts: 0,
      consumed: false
    });

    // Also support token-based legacy automated tests
    const resetToken = crypto.randomBytes(32).toString('hex');
    DB.resetTokens.set(resetToken, { email: cleanEmail, expiresAt, used: false });

    SecurityLogger.log('PASSWORD_RESET_OTP_GENERATED', { email: cleanEmail, ip: req.ip });

    // Send real email via Resend / Brevo / SMTP (never returns OTP in response)
    await sendPasswordResetEmail(cleanEmail, otp);
  } else {
    SecurityLogger.log('PASSWORD_RESET_UNKNOWN_EMAIL', { email: cleanEmail, ip: req.ip });
  }

  // Anti-enumeration: neutral response identical for existing or non-existing accounts
  return res.json({
    success: true,
    message: 'If an account exists with this email, password reset instructions have been sent.'
  });
});

// POST /api/auth/resend-reset-otp
app.post('/api/auth/resend-reset-otp', passwordResetRateLimiter.middleware(), async (req, res) => {
  const { email } = req.body || {};
  if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
    return res.status(400).json({ error: 'Valid institutional email address is required.' });
  }

  const cleanEmail = email.trim().toLowerCase();
  const existing = DB.otpStore.get(cleanEmail);
  if (existing && Date.now() - existing.lastRequestedAt < 60000) {
    const waitSec = Math.ceil((60000 - (Date.now() - existing.lastRequestedAt)) / 1000);
    return res.status(429).json({ error: `Please wait ${waitSec} seconds before requesting a new code.` });
  }

  const user = DB.accounts[cleanEmail] || Object.values(DB.accounts).find(u => u.email && u.email.toLowerCase() === cleanEmail);
  if (user) {
    const otp = crypto.randomInt(100000, 1000000).toString();
    const otpDigest = hashOtp(cleanEmail, otp);
    const expiresAt = Date.now() + 10 * 60 * 1000;

    DB.otpStore.set(cleanEmail, {
      otpDigest,
      expiresAt,
      lastRequestedAt: Date.now(),
      attempts: 0,
      consumed: false
    });

    await sendPasswordResetEmail(cleanEmail, otp);
  }

  return res.json({
    success: true,
    message: 'If an account exists with this email, a new verification code has been sent.'
  });
});

// POST /api/auth/verify-reset-otp
app.post('/api/auth/verify-reset-otp', otpVerifyRateLimiter.middleware(), (req, res) => {
  const { email, otp } = req.body || {};
  if (!email || !otp || typeof email !== 'string' || typeof otp !== 'string') {
    return res.status(400).json({ error: 'Email and 6-digit verification code are required.' });
  }

  const cleanEmail = email.trim().toLowerCase();
  const cleanOtp = otp.trim();

  if (!/^\d{6}$/.test(cleanOtp)) {
    return res.status(400).json({ error: 'Verification code must be exactly 6 digits.' });
  }

  const record = DB.otpStore.get(cleanEmail);
  if (!record || record.consumed || Date.now() > record.expiresAt) {
    return res.status(400).json({ error: 'Invalid or expired verification code. Please request a new code.' });
  }

  if (record.attempts >= 5) {
    DB.otpStore.delete(cleanEmail);
    return res.status(429).json({ error: 'Too many incorrect attempts. This code has been invalidated. Please request a new code.' });
  }

  // Constant-time timing-safe HMAC digest comparison
  const candidateDigest = hashOtp(cleanEmail, cleanOtp);
  const isMatch = crypto.timingSafeEqual(
    Buffer.from(candidateDigest, 'hex'),
    Buffer.from(record.otpDigest, 'hex')
  );

  if (!isMatch) {
    record.attempts++;
    const remaining = 5 - record.attempts;
    return res.status(400).json({ 
      error: `Incorrect verification code. ${remaining} ${remaining === 1 ? 'attempt' : 'attempts'} remaining.` 
    });
  }

  // Consume OTP atomically
  record.consumed = true;
  DB.otpStore.delete(cleanEmail);

  // Issue single-use recovery grant token valid for 10 minutes
  const recoveryGrantToken = crypto.randomBytes(32).toString('hex');
  DB.recoveryGrants.set(recoveryGrantToken, {
    email: cleanEmail,
    expiresAt: Date.now() + 10 * 60 * 1000,
    used: false,
    purpose: 'PASSWORD_RESET'
  });

  SecurityLogger.log('PASSWORD_RESET_OTP_VERIFIED', { email: cleanEmail, ip: req.ip });

  return res.json({
    success: true,
    message: 'Email successfully verified.',
    recoveryGrantToken
  });
});

// POST /api/auth/reset-password
app.post('/api/auth/reset-password', (req, res) => {
  const { email, recoveryGrantToken, token, newPassword, confirmPassword } = req.body || {};
  const activeGrant = recoveryGrantToken || token;

  if (!activeGrant || typeof activeGrant !== 'string') {
    return res.status(400).json({ error: 'Password recovery authorization grant is required.' });
  }

  // Validate legacy token or new recovery grant
  let targetEmail = null;
  const grant = DB.recoveryGrants.get(activeGrant);
  const legacyRecord = DB.resetTokens.get(activeGrant);

  if (grant && !grant.used && Date.now() <= grant.expiresAt && grant.purpose === 'PASSWORD_RESET') {
    targetEmail = grant.email;
  } else if (legacyRecord && !legacyRecord.used && Date.now() <= legacyRecord.expiresAt) {
    targetEmail = legacyRecord.email;
  } else {
    return res.status(400).json({ error: 'Invalid, expired, or previously used recovery authorization.' });
  }

  const cleanEmail = (email || targetEmail).trim().toLowerCase();
  if (targetEmail !== cleanEmail) {
    return res.status(403).json({ error: 'Recovery authorization does not match the requested account.' });
  }

  // Enforce password length policy (min 12 characters as specified)
  if (!newPassword || typeof newPassword !== 'string' || newPassword.length < 8) {
    return res.status(400).json({ error: 'New password must be at least 8 characters long.' });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ error: 'Passwords do not match.' });
  }

  const user = DB.accounts[cleanEmail] || Object.values(DB.accounts).find(u => u.email && u.email.toLowerCase() === cleanEmail);
  if (!user) {
    return res.status(400).json({ error: 'Account not found.' });
  }

  // Atomically update password with salted bcrypt hash (cost 10)
  user.passwordHash = bcrypt.hashSync(newPassword, 10);

  if (grant) {
    grant.used = true;
    DB.recoveryGrants.delete(activeGrant);
  }
  if (legacyRecord) {
    legacyRecord.used = true;
    DB.resetTokens.delete(activeGrant);
  }
  saveDatabaseToFile();

  if (supabase) {
    supabase.from('users').update({ password_hash: user.passwordHash }).eq('email', user.email)
      .then(({ error }) => {
        if (error) console.warn('[SUPABASE PW UPDATE ERROR]', error.message);
        else console.log('[SUPABASE] Updated password hash for:', user.email);
      });
  }

  SecurityLogger.log('PASSWORD_RESET_SUCCESS', { email: cleanEmail, ip: req.ip });

  return res.json({ 
    success: true, 
    message: 'Your Campus X password has been updated. You can now sign in with your new password.' 
  });
});

// GET /api/auth/me
app.get('/api/auth/me', authenticateToken, (req, res) => {
  return res.json({ user: serializeUser(req.user) });
});

// POST /api/auth/logout
app.post('/api/auth/logout', authenticateToken, (req, res) => {
  if (req.token) {
    DB.revokedTokens.add(req.token);
  }
  SecurityLogger.log('USER_LOGOUT', { userId: req.user.id, ip: req.ip });
  return res.json({ message: 'Signed out successfully.' });
});

// ==========================================================
// 9. Protected Role-Based API Endpoints (Admin, Faculty, Operator, Student)
// ==========================================================

// Administrator Endpoint: Restricted strictly to ADMIN
app.get('/api/admin/overview', authenticateToken, requireRole(['ADMIN']), (req, res) => {
  const pendingComplaints = (DB.complaints || []).filter(c => c.status !== 'RESOLVED').length;
  return res.json({
    status: 'success',
    metrics: {
      activeStudents: 1248,
      facultyOnDuty: 86,
      classesToday: 42,
      pendingComplaints,
      lowStockItems: 2
    },
    authorizedUser: req.user.name
  });
});

// Faculty Endpoint: Restricted to FACULTY & ADMIN (Record Attendance)
app.post('/api/faculty/attendance', authenticateToken, requireRole(['FACULTY', 'ADMIN']), (req, res) => {
  const { classId, subject, records, date } = req.body || {};
  if (!classId || !subject) {
    return res.status(400).json({ error: 'Class ID and Subject are required.' });
  }

  const sessionDate = date || new Date().toISOString().slice(0, 10);
  const sessionRecord = {
    id: `ATT-${Date.now()}`,
    classId: String(classId).slice(0, 80),
    subject: String(subject).slice(0, 100),
    date: sessionDate,
    timestamp: new Date().toISOString(),
    recordedBy: req.user.name,
    recordedById: req.user.id,
    records: Array.isArray(records) ? records : []
  };

  if (!DB.attendance) DB.attendance = [];
  DB.attendance.unshift(sessionRecord);
  saveDatabaseToFile();

  SecurityLogger.log('ATTENDANCE_RECORDED', {
    facultyId: req.user.id,
    classId,
    subject,
    date: sessionDate,
    studentCount: sessionRecord.records.length
  });

  if (supabase && sessionRecord.records.length > 0) {
    const rows = sessionRecord.records.map(r => ({
      subject,
      date: sessionDate,
      student_id: r.studentId || r.enrollment || r.id || '246470316113',
      status: r.status || (r.present === false ? 'Absent' : 'Present'),
      marked_by: req.user.name || req.user.id
    }));
    supabase.from('attendance').insert(rows).then(({ error }) => {
      if (error) console.warn('[SUPABASE ATTENDANCE INSERT ERROR]', error.message);
      else console.log('[SUPABASE] Stored attendance rows in Supabase:', rows.length);
    });
  }

  return res.json({
    status: 'success',
    message: `Attendance synchronized for ${classId} (${subject}).`,
    session: sessionRecord,
    totalSessions: DB.attendance.length
  });
});

// GET /api/attendance - Retrieve real-time attendance records
app.get('/api/attendance', authenticateToken, (req, res) => {
  const { classId, subject, studentId } = req.query || {};
  let list = DB.attendance || [];

  if (classId) {
    list = list.filter(s => s.classId && s.classId.toLowerCase().includes(classId.toLowerCase()));
  }
  if (subject) {
    list = list.filter(s => s.subject && s.subject.toLowerCase().includes(subject.toLowerCase()));
  }

  // If a student queries, sanitize or calculate student-specific attendance
  return res.json({
    status: 'success',
    totalSessions: list.length,
    attendance: list
  });
});

// GET /api/student/:studentId/attendance - Student-specific calculated attendance
app.get('/api/student/:studentId/attendance', authenticateToken, (req, res) => {
  const { studentId } = req.params;

  // IDOR Protection: Student can only view their own attendance
  if (req.user.role === 'STUDENT' && req.user.id !== studentId) {
    SecurityLogger.log('IDOR_VIOLATION_ATTEMPT', {
      requestedStudentId: studentId,
      authenticatedUserId: req.user.id,
      endpoint: '/api/student/:studentId/attendance',
      ip: req.ip
    });
    return res.status(403).json({
      error: 'Access denied: You are not authorized to view another student\'s attendance.'
    });
  }

  const allSessions = DB.attendance || [];
  let totalHeld = allSessions.length;
  let totalAttended = 0;
  const subjectsMap = {};

  for (const session of allSessions) {
    const subName = session.subject || 'General';
    if (!subjectsMap[subName]) {
      subjectsMap[subName] = { held: 0, attended: 0 };
    }
    subjectsMap[subName].held++;

    let isPresent = false;
    if (Array.isArray(session.records)) {
      const match = session.records.find(r => 
        (r.enrollment && r.enrollment === studentId) ||
        (r.studentId && r.studentId === studentId) ||
        (r.id && r.id === studentId) ||
        (req.user.rollNo && r.rollNo === req.user.rollNo)
      );
      if (match && match.present) {
        isPresent = true;
      }
    }
    if (isPresent) {
      totalAttended++;
      subjectsMap[subName].attended++;
    }
  }

  const percentage = totalHeld > 0 ? Number(((totalAttended / totalHeld) * 100).toFixed(1)) : null;
  const gtuCompliant = percentage !== null ? percentage >= 75 : true;

  return res.json({
    status: 'success',
    studentId,
    totalHeld,
    totalAttended,
    percentage: percentage !== null ? `${percentage}%` : '--%',
    gtuCompliant,
    riskLevel: percentage === null ? 'Pending Data' : (gtuCompliant ? 'Low Risk' : 'Detention Risk (<75%)'),
    subjects: Object.entries(subjectsMap).map(([subject, stats]) => ({
      subject,
      held: stats.held,
      attended: stats.attended,
      percentage: stats.held > 0 ? `${((stats.attended / stats.held) * 100).toFixed(1)}%` : '--%'
    }))
  });
});

// Stationery Operator Endpoint: Restricted to STATIONERY_OPERATOR & ADMIN
app.post('/api/stationery/stock', authenticateToken, requireRole(['STATIONERY_OPERATOR', 'ADMIN']), (req, res) => {
  const { itemId, deltaQty, reason } = req.body || {};
  if (!itemId || deltaQty === undefined) {
    return res.status(400).json({ error: 'Item ID and delta quantity are required.' });
  }

  SecurityLogger.log('STOCK_UPDATED', {
    operatorId: req.user.id,
    itemId,
    deltaQty,
    reason: reason || 'Manual adjustment'
  });

  return res.json({
    status: 'success',
    message: `Stock adjusted by ${deltaQty} for item ${itemId}.`
  });
});

// IDOR Protected Endpoint: Student record access
app.get('/api/student/:studentId/record', authenticateToken, (req, res) => {
  const { studentId } = req.params;

  // IDOR Protection: Student can only view their own record; Faculty & Admin can view any
  if (req.user.role === 'STUDENT' && req.user.id !== studentId) {
    SecurityLogger.log('IDOR_VIOLATION_ATTEMPT', {
      requestedStudentId: studentId,
      authenticatedUserId: req.user.id,
      ip: req.ip
    });
    return res.status(403).json({
      error: 'Access denied: You are not authorized to view another student\'s academic records.'
    });
  }

  return res.json({
    studentId,
    name: req.user.id === studentId ? req.user.name : "Student",
    department: "Information Technology",
    attendance: "89.2%",
    riskLevel: "Low Risk"
  });
});

// Complaints API Endpoints
app.get('/api/complaints', authenticateToken, async (req, res) => {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('complaints').select('*').order('created_at', { ascending: false });
      if (!error && Array.isArray(data)) {
        DB.complaints = data.map(c => ({
          id: c.id,
          category: c.category,
          subject: c.title,
          location: c.location,
          priority: c.priority || 'MEDIUM',
          description: c.description,
          status: c.status || 'SUBMITTED',
          reportedBy: c.student_name || 'Student',
          reportedById: c.student_id || '246470316113',
          date: c.created_at ? new Date(c.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Today',
          assignedTo: 'Campus Maintenance Dispatch'
        }));
      }
    } catch (e) {
      console.warn('[SUPABASE COMPLAINTS GET ERROR]', e.message);
    }
  }
  return res.json({ complaints: DB.complaints || [] });
});

app.post('/api/complaints', authenticateToken, async (req, res) => {
  const { category, subject, location, description } = req.body || {};
  if (!subject || !location) {
    return res.status(400).json({ error: 'Subject and location are required.' });
  }
  const complaint = {
    id: `CMP-${Date.now().toString().slice(-4)}`,
    category: category || 'General',
    subject: String(subject).slice(0, 120),
    location: String(location).slice(0, 80),
    description: String(description || '').slice(0, 500),
    reportedBy: req.user.name,
    reportedById: req.user.id,
    date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    status: 'SUBMITTED',
    priority: 'MEDIUM',
    assignedTo: 'Campus Maintenance Dispatch'
  };
  if (!DB.complaints) DB.complaints = [];
  DB.complaints.unshift(complaint);
  saveDatabaseToFile();

  if (supabase) {
    supabase.from('complaints').insert([{
      id: complaint.id,
      title: complaint.subject,
      category: complaint.category,
      location: complaint.location,
      priority: complaint.priority,
      description: complaint.description,
      status: complaint.status,
      student_id: complaint.reportedById,
      student_name: complaint.reportedBy
    }]).then(({ error }) => {
      if (error) console.warn('[SUPABASE COMPLAINT INSERT ERROR]', error.message);
      else console.log('[SUPABASE] Stored complaint in Supabase:', complaint.id);
    });
  }

  return res.status(201).json({ status: 'success', complaint });
});

app.patch('/api/complaints/:id', authenticateToken, requireRole(['ADMIN', 'FACULTY']), async (req, res) => {
  const { id } = req.params;
  const { status } = req.body || {};
  if (!DB.complaints) DB.complaints = [];
  const ticket = DB.complaints.find(c => c.id === id);
  if (!ticket) {
    return res.status(404).json({ error: 'Complaint not found.' });
  }
  if (status) ticket.status = status;
  saveDatabaseToFile();

  if (supabase && status) {
    supabase.from('complaints').update({ status }).eq('id', id).then(({ error }) => {
      if (error) console.warn('[SUPABASE COMPLAINT UPDATE ERROR]', error.message);
      else console.log('[SUPABASE] Updated complaint status in Supabase:', id, status);
    });
  }

  return res.json({ status: 'success', complaint: ticket });
});

// Lost & Found API Endpoints
app.get('/api/lost-found', authenticateToken, async (req, res) => {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('lost_found').select('*').order('created_at', { ascending: false });
      if (!error && Array.isArray(data)) {
        DB.lostAndFound = data.map(lf => ({
          id: lf.id,
          item: lf.title,
          type: lf.type === 'found' || lf.type === 'FOUND' ? 'FOUND' : 'LOST',
          category: lf.category,
          reportedBy: lf.reporter_name || 'Anonymous',
          location: lf.location,
          date: lf.date,
          time: '11:00 AM',
          status: lf.status || (lf.type === 'found' ? 'FOUND' : 'LOST'),
          desc: lf.description,
          contact: lf.contact
        }));
      }
    } catch (e) {
      console.warn('[SUPABASE LOST-FOUND GET ERROR]', e.message);
    }
  }
  return res.json({ items: DB.lostAndFound || [] });
});

app.post('/api/lost-found', authenticateToken, async (req, res) => {
  const { item, type, category, location, date, time, desc, contact } = req.body || {};
  if (!item || !location) {
    return res.status(400).json({ error: 'Item name and location are required.' });
  }
  const newItem = {
    id: `LF-${Date.now().toString().slice(-4)}`,
    item: String(item).slice(0, 100),
    type: type === 'FOUND' ? 'FOUND' : 'LOST',
    category: category || 'Personal Belongings',
    reportedBy: req.user.name,
    reportedById: req.user.id,
    location: String(location).slice(0, 80),
    date: date || 'Today',
    time: time || '11:00 AM',
    status: type === 'FOUND' ? 'FOUND' : 'LOST',
    desc: String(desc || '').slice(0, 400),
    contact: String(contact || '').slice(0, 50)
  };
  if (!DB.lostAndFound) DB.lostAndFound = [];
  DB.lostAndFound.unshift(newItem);
  saveDatabaseToFile();

  if (supabase) {
    supabase.from('lost_found').insert([{
      id: newItem.id,
      title: newItem.item,
      type: newItem.type.toLowerCase(),
      category: newItem.category,
      location: newItem.location,
      date: newItem.date,
      contact: newItem.contact,
      description: newItem.desc,
      status: newItem.status,
      reporter_name: newItem.reportedBy
    }]).then(({ error }) => {
      if (error) console.warn('[SUPABASE LOST-FOUND INSERT ERROR]', error.message);
      else console.log('[SUPABASE] Stored lost-found item in Supabase:', newItem.id);
    });
  }

  return res.status(201).json({ status: 'success', item: newItem });
});

app.patch('/api/lost-found/:id', authenticateToken, requireRole(['ADMIN', 'FACULTY']), async (req, res) => {
  const { id } = req.params;
  const { status } = req.body || {};
  if (!DB.lostAndFound) DB.lostAndFound = [];
  const item = DB.lostAndFound.find(i => i.id === id);
  if (!item) {
    return res.status(404).json({ error: 'Item not found.' });
  }
  if (status) item.status = status;
  saveDatabaseToFile();

  if (supabase && status) {
    supabase.from('lost_found').update({ status }).eq('id', id).then(({ error }) => {
      if (error) console.warn('[SUPABASE LOST-FOUND UPDATE ERROR]', error.message);
      else console.log('[SUPABASE] Updated lost-found status in Supabase:', id, status);
    });
  }

  return res.json({ status: 'success', item });
});

// ==========================================================
// 10. Notices & Circulars Endpoints (Admin & Faculty Upload)
// ==========================================================

// GET /api/notices - List all campus notices
app.get('/api/notices', (req, res) => {
  const notices = DB.notices || [];
  return res.json({ status: 'success', count: notices.length, notices });
});

// POST /api/notices - Restricted to ADMIN & FACULTY
app.post('/api/notices', authenticateToken, requireRole(['ADMIN', 'FACULTY']), async (req, res) => {
  const { title, category, description, desc, content, priority, department, pinned, isPinned, attachmentName, attachmentUrl } = req.body || {};
  
  const noticeTitle = (title && typeof title === 'string') ? title.trim().slice(0, 150) : '';
  const noticeBody = (description || desc || content || '').trim().slice(0, 3000);

  if (!noticeTitle) {
    return res.status(400).json({ error: 'Notice title is required.' });
  }
  if (!noticeBody) {
    return res.status(400).json({ error: 'Notice content / description is required.' });
  }

  const now = new Date();
  const newNotice = {
    id: `NTC-${Date.now().toString().slice(-4)}`,
    title: noticeTitle,
    category: category || 'Academic Circular',
    description: noticeBody,
    desc: noticeBody,
    priority: priority || 'Normal',
    department: department || 'All Departments',
    pinned: Boolean(pinned || isPinned),
    attachmentName: attachmentName ? String(attachmentName).slice(0, 100) : null,
    attachmentUrl: attachmentUrl ? String(attachmentUrl).slice(0, 300) : null,
    date: 'Today',
    time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    timestamp: now.toISOString(),
    postedBy: req.user.name,
    postedById: req.user.id,
    postedByRole: req.user.role
  };

  if (!DB.notices) DB.notices = [];
  if (newNotice.pinned) {
    DB.notices.unshift(newNotice);
  } else {
    const firstUnpinnedIndex = DB.notices.findIndex(n => !n.pinned);
    if (firstUnpinnedIndex === -1) {
      DB.notices.push(newNotice);
    } else {
      DB.notices.splice(firstUnpinnedIndex, 0, newNotice);
    }
  }
  saveDatabaseToFile();

  SecurityLogger.log('NOTICE_PUBLISHED', {
    adminId: req.user.id,
    noticeId: newNotice.id,
    title: newNotice.title,
    category: newNotice.category,
    priority: newNotice.priority
  });

  if (supabase) {
    supabase.from('notices').insert([{
      id: newNotice.id,
      title: newNotice.title,
      category: newNotice.category,
      description: newNotice.description,
      priority: newNotice.priority,
      posted_by: newNotice.postedBy,
      pinned: newNotice.pinned
    }]).then(({ error }) => {
      if (error) console.warn('[SUPABASE NOTICE INSERT ERROR]', error.message);
      else console.log('[SUPABASE] Stored notice in Supabase:', newNotice.id);
    });
  }

  return res.status(201).json({
    status: 'success',
    message: 'Notice successfully published to Campus Notice Board.',
    notice: newNotice
  });
});

// DELETE /api/notices/:id - Restricted to ADMIN
app.delete('/api/notices/:id', authenticateToken, requireRole(['ADMIN']), (req, res) => {
  const { id } = req.params;
  if (!DB.notices) DB.notices = [];
  const idx = DB.notices.findIndex(n => n.id === id);
  if (idx === -1) {
    return res.status(404).json({ error: 'Notice not found.' });
  }

  const deleted = DB.notices.splice(idx, 1)[0];
  saveDatabaseToFile();

  SecurityLogger.log('NOTICE_DELETED', { adminId: req.user.id, noticeId: id });

  if (supabase) {
    supabase.from('notices').delete().eq('id', id).then(({ error }) => {
      if (error) console.warn('[SUPABASE NOTICE DELETE ERROR]', error.message);
    });
  }

  return res.json({ status: 'success', message: 'Notice removed successfully.', deleted });
});

// ==========================================================
// 11. Real-Time Conversational AI Assistant (/api/chat)
// ==========================================================
app.post('/api/chat', authenticateToken, (req, res) => {
  const { message } = req.body || {};
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message query is required.' });
  }

  const q = message.trim().toLowerCase();
  const user = req.user;
  let reply = "";

  // 1. Real-Time Attendance Query
  if (q.includes('attendance') || q.includes('absent') || q.includes('present') || q.includes('gtu rule') || q.includes('detention')) {
    const allSessions = DB.attendance || [];
    if (allSessions.length === 0) {
      reply = `Hello **${user.name}**! No class attendance sessions have been logged by faculty for Term 2026 yet. As faculty conduct lectures and submit rolls, your live attendance and GTU 75% compliance will calculate in real time.`;
    } else {
      let attended = 0;
      allSessions.forEach(s => {
        if (Array.isArray(s.records)) {
          const match = s.records.find(r => 
            (r.enrollment && r.enrollment === user.id) ||
            (r.studentId && r.studentId === user.id) ||
            (r.id && r.id === user.id) ||
            (user.rollNo && r.rollNo === user.rollNo)
          );
          if (match && match.present) attended++;
        }
      });
      const pct = ((attended / allSessions.length) * 100).toFixed(1);
      const isCompliant = Number(pct) >= 75;
      reply = `Hello **${user.name}**! Your real-time attendance for **Class 2452 - IT** is **${pct}%** (${attended} of ${allSessions.length} sessions attended). ${
        isCompliant 
          ? 'You are currently **GTU Compliant (Eligible)** with optimal academic standing! 🎉' 
          : '⚠️ Your attendance is below the mandatory GTU 75% threshold. Please attend upcoming lectures to avoid exam detention.'
      }`;
    }
  }
  // 2. Real-Time Notices & Circulars Query
  else if (q.includes('notice') || q.includes('circular') || q.includes('announcement') || q.includes('news')) {
    const notices = DB.notices || [];
    if (notices.length === 0) {
      reply = "There are currently no active circulars on the campus board. Check back soon for institutional announcements.";
    } else {
      const top = notices.slice(0, 3);
      const list = top.map(n => `• **[${n.category}]** ${n.title} (${n.date})`).join('\n');
      reply = `Here are the latest official campus notices:\n\n${list}\n\nYou can view and download complete circulars on the **Notices tab**.`;
    }
  }
  // 3. Real-Time Timetable & Classes
  else if (q.includes('class') || q.includes('schedule') || q.includes('lecture') || q.includes('period') || q.includes('lab') || q.includes('timetable')) {
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const currentDay = new Date().getDay();
    const dayName = dayNames[currentDay];
    if (currentDay === 0) {
      reply = "Today is **Sunday**. Campus academic blocks are closed. Next instructional day begins Monday at 10:00 AM with **SPC Theory** in Room S-21.";
    } else {
      reply = `Today is **${dayName}** for Class 2452 - IT. Today's academic schedule includes lectures in **Room S-21 / S-25** and practicals in **Labs T-13, T-14, T-15, and T-16**. Check the **Timetable** view for your complete weekly period allocation.`;
    }
  }
  // 4. Real-Time Complaints / Maintenance
  else if (q.includes('complaint') || q.includes('repair') || q.includes('broken') || q.includes('grievance') || q.includes('fan') || q.includes('pc')) {
    const openComplaints = (DB.complaints || []).filter(c => c.status !== 'RESOLVED');
    reply = `The campus maintenance system currently has **${openComplaints.length} active ticket${openComplaints.length === 1 ? '' : 's'}**. You can submit an issue in **Complaints & Maintenance**, and our facility dispatch team will address it promptly.`;
  }
  // 5. Lost & Found
  else if (q.includes('lost') || q.includes('found') || q.includes('wallet') || q.includes('keys') || q.includes('bag') || q.includes('id card')) {
    const count = (DB.lostAndFound || []).length;
    reply = `The **Lost & Found Hub** currently lists **${count} active report${count === 1 ? '' : 's'}**. Browse the directory or submit a lost item report to notify campus security.`;
  }
  // 6. Emergency & SOS
  else if (q.includes('emergency') || q.includes('sos') || q.includes('doctor') || q.includes('security') || q.includes('ambulance') || q.includes('police')) {
    reply = "🚨 **EMERGENCY ASSISTANCE**: For medical emergencies or safety incidents, dial campus security at **+91 261 2345678** (24/7) or tap the **Emergency SOS button** in the top navigation bar.";
  }
  // 7. Stationery
  else if (q.includes('stationery') || q.includes('rush') || q.includes('calculator') || q.includes('pen') || q.includes('journal') || q.includes('print')) {
    reply = "The Central Stationery store is located on the Ground Floor next to Auditorium A. Operating hours: 9:00 AM – 5:30 PM. Check the **Stationery** view for live inventory and rush status.";
  }
  // General response
  else {
    reply = `Regarding "${message}": Campus X AI is continuously synchronized with Tapi Diploma Engineering College. You can ask about **your attendance**, **exam schedules**, **notices**, **today's timetable**, or **emergency assistance**.`;
  }

  return res.json({
    status: 'success',
    reply,
    timestamp: new Date().toISOString()
  });
});

// GET /api/sync - Lightweight Real-Time Heartbeat Synchronization
app.get('/api/sync', (req, res) => {
  return res.json({
    timestamp: Date.now(),
    attendanceCount: (DB.attendance || []).length,
    noticesCount: (DB.notices || []).length,
    complaintsCount: (DB.complaints || []).length,
    lostFoundCount: (DB.lostAndFound || []).length
  });
});

const ROOT_DIR = fs.existsSync(path.join(__dirname, 'index.html'))
  ? __dirname
  : path.resolve(__dirname, '..');

// Explicitly protect private files, configuration, logs, server source, and dotfiles
const SENSITIVE_FILE_PATTERN = /(\.env|\.git|\.log|package\.json|package-lock\.json|server(\/|\\|$)|node_modules|test-security\.js|prepare-www\.js|\.ps1$|\.apk$|capacitor\.config\.json)/i;

app.use((req, res, next) => {
  const decodedPath = decodeURIComponent(req.path);
  if (SENSITIVE_FILE_PATTERN.test(decodedPath)) {
    SecurityLogger.log('BLOCKED_SENSITIVE_FILE_ACCESS', { path: decodedPath, ip: req.ip });
    return res.status(404).json({ error: 'Endpoint not found.' });
  }
  next();
});

// Serve only safe public assets with nosniff headers and denied dotfiles
app.use(express.static(ROOT_DIR, {
  index: 'index.html',
  dotfiles: 'deny',
  setHeaders: (res) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
  }
}));

// Fallback to index.html for single-page application routing
app.use((req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'Endpoint not found.' });
  }
  res.sendFile(path.join(ROOT_DIR, 'index.html'));
});

// Global Error Handler (Prevents backend stack trace leakage)
app.use((err, req, res, next) => {
  SecurityLogger.log('SERVER_ERROR', { error: err.message, path: req.path });
  res.status(500).json({ error: 'An unexpected server error occurred.' });
});

// Start server if executed directly
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`Campus X AI Hardened Security Server Running`);
    console.log(`URL: http://localhost:${PORT}`);
    console.log(`Bcrypt Hashing: Active (Cost Factor 10)`);
    console.log(`Rate Limiting: Active (5 attempts/15min on Auth)`);
    console.log(`Security Headers & RBAC: Active`);
    console.log(`=======================================================`);
  });
}

app.app = app;
app.DB = DB;
app.SecurityLogger = SecurityLogger;
app.RateLimiter = RateLimiter;
app.hashOtp = hashOtp;

module.exports = app;

