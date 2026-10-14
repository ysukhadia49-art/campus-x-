/* ==========================================================
   Campus X AI - Automated Security Verification Test Suite
   Tapi Diploma Engineering College, Surat
   ========================================================== */

const http = require('http');
const fs = require('fs');
const path = require('path');
const { app, DB } = require('./server/server.js');

let server;
const PORT = 3099;
const BASE_URL = `http://localhost:${PORT}`;

function makeRequest(method, path, body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const reqHeaders = {
      'Content-Type': 'application/json',
      ...headers
    };

    let postData = null;
    if (body) {
      postData = typeof body === 'string' ? body : JSON.stringify(body);
      reqHeaders['Content-Length'] = Buffer.byteLength(postData);
    }

    const req = http.request({
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method,
      headers: reqHeaders
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        let json = null;
        try { json = JSON.parse(data); } catch (e) {}
        resolve({
          status: res.statusCode,
          headers: res.headers,
          data: json,
          raw: data
        });
      });
    });

    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
}

const results = [];
function recordTest(testName, expected, actual, pass) {
  results.push({ testName, expected, actual, pass });
  const icon = pass ? '✓ PASS' : '✗ FAIL';
  console.log(`${icon} | ${testName.padEnd(50)} | ${actual}`);
}

async function runTests() {
  console.log('===============================================================');
  console.log('STARTING CAMPUSX COMPLETE SECURITY AUDIT & VERIFICATION SUITE');
  console.log('===============================================================\n');

  server = app.listen(PORT);
  await new Promise(r => setTimeout(r, 200));

  try {
    // ---------------------------------------------------------
    // 1. Password Storage & Hashing Tests
    // ---------------------------------------------------------
    console.log('--- 1. Password Storage & Bcrypt Hashing ---');
    const plaintextFound = Object.values(DB.accounts).some(acc => acc.password !== undefined);
    recordTest(
      'No plaintext passwords in database',
      'false',
      String(plaintextFound),
      !plaintextFound
    );

    const bcryptValid = Object.values(DB.accounts).every(acc => 
      acc.passwordHash && (acc.passwordHash.startsWith('$2a$') || acc.passwordHash.startsWith('$2b$'))
    );
    recordTest(
      'All passwords stored as salted bcrypt hashes ($2b$)',
      'true',
      String(bcryptValid),
      bcryptValid
    );

    // ---------------------------------------------------------
    // 2. Server-Side Validation Tests
    // ---------------------------------------------------------
    console.log('\n--- 2. Server-Side Input Validation ---');
    const emptyLoginRes = await makeRequest('POST', '/api/auth/login', {});
    recordTest(
      'Empty login body rejected',
      '400',
      String(emptyLoginRes.status),
      emptyLoginRes.status === 400
    );

    const missingPwRes = await makeRequest('POST', '/api/auth/login', { email: 'student@tapi.edu' });
    recordTest(
      'Missing password rejected before auth check',
      '400',
      String(missingPwRes.status),
      missingPwRes.status === 400
    );

    const invalidEmailReg = await makeRequest('POST', '/api/auth/register', {
      name: 'Test Student',
      email: 'not-an-email',
      password: 'password123',
      confirmPassword: 'password123'
    });
    recordTest(
      'Invalid registration email format rejected',
      '400',
      String(invalidEmailReg.status),
      invalidEmailReg.status === 400
    );

    const shortPwReg = await makeRequest('POST', '/api/auth/register', {
      name: 'Test Student',
      email: 'newstudent@tapi.edu',
      password: 'short',
      confirmPassword: 'short'
    });
    recordTest(
      'Short password (< 8 chars) rejected',
      '400',
      String(shortPwReg.status),
      shortPwReg.status === 400
    );

    const pwMismatchReg = await makeRequest('POST', '/api/auth/register', {
      name: 'Test Student',
      email: 'newstudent@tapi.edu',
      password: 'password123',
      confirmPassword: 'differentpassword'
    });
    recordTest(
      'Mismatched passwords rejected',
      '400',
      String(pwMismatchReg.status),
      pwMismatchReg.status === 400
    );

    // ---------------------------------------------------------
    // 3. Privilege Escalation Prevention
    // ---------------------------------------------------------
    console.log('\n--- 3. Privilege Escalation Prevention ---');
    const privEscReg = await makeRequest('POST', '/api/auth/register', {
      name: 'Attacker User',
      email: 'attacker@tapi.edu',
      password: 'password123',
      confirmPassword: 'password123',
      role: 'ADMIN' // Malicious attempt to register as Administrator
    });
    const assignedRole = privEscReg.data && privEscReg.data.user && privEscReg.data.user.role;
    recordTest(
      'Self-assigned ADMIN role is forced to STUDENT',
      'STUDENT',
      assignedRole,
      assignedRole === 'STUDENT'
    );

    // ---------------------------------------------------------
    // 4. Authentication & Generic Errors (Anti-Enumeration)
    // ---------------------------------------------------------
    console.log('\n--- 4. Authentication & Anti-Enumeration ---');
    const authTestHeaders = { 'x-forwarded-for': '192.0.2.10' };

    // Valid login
    const validLogin = await makeRequest('POST', '/api/auth/login', {
      email: 'student@tapi.edu',
      password: 'password123'
    }, authTestHeaders);
    const studentToken = validLogin.data && validLogin.data.token;
    recordTest(
      'Valid credentials return HTTP 200 and signed JWT',
      '200',
      String(validLogin.status),
      validLogin.status === 200 && Boolean(studentToken)
    );

    const hashExposed = validLogin.data && validLogin.data.user && validLogin.data.user.passwordHash !== undefined;
    recordTest(
      'Password hash NEVER returned in user response payload',
      'false',
      String(hashExposed),
      !hashExposed
    );

    // Wrong password for existing user
    const wrongPwRes = await makeRequest('POST', '/api/auth/login', {
      email: 'student@tapi.edu',
      password: 'wrongpassword'
    }, authTestHeaders);
    recordTest(
      'Wrong password returns generic error (401)',
      'Incorrect email or password.',
      wrongPwRes.data && wrongPwRes.data.error,
      wrongPwRes.status === 401 && wrongPwRes.data && wrongPwRes.data.error === 'Incorrect email or password.'
    );

    // Non-existent account
    const wrongUserRes = await makeRequest('POST', '/api/auth/login', {
      email: 'nonexistent999@tapi.edu',
      password: 'anyPassword123'
    }, authTestHeaders);
    recordTest(
      'Non-existent account returns exact same generic error',
      'Incorrect email or password.',
      wrongUserRes.data && wrongUserRes.data.error,
      wrongUserRes.status === 401 && wrongUserRes.data && wrongUserRes.data.error === 'Incorrect email or password.'
    );

    // No password bypass: empty or arbitrary password for admin
    const adminBypass = await makeRequest('POST', '/api/auth/login', {
      email: 'admin@tapi.edu',
      password: 'wrongpassword'
    }, authTestHeaders);
    recordTest(
      'Password bypass eliminated: wrong password for Admin fails',
      '401',
      String(adminBypass.status),
      adminBypass.status === 401
    );

    // ---------------------------------------------------------
    // 5. Rate Limiting Tests (Brute-Force Protection)
    // ---------------------------------------------------------
    console.log('\n--- 5. Login Rate Limiting (Brute-Force Protection) ---');
    const bruteForceHeaders = { 'x-forwarded-for': '198.51.100.99' };
    let lastRateLimitRes = null;
    // Perform 6 consecutive failed attempts with dedicated IP
    for (let i = 0; i < 6; i++) {
      lastRateLimitRes = await makeRequest('POST', '/api/auth/login', {
        email: 'attacker@tapi.edu',
        password: 'badpassword'
      }, bruteForceHeaders);
    }
    recordTest(
      'Rapid failed logins trigger HTTP 429 Too Many Requests',
      '429',
      String(lastRateLimitRes.status),
      lastRateLimitRes.status === 429
    );

    recordTest(
      'Retry-After header present in rate limit response',
      'true',
      String(Boolean(lastRateLimitRes.headers['retry-after'])),
      Boolean(lastRateLimitRes.headers['retry-after'])
    );

    // ---------------------------------------------------------
    // 6. Role-Based Access Control (RBAC) & IDOR Protection
    // ---------------------------------------------------------
    console.log('\n--- 6. Role-Based Authorization & IDOR Protection ---');
    // Admin login
    const adminLogin = await makeRequest('POST', '/api/auth/login', {
      email: 'admin@tapi.edu',
      password: 'password123'
    }, { 'x-forwarded-for': '127.0.0.99' }); // Distinct IP so not rate-limited
    const adminToken = adminLogin.data && adminLogin.data.token;

    // Student attempting to access Admin endpoint
    const studentToAdmin = await makeRequest('GET', '/api/admin/overview', null, {
      'Authorization': `Bearer ${studentToken}`
    });
    recordTest(
      'Student accessing Admin overview is rejected (403 Forbidden)',
      '403',
      String(studentToAdmin.status),
      studentToAdmin.status === 403
    );

    // Admin accessing Admin endpoint
    const adminToAdmin = await makeRequest('GET', '/api/admin/overview', null, {
      'Authorization': `Bearer ${adminToken}`
    });
    recordTest(
      'Admin accessing Admin overview succeeds (200 OK)',
      '200',
      String(adminToAdmin.status),
      adminToAdmin.status === 200
    );

    // Student attempting to record faculty attendance
    const studentAttendance = await makeRequest('POST', '/api/faculty/attendance', {
      classId: 'Class 2452',
      subject: 'AIPD'
    }, {
      'Authorization': `Bearer ${studentToken}`
    });
    recordTest(
      'Student attempting to submit attendance rejected (403)',
      '403',
      String(studentAttendance.status),
      studentAttendance.status === 403
    );

    // IDOR Protection: Student Parshva (id: 246470316113) attempting to access another student's record
    const idorViolation = await makeRequest('GET', '/api/student/999999999999/record', null, {
      'Authorization': `Bearer ${studentToken}`
    });
    recordTest(
      'IDOR Protection: Student cannot access other student record (403)',
      '403',
      String(idorViolation.status),
      idorViolation.status === 403
    );

    const ownRecord = await makeRequest('GET', '/api/student/246470316113/record', null, {
      'Authorization': `Bearer ${studentToken}`
    });
    recordTest(
      'IDOR Protection: Student CAN access own record (200 OK)',
      '200',
      String(ownRecord.status),
      ownRecord.status === 200
    );

    // ---------------------------------------------------------
    // 7. Session Invalidation & Token Revocation
    // ---------------------------------------------------------
    console.log('\n--- 7. Session Invalidation & Token Revocation ---');
    const logoutRes = await makeRequest('POST', '/api/auth/logout', null, {
      'Authorization': `Bearer ${studentToken}`
    });
    recordTest(
      'Logout endpoint invalidates session token',
      '200',
      String(logoutRes.status),
      logoutRes.status === 200
    );

    const postLogoutMe = await makeRequest('GET', '/api/auth/me', null, {
      'Authorization': `Bearer ${studentToken}`
    });
    recordTest(
      'Revoked token rejected on subsequent API requests (401)',
      '401',
      String(postLogoutMe.status),
      postLogoutMe.status === 401
    );

    // ---------------------------------------------------------
    // 8. Password Reset Security
    // ---------------------------------------------------------
    console.log('\n--- 8. Password Reset Security ---');
    const resetReq = await makeRequest('POST', '/api/auth/forgot-password', {
      email: 'student@tapi.edu'
    }, { 'x-forwarded-for': '127.0.0.88' });
    recordTest(
      'Password reset request returns generic notice without leakage',
      'If an account exists with this email, password reset instructions have been sent.',
      resetReq.data && resetReq.data.message,
      resetReq.status === 200 && resetReq.data && resetReq.data.message.includes('If an account exists')
    );

    // Verify that reset token is NEVER leaked in HTTP response payload
    recordTest(
      'Password reset response does not leak reset token (anti-account-takeover)',
      'undefined',
      String(resetReq.data && resetReq.data.demoToken),
      !resetReq.data || resetReq.data.demoToken === undefined
    );

    // Retrieve active token securely from backend test database state
    const resetToken = Array.from(DB.resetTokens.keys()).find(k => {
      const rec = DB.resetTokens.get(k);
      return rec && rec.email === 'student@tapi.edu' && !rec.used;
    });

    if (resetToken) {
      const resetAction = await makeRequest('POST', '/api/auth/reset-password', {
        token: resetToken,
        newPassword: 'newsecurepassword123',
        confirmPassword: 'newsecurepassword123'
      });
      recordTest(
        'Password reset with token succeeds',
        '200',
        String(resetAction.status),
        resetAction.status === 200
      );

      // Attempt single-use token reuse
      const reusedReset = await makeRequest('POST', '/api/auth/reset-password', {
        token: resetToken,
        newPassword: 'anotherpassword',
        confirmPassword: 'anotherpassword'
      });
      recordTest(
        'Reset token is strictly single-use (re-use rejected with 400)',
        '400',
        String(reusedReset.status),
        reusedReset.status === 400
      );
    }

    // ---------------------------------------------------------
    // 9. Sensitive Source Code & Asset Protection
    // ---------------------------------------------------------
    console.log('\n--- 9. Source Code & Asset Protection ---');
    const serverJsRes = await makeRequest('GET', '/server/server.js');
    recordTest(
      'Backend server.js source code download blocked (404)',
      '404',
      String(serverJsRes.status),
      serverJsRes.status === 404
    );

    const packageJsonRes = await makeRequest('GET', '/package.json');
    recordTest(
      'package.json manifest download blocked (404)',
      '404',
      String(packageJsonRes.status),
      packageJsonRes.status === 404
    );

    const envRes = await makeRequest('GET', '/.env');
    recordTest(
      '.env configuration file download blocked (404)',
      '404',
      String(envRes.status),
      envRes.status === 404
    );

    const testFileRes = await makeRequest('GET', '/test-security.js');
    recordTest(
      'Test suite file download blocked (404)',
      '404',
      String(testFileRes.status),
      testFileRes.status === 404
    );

    // ---------------------------------------------------------
    // 10. CORS Policy Enforcement
    // ---------------------------------------------------------
    console.log('\n--- 10. CORS Policy Enforcement ---');
    const untrustedCorsRes = await makeRequest('GET', '/api/auth/me', null, {
      'Origin': 'https://malicious-campus-phishing.com'
    });
    const allowOriginHeader = untrustedCorsRes.headers['access-control-allow-origin'];
    recordTest(
      'Untrusted CORS origin is NOT granted access',
      'undefined',
      String(allowOriginHeader),
      allowOriginHeader !== 'https://malicious-campus-phishing.com'
    );

    // ---------------------------------------------------------
    // 11. Security Headers
    // ---------------------------------------------------------
    console.log('\n--- 11. Production Security Headers ---');
    const homeRes = await makeRequest('GET', '/');
    const h = homeRes.headers;
    recordTest('X-Content-Type-Options: nosniff header present', 'nosniff', h['x-content-type-options'], h['x-content-type-options'] === 'nosniff');
    recordTest('X-Frame-Options: SAMEORIGIN header present', 'SAMEORIGIN', h['x-frame-options'], h['x-frame-options'] === 'SAMEORIGIN');
    recordTest('Referrer-Policy header present', 'strict-origin-when-cross-origin', h['referrer-policy'], Boolean(h['referrer-policy']));
    recordTest('Content-Security-Policy header present', 'true', String(Boolean(h['content-security-policy'])), Boolean(h['content-security-policy']));
    recordTest('Cross-Origin-Opener-Policy: same-origin present', 'same-origin', h['cross-origin-opener-policy'], h['cross-origin-opener-policy'] === 'same-origin');
    recordTest('Cross-Origin-Resource-Policy: same-origin present', 'same-origin', h['cross-origin-resource-policy'], h['cross-origin-resource-policy'] === 'same-origin');

    // ---------------------------------------------------------
    // 12. Client-Side Data & XSS Sanitation
    // ---------------------------------------------------------
    console.log('\n--- 12. Client-Side Asset & Sanitization Checks ---');
    const mockDataContent = fs.readFileSync(path.join(__dirname, 'js', 'mock-data.js'), 'utf8');
    const mockHashesFound = mockDataContent.includes('passwordHash:');
    recordTest(
      'Client mock-data.js contains zero passwordHash fields',
      'false',
      String(mockHashesFound),
      !mockHashesFound
    );

    // ---------------------------------------------------------
    // Summary
    // ---------------------------------------------------------
    console.log('\n===============================================================');
    const total = results.length;
    const passed = results.filter(r => r.pass).length;
    const failed = total - passed;
    console.log(`TOTAL TESTS: ${total} | PASSED: ${passed} | FAILED: ${failed}`);
    console.log('===============================================================');

    server.close(() => {
      process.exit(failed > 0 ? 1 : 0);
    });
  } catch (err) {
    console.error('Test execution error:', err);
    if (server) server.close();
    process.exit(1);
  }
}

runTests();
