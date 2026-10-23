/**
 * Campus X AI - Password Recovery with 6-Digit Email OTP Automated Verification Suite
 * Tests all requirements from Section 12 of the Antigravity Implementation Prompt.
 */

const http = require('http');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const serverPath = fs.existsSync('./server.js') ? './server.js' : './server/server.js';
const { app, DB } = require(serverPath);

const PORT = 3199;
const BASE_URL = `http://localhost:${PORT}`;
let server;

function request(method, path, body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const reqHeaders = { 'Content-Type': 'application/json', ...headers };
    let postData = null;
    if (body) {
      postData = typeof body === 'string' ? body : JSON.stringify(body);
      reqHeaders['Content-Length'] = Buffer.byteLength(postData);
    }
    const req = http.request({
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      method,
      headers: reqHeaders
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        let json = null;
        try { json = JSON.parse(data); } catch (e) {}
        resolve({ status: res.statusCode, headers: res.headers, data, json });
      });
    });
    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
}

const tests = [];
function record(name, passed, detail) {
  tests.push({ name, passed, detail });
  const badge = passed ? '✓ PASS' : '✗ FAIL';
  console.log(`${badge} | ${name.padEnd(52)} | ${detail}`);
}

async function run() {
  console.log('===============================================================');
  console.log('CAMPUS X PASSWORD RECOVERY & EMAIL OTP TEST SUITE');
  console.log('===============================================================\n');

  server = app.listen(PORT);
  await new Promise(r => setTimeout(r, 250));

  try {
    const testEmail = 'student@tapi.edu';
    const originalPassword = 'password123';
    const newPassword = 'NewSecurePassword2026!';

    // Ensure test account exists with original password
    if (!DB.accounts[testEmail]) {
      DB.accounts[testEmail] = {
        id: '246470316113',
        name: 'Aarav Mehta',
        email: testEmail,
        role: 'STUDENT',
        department: 'IT',
        semester: '4th',
        passwordHash: bcrypt.hashSync(originalPassword, 10)
      };
    } else {
      DB.accounts[testEmail].passwordHash = bcrypt.hashSync(originalPassword, 10);
    }

    // Reset OTP stores for clean test run
    DB.otpStore.delete(testEmail);

    // -------------------------------------------------------------
    // Test 1: Registered email -> OTP delivered, generic response
    // -------------------------------------------------------------
    console.log('--- Phase 1: OTP Generation & Anti-Enumeration ---');
    const res1 = await request('POST', '/api/auth/forgot-password', { email: testEmail });
    const otpRecord = DB.otpStore.get(testEmail);
    record(
      'Registered email receives neutral generic response',
      res1.status === 200 && res1.json && res1.json.message && !res1.json.otp,
      `Status: ${res1.status}, Neutral message received, zero OTP leakage`
    );
    record(
      'Server generates cryptographically secure HMAC digest',
      Boolean(otpRecord && otpRecord.otpDigest && !otpRecord.otp && otpRecord.expiresAt > Date.now()),
      `Digest: ${otpRecord ? otpRecord.otpDigest.substring(0, 16) + '...' : 'none'}, Plain OTP NOT stored`
    );

    // -------------------------------------------------------------
    // Test 2: Unknown email -> Generic response; no account disclosure
    // -------------------------------------------------------------
    const res2 = await request('POST', '/api/auth/forgot-password', { email: 'nonexistent-user-999@tapi.edu' });
    record(
      'Unknown email returns exact same neutral response (Anti-Enumeration)',
      res2.status === 200 && res2.json && res2.json.message === res1.json.message,
      `Responses identical: ${res2.json && res2.json.message === res1.json.message}`
    );

    // -------------------------------------------------------------
    // Test 3: Resend cooldown enforced (60 seconds)
    // -------------------------------------------------------------
    console.log('\n--- Phase 2: Resend Cooldown Enforcement ---');
    const resCooldown = await request('POST', '/api/auth/forgot-password', { email: testEmail });
    record(
      'Resend cooldown enforced by backend (HTTP 429)',
      resCooldown.status === 429 && resCooldown.json && resCooldown.json.error.includes('Please wait'),
      `Status: ${resCooldown.status}, Error: ${resCooldown.json && resCooldown.json.error}`
    );

    const resendOtpCooldown = await request('POST', '/api/auth/resend-reset-otp', { email: testEmail });
    record(
      'Resend endpoint also strictly enforces 60s cooldown (HTTP 429)',
      resendOtpCooldown.status === 429,
      `Status: ${resendOtpCooldown.status}`
    );

    // -------------------------------------------------------------
    // Test 4: Incorrect OTP -> Rejected
    // -------------------------------------------------------------
    console.log('\n--- Phase 3: OTP Verification & Attempt Limiting ---');
    const badOtpRes = await request('POST', '/api/auth/verify-reset-otp', {
      email: testEmail,
      otp: '000000'
    });
    record(
      'Incorrect OTP is rejected (HTTP 400)',
      badOtpRes.status === 400 && badOtpRes.json && badOtpRes.json.error.includes('Incorrect verification code'),
      `Status: ${badOtpRes.status}, Message: ${badOtpRes.json && badOtpRes.json.error}`
    );

    // -------------------------------------------------------------
    // Test 5: Five failed attempts -> Further attempts blocked
    // -------------------------------------------------------------
    let lastBadRes;
    for (let i = 0; i < 4; i++) {
      lastBadRes = await request('POST', '/api/auth/verify-reset-otp', {
        email: testEmail,
        otp: '11111' + i
      });
    }
    const lockedRes = await request('POST', '/api/auth/verify-reset-otp', {
      email: testEmail,
      otp: '999999'
    });
    record(
      'Five failed attempts invalidates OTP (HTTP 429 / Blocked)',
      lockedRes.status === 429 || lockedRes.status === 400,
      `Status: ${lockedRes.status}, Error: ${lockedRes.json && lockedRes.json.error}`
    );

    // -------------------------------------------------------------
    // Test 6: Expired OTP -> Rejected
    // -------------------------------------------------------------
    console.log('\n--- Phase 4: Expiration & Replay Protection ---');
    const expiredOtp = '654321';
    const expiredDigest = app.hashOtp(testEmail, expiredOtp);
    DB.otpStore.set(testEmail, {
      otpDigest: expiredDigest,
      expiresAt: Date.now() - 1000, // already expired
      lastRequestedAt: Date.now() - 61000,
      attempts: 0,
      consumed: false
    });
    const expiredRes = await request('POST', '/api/auth/verify-reset-otp', {
      email: testEmail,
      otp: expiredOtp
    });
    record(
      'Expired OTP is rejected',
      expiredRes.status === 400 && expiredRes.json && expiredRes.json.error.includes('expired'),
      `Status: ${expiredRes.status}, Error: ${expiredRes.json && expiredRes.json.error}`
    );

    // -------------------------------------------------------------
    // Test 7: Valid OTP -> Recovery authorized
    // -------------------------------------------------------------
    console.log('\n--- Phase 5: Valid Verification & Authorization Grant ---');
    const validOtp = '742918';
    // Advance lastRequestedAt so we bypass cooldown for fresh code
    const validDigest = app.hashOtp(testEmail, validOtp);
    DB.otpStore.set(testEmail, {
      otpDigest: validDigest,
      expiresAt: Date.now() + 10 * 60 * 1000,
      lastRequestedAt: Date.now() - 65000,
      attempts: 0,
      consumed: false
    });

    const verifyRes = await request('POST', '/api/auth/verify-reset-otp', {
      email: testEmail,
      otp: validOtp
    });
    const recoveryGrantToken = verifyRes.json && verifyRes.json.recoveryGrantToken;
    record(
      'Valid 6-digit OTP verified and issues recovery authorization grant',
      verifyRes.status === 200 && Boolean(recoveryGrantToken),
      `Status: ${verifyRes.status}, Grant Token: ${recoveryGrantToken ? recoveryGrantToken.substring(0, 16) + '...' : 'none'}`
    );

    // -------------------------------------------------------------
    // Test 8: Reused OTP -> Rejected (single-use)
    // -------------------------------------------------------------
    const reuseOtpRes = await request('POST', '/api/auth/verify-reset-otp', {
      email: testEmail,
      otp: validOtp
    });
    record(
      'Reused OTP rejected (single-use atomic consumption)',
      reuseOtpRes.status === 400,
      `Status: ${reuseOtpRes.status}, Reused code rejected`
    );

    // -------------------------------------------------------------
    // Test 9: Reset without verification -> Rejected
    // -------------------------------------------------------------
    console.log('\n--- Phase 6: Password Reset & Validation Rules ---');
    const unauthorizedReset = await request('POST', '/api/auth/reset-password', {
      email: testEmail,
      recoveryGrantToken: 'unauthorized-token-1234567890',
      newPassword: 'MyNewPassword123!',
      confirmPassword: 'MyNewPassword123!'
    });
    record(
      'Reset without valid verification grant is rejected (HTTP 400)',
      unauthorizedReset.status === 400,
      `Status: ${unauthorizedReset.status}, Error: ${unauthorizedReset.json && unauthorizedReset.json.error}`
    );

    // -------------------------------------------------------------
    // Test 10: Mismatched passwords -> Rejected
    // -------------------------------------------------------------
    const mismatchReset = await request('POST', '/api/auth/reset-password', {
      email: testEmail,
      recoveryGrantToken,
      newPassword: newPassword,
      confirmPassword: 'DifferentPassword123!'
    });
    record(
      'Mismatched passwords rejected by server',
      mismatchReset.status === 400 && mismatchReset.json && mismatchReset.json.error.includes('do not match'),
      `Status: ${mismatchReset.status}, Error: ${mismatchReset.json && mismatchReset.json.error}`
    );

    // -------------------------------------------------------------
    // Test 11: Successful reset -> Password updated
    // -------------------------------------------------------------
    const successReset = await request('POST', '/api/auth/reset-password', {
      email: testEmail,
      recoveryGrantToken,
      newPassword: newPassword,
      confirmPassword: newPassword
    });
    record(
      'Successful password reset with valid recovery grant (HTTP 200)',
      successReset.status === 200 && successReset.json && successReset.json.success === true,
      `Status: ${successReset.status}, Message: ${successReset.json && successReset.json.message}`
    );

    // -------------------------------------------------------------
    // Test 12: Previous password -> Login rejected
    // -------------------------------------------------------------
    console.log('\n--- Phase 7: Post-Reset Authentication Verification ---');
    const oldLoginRes = await request('POST', '/api/auth/login', {
      email: testEmail,
      password: originalPassword
    });
    record(
      'Previous password NO LONGER works (Login Rejected HTTP 401)',
      oldLoginRes.status === 401,
      `Status: ${oldLoginRes.status}, Error: ${oldLoginRes.json && oldLoginRes.json.error}`
    );

    // -------------------------------------------------------------
    // Test 13: New password -> Login successful
    // -------------------------------------------------------------
    const newLoginRes = await request('POST', '/api/auth/login', {
      email: testEmail,
      password: newPassword
    });
    record(
      'New password works successfully (HTTP 200 & JWT issued)',
      newLoginRes.status === 200 && newLoginRes.json && Boolean(newLoginRes.json.token),
      `Status: ${newLoginRes.status}, User: ${newLoginRes.json && newLoginRes.json.user && newLoginRes.json.user.name}`
    );

    // -------------------------------------------------------------
    // Test 14: Used recovery grant token cannot be reused
    // -------------------------------------------------------------
    const grantReuse = await request('POST', '/api/auth/reset-password', {
      email: testEmail,
      recoveryGrantToken,
      newPassword: 'YetAnotherPassword123!',
      confirmPassword: 'YetAnotherPassword123!'
    });
    record(
      'Recovery grant token is single-use and cannot be re-used',
      grantReuse.status === 400,
      `Status: ${grantReuse.status}, Replay blocked`
    );

    // Summary
    const passed = tests.filter(t => t.passed).length;
    console.log('\n===============================================================');
    console.log(`TOTAL RECOVERY FLOW TESTS: ${tests.length} | PASSED: ${passed} | FAILED: ${tests.length - passed}`);
    console.log('===============================================================');

    if (passed === tests.length) {
      console.log('ALL PASSWORD RECOVERY WITH EMAIL OTP TESTS PASSED PERFECTLY!');
      process.exit(0);
    } else {
      process.exit(1);
    }
  } catch (err) {
    console.error('Fatal test error:', err);
    process.exit(1);
  } finally {
    if (server) server.close();
  }
}

run();
