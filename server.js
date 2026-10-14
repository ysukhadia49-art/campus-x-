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

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Strict validation of JWT secret in production; ephemeral secure random key in development
let JWT_SECRET = process.env.JWT_SECRET;
if (NODE_ENV === 'production') {
  if (!JWT_SECRET || JWT_SECRET === 'campusx-production-jwt-secure-signing-key-2026-tapi') {
    throw new Error('FATAL SECURITY CONFIGURATION: A unique, strong JWT_SECRET must be configured via environment variables in production.');
  }
} else {
  if (!JWT_SECRET) {
    JWT_SECRET = crypto.randomBytes(32).toString('hex');
    console.warn('[SECURITY NOTICE] No JWT_SECRET set. Using an ephemeral cryptographic 256-bit random secret for this session.');
  }
}

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

// 5 failed login attempts per 15 minutes
const loginRateLimiter = new RateLimiter(5, 15 * 60 * 1000, 'Too many login attempts. Please wait 15 minutes before trying again.');
// 3 password reset requests per 15 minutes
const passwordResetRateLimiter = new RateLimiter(3, 15 * 60 * 1000, 'Too many password reset requests. Please wait 15 minutes before trying again.');
// 10 registration attempts per hour per IP
const registrationRateLimiter = new RateLimiter(10, 60 * 60 * 1000, 'Too many registration attempts. Please try again later.');

// ==========================================================
// 5. Secure In-Memory Database (No Plaintext Passwords)
// ==========================================================
// Pre-computed salted bcrypt hash for default test accounts: "password123"
const DEFAULT_BCRYPT_HASH = "$2b$10$iWgE7uOCIwkR7N0SPgFeHOtN8oEwvGOiCxZvmd6vO4epzcgG77nJS";

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
    }
  },

  // High-entropy password reset tokens: token -> { email, expiresAt, used }
  resetTokens: new Map(),

  // Active invalid tokens (logged out)
  revokedTokens: new Set()
};

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

// ==========================================================
// 8. Authentication API Routes
// ==========================================================

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

// POST /api/auth/forgot-password
app.post('/api/auth/forgot-password', passwordResetRateLimiter.middleware(), (req, res) => {
  const { email } = req.body || {};
  if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
    return res.status(400).json({ error: 'Valid email address is required.' });
  }

  const cleanEmail = email.trim().toLowerCase();
  const user = DB.accounts[cleanEmail];

  if (user) {
    // Generate high-entropy 256-bit cryptographic token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minute single-use TTL
    DB.resetTokens.set(resetToken, { email: cleanEmail, expiresAt, used: false });

    SecurityLogger.log('PASSWORD_RESET_TOKEN_GENERATED', { email: cleanEmail, ip: req.ip });
  } else {
    SecurityLogger.log('PASSWORD_RESET_UNKNOWN_EMAIL', { email: cleanEmail, ip: req.ip });
  }

  // Generic message: NEVER reveal whether the account exists and NEVER return token in response
  return res.json({
    message: 'If an account exists with this email, password reset instructions have been sent.'
  });
});

// POST /api/auth/reset-password
app.post('/api/auth/reset-password', (req, res) => {
  const { token, newPassword, confirmPassword } = req.body || {};

  if (!token || typeof token !== 'string') {
    return res.status(400).json({ error: 'Password reset token is required.' });
  }

  const record = DB.resetTokens.get(token);
  if (!record || record.used || Date.now() > record.expiresAt) {
    return res.status(400).json({ error: 'Invalid, expired, or previously used password reset token.' });
  }

  if (!newPassword || typeof newPassword !== 'string' || newPassword.length < 8) {
    return res.status(400).json({ error: 'New password must be at least 8 characters long.' });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ error: 'Passwords do not match.' });
  }

  const user = DB.accounts[record.email];
  if (!user) {
    return res.status(400).json({ error: 'Account not found.' });
  }

  // Update password with new bcrypt hash and invalidate token
  user.passwordHash = bcrypt.hashSync(newPassword, 10);
  record.used = true;
  DB.resetTokens.delete(token);

  SecurityLogger.log('PASSWORD_RESET_SUCCESS', { email: record.email, ip: req.ip });

  return res.json({ message: 'Password has been successfully updated. You may now sign in.' });
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
  return res.json({
    status: 'success',
    metrics: {
      activeStudents: 1248,
      facultyOnDuty: 86,
      classesToday: 42,
      pendingComplaints: 4,
      lowStockItems: 2
    },
    authorizedUser: req.user.name
  });
});

// Faculty Endpoint: Restricted to FACULTY & ADMIN
app.post('/api/faculty/attendance', authenticateToken, requireRole(['FACULTY', 'ADMIN']), (req, res) => {
  const { classId, subject, records } = req.body || {};
  if (!classId || !subject) {
    return res.status(400).json({ error: 'Class ID and Subject are required.' });
  }

  SecurityLogger.log('ATTENDANCE_RECORDED', {
    facultyId: req.user.id,
    classId,
    subject,
    studentCount: Array.isArray(records) ? records.length : 0
  });

  return res.json({
    status: 'success',
    message: `Attendance synchronized for ${classId} (${subject}).`
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
    name: req.user.id === studentId ? req.user.name : "Parshva Shah",
    department: "Information Technology",
    attendance: "89.2%",
    riskLevel: "Low Risk"
  });
});

// ==========================================================
// 10. Sensitive File Access Blocker & Static File Serving
// ==========================================================
const ROOT_DIR = path.resolve(__dirname, '..');

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

module.exports = { app, DB, SecurityLogger, RateLimiter };
