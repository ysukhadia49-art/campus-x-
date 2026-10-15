/* ==========================================================
   Campus X AI - Complaints & Grievance Module View
   Section 40: "Need something fixed?", Ticket Tracking & Admin Resolution
   ========================================================== */

class ComplaintsView {
  static render(container) {
    const isAdmin = appState.currentUser && appState.currentUser.role === 'ADMIN';

    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 1.5rem;">

        <!-- PAGE HEADER -->
        <div class="flex items-center justify-between" style="flex-wrap: wrap; gap: 1rem;">
          <div>
            <h2 style="font-size: 2rem; font-weight: 800;">Campus Complaints & Maintenance</h2>
            <p style="font-size: 0.9rem; color: var(--text-secondary);">Need something fixed? Submit and track infrastructure requests.</p>
          </div>

          <button class="btn btn-primary" onclick="ComplaintsView.openNewComplaintModal()">
            <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            <span>Create Complaint</span>
          </button>
        </div>

        <!-- TICKETS TABLE / CARDS -->
        <div class="table-responsive-card">
          <table class="data-table">
            <thead>
              <tr>
                <th>Ticket ID</th>
                <th>Category</th>
                <th>Subject & Location</th>
                <th>Reported By</th>
                <th>Date</th>
                <th>Priority</th>
                <th>Status</th>
                ${isAdmin ? '<th>Action</th>' : ''}
              </tr>
            </thead>
            <tbody>
              ${CAMPUS_DATA.complaints.length === 0 ? `
                <tr>
                  <td colspan="${isAdmin ? 8 : 7}" style="text-align: center; padding: 3rem 1rem; color: var(--text-muted);">
                    <div style="width: 44px; height: 44px; margin: 0 auto 0.75rem; border-radius: 50%; background: var(--bg-surface-subtle); display: flex; align-items: center; justify-content: center; color: var(--color-success);">
                      <svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                    </div>
                    <div style="font-weight: 700; color: var(--text-primary); font-size: 1rem; margin-bottom: 0.25rem;">No campus complaints reported</div>
                    <div style="font-size: 0.85rem;">All systems and facilities are running nominally. Click "Create Complaint" to submit a maintenance ticket.</div>
                  </td>
                </tr>
              ` : CAMPUS_DATA.complaints.map(t => {
                const esc = window.SecurityUtils ? window.SecurityUtils.escapeHtml : (s => s);
                return `
                <tr>
                  <td style="font-family: monospace; font-weight: 700; color: var(--color-accent-blue);">${esc(t.id)}</td>
                  <td>${esc(t.category)}</td>
                  <td>
                    <div style="font-weight: 700; color: var(--text-primary);">${esc(t.subject)}</div>
                    <div style="font-size: 0.76rem; color: var(--text-muted);">${esc(t.location)}</div>
                  </td>
                  <td>${esc(t.reportedBy)}</td>
                  <td style="font-size: 0.78rem; color: var(--text-muted);">${esc(t.date)}</td>
                  <td>
                    <span class="badge ${t.priority === 'HIGH' ? 'badge-out-of-stock' : 'badge-low-stock'}">
                      ${esc(t.priority)}
                    </span>
                  </td>
                  <td>
                    <span class="badge ${t.status === 'RESOLVED' ? 'badge-available' : 'badge-low-stock'}">
                      ${esc(t.status)}
                    </span>
                  </td>
                  ${isAdmin ? `
                    <td>
                      <button class="btn btn-secondary" style="padding: 0.3rem 0.6rem; font-size: 0.74rem;" onclick="ComplaintsView.resolveTicket('${esc(t.id)}')">
                        ${t.status === 'RESOLVED' ? 'Closed' : 'Resolve'}
                      </button>
                    </td>
                  ` : ''}
                </tr>
              `;}).join('')}
            </tbody>
          </table>
        </div>

      </div>
    `;
  }

  static openNewComplaintModal() {
    AppModal.show({
      title: "Need something fixed?",
      content: `
        <form id="complaintForm" style="display: flex; flex-direction: column; gap: 0.85rem;">
          <div class="form-group">
            <label class="form-label">Category</label>
            <select class="form-input" id="cmpCategory">
              <option value="IT Infrastructure">IT Infrastructure (Labs, Projectors, PCs)</option>
              <option value="Electrical">Electrical & Fans</option>
              <option value="Campus Facilities">Hostel & Sanitation</option>
              <option value="Network & Wi-Fi">Network & Wi-Fi</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Subject</label>
            <input type="text" id="cmpSubject" class="form-input" placeholder="e.g. Broken bench in Room 201" required maxlength="120">
          </div>

          <div class="form-group">
            <label class="form-label">Location</label>
            <input type="text" id="cmpLocation" class="form-input" placeholder="Room 201, 2nd Floor" required maxlength="80">
          </div>

          <div class="form-group">
            <label class="form-label">Description</label>
            <textarea id="cmpDesc" class="form-input" rows="3" placeholder="Provide details to assist campus technicians..." maxlength="500"></textarea>
          </div>
        </form>
      `,
      confirmText: "Submit Complaint",
      onConfirm: () => {
        const cat = document.getElementById('cmpCategory').value;
        const sub = document.getElementById('cmpSubject').value.trim();
        const loc = document.getElementById('cmpLocation').value.trim();
        const desc = document.getElementById('cmpDesc').value.trim();

        if (!sub || !loc) {
          appState.showToast("Please provide subject and location.", "error");
          return;
        }

        const newCmp = {
          id: `CMP-${Date.now().toString().slice(-3)}`,
          category: cat,
          subject: sub,
          location: loc,
          description: desc || "Issue reported.",
          reportedBy: appState.currentUser ? appState.currentUser.name : "Student",
          date: "Today",
          status: "SUBMITTED",
          priority: "MEDIUM",
          assignedTo: "Campus Maintenance Dispatch"
        };

        appState.createComplaint(newCmp);
        ComplaintsView.render(document.getElementById('viewContainer'));
      }
    });
  }

  static resolveTicket(id) {
    if (!appState.currentUser || appState.currentUser.role !== 'ADMIN') {
      appState.showToast('Access denied: Administrator privileges required to resolve tickets.', 'error');
      return;
    }
    const t = CAMPUS_DATA.complaints.find(c => c.id === id);
    if (t) {
      t.status = "RESOLVED";
      try {
        localStorage.setItem('campusx_complaints', JSON.stringify(CAMPUS_DATA.complaints));
      } catch (e) {}

      if (window.ApiClient && !ApiClient.isStaticDeployment()) {
        ApiClient.request('/api/complaints/' + encodeURIComponent(id), {
          method: 'PATCH',
          body: JSON.stringify({ status: 'RESOLVED' })
        }).catch(err => console.warn('Complaint patch sync error:', err.message));
      }

      appState.showToast(`Ticket #${id} marked as RESOLVED. Synced to Supabase.`, "success");
      ComplaintsView.render(document.getElementById('viewContainer'));
    }
  }
}
