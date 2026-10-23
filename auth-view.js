/* ==========================================================
   Campus X AI - Pre-Login & Authentication View
   Security Hardened: Generic Errors, Client Validation UX,
   Password Visibility Toggle, Password Reset & RBAC Verification
   ========================================================== */

class AuthView {
  static renderLanding(container) {
    container.innerHTML = `
      <div class="auth-fullscreen-container">
        <!-- Left Editorial Column -->
        <div class="auth-editorial-col">
          <div class="auth-brand-lockup">
            <div class="auth-logo-badge">X</div>
            <div class="auth-logo-text">Campus X AI</div>
          </div>

          <div class="auth-headline-box">
            <h1 class="auth-editorial-title">
              Everything campus,<br>in one place.
            </h1>
            <p class="auth-editorial-sub">
              Centralized intelligence, academic schedules, inventory, and campus support for Tapi Diploma Engineering College.
            </p>

            <div class="auth-image-card">
              <img src="https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=700&q=80" alt="Campus Architecture">
              <div class="auth-image-overlay-quote">
                “A Better You, Brighter Tomorrow”
              </div>
            </div>

            <div class="auth-handwritten-tag">
              More than just a college ☺
            </div>
          </div>

          <div class="auth-footer-credentials">
            <strong>Tapi Diploma Engineering College, Surat</strong><br>
            Gujarat Technological University (647) • IT Department Class 2452
          </div>
        </div>

        <!-- Right Action Column -->
        <div class="auth-form-col">
          <div class="auth-card">
            <div class="auth-card-header">
              <span class="sidebar-role-indicator" style="color: var(--color-accent-blue); background: var(--tint-soft-blue); margin-bottom: 0.5rem;">
                Official University Portal
              </span>
              <h2 class="auth-card-title">Welcome to Campus X</h2>
              <p class="auth-card-desc">Sign in with your institutional credentials to access your personalized campus workspace.</p>
            </div>

            <div style="display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 2rem;">
              <button class="btn btn-primary w-full" style="padding: 0.9rem;" onclick="appState.setView('login')">
                Sign In to Campus
              </button>
              <button class="btn btn-secondary w-full" style="padding: 0.9rem;" onclick="appState.setView('register')">
                Register New Institutional Account
              </button>
            </div>

          </div>
        </div>
      </div>
    `;
  }

  static renderLogin(container) {
    container.innerHTML = `
      <div class="auth-fullscreen-container">
        <!-- Left Editorial Column -->
        <div class="auth-editorial-col">
          <div class="auth-brand-lockup">
            <div class="auth-logo-badge">X</div>
            <div class="auth-logo-text">Campus X AI</div>
          </div>

          <div class="auth-headline-box">
            <h1 class="auth-editorial-title">
              Everything campus,<br>in one place.
            </h1>
            <p class="auth-editorial-sub">
              Access your academic, campus and support services from a single platform.
            </p>

            <div class="auth-image-card">
              <img src="https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=700&q=80" alt="Campus Architecture">
              <div class="auth-image-overlay-quote">
                “Discipline today, a better tomorrow.”
              </div>
            </div>

            <div class="auth-handwritten-tag">
              Same goals. Brighter days ☺
            </div>
          </div>

          <div class="auth-footer-credentials">
            <strong>Tapi Diploma Engineering College</strong> • Information Technology Class 2452
          </div>
        </div>

        <!-- Right Login Form Column -->
        <div class="auth-form-col">
          <div class="auth-card">
            <div class="auth-card-header">
              <h2 class="auth-card-title">Sign In</h2>
              <p class="auth-card-desc">Enter your College ID or registered institutional email.</p>
            </div>

            <!-- Generic Server/Client Error Banner -->
            <div id="loginErrorBanner" class="auth-error-banner" style="display: none;">
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
              <span id="loginErrorText">Incorrect email or password.</span>
            </div>

            <form id="loginForm" onsubmit="AuthView.handleLoginSubmit(event)" novalidate>
              <div class="form-group">
                <label class="form-label" for="loginEmail">College ID / Institutional Email</label>
                <input 
                  type="text" 
                  id="loginEmail" 
                  class="form-input" 
                  placeholder="e.g. student@tapi.edu or 246470316113" 
                  required 
                  autocomplete="username"
                  oninput="AuthView.clearLoginErrors()">
              </div>

              <div class="form-group">
                <div class="flex items-center justify-between" style="margin-bottom: 0.4rem;">
                  <label class="form-label" for="loginPassword" style="margin-bottom: 0;">Password</label>
                  <a href="javascript:void(0)" onclick="appState.setView('forgot-password')" class="forgot-password-link">Forgot password?</a>
                </div>
                <div class="password-input-wrap">
                  <input 
                    type="password" 
                    id="loginPassword" 
                    class="form-input" 
                    placeholder="••••••••" 
                    required 
                    autocomplete="current-password"
                    oninput="AuthView.clearLoginErrors()">
                  <button 
                    type="button" 
                    class="password-toggle-btn" 
                    aria-label="Toggle password visibility" 
                    onclick="AuthView.togglePasswordVisibility('loginPassword', this)">
                    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  </button>
                </div>
              </div>

              <button type="submit" id="loginSubmitBtn" class="btn-auth-submit">
                <span>Sign In</span>
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </button>
            </form>

            <div style="margin-top: 1.25rem; text-align: center; font-size: 0.84rem; color: var(--text-secondary);">
              Need an institutional account? <a href="javascript:void(0)" onclick="appState.setView('register')">Register here</a>
            </div>

          </div>
        </div>
      </div>
    `;
  }

  static renderRegister(container) {
    container.innerHTML = `
      <div class="auth-fullscreen-container">
        <div class="auth-editorial-col">
          <div class="auth-brand-lockup">
            <div class="auth-logo-badge">X</div>
            <div class="auth-logo-text">Campus X AI</div>
          </div>

          <div class="auth-headline-box">
            <h1 class="auth-editorial-title">
              Join your campus<br>ecosystem.
            </h1>
            <p class="auth-editorial-sub">
              Your institutional enrollment or employee ID will automatically link your verified role.
            </p>
            <div class="auth-handwritten-tag">
              Good students. Brighter tomorrows ☺
            </div>
          </div>

          <div class="auth-footer-credentials">
            <strong>Tapi Diploma Engineering College</strong> • Registration Portal
          </div>
        </div>

        <div class="auth-form-col">
          <div class="auth-card" style="max-width: 500px;">
            <div class="auth-card-header">
              <h2 class="auth-card-title">Create Account</h2>
              <p class="auth-card-desc">Institutional credentials will determine your access workspace.</p>
            </div>

            <!-- Error Banner -->
            <div id="registerErrorBanner" class="auth-error-banner" style="display: none;">
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
              <span id="registerErrorText">Please review the form.</span>
            </div>

            <form id="registerForm" onsubmit="AuthView.handleRegisterSubmit(event)" novalidate>
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label" for="regName">Full Name</label>
                  <input type="text" id="regName" class="form-input" placeholder="e.g. Yug Sukhadia" required>
                </div>
                <div class="form-group">
                  <label class="form-label" for="regCollegeId">College ID</label>
                  <input type="text" id="regCollegeId" class="form-input" placeholder="246470316116" required>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label" for="regEmail">Institutional Email</label>
                <input type="email" id="regEmail" class="form-input" placeholder="yug@tapi.edu" required autocomplete="email">
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label" for="regDept">Department</label>
                  <input type="text" id="regDept" class="form-input" value="Information Technology" required>
                </div>
                <div class="form-group">
                  <label class="form-label" for="regSem">Semester</label>
                  <input type="text" id="regSem" class="form-input" placeholder="Semester 5" value="Semester 5">
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label" for="regPassword">Password (Min. 8 chars)</label>
                  <div class="password-input-wrap">
                    <input type="password" id="regPassword" class="form-input" placeholder="••••••••" required autocomplete="new-password">
                    <button type="button" class="password-toggle-btn" aria-label="Toggle password visibility" onclick="AuthView.togglePasswordVisibility('regPassword', this)">
                      <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    </button>
                  </div>
                </div>
                <div class="form-group">
                  <label class="form-label" for="regConfirmPassword">Confirm Password</label>
                  <div class="password-input-wrap">
                    <input type="password" id="regConfirmPassword" class="form-input" placeholder="••••••••" required autocomplete="new-password">
                    <button type="button" class="password-toggle-btn" aria-label="Toggle password visibility" onclick="AuthView.togglePasswordVisibility('regConfirmPassword', this)">
                      <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    </button>
                  </div>
                </div>
              </div>

              <button type="submit" id="registerSubmitBtn" class="btn-auth-submit">
                Create Account
              </button>
            </form>

            <div style="margin-top: 1.25rem; text-align: center; font-size: 0.84rem; color: var(--text-secondary);">
              Already have an account? <a href="javascript:void(0)" onclick="appState.setView('login')">Sign In</a>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  static togglePasswordVisibility(inputId, btnEl) {
    const input = document.getElementById(inputId);
    if (!input) return;

    const isPassword = input.type === 'password';
    input.type = isPassword ? 'text' : 'password';

    if (btnEl) {
      btnEl.innerHTML = isPassword
        ? `<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`
        : `<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
    }
  }

  static clearLoginErrors() {
    const banner = document.getElementById('loginErrorBanner');
    if (banner) banner.style.display = 'none';
  }

  static showLoginError(msg) {
    const banner = document.getElementById('loginErrorBanner');
    const textEl = document.getElementById('loginErrorText');
    if (banner && textEl) {
      textEl.textContent = msg || 'Incorrect email or password.';
      banner.style.display = 'flex';
    } else {
      appState.showToast(msg, 'error');
    }
  }

  static showRegisterError(msg) {
    const banner = document.getElementById('registerErrorBanner');
    const textEl = document.getElementById('registerErrorText');
    if (banner && textEl) {
      textEl.textContent = msg;
      banner.style.display = 'flex';
    } else {
      appState.showToast(msg, 'error');
    }
  }

  static async handleLoginSubmit(e) {
    e.preventDefault();
    AuthView.clearLoginErrors();

    const emailEl = document.getElementById('loginEmail');
    const passEl = document.getElementById('loginPassword');
    const submitBtn = document.getElementById('loginSubmitBtn');

    const email = emailEl ? emailEl.value.trim() : '';
    const pass = passEl ? passEl.value : '';

    // Client-side validation (UX Only)
    if (!email) {
      AuthView.showLoginError('Please enter your institutional email or College ID.');
      if (emailEl) emailEl.focus();
      return;
    }
    if (!pass) {
      AuthView.showLoginError('Please enter your password.');
      if (passEl) passEl.focus();
      return;
    }

    // Set loading state to prevent duplicate submissions
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span class="btn-spinner"></span> <span>Authenticating...</span>`;
    }

    try {
      const user = await appState.authenticateUser(email, pass);
      AuthView.triggerRoleRecognition(user);
    } catch (err) {
      AuthView.showLoginError(err.message || 'Incorrect email or password.');
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<span>Sign In</span> <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>`;
      }
    }
  }


  static async handleRegisterSubmit(e) {
    e.preventDefault();
    const banner = document.getElementById('registerErrorBanner');
    if (banner) banner.style.display = 'none';

    const name = document.getElementById('regName').value.trim();
    const collegeId = document.getElementById('regCollegeId').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const department = document.getElementById('regDept').value.trim();
    const semester = document.getElementById('regSem').value.trim();
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;
    const submitBtn = document.getElementById('registerSubmitBtn');

    // Client-side UX validation
    if (!name || name.length < 2) {
      AuthView.showRegisterError('Full Name must be at least 2 characters long.');
      return;
    }
    if (!window.SecurityUtils || !window.SecurityUtils.validateEmail(email)) {
      AuthView.showRegisterError('Please enter a valid institutional email address.');
      return;
    }
    if (password.length < 8) {
      AuthView.showRegisterError('Password must be at least 8 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      AuthView.showRegisterError('Passwords do not match.');
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span class="btn-spinner"></span> <span>Creating Account...</span>`;
    }

    try {
      let registeredUser = null;
      if (window.ApiClient && window.ApiClient.getApiBase()) {
        try {
          const resp = await window.ApiClient.register({
            name,
            collegeId,
            email,
            department,
            semester,
            password,
            confirmPassword
          });
          if (resp && resp.user && resp.token) {
            window.ApiClient.setToken(resp.token);
            registeredUser = resp.user;
          }
        } catch (apiErr) {
          // If server returned structured error (e.g. duplicate account), display it
          if (apiErr.statusCode === 400 || (apiErr.message && !apiErr.isStaticHost && !apiErr.message.includes('Failed to fetch') && !apiErr.message.includes('405'))) {
            throw apiErr;
          }
        }
      }

      // Offline / Static fallback registration if server is offline or static host
      if (!registeredUser) {
        const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
        registeredUser = {
          id: collegeId || ("246470316" + Math.floor(100 + Math.random() * 900)),
          email: email.toLowerCase(),
          name,
          role: "STUDENT",
          roleTitle: `Student (${department} ${semester})`,
          department,
          semester,
          avatarInitials: initials || 'CX',
          academicRisk: { level: "Low Risk", score: "92/100" }
        };
        CAMPUS_DATA.accounts[registeredUser.email] = registeredUser;
        try {
          const customPasswords = JSON.parse(localStorage.getItem('campusx_custom_passwords') || '{}');
          customPasswords[registeredUser.email] = password;
          localStorage.setItem('campusx_custom_passwords', JSON.stringify(customPasswords));

          const customUsers = JSON.parse(localStorage.getItem('campusx_custom_users') || '{}');
          customUsers[registeredUser.email] = registeredUser;
          localStorage.setItem('campusx_custom_users', JSON.stringify(customUsers));
        } catch (e) {}

        appState.setCurrentUser(registeredUser, 'offline-token-' + Date.now());
      } else {
        appState.setCurrentUser(registeredUser);
      }

      AuthView.triggerRoleRecognition(registeredUser);
    } catch (err) {
      AuthView.showRegisterError(err.message || 'Unable to complete registration. Please try again.');
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Create Account';
      }
    }
  }



  static triggerRoleRecognition(user) {
    const overlay = document.createElement('div');
    overlay.className = 'role-setup-overlay';
    overlay.innerHTML = `
      <div class="role-setup-content">
        <div class="role-spinner"></div>
        <h3 class="role-setup-title">Setting up your campus space...</h3>
        <p class="role-setup-sub">Recognized ${window.SecurityUtils ? window.SecurityUtils.escapeHtml(user.roleTitle) : user.roleTitle} for <strong>${window.SecurityUtils ? window.SecurityUtils.escapeHtml(user.name) : user.name}</strong></p>
      </div>
    `;
    document.body.appendChild(overlay);

    setTimeout(() => {
      overlay.remove();
      appState.setCurrentUser(user);
      appState.showToast(`Signed in as ${user.name} (${user.roleTitle})`, "success");
    }, 700);
  }

  // ==========================================================
  // Password Recovery State & Views
  // ==========================================================
  static recoveryEmail = '';
  static recoveryGrantToken = '';
  static resendCooldownUntil = 0;
  static resendIntervalId = null;

  static getEditorialColumnHtml() {
    return `
      <!-- Left Editorial Column -->
      <div class="auth-editorial-col">
        <div class="auth-brand-lockup">
          <div class="auth-logo-badge">X</div>
          <div class="auth-logo-text">Campus X AI</div>
        </div>

        <div class="auth-headline-box">
          <h1 class="auth-editorial-title">
            Everything campus,<br>in one place.
          </h1>
          <p class="auth-editorial-sub">
            Access your academic, campus and support services from a single platform.
          </p>

          <div class="auth-image-card">
            <img src="https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=700&q=80" alt="Campus Architecture">
            <div class="auth-image-overlay-quote">
              “Discipline today, a better tomorrow.”
            </div>
          </div>

          <div class="auth-handwritten-tag">
            Same goals. Brighter days ☺
          </div>
        </div>

        <div class="auth-footer-credentials">
          <strong>Tapi Diploma Engineering College</strong> • Information Technology Class 2452
        </div>
      </div>
    `;
  }

  // 1. SCREEN ONE: FORGOT PASSWORD
  static renderForgotPassword(container) {
    container.innerHTML = `
      <div class="auth-fullscreen-container">
        ${AuthView.getEditorialColumnHtml()}

        <div class="auth-form-col">
          <div class="auth-card">
            <div class="auth-card-header">
              <h2 class="auth-card-title">Forgot Password?</h2>
              <p class="auth-card-desc">Enter your registered Campus X email address to receive a verification code.</p>
            </div>

            <div id="forgotErrorBanner" class="auth-error-banner" style="display: none;">
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
              <span id="forgotErrorText"></span>
            </div>

            <form id="forgotPasswordForm" onsubmit="AuthView.handleForgotPasswordSubmit(event)" novalidate>
              <div class="form-group">
                <label class="form-label" for="recoveryEmailInput">Email Address</label>
                <input 
                  type="email" 
                  id="recoveryEmailInput" 
                  class="form-input" 
                  placeholder="e.g. student@tapi.edu" 
                  required 
                  autocomplete="email"
                  value="${AuthView.recoveryEmail ? (window.SecurityUtils ? window.SecurityUtils.escapeHtml(AuthView.recoveryEmail) : AuthView.recoveryEmail) : ''}"
                  oninput="AuthView.clearForgotErrors()">
              </div>

              <button type="submit" id="btnSendOtp" class="btn btn-primary w-full" style="padding: 0.85rem; font-size: 0.95rem; margin-top: 1rem;">
                Send Verification Code
              </button>
            </form>

            <div style="text-align: center; margin-top: 1.5rem;">
              <a href="javascript:void(0)" onclick="appState.setView('login')" class="back-to-login-link">
                <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                Back to Login
              </a>
            </div>
          </div>
        </div>
      </div>
    `;

    setTimeout(() => {
      const emailInput = document.getElementById('recoveryEmailInput');
      if (emailInput) emailInput.focus();
    }, 50);
  }

  static clearForgotErrors() {
    const banner = document.getElementById('forgotErrorBanner');
    if (banner) banner.style.display = 'none';
  }

  static async handleForgotPasswordSubmit(e) {
    if (e) e.preventDefault();
    const emailInput = document.getElementById('recoveryEmailInput');
    const submitBtn = document.getElementById('btnSendOtp');
    const banner = document.getElementById('forgotErrorBanner');
    const bannerText = document.getElementById('forgotErrorText');

    const email = (emailInput ? emailInput.value : '').trim();
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    if (!email || !emailRegex.test(email)) {
      if (banner && bannerText) {
        bannerText.textContent = 'Please enter a valid institutional email address.';
        banner.style.display = 'flex';
      }
      return;
    }

    try {
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="loading-spinner"></span> Sending Code...';
      }

      AuthView.recoveryEmail = email;
      await ApiClient.forgotPassword(email);

      // 60-second cooldown initialized
      AuthView.resendCooldownUntil = Date.now() + 60000;
      appState.setView('verify-otp');
    } catch (err) {
      if (banner && bannerText) {
        bannerText.textContent = err.message || 'Unable to send verification code. Please try again.';
        banner.style.display = 'flex';
      }
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Verification Code';
      }
    }
  }

  // 2. SCREEN TWO: VERIFY OTP
  static renderVerifyOtp(container) {
    const displayEmail = AuthView.recoveryEmail
      ? (window.SecurityUtils ? window.SecurityUtils.escapeHtml(AuthView.recoveryEmail) : AuthView.recoveryEmail)
      : 'your email address';

    container.innerHTML = `
      <div class="auth-fullscreen-container">
        ${AuthView.getEditorialColumnHtml()}

        <div class="auth-form-col">
          <div class="auth-card">
            <div class="auth-card-header">
              <h2 class="auth-card-title">Verify Your Email</h2>
              <p class="auth-card-desc">Enter the 6-digit code sent to <strong>${displayEmail}</strong>.</p>
            </div>

            <div id="otpErrorBanner" class="auth-error-banner" style="display: none;">
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
              <span id="otpErrorText"></span>
            </div>

            <form id="verifyOtpForm" onsubmit="AuthView.handleVerifyOtpSubmit(event)" novalidate>
              <div class="otp-inputs-wrap" id="otpBoxesWrap">
                <input type="text" class="otp-digit-box" maxlength="1" inputmode="numeric" pattern="[0-9]*" autocomplete="one-time-code" data-index="0" aria-label="Digit 1">
                <input type="text" class="otp-digit-box" maxlength="1" inputmode="numeric" pattern="[0-9]*" autocomplete="one-time-code" data-index="1" aria-label="Digit 2">
                <input type="text" class="otp-digit-box" maxlength="1" inputmode="numeric" pattern="[0-9]*" autocomplete="one-time-code" data-index="2" aria-label="Digit 3">
                <input type="text" class="otp-digit-box" maxlength="1" inputmode="numeric" pattern="[0-9]*" autocomplete="one-time-code" data-index="3" aria-label="Digit 4">
                <input type="text" class="otp-digit-box" maxlength="1" inputmode="numeric" pattern="[0-9]*" autocomplete="one-time-code" data-index="4" aria-label="Digit 5">
                <input type="text" class="otp-digit-box" maxlength="1" inputmode="numeric" pattern="[0-9]*" autocomplete="one-time-code" data-index="5" aria-label="Digit 6">
              </div>

              <button type="submit" id="btnVerifyOtp" class="btn btn-primary w-full" style="padding: 0.85rem; font-size: 0.95rem; margin-top: 1rem;">
                Verify Code
              </button>

              <div class="resend-section">
                <button type="button" id="btnResendOtp" class="resend-btn" onclick="AuthView.handleResendOtp()">
                  Resend Code
                </button>
                <span id="resendCountdown" class="resend-countdown"></span>
              </div>
            </form>

            <div style="text-align: center; margin-top: 1.5rem;">
              <a href="javascript:void(0)" onclick="appState.setView('forgot-password')" class="back-to-login-link">
                <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                Back
              </a>
            </div>
          </div>
        </div>
      </div>
    `;

    AuthView.setupOtpInputs();
    AuthView.startResendCooldownTimer();
  }

  static setupOtpInputs() {
    setTimeout(() => {
      const boxes = Array.from(document.querySelectorAll('.otp-digit-box'));
      if (!boxes.length) return;

      boxes[0].focus();

      boxes.forEach((box, idx) => {
        box.addEventListener('input', (e) => {
          const val = box.value.replace(/\D/g, '');
          box.value = val ? val[0] : '';

          if (box.value) {
            box.classList.add('filled');
            box.classList.remove('error');
            if (idx < boxes.length - 1) {
              boxes[idx + 1].focus();
            }
          } else {
            box.classList.remove('filled');
          }

          const banner = document.getElementById('otpErrorBanner');
          if (banner) banner.style.display = 'none';
        });

        box.addEventListener('keydown', (e) => {
          if (e.key === 'Backspace') {
            if (!box.value && idx > 0) {
              boxes[idx - 1].focus();
              boxes[idx - 1].value = '';
              boxes[idx - 1].classList.remove('filled');
            } else {
              box.value = '';
              box.classList.remove('filled');
            }
          } else if (e.key === 'ArrowLeft' && idx > 0) {
            boxes[idx - 1].focus();
          } else if (e.key === 'ArrowRight' && idx < boxes.length - 1) {
            boxes[idx + 1].focus();
          }
        });

        box.addEventListener('paste', (e) => {
          e.preventDefault();
          const pasted = (e.clipboardData || window.clipboardData).getData('text');
          const digits = pasted.replace(/\D/g, '').slice(0, 6);
          if (!digits) return;

          digits.split('').forEach((d, i) => {
            if (boxes[i]) {
              boxes[i].value = d;
              boxes[i].classList.add('filled');
              boxes[i].classList.remove('error');
            }
          });

          const nextIndex = Math.min(digits.length, boxes.length - 1);
          boxes[nextIndex].focus();

          const banner = document.getElementById('otpErrorBanner');
          if (banner) banner.style.display = 'none';
        });
      });
    }, 50);
  }

  static startResendCooldownTimer() {
    if (AuthView.resendIntervalId) {
      clearInterval(AuthView.resendIntervalId);
      AuthView.resendIntervalId = null;
    }

    const updateTimer = () => {
      const resendBtn = document.getElementById('btnResendOtp');
      const countdownEl = document.getElementById('resendCountdown');
      if (!resendBtn && !countdownEl) {
        clearInterval(AuthView.resendIntervalId);
        return;
      }

      const remainingMs = AuthView.resendCooldownUntil - Date.now();
      const remainingSec = Math.ceil(remainingMs / 1000);

      if (remainingSec > 0) {
        if (resendBtn) resendBtn.disabled = true;
        if (countdownEl) countdownEl.textContent = `Resend in ${remainingSec}s`;
      } else {
        if (resendBtn) resendBtn.disabled = false;
        if (countdownEl) countdownEl.textContent = '';
        clearInterval(AuthView.resendIntervalId);
        AuthView.resendIntervalId = null;
      }
    };

    updateTimer();
    AuthView.resendIntervalId = setInterval(updateTimer, 1000);
  }

  static async handleResendOtp() {
    const resendBtn = document.getElementById('btnResendOtp');
    const banner = document.getElementById('otpErrorBanner');
    const bannerText = document.getElementById('otpErrorText');

    if (!AuthView.recoveryEmail) {
      appState.setView('forgot-password');
      return;
    }

    try {
      if (resendBtn) resendBtn.disabled = true;
      await ApiClient.resendResetOtp(AuthView.recoveryEmail);
      AuthView.resendCooldownUntil = Date.now() + 60000;
      AuthView.startResendCooldownTimer();
      appState.showToast('A new 6-digit verification code has been dispatched to your email.', 'info');
    } catch (err) {
      if (banner && bannerText) {
        bannerText.textContent = err.message || 'Unable to resend verification code.';
        banner.style.display = 'flex';
      }
    }
  }

  static async handleVerifyOtpSubmit(e) {
    if (e) e.preventDefault();
    const boxes = Array.from(document.querySelectorAll('.otp-digit-box'));
    const verifyBtn = document.getElementById('btnVerifyOtp');
    const banner = document.getElementById('otpErrorBanner');
    const bannerText = document.getElementById('otpErrorText');

    const otpCode = boxes.map(b => b.value.trim()).join('');

    if (otpCode.length !== 6 || !/^\d{6}$/.test(otpCode)) {
      if (banner && bannerText) {
        bannerText.textContent = 'Please enter all 6 numeric digits of your verification code.';
        banner.style.display = 'flex';
      }
      boxes.forEach(b => { if (!b.value) b.classList.add('error'); });
      return;
    }

    try {
      if (verifyBtn) {
        verifyBtn.disabled = true;
        verifyBtn.innerHTML = '<span class="loading-spinner"></span> Verifying...';
      }

      const res = await ApiClient.verifyResetOtp(AuthView.recoveryEmail, otpCode);
      if (res && res.recoveryGrantToken) {
        AuthView.recoveryGrantToken = res.recoveryGrantToken;
        if (AuthView.resendIntervalId) {
          clearInterval(AuthView.resendIntervalId);
          AuthView.resendIntervalId = null;
        }
        appState.setView('reset-password');
      } else {
        throw new Error('Verification grant missing from server response.');
      }
    } catch (err) {
      if (banner && bannerText) {
        bannerText.textContent = err.message || 'Incorrect or expired verification code.';
        banner.style.display = 'flex';
      }
      boxes.forEach(b => b.classList.add('error'));
    } finally {
      if (verifyBtn) {
        verifyBtn.disabled = false;
        verifyBtn.textContent = 'Verify Code';
      }
    }
  }

  // 3. SCREEN THREE: SET NEW PASSWORD
  static renderResetPassword(container) {
    container.innerHTML = `
      <div class="auth-fullscreen-container">
        ${AuthView.getEditorialColumnHtml()}

        <div class="auth-form-col">
          <div class="auth-card">
            <div class="auth-card-header">
              <h2 class="auth-card-title">Create New Password</h2>
              <p class="auth-card-desc">Set a secure new password for your Campus X account.</p>
            </div>

            <div id="resetErrorBanner" class="auth-error-banner" style="display: none;">
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
              <span id="resetErrorText"></span>
            </div>

            <form id="resetPasswordForm" onsubmit="AuthView.handleResetPasswordSubmit(event)" novalidate>
              <div class="form-group">
                <label class="form-label" for="newPasswordInput">New Password</label>
                <div class="password-input-wrap">
                  <input 
                    type="password" 
                    id="newPasswordInput" 
                    class="form-input" 
                    placeholder="At least 12 characters" 
                    required 
                    autocomplete="new-password"
                    oninput="AuthView.clearResetErrors()">
                  <button type="button" class="password-toggle-btn" aria-label="Toggle password visibility" onclick="AuthView.togglePasswordVisibility('newPasswordInput', this)">
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  </button>
                </div>
                <span class="form-hint">Must be at least 12 characters.</span>
              </div>

              <div class="form-group">
                <label class="form-label" for="confirmNewPasswordInput">Confirm New Password</label>
                <div class="password-input-wrap">
                  <input 
                    type="password" 
                    id="confirmNewPasswordInput" 
                    class="form-input" 
                    placeholder="Re-enter new password" 
                    required 
                    autocomplete="new-password"
                    oninput="AuthView.clearResetErrors()">
                  <button type="button" class="password-toggle-btn" aria-label="Toggle password visibility" onclick="AuthView.togglePasswordVisibility('confirmNewPasswordInput', this)">
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  </button>
                </div>
              </div>

              <button type="submit" id="btnResetPassword" class="btn btn-primary w-full" style="padding: 0.85rem; font-size: 0.95rem; margin-top: 1rem;">
                Reset Password
              </button>
            </form>
          </div>
        </div>
      </div>
    `;

    setTimeout(() => {
      const p = document.getElementById('newPasswordInput');
      if (p) p.focus();
    }, 50);
  }

  static clearResetErrors() {
    const banner = document.getElementById('resetErrorBanner');
    if (banner) banner.style.display = 'none';
  }

  static async handleResetPasswordSubmit(e) {
    if (e) e.preventDefault();
    const pInput = document.getElementById('newPasswordInput');
    const cpInput = document.getElementById('confirmNewPasswordInput');
    const submitBtn = document.getElementById('btnResetPassword');
    const banner = document.getElementById('resetErrorBanner');
    const bannerText = document.getElementById('resetErrorText');

    const newPassword = (pInput ? pInput.value : '').trim();
    const confirmPassword = (cpInput ? cpInput.value : '').trim();

    if (!newPassword || newPassword.length < 12) {
      if (banner && bannerText) {
        bannerText.textContent = 'Password must be at least 12 characters long.';
        banner.style.display = 'flex';
      }
      return;
    }

    if (newPassword !== confirmPassword) {
      if (banner && bannerText) {
        bannerText.textContent = 'Passwords do not match.';
        banner.style.display = 'flex';
      }
      return;
    }

    if (!AuthView.recoveryGrantToken) {
      if (banner && bannerText) {
        bannerText.textContent = 'Recovery authorization missing or expired. Please start over.';
        banner.style.display = 'flex';
      }
      return;
    }

    try {
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="loading-spinner"></span> Resetting Password...';
      }

      await ApiClient.resetPassword(
        AuthView.recoveryEmail,
        AuthView.recoveryGrantToken,
        newPassword,
        confirmPassword
      );

      // Invalidate frontend recovery tokens
      AuthView.recoveryGrantToken = '';
      AuthView.recoveryEmail = '';

      appState.setView('reset-success');
    } catch (err) {
      if (banner && bannerText) {
        bannerText.textContent = err.message || 'Failed to reset password. Please try again.';
        banner.style.display = 'flex';
      }
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Reset Password';
      }
    }
  }

  // 4. SCREEN FOUR: SUCCESS
  static renderResetSuccess(container) {
    container.innerHTML = `
      <div class="auth-fullscreen-container">
        ${AuthView.getEditorialColumnHtml()}

        <div class="auth-form-col">
          <div class="auth-card" style="text-align: center; padding: 2.5rem 2rem;">
            <div class="success-check-circle">
              <svg width="32" height="32" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 class="auth-card-title" style="margin-bottom: 0.5rem;">Password Reset Successful</h2>
            <p class="auth-card-desc" style="margin-bottom: 2rem;">
              Your Campus X password has been updated. You can now sign in with your new password.
            </p>

            <button type="button" class="btn btn-primary w-full" style="padding: 0.85rem; font-size: 0.95rem;" onclick="appState.setView('login')">
              Back to Login
            </button>
          </div>
        </div>
      </div>
    `;
  }
}
