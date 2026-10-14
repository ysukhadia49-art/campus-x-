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

            <div class="demo-accounts-box">
              <div class="demo-title">
                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M13.8 12H3"></path></svg>
                Instant 1-Click Evaluation Personas:
              </div>
              <div class="demo-pills-grid">
                <button class="demo-pill-btn" onclick="AuthView.quickDemoLogin('student@tapi.edu')">
                  <span class="demo-pill-name">Parshva Shah</span>
                  <span class="demo-pill-role">Student Workspace</span>
                </button>
                <button class="demo-pill-btn" onclick="AuthView.quickDemoLogin('faculty@tapi.edu')">
                  <span class="demo-pill-name">Prof. S. R. Patel</span>
                  <span class="demo-pill-role">Faculty Workspace</span>
                </button>
                <button class="demo-pill-btn" onclick="AuthView.quickDemoLogin('admin@tapi.edu')">
                  <span class="demo-pill-name">Dr. A. K. Joshi</span>
                  <span class="demo-pill-role">Admin Workspace</span>
                </button>
                <button class="demo-pill-btn" onclick="AuthView.quickDemoLogin('stationery@tapi.edu')">
                  <span class="demo-pill-name">Ramesh Bhai</span>
                  <span class="demo-pill-role">Stationery Operator</span>
                </button>
              </div>
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
                  value="student@tapi.edu"
                  oninput="AuthView.clearLoginErrors()">
              </div>

              <div class="form-group">
                <div class="flex items-center justify-between" style="margin-bottom: 0.4rem;">
                  <label class="form-label" for="loginPassword" style="margin-bottom: 0;">Password</label>
                  <a href="javascript:void(0)" onclick="AuthView.openForgotPasswordModal()" style="font-size: 0.75rem; color: var(--color-accent-blue); text-decoration: none;">Forgot password?</a>
                </div>
                <div class="password-input-wrap">
                  <input 
                    type="password" 
                    id="loginPassword" 
                    class="form-input" 
                    placeholder="••••••••" 
                    required 
                    autocomplete="current-password"
                    value="password123"
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

            <!-- 1-Click Evaluation Switcher -->
            <div class="demo-accounts-box">
              <div class="demo-title">Quick Demo Sign-In (Verified Credential Pipeline):</div>
              <div class="demo-pills-grid">
                <button class="demo-pill-btn" onclick="AuthView.quickDemoLogin('student@tapi.edu')">
                  <span class="demo-pill-name">Parshva Shah</span>
                  <span class="demo-pill-role">Student Account</span>
                </button>
                <button class="demo-pill-btn" onclick="AuthView.quickDemoLogin('faculty@tapi.edu')">
                  <span class="demo-pill-name">Prof. S. R. Patel</span>
                  <span class="demo-pill-role">Faculty Account</span>
                </button>
                <button class="demo-pill-btn" onclick="AuthView.quickDemoLogin('admin@tapi.edu')">
                  <span class="demo-pill-name">Dr. A. K. Joshi</span>
                  <span class="demo-pill-role">Admin Account</span>
                </button>
                <button class="demo-pill-btn" onclick="AuthView.quickDemoLogin('stationery@tapi.edu')">
                  <span class="demo-pill-name">Ramesh Bhai</span>
                  <span class="demo-pill-role">Stationery Operator</span>
                </button>
              </div>
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

  static async quickDemoLogin(email) {
    // Populate form fields
    const emailEl = document.getElementById('loginEmail');
    const passEl = document.getElementById('loginPassword');
    if (emailEl) emailEl.value = email;
    if (passEl) passEl.value = 'password123';

    // Authenticate through the secure verification pipeline
    try {
      const user = await appState.authenticateUser(email, 'password123');
      AuthView.triggerRoleRecognition(user);
    } catch (err) {
      appState.showToast(err.message || 'Authentication error', 'error');
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

  static openForgotPasswordModal() {
    AppModal.show({
      title: "Reset Institutional Password",
      content: `
        <div style="font-size: 0.88rem; color: var(--text-secondary); margin-bottom: 1.25rem; line-height: 1.5;">
          Enter your registered institutional email. If the account exists, a secure, single-use password reset link will be dispatched.
        </div>
        <div id="forgotPwFeedback" style="display: none; padding: 0.75rem; border-radius: 6px; font-size: 0.84rem; margin-bottom: 1rem;"></div>
        <div class="form-group">
          <label class="form-label" for="forgotEmailInput">Registered Email</label>
          <input type="email" id="forgotEmailInput" class="form-input" placeholder="e.g. student@tapi.edu" required value="student@tapi.edu">
        </div>
      `,
      confirmText: "Send Reset Link",
      onConfirm: async () => {
        const emailInput = document.getElementById('forgotEmailInput');
        const feedback = document.getElementById('forgotPwFeedback');
        const email = emailInput ? emailInput.value.trim() : '';

        if (!email || (window.SecurityUtils && !window.SecurityUtils.validateEmail(email))) {
          appState.showToast('Please enter a valid email address.', 'error');
          return;
        }

        try {
          let msg = 'If an account exists with this email, password reset instructions have been sent.';
          if (window.ApiClient && window.ApiClient.getApiBase()) {
            const resp = await window.ApiClient.forgotPassword(email);
            if (resp && resp.message) msg = resp.message;
          }
          appState.showToast(msg, 'success');
        } catch (err) {
          appState.showToast('If an account exists with this email, password reset instructions have been sent.', 'info');
        }
      }
    });
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
}
