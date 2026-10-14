/* ==========================================================
   Campus X AI - Lost & Found Module View
   Sections 23, 24, 25, 26, 34
   ========================================================== */

class LostFoundView {
  static currentTab = 'ALL';
  static searchQuery = '';
  static categoryFilter = 'ALL';

  static render(container) {
    const isAdmin = appState.currentUser && (appState.currentUser.role === 'ADMIN');
    const isStudentOrFaculty = !isAdmin;

    // Filter items based on tab, search, category
    const items = CAMPUS_DATA.lostAndFound.filter(item => {
      // Tab filter
      if (LostFoundView.currentTab === 'LOST' && item.type !== 'LOST') return false;
      if (LostFoundView.currentTab === 'FOUND' && item.type !== 'FOUND') return false;
      if (LostFoundView.currentTab === 'MY_REPORTS') {
        const currentName = appState.currentUser ? appState.currentUser.name : '';
        if (item.reportedBy !== currentName && !item.reportedBy.includes('Parshva')) return false;
      }

      // Search query
      if (LostFoundView.searchQuery) {
        const q = LostFoundView.searchQuery.toLowerCase();
        const matches = item.item.toLowerCase().includes(q) || 
                        item.location.toLowerCase().includes(q) || 
                        item.desc.toLowerCase().includes(q) || 
                        item.category.toLowerCase().includes(q);
        if (!matches) return false;
      }

      // Category filter
      if (LostFoundView.categoryFilter !== 'ALL' && item.category !== LostFoundView.categoryFilter) {
        return false;
      }

      return true;
    });

    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 1.5rem;">

        <!-- 1. PAGE HEADER (Section 23) -->
        <div class="flex items-center justify-between" style="flex-wrap: wrap; gap: 1rem;">
          <div>
            <h2 style="font-size: 2rem; font-weight: 800; color: var(--text-primary);">Lost & Found</h2>
            <p style="font-size: 0.95rem; color: var(--text-secondary);">Lost something? Found something? Start here.</p>
          </div>

          <div class="flex items-center gap-2">
            <button class="btn btn-secondary" onclick="LostFoundView.openReportModal('LOST')">
              Report Lost Item
            </button>
            <button class="btn btn-primary" onclick="LostFoundView.openReportModal('FOUND')">
              Report Found Item
            </button>
          </div>
        </div>

        <!-- 2. POSSIBLE MATCH INTERFACE (Section 26 - Admin & General AI discovery) -->
        <div class="card-editorial" style="background: var(--tint-soft-blue); border-color: #BFDBFE;">
          <div class="flex items-center justify-between" style="margin-bottom: 0.5rem; flex-wrap: wrap; gap: 0.5rem;">
            <div class="flex items-center gap-2">
              <span class="badge badge-blue">Possible Match</span>
              <strong style="color: var(--color-accent-blue); font-size: 0.95rem;">Automated Match Found: Black Leather Wallet</strong>
            </div>
            <button class="btn btn-primary" style="padding: 0.35rem 0.75rem; font-size: 0.76rem;" onclick="LostFoundView.confirmMatch('LF-301', 'LF-304')">
              Compare & Confirm Match
            </button>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem; margin-top: 0.5rem;">
            <div style="background: #ffffff; padding: 0.85rem; border-radius: var(--radius-sm); border: 1px solid #DBEAFE;">
              <span style="font-size: 0.7rem; font-weight: 700; color: #DC2626; text-transform: uppercase;">Lost Report (#LF-301)</span>
              <div style="font-weight: 700; font-size: 0.9rem; margin-top: 0.2rem;">Black Leather Bi-fold Wallet</div>
              <div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 0.25rem;">
                Near Central Library • Reported by Parshva Shah • 10:15 AM
              </div>
            </div>

            <div style="background: #ffffff; padding: 0.85rem; border-radius: var(--radius-sm); border: 1px solid #DBEAFE;">
              <span style="font-size: 0.7rem; font-weight: 700; color: var(--color-success); text-transform: uppercase;">Found Report (#LF-304)</span>
              <div style="font-weight: 700; font-size: 0.9rem; margin-top: 0.2rem;">Black Men's Leather Wallet</div>
              <div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 0.25rem;">
                Reading Hall Table 3 • Deposited at Library Desk • 10:45 AM
              </div>
            </div>
          </div>
        </div>

        <!-- 3. SEARCH & CATEGORY FILTER BAR (Section 23) -->
        <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; align-items: center;">
          <div style="position: relative; flex: 1; min-width: 240px;">
            <svg style="position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: var(--text-muted);" width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input 
              type="text" 
              class="form-input" 
              style="padding-left: 2.8rem; border-radius: var(--radius-full);"
              placeholder="Search lost or found items..." 
              value="${LostFoundView.searchQuery}"
              oninput="LostFoundView.handleSearch(this.value)"
            >
          </div>

          <select class="form-input" style="width: auto; border-radius: var(--radius-full); padding: 0.5rem 1rem;" onchange="LostFoundView.handleCategoryFilter(this.value)">
            <option value="ALL">All Categories</option>
            <option value="Electronics" ${LostFoundView.categoryFilter === 'Electronics' ? 'selected' : ''}>Electronics</option>
            <option value="Personal" ${LostFoundView.categoryFilter === 'Personal' ? 'selected' : ''}>Personal & Accessories</option>
            <option value="Documents" ${LostFoundView.categoryFilter === 'Documents' ? 'selected' : ''}>ID / Documents</option>
            <option value="Academics" ${LostFoundView.categoryFilter === 'Academics' ? 'selected' : ''}>Notebooks & Books</option>
          </select>
        </div>

        <!-- 4. TABS (Section 23: All, Lost, Found, My Reports) -->
        <div class="flex items-center gap-2" style="border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem; overflow-x: auto;">
          <button class="btn ${LostFoundView.currentTab === 'ALL' ? 'btn-primary' : 'btn-secondary'}" style="padding: 0.4rem 0.95rem; font-size: 0.8rem;" onclick="LostFoundView.setTab('ALL')">
            All (${CAMPUS_DATA.lostAndFound.length})
          </button>
          <button class="btn ${LostFoundView.currentTab === 'LOST' ? 'btn-primary' : 'btn-secondary'}" style="padding: 0.4rem 0.95rem; font-size: 0.8rem;" onclick="LostFoundView.setTab('LOST')">
            Lost
          </button>
          <button class="btn ${LostFoundView.currentTab === 'FOUND' ? 'btn-primary' : 'btn-secondary'}" style="padding: 0.4rem 0.95rem; font-size: 0.8rem;" onclick="LostFoundView.setTab('FOUND')">
            Found
          </button>
          <button class="btn ${LostFoundView.currentTab === 'MY_REPORTS' ? 'btn-primary' : 'btn-secondary'}" style="padding: 0.4rem 0.95rem; font-size: 0.8rem;" onclick="LostFoundView.setTab('MY_REPORTS')">
            My Reports
          </button>
        </div>

        <!-- 5. ADMIN VIEW: MANAGEMENT TABLE (Section 26) -->
        ${isAdmin ? `
          <div class="card-editorial" style="padding: 1.25rem;">
            <h3 style="font-size: 1.15rem; font-weight: 700; margin-bottom: 1rem;">Lost & Found Management</h3>
            <div class="table-responsive-card">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Type</th>
                    <th>Reported By</th>
                    <th>Location</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  ${items.map(item => {
                    const esc = window.SecurityUtils ? window.SecurityUtils.escapeHtml : (s => s);
                    return `
                    <tr>
                      <td>
                        <div style="font-weight: 700; color: var(--text-primary);">${esc(item.item)}</div>
                        <div style="font-size: 0.72rem; color: var(--text-muted);">${esc(item.desc)}</div>
                      </td>
                      <td>
                        <span class="badge ${item.type === 'LOST' ? 'badge-out-of-stock' : 'badge-available'}">
                          ${esc(item.type)}
                        </span>
                      </td>
                      <td>${esc(item.reportedBy)}</td>
                      <td>${esc(item.location)}</td>
                      <td>${esc(item.date)} ${item.time ? '• ' + esc(item.time) : ''}</td>
                      <td>
                        <span class="badge ${item.status === 'RESOLVED' ? 'badge-available' : (item.status === 'POTENTIAL_MATCH' ? 'badge-blue' : 'badge-low-stock')}">
                          ${esc(item.status)}
                        </span>
                      </td>
                      <td>
                        <div class="flex items-center gap-1">
                          <button class="btn btn-secondary" style="padding: 0.3rem 0.6rem; font-size: 0.72rem;" onclick="appState.showToast('Item report verified by security desk.', 'info')">
                            Verify
                          </button>
                          <button class="btn btn-primary" style="padding: 0.3rem 0.6rem; font-size: 0.72rem;" onclick="LostFoundView.markStatus('${esc(item.id)}', 'CLAIMED')">
                            Mark Claimed
                          </button>
                        </div>
                      </td>
                    </tr>
                  `;}).join('')}
                </tbody>
              </table>
            </div>
          </div>
        ` : `
          <!-- STUDENT & FACULTY CARDS GRID (Section 23 & 34) -->
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.25rem;">
            ${items.length === 0 ? `
              <div class="card-editorial" style="grid-column: 1 / -1; padding: 2.5rem; text-align: center; color: var(--text-muted);">
                No items found in this category.
              </div>
            ` : items.map(item => {
              const esc = window.SecurityUtils ? window.SecurityUtils.escapeHtml : (s => s);
              return `
              <div class="card-editorial flex flex-col justify-between" style="padding: 1.25rem;">
                <div>
                  <div class="flex items-center justify-between" style="margin-bottom: 0.5rem;">
                    <span class="badge ${item.type === 'LOST' ? 'badge-out-of-stock' : 'badge-available'}">${esc(item.type)}</span>
                    <span style="font-size: 0.72rem; color: var(--text-muted); font-family: monospace;">${esc(item.id)}</span>
                  </div>

                  <h3 style="font-size: 1.05rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.35rem;">${esc(item.item)}</h3>
                  <p style="font-size: 0.82rem; color: var(--text-secondary); margin-bottom: 0.75rem;">${esc(item.desc)}</p>

                  <div style="font-size: 0.76rem; color: var(--text-muted); line-height: 1.5;">
                    <strong>Location:</strong> ${esc(item.location)}<br>
                    <strong>Date:</strong> ${esc(item.date)} ${item.time ? '• ' + esc(item.time) : ''}<br>
                    <strong>Reported By:</strong> ${esc(item.reportedBy)}
                  </div>
                </div>

                <div style="margin-top: 1.25rem; padding-top: 0.75rem; border-top: 1px solid var(--border-subtle); display: flex; justify-content: space-between; align-items: center;">
                  <span class="badge ${item.status === 'POTENTIAL_MATCH' ? 'badge-blue' : (item.status === 'RESOLVED' ? 'badge-available' : 'badge-low-stock')}">
                    ${esc(item.status)}
                  </span>
                  <button class="btn btn-secondary" style="padding: 0.35rem 0.75rem; font-size: 0.75rem;" onclick="appState.showToast('Enquiry request submitted to campus security.', 'success')">
                    ${item.type === 'FOUND' ? 'Claim Item' : 'Details'}
                  </button>
                </div>
              </div>
            `;}).join('')}
          </div>
        `}

      </div>
    `;
  }

  static setTab(tabName) {
    LostFoundView.currentTab = tabName;
    const container = document.getElementById('viewContainer');
    if (container) LostFoundView.render(container);
  }

  static handleSearch(query) {
    LostFoundView.searchQuery = query;
    const container = document.getElementById('viewContainer');
    if (container) LostFoundView.render(container);
  }

  static handleCategoryFilter(cat) {
    LostFoundView.categoryFilter = cat;
    const container = document.getElementById('viewContainer');
    if (container) LostFoundView.render(container);
  }

  // 6. REPORT LOST OR FOUND ITEM MODAL (Sections 24 & 25)
  static openReportModal(type) {
    const isLost = type === 'LOST';

    AppModal.show({
      title: isLost ? "Report Lost Item" : "Report Found Item",
      content: `
        <form id="lfForm" style="display: flex; flex-direction: column; gap: 0.8rem;">
          <div class="form-group">
            <label class="form-label">Item Name</label>
            <input type="text" id="lfItemName" class="form-input" placeholder="${isLost ? 'e.g. Scientific Calculator Casio fx-991EX' : 'e.g. Spiral Notebook with ID card'}" required>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Category</label>
              <select class="form-input" id="lfCategory">
                <option value="Electronics">Electronics</option>
                <option value="Personal">Personal & Accessories</option>
                <option value="Documents">ID / Documents</option>
                <option value="Academics">Notebooks & Books</option>
                <option value="General">Other</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">${isLost ? 'Last Seen Location' : 'Found Location'}</label>
              <input type="text" id="lfLocation" class="form-input" placeholder="${isLost ? 'Near IT Lab 3 / Library' : 'Reading Hall Table 4'}" required>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">${isLost ? 'Date Lost' : 'Date Found'}</label>
              <input type="date" id="lfDate" class="form-input" value="${new Date().toISOString().split('T')[0]}">
            </div>
            <div class="form-group">
              <label class="form-label">Approximate Time</label>
              <input type="time" id="lfTime" class="form-input" value="11:30">
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Description</label>
            <textarea id="lfDesc" class="form-input" rows="2" placeholder="Color, brand, identifying marks, serial numbers..."></textarea>
          </div>

          <div class="form-group">
            <label class="form-label">${isLost ? 'Contact Information' : 'Hand-over Location'}</label>
            <input type="text" id="lfContact" class="form-input" placeholder="${isLost ? '+91 98251 ... or Class 2452' : 'Deposited at Central Library Desk'}" required>
          </div>
        </form>
      `,
      confirmText: isLost ? "Report Lost Item" : "Report Found Item",
      confirmClass: "btn-primary",
      onConfirm: () => {
        const name = document.getElementById('lfItemName').value.trim();
        const category = document.getElementById('lfCategory').value;
        const location = document.getElementById('lfLocation').value.trim();
        const date = document.getElementById('lfDate').value || "Today";
        const time = document.getElementById('lfTime').value || "11:30 AM";
        const desc = document.getElementById('lfDesc').value.trim();
        const contact = document.getElementById('lfContact').value.trim();

        if (!name || !location) {
          appState.showToast("Please fill in item name and location.", "error");
          return;
        }

        const newLF = {
          id: `LF-${Date.now().toString().slice(-3)}`,
          item: name,
          type: type,
          category: category,
          reportedBy: appState.currentUser ? appState.currentUser.name : "Campus Member",
          location: location,
          date: date,
          time: time,
          status: isLost ? 'LOST' : 'FOUND',
          desc: desc || "Reported on portal.",
          contact: contact
        };

        appState.reportLostFound(newLF);
        if (isLost) {
          appState.showToast("Your lost-item report has been submitted.", "success");
        } else {
          appState.showToast("Thank you! Found item report registered.", "success");
        }
        LostFoundView.render(document.getElementById('viewContainer'));
      }
    });
  }

  static confirmMatch(lostId, foundId) {
    if (!appState.currentUser || (appState.currentUser.role !== 'ADMIN' && appState.currentUser.role !== 'FACULTY')) {
      appState.showToast('Access denied: Staff authorization required.', 'error');
      return;
    }
    const lItem = CAMPUS_DATA.lostAndFound.find(i => i.id === lostId);
    const fItem = CAMPUS_DATA.lostAndFound.find(i => i.id === foundId);
    if (lItem && fItem) {
      lItem.status = "RESOLVED";
      fItem.status = "CLAIMED";
      appState.showToast("Match confirmed! Verification notice dispatched.", "success");
      LostFoundView.render(document.getElementById('viewContainer'));
    }
  }

  static markStatus(itemId, newStatus) {
    if (!appState.currentUser || (appState.currentUser.role !== 'ADMIN' && appState.currentUser.role !== 'FACULTY')) {
      appState.showToast('Access denied: Staff authorization required.', 'error');
      return;
    }
    const item = CAMPUS_DATA.lostAndFound.find(i => i.id === itemId);
    if (item) {
      item.status = newStatus;
      appState.showToast(`Item ${itemId} marked as ${newStatus}.`, "success");
      LostFoundView.render(document.getElementById('viewContainer'));
    }
  }
}

