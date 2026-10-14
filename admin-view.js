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

    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 1.5rem;">

        <!-- ADMIN HEADER (Section 23) -->
        <div class="card-editorial" style="padding: 2rem;">
          <span class="sidebar-role-indicator" style="color: var(--color-accent-blue); background: var(--tint-soft-blue); margin-bottom: 0.5rem;">
            Tapi Central Admin Hub
          </span>
          <h2 style="font-size: 2.2rem; font-weight: 800; color: var(--text-primary); margin: 0.25rem 0;">Campus overview</h2>
          <p style="font-size: 0.95rem; color: var(--text-secondary);">Everything important, at a glance.</p>
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
            <div style="font-size: 1.75rem; font-weight: 800; color: var(--color-warning); margin-top: 0.2rem;">4</div>
            <div style="font-size: 0.75rem; color: var(--color-warning); font-weight: 600;">Avg dispatch: 1.4 hrs</div>
          </div>

          <div class="card-editorial" style="padding: 1.25rem;">
            <span style="font-size: 0.72rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted);">Low Stock Items</span>
            <div style="font-size: 1.75rem; font-weight: 800; color: var(--color-error); margin-top: 0.2rem;">2</div>
            <div style="font-size: 0.75rem; color: var(--color-error); font-weight: 600;">Central Stationery Store</div>
          </div>

          <div class="card-editorial" style="padding: 1.25rem;">
            <span style="font-size: 0.72rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted);">Campus Infrastructure</span>
            <div style="font-size: 1.75rem; font-weight: 800; color: var(--color-success); margin-top: 0.2rem;">98.5%</div>
            <div style="font-size: 0.75rem; color: var(--color-success); font-weight: 600;">All facilities active</div>
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
              ${CAMPUS_DATA.complaints.map(t => `
                <div style="padding: 0.75rem; border-radius: var(--radius-md); border: 1px solid var(--border-subtle); background: var(--bg-surface-subtle);">
                  <div class="flex items-center justify-between" style="margin-bottom: 0.25rem;">
                    <span style="font-family: monospace; font-size: 0.75rem; color: var(--color-accent-blue); font-weight: 700;">${t.id}</span>
                    <span class="badge ${t.status === 'RESOLVED' ? 'badge-available' : 'badge-low-stock'}">${t.status}</span>
                  </div>
                  <div style="font-weight: 700; font-size: 0.88rem;">${t.subject}</div>
                  <div style="font-size: 0.76rem; color: var(--text-muted); margin-top: 0.15rem;">
                    ${t.location} • Assigned: ${t.assignedTo}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- STATIONERY & INVENTORY ALERTS -->
          <div class="card-editorial flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between" style="margin-bottom: 1.25rem;">
                <h3 style="font-size: 1.15rem; font-weight: 700;">Inventory Threshold Alerts</h3>
                <span class="badge badge-low-stock">Central Store</span>
              </div>

              <div style="display: flex; flex-direction: column; gap: 0.85rem;">
                <div style="padding: 0.75rem; background: #FDF2F2; border: 1px solid #FECACA; border-radius: var(--radius-md);">
                  <div class="flex justify-between items-center">
                    <strong style="color: #991B1B; font-size: 0.88rem;">Engineering Drawing Sheet A2</strong>
                    <span class="badge badge-out-of-stock">0 Remaining</span>
                  </div>
                  <div style="font-size: 0.76rem; color: #7F1D1D; margin-top: 0.25rem;">
                    Minimum threshold: 40 units. AI predicted monthly demand: 250 sheets.
                  </div>
                </div>

                <div style="padding: 0.75rem; background: var(--tint-soft-beige); border: 1px solid #FED7AA; border-radius: var(--radius-md);">
                  <div class="flex justify-between items-center">
                    <strong style="color: #9A3412; font-size: 0.88rem;">Data Science A4 Spiral Lab Journal</strong>
                    <span class="badge badge-low-stock">14 Remaining</span>
                  </div>
                  <div style="font-size: 0.76rem; color: #7C2D12; margin-top: 0.25rem;">
                    Minimum threshold: 25 units. Semester 5 lab evaluations begin next week.
                  </div>
                </div>
              </div>
            </div>

            <div style="margin-top: 1.5rem; display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 0.78rem; color: var(--text-muted);">Operator: Ramesh Bhai Patel</span>
              <button class="btn btn-secondary" onclick="appState.setView('stationery')">Inspect Inventory ERP</button>
            </div>
          </div>

        </div>

      </div>
    `;
  }
}
