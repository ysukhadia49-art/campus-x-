/* ==========================================================
   Campus X AI - Stationery Module & Operator Workspace
   Sections 16, 17, 18, 19, 20, 21, 22, 33
   ========================================================== */

class StationeryView {
  static activeCategory = 'All';
  static searchQuery = '';

  // 1. STATIONERY OPERATOR SIDEBAR (Section 16)
  static renderSidebar(activeTab = 'stationery') {
    return `
      <aside class="app-sidebar">
        <div class="sidebar-brand-box">
          <div class="sidebar-title">Campus X</div>
          <div class="sidebar-tagline">Central Stationery Portal</div>
          <span class="sidebar-role-indicator">Stationery Operator</span>
        </div>

        <nav class="sidebar-menu-list">
          <a href="javascript:void(0)" onclick="appState.setView('dashboard')" class="sidebar-item-link ${activeTab === 'home' || activeTab === 'dashboard' ? 'active' : ''}">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
            <span>Home</span>
          </a>

          <div class="sidebar-category-label">Inventory & Store</div>
          <a href="javascript:void(0)" onclick="appState.setView('stationery')" class="sidebar-item-link ${activeTab === 'stationery' ? 'active' : ''}">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>
            <span>Stationery</span>
          </a>
          <a href="javascript:void(0)" onclick="appState.setView('stationery')" class="sidebar-item-link">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
            <span>Inventory</span>
          </a>
          <a href="javascript:void(0)" onclick="appState.showToast('Requisition history synced with Tapi ERP.', 'info')" class="sidebar-item-link">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path></svg>
            <span>Stock History</span>
          </a>
          <a href="javascript:void(0)" onclick="appState.showToast('3 item reorder requests currently queued.', 'info')" class="sidebar-item-link">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>
            <span>Requests</span>
          </a>

          <div class="sidebar-category-label">Counter Operations</div>
          <a href="javascript:void(0)" onclick="StationeryView.openRushModal()" class="sidebar-item-link">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            <span>Rush Control</span>
            ${appState.stationeryRush ? '<span class="badge badge-out-of-stock" style="margin-left: auto;">ON</span>' : '<span class="badge badge-available" style="margin-left: auto;">OFF</span>'}
          </a>
          <a href="javascript:void(0)" onclick="appState.showToast('All counter alerts are cleared.', 'info')" class="sidebar-item-link">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
            <span>Notifications</span>
          </a>

          <div class="sidebar-category-label">Account</div>
          <a href="javascript:void(0)" onclick="appState.setView('profile')" class="sidebar-item-link">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            <span>Profile</span>
          </a>
          <a href="javascript:void(0)" onclick="appState.setView('settings')" class="sidebar-item-link">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
            <span>Settings</span>
          </a>
        </nav>

        <div class="sidebar-footer-note">
          <div class="sidebar-footer-quote">Keep stock healthy,<br>counter moving.</div>
          <div class="sidebar-footer-motto">Tapi Central Store</div>
        </div>
      </aside>
    `;
  }

  // 2. DISPATCH RENDER: OPERATOR/ADMIN VS STUDENT/FACULTY (Section 17 vs 19)
  static renderDashboard(container) {
    const isOperator = appState.currentUser && (appState.currentUser.role === 'STATIONERY_OPERATOR' || appState.currentUser.role === 'ADMIN');
    if (isOperator) {
      StationeryView.renderOperatorManagement(container);
    } else {
      StationeryView.renderStudentFacultyCatalog(container);
    }
  }

  // 3. STUDENT & FACULTY CATALOG VIEW (Section 17 & 18)
  static renderStudentFacultyCatalog(container) {
    const isRush = appState.stationeryRush;
    const categories = ['All', 'Writing', 'Paper', 'Notebooks', 'Files', 'Drawing', 'Lab Supplies', 'Other'];

    // Filter items
    const filteredItems = CAMPUS_DATA.stationeryInventory.filter(item => {
      const matchCat = StationeryView.activeCategory === 'All' || item.category.toLowerCase().includes(StationeryView.activeCategory.toLowerCase());
      const matchQuery = !StationeryView.searchQuery || item.name.toLowerCase().includes(StationeryView.searchQuery.toLowerCase()) || item.category.toLowerCase().includes(StationeryView.searchQuery.toLowerCase());
      return matchCat && matchQuery;
    });

    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 1.5rem;">

        <!-- PAGE HEADER -->
        <div class="flex items-center justify-between" style="flex-wrap: wrap; gap: 1rem;">
          <div>
            <h2 style="font-size: 2rem; font-weight: 800; color: var(--text-primary);">Stationery</h2>
            <p style="font-size: 0.95rem; color: var(--text-secondary);">Everything you need for class, in one place.</p>
          </div>
        </div>

        <!-- RUSH STATUS BANNER (Section 19 & 33) -->
        <div class="stationery-status-banner ${isRush ? 'stationery-status-rush' : 'stationery-status-normal'}">
          <div class="stationery-status-info">
            <span class="status-dot-pulse"></span>
            <div>
              <strong style="font-size: 0.92rem;">
                ${isRush ? '🚨 Stationery is currently busy' : '● Stationery Counter is Normal'}
              </strong>
              <div style="font-size: 0.8rem; margin-top: 2px;">
                ${isRush 
                  ? 'The stationery counter is experiencing higher traffic than usual. Please expect a longer waiting time.' 
                  : 'Counter traffic is currently normal. Quick walk-in service available.'}
              </div>
            </div>
          </div>
        </div>

        <!-- SEARCH BAR (Section 17) -->
        <div style="position: relative; max-width: 540px; width: 100%;">
          <svg style="position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: var(--text-muted);" width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input 
            type="text" 
            class="form-input" 
            style="padding-left: 2.8rem; border-radius: var(--radius-full);"
            placeholder="Search stationery..." 
            value="${StationeryView.searchQuery}"
            oninput="StationeryView.handleSearch(this.value)"
          >
        </div>

        <!-- CATEGORY CHIPS (Section 17) -->
        <div class="category-chips-row">
          ${categories.map(cat => `
            <button 
              class="category-chip ${StationeryView.activeCategory === cat ? 'active' : ''}" 
              onclick="StationeryView.setCategory('${cat}')"
            >
              ${cat}
            </button>
          `).join('')}
        </div>

        <!-- ITEM CARDS GRID (Section 17) -->
        <div class="stationery-catalog-grid">
          ${filteredItems.length === 0 ? `
            <div class="card-editorial" style="grid-column: 1 / -1; padding: 2.5rem; text-align: center; color: var(--text-muted);">
              No stationery items found matching "${window.SecurityUtils ? window.SecurityUtils.escapeHtml(StationeryView.searchQuery) : StationeryView.searchQuery}".
            </div>
          ` : filteredItems.map(item => {
            const esc = window.SecurityUtils ? window.SecurityUtils.escapeHtml : (s => s);
            return `
            <div class="stationery-item-card" onclick="StationeryView.openItemDetailsModal('${esc(item.id)}')">
              <div>
                <div class="flex items-center justify-between" style="margin-bottom: 0.5rem;">
                  <span class="badge ${item.status === 'AVAILABLE' ? 'badge-available' : (item.status === 'LOW_STOCK' ? 'badge-low-stock' : 'badge-out-of-stock')}">
                    ${item.status === 'AVAILABLE' ? '✓ Available' : (item.status === 'LOW_STOCK' ? '⚠ Low Stock' : '× Out of Stock')}
                  </span>
                  <span style="font-size: 0.72rem; color: var(--text-muted); font-family: monospace;">${esc(item.id)}</span>
                </div>

                <h3 style="font-size: 1.05rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.25rem;">${esc(item.name)}</h3>
                <div style="font-size: 0.78rem; color: var(--text-muted); margin-bottom: 0.75rem;">${esc(item.category)}</div>
              </div>

              <div class="flex items-center justify-between" style="margin-top: 1rem; padding-top: 0.75rem; border-top: 1px solid var(--border-subtle);">
                <div style="font-size: 1.15rem; font-weight: 800; color: var(--text-primary);">₹${item.price}</div>
                <button class="btn btn-secondary" style="padding: 0.35rem 0.75rem; font-size: 0.75rem;">
                  Details
                </button>
              </div>
            </div>
          `;}).join('')}
        </div>

      </div>
    `;
  }

  // 4. OPERATOR / ADMIN MANAGEMENT WORKSPACE (Section 19 & 20)
  static renderOperatorManagement(container) {
    const isRush = appState.stationeryRush;

    // Calculate metrics
    const totalItems = CAMPUS_DATA.stationeryInventory.length;
    const available = CAMPUS_DATA.stationeryInventory.filter(i => i.status === 'AVAILABLE').length;
    const lowStock = CAMPUS_DATA.stationeryInventory.filter(i => i.status === 'LOW_STOCK').length;
    const outOfStock = CAMPUS_DATA.stationeryInventory.filter(i => i.status === 'OUT_OF_STOCK').length;

    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 1.5rem;">

        <!-- HEADER WITH ADD ITEM ACTION -->
        <div class="flex items-center justify-between" style="flex-wrap: wrap; gap: 1rem;">
          <div>
            <h2 style="font-size: 2rem; font-weight: 800; color: var(--text-primary);">Stationery Management</h2>
            <p style="font-size: 0.9rem; color: var(--text-secondary);">Central store inventory, counter rush control & stock allocations.</p>
          </div>
          <button class="btn btn-primary" onclick="StationeryView.openAddItemModal()">
            <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            <span>Add Item</span>
          </button>
        </div>

        <!-- 1. PROMINENT RUSH CONTROL (Section 19) -->
        <div class="rush-operator-card ${isRush ? 'active-rush' : ''}">
          <div class="rush-info-group">
            <span style="font-size: 0.72rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; color: var(--text-muted);">
              Stationery Status
            </span>
            <h3 style="margin-top: 0.25rem;">
              <span class="status-dot-pulse" style="background: ${isRush ? 'var(--color-error)' : 'var(--color-success)'}"></span>
              ${isRush ? '● RUSH IS ON' : '● NORMAL'}
            </h3>
            <p style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.2rem;">
              ${isRush 
                ? `The stationery counter is currently experiencing high traffic. Started: ${appState.rushStartTime || '11:42 AM'}.` 
                : 'Counter traffic is currently normal.'}
            </p>
          </div>

          <div>
            ${isRush ? `
              <button class="btn-turn-rush-off" onclick="StationeryView.turnOffRush()">
                TURN OFF RUSH
              </button>
            ` : `
              <button class="btn-turn-rush-on" onclick="StationeryView.openRushModal()">
                TURN ON RUSH
              </button>
            `}
          </div>
        </div>

        <!-- 2. FOUR METRICS (Section 20) -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 1rem;">
          <div class="card-editorial" style="padding: 1.25rem;">
            <div style="font-size: 0.72rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted);">Total Items</div>
            <div style="font-size: 1.8rem; font-weight: 800; color: var(--text-primary);">${totalItems}</div>
          </div>
          <div class="card-editorial" style="padding: 1.25rem;">
            <div style="font-size: 0.72rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted);">Available</div>
            <div style="font-size: 1.8rem; font-weight: 800; color: var(--color-success);">${available}</div>
          </div>
          <div class="card-editorial" style="padding: 1.25rem;">
            <div style="font-size: 0.72rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted);">Low Stock</div>
            <div style="font-size: 1.8rem; font-weight: 800; color: var(--color-warning);">${lowStock}</div>
          </div>
          <div class="card-editorial" style="padding: 1.25rem;">
            <div style="font-size: 1.8rem; font-weight: 800; color: var(--text-muted);">Out of Stock</div>
            <div style="font-size: 1.8rem; font-weight: 800; color: var(--color-error);">${outOfStock}</div>
          </div>
        </div>

        <!-- 3. INVENTORY TABLE (Section 20) -->
        <div class="table-responsive-card">
          <table class="data-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Minimum Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${CAMPUS_DATA.stationeryInventory.map(item => {
                const esc = window.SecurityUtils ? window.SecurityUtils.escapeHtml : (s => s);
                return `
                <tr>
                  <td>
                    <div style="font-weight: 700; color: var(--text-primary);">${esc(item.name)}</div>
                    <div style="font-size: 0.72rem; color: var(--text-muted); font-family: monospace;">${esc(item.id)}</div>
                  </td>
                  <td>${esc(item.category)}</td>
                  <td style="font-weight: 600;">₹${item.price}</td>
                  <td>
                    <span style="font-weight: 700; font-size: 0.95rem;">${item.stock}</span> 
                    <span style="font-size: 0.75rem; color: var(--text-muted);">${esc(item.unit || 'pcs')}</span>
                  </td>
                  <td>${item.minStock} ${esc(item.unit || 'pcs')}</td>
                  <td>
                    ${item.status === 'AVAILABLE' ? '<span class="badge badge-available">✓ Available</span>' : ''}
                    ${item.status === 'LOW_STOCK' ? '<span class="badge badge-low-stock">⚠ Low Stock</span>' : ''}
                    ${item.status === 'OUT_OF_STOCK' ? '<span class="badge badge-out-of-stock">× Out of Stock</span>' : ''}
                  </td>
                  <td>
                    <div class="flex items-center gap-2">
                      <button class="btn btn-secondary" style="padding: 0.35rem 0.7rem; font-size: 0.75rem;" onclick="StationeryView.openStockModal('${esc(item.id)}')">
                        Update Stock
                      </button>
                      <button class="btn btn-secondary" style="padding: 0.35rem 0.5rem; font-size: 0.75rem;" onclick="StationeryView.openItemDetailsModal('${esc(item.id)}')">
                        Edit
                      </button>
                    </div>
                  </td>
                </tr>
              `;}).join('')}
            </tbody>
          </table>
        </div>

      </div>
    `;
  }

  // 5. ITEM DETAILS MODAL (Section 18)
  static openItemDetailsModal(itemId) {
    const item = CAMPUS_DATA.stationeryInventory.find(i => i.id === itemId);
    if (!item) return;

    const isOperator = appState.currentUser && (appState.currentUser.role === 'STATIONERY_OPERATOR' || appState.currentUser.role === 'ADMIN');

    AppModal.show({
      title: item.name,
      content: `
        <div style="display: flex; flex-direction: column; gap: 0.85rem;">
          <div class="flex items-center justify-between" style="background: var(--bg-surface-subtle); padding: 0.75rem; border-radius: var(--radius-md);">
            <div>
              <div style="font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Category</div>
              <div style="font-weight: 600; color: var(--text-primary);">${item.category}</div>
            </div>
            <div style="text-align: right;">
              <div style="font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Price</div>
              <div style="font-weight: 800; font-size: 1.15rem; color: var(--text-primary);">₹${item.price}</div>
            </div>
          </div>

          <div class="flex items-center justify-between">
            <span style="font-size: 0.85rem; color: var(--text-secondary);">Available Quantity:</span>
            <strong style="font-size: 0.95rem;">${item.stock} ${item.unit || 'pcs'}</strong>
          </div>

          <div class="flex items-center justify-between">
            <span style="font-size: 0.85rem; color: var(--text-secondary);">Availability Status:</span>
            <span class="badge ${item.status === 'AVAILABLE' ? 'badge-available' : (item.status === 'LOW_STOCK' ? 'badge-low-stock' : 'badge-out-of-stock')}">
              ${item.status === 'AVAILABLE' ? '✓ Available' : (item.status === 'LOW_STOCK' ? '⚠ Low Stock' : '× Out of Stock')}
            </span>
          </div>

          <div style="border-top: 1px solid var(--border-subtle); padding-top: 0.75rem;">
            <div style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted); margin-bottom: 0.25rem;">Description</div>
            <p style="font-size: 0.84rem; color: var(--text-secondary); line-height: 1.5;">
              ${item.description || 'Standard approved institutional supplies for Tapi Diploma Engineering College coursework and examinations.'}
            </p>
          </div>
        </div>
      `,
      confirmText: isOperator ? "Update Stock" : "Request Item",
      confirmClass: "btn-primary",
      onConfirm: () => {
        if (isOperator) {
          StationeryView.openStockModal(itemId);
        } else {
          appState.showToast(`Request for ${item.name} placed successfully.`, "success");
        }
      }
    });
  }

  // 6. RUSH CONFIRMATION MODAL (Section 19)
  static openRushModal() {
    AppModal.show({
      title: "Mark stationery counter as busy?",
      content: `
        <p style="font-size: 0.88rem; color: var(--text-secondary); margin-bottom: 1rem;">
          This will immediately activate the rush advisory on student and faculty stationery screens.
        </p>
        <div style="background: var(--bg-surface-subtle); padding: 0.85rem; border-radius: var(--radius-md); font-size: 0.8rem; border-left: 3px solid #DC2626;">
          • Counter Status will change to: <strong>● RUSH IS ON</strong><br>
          • Student screens will show: <em>🚨 Stationery is currently busy</em><br>
          • Students will be notified to expect longer waiting times.
        </div>
      `,
      confirmText: "Turn On Rush",
      confirmClass: "btn-turn-rush-on",
      onConfirm: () => {
        appState.toggleRush(true);
        appState.showToast("Stationery rush status updated.", "success");
      }
    });
  }

  static turnOffRush() {
    appState.toggleRush(false);
    appState.showToast("Stationery counter marked as Normal.", "info");
  }

  // 7. STOCK ADJUSTMENT MODAL (Section 22)
  static openStockModal(itemId) {
    const item = CAMPUS_DATA.stationeryInventory.find(i => i.id === itemId);
    if (!item) return;

    AppModal.show({
      title: `Update Stock`,
      content: `
        <div style="display: flex; flex-direction: column; gap: 0.85rem;">
          <div style="font-weight: 700; font-size: 1rem; color: var(--text-primary);">${item.name}</div>
          
          <div class="flex justify-between items-center" style="background: var(--bg-surface-subtle); padding: 0.75rem; border-radius: var(--radius-md);">
            <span style="font-size: 0.85rem; color: var(--text-muted);">Current Stock</span>
            <strong style="font-size: 1.1rem; color: var(--text-primary);">${item.stock} ${item.unit || 'pcs'}</strong>
          </div>

          <div class="form-group">
            <label class="form-label">Stock Action</label>
            <select class="form-input" id="stockActionSelect">
              <option value="ADD">Add Stock (+)</option>
              <option value="REMOVE">Remove Stock (-)</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Quantity</label>
            <input type="number" id="stockQtyInput" class="form-input" value="50" min="1" required>
          </div>

          <div class="form-group">
            <label class="form-label">Reason</label>
            <input type="text" id="stockReasonInput" class="form-input" placeholder="e.g. Vendor delivery, classroom allocation" value="Vendor batch delivery">
          </div>
        </div>
      `,
      confirmText: "Update Stock",
      onConfirm: () => {
        const action = document.getElementById('stockActionSelect').value;
        const qty = parseInt(document.getElementById('stockQtyInput').value) || 0;
        const reason = document.getElementById('stockReasonInput').value;
        const delta = action === 'ADD' ? qty : -qty;

        const previousStock = item.stock;
        appState.updateStock(itemId, delta, reason);
        const newStock = item.stock;

        appState.showToast(`Stock updated successfully. Previous: ${previousStock}, New: ${newStock}`, "success");
      }
    });
  }

  // 8. ADD STATIONERY ITEM MODAL (Section 21)
  static openAddItemModal() {
    AppModal.show({
      title: "Add Item",
      content: `
        <form id="addItemForm" style="display: flex; flex-direction: column; gap: 0.8rem;">
          <div class="form-group">
            <label class="form-label">Item Name</label>
            <input type="text" id="newItemName" class="form-input" placeholder="e.g. Spiral Notebook 200 Pages" required>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Category</label>
              <select class="form-input" id="newItemCategory">
                <option value="Writing">Writing</option>
                <option value="Paper">Paper</option>
                <option value="Notebooks">Notebooks</option>
                <option value="Files">Files</option>
                <option value="Drawing">Drawing</option>
                <option value="Lab Supplies">Lab Supplies</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Price (₹)</label>
              <input type="number" id="newItemPrice" class="form-input" placeholder="65" required>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Initial Stock</label>
              <input type="number" id="newItemStock" class="form-input" placeholder="100" required>
            </div>
            <div class="form-group">
              <label class="form-label">Minimum Stock Level</label>
              <input type="number" id="newItemMinStock" class="form-input" placeholder="20" required>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Unit</label>
            <input type="text" id="newItemUnit" class="form-input" placeholder="pcs / units / pads" value="pcs">
          </div>

          <div class="form-group">
            <label class="form-label">Description</label>
            <textarea id="newItemDesc" class="form-input" rows="2" placeholder="Item specifications, brand, intended course usage..."></textarea>
          </div>
        </form>
      `,
      confirmText: "Add Item",
      onConfirm: () => {
        const name = document.getElementById('newItemName').value.trim();
        const category = document.getElementById('newItemCategory').value;
        const price = parseFloat(document.getElementById('newItemPrice').value) || 0;
        const stock = parseInt(document.getElementById('newItemStock').value) || 0;
        const minStock = parseInt(document.getElementById('newItemMinStock').value) || 10;
        const unit = document.getElementById('newItemUnit').value.trim() || 'pcs';
        const description = document.getElementById('newItemDesc').value.trim();

        // Frontend validation
        if (!name) {
          appState.showToast("Item Name is required.", "error");
          return;
        }
        if (price <= 0) {
          appState.showToast("Please enter a valid price.", "error");
          return;
        }

        const newItem = {
          id: `STN-${Date.now().toString().slice(-3)}`,
          name,
          category,
          price,
          stock,
          minStock,
          unit,
          description: description || "Standard approved Tapi stationery item.",
          status: stock === 0 ? "OUT_OF_STOCK" : (stock <= minStock ? "LOW_STOCK" : "AVAILABLE")
        };

        appState.addItem(newItem);
        appState.showToast("Item added successfully.", "success");
      }
    });
  }

  static handleSearch(q) {
    StationeryView.searchQuery = q;
    const container = document.getElementById('viewContainer');
    if (container) StationeryView.renderDashboard(container);
  }

  static setCategory(cat) {
    StationeryView.activeCategory = cat;
    const container = document.getElementById('viewContainer');
    if (container) StationeryView.renderDashboard(container);
  }
}
