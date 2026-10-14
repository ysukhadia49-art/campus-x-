/* ==========================================================
   Campus X AI - Student Workspace View
   Dedicated Student Sidebar & Student Dashboard
   ========================================================== */

class StudentView {
  static renderSidebar(activeTab = 'home') {
    return `
      <aside class="app-sidebar">
        <div class="sidebar-brand-box">
          <div style="display: flex; align-items: center; gap: 0.65rem; margin-bottom: 0.25rem;">
            <div style="width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;">
              <svg viewBox="0 0 120 120" width="26" height="26" fill="none">
                <polygon points="60,14 102,34 60,54 18,34" fill="#FFFFFF" stroke="#FFFFFF" stroke-width="2" stroke-linejoin="round"/>
                <polygon points="60,26 90,40 60,54 30,40" fill="#BAC7D5" opacity="0.95"/>
                <path d="M26,38 L24,58 M22,58 L26,58 L25,68 L23,68 Z" fill="#BAC7D5" stroke="#BAC7D5" stroke-width="2" stroke-linecap="round"/>
                <path d="M35,58 L54,77 L30,104 L44,104 L60,85 L76,104 L90,104 L66,77 L85,58 L71,58 L60,70 L49,58 Z" fill="#FFFFFF"/>
                <circle cx="60" cy="40" r="3.5" fill="#243447"/>
                <circle cx="30" cy="104" r="3.5" fill="#BAC7D5"/>
                <circle cx="90" cy="104" r="3.5" fill="#BAC7D5"/>
              </svg>
            </div>
            <div class="sidebar-title" style="margin: 0;">Campus X</div>
          </div>
          <div class="sidebar-tagline">Everything campus, in one place.</div>
          <span class="sidebar-role-indicator">Student Space</span>
        </div>

        <nav class="sidebar-menu-list">
          <a href="javascript:void(0)" onclick="appState.setView('dashboard')" class="sidebar-item-link ${activeTab === 'home' || activeTab === 'dashboard' ? 'active' : ''}">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
            <span>Home</span>
          </a>

          <div class="sidebar-category-label">Academics</div>
          <a href="javascript:void(0)" onclick="appState.setView('attendance')" class="sidebar-item-link ${activeTab === 'attendance' ? 'active' : ''}">
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

          <div class="sidebar-category-label">Campus</div>
          <a href="javascript:void(0)" onclick="appState.setView('stationery')" class="sidebar-item-link ${activeTab === 'stationery' ? 'active' : ''}">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>
            <span>Stationery</span>
            ${appState.stationeryRush ? '<span class="badge badge-out-of-stock" style="margin-left: auto;">Busy</span>' : ''}
          </a>
          <a href="javascript:void(0)" onclick="appState.setView('library')" class="sidebar-item-link ${activeTab === 'library' ? 'active' : ''}">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
            <span>Library</span>
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
          <a href="javascript:void(0)" onclick="appState.setView('complaints')" class="sidebar-item-link ${activeTab === 'complaints' ? 'active' : ''}">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
            <span>Complaints</span>
          </a>
          <a href="javascript:void(0)" onclick="appState.setView('events')" class="sidebar-item-link ${activeTab === 'events' ? 'active' : ''}">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
            <span>Events</span>
          </a>

          <div class="sidebar-category-label">AI</div>
          <a href="javascript:void(0)" onclick="appState.setView('ai-chat')" class="sidebar-item-link ${activeTab === 'ai-chat' ? 'active' : ''}">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3z"></path></svg>
            <span>Ask Campus X</span>
          </a>

          <div class="sidebar-category-label">Account</div>
          <a href="javascript:void(0)" onclick="appState.setView('profile')" class="sidebar-item-link ${activeTab === 'profile' ? 'active' : ''}">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            <span>Profile</span>
          </a>
          <a href="javascript:void(0)" onclick="appState.setView('settings')" class="sidebar-item-link ${activeTab === 'settings' ? 'active' : ''}">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
            <span>Settings</span>
          </a>
        </nav>

        <div class="sidebar-footer-note">
          <div class="sidebar-footer-quote">Good students.<br>Brighter tomorrows.</div>
          <div class="sidebar-footer-motto">Learn • Grow • Belong</div>
        </div>
      </aside>
    `;
  }

  static renderDashboard(container) {
    const isRush = appState.stationeryRush;

    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 1.5rem;">

        <!-- MOBILE-SPECIFIC COMPACT SUMMARY (Section 5) - HIDDEN ON DESKTOP -->
        <div class="mobile-dashboard-summary">
          <div class="mobile-summary-header">Good morning, Parshv.</div>
          <div class="mobile-summary-grid">
            <div class="mobile-summary-card">
              <div class="mobile-summary-label">Next Class</div>
              <div class="mobile-summary-value">AIPD</div>
              <div class="mobile-summary-sub">2:00 PM • Room 305</div>
            </div>

            <div class="mobile-summary-card">
              <div class="mobile-summary-label">Attendance</div>
              <div class="mobile-summary-value" style="color: var(--color-success);">84%</div>
              <div class="mobile-summary-sub">Good standing</div>
            </div>

            <div class="mobile-summary-card">
              <div class="mobile-summary-label">Upcoming Exam</div>
              <div class="mobile-summary-value">Java</div>
              <div class="mobile-summary-sub">18 Sep • Mid-term</div>
            </div>

            <div class="mobile-summary-card">
              <div class="mobile-summary-label">Stationery</div>
              <div class="mobile-summary-value" style="color: ${isRush ? 'var(--color-error)' : 'var(--color-success)'}; font-size: 0.95rem;">
                ${isRush ? '● Rush is On' : '● Normal'}
              </div>
              <div class="mobile-summary-sub">${isRush ? 'Queue is busy' : 'No waiting'}</div>
            </div>
          </div>
        </div>

        <!-- EDITORIAL HERO (Exact Desktop Composition) -->
        <section class="editorial-hero">
          <div class="editorial-hero-content">
            <h2 class="editorial-hero-title">
              Campus,<br>
              <span>without the chaos.</span>
            </h2>
            <p class="editorial-hero-desc">
              Classes, exams, events, services and more — all in one place.
            </p>
            <div class="editorial-hero-handwritten">
              Same goals. Brighter days ☺
            </div>
          </div>

          <div class="editorial-hero-media">
            <img src="https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=700&q=80" alt="College Campus">
            <div class="editorial-hero-badge">
              A Better You<br>Brighter Tomorrow
            </div>
          </div>
        </section>

        <!-- STATIONERY RUSH STATUS CARD (Section 16 & 25) -->
        <div class="stationery-status-banner ${isRush ? 'stationery-status-rush' : 'stationery-status-normal'}">
          <div class="stationery-status-info">
            <span class="status-dot-pulse"></span>
            <div>
              <div style="font-weight: 700; font-size: 0.88rem;">
                ${isRush ? '🚨 Stationery is currently busy' : '● Stationery Counter is Normal'}
              </div>
              <div style="font-size: 0.78rem; opacity: 0.85;">
                ${isRush 
                  ? 'The counter is experiencing higher traffic than usual. Please expect a longer waiting time.' 
                  : 'Counter traffic is currently normal. Average counter service time: 2 mins.'}
              </div>
            </div>
          </div>
          <button class="btn btn-secondary" style="padding: 0.45rem 0.9rem; font-size: 0.78rem;" onclick="appState.setView('stationery')">
            View Stationery
          </button>
        </div>

        <!-- 4 ACTION PILL BUTTONS (Section 14) -->
        <section class="action-pills-row">
          <a href="javascript:void(0)" onclick="appState.setView('timetable')" class="action-pill action-pill-blue">
            <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            <span>View Timetable</span>
          </a>

          <a href="javascript:void(0)" onclick="appState.setView('attendance')" class="action-pill action-pill-green">
            <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
            <span>Check Attendance</span>
          </a>

          <a href="javascript:void(0)" onclick="appState.setView('notices')" class="action-pill action-pill-peach">
            <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
            <span>See Notices</span>
          </a>

          <a href="javascript:void(0)" onclick="appState.setView('ai-chat')" class="action-pill action-pill-purple">
            <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3z"></path></svg>
            <span>Ask Campus X</span>
          </a>
        </section>

        <!-- 2-COLUMN SPLIT: SCHEDULE & ATTENTION FEED -->
        <div class="middle-split-grid">
          
          <!-- TODAY'S SCHEDULE -->
          <div class="card-editorial">
            <div class="flex items-center justify-between" style="margin-bottom: 1.25rem;">
              <div>
                <h3 style="font-size: 1.15rem; font-weight: 700;">Today's Schedule</h3>
                <p style="font-size: 0.78rem; color: var(--text-muted);">Thu, 11 Sep 2026 • Class 2452 IT</p>
              </div>
              <a href="javascript:void(0)" onclick="appState.setView('timetable')" style="font-size: 0.8rem; font-weight: 600;">View All &rarr;</a>
            </div>

            <div class="schedule-timeline-box">
              ${CAMPUS_DATA.studentSchedule.map(item => `
                <div class="timeline-row">
                  <span class="timeline-time-col">${item.time}</span>
                  <span class="timeline-dot" style="background-color: ${item.color};"></span>
                  <div class="timeline-info">
                    <div class="timeline-subject">${item.subject}</div>
                    <div class="timeline-room-faculty">${item.room} &nbsp;|&nbsp; ${item.faculty}</div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- 3 THINGS NEED YOUR ATTENTION -->
          <div class="card-editorial flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between" style="margin-bottom: 1.25rem;">
                <h3 style="font-size: 1.15rem; font-weight: 700;">3 things need your attention.</h3>
                <a href="javascript:void(0)" onclick="appState.setView('notices')" style="font-size: 0.8rem; font-weight: 600;">View All &rarr;</a>
              </div>

              <div class="attention-list">
                ${CAMPUS_DATA.attentionItems.map(att => `
                  <div class="attention-item">
                    <div class="attention-icon-wrap" style="background: ${att.bg}; color: ${att.color};">
                      <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path></svg>
                    </div>
                    <div class="attention-details">
                      <div class="attention-title">${att.title}</div>
                      <div class="attention-desc">${att.desc}</div>
                    </div>
                    <span class="attention-time">${att.time}</span>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Motivation Quote Sticker -->
            <div class="motivation-photo-card" style="margin-top: 1rem;">
              <div class="motivation-quote-text">
                “Discipline today, a better tomorrow.”
              </div>
              <div class="notebook-sticker">
                Good<br>Ideas<br>Better<br>Grades ☺
              </div>
            </div>
          </div>

        </div>

      </div>
    `;
  }
}
