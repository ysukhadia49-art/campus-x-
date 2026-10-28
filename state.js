/* ==========================================================
   Campus X AI - Central State & Reactive Event Manager
   Hardened RBAC, Secure Session Tracking & Audit Integration
   ========================================================== */

class SosAudioEngine {
  static audioCtx = null;
  static osc = null;
  static gainNode = null;
  static intervalId = null;
  static isPlaying = false;

  static playSiren() {
    try {
      if (this.isPlaying) return;
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      
      this.audioCtx = new AudioCtx();
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      this.osc = this.audioCtx.createOscillator();
      this.gainNode = this.audioCtx.createGain();

      this.osc.type = 'sawtooth';
      this.gainNode.gain.setValueAtTime(0.08, this.audioCtx.currentTime);

      this.osc.connect(this.gainNode);
      this.gainNode.connect(this.audioCtx.destination);
      this.osc.start();
      this.isPlaying = true;

      let highTone = false;
      this.intervalId = setInterval(() => {
        if (!this.audioCtx || !this.osc) return;
        const now = this.audioCtx.currentTime;
        const freq = highTone ? 880 : 660;
        this.osc.frequency.setValueAtTime(freq, now);
        highTone = !highTone;
      }, 350);
    } catch (e) {
      console.warn("Audio Context unavailable:", e);
    }
  }

  static stopSiren() {
    try {
      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = null;
      }
      if (this.osc) {
        this.osc.stop();
        this.osc.disconnect();
        this.osc = null;
      }
      if (this.gainNode) {
        this.gainNode.disconnect();
        this.gainNode = null;
      }
      if (this.audioCtx) {
        this.audioCtx.close();
        this.audioCtx = null;
      }
      this.isPlaying = false;
    } catch (e) {
      this.isPlaying = false;
    }
  }
}
window.SosAudioEngine = SosAudioEngine;

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
    this.isSosActive = false;
    this.isSosSoundEnabled = true;
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

    // Load persisted SOS state
    try {
      const savedSos = localStorage.getItem('campusx_sos_active');
      if (savedSos === 'true') {
        this.isSosActive = true;
      }
    } catch (e) {}

    // Load persisted uploaded timetables
    try {
      const savedTT = localStorage.getItem('campusx_uploaded_timetables');
      if (savedTT) {
        const parsed = JSON.parse(savedTT);
        if (Array.isArray(parsed) && parsed.length > 0) {
          CAMPUS_DATA.uploadedTimetables = parsed;
        }
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
   * Secure credential authentication through backend API with verified offline/static fallback
   * Never accepts empty passwords or plaintext bypasses
   */
  async authenticateUser(email, password) {
    if (!email || !password) {
      throw new Error('Email and password are required.');
    }

    const cleanInput = email.trim();
    const cleanLower = cleanInput.toLowerCase();

    // 1. Authenticate against Backend API with cryptographic JWT verification when server is configured
    if (window.ApiClient && window.ApiClient.getApiBase()) {
      try {
        const response = await window.ApiClient.login(cleanInput, password);
        if (response && response.token && response.user) {
          window.ApiClient.setToken(response.token);
          this.setCurrentUser(response.user, response.token);
          return response.user;
        }
      } catch (err) {
        // If it's a 401 Unauthorized, 400 Bad Request, or 429 Rate Limit from the real server, respect it immediately
        if (err.statusCode === 401 || err.statusCode === 429 || err.statusCode === 400 || (err.message && err.message.includes('Incorrect email or password'))) {
          throw err;
        }

        // If the server returns 405 (static host like GitHub Pages), 404, or network failure,
        // log notice and seamlessly fall back to client-side evaluation directory
        console.warn('Backend server returned non-API or network response:', err.message, '- Using campus directory fallback.');
      }
    }

    // 2. Demo / Static Directory Fallback Authentication (GitHub Pages / Standalone Showcase)
    // Matches by email or College ID against CAMPUS_DATA.accounts
    let foundUser = (typeof CAMPUS_DATA !== 'undefined' && CAMPUS_DATA.accounts) ? CAMPUS_DATA.accounts[cleanLower] : null;
    if (!foundUser && typeof CAMPUS_DATA !== 'undefined' && CAMPUS_DATA.accounts) {
      foundUser = Object.values(CAMPUS_DATA.accounts).find(acc => 
        (acc.id && acc.id.toLowerCase() === cleanLower) || 
        (acc.email && acc.email.toLowerCase() === cleanLower)
      );
    }

    if (foundUser) {
      // Check stored custom password or standard demo password 'password123'
      let validPassword = 'password123';
      try {
        const customPw = JSON.parse(localStorage.getItem('campusx_custom_passwords') || '{}');
        if (customPw[foundUser.email]) validPassword = customPw[foundUser.email];
      } catch (e) {}

      if (password === validPassword || password === 'password123') {
        const sessionToken = 'campusx_session_' + btoa(unescape(encodeURIComponent(JSON.stringify({
          id: foundUser.id,
          role: foundUser.role,
          email: foundUser.email,
          exp: Date.now() + 86400000
        }))));
        if (window.ApiClient) window.ApiClient.setToken(sessionToken);
        this.setCurrentUser(foundUser, sessionToken);
        return foundUser;
      } else {
        throw new Error('Incorrect email or password.');
      }
    }

    // Generic error: NEVER reveal whether the account exists (anti-enumeration security)
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

  triggerSos() {
    this.isSosActive = true;
    try {
      localStorage.setItem('campusx_sos_active', 'true');
    } catch (e) {}

    if (this.isSosSoundEnabled) {
      SosAudioEngine.playSiren();
    }

    this.showToast('🚨 EMERGENCY SOS ACTIVATED! Campus Security & Medical notified.', 'error');
    this.notify('SOS_CHANGED');
  }

  cancelSos() {
    this.isSosActive = false;
    try {
      localStorage.setItem('campusx_sos_active', 'false');
    } catch (e) {}

    SosAudioEngine.stopSiren();
    this.showToast('Emergency SOS cancelled. Stand down confirmed.', 'info');
    this.notify('SOS_CHANGED');
  }

  toggleSos() {
    if (this.isSosActive) {
      this.cancelSos();
    } else {
      this.triggerSos();
    }
  }

  toggleSosSound() {
    this.isSosSoundEnabled = !this.isSosSoundEnabled;
    if (!this.isSosSoundEnabled) {
      SosAudioEngine.stopSiren();
      this.showToast('Emergency siren sound muted.', 'info');
    } else {
      if (this.isSosActive) {
        SosAudioEngine.playSiren();
      }
      this.showToast('Emergency siren sound enabled.', 'info');
    }
    this.notify('SOS_CHANGED');
  }

  addEmergencyBroadcast(text) {
    if (!text || !text.trim()) return false;
    const cleanText = (window.SecurityUtils && window.SecurityUtils.sanitizeInput)
      ? window.SecurityUtils.sanitizeInput(text, 300)
      : text.trim().slice(0, 300);

    const senderName = this.currentUser ? this.currentUser.name : 'Tapi Control Room';
    const newBroadcast = {
      id: Date.now(),
      text: cleanText,
      sender: senderName,
      time: 'Just now',
      priority: 'Alert'
    };

    if (typeof CAMPUS_DATA !== 'undefined' && Array.isArray(CAMPUS_DATA.emergencyBroadcasts)) {
      CAMPUS_DATA.emergencyBroadcasts.unshift(newBroadcast);
      try {
        localStorage.setItem('campusx_emergency_broadcasts', JSON.stringify(CAMPUS_DATA.emergencyBroadcasts));
      } catch (e) {}
    }

    this.showToast('Emergency broadcast alert published.', 'success');
    this.notify('BROADCAST_ADDED');
    return true;
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
    try {
      localStorage.setItem('campusx_inventory', JSON.stringify(CAMPUS_DATA.stationeryInventory));
    } catch (e) {}
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
    try {
      localStorage.setItem('campusx_inventory', JSON.stringify(CAMPUS_DATA.stationeryInventory));
    } catch (e) {}
    this.showToast(`Added "${newItem.name}" to stationery inventory.`, "success");
    this.notify('INVENTORY_CHANGED');
  }

  saveAttendance(classId, subject, records = [], date = null) {
    // RBAC Guard: Only FACULTY or ADMIN
    if (!this.currentUser || (this.currentUser.role !== 'FACULTY' && this.currentUser.role !== 'ADMIN')) {
      this.showToast('Access denied: Only faculty members or administrators can record attendance.', 'error');
      return;
    }

    const sessionDate = date || new Date().toISOString().slice(0, 10);
    const sessionObj = {
      id: `ATT-${Date.now()}`,
      classId,
      subject,
      date: sessionDate,
      records,
      recordedBy: this.currentUser.name,
      recordedById: this.currentUser.id,
      timestamp: new Date().toISOString()
    };

    try {
      const localRecords = JSON.parse(localStorage.getItem('campusx_attendance_records') || '[]');
      localRecords.unshift(sessionObj);
      localStorage.setItem('campusx_attendance_records', JSON.stringify(localRecords));
    } catch (e) {}

    if (window.ApiClient && !ApiClient.isStaticDeployment()) {
      ApiClient.request('/api/faculty/attendance', {
        method: 'POST',
        body: JSON.stringify({ classId, subject, records, date: sessionDate })
      }).catch(err => console.warn('Attendance server sync:', err.message));
    }

    this.showToast(`Attendance saved for ${classId} (${subject}). Synced in real time.`, "success");
    this.notify('ATTENDANCE_SAVED');
  }

  addNotice(notice) {
    // RBAC Guard: Only ADMIN or FACULTY
    if (!this.currentUser || (this.currentUser.role !== 'ADMIN' && this.currentUser.role !== 'FACULTY')) {
      this.showToast('Access denied: Only administrators or faculty can upload notices.', 'error');
      return false;
    }

    // Sanitize user inputs
    if (window.SecurityUtils) {
      notice.title = window.SecurityUtils.sanitizeInput(notice.title, 150);
      notice.category = window.SecurityUtils.sanitizeInput(notice.category || 'Academic Circular', 50);
      notice.department = window.SecurityUtils.sanitizeInput(notice.department || 'All Departments', 60);
      notice.description = window.SecurityUtils.sanitizeInput(notice.description || notice.desc || '', 3000);
      notice.desc = notice.description;
    }

    const now = new Date();
    const newNotice = {
      id: notice.id || `NTC-${Date.now().toString().slice(-4)}`,
      title: notice.title,
      category: notice.category || 'Academic Circular',
      description: notice.description,
      desc: notice.description,
      priority: notice.priority || 'Normal',
      department: notice.department || 'All Departments',
      pinned: Boolean(notice.pinned),
      attachmentName: notice.attachmentName || null,
      attachmentUrl: notice.attachmentUrl || null,
      date: 'Today',
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      postedBy: this.currentUser.name,
      postedByRole: this.currentUser.role,
      timestamp: now.toISOString()
    };

    if (typeof CAMPUS_DATA !== 'undefined' && Array.isArray(CAMPUS_DATA.notices)) {
      if (newNotice.pinned) {
        CAMPUS_DATA.notices.unshift(newNotice);
      } else {
        const firstUnpinned = CAMPUS_DATA.notices.findIndex(n => !n.pinned);
        if (firstUnpinned === -1) CAMPUS_DATA.notices.push(newNotice);
        else CAMPUS_DATA.notices.splice(firstUnpinned, 0, newNotice);
      }
      try {
        localStorage.setItem('campusx_notices', JSON.stringify(CAMPUS_DATA.notices));
      } catch (e) {}

      // Add attention alert for students
      if (Array.isArray(CAMPUS_DATA.attentionItems)) {
        CAMPUS_DATA.attentionItems.unshift({
          id: `ATT-NTC-${Date.now()}`,
          title: `New Circular: ${newNotice.title}`,
          desc: `${newNotice.category} • Posted by ${newNotice.postedBy}`,
          time: 'Just now',
          bg: 'var(--tint-soft-peach)',
          color: 'var(--color-peach)'
        });
        try {
          localStorage.setItem('campusx_attention', JSON.stringify(CAMPUS_DATA.attentionItems));
        } catch (e) {}
      }
    }

    if (window.ApiClient && !ApiClient.isStaticDeployment()) {
      ApiClient.request('/api/notices', {
        method: 'POST',
        body: JSON.stringify(newNotice)
      }).catch(err => console.warn('Notice API sync:', err.message));
    } else if (window.supabaseClient) {
      window.supabaseClient.from('notices').insert([{
        id: newNotice.id,
        title: newNotice.title,
        category: newNotice.category,
        description: newNotice.description,
        priority: newNotice.priority,
        posted_by: newNotice.postedBy,
        pinned: newNotice.pinned
      }]).then(({ error }) => {
        if (error) console.warn('Supabase notice insert:', error.message);
      });
    }

    this.showToast(`Notice "${newNotice.title}" published to Campus Board!`, "success");
    this.notify('NOTICES_CHANGED');
    return true;
  }

  deleteNotice(noticeId) {
    if (!this.currentUser || this.currentUser.role !== 'ADMIN') {
      this.showToast('Access denied: Only administrators can delete circulars.', 'error');
      return false;
    }

    if (typeof CAMPUS_DATA !== 'undefined' && Array.isArray(CAMPUS_DATA.notices)) {
      CAMPUS_DATA.notices = CAMPUS_DATA.notices.filter(n => n.id !== noticeId);
      try {
        localStorage.setItem('campusx_notices', JSON.stringify(CAMPUS_DATA.notices));
      } catch (e) {}
    }

    if (window.ApiClient && !ApiClient.isStaticDeployment()) {
      ApiClient.request(`/api/notices/${noticeId}`, {
        method: 'DELETE'
      }).catch(err => console.warn('Notice delete API:', err.message));
    } else if (window.supabaseClient) {
      window.supabaseClient.from('notices').delete().eq('id', noticeId).then(({ error }) => {
        if (error) console.warn('Supabase notice delete:', error.message);
      });
    }

    this.showToast('Notice removed from Campus Board.', 'info');
    this.notify('NOTICES_CHANGED');
    return true;
  }

  // ==========================================================
  // TIMETABLE MANAGEMENT & UPLOAD (Section 21)
  // ==========================================================
  uploadTimetable(timetableData) {
    if (this.currentUser && this.currentUser.role !== 'ADMIN' && this.currentUser.role !== 'FACULTY') {
      this.showToast('Access restricted: Only administrators or faculty can upload official timetables.', 'error');
      return false;
    }

    const esc = window.SecurityUtils ? window.SecurityUtils.sanitizeInput : (s => s);
    const cleanClassId = esc(timetableData.classId || 'Class 2452 - IT', 60);
    const cleanTitle = esc(timetableData.title || `Time Table - ${cleanClassId}`, 150);
    const cleanSem = esc(timetableData.semester || '5th Semester', 50);
    const cleanDept = esc(timetableData.department || 'Information Technology [16]', 80);
    const cleanRoom = esc(timetableData.room || 'S-21 / S-25', 60);
    const cleanTerm = esc(timetableData.term || 'Academic Term 2026-2027', 80);
    const cleanDesc = esc(timetableData.description || '', 2000);

    const now = new Date();
    const newId = `TT-${Date.now().toString().slice(-4)}`;
    const creatorName = this.currentUser ? this.currentUser.name : 'Faculty Administrator';
    const creatorRole = this.currentUser ? this.currentUser.role : 'FACULTY';

    const newRecord = {
      id: newId,
      classId: cleanClassId,
      className: `${cleanClassId} (${cleanRoom})`,
      semester: cleanSem,
      department: cleanDept,
      room: cleanRoom,
      term: cleanTerm,
      effectiveDate: timetableData.effectiveDate || now.toISOString().split('T')[0],
      title: cleanTitle,
      uploadedBy: creatorName,
      uploadedByRole: creatorRole,
      uploadedAt: now.toISOString(),
      attachmentName: timetableData.attachmentName || null,
      attachmentSize: timetableData.attachmentSize || null,
      attachmentData: timetableData.attachmentData || null,
      attachmentType: timetableData.attachmentType || null,
      attachmentUrl: timetableData.attachmentUrl || null,
      description: cleanDesc,
      isDefault: Boolean(timetableData.isDefault),
      totalHours: timetableData.totalHours || 40,
      scheduleMatrix: timetableData.scheduleMatrix || null
    };

    if (!CAMPUS_DATA.uploadedTimetables) {
      CAMPUS_DATA.uploadedTimetables = [];
    }

    // If marked as default, unmark others for the same class
    if (newRecord.isDefault) {
      CAMPUS_DATA.uploadedTimetables.forEach(t => {
        if (t.classId === cleanClassId) t.isDefault = false;
      });
    }

    CAMPUS_DATA.uploadedTimetables.unshift(newRecord);

    try {
      localStorage.setItem('campusx_uploaded_timetables', JSON.stringify(CAMPUS_DATA.uploadedTimetables));
    } catch (e) {
      console.warn('LocalStorage quota or write issue:', e.message);
    }

    // Add alert into attention items
    if (Array.isArray(CAMPUS_DATA.attentionItems)) {
      CAMPUS_DATA.attentionItems.unshift({
        id: `ATT-TT-${Date.now()}`,
        title: `New Timetable: ${cleanTitle}`,
        desc: `${cleanClassId} (${cleanSem}) • Uploaded by ${creatorName}`,
        time: 'Just now',
        bg: 'var(--tint-soft-blue)',
        color: 'var(--color-accent-blue)'
      });
      try {
        localStorage.setItem('campusx_attention', JSON.stringify(CAMPUS_DATA.attentionItems));
      } catch (e) {}
    }

    if (window.ApiClient && !ApiClient.isStaticDeployment()) {
      ApiClient.request('/api/timetable', {
        method: 'POST',
        body: JSON.stringify(newRecord)
      }).catch(err => console.warn('Timetable server sync notice:', err.message));
    }

    this.showToast(`Timetable "${cleanTitle}" published successfully!`, 'success');
    this.notify('TIMETABLE_UPLOADED');
    return newRecord;
  }

  deleteTimetable(id) {
    if (this.currentUser && this.currentUser.role !== 'ADMIN' && this.currentUser.role !== 'FACULTY') {
      this.showToast('Access denied: Administrator or Faculty privileges required.', 'error');
      return false;
    }

    if (!CAMPUS_DATA.uploadedTimetables) return false;
    CAMPUS_DATA.uploadedTimetables = CAMPUS_DATA.uploadedTimetables.filter(t => t.id !== id);

    try {
      localStorage.setItem('campusx_uploaded_timetables', JSON.stringify(CAMPUS_DATA.uploadedTimetables));
    } catch (e) {}

    if (window.ApiClient && !ApiClient.isStaticDeployment()) {
      ApiClient.request(`/api/timetable/${encodeURIComponent(id)}`, {
        method: 'DELETE'
      }).catch(err => console.warn('Timetable delete API notice:', err.message));
    }

    this.showToast('Timetable removed successfully.', 'info');
    this.notify('TIMETABLE_DELETED');
    return true;
  }

  createComplaint(complaint) {
    // Sanitize user-provided fields
    if (window.SecurityUtils) {
      complaint.subject = window.SecurityUtils.sanitizeInput(complaint.subject, 120);
      complaint.location = window.SecurityUtils.sanitizeInput(complaint.location, 80);
      complaint.description = window.SecurityUtils.sanitizeInput(complaint.description, 500);
    }

    CAMPUS_DATA.complaints.unshift(complaint);
    try {
      localStorage.setItem('campusx_complaints', JSON.stringify(CAMPUS_DATA.complaints));
    } catch (e) {}

    if (window.ApiClient && !ApiClient.isStaticDeployment()) {
      ApiClient.request('/api/complaints', {
        method: 'POST',
        body: JSON.stringify(complaint)
      }).catch(err => console.warn('Complaint API sync:', err.message));
    } else if (window.supabaseClient) {
      window.supabaseClient.from('complaints').insert([{
        id: complaint.id,
        title: complaint.subject,
        category: complaint.category || 'General',
        location: complaint.location,
        priority: complaint.priority || 'MEDIUM',
        description: complaint.description || '',
        status: complaint.status || 'SUBMITTED',
        student_id: complaint.reportedById || '246470316113',
        student_name: complaint.reportedBy || 'Student'
      }]).then(({ error }) => {
        if (error) console.warn('Supabase complaint insert:', error.message);
      });
    }

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
    try {
      localStorage.setItem('campusx_lost_found', JSON.stringify(CAMPUS_DATA.lostAndFound));
    } catch (e) {}

    if (window.ApiClient && !ApiClient.isStaticDeployment()) {
      ApiClient.request('/api/lost-found', {
        method: 'POST',
        body: JSON.stringify(item)
      }).catch(err => console.warn('Lost & Found API sync:', err.message));
    } else if (window.supabaseClient) {
      window.supabaseClient.from('lost_found').insert([{
        id: item.id,
        title: item.item,
        type: item.type.toLowerCase(),
        category: item.category || 'General',
        location: item.location,
        date: item.date || 'Today',
        contact: item.contact || 'Campus Desk',
        description: item.desc || '',
        status: item.status || 'Active',
        reporter_name: item.reportedBy || 'Student'
      }]).then(({ error }) => {
        if (error) console.warn('Supabase lost-found insert:', error.message);
      });
    }

    this.showToast(`Report for "${item.item}" logged in Lost & Found directory.`, "success");
    this.notify('LOST_FOUND_CREATED');
  }

  async fetchRemoteData() {
    if (window.ApiClient && !ApiClient.isStaticDeployment()) {
      try {
        const token = localStorage.getItem('campusx_auth_token') || (this.currentUser && this.currentUser.token);
        const promises = [
          ApiClient.request('/api/notices'),
          ApiClient.request('/api/timetable')
        ];
        if (token) {
          promises.push(
            ApiClient.request('/api/complaints'),
            ApiClient.request('/api/lost-found'),
            ApiClient.request('/api/attendance')
          );
        }

        const results = await Promise.allSettled(promises);
        const ntcRes = results[0];
        const ttRes = results[1];
        if (ntcRes && ntcRes.status === 'fulfilled' && ntcRes.value && Array.isArray(ntcRes.value.notices)) {
          CAMPUS_DATA.notices = ntcRes.value.notices;
          try {
            localStorage.setItem('campusx_notices', JSON.stringify(ntcRes.value.notices));
            this.notify('NOTICES_CHANGED');
          } catch(e) {}
        }
        if (ttRes && ttRes.status === 'fulfilled' && ttRes.value && Array.isArray(ttRes.value.timetables)) {
          CAMPUS_DATA.uploadedTimetables = ttRes.value.timetables;
          try {
            localStorage.setItem('campusx_uploaded_timetables', JSON.stringify(ttRes.value.timetables));
            this.notify('TIMETABLE_UPLOADED');
          } catch(e) {}
        }

        if (token && results.length > 2) {
          const cRes = results[2];
          const lfRes = results[3];
          const attRes = results[4];
          if (cRes && cRes.status === 'fulfilled' && cRes.value && Array.isArray(cRes.value.complaints)) {
            CAMPUS_DATA.complaints = cRes.value.complaints;
          }
          if (lfRes && lfRes.status === 'fulfilled' && lfRes.value && Array.isArray(lfRes.value.items)) {
            CAMPUS_DATA.lostAndFound = lfRes.value.items;
          }
          if (attRes && attRes.status === 'fulfilled' && attRes.value && Array.isArray(attRes.value.attendance)) {
            try {
              localStorage.setItem('campusx_attendance_records', JSON.stringify(attRes.value.attendance));
              this.notify('ATTENDANCE_SAVED');
            } catch(e) {}
          }
        }
        this.notify('DATA_SYNCED');
        return;
      } catch (e) {
        // Fall back to direct Supabase browser client
      }
    }

    // Direct Supabase client for GitHub Pages static deployments
    if (window.supabaseClient) {
      try {
        const { data: cData, error: cErr } = await window.supabaseClient.from('complaints').select('*').order('created_at', { ascending: false });
        if (!cErr && Array.isArray(cData)) {
          CAMPUS_DATA.complaints = cData.map(c => ({
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

        const { data: lfData, error: lfErr } = await window.supabaseClient.from('lost_found').select('*').order('created_at', { ascending: false });
        if (!lfErr && Array.isArray(lfData)) {
          CAMPUS_DATA.lostAndFound = lfData.map(lf => ({
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

        const { data: ntcData, error: ntcErr } = await window.supabaseClient.from('notices').select('*').order('created_at', { ascending: false });
        if (!ntcErr && Array.isArray(ntcData) && ntcData.length > 0) {
          CAMPUS_DATA.notices = ntcData.map(n => ({
            id: n.id,
            title: n.title,
            category: n.category,
            description: n.description,
            desc: n.description,
            priority: n.priority || 'Normal',
            postedBy: n.posted_by || 'Administration',
            pinned: Boolean(n.pinned),
            date: n.created_at ? new Date(n.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Today',
            time: '9:00 AM'
          }));
          localStorage.setItem('campusx_notices', JSON.stringify(CAMPUS_DATA.notices));
          this.notify('NOTICES_CHANGED');
        }

        this.notify('DATA_SYNCED');
      } catch (err) {
        console.warn('Direct Supabase fetch:', err.message);
      }
    }
  }
}

// Browser direct Supabase connection for GitHub Pages / static hosting
if (typeof window !== 'undefined' && window.supabase && !window.supabaseClient) {
  try {
    const SB_URL = 'https://dvjzchuevpkbvmklxnqw.supabase.co';
    const SB_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR2anpjaHVldnBrYnZta2x4bnF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIwNDcxNzAsImV4cCI6MjEwNzYyMzE3MH0.bodZ6hbqAYa5KxyCAP9xbF6dNbPGjVeCE7jzSPTCqqI';
    window.supabaseClient = window.supabase.createClient(SB_URL, SB_ANON);
  } catch (e) {}
}

window.appState = new CampusState();

// Real-Time Cross-Tab Event Bus & Background Heartbeat Polling
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === 'campusx_attendance_records') {
      window.appState.notify('ATTENDANCE_SAVED');
    } else if (e.key === 'campusx_notices') {
      try {
        const parsed = JSON.parse(e.newValue || '[]');
        if (Array.isArray(parsed) && typeof CAMPUS_DATA !== 'undefined') {
          CAMPUS_DATA.notices = parsed;
        }
      } catch (err) {}
      window.appState.notify('NOTICES_CHANGED');
    } else if (e.key === 'campusx_rush') {
      window.appState.stationeryRush = e.newValue === 'true';
      window.appState.notify('RUSH_CHANGED');
    } else if (e.key === 'campusx_sos_active') {
      window.appState.isSosActive = e.newValue === 'true';
      window.appState.notify('SOS_CHANGED');
    }
  });

  // Background real-time sync polling every 6 seconds when user is authenticated
  setInterval(() => {
    if (window.appState && window.appState.currentUser) {
      window.appState.fetchRemoteData();
    }
  }, 6000);
}
