/* ==========================================================
   Campus X AI - Master Application Orchestrator
   Role Dispatcher, Modal Engine, Navigation & Responsive Router
   ========================================================== */

class AppModal {
  static activeModal = null;

  static show({ title, content, confirmText = "Confirm", confirmClass = "btn-primary", onConfirm = null }) {
    AppModal.close();

    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop';
    backdrop.id = 'appModalBackdrop';
    backdrop.innerHTML = `
      <div class="modal-dialog">
        <div class="modal-header-bar">
          <h4>${title}</h4>
          <button style="font-size: 1.25rem; color: var(--text-muted); background: none; border: none; cursor: pointer;" onclick="AppModal.close()">✕</button>
        </div>
        <div class="modal-body-content">
          ${content}
        </div>
        <div class="modal-footer-bar">
          <button class="btn btn-secondary" onclick="AppModal.close()">Cancel</button>
          <button class="btn ${confirmClass}" id="modalConfirmBtn">${confirmText}</button>
        </div>
      </div>
    `;

    document.body.appendChild(backdrop);
    AppModal.activeModal = backdrop;

    const confirmBtn = document.getElementById('modalConfirmBtn');
    if (confirmBtn) {
      confirmBtn.addEventListener('click', () => {
        if (onConfirm) onConfirm();
        AppModal.close();
      });
    }
  }

  static close() {
    if (AppModal.activeModal) {
      AppModal.activeModal.remove();
      AppModal.activeModal = null;
    }
  }
}

// Master Application Renderer
class CampusApplication {
  constructor() {
    this.init();
  }

  init() {
    // Subscribe to state changes
    appState.subscribe((type) => {
      this.render();
    });

    // Initial render
    this.render();

    // Fetch remote records from Supabase via backend API
    if (window.appState && window.appState.fetchRemoteData) {
      window.appState.fetchRemoteData();
    }
  }

  render() {
    const root = document.getElementById('appRoot');
    if (!root) return;

    // PRE-LOGIN STATE
    if (!appState.currentUser) {
      if (appState.activeView === 'login') {
        AuthView.renderLogin(root);
      } else if (appState.activeView === 'register') {
        AuthView.renderRegister(root);
      } else if (appState.activeView === 'forgot-password') {
        AuthView.renderForgotPassword(root);
      } else if (appState.activeView === 'verify-otp') {
        AuthView.renderVerifyOtp(root);
      } else if (appState.activeView === 'reset-password') {
        AuthView.renderResetPassword(root);
      } else if (appState.activeView === 'reset-success') {
        AuthView.renderResetSuccess(root);
      } else {
        AuthView.renderLanding(root);
      }
      return;
    }

    // AUTHENTICATED ROLE WORKSPACE
    const user = appState.currentUser;
    const view = appState.activeView;

    root.innerHTML = `
      <div class="app-wrapper">
        <!-- OFF-CANVAS BACKDROP (Mobile Only) -->
        <div id="drawerBackdrop" class="drawer-backdrop" onclick="CampusApplication.closeMobileSidebar()"></div>

        <!-- ROLE-SPECIFIC SIDEBAR -->
        <div id="sidebarMount">
          ${this.getSidebarForRole(user.role, view)}
        </div>

        <!-- MAIN VIEWPORT -->
        <div class="main-viewport">
          <!-- TOPBAR -->
          <header class="app-topbar">
            <div class="flex items-center" style="gap: 0.5rem; flex: 1;">
              <!-- Mobile Hamburger Button (Strictly hidden on desktop via CSS) -->
              <button class="mobile-hamburger-btn" aria-label="Open Navigation Menu" onclick="CampusApplication.toggleMobileSidebar()">
                <svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
              </button>

              <div class="topbar-search-wrap">
                <svg class="topbar-search-icon" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                <input type="text" class="topbar-search-input" placeholder="Search subjects, notices, items..." oninput="CampusApplication.handleGlobalSearch(this.value)">
              </div>
            </div>

            <div class="topbar-actions">
              <!-- Emergency SOS Button -->
              <button class="topbar-sos-btn ${appState.isSosActive ? 'sos-pulsing' : ''}" 
                      aria-label="Emergency SOS Dispatcher" 
                      onclick="appState.setView('emergency')" 
                      title="${appState.isSosActive ? 'SOS ACTIVE - View Emergency Console' : 'Emergency SOS Console'}">
                <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                <span>${appState.isSosActive ? '🚨 SOS ACTIVE' : 'SOS'}</span>
              </button>

              <!-- Notifications Icon -->
              <button class="topbar-icon-btn" aria-label="Notifications" onclick="appState.showToast('You are all caught up on campus announcements.', 'info')">
                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                <span class="topbar-badge-dot"></span>
              </button>

              <!-- Profile / Sign Out Pill -->
              <div class="user-profile-menu">
                <div class="user-avatar-circle">${user.avatarInitials || 'CX'}</div>
                <div class="user-meta-text">
                  <span class="user-meta-name">${user.name}</span>
                  <span class="user-meta-sub">${user.roleTitle.split('(')[0]}</span>
                </div>
                <button class="btn btn-secondary" style="padding: 0.25rem 0.55rem; font-size: 0.72rem; margin-left: 0.25rem;" onclick="event.stopPropagation(); appState.logout();">
                  Sign Out
                </button>
              </div>
            </div>
          </header>

          <!-- ACTIVE SOS EMERGENCY BANNER -->
          ${appState.isSosActive ? `
            <div class="emergency-active-top-banner">
              <div class="flex items-center gap-2" style="font-weight: 800; font-size: 0.86rem;">
                <span class="status-dot-pulse" style="background: #ffffff; box-shadow: 0 0 10px #ffffff;"></span>
                <span>🚨 EMERGENCY SOS ACTIVE — Security & Medical Teams Dispatched to Tapi IT Building</span>
              </div>
              <div class="flex items-center gap-2">
                <button class="btn btn-secondary" style="padding: 0.25rem 0.65rem; font-size: 0.74rem; background: #ffffff; color: #b91c1c; font-weight: 700;" onclick="appState.setView('emergency')">
                  Open Console
                </button>
                <button class="btn" style="padding: 0.25rem 0.65rem; font-size: 0.74rem; background: #7f1d1d; color: #ffffff; border: 1px solid #fca5a5; font-weight: 700;" onclick="appState.cancelSos()">
                  Cancel SOS
                </button>
              </div>
            </div>
          ` : ''}

          <!-- VIEW CONTAINER -->
          <main class="dashboard-content" id="viewContainer" style="padding-top: 1.5rem;">
            <!-- Rendered by Router below -->
          </main>
        </div>

        <!-- MOBILE BOTTOM NAVIGATION (Section 4: Hidden on Desktop via CSS) -->
        <nav class="mobile-bottom-nav">
          <a href="javascript:void(0)" onclick="appState.setView('dashboard'); CampusApplication.closeMobileSidebar();" class="mobile-nav-link ${view === 'dashboard' || view === 'home' ? 'active' : ''}">
            <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>
            <span>Home</span>
          </a>
          <a href="javascript:void(0)" onclick="appState.setView('timetable'); CampusApplication.closeMobileSidebar();" class="mobile-nav-link ${view === 'timetable' ? 'active' : ''}">
            <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            <span>Timetable</span>
          </a>
          <a href="javascript:void(0)" onclick="appState.setView('stationery'); CampusApplication.closeMobileSidebar();" class="mobile-nav-link ${view === 'stationery' ? 'active' : ''}">
            <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>
            <span>Stationery</span>
          </a>
          <a href="javascript:void(0)" onclick="appState.setView('notices'); CampusApplication.closeMobileSidebar();" class="mobile-nav-link ${view === 'notices' ? 'active' : ''}">
            <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
            <span>Notices</span>
          </a>
          <a href="javascript:void(0)" onclick="CampusApplication.toggleMobileSidebar();" class="mobile-nav-link">
            <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            <span>More</span>
          </a>
        </nav>
      </div>
    `;

    // Render active view into #viewContainer
    const viewContainer = document.getElementById('viewContainer');
    this.renderViewContent(view, user, viewContainer);
  }

  static toggleMobileSidebar() {
    const mount = document.getElementById('sidebarMount');
    const backdrop = document.getElementById('drawerBackdrop');
    if (mount) mount.classList.toggle('open');
    if (backdrop) backdrop.classList.toggle('active');
  }

  static closeMobileSidebar() {
    const mount = document.getElementById('sidebarMount');
    const backdrop = document.getElementById('drawerBackdrop');
    if (mount) mount.classList.remove('open');
    if (backdrop) backdrop.classList.remove('active');
  }

  getSidebarForRole(role, activeTab) {
    if (role === 'STUDENT') return StudentView.renderSidebar(activeTab);
    if (role === 'FACULTY') return FacultyView.renderSidebar(activeTab);
    if (role === 'ADMIN') return AdminView.renderSidebar(activeTab);
    if (role === 'STATIONERY_OPERATOR') return StationeryView.renderSidebar(activeTab);
    return StudentView.renderSidebar(activeTab);
  }

  renderViewContent(view, user, container) {
    if (!container) return;

    // Trigger subtle smooth page transition
    container.classList.remove('page-transition-enter');
    void container.offsetWidth; // force reflow
    container.classList.add('page-transition-enter');

    switch (view) {
      case 'dashboard':
      case 'home':
        if (user.role === 'STUDENT') StudentView.renderDashboard(container);
        else if (user.role === 'FACULTY') FacultyView.renderDashboard(container);
        else if (user.role === 'ADMIN') AdminView.renderDashboard(container);
        else if (user.role === 'STATIONERY_OPERATOR') StationeryView.renderDashboard(container);
        break;

      case 'stationery':
        StationeryView.renderDashboard(container);
        break;

      case 'lost-found':
        LostFoundView.render(container);
        break;

      case 'complaints':
        ComplaintsView.render(container);
        break;

      case 'attendance-mark':
        FacultyView.renderAttendanceMarking(container);
        break;

      case 'attendance':
      case 'attendance-overview':
        AcademicsView.renderAttendance(container);
        break;

      case 'timetable':
        AcademicsView.renderTimetable(container);
        break;

      case 'ai-chat':
        AiChatView.render(container);
        break;

      case 'emergency':
      case 'sos':
        EmergencyView.render(container);
        break;

      case 'notices':
        CampusApplication.renderNoticesView(container);
        break;

      case 'examinations':
        container.innerHTML = `
          <div style="display: flex; flex-direction: column; gap: 1.5rem;">
            <div>
              <h2 style="font-size: 2rem; font-weight: 800; color: var(--text-primary);">Examinations & Assessment</h2>
              <p style="font-size: 0.9rem; color: var(--text-secondary);">Curriculum mid-terms, practical assessments, and GTU hall tickets.</p>
            </div>
            <div class="table-responsive-card">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Subject Code</th>
                    <th>Subject Name</th>
                    <th>Exam Date</th>
                    <th>Session</th>
                    <th>Room</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>DI-IT-501</td>
                    <td style="font-weight: 700;">Advanced Java Programming</td>
                    <td>18 Sep 2026</td>
                    <td>10:30 AM - 1:00 PM</td>
                    <td>Exam Hall 204</td>
                    <td><span class="badge badge-available">Confirmed</span></td>
                  </tr>
                  <tr>
                    <td>DI-IT-502</td>
                    <td style="font-weight: 700;">Database Management Systems</td>
                    <td>21 Sep 2026</td>
                    <td>10:30 AM - 1:00 PM</td>
                    <td>Exam Hall 205</td>
                    <td><span class="badge badge-available">Confirmed</span></td>
                  </tr>
                  <tr>
                    <td>DI-IT-503</td>
                    <td style="font-weight: 700;">Computer Networks (GTU)</td>
                    <td>24 Sep 2026</td>
                    <td>2:00 PM - 4:30 PM</td>
                    <td>Auditorium A</td>
                    <td><span class="badge badge-low-stock">Seat Allotment Pending</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        `;
        break;

      case 'events':
        container.innerHTML = `
          <div style="display: flex; flex-direction: column; gap: 1.5rem;">
            <div>
              <h2 style="font-size: 2rem; font-weight: 800; color: var(--text-primary);">Campus Events</h2>
              <p style="font-size: 0.9rem; color: var(--text-secondary);">Technical fests, cultural celebrations, and departmental seminars.</p>
            </div>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.25rem;">
              <div class="card-editorial">
                <span class="badge badge-blue" style="margin-bottom: 0.5rem;">Technical</span>
                <h3 style="font-size: 1.15rem; font-weight: 700; margin-bottom: 0.35rem;">Ignite Hackathon 2026</h3>
                <p style="font-size: 0.84rem; color: var(--text-secondary); margin-bottom: 0.75rem;">24-hour campus hackathon solving regional engineering challenges with AI and IoT.</p>
                <div style="font-size: 0.78rem; color: var(--text-muted);">Date: 25 Sep 2026 • IT Dept Lab</div>
              </div>
              <div class="card-editorial">
                <span class="badge badge-available" style="margin-bottom: 0.5rem;">Industry</span>
                <h3 style="font-size: 1.15rem; font-weight: 700; margin-bottom: 0.35rem;">Industry Expert Seminar: Cloud Architectures</h3>
                <p style="font-size: 0.84rem; color: var(--text-secondary); margin-bottom: 0.75rem;">Guest talk by senior engineering lead from L&T Technology Services.</p>
                <div style="font-size: 0.78rem; color: var(--text-muted);">Date: 29 Sep 2026 • Seminar Hall 1</div>
              </div>
            </div>
          </div>
        `;
        break;

      case 'profile':
        container.innerHTML = `
          <div style="display: flex; flex-direction: column; gap: 1.5rem; max-width: 680px;">
            <div>
              <h2 style="font-size: 2rem; font-weight: 800; color: var(--text-primary);">Member Profile</h2>
              <p style="font-size: 0.9rem; color: var(--text-secondary);">Institutional credentials & account details.</p>
            </div>
            <div class="card-editorial" style="padding: 1.75rem;">
              <div class="flex items-center gap-3" style="margin-bottom: 1.5rem;">
                <div class="user-avatar-circle" style="width: 58px; height: 58px; font-size: 1.3rem;">${user.avatarInitials || 'CX'}</div>
                <div>
                  <h3 style="font-size: 1.25rem; font-weight: 800;">${user.name}</h3>
                  <div style="font-size: 0.85rem; color: var(--text-secondary);">${user.roleTitle}</div>
                  <div style="font-size: 0.75rem; color: var(--text-muted); font-family: monospace;">${user.email}</div>
                </div>
              </div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; border-top: 1px solid var(--border-subtle); padding-top: 1.25rem;">
                <div>
                  <div style="font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Department</div>
                  <div style="font-weight: 700; font-size: 0.95rem;">${user.department || 'Information Technology'}</div>
                </div>
                <div>
                  <div style="font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Institution</div>
                  <div style="font-weight: 700; font-size: 0.95rem;">Tapi Diploma Engineering College</div>
                </div>
              </div>
              <button class="btn btn-secondary" style="margin-top: 1.5rem;" onclick="appState.showToast('Profile sync request sent to Tapi registrar.', 'info')">
                Request Profile Update
              </button>
            </div>
          </div>
        `;
        break;

      case 'settings':
        container.innerHTML = `
          <div style="display: flex; flex-direction: column; gap: 1.5rem; max-width: 680px;">
            <div>
              <h2 style="font-size: 2rem; font-weight: 800; color: var(--text-primary);">Settings</h2>
              <p style="font-size: 0.9rem; color: var(--text-secondary);">Personal preferences & notification controls.</p>
            </div>
            <div class="card-editorial" style="padding: 1.5rem; display: flex; flex-direction: column; gap: 1.25rem;">
              <div class="flex items-center justify-between">
                <div>
                  <strong style="font-size: 0.92rem;">Push Notifications</strong>
                  <div style="font-size: 0.78rem; color: var(--text-muted);">Receive alerts for class timetable shifts and stationery rush status.</div>
                </div>
                <input type="checkbox" checked style="width: 20px; height: 20px; accent-color: var(--color-accent-blue);">
              </div>
              <div class="flex items-center justify-between" style="border-top: 1px solid var(--border-subtle); padding-top: 1rem;">
                <div>
                  <strong style="font-size: 0.92rem;">SMS Examination Alerts</strong>
                  <div style="font-size: 0.78rem; color: var(--text-muted);">GTU exam notifications sent directly to registered mobile phone.</div>
                </div>
                <input type="checkbox" checked style="width: 20px; height: 20px; accent-color: var(--color-accent-blue);">
              </div>
              <div class="flex items-center justify-between" style="border-top: 1px solid var(--border-subtle); padding-top: 1rem;">
                <div>
                  <strong style="font-size: 0.92rem;">Active Session</strong>
                  <div style="font-size: 0.78rem; color: var(--text-muted);">Logged in as ${user.email}</div>
                </div>
                <button class="btn btn-secondary" style="font-size: 0.78rem; padding: 0.35rem 0.75rem;" onclick="appState.setCurrentUser(null);">
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        `;
        break;

      default:
        container.innerHTML = `
          <div class="card-editorial" style="padding: 2.5rem; text-align: center;">
            <h3 style="font-size: 1.3rem; margin-bottom: 0.5rem; text-transform: capitalize;">${view.replace('-', ' ')}</h3>
            <p style="font-size: 0.88rem; color: var(--text-muted); max-width: 480px; margin: 0 auto 1.5rem auto;">
              Connected to Tapi Diploma Engineering College campus services. Ready for institutional synchronization.
            </p>
            <button class="btn btn-primary" onclick="appState.setView('dashboard')">
              Return to ${user.roleTitle.split('(')[0]} Dashboard
            </button>
          </div>
        `;
        break;
    }

    if (window.CampusMotion && window.CampusMotion.engine) {
      window.CampusMotion.engine.onRouteChanged();
    }
  }

  static handleGlobalSearch(query) {
    if (!query || query.length < 2) return;
    // Simulated quick search
  }

  static selectedNoticeFilter = 'All';
  static noticeSearchTerm = '';

  static renderNoticesView(container) {
    const isAdmin = appState.currentUser && appState.currentUser.role === 'ADMIN';
    const isFaculty = appState.currentUser && appState.currentUser.role === 'FACULTY';
    const canUpload = isAdmin || isFaculty;

    let notices = CAMPUS_DATA.notices || [];

    // Filter by Category
    if (CampusApplication.selectedNoticeFilter && CampusApplication.selectedNoticeFilter !== 'All') {
      const f = CampusApplication.selectedNoticeFilter.toLowerCase();
      notices = notices.filter(n => {
        const cat = (n.category || '').toLowerCase();
        const prio = (n.priority || '').toLowerCase();
        if (f === 'urgent') return prio === 'urgent' || prio === 'high';
        return cat.includes(f);
      });
    }

    // Filter by Search Query
    if (CampusApplication.noticeSearchTerm) {
      const q = CampusApplication.noticeSearchTerm.toLowerCase();
      notices = notices.filter(n => 
        (n.title && n.title.toLowerCase().includes(q)) ||
        (n.description && n.description.toLowerCase().includes(q)) ||
        (n.desc && n.desc.toLowerCase().includes(q)) ||
        (n.category && n.category.toLowerCase().includes(q)) ||
        (n.department && n.department.toLowerCase().includes(q))
      );
    }

    const esc = window.SecurityUtils ? window.SecurityUtils.escapeHtml : (s => s);

    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 1.5rem;">
        
        <!-- HEADER -->
        <div class="flex items-center justify-between" style="flex-wrap: wrap; gap: 1rem;">
          <div>
            <div class="flex items-center gap-2" style="margin-bottom: 0.25rem;">
              <span class="badge badge-blue">Official Circulars</span>
              <span class="badge badge-green">● Real-Time Feed</span>
            </div>
            <h2 style="font-size: 2rem; font-weight: 800; color: var(--text-primary); margin: 0;">Campus Notices & Circulars</h2>
            <p style="font-size: 0.9rem; color: var(--text-secondary); margin-top: 0.2rem;">
              Authoritative announcements, GTU examination circulars, and departmental schedules.
            </p>
          </div>

          <div class="flex items-center gap-2">
            ${canUpload ? `
              <button class="btn btn-primary" onclick="AdminView.openNoticeModal()">
                <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                <span>Upload Notice</span>
              </button>
            ` : ''}
          </div>
        </div>

        <!-- FILTER & SEARCH BAR -->
        <div class="card-editorial" style="padding: 1rem 1.25rem;">
          <div class="flex items-center justify-between" style="flex-wrap: wrap; gap: 1rem;">
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
              ${['All', 'Academic', 'Examination', 'Event', 'Urgent'].map(tab => {
                const isActive = (CampusApplication.selectedNoticeFilter || 'All') === tab;
                return `
                  <button class="btn ${isActive ? 'btn-primary' : 'btn-secondary'}" 
                          style="padding: 0.35rem 0.8rem; font-size: 0.78rem; border-radius: 999px; ${isActive ? 'font-weight: 700;' : ''}" 
                          onclick="CampusApplication.setNoticeFilter('${tab}')">
                    ${tab === 'Urgent' ? '🚨 Urgent' : tab}
                  </button>
                `;
              }).join('')}
            </div>

            <div style="flex: 1; min-width: 220px; max-width: 380px;">
              <input type="text" class="form-input" placeholder="Search notices, exams, circulars..." 
                     value="${esc(CampusApplication.noticeSearchTerm || '')}"
                     oninput="CampusApplication.onNoticeSearch(this.value)">
            </div>
          </div>
        </div>

        <!-- NOTICES LIST -->
        <div style="display: flex; flex-direction: column; gap: 1rem;">
          ${notices.length === 0 ? `
            <div class="card-editorial" style="padding: 3rem 1rem; text-align: center; color: var(--text-muted);">
              <svg width="36" height="36" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" style="margin: 0 auto 0.75rem; display: block; color: var(--color-accent-blue);"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
              <h3 style="font-size: 1.15rem; font-weight: 700; color: var(--text-primary); margin: 0 0 0.35rem;">No circulars found</h3>
              <p style="font-size: 0.85rem; margin: 0;">No notices match the selected category or search keyword.</p>
              ${canUpload ? `
                <button class="btn btn-primary" style="margin-top: 1rem;" onclick="AdminView.openNoticeModal()">Upload First Notice</button>
              ` : ''}
            </div>
          ` : notices.map(ntc => {
            const isUrgent = (ntc.priority && (ntc.priority.toUpperCase() === 'URGENT' || ntc.priority.toUpperCase() === 'HIGH'));
            return `
              <div class="card-editorial" style="border-left: 4px solid ${isUrgent ? 'var(--color-error)' : 'var(--color-accent-blue)'}; padding: 1.5rem;">
                <div class="flex items-center justify-between" style="flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.5rem;">
                  <div class="flex items-center gap-2">
                    <span class="badge ${isUrgent ? 'badge-out-of-stock' : 'badge-blue'}">${esc(ntc.category || 'Circular')}</span>
                    ${ntc.pinned ? '<span class="badge badge-purple">📌 Pinned</span>' : ''}
                    <span style="font-size: 0.76rem; color: var(--text-muted);">${esc(ntc.date || 'Today')} ${ntc.time ? `• ${esc(ntc.time)}` : ''}</span>
                  </div>

                  ${isAdmin ? `
                    <button class="btn btn-secondary" style="padding: 0.25rem 0.6rem; font-size: 0.74rem; color: var(--color-error);" onclick="AdminView.deleteNotice('${esc(ntc.id)}')">
                      Delete
                    </button>
                  ` : ''}
                </div>

                <h3 style="font-size: 1.25rem; font-weight: 800; color: var(--text-primary); margin: 0.2rem 0 0.5rem;">
                  ${esc(ntc.title)}
                </h3>

                <p style="font-size: 0.88rem; color: var(--text-secondary); line-height: 1.6; margin: 0.5rem 0 1rem;">
                  ${esc(ntc.description || ntc.desc || '')}
                </p>

                <div class="flex items-center justify-between" style="flex-wrap: wrap; gap: 0.75rem; padding-top: 0.75rem; border-top: 1px solid var(--border-color); font-size: 0.78rem; color: var(--text-muted);">
                  <div>
                    Department: <strong>${esc(ntc.department || 'All Departments')}</strong> • Posted by: <strong>${esc(ntc.postedBy || 'Campus Administration')}</strong>
                  </div>
                  ${ntc.attachmentName ? `
                    <a href="javascript:void(0)" onclick="appState.showToast('Opening circular document: ${esc(ntc.attachmentName)}', 'info')" class="action-pill action-pill-blue" style="padding: 0.25rem 0.65rem; font-size: 0.75rem;">
                      <span>📎 ${esc(ntc.attachmentName)}</span>
                    </a>
                  ` : ''}
                </div>
              </div>
            `;
          }).join('')}
        </div>

      </div>
    `;
  }

  static setNoticeFilter(category) {
    CampusApplication.selectedNoticeFilter = category;
    const container = document.getElementById('viewContainer') || document.getElementById('view-container');
    if (container) CampusApplication.renderNoticesView(container);
  }

  static onNoticeSearch(term) {
    CampusApplication.noticeSearchTerm = term.trim();
    const container = document.getElementById('viewContainer') || document.getElementById('view-container');
    if (container) CampusApplication.renderNoticesView(container);
  }
}

window.CampusApplication = CampusApplication;

// ==========================================================
// Button Loading State Feedback
// ==========================================================
window.simulateButtonAction = function(btn, loadingText = "Submitting...", successText = "Submitted", actionPromise = null) {
  if (!btn || btn.disabled) return Promise.resolve();
  const originalHtml = btn.innerHTML;
  btn.disabled = true;
  btn.classList.add('btn-loading');
  btn.innerHTML = `<span class="btn-spinner"></span> <span>${loadingText}</span>`;

  const promise = actionPromise || new Promise(res => setTimeout(res, 600));

  return promise.then(() => {
    btn.innerHTML = `✓ <span>${successText}</span>`;
    setTimeout(() => {
      btn.innerHTML = originalHtml;
      btn.disabled = false;
      btn.classList.remove('btn-loading');
    }, 700);
  }).catch(() => {
    btn.innerHTML = originalHtml;
    btn.disabled = false;
    btn.classList.remove('btn-loading');
    appState.showToast('Something went wrong. Please try again.', 'error');
  });
};

// ==========================================================
// Android Hardware Back Button & Keyboard Handlers
// ==========================================================
function initNavigationHandlers() {
  if (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.App) {
    window.Capacitor.Plugins.App.addListener('backButton', () => {
      // 1. Modal open? Close modal
      if (AppModal.activeModal) {
        AppModal.close();
        return;
      }
      // 2. Mobile drawer open? Close drawer
      const mount = document.getElementById('sidebarMount');
      if (mount && mount.classList.contains('open')) {
        CampusApplication.closeMobileSidebar();
        return;
      }
      // 3. Nested view? Return to dashboard
      if (appState.activeView !== 'dashboard' && appState.activeView !== 'home') {
        appState.setView('dashboard');
        return;
      }
      // 4. Root view? Exit application
      window.Capacitor.Plugins.App.exitApp();
    });
  }

  // Keyboard Escape listener
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (AppModal.activeModal) {
        AppModal.close();
        return;
      }
      const mount = document.getElementById('sidebarMount');
      if (mount && mount.classList.contains('open')) {
        CampusApplication.closeMobileSidebar();
      }
    }
  });
}

// ==========================================================
// Campus X Startup Splash Screen Controller
// ==========================================================
function initSplashScreen() {
  const splash = document.getElementById('splashScreen');
  const statusEl = document.getElementById('splashStatusText');
  if (!splash) return;

  const messages = [
    'Preparing your campus...',
    'Loading timetable...',
    'Checking notifications...',
    'Preparing your dashboard...',
    'Almost ready...'
  ];

  let step = 0;
  const interval = setInterval(() => {
    step++;
    if (statusEl && messages[step]) {
      statusEl.style.opacity = '0';
      setTimeout(() => {
        if (statusEl && messages[step]) {
          statusEl.textContent = messages[step];
          statusEl.style.opacity = '1';
        }
      }, 70);
    }

    if (step >= messages.length - 1) {
      clearInterval(interval);
      setTimeout(() => {
        splash.classList.add('fade-out');
        setTimeout(() => {
          if (splash.parentNode) splash.parentNode.removeChild(splash);
        }, 400);
      }, 300);
    }
  }, 200);
}

function initCampusApp() {
  if (!window.appInstance) {
    window.appInstance = new CampusApplication();
    initNavigationHandlers();
    initSplashScreen();
    if (window.CampusMotion && window.CampusMotion.engine) {
      window.CampusMotion.engine.init();
    }
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCampusApp);
} else {
  initCampusApp();
}

