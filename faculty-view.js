/* ==========================================================
   Campus X AI - Faculty Workspace View
   Dedicated Faculty Sidebar, Dashboard & Interactive Attendance
   ========================================================== */

class FacultyView {
  static renderSidebar(activeTab = 'home') {
    return `
      <aside class="app-sidebar">
        <div class="sidebar-brand-box">
          <div class="sidebar-title">Campus X</div>
          <div class="sidebar-tagline">Everything campus, in one place.</div>
          <span class="sidebar-role-indicator">Faculty Workspace</span>
        </div>

        <nav class="sidebar-menu-list">
          <a href="javascript:void(0)" onclick="appState.setView('dashboard')" class="sidebar-item-link ${activeTab === 'home' || activeTab === 'dashboard' ? 'active' : ''}">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
            <span>Home</span>
          </a>

          <div class="sidebar-category-label">Academics</div>
          <a href="javascript:void(0)" onclick="appState.setView('attendance-mark')" class="sidebar-item-link ${activeTab === 'attendance-mark' || activeTab === 'attendance' ? 'active' : ''}">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
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

          <div class="sidebar-category-label">Students</div>
          <a href="javascript:void(0)" onclick="appState.setView('student-overview')" class="sidebar-item-link ${activeTab === 'student-overview' ? 'active' : ''}">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            <span>Student Overview</span>
          </a>
          <a href="javascript:void(0)" onclick="appState.setView('performance')" class="sidebar-item-link ${activeTab === 'performance' ? 'active' : ''}">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
            <span>Performance</span>
          </a>

          <div class="sidebar-category-label">Campus</div>
          <a href="javascript:void(0)" onclick="appState.setView('stationery')" class="sidebar-item-link ${activeTab === 'stationery' ? 'active' : ''}">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>
            <span>Stationery</span>
            ${appState.stationeryRush ? '<span class="badge badge-out-of-stock" style="margin-left: auto;">Busy</span>' : ''}
          </a>
          <a href="javascript:void(0)" onclick="appState.setView('facilities')" class="sidebar-item-link ${activeTab === 'facilities' ? 'active' : ''}">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
            <span>Facilities</span>
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
          <a href="javascript:void(0)" onclick="appState.setView('complaints')" class="sidebar-item-link ${activeTab === 'complaints' ? 'active' : ''}">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
            <span>Complaints</span>
          </a>

          <div class="sidebar-category-label">AI</div>
          <a href="javascript:void(0)" onclick="appState.setView('ai-chat')" class="sidebar-item-link ${activeTab === 'ai-chat' ? 'active' : ''}">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3z"></path></svg>
            <span>Ask Campus X</span>
          </a>
          <a href="javascript:void(0)" onclick="appState.setView('analytics')" class="sidebar-item-link ${activeTab === 'analytics' ? 'active' : ''}">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
            <span>Analytics</span>
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
          <div class="sidebar-footer-quote">Guiding minds,<br>building tomorrow.</div>
          <div class="sidebar-footer-motto">Tapi Faculty Portal</div>
        </div>
      </aside>
    `;
  }

  static renderDashboard(container) {
    const isRush = appState.stationeryRush;

    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 1.5rem;">

        <!-- FACULTY HEADER (Section 19) -->
        <div class="card-editorial" style="padding: 2rem; background: #ffffff;">
          <div class="flex items-center justify-between">
            <div>
              <span class="sidebar-role-indicator" style="color: var(--color-accent-blue); background: var(--tint-soft-blue); margin-bottom: 0.5rem;">
                Faculty Portal • IT Department
              </span>
              <h2 style="font-size: 2.2rem; font-weight: 800; color: var(--text-primary); margin: 0.25rem 0;">Good morning.</h2>
              <p style="font-size: 0.95rem; color: var(--text-secondary);">Your academic overview for today, 11 Sep 2026.</p>
            </div>
            <button class="btn btn-primary" onclick="appState.setView('attendance-mark')">
              <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 11l3 3L22 4"></path></svg>
              <span>Take Attendance</span>
            </button>
          </div>

          <!-- Quick Action Buttons -->
          <div class="action-pills-row" style="margin-top: 1.5rem; margin-bottom: 0;">
            <button class="action-pill action-pill-blue" onclick="appState.setView('attendance-mark')">
              <span>Take Attendance</span>
            </button>
            <button class="action-pill action-pill-green" onclick="appState.setView('timetable')">
              <span>View Timetable</span>
            </button>
            <button class="action-pill action-pill-peach" onclick="appState.setView('notices')">
              <span>Post Notice</span>
            </button>
            <button class="action-pill action-pill-purple" onclick="appState.setView('performance')">
              <span>View Reports</span>
            </button>
          </div>
        </div>

        <!-- RUSH STATUS NOTICE -->
        ${isRush ? `
          <div class="stationery-status-banner stationery-status-rush">
            <div class="stationery-status-info">
              <span class="status-dot-pulse"></span>
              <div>
                <strong>🚨 Stationery is currently busy</strong>
                <div style="font-size: 0.78rem;">The counter is experiencing high traffic. Please plan student lab requisitions accordingly.</div>
              </div>
            </div>
          </div>
        ` : ''}

        <!-- 2-COLUMN SPLIT: TODAY'S CLASSES & ATTENDANCE PREVIEW -->
        <div class="middle-split-grid">
          
          <!-- TODAY'S LECTURES -->
          <div class="card-editorial">
            <div class="flex items-center justify-between" style="margin-bottom: 1.25rem;">
              <h3 style="font-size: 1.15rem; font-weight: 700;">Today's Classes</h3>
              <span class="badge badge-blue">4 Scheduled</span>
            </div>

            <div style="display: flex; flex-direction: column; gap: 0.85rem;">
              ${CAMPUS_DATA.facultySchedule.map(cls => `
                <div class="flex items-center justify-between" style="padding: 0.75rem; background: var(--bg-surface-subtle); border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
                  <div>
                    <div style="font-size: 0.78rem; color: var(--color-accent-blue); font-weight: 700;">${cls.time} • ${cls.room}</div>
                    <div style="font-weight: 700; font-size: 0.92rem; color: var(--text-primary);">${cls.subject}</div>
                    <div style="font-size: 0.76rem; color: var(--text-muted);">${cls.class}</div>
                  </div>
                  <div>
                    ${cls.attendanceDone 
                      ? '<span class="badge badge-available">Marked ✓</span>'
                      : '<button class="btn btn-secondary" style="padding: 0.35rem 0.7rem; font-size: 0.75rem;" onclick="appState.setView(\'attendance-mark\')">Mark Now</button>'}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- STUDENT PERFORMANCE SNAPSHOT (Section 21) -->
          <div class="card-editorial flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between" style="margin-bottom: 1.25rem;">
                <h3 style="font-size: 1.15rem; font-weight: 700;">Performance Insights</h3>
                <span class="badge badge-available">Class 2452 IT</span>
              </div>

              <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 1rem;">
                Semester 5 attendance compliance stands at <strong>89.4%</strong> with 2 students requiring mentorship attention.
              </p>

              <!-- Progress Visual Bars -->
              <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                <div>
                  <div class="flex justify-between" style="font-size: 0.78rem; font-weight: 600; margin-bottom: 0.25rem;">
                    <span>AIPD (Artificial Intelligence & Python)</span>
                    <span>91.2% Attendance</span>
                  </div>
                  <div style="height: 6px; background: #E5E7EB; border-radius: 999px; overflow: hidden;">
                    <div style="width: 91.2%; height: 100%; background: var(--color-success);"></div>
                  </div>
                </div>

                <div>
                  <div class="flex justify-between" style="font-size: 0.78rem; font-weight: 600; margin-bottom: 0.25rem;">
                    <span>EIDW Lab Submissions</span>
                    <span>84.0% Submitted</span>
                  </div>
                  <div style="height: 6px; background: #E5E7EB; border-radius: 999px; overflow: hidden;">
                    <div style="width: 84%; height: 100%; background: var(--color-accent-blue);"></div>
                  </div>
                </div>
              </div>
            </div>

            <div style="margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 0.78rem; color: var(--text-muted);">AI Mentor: Prof. S. R. Patel</span>
              <a href="javascript:void(0)" onclick="appState.setView('performance')" style="font-size: 0.8rem; font-weight: 600;">Full Analytics &rarr;</a>
            </div>
          </div>

        </div>

      </div>
    `;
  }

  // FACULTY INTERACTIVE ATTENDANCE MARKING (Section 20)
  static renderAttendanceMarking(container) {
    container.innerHTML = `
      <div class="card-editorial" style="padding: 2rem;">
        <div class="flex items-center justify-between" style="margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
          <div>
            <h2 style="font-size: 1.75rem; font-weight: 800;">Class Attendance Roster</h2>
            <p style="font-size: 0.86rem; color: var(--text-secondary);">Select class and toggle student attendance status before saving.</p>
          </div>
          <div class="flex items-center gap-2">
            <button class="btn btn-secondary" onclick="appState.setView('dashboard')">Cancel</button>
            <button class="btn btn-primary" onclick="FacultyView.saveAttendanceSubmission()">Save Attendance</button>
          </div>
        </div>

        <!-- Filters Strip -->
        <div style="display: flex; gap: 1rem; margin-bottom: 1.5rem; flex-wrap: wrap;">
          <div style="flex: 1; min-width: 180px;">
            <label class="form-label">Class</label>
            <select class="form-input" id="attClassSelect">
              <option value="2452-IT">Class: 2452 - IT (Semester 5)</option>
              <option value="2451-IT">Class: 2451 - IT (Semester 3)</option>
            </select>
          </div>
          <div style="flex: 1; min-width: 180px;">
            <label class="form-label">Subject</label>
            <select class="form-input" id="attSubjectSelect">
              <option value="AIPD-Lab">AIPD (Lab Batch A)</option>
              <option value="AIPD-Theory">AIPD (Theory)</option>
              <option value="Python">Python Programming</option>
            </select>
          </div>
          <div style="flex: 1; min-width: 160px;">
            <label class="form-label">Date</label>
            <input type="date" class="form-input" value="2026-09-11">
          </div>
        </div>

        <!-- Student Attendance Table -->
        <div class="table-responsive-card">
          <table class="data-table">
            <thead>
              <tr>
                <th>Roll No</th>
                <th>Enrollment ID</th>
                <th>Student Name</th>
                <th>Overall Attd.</th>
                <th>Attendance Status</th>
              </tr>
            </thead>
            <tbody>
              ${CAMPUS_DATA.studentRoster.map(s => `
                <tr id="roster-row-${s.rollNo}">
                  <td style="font-weight: 700;">#${s.rollNo}</td>
                  <td style="font-family: monospace; color: var(--color-accent-blue);">${s.enrollment}</td>
                  <td style="font-weight: 600;">${s.name}</td>
                  <td>${s.attendancePct}</td>
                  <td>
                    <button class="attendance-toggle-btn ${s.present ? 'attendance-present' : 'attendance-absent'}" 
                            id="toggle-btn-${s.rollNo}"
                            onclick="FacultyView.toggleStudentStatus('${s.rollNo}')">
                      ${s.present ? '✓ PRESENT' : '× ABSENT'}
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div style="margin-top: 1.5rem; display: flex; justify-content: space-between; align-items: center;">
          <div style="font-size: 0.8rem; color: var(--text-muted);">
            Click status button to toggle Present / Absent. Records auto-validate before sync.
          </div>
          <button class="btn btn-primary" onclick="FacultyView.saveAttendanceSubmission()">
            Save Attendance
          </button>
        </div>
      </div>
    `;
  }

  static toggleStudentStatus(rollNo) {
    const student = CAMPUS_DATA.studentRoster.find(s => s.rollNo === rollNo);
    if (student) {
      student.present = !student.present;
      const btn = document.getElementById(`toggle-btn-${rollNo}`);
      if (btn) {
        btn.className = `attendance-toggle-btn ${student.present ? 'attendance-present' : 'attendance-absent'}`;
        btn.textContent = student.present ? '✓ PRESENT' : '× ABSENT';
      }
    }
  }

  static saveAttendanceSubmission() {
    const cls = document.getElementById('attClassSelect') ? document.getElementById('attClassSelect').value : "Class 2452 IT";
    const sub = document.getElementById('attSubjectSelect') ? document.getElementById('attSubjectSelect').value : "AIPD";
    appState.saveAttendance(cls, sub);
    setTimeout(() => {
      appState.setView('dashboard');
    }, 600);
  }
}
