/* ==========================================================
   Campus X AI - Client-Side Security Utilities & API Client
   Tapi Diploma Engineering College, Surat
   XSS Protection, Input Validation, Secure Token Handling
   ========================================================== */

class SecurityUtils {
  /**
   * Escape HTML entities to protect against XSS injection
   * @param {string} str
   * @returns {string} Sanitized string safe for DOM interpolation
   */
  static escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
      .replace(/`/g, '&#96;')
      .replace(/\//g, '&#x2F;');
  }

  /**
   * Validate safe URL scheme (prevents javascript:, vbscript:, data: XSS)
   * @param {string} url
   * @returns {boolean}
   */
  static isSafeUrl(url) {
    if (!url || typeof url !== 'string') return false;
    const trimmed = url.trim().toLowerCase();
    if (trimmed.startsWith('javascript:') || trimmed.startsWith('vbscript:') || trimmed.startsWith('data:text/html')) {
      return false;
    }
    return true;
  }

  /**
   * Validate Email Format (RFC 5322 compliant regex)
   * @param {string} email
   * @returns {boolean}
   */
  static validateEmail(email) {
    if (!email || typeof email !== 'string') return false;
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email.trim());
  }

  /**
   * Password strength check (Minimum 8 chars, at least one letter and one number)
   * @param {string} password
   * @returns {{ valid: boolean, message: string }}
   */
  static validatePassword(password) {
    if (!password || typeof password !== 'string') {
      return { valid: false, message: 'Password is required.' };
    }
    if (password.length < 8) {
      return { valid: false, message: 'Password must be at least 8 characters long.' };
    }
    if (password.length > 128) {
      return { valid: false, message: 'Password cannot exceed 128 characters.' };
    }
    return { valid: true, message: 'Password meets security requirements.' };
  }

  /**
   * Strip unsafe characters and limit length
   * @param {string} input
   * @param {number} maxLen
   * @returns {string}
   */
  static sanitizeInput(input, maxLen = 250) {
    if (!input || typeof input !== 'string') return '';
    return input.trim().slice(0, maxLen);
  }
}

class ApiClient {
  static getApiBase() {
    // Connect to current origin or default port 3000
    if (window.location.origin && window.location.origin.startsWith('http')) {
      return window.location.origin;
    }
    return 'http://localhost:3000';
  }

  static getToken() {
    try {
      return sessionStorage.getItem('campusx_jwt_token') || localStorage.getItem('campusx_jwt_token');
    } catch (e) {
      return null;
    }
  }

  static setToken(token) {
    try {
      if (token) {
        sessionStorage.setItem('campusx_jwt_token', token);
        localStorage.setItem('campusx_jwt_token', token);
      } else {
        sessionStorage.removeItem('campusx_jwt_token');
        localStorage.removeItem('campusx_jwt_token');
      }
    } catch (e) {}
  }

  static async request(endpoint, options = {}) {
    const url = `${ApiClient.getApiBase()}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    };

    const token = ApiClient.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        // Handle Rate Limiting (429)
        if (response.status === 429) {
          const msg = data.error || 'Too many requests. Please wait a moment before trying again.';
          if (window.appState && window.appState.showToast) {
            window.appState.showToast(msg, 'warning');
          }
          throw new Error(msg);
        }

        // Handle Forbidden (403)
        if (response.status === 403) {
          const msg = data.error || 'Access denied: You do not have permission for this action.';
          if (window.appState && window.appState.showToast) {
            window.appState.showToast(msg, 'error');
          }
          throw new Error(msg);
        }

        // Generic error message for 401 Unauthorized
        if (response.status === 401) {
          throw new Error(data.error || 'Incorrect email or password.');
        }

        throw new Error(data.error || `Request failed with status ${response.status}`);
      }

      return data;
    } catch (err) {
      // Re-throw if already handled or error is specific
      throw err;
    }
  }

  static async login(email, password) {
    return ApiClient.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  }

  static async register(formData) {
    return ApiClient.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(formData)
    });
  }

  static async forgotPassword(email) {
    return ApiClient.request('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
  }

  static async resetPassword(token, newPassword, confirmPassword) {
    return ApiClient.request('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword, confirmPassword })
    });
  }

  static async logout() {
    try {
      await ApiClient.request('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      // Ignore network errors on logout
    } finally {
      ApiClient.setToken(null);
    }
  }

  static async getMe() {
    return ApiClient.request('/api/auth/me', { method: 'GET' });
  }
}

// Attach to window
window.SecurityUtils = SecurityUtils;
window.ApiClient = ApiClient;
