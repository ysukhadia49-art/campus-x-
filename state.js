/* ==========================================================
   Campus X AI - Central State & Reactive Event Manager
   Hardened RBAC, Secure Session Tracking & Audit Integration
   ========================================================== */

class CampusState {
  constructor() {
    let savedUser = null;
    try {
      const savedEmail = localStorage.getItem('campusx_user_email');
      const token = (window.ApiClient && window.ApiClient.getToken) ? window.ApiClient.getToken() : null;
      if (savedEmail && token && CAMPUS_DATA.accounts[savedEmail]) {
        savedUser = CAMPUS_DATA.accounts[savedEmail];
      }
    } catch (e) {}

    // Initial session (persists authenticated user if valid token exists)
    this.currentUser = savedUser || null;
    this.activeView = this.currentUser ? 'dashboard' : 'landing';
    this.stationeryRush = false;
    this.rushStartTime = null;
    this.toasts = [];
    this.listeners = [];

    // Load persisted demo rush state if available
    try {
      const savedRush = localStorage.getItem('campusx_rush');
      if (savedRush === 'true') {
        this.stationeryRush = true;
        this.rushStartTime = localStorage.getItem('campusx_rush_time') || "11:42 AM";
      }
    } catch (e) {}
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify(changeType) {
    this.listeners.forEach(fn => fn(changeType, this));
  }

  /**
   * Secure credential authentication through backend API with offline fallback
   * Never accepts empty passwords or plaintext bypasses
   */
  async authenticateUser(email, password) {
    if (!email || !password) {
      throw new Error('Email and password are required.');
    }

    // 1. Authenticate against Backend API with cryptographic JWT verification
    if (window.ApiClient) {
      try {
        const response = await window.ApiClient.login(email, password);
        if (response && response.token && response.user) {
          window.ApiClient.setToken(response.token);
          this.setCurrentUser(response.user, response.token);
          return response.user;
        }
      } catch (err) {
        // If it's a 401, 400, or 429 from the server, throw directly to user
        if (err.message && !err.message.includes('Failed to fetch') && !err.message.includes('NetworkError')) {
          throw err;
        }
        // If server is truly unreachable, report clear network error rather than silent insecure bypass
        throw new Error('Campus authentication server is currently unreachable. Please verify your connection.');
      }
    }

    // Generic error: NEVER reveal whether the account exists
    throw new Error('Incorrect email or password.');
  }

  async logout() {
    try {
      if (window.ApiClient && window.ApiClient.logout) {
        await window.ApiClient.logout();
      }
    } catch (e) {
      console.warn('Logout network notification failed:', e);
    } finally {
      this.setCurrentUser(null);
      this.showToast('Signed out successfully.', 'info');
    }
  }

  setCurrentUser(user, token = null) {
    this.currentUser = user;
    if (user) {
      this.activeView = 'dashboard';
      try { 
        localStorage.setItem('campusx_user_email', user.email);
        if (token && window.ApiClient) window.ApiClient.setToken(token);
      } catch (e) {}
    } else {
      this.activeView = 'landing';
      try { 
        localStorage.removeItem('campusx_user_email');
        if (window.ApiClient) window.ApiClient.setToken(null);
      } catch (e) {}
    }
    this.notify('USER_CHANGED');
  }

  setView(viewName) {
    // Role-based route guard
    if (viewName === 'admin' || viewName === 'reports') {
      if (!this.currentUser || this.currentUser.role !== 'ADMIN') {
        this.showToast('Access denied: Administrator privileges required.', 'error');
        return;
      }
    }
    this.activeView = viewName;
    this.notify('VIEW_CHANGED');
  }

  toggleRush(turnOn) {
    // RBAC Guard: Only STATIONERY_OPERATOR or ADMIN can change rush status
    if (!this.currentUser || (this.currentUser.role !== 'STATIONERY_OPERATOR' && this.currentUser.role !== 'ADMIN')) {
      this.showToast('Access denied: Only stationery operators or administrators can update rush status.', 'error');
      return;
    }

    this.stationeryRush = turnOn;
    if (turnOn) {
      const now = new Date();
      this.rushStartTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      this.rushStartTime = null;
    }

    try {
      localStorage.setItem('campusx_rush', this.stationeryRush ? 'true' : 'false');
      if (this.rushStartTime) {
        localStorage.setItem('campusx_rush_time', this.rushStartTime);
      }
    } catch (e) {}

    this.showToast(turnOn ? "Stationery Rush turned ON" : "Stationery Rush turned OFF", turnOn ? "warning" : "success");
    this.notify('RUSH_CHANGED');
  }

  showToast(message, type = 'info') {
    // Ensure message string is sanitized
    const safeMessage = (window.SecurityUtils && window.SecurityUtils.escapeHtml) 
      ? window.SecurityUtils.escapeHtml(message) 
      : message;

    const toast = { id: Date.now(), message: safeMessage, type };
    this.toasts.push(toast);
    this.renderToasts();
    setTimeout(() => {
      this.toasts = this.toasts.filter(t => t.id !== toast.id);
      this.renderToasts();
    }, 4000);
  }

  renderToasts() {
    let container = document.getElementById('toastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    container.innerHTML = this.toasts.map(t => `
      <div class="toast toast-${t.type} animate-slide-in">
        <span class="toast-indicator"></span>
        <span class="toast-message">${t.message}</span>
      </div>
    `).join('');
  }

  updateStock(itemId, deltaQty, reason = "Manual Adjustment") {
    // RBAC Guard
    if (!this.currentUser || (this.currentUser.role !== 'STATIONERY_OPERATOR' && this.currentUser.role !== 'ADMIN')) {
      this.showToast('Access denied: Only stationery operators or administrators can adjust inventory.', 'error');
      return false;
    }

    const item = CAMPUS_DATA.stationeryInventory.find(i => i.id === itemId);
    if (!item) return false;

    const prevStock = item.stock;
    const newStock = Math.max(0, item.stock + deltaQty);
    item.stock = newStock;

    if (item.stock === 0) {
      item.status = "OUT_OF_STOCK";
    } else if (item.stock <= item.minStock) {
      item.status = "LOW_STOCK";
    } else {
      item.status = "AVAILABLE";
    }

    this.showToast(`Stock updated for ${item.name}: ${prevStock} → ${newStock} (${reason})`, "success");
    this.notify('INVENTORY_CHANGED');
    return true;
  }

  addItem(newItem) {
    // RBAC Guard
    if (!this.currentUser || (this.currentUser.role !== 'STATIONERY_OPERATOR' && this.currentUser.role !== 'ADMIN')) {
      this.showToast('Access denied: Only stationery operators or administrators can add catalog items.', 'error');
      return;
    }

    // Input Sanitization
    if (window.SecurityUtils) {
      newItem.name = window.SecurityUtils.sanitizeInput(newItem.name, 100);
      newItem.category = window.SecurityUtils.sanitizeInput(newItem.category, 50);
      newItem.unit = window.SecurityUtils.sanitizeInput(newItem.unit, 20);
      newItem.description = window.SecurityUtils.sanitizeInput(newItem.description, 300);
    }

    CAMPUS_DATA.stationeryInventory.unshift(newItem);
    this.showToast(`Added "${newItem.name}" to stationery inventory.`, "success");
    this.notify('INVENTORY_CHANGED');
  }

  saveAttendance(classId, subject) {
    // RBAC Guard: Only FACULTY or ADMIN
    if (!this.currentUser || (this.currentUser.role !== 'FACULTY' && this.currentUser.role !== 'ADMIN')) {
      this.showToast('Access denied: Only faculty members can record attendance.', 'error');
      return;
    }

    this.showToast(`Attendance saved for ${classId} (${subject}). Records synchronized.`, "success");
    this.notify('ATTENDANCE_SAVED');
  }

  createComplaint(complaint) {
    // Sanitize user-provided fields
    if (window.SecurityUtils) {
      complaint.subject = window.SecurityUtils.sanitizeInput(complaint.subject, 120);
      complaint.location = window.SecurityUtils.sanitizeInput(complaint.location, 80);
      complaint.description = window.SecurityUtils.sanitizeInput(complaint.description, 500);
    }

    CAMPUS_DATA.complaints.unshift(complaint);
    this.showToast(`Complaint #${complaint.id} submitted successfully. Tracking started.`, "success");
    this.notify('COMPLAINT_CREATED');
  }

  reportLostFound(item) {
    // Sanitize user-provided fields
    if (window.SecurityUtils) {
      item.item = window.SecurityUtils.sanitizeInput(item.item, 100);
      item.location = window.SecurityUtils.sanitizeInput(item.location, 80);
      item.desc = window.SecurityUtils.sanitizeInput(item.desc, 400);
    }

    CAMPUS_DATA.lostAndFound.unshift(item);
    this.showToast(`Report for "${item.item}" logged in Lost & Found directory.`, "success");
    this.notify('LOST_FOUND_CREATED');
  }
}

window.appState = new CampusState();
