/* ==========================================================
   Campus X AI - Administrator Workspace View
   Centralized Operational Dashboard & Support Dispatch
   ========================================================== */

class AdminView {
  static renderSidebar(activeTab = 'home') {
    return `
      <aside class="app-sidebar">
        <div class="sidebar-brand-box">
          <div class="sidebar-title">Campus X</div>
          <div class="sidebar-tagline">Everything campus, in one place.</div>
          <span class="sidebar-role-indicator">Administrator</span>
        </div>

        <nav class="sidebar-menu-list">
          <a href="javascript:void(0)" onclick="appState.setView('dashboard')" class="sidebar-item-link ${activeTab === 'home' || activeTab === 'dashboard' ? 'active' : ''}">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
            <span>Home</span>
          </a>

          <div class="sidebar-category-label">Academic Management</div>
          <a href="javascript:void(0)" onclick="appState.setView('attendance-overview')" class="sidebar-item-link ${activeTab === 'attendance-overview' ? 'active' : ''}">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            <span>Attendance</span>
          </a>
          <a href="javascript:void(0)" onclick="appState.setView('timetable')" class="sidebar-item-link ${activeTab === 'timetable' ? 'active' : ''}">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            <span>Timetable</span>
          </a>
          <a href="javascript:void(0)" onclick="appState.setView('examinations')" class="sidebar-item-link ${activeTab === 'examinations' ? 'active' : ''}">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
            <span>Examinations</span>
          </a>

          <div class="sidebar-category-label">Campus Management</div>
          <a href="javascript:void(0)" onclick="appState.setView('stationery')" class="sidebar-item-link ${activeTab === 'stationery' ? 'active' : ''}">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>
            <span>Stationery</span>
            ${appState.stationeryRush ? '<span class="badge badge-out-of-stock" style="margin-left: auto;">Rush Active</span>' : ''}
          </a>
          <a href="javascript:void(0)" onclick="appState.setView('facilities')" class="sidebar-item-link ${activeTab === 'facilities' ? 'active' : ''}">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
            <span>Facilities</span>
          </a>
          <a href="javascript:void(0)" onclick="appState.setView('hostel')" class="sidebar-item-link ${activeTab === 'hostel' ? 'active' : ''}">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>
            <span>Hostel</span>
          </a>
          <a href="javascript:void(0)" onclick="appState.setView('lost-found')" class="sidebar-item-link ${activeTab === 'lost-found' ? 'active' : ''}">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <span>Lost & Found</span>
          </a>

          <div class="sidebar-category-label">Communication</div>
          <a href="javascript:void(0)" onclick="appState.setView('notices')" class="sidebar-item-link ${activeTab === 'notices' ? 'active' : ''}">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
            <span>Notices</span>
          </a>
          <a href="javascript:void(0)" onclick="appState.setView('events')" class="sidebar-item-link ${activeTab === 'events' ? 'active' : ''}">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
            <span>Events</span>
          </a>

          <div class="sidebar-category-label">Support</div>
          <a href="javascript:void(0)" onclick="appState.setView('emergency')" class="sidebar-item-link ${activeTab === 'emergency' ? 'active' : ''} ${appState.isSosActive ? 'sidebar-item-sos-active' : ''}">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
            <span style="font-weight: 700; color: #dc2626;">Emergency SOS</span>
            <span class="badge ${appState.isSosActive ? 'badge-out-of-stock' : 'badge-low-stock'}" style="margin-left: auto;">${appState.isSosActive ? 'ALERT' : '24/7'}</span>
          </a>
          <a href="javascript:void(0)" onclick="appState.setView('complaints')" class="sidebar-item-link ${activeTab === 'complaints' ? 'active' : ''}">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
            <span>Complaints</span>
            <span class="badge badge-low-stock" style="margin-left: auto;">4 Open</span>
          </a>

          <div class="sidebar-category-label">Intelligence</div>
          <a href="javascript:void(0)" onclick="appState.setView('analytics')" class="sidebar-item-link ${activeTab === 'analytics' ? 'active' : ''}">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
            <span>Analytics</span>
          </a>
          <a href="javascript:void(0)" onclick="appState.setView('ai-chat')" class="sidebar-item-link ${activeTab === 'ai-chat' ? 'active' : ''}">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3z"></path></svg>
            <span>Ask Campus X</span>
          </a>
          <a href="javascript:void(0)" onclick="appState.setView('reports')" class="sidebar-item-link ${activeTab === 'reports' ? 'active' : ''}">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            <span>Reports</span>
          </a>
          <a href="javascript:void(0)" onclick="appState.setView('settings')" class="sidebar-item-link ${activeTab === 'settings' ? 'active' : ''}">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
            <span>Settings</span>
          </a>
        </nav>

        <div class="sidebar-footer-note">
          <div class="sidebar-footer-quote">Control, governance,<br>operational trust.</div>
          <div class="sidebar-footer-motto">Tapi Central Admin</div>
        </div>
      </aside>
    `;
  }

  static renderDashboard(container) {
    const isRush = appState.stationeryRush;

    const pendingComplaints = CAMPUS_DATA.complaints.filter(c => c.status !== 'RESOLVED');
    const lowStockItems = CAMPUS_DATA.stationeryInventory.filter(i => i.stock <= i.minStock);

    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 1.5rem;">

        <!-- ADMIN HEADER (Section 23) -->
        <div class="card-editorial" style="padding: 2rem;">
          <div class="flex items-center justify-between" style="flex-wrap: wrap; gap: 1rem;">
            <div>
              <span class="sidebar-role-indicator" style="color: var(--color-accent-blue); background: var(--tint-soft-blue); margin-bottom: 0.5rem;">
                Tapi Central Admin Hub
              </span>
              <h2 style="font-size: 2.2rem; font-weight: 800; color: var(--text-primary); margin: 0.25rem 0;">Campus overview</h2>
              <p style="font-size: 0.95rem; color: var(--text-secondary); margin: 0;">Real-time operations, facilities status, attendance tracking, and support dispatch.</p>
            </div>
            <div class="flex items-center gap-2" style="flex-wrap: wrap;">
              <button class="btn btn-primary" onclick="AdminView.openNoticeModal()">
                <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                <span>Upload Notice</span>
              </button>
              <button class="btn btn-secondary" onclick="AcademicsView.openTimetableUploadModal()">
                <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                <span>Upload Timetable</span>
              </button>
              <button class="btn btn-secondary" onclick="appState.setView('attendance-overview')">
                <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                <span>Attendance Overview</span>
              </button>
            </div>
          </div>
        </div>

        <!-- 6 KEY METRICS (Section 23) -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem;">
          <div class="card-editorial" style="padding: 1.25rem;">
            <span style="font-size: 0.72rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted);">Active Students</span>
            <div style="font-size: 1.75rem; font-weight: 800; color: var(--text-primary); margin-top: 0.2rem;">1,248</div>
            <div style="font-size: 0.75rem; color: var(--color-success); font-weight: 600;">+32 vs last semester</div>
          </div>

          <div class="card-editorial" style="padding: 1.25rem;">
            <span style="font-size: 0.72rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted);">Faculty On Duty</span>
            <div style="font-size: 1.75rem; font-weight: 800; color: var(--text-primary); margin-top: 0.2rem;">86</div>
            <div style="font-size: 0.75rem; color: var(--color-accent-blue); font-weight: 600;">Full attendance today</div>
          </div>

          <div class="card-editorial" style="padding: 1.25rem;">
            <span style="font-size: 0.72rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted);">Today's Classes</span>
            <div style="font-size: 1.75rem; font-weight: 800; color: var(--text-primary); margin-top: 0.2rem;">42</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">Across 14 labs & halls</div>
          </div>

          <div class="card-editorial" style="padding: 1.25rem;">
            <span style="font-size: 0.72rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted);">Pending Complaints</span>
            <div style="font-size: 1.75rem; font-weight: 800; color: ${pendingComplaints.length > 0 ? 'var(--color-warning)' : 'var(--color-success)'}; margin-top: 0.2rem;">
              ${pendingComplaints.length}
            </div>
            <div style="font-size: 0.75rem; color: ${pendingComplaints.length > 0 ? 'var(--color-warning)' : 'var(--color-success)'}; font-weight: 600;">
              ${pendingComplaints.length > 0 ? `${pendingComplaints.length} tickets require dispatch` : 'All tickets resolved'}
            </div>
          </div>

          <div class="card-editorial" style="padding: 1.25rem;">
            <span style="font-size: 0.72rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted);">Campus Notices</span>
            <div style="font-size: 1.75rem; font-weight: 800; color: var(--color-accent-blue); margin-top: 0.2rem;">${(CAMPUS_DATA.notices || []).length}</div>
            <div style="font-size: 0.75rem; color: var(--color-accent-blue); font-weight: 600;">Active circulars posted</div>
          </div>

          <div class="card-editorial" style="padding: 1.25rem;">
            <span style="font-size: 0.72rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted);">Low Stock Items</span>
            <div style="font-size: 1.75rem; font-weight: 800; color: ${lowStockItems.length > 0 ? 'var(--color-error)' : 'var(--color-success)'}; margin-top: 0.2rem;">
              ${lowStockItems.length}
            </div>
            <div style="font-size: 0.75rem; color: ${lowStockItems.length > 0 ? 'var(--color-error)' : 'var(--color-success)'}; font-weight: 600;">
              ${lowStockItems.length > 0 ? 'Requires store replenishment' : 'Store adequately stocked'}
            </div>
          </div>
        </div>

        <!-- 2-COLUMN SPLIT: COMPLAINT DISPATCH & INVENTORY ALERTS -->
        <div class="middle-split-grid">
          
          <!-- PENDING COMPLAINTS / MAINTENANCE DISPATCH -->
          <div class="card-editorial">
            <div class="flex items-center justify-between" style="margin-bottom: 1.25rem;">
              <h3 style="font-size: 1.15rem; font-weight: 700;">Campus Grievance Dispatch</h3>
              <a href="javascript:void(0)" onclick="appState.setView('complaints')" style="font-size: 0.8rem; font-weight: 600;">View All &rarr;</a>
            </div>

            <div style="display: flex; flex-direction: column; gap: 0.75rem;">
              ${CAMPUS_DATA.complaints.length === 0 ? `
                <div style="padding: 2rem 1rem; text-align: center; color: var(--text-muted);">
                  <div style="width: 40px; height: 40px; margin: 0 auto 0.5rem; border-radius: 50%; background: var(--bg-surface-subtle); display: flex; align-items: center; justify-content: center; color: var(--color-success);">
                    <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                  </div>
                  <div style="font-weight: 700; color: var(--text-primary); font-size: 0.92rem;">All Grievances Resolved</div>
                  <div style="font-size: 0.8rem; margin-top: 0.2rem;">No pending campus maintenance or infrastructure complaints.</div>
                </div>
              ` : CAMPUS_DATA.complaints.map(t => {
                const esc = window.SecurityUtils ? window.SecurityUtils.escapeHtml : (s => s);
                return `
                <div style="padding: 0.75rem; border-radius: var(--radius-md); border: 1px solid var(--border-subtle); background: var(--bg-surface-subtle);">
                  <div class="flex items-center justify-between" style="margin-bottom: 0.25rem;">
                    <span style="font-family: monospace; font-size: 0.75rem; color: var(--color-accent-blue); font-weight: 700;">${esc(t.id)}</span>
                    <span class="badge ${t.status === 'RESOLVED' ? 'badge-available' : 'badge-low-stock'}">${esc(t.status)}</span>
                  </div>
                  <div style="font-weight: 700; font-size: 0.88rem;">${esc(t.subject)}</div>
                  <div style="font-size: 0.76rem; color: var(--text-muted); margin-top: 0.15rem;">
                    ${esc(t.location)} • Assigned: ${esc(t.assignedTo || 'Dispatch Team')}
                  </div>
                </div>
              `;}).join('')}
            </div>
          </div>

          <!-- STATIONERY & INVENTORY ALERTS -->
          <div class="card-editorial flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between" style="margin-bottom: 1.25rem;">
                <h3 style="font-size: 1.15rem; font-weight: 700;">Inventory Threshold Alerts</h3>
                <span class="badge ${lowStockItems.length > 0 ? 'badge-low-stock' : 'badge-available'}">
                  ${lowStockItems.length > 0 ? `${lowStockItems.length} Low Stock` : 'All Stocked'}
                </span>
              </div>

              <div style="display: flex; flex-direction: column; gap: 0.85rem;">
                ${lowStockItems.length === 0 ? `
                  <div style="padding: 2rem 1rem; text-align: center; color: var(--text-muted);">
                    <div style="width: 40px; height: 40px; margin: 0 auto 0.5rem; border-radius: 50%; background: var(--bg-surface-subtle); display: flex; align-items: center; justify-content: center; color: var(--color-success);">
                      <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                    </div>
                    <div style="font-weight: 700; color: var(--text-primary); font-size: 0.92rem;">Inventory Levels Nominal</div>
                    <div style="font-size: 0.8rem; margin-top: 0.2rem;">All stationery items are stocked above their reorder thresholds.</div>
                  </div>
                ` : lowStockItems.map(item => {
                  const esc = window.SecurityUtils ? window.SecurityUtils.escapeHtml : (s => s);
                  const isOut = item.stock === 0;
                  return `
                  <div style="padding: 0.75rem; background: ${isOut ? '#FDF2F2' : 'var(--tint-soft-beige)'}; border: 1px solid ${isOut ? '#FECACA' : '#FED7AA'}; border-radius: var(--radius-md);">
                    <div class="flex justify-between items-center">
                      <strong style="color: ${isOut ? '#991B1B' : '#9A3412'}; font-size: 0.88rem;">${esc(item.name)}</strong>
                      <span class="badge ${isOut ? 'badge-out-of-stock' : 'badge-low-stock'}">${item.stock} ${esc(item.unit || 'units')} Remaining</span>
                    </div>
                    <div style="font-size: 0.76rem; color: ${isOut ? '#7F1D1D' : '#7C2D12'}; margin-top: 0.25rem;">
                      Category: ${esc(item.category)} • Minimum threshold: ${item.minStock} ${esc(item.unit || 'units')}.
                    </div>
                  </div>
                `;}).join('')}
              </div>
            </div>

            <div style="margin-top: 1.5rem; display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 0.78rem; color: var(--text-muted);">Central Store Manager</span>
              <button class="btn btn-secondary" onclick="appState.setView('stationery')">Inspect Inventory ERP</button>
            </div>
          </div>

        </div>

        <!-- CAMPUS NOTICES & CIRCULARS MANAGEMENT (Section 25) -->
        <div class="card-editorial" style="padding: 1.75rem;">
          <div class="flex items-center justify-between" style="margin-bottom: 1.25rem; flex-wrap: wrap; gap: 0.75rem;">
            <div>
              <div class="flex items-center gap-2">
                <h3 style="font-size: 1.25rem; font-weight: 800; margin: 0;">Campus Notice Board & Circulars</h3>
                <span class="badge badge-blue">${(CAMPUS_DATA.notices || []).length} Active</span>
              </div>
              <p style="font-size: 0.84rem; color: var(--text-secondary); margin-top: 0.2rem;">
                Official institutional circulars published to student, faculty, and operator dashboards.
              </p>
            </div>
            <div class="flex items-center gap-2">
              <button class="btn btn-primary" onclick="AdminView.openNoticeModal()">
                <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                <span>Upload Notice</span>
              </button>
              <button class="btn btn-secondary" onclick="appState.setView('notices')">
                <span>View Public Board &rarr;</span>
              </button>
            </div>
          </div>

          <div style="display: flex; flex-direction: column; gap: 0.85rem;">
            ${(!CAMPUS_DATA.notices || CAMPUS_DATA.notices.length === 0) ? `
              <div style="padding: 2.5rem 1rem; text-align: center; color: var(--text-muted);">
                <div style="font-weight: 700; font-size: 1rem; color: var(--text-primary);">No active circulars</div>
                <div style="font-size: 0.85rem; margin-top: 0.25rem;">Click "Upload Notice" above to publish institutional announcements.</div>
              </div>
            ` : CAMPUS_DATA.notices.map(ntc => {
              const esc = window.SecurityUtils ? window.SecurityUtils.escapeHtml : (s => s);
              const isUrgent = (ntc.priority && (ntc.priority.toUpperCase() === 'URGENT' || ntc.priority.toUpperCase() === 'HIGH'));
              return `
                <div style="padding: 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-color); background: var(--bg-surface-subtle); display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; flex-wrap: wrap;">
                  <div style="flex: 1; min-width: 250px;">
                    <div class="flex items-center gap-2" style="margin-bottom: 0.35rem;">
                      <span class="badge ${isUrgent ? 'badge-out-of-stock' : 'badge-blue'}">${esc(ntc.category || 'Circular')}</span>
                      ${ntc.pinned ? '<span class="badge badge-purple">📌 Pinned</span>' : ''}
                      <span style="font-size: 0.76rem; color: var(--text-muted);">${esc(ntc.date || 'Today')} ${ntc.time ? `• ${esc(ntc.time)}` : ''}</span>
                    </div>
                    <h4 style="font-size: 1.05rem; font-weight: 700; margin: 0.2rem 0; color: var(--text-primary);">${esc(ntc.title)}</h4>
                    <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5; margin: 0.35rem 0;">${esc(ntc.description || ntc.desc || '')}</p>
                    <div style="font-size: 0.76rem; color: var(--text-muted); margin-top: 0.4rem;">
                      Posted by: <strong>${esc(ntc.postedBy || 'Admin')}</strong> • Dept: <strong>${esc(ntc.department || 'All Departments')}</strong>
                      ${ntc.attachmentName ? ` • Attachment: <strong style="color: var(--color-accent-blue);">📎 ${esc(ntc.attachmentName)}</strong>` : ''}
                    </div>
                  </div>
                  <div class="flex items-center gap-2">
                    <button class="btn btn-secondary" style="padding: 0.35rem 0.75rem; font-size: 0.78rem; color: var(--color-error);" onclick="AdminView.deleteNotice('${esc(ntc.id)}')">
                      Delete Notice
                    </button>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

      </div>
    `;
  }

  // MODAL: UPLOAD CAMPUS NOTICE & CIRCULAR
  static openNoticeModal() {
    AppModal.show({
      title: "Upload Campus Notice & Official Circular",
      content: `
        <form id="adminNoticeForm" onsubmit="event.preventDefault(); AdminView.submitNotice();" style="display: flex; flex-direction: column; gap: 1rem;">
          <div class="form-group">
            <label class="form-label">Notice Title <span style="color: var(--color-error);">*</span></label>
            <input type="text" class="form-input" id="modalNoticeTitle" placeholder="e.g. GTU Mid-Term Examination Form Submission" required maxlength="150">
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
            <div class="form-group">
              <label class="form-label">Category</label>
              <select class="form-input" id="modalNoticeCategory">
                <option value="Academic Circular">Academic Circular</option>
                <option value="GTU Examination">GTU Examination</option>
                <option value="Campus Event">Campus Event / Symposium</option>
                <option value="Placement & Training">Placement & Career</option>
                <option value="Emergency Advisory">Emergency Advisory</option>
                <option value="Hostel & Facilities">Hostel & Facilities</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Priority</label>
              <select class="form-input" id="modalNoticePriority">
                <option value="Normal">Normal</option>
                <option value="High">High (Highlighted)</option>
                <option value="Urgent">Urgent / Critical Alert</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Target Department</label>
            <select class="form-input" id="modalNoticeDept">
              <option value="All Departments">All Departments (College-Wide)</option>
              <option value="Information Technology">Information Technology (IT Dept [16])</option>
              <option value="Computer Engineering">Computer Engineering</option>
              <option value="Mechanical Engineering">Mechanical Engineering</option>
              <option value="Electrical Engineering">Electrical Engineering</option>
              <option value="Civil Engineering">Civil Engineering</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Notice Body / Circular Details <span style="color: var(--color-error);">*</span></label>
            <textarea class="form-input" id="modalNoticeBody" rows="4" placeholder="Enter the official circular particulars, instructions, and deadlines for students and staff..." required maxlength="2500"></textarea>
          </div>

          <div class="form-group">
            <label class="form-label">Document Attachment (Optional)</label>
            <div style="display: flex; gap: 0.5rem; align-items: center;">
              <input type="text" class="form-input" id="modalNoticeAttachment" placeholder="e.g. gtu_circular_sem5_winter2026.pdf" maxlength="100">
            </div>
            <span style="font-size: 0.74rem; color: var(--text-muted); margin-top: 0.2rem; display: block;">
              Name of official PDF circular or link to downloadable institutional file.
            </span>
          </div>

          <div class="flex items-center gap-2" style="margin-top: 0.25rem;">
            <input type="checkbox" id="modalNoticePinned" style="width: 16px; height: 16px; accent-color: var(--color-primary); cursor: pointer;">
            <label for="modalNoticePinned" style="font-size: 0.85rem; font-weight: 600; cursor: pointer; color: var(--text-primary);">
              Pin this notice to the top of the Notice Board
            </label>
          </div>
        </form>
      `,
      confirmText: "Publish Notice",
      confirmClass: "btn-primary",
      onConfirm: () => {
        AdminView.submitNotice();
      }
    });
  }

  static submitNotice() {
    const titleEl = document.getElementById('modalNoticeTitle');
    const bodyEl = document.getElementById('modalNoticeBody');
    const categoryEl = document.getElementById('modalNoticeCategory');
    const priorityEl = document.getElementById('modalNoticePriority');
    const deptEl = document.getElementById('modalNoticeDept');
    const attachEl = document.getElementById('modalNoticeAttachment');
    const pinnedEl = document.getElementById('modalNoticePinned');

    if (!titleEl || !bodyEl) return;

    const title = titleEl.value.trim();
    const description = bodyEl.value.trim();

    if (!title) {
      appState.showToast('Please provide a notice title.', 'error');
      return;
    }
    if (!description) {
      appState.showToast('Please provide notice circular particulars.', 'error');
      return;
    }

    const category = categoryEl ? categoryEl.value : 'Academic Circular';
    const priority = priorityEl ? priorityEl.value : 'Normal';
    const department = deptEl ? deptEl.value : 'All Departments';
    const attachmentName = attachEl && attachEl.value.trim() ? attachEl.value.trim() : null;
    const pinned = pinnedEl ? pinnedEl.checked : false;

    appState.addNotice({
      title,
      category,
      priority,
      department,
      description,
      desc: description,
      attachmentName,
      pinned
    });

    // Re-render current view if on admin dashboard
    const container = document.getElementById('viewContainer') || document.getElementById('view-container');
    if (container && appState.activeView === 'dashboard') {
      AdminView.renderDashboard(container);
    } else if (container && appState.activeView === 'notices') {
      CampusApplication.renderNoticesView(container);
    }
  }

  static deleteNotice(noticeId) {
    if (!confirm('Are you sure you want to remove this notice from the campus board?')) {
      return;
    }
    appState.deleteNotice(noticeId);
    const container = document.getElementById('viewContainer') || document.getElementById('view-container');
    if (container && appState.activeView === 'dashboard') {
      AdminView.renderDashboard(container);
    } else if (container && appState.activeView === 'notices') {
      CampusApplication.renderNoticesView(container);
    }
  }
}
