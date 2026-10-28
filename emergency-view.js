/* ==========================================================
   Campus X AI - Emergency SOS & Panic Dispatch View
   Restoring full high-priority emergency console, hotlines,
   live audio siren and broadcast management
   ========================================================== */

class EmergencyView {
  static render(container) {
    if (!container) return;

    const isSos = appState.isSosActive;
    const isSound = appState.isSosSoundEnabled;
    const broadcasts = (typeof CAMPUS_DATA !== 'undefined' && Array.isArray(CAMPUS_DATA.emergencyBroadcasts))
      ? CAMPUS_DATA.emergencyBroadcasts
      : [];
    const contacts = (typeof CAMPUS_DATA !== 'undefined' && Array.isArray(CAMPUS_DATA.emergencyContacts))
      ? CAMPUS_DATA.emergencyContacts
      : [];

    container.innerHTML = `
      <div style="max-width: 980px; margin: 0 auto; display: flex; flex-direction: column; gap: 1.75rem;">
        
        <!-- Header Section -->
        <div class="flex items-center justify-between" style="flex-wrap: wrap; gap: 1rem;">
          <div>
            <h2 style="font-size: 2rem; font-weight: 800; color: var(--text-primary); display: flex; align-items: center; gap: 0.65rem;">
              <span style="color: #dc2626;">🚨</span>
              <span>Emergency SOS Console</span>
            </h2>
            <p style="font-size: 0.9rem; color: var(--text-secondary);">
              Instant panic dispatcher, 24/7 campus hotlines, and security broadcast system.
            </p>
          </div>
          <div class="flex items-center gap-2">
            <button class="btn btn-secondary" onclick="EmergencyView.toggleSound()" style="font-size: 0.8rem; padding: 0.45rem 0.85rem; display: flex; align-items: center; gap: 0.4rem;">
              <span>${isSound ? '🔊 Siren: ON' : '🔇 Siren: MUTED'}</span>
            </button>
            <button class="btn btn-primary" onclick="appState.setView('dashboard')" style="font-size: 0.8rem; padding: 0.45rem 0.85rem;">
              Back to Dashboard
            </button>
          </div>
        </div>

        <!-- Giant Interactive Panic Button Container -->
        <div class="sos-panic-container ${isSos ? 'sos-active' : ''}">
          <div class="sos-panic-badge ${isSos ? 'sos-badge-active' : ''}">
            ${isSos ? '🚨 SOS SIREN ACTIVE • EMERGENCY DISPATCHED' : '🛡️ TAP TO DISPATCH EMERGENCY'}
          </div>

          <h3 style="font-size: 1.6rem; font-weight: 800; color: #ffffff; margin-bottom: 0.35rem;">
            ${isSos ? 'SECURITY & MEDICAL SERVICES NOTIFIED' : 'Campus Panic Dispatcher'}
          </h3>
          <p style="font-size: 0.88rem; color: #e2e8f0; max-width: 520px; margin: 0 auto;">
            ${isSos 
              ? 'Live GPS beacon active. Security Patrol Team & Medical Clinic dispatched to your current building.' 
              : 'Press the SOS button below for immediate emergency assistance, medical distress, or campus threats.'}
          </p>

          <!-- Interactive Center SOS Button -->
          <div class="sos-button-wrapper">
            ${isSos ? `
              <div class="sos-pulse-ring"></div>
              <div class="sos-pulse-ring"></div>
              <div class="sos-pulse-ring"></div>
            ` : ''}
            <button 
              class="sos-panic-circle ${isSos ? 'is-triggered' : ''}" 
              id="sosPanicButton" 
              onclick="EmergencyView.handleToggleSos()" 
              aria-label="Toggle Emergency SOS Panic"
            >
              <svg width="44" height="44" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24" style="margin-bottom: 4px;">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <span style="font-size: 0.95rem; font-weight: 900; letter-spacing: 0.08em;">
                ${isSos ? 'CANCEL SOS' : 'PRESS SOS'}
              </span>
            </button>
          </div>

          <!-- Live GPS & Telemetry Card -->
          <div style="display: inline-flex; align-items: center; gap: 0.5rem; background: rgba(0, 0, 0, 0.35); border: 1px solid rgba(255, 255, 255, 0.15); padding: 0.5rem 1.1rem; border-radius: var(--radius-full); font-size: 0.78rem; color: #f1f5f9; backdrop-blur: 8px;">
            <span style="width: 8px; height: 8px; border-radius: 50%; background: ${isSos ? '#ef4444' : '#10b981'}; display: inline-block;"></span>
            <span><strong>Location:</strong> Tapi Diploma IT Building • 2nd Floor (Lat 21.1702° N, Lon 72.8311° E)</span>
          </div>
        </div>

        <!-- 24/7 Emergency Hotlines Grid -->
        <div class="card-editorial" style="padding: 1.5rem;">
          <div class="flex items-center justify-between" style="margin-bottom: 1.25rem;">
            <div>
              <h3 style="font-size: 1.15rem; font-weight: 700; color: var(--text-primary); display: flex; align-items: center; gap: 0.5rem;">
                <svg width="18" height="18" fill="none" stroke="#dc2626" stroke-width="2" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                <span>Instant Emergency Hotlines</span>
              </h3>
              <p style="font-size: 0.8rem; color: var(--text-secondary);">Direct phone contact with campus security control, on-site medics, and administrative wardens.</p>
            </div>
            <span class="badge badge-low-stock">Verified 24/7 Lines</span>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem;">
            ${contacts.map(c => `
              <div class="emergency-hotline-card">
                <div>
                  <h4 style="font-size: 0.92rem; font-weight: 700; margin-bottom: 0.2rem; color: var(--text-primary);">${c.title}</h4>
                  <div style="font-size: 0.78rem; color: var(--text-muted); margin-bottom: 0.25rem;">📍 ${c.location}</div>
                  <div style="font-size: 0.75rem; font-weight: 600; color: #16a34a;">● ${c.available}</div>
                </div>
                <div style="text-align: right; display: flex; flex-direction: column; align-items: flex-end; gap: 0.35rem;">
                  <span style="font-size: 0.8rem; font-family: monospace; font-weight: 700; color: var(--text-primary);">${c.phone}</span>
                  <a href="tel:${c.phone.replace(/[^0-9+]/g, '')}" class="emergency-call-btn">
                    <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                    <span>Call Now</span>
                  </a>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Campus Alert Broadcast Channel -->
        <div class="card-editorial" style="padding: 1.5rem;">
          <div class="flex items-center justify-between" style="margin-bottom: 1.25rem;">
            <div>
              <h3 style="font-size: 1.15rem; font-weight: 700; color: var(--text-primary); display: flex; align-items: center; gap: 0.5rem;">
                <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="2"></circle><path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"></path></svg>
                <span>Campus Alert Broadcast</span>
              </h3>
              <p style="font-size: 0.8rem; color: var(--text-secondary);">Real-time broadcast bulletins issued for safety incidents, maintenance, or evacuations.</p>
            </div>
            <span class="badge badge-blue">Official Alerts</span>
          </div>

          <!-- Broadcast Publisher Form -->
          <div style="display: flex; gap: 0.65rem; margin-bottom: 1.25rem;">
            <input 
              type="text" 
              id="sosBroadcastInput" 
              class="form-input" 
              placeholder="Post a campus emergency announcement or security advisory..." 
              maxlength="280"
              onkeydown="if(event.key==='Enter') EmergencyView.postBroadcast()"
            >
            <button class="btn btn-primary" onclick="EmergencyView.postBroadcast()" style="white-space: nowrap;">
              Broadcast
            </button>
          </div>

          <!-- Broadcast Feed Stream -->
          <div style="display: flex; flex-direction: column; gap: 0.75rem; max-height: 280px; overflow-y: auto;">
            ${broadcasts.map(b => `
              <div style="padding: 0.85rem 1rem; border-radius: var(--radius-md); background: var(--bg-surface-subtle); border-left: 3px solid #dc2626; display: flex; flex-direction: column; gap: 0.3rem;">
                <div class="flex items-center justify-between">
                  <span style="font-size: 0.8rem; font-weight: 700; color: #dc2626;">📢 ${b.sender}</span>
                  <span style="font-size: 0.74rem; color: var(--text-muted);">${b.time}</span>
                </div>
                <p style="font-size: 0.84rem; color: var(--text-primary); line-height: 1.45; margin: 0;">
                  ${(window.SecurityUtils && window.SecurityUtils.escapeHtml) ? window.SecurityUtils.escapeHtml(b.text) : b.text}
                </p>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Emergency Protocols Guide -->
        <div class="card-editorial" style="padding: 1.5rem;">
          <h3 style="font-size: 1.15rem; font-weight: 700; margin-bottom: 1rem; color: var(--text-primary);">
            Campus Emergency Response Protocols
          </h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1rem;">
            <div style="padding: 1rem; background: var(--bg-surface-subtle); border-radius: var(--radius-md);">
              <div style="font-weight: 700; font-size: 0.88rem; color: #dc2626; margin-bottom: 0.35rem;">🩺 Medical Emergency</div>
              <p style="font-size: 0.78rem; color: var(--text-secondary); line-height: 1.45;">Keep calm, do not move injured persons unless immediate hazard is present. Dispatch SOS and call Campus Health Room.</p>
            </div>
            <div style="padding: 1rem; background: var(--bg-surface-subtle); border-radius: var(--radius-md);">
              <div style="font-weight: 700; font-size: 0.88rem; color: #dc2626; margin-bottom: 0.35rem;">🔥 Fire & Hazard Outbreak</div>
              <p style="font-size: 0.78rem; color: var(--text-secondary); line-height: 1.45;">Trigger manual fire alarms, evacuate using secondary staircases, assemble at the central sports ground. Never use elevators.</p>
            </div>
            <div style="padding: 1rem; background: var(--bg-surface-subtle); border-radius: var(--radius-md);">
              <div style="font-weight: 700; font-size: 0.88rem; color: #dc2626; margin-bottom: 0.35rem;">🛡️ Security or Threat</div>
              <p style="font-size: 0.78rem; color: var(--text-secondary); line-height: 1.45;">Report suspicious activities immediately to Gate 1 security guards. Stay in staffed offices until all-clear is broadcasted.</p>
            </div>
          </div>
        </div>

      </div>
    `;
  }

  static handleToggleSos() {
    appState.toggleSos();
    const container = document.getElementById('viewContainer');
    if (container && appState.activeView === 'emergency') {
      EmergencyView.render(container);
    }
  }

  static toggleSound() {
    appState.toggleSosSound();
    const container = document.getElementById('viewContainer');
    if (container && appState.activeView === 'emergency') {
      EmergencyView.render(container);
    }
  }

  static postBroadcast() {
    const input = document.getElementById('sosBroadcastInput');
    if (!input) return;
    const val = input.value.trim();
    if (!val) return;

    appState.addEmergencyBroadcast(val);
    input.value = '';
    const container = document.getElementById('viewContainer');
    if (container && appState.activeView === 'emergency') {
      EmergencyView.render(container);
    }
  }
}

window.EmergencyView = EmergencyView;
