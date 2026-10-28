/* ==========================================================
   Campus X AI - Academics, Timetable & AI Risk View
   Official Tapi Diploma Engineering College 5th Sem IT Timetable
   ========================================================== */

class AcademicsView {
  static selectedTimetableId = 'default';
  static pendingUploadFile = null;

  static selectTimetable(id) {
    AcademicsView.selectedTimetableId = id;
    const container = document.getElementById('viewContainer');
    if (container) AcademicsView.renderTimetable(container);
  }

  static onClassSelectChange(val) {
    const customWrap = document.getElementById('modalTtCustomClassWrap');
    if (customWrap) {
      customWrap.style.display = val === '__custom__' ? 'block' : 'none';
    }
  }

  static renderTimetable(container) {
    const timetables = (typeof CAMPUS_DATA !== 'undefined' && Array.isArray(CAMPUS_DATA.uploadedTimetables)) 
      ? CAMPUS_DATA.uploadedTimetables 
      : [];

    let current = null;
    if (AcademicsView.selectedTimetableId && AcademicsView.selectedTimetableId !== 'default') {
      current = timetables.find(t => t.id === AcademicsView.selectedTimetableId);
    }
    if (!current && timetables.length > 0) {
      current = timetables.find(t => t.isDefault) || timetables[0];
    }

    const isCustomSelected = current && current.id !== 'TT-2452-BASE';
    const displayClass = current ? current.classId : 'Class 2452 - IT';
    const displayRoom = current ? current.room : 'S-21 / S-25 (Second Floor)';
    const displayTerm = current ? current.term : '15/06/2026 To 30/10/2026';
    const displayTitle = current ? current.title : 'Updated Time Table: 5th Semester';
    const displayDept = current ? current.department : 'Tapi Diploma Engineering College [647] • IT Dept [16]';
    const canManage = appState.currentUser && (appState.currentUser.role === 'ADMIN' || appState.currentUser.role === 'FACULTY');

    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 1.5rem;">
        
        <!-- INSTITUTION HEADER & ACTIONS STRIP -->
        <div class="card-editorial" style="padding: 1.5rem; border-left: 4px solid var(--color-accent-blue);">
          <div class="flex items-center justify-between" style="flex-wrap: wrap; gap: 1rem;">
            <div>
              <div style="font-size: 0.75rem; font-weight: 700; letter-spacing: 0.05em; color: var(--color-accent-blue); text-transform: uppercase;">
                ${displayDept}
              </div>
              <h2 style="font-size: 1.75rem; font-weight: 800; margin: 0.25rem 0;">${displayTitle}</h2>
              <p style="font-size: 0.88rem; color: var(--text-secondary); margin: 0;">
                <strong>Class:</strong> ${displayClass} &nbsp;|&nbsp; 
                <strong>Class Room:</strong> ${displayRoom} &nbsp;|&nbsp; 
                <strong>Term Duration:</strong> ${displayTerm}
              </p>
            </div>
            
            <div class="flex items-center gap-2" style="flex-wrap: wrap;">
              <button class="btn btn-primary" onclick="AcademicsView.openTimetableUploadModal()" style="box-shadow: 0 2px 6px rgba(37,99,235,0.25);">
                <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                <span>Upload Timetable</span>
              </button>
              
              <button class="btn btn-secondary" onclick="window.print()">
                <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
                <span>Print / PDF</span>
              </button>
            </div>
          </div>
        </div>

        <!-- TIMETABLE SELECTOR STRIP -->
        <div class="timetable-selector-strip">
          <div style="display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap;">
            <label style="font-size: 0.82rem; font-weight: 700; color: var(--text-secondary); white-space: nowrap;">
              Class Timetable Schedule:
            </label>
            <select class="form-input" style="padding: 0.4rem 0.75rem; font-size: 0.85rem; font-weight: 600; min-width: 280px;" onchange="AcademicsView.selectTimetable(this.value)">
              <option value="default" ${(!current || current.id === 'TT-2452-BASE') ? 'selected' : ''}>Class 2452 - IT (Official 5th Sem IT Matrix)</option>
              ${timetables.filter(t => t.id !== 'TT-2452-BASE').map(t => `
                <option value="${t.id}" ${current && current.id === t.id ? 'selected' : ''}>
                  ${t.title} (${t.classId} • ${t.semester})
                </option>
              `).join('')}
            </select>
          </div>
          <div style="display: flex; gap: 0.5rem; align-items: center; font-size: 0.8rem; color: var(--text-muted); flex-wrap: wrap;">
            <span class="badge badge-blue">${displayClass}</span>
            <span class="badge badge-purple">${current ? current.totalHours || 40 : 40} Hrs/Week</span>
            ${current && current.uploadedBy ? `<span>&bull; Published by <strong>${current.uploadedBy}</strong></span>` : ''}
          </div>
        </div>

        <!-- UPLOADED TIMETABLE HIGHLIGHT CARD (Shown when a custom uploaded schedule is selected) -->
        ${isCustomSelected ? `
          <div class="card-editorial" style="padding: 1.5rem; border: 1px solid var(--color-accent-blue); background: #ffffff;">
            <div class="flex items-center justify-between" style="flex-wrap: wrap; gap: 1rem; margin-bottom: 1rem;">
              <div>
                <div class="flex items-center gap-2" style="margin-bottom: 0.3rem;">
                  <span class="badge badge-blue">${current.classId}</span>
                  <span class="badge badge-purple">${current.semester}</span>
                  ${current.isDefault ? '<span class="badge badge-green">Default Class Schedule</span>' : ''}
                </div>
                <h3 style="font-size: 1.3rem; font-weight: 800; margin: 0.2rem 0; color: var(--text-primary);">${current.title}</h3>
                <p style="font-size: 0.82rem; color: var(--text-secondary); margin: 0;">
                  <strong>Dept:</strong> ${current.department} &nbsp;|&nbsp; 
                  <strong>Classroom:</strong> ${current.room} &nbsp;|&nbsp; 
                  <strong>Duration:</strong> ${current.term}
                </p>
              </div>
              <div class="flex items-center gap-2">
                ${current.attachmentData || current.attachmentName ? `
                  <button class="btn btn-primary" onclick="AcademicsView.downloadAttachment('${current.id}')">
                    <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                    <span>Download Document</span>
                  </button>
                ` : ''}
                ${current.attachmentData && current.attachmentType && current.attachmentType.startsWith('image/') ? `
                  <button class="btn btn-secondary" onclick="AcademicsView.previewAttachment('${current.id}')">
                    <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    <span>Preview Scan</span>
                  </button>
                ` : ''}
                ${canManage ? `
                  <button class="btn btn-secondary" style="color: var(--color-error); border-color: #fca5a5;" onclick="AcademicsView.confirmDelete('${current.id}')">
                    <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    <span>Delete</span>
                  </button>
                ` : ''}
              </div>
            </div>

            ${current.description ? `
              <div style="padding: 0.75rem 1rem; background: var(--bg-surface-subtle); border-left: 3px solid var(--color-accent-blue); border-radius: 4px; font-size: 0.85rem; margin-bottom: 1rem;">
                <strong>Academic Notice & Circular Notes:</strong> ${current.description}
              </div>
            ` : ''}

            ${current.attachmentName ? `
              <div class="file-preview-card">
                <div class="flex items-center gap-3">
                  <div style="width: 38px; height: 38px; border-radius: 6px; background: rgba(37, 99, 235, 0.1); color: var(--color-accent-blue); display: flex; align-items: center; justify-content: center;">
                    <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                  </div>
                  <div>
                    <div style="font-weight: 700; font-size: 0.88rem;">${current.attachmentName}</div>
                    <div style="font-size: 0.75rem; color: var(--text-muted);">${current.attachmentSize || 'Official PDF Document'} &bull; Published by ${current.uploadedBy || 'Faculty'}</div>
                  </div>
                </div>
                <button class="btn btn-secondary" style="padding: 0.35rem 0.75rem; font-size: 0.78rem;" onclick="AcademicsView.downloadAttachment('${current.id}')">
                  Download
                </button>
              </div>
            ` : ''}

            ${current.attachmentData && current.attachmentType && current.attachmentType.startsWith('image/') ? `
              <div style="margin-top: 1rem; text-align: center; background: #0f172a; border-radius: 8px; padding: 1rem;">
                <img src="${current.attachmentData}" alt="Uploaded Timetable" style="max-width: 100%; max-height: 480px; object-fit: contain; border-radius: 4px;">
              </div>
            ` : ''}
          </div>
        ` : ''}

        <!-- WEEKLY TIMETABLE GRID -->
        <div class="table-responsive-card">
          <table class="data-table" style="font-size: 0.82rem;">
            <thead>
              <tr style="background: var(--bg-surface-subtle);">
                <th style="min-width: 50px;">Sr</th>
                <th style="min-width: 110px;">Time</th>
                <th style="min-width: 140px;">Monday</th>
                <th style="min-width: 140px;">Tuesday</th>
                <th style="min-width: 140px;">Wednesday</th>
                <th style="min-width: 140px; background: rgba(59, 130, 246, 0.08);">Thursday</th>
                <th style="min-width: 140px;">Friday</th>
                <th style="min-width: 150px;">Saturday</th>
              </tr>
            </thead>
            <tbody>
              <!-- Period 1 -->
              <tr>
                <td style="font-weight: 700; text-align: center;">1</td>
                <td style="font-weight: 600; white-space: nowrap;">10:00 AM<br>TO<br>11:00 AM</td>
                <td>
                  <strong>SPC</strong><br>
                  <span style="font-size: 0.72rem; color: var(--text-muted);">DI05016061</span><br>
                  <span class="badge badge-blue" style="font-size: 0.7rem; padding: 2px 6px;">DPP</span>
                </td>
                <td>
                  <strong>AIPE</strong><br>
                  <span style="font-size: 0.72rem; color: var(--text-muted);">DI05016011</span><br>
                  <span class="badge badge-green" style="font-size: 0.7rem; padding: 2px 6px;">BBA</span>
                </td>
                <td>
                  <strong>AIPD</strong><br>
                  <span style="font-size: 0.72rem; color: var(--text-muted);">DI05016021</span><br>
                  <span class="badge badge-purple" style="font-size: 0.7rem; padding: 2px 6px;">DKP</span>
                </td>
                <td style="background: rgba(59, 130, 246, 0.04);">
                  <strong style="color: var(--color-accent-blue);">APTITUDE</strong><br>
                  <span style="font-size: 0.72rem; color: var(--text-muted);">-</span><br>
                  <span class="badge badge-blue" style="font-size: 0.7rem; padding: 2px 6px;">General</span>
                </td>
                <td>
                  <strong>SPC</strong><br>
                  <span style="font-size: 0.72rem; color: var(--text-muted);">DI05016061</span><br>
                  <span class="badge badge-blue" style="font-size: 0.7rem; padding: 2px 6px;">DPP</span>
                </td>
                <td rowspan="2" style="background: #F8FAFC; border-left: 2px solid var(--border-color); vertical-align: middle;">
                  <strong>MINOR PROJECT</strong><br>
                  <span style="font-size: 0.72rem; color: var(--text-muted);">DI05000341</span><br>
                  <div style="font-size: 0.75rem; margin-top: 4px;">A - AKV<br>B - DBL</div>
                  <span class="badge badge-secondary" style="font-size: 0.7rem; padding: 2px 6px; margin-top: 4px;">Lab T-13</span>
                </td>
              </tr>

              <!-- Period 2 -->
              <tr>
                <td style="font-weight: 700; text-align: center;">2</td>
                <td style="font-weight: 600; white-space: nowrap;">11:00 AM<br>TO<br>12:00 PM</td>
                <td>
                  <strong>AIPD</strong><br>
                  <span style="font-size: 0.72rem; color: var(--text-muted);">DI05016021</span><br>
                  <span class="badge badge-purple" style="font-size: 0.7rem; padding: 2px 6px;">DKP</span>
                </td>
                <td>
                  <strong>SPC</strong><br>
                  <span style="font-size: 0.72rem; color: var(--text-muted);">DI05016061</span><br>
                  <span class="badge badge-blue" style="font-size: 0.7rem; padding: 2px 6px;">DPP</span>
                </td>
                <td>
                  <strong>CDCT</strong><br>
                  <span style="font-size: 0.72rem; color: var(--text-muted);">DI05016031</span><br>
                  <span class="badge badge-peach" style="font-size: 0.7rem; padding: 2px 6px;">MSD</span>
                </td>
                <td style="background: rgba(59, 130, 246, 0.04);">
                  <strong>AIPE</strong><br>
                  <span style="font-size: 0.72rem; color: var(--text-muted);">DI05016011</span><br>
                  <span class="badge badge-green" style="font-size: 0.7rem; padding: 2px 6px;">BBA</span>
                </td>
                <td>
                  <strong>CDCT</strong><br>
                  <span style="font-size: 0.72rem; color: var(--text-muted);">DI05016031</span><br>
                  <span class="badge badge-peach" style="font-size: 0.7rem; padding: 2px 6px;">MSD</span>
                </td>
              </tr>

              <!-- Period 3 -->
              <tr>
                <td style="font-weight: 700; text-align: center;">3</td>
                <td style="font-weight: 600; white-space: nowrap;">12:00 PM<br>TO<br>01:00 PM</td>
                <td>
                  <strong>EIDW</strong><br>
                  <span style="font-size: 0.72rem; color: var(--text-muted);">DI05016081</span><br>
                  <span class="badge badge-secondary" style="font-size: 0.7rem; padding: 2px 6px;">KDV</span>
                </td>
                <td>
                  <strong>CDCT</strong><br>
                  <span style="font-size: 0.72rem; color: var(--text-muted);">DI05016031</span><br>
                  <span class="badge badge-peach" style="font-size: 0.7rem; padding: 2px 6px;">MSD</span>
                </td>
                <td>
                  <strong>AIPE</strong><br>
                  <span style="font-size: 0.72rem; color: var(--text-muted);">DI05016011</span><br>
                  <span class="badge badge-green" style="font-size: 0.7rem; padding: 2px 6px;">BBA</span>
                </td>
                <td style="background: rgba(59, 130, 246, 0.04);">
                  <strong>EIDW</strong><br>
                  <span style="font-size: 0.72rem; color: var(--text-muted);">DI05016081</span><br>
                  <span class="badge badge-secondary" style="font-size: 0.7rem; padding: 2px 6px;">KDV</span>
                </td>
                <td>
                  <strong>AIPD</strong><br>
                  <span style="font-size: 0.72rem; color: var(--text-muted);">DI05016021</span><br>
                  <span class="badge badge-purple" style="font-size: 0.7rem; padding: 2px 6px;">DKP</span>
                </td>
                <td style="text-align: center; color: var(--text-muted);">—</td>
              </tr>

              <!-- RECESS 1 -->
              <tr style="background: #F1F5F9; font-weight: 700; text-align: center; color: var(--text-secondary); letter-spacing: 0.1em;">
                <td colspan="2" style="font-size: 0.75rem;">01:00 PM TO 01:30 PM</td>
                <td colspan="6" style="padding: 0.5rem; font-size: 0.8rem;">☕ RECESS (LUNCH BREAK)</td>
              </tr>

              <!-- Period 4 & 5 (Lab Block 1) -->
              <tr>
                <td style="font-weight: 700; text-align: center;">4 & 5</td>
                <td style="font-weight: 600; white-space: nowrap;">01:30 PM<br>TO<br>03:20 PM<br><span style="font-size: 0.68rem; color: var(--text-muted);">(2-Hr Practical)</span></td>
                <td>
                  <div style="margin-bottom: 4px; padding-bottom: 4px; border-bottom: 1px dashed var(--border-color);">
                    <strong>SPC (A)</strong> <span style="font-size: 0.72rem;">(DPP)(T-16)</span>
                  </div>
                  <div>
                    <strong>EIDW (B)</strong> <span style="font-size: 0.72rem;">(KDV)(T-14)</span>
                  </div>
                </td>
                <td>
                  <div style="margin-bottom: 4px; padding-bottom: 4px; border-bottom: 1px dashed var(--border-color);">
                    <strong>AIPE (A)</strong> <span style="font-size: 0.72rem;">(AKV)(T-13)</span>
                  </div>
                  <div>
                    <strong>SPC (B)</strong> <span style="font-size: 0.72rem;">(DPP)(T-16)</span>
                  </div>
                </td>
                <td style="text-align: center; color: var(--text-muted); vertical-align: middle;">—</td>
                <td style="background: rgba(59, 130, 246, 0.04);">
                  <div style="margin-bottom: 4px; padding-bottom: 4px; border-bottom: 1px dashed var(--border-color);">
                    <strong>AIPD (A)</strong> <span style="font-size: 0.72rem;">(DKP)(T-16)</span>
                  </div>
                  <div>
                    <strong>AIPE (B)</strong> <span style="font-size: 0.72rem;">(AKV)(T-13)</span>
                  </div>
                </td>
                <td style="background: #F8FAFC; vertical-align: middle;">
                  <strong>MINOR PROJECT</strong><br>
                  <span style="font-size: 0.72rem; color: var(--text-muted);">DI05000341</span><br>
                  <div style="font-size: 0.75rem; margin-top: 4px;">A - NAP (T-15)<br>B - HSJ (T-14)</div>
                </td>
                <td style="text-align: center; color: var(--text-muted); vertical-align: middle;">—</td>
              </tr>

              <!-- RECESS 2 -->
              <tr style="background: #F1F5F9; font-weight: 700; text-align: center; color: var(--text-secondary); letter-spacing: 0.1em;">
                <td colspan="2" style="font-size: 0.75rem;">03:20 PM TO 03:30 PM</td>
                <td colspan="6" style="padding: 0.4rem; font-size: 0.8rem;">☕ SHORT RECESS</td>
              </tr>

              <!-- Period 6 & 7 (Lab Block 2) -->
              <tr>
                <td style="font-weight: 700; text-align: center;">6 & 7</td>
                <td style="font-weight: 600; white-space: nowrap;">03:30 PM<br>TO<br>05:30 PM<br><span style="font-size: 0.68rem; color: var(--text-muted);">(2-Hr Practical)</span></td>
                <td>
                  <div style="margin-bottom: 4px; padding-bottom: 4px; border-bottom: 1px dashed var(--border-color);">
                    <strong>CDCT (A)</strong> <span style="font-size: 0.72rem;">(MSD)(T-13)</span>
                  </div>
                  <div>
                    <strong>AIPD (B)</strong> <span style="font-size: 0.72rem;">(DKP)(T-15)</span>
                  </div>
                </td>
                <td style="text-align: center; color: var(--text-muted); vertical-align: middle;">—</td>
                <td style="text-align: center; color: var(--text-muted); vertical-align: middle;">—</td>
                <td style="background: rgba(59, 130, 246, 0.04);">
                  <div style="margin-bottom: 4px; padding-bottom: 4px; border-bottom: 1px dashed var(--border-color);">
                    <strong>EIDW (A)</strong> <span style="font-size: 0.72rem;">(KDV)(T-14)</span>
                  </div>
                  <div>
                    <strong>CDCT (B)</strong> <span style="font-size: 0.72rem;">(MSD)(T-13)</span>
                  </div>
                </td>
                <td style="background: #F8FAFC; vertical-align: middle;">
                  <strong>MINOR PROJECT</strong><br>
                  <span style="font-size: 0.72rem; color: var(--text-muted);">DI05000341</span><br>
                  <div style="font-size: 0.75rem; margin-top: 4px;">A - AKV<br>B - BBA (T-16)</div>
                </td>
                <td style="text-align: center; color: var(--text-muted); vertical-align: middle;">—</td>
              </tr>
            </tbody>
          </table>
        <!-- AUTHENTIC IT COMPUTER LAB SHOWCASE BANNER -->
        <div class="card-editorial" style="padding: 1.25rem; display: flex; align-items: center; gap: 1.5rem; flex-wrap: wrap; background: #ffffff;">
          <img src="img/tapi-it-computer-lab.jpg" alt="Tapi Diploma IT Computer Lab" onerror="this.src='tapi-it-computer-lab.jpg'" style="width: 240px; height: 135px; object-fit: cover; border-radius: var(--radius-md); box-shadow: 0 4px 12px rgba(0,0,0,0.12);">
          <div style="flex: 1; min-width: 240px;">
            <div class="flex items-center gap-2" style="margin-bottom: 0.35rem;">
              <span class="badge badge-blue">Official IT Lab Facility</span>
              <span class="badge badge-purple">Labs T-13, T-14, T-15, T-16</span>
            </div>
            <h3 style="margin: 0.25rem 0; font-size: 1.2rem; font-weight: 800;">IT Department Computer Laboratories</h3>
            <p style="margin: 0; font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5;">
              Workstations dedicated for 5th Semester practical batches: <strong>SPC Lab</strong> (DPP, T-16), <strong>AIPE Lab</strong> (AKV, T-13), <strong>AIPD Lab</strong> (DKP, T-16), <strong>CDCT Lab</strong> (MSD, T-13), <strong>EIDW Lab</strong> (KDV, T-14), and <strong>Minor Project</strong> (T-13, T-15, T-16).
            </p>
          </div>
        </div>

        <!-- TWO COLUMN REFERENCE MATRICES -->
        <div class="middle-split-grid" style="gap: 1.5rem;">
          <!-- COURSE REFERENCE TABLE -->
          <div class="card-editorial" style="padding: 1.5rem;">
            <h3 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 1rem;">Course Code & Teaching Scheme</h3>
            <div class="table-responsive-card">
              <table class="data-table" style="font-size: 0.78rem;">
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Course Title</th>
                    <th>TH</th>
                    <th>TU</th>
                    <th>PRAC</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style="font-family: monospace;">DI05000341</td>
                    <td><strong>Minor Project</strong></td>
                    <td>0</td>
                    <td>0</td>
                    <td>6</td>
                    <td><strong>6 hrs</strong></td>
                  </tr>
                  <tr>
                    <td style="font-family: monospace;">DI05016011</td>
                    <td><strong>AI with Prompt Engineering (AIPE)</strong></td>
                    <td>3</td>
                    <td>0</td>
                    <td>4</td>
                    <td><strong>7 hrs</strong></td>
                  </tr>
                  <tr>
                    <td style="font-family: monospace;">DI05016021</td>
                    <td><strong>AI Product Design (AIPD)</strong></td>
                    <td>3</td>
                    <td>0</td>
                    <td>4</td>
                    <td><strong>7 hrs</strong></td>
                  </tr>
                  <tr>
                    <td style="font-family: monospace;">DI05016031</td>
                    <td><strong>Cloud & Data Center Tech (CDCT)</strong></td>
                    <td>3</td>
                    <td>0</td>
                    <td>4</td>
                    <td><strong>7 hrs</strong></td>
                  </tr>
                  <tr>
                    <td style="font-family: monospace;">DI05016061</td>
                    <td><strong>Structured Programming with C (SPC)</strong></td>
                    <td>3</td>
                    <td>0</td>
                    <td>4</td>
                    <td><strong>7 hrs</strong></td>
                  </tr>
                  <tr>
                    <td style="font-family: monospace;">DI05016081</td>
                    <td><strong>Emotional Intelligence & Digital Wellbeing (EIDW)</strong></td>
                    <td>0</td>
                    <td>2</td>
                    <td>4</td>
                    <td><strong>6 hrs</strong></td>
                  </tr>
                  <tr style="background: var(--bg-surface-subtle); font-weight: 700;">
                    <td colspan="2">Total Teaching Scheme</td>
                    <td>12</td>
                    <td>2</td>
                    <td>26</td>
                    <td>40 hrs</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- FACULTY INITIALS DIRECTORY -->
          <div class="card-editorial" style="padding: 1.5rem;">
            <h3 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 1rem;">Faculty Directory & Initials</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; font-size: 0.8rem;">
              <div style="padding: 0.5rem; background: var(--bg-surface-subtle); border-radius: 6px;">
                <span class="badge badge-green" style="font-size: 0.7rem;">BBA</span><br>
                <strong>Mrs. Binita B. Acharya</strong><br>
                <span style="font-size: 0.74rem; color: var(--text-muted);">I/C H.O.D.</span>
              </div>
              <div style="padding: 0.5rem; background: var(--bg-surface-subtle); border-radius: 6px;">
                <span class="badge badge-blue" style="font-size: 0.7rem;">DPP</span><br>
                <strong>Mrs. Disha P. Prajapati</strong><br>
                <span style="font-size: 0.74rem; color: var(--text-muted);">SPC Faculty</span>
              </div>
              <div style="padding: 0.5rem; background: var(--bg-surface-subtle); border-radius: 6px;">
                <span class="badge badge-purple" style="font-size: 0.7rem;">DKP</span><br>
                <strong>Mrs. Dipika K. Patel</strong><br>
                <span style="font-size: 0.74rem; color: var(--text-muted);">AIPD Faculty</span>
              </div>
              <div style="padding: 0.5rem; background: var(--bg-surface-subtle); border-radius: 6px;">
                <span class="badge badge-peach" style="font-size: 0.7rem;">MSD</span><br>
                <strong>Miss. Mayuri S. Devganiya</strong><br>
                <span style="font-size: 0.74rem; color: var(--text-muted);">CDCT Faculty</span>
              </div>
              <div style="padding: 0.5rem; background: var(--bg-surface-subtle); border-radius: 6px;">
                <span class="badge badge-secondary" style="font-size: 0.7rem;">KDV</span><br>
                <strong>Ms. Krupali D. Vaghashiya</strong><br>
                <span style="font-size: 0.74rem; color: var(--text-muted);">EIDW Faculty</span>
              </div>
              <div style="padding: 0.5rem; background: var(--bg-surface-subtle); border-radius: 6px;">
                <span class="badge badge-blue" style="font-size: 0.7rem;">AKV</span><br>
                <strong>Mrs. Aesha K. Virani</strong><br>
                <span style="font-size: 0.74rem; color: var(--text-muted);">AIPE & Project</span>
              </div>
              <div style="padding: 0.5rem; background: var(--bg-surface-subtle); border-radius: 6px;">
                <span class="badge badge-secondary" style="font-size: 0.7rem;">NAP</span><br>
                <strong>Miss. Nikita A. Patel</strong><br>
                <span style="font-size: 0.74rem; color: var(--text-muted);">Minor Project</span>
              </div>
              <div style="padding: 0.5rem; background: var(--bg-surface-subtle); border-radius: 6px;">
                <span class="badge badge-secondary" style="font-size: 0.7rem;">HSJ</span><br>
                <strong>Mrs. Hina S. Jayani</strong><br>
                <span style="font-size: 0.74rem; color: var(--text-muted);">Minor Project</span>
              </div>
            </div>
            <div style="margin-top: 1rem; padding-top: 0.75rem; border-top: 1px solid var(--border-color); font-size: 0.78rem; color: var(--text-secondary); display: flex; justify-content: space-between;">
              <span><strong>Principal:</strong> Dr. Y. S. Choupare</span>
              <span><strong>Dept:</strong> IT [16]</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // ==========================================================
  // TIMETABLE UPLOAD MODAL & WORKFLOW (Section 21)
  // ==========================================================
  static openTimetableUploadModal() {
    AcademicsView.pendingUploadFile = null;
    const today = new Date().toISOString().split('T')[0];

    AppModal.show({
      title: "Upload Class Timetable & Schedule",
      maxWidth: "580px",
      confirmText: "Publish Timetable",
      confirmClass: "btn-primary",
      onConfirm: () => {
        AcademicsView.submitTimetableUpload();
      },
      content: `
        <form id="ttUploadForm" onsubmit="event.preventDefault(); AcademicsView.submitTimetableUpload();" style="display: flex; flex-direction: column; gap: 1rem;">
          
          <div class="form-group">
            <label class="form-label">Timetable Title <span style="color: var(--color-error);">*</span></label>
            <input type="text" class="form-input" id="modalTtTitle" placeholder="e.g. Revised 5th Sem IT Weekly Time Table" value="Revised 5th Sem IT Weekly Time Table" required maxlength="150">
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
            <div class="form-group">
              <label class="form-label">Target Class & Sem <span style="color: var(--color-error);">*</span></label>
              <select class="form-input" id="modalTtClass" onchange="AcademicsView.onClassSelectChange(this.value)">
                <option value="Class 2452 - IT (5th Semester)">Class 2452 - IT (5th Sem)</option>
                <option value="Class 2451 - IT (3rd Semester)">Class 2451 - IT (3rd Sem)</option>
                <option value="Class 2450 - IT (1st Semester)">Class 2450 - IT (1st Sem)</option>
                <option value="Class 2453 - Computer Eng (5th Semester)">Computer Eng (5th Sem)</option>
                <option value="Class 2454 - Mechanical Eng (5th Semester)">Mechanical Eng (5th Sem)</option>
                <option value="Class 2455 - Electrical Eng (5th Semester)">Electrical Eng (5th Sem)</option>
                <option value="Class 2456 - Civil Eng (5th Semester)">Civil Eng (5th Sem)</option>
                <option value="__custom__">+ Custom Class / Division</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Department</label>
              <select class="form-input" id="modalTtDept">
                <option value="Information Technology [16]">Information Technology [16]</option>
                <option value="Computer Engineering [07]">Computer Engineering [07]</option>
                <option value="Mechanical Engineering [19]">Mechanical Engineering [19]</option>
                <option value="Electrical Engineering [09]">Electrical Engineering [09]</option>
                <option value="Civil Engineering [06]">Civil Engineering [06]</option>
                <option value="General Science & Humanities">General Science & Humanities</option>
              </select>
            </div>
          </div>

          <div class="form-group" id="modalTtCustomClassWrap" style="display: none;">
            <label class="form-label">Enter Custom Class Name</label>
            <input type="text" class="form-input" id="modalTtCustomClass" placeholder="e.g. Class 2457 - AI & DS (Sem 5)">
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
            <div class="form-group">
              <label class="form-label">Classroom / Lab Location</label>
              <input type="text" class="form-input" id="modalTtRoom" placeholder="e.g. S-21 / S-25 (Second Floor)" value="S-21 / S-25 (Second Floor)">
            </div>
            <div class="form-group">
              <label class="form-label">Effective From Date</label>
              <input type="date" class="form-input" id="modalTtEffectiveDate" value="${today}">
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Term Duration</label>
            <input type="text" class="form-input" id="modalTtTerm" placeholder="e.g. 15/06/2026 To 30/10/2026" value="15/06/2026 To 30/10/2026">
          </div>

          <!-- DRAG & DROP FILE UPLOAD AREA -->
          <div class="form-group">
            <label class="form-label">Official Timetable Document (PDF, Image scan, or Excel) <span style="color: var(--color-error);">*</span></label>
            <div class="file-drop-zone" id="ttModalDropZone" 
                 onclick="document.getElementById('modalTtFileInput').click()"
                 ondragover="event.preventDefault(); this.classList.add('dragover');"
                 ondragleave="this.classList.remove('dragover');"
                 ondrop="event.preventDefault(); this.classList.remove('dragover'); AcademicsView.handleFileSelection(event, true);">
              
              <input type="file" id="modalTtFileInput" accept=".pdf,.png,.jpg,.jpeg,.webp,.csv,.xlsx" style="display:none;" onchange="AcademicsView.handleFileSelection(event, false)">
              
              <div id="ttModalPrompt">
                <div style="width: 44px; height: 44px; margin: 0 auto 0.5rem; border-radius: 50%; background: rgba(37, 99, 235, 0.1); color: var(--color-accent-blue); display: flex; align-items: center; justify-content: center;">
                  <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                </div>
                <div style="font-weight: 700; color: var(--text-primary); font-size: 0.92rem;">Click to browse, or drag & drop timetable file here</div>
                <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.25rem;">Supports PDF circulars, JPG/PNG timetable charts, or spreadsheets (up to 10MB)</div>
              </div>

              <div id="ttModalFileSuccess" style="display:none; text-align: left;"></div>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Remarks / Special Instructions (Optional)</label>
            <textarea class="form-input" id="modalTtNotes" rows="2" placeholder="e.g. Approved by H.O.D. & Principal. Swapped CDCT & AIPD practical lab hours."></textarea>
          </div>

          <div class="flex items-center gap-2">
            <input type="checkbox" id="modalTtIsDefault" checked style="width: 16px; height: 16px; accent-color: var(--color-primary); cursor: pointer;">
            <label for="modalTtIsDefault" style="font-size: 0.85rem; font-weight: 600; cursor: pointer;">
              Set as current active schedule for this class
            </label>
          </div>
        </form>
      `
    });
  }

  static handleFileSelection(event, isDrop = false) {
    let file = null;
    if (isDrop && event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]) {
      file = event.dataTransfer.files[0];
    } else if (event.target && event.target.files && event.target.files[0]) {
      file = event.target.files[0];
    }
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      appState.showToast('File exceeds 10MB limit. Please upload a smaller document.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      const sizeStr = file.size > 1024 * 1024 
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.round(file.size / 1024)} KB`;

      AcademicsView.pendingUploadFile = {
        name: file.name,
        size: sizeStr,
        type: file.type,
        data: dataUrl
      };

      const promptEl = document.getElementById('ttModalPrompt');
      const successEl = document.getElementById('ttModalFileSuccess');
      if (promptEl && successEl) {
        promptEl.style.display = 'none';
        successEl.style.display = 'block';
        successEl.innerHTML = `
          <div class="file-preview-card" style="margin: 0; background: #ffffff;">
            <div class="flex items-center gap-3">
              <div style="width: 36px; height: 36px; border-radius: 6px; background: rgba(16, 185, 129, 0.12); color: var(--color-success); display: flex; align-items: center; justify-content: center; font-weight: 800;">
                ✓
              </div>
              <div>
                <div style="font-weight: 700; font-size: 0.88rem; color: var(--text-primary);">${file.name}</div>
                <div style="font-size: 0.75rem; color: var(--text-muted);">${sizeStr} &bull; Ready to Publish</div>
              </div>
            </div>
            <button type="button" class="btn btn-secondary" style="padding: 0.25rem 0.6rem; font-size: 0.74rem;" onclick="event.stopPropagation(); document.getElementById('modalTtFileInput').click();">
              Change
            </button>
          </div>
        `;
      }
    };
    reader.readAsDataURL(file);
  }

  static submitTimetableUpload() {
    const titleEl = document.getElementById('modalTtTitle');
    const classEl = document.getElementById('modalTtClass');
    const customClassEl = document.getElementById('modalTtCustomClass');
    const deptEl = document.getElementById('modalTtDept');
    const roomEl = document.getElementById('modalTtRoom');
    const termEl = document.getElementById('modalTtTerm');
    const effectiveEl = document.getElementById('modalTtEffectiveDate');
    const notesEl = document.getElementById('modalTtNotes');
    const defaultEl = document.getElementById('modalTtIsDefault');

    if (!titleEl) return;
    const title = titleEl.value.trim();
    if (!title) {
      appState.showToast('Please enter a timetable title.', 'error');
      return;
    }

    let classVal = classEl ? classEl.value : 'Class 2452 - IT (5th Semester)';
    if (classVal === '__custom__' && customClassEl && customClassEl.value.trim()) {
      classVal = customClassEl.value.trim();
    }

    const dept = deptEl ? deptEl.value : 'Information Technology [16]';
    const room = roomEl ? roomEl.value.trim() : 'S-21 / S-25';
    const term = termEl ? termEl.value.trim() : '15/06/2026 To 30/10/2026';
    const effectiveDate = effectiveEl ? effectiveEl.value : new Date().toISOString().split('T')[0];
    const notes = notesEl ? notesEl.value.trim() : '';
    const isDefault = defaultEl ? defaultEl.checked : true;

    const file = AcademicsView.pendingUploadFile || {
      name: `${title.replace(/\s+/g, '_')}.pdf`,
      size: '185 KB',
      type: 'application/pdf',
      data: null
    };

    const record = appState.uploadTimetable({
      title,
      classId: classVal.split('(')[0].trim(),
      semester: classVal.includes('(') ? classVal.split('(')[1].replace(')', '') : '5th Semester',
      department: dept,
      room,
      term,
      effectiveDate,
      description: notes,
      isDefault,
      attachmentName: file.name,
      attachmentSize: file.size,
      attachmentData: file.data,
      attachmentType: file.type
    });

    if (record) {
      AcademicsView.selectedTimetableId = record.id;
      const container = document.getElementById('viewContainer');
      if (container) {
        AcademicsView.renderTimetable(container);
      }
    }
  }

  static downloadAttachment(id) {
    const timetables = (typeof CAMPUS_DATA !== 'undefined' && Array.isArray(CAMPUS_DATA.uploadedTimetables)) 
      ? CAMPUS_DATA.uploadedTimetables 
      : [];
    const t = timetables.find(item => item.id === id);
    if (!t) {
      appState.showToast('Timetable document not found.', 'error');
      return;
    }

    if (t.attachmentData) {
      const a = document.createElement('a');
      a.href = t.attachmentData;
      a.download = t.attachmentName || `Timetable_${t.classId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      appState.showToast(`Downloading ${t.attachmentName}...`, 'success');
    } else {
      const content = `TAPI DIPLOMA ENGINEERING COLLEGE [647]
DEPARTMENT: ${t.department}
CLASS: ${t.classId} (${t.room})
TERM: ${t.term}
EFFECTIVE DATE: ${t.effectiveDate}

TITLE: ${t.title}
PUBLISHED BY: ${t.uploadedBy} (${t.uploadedByRole})
REMARKS: ${t.description || 'Approved official schedule.'}

Weekly Lecture & Practical Allocation:
- Monday to Friday: 10:00 AM to 05:30 PM
- Saturday: 10:00 AM to 01:00 PM (Minor Project)
Official GTU Statutory Compliance.`;

      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = t.attachmentName ? t.attachmentName.replace('.pdf', '.txt') : `Timetable_${t.classId}.txt`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      appState.showToast('Downloaded official timetable particulars.', 'success');
    }
  }

  static confirmDelete(id) {
    if (confirm('Are you sure you want to remove this timetable?')) {
      appState.deleteTimetable(id);
      AcademicsView.selectedTimetableId = 'default';
      const container = document.getElementById('viewContainer');
      if (container) AcademicsView.renderTimetable(container);
    }
  }

  static previewAttachment(id) {
    const timetables = (typeof CAMPUS_DATA !== 'undefined' && Array.isArray(CAMPUS_DATA.uploadedTimetables)) 
      ? CAMPUS_DATA.uploadedTimetables 
      : [];
    const t = timetables.find(item => item.id === id);
    if (!t || !t.attachmentData) return;

    AppModal.show({
      title: `Preview: ${t.attachmentName || t.title}`,
      maxWidth: "750px",
      confirmText: "Download File",
      confirmClass: "btn-primary",
      onConfirm: () => AcademicsView.downloadAttachment(id),
      content: `
        <div style="text-align: center; max-height: 70vh; overflow: auto; background: #0f172a; border-radius: 8px; padding: 1rem;">
          <img src="${t.attachmentData}" alt="${t.title}" style="max-width: 100%; height: auto; border-radius: 4px;">
        </div>
      `
    });
  }

  static renderAttendance(container) {
    let localRecords = [];
    try {
      localRecords = JSON.parse(localStorage.getItem('campusx_attendance_records') || '[]');
    } catch (e) {
      localRecords = [];
    }

    const officialSubjects = [
      { code: "DI05016061", name: "SPC (Structured Programming with C)", faculty: "Mrs. Disha P. Prajapati (DPP)" },
      { code: "DI05016011", name: "AIPE (AI with Prompt Engineering)", faculty: "Mrs. Binita B. Acharya (BBA)" },
      { code: "DI05016021", name: "AIPD (AI Product Design)", faculty: "Mrs. Dipika K. Patel (DKP)" },
      { code: "DI05016031", name: "CDCT (Cloud and Data Center Tech)", faculty: "Miss. Mayuri S. Devganiya (MSD)" },
      { code: "DI05016081", name: "EIDW (Emotional Intelligence & Digital Wellbeing)", faculty: "Ms. Krupali D. Vaghashiya (KDV)" },
      { code: "DI05000341", name: "Minor Project", faculty: "Mrs. Aesha Virani / Miss Nikita Patel" }
    ];

    const isStudent = appState.currentUser && appState.currentUser.role === 'STUDENT';
    const isAdmin = appState.currentUser && appState.currentUser.role === 'ADMIN';
    const isFaculty = appState.currentUser && appState.currentUser.role === 'FACULTY';
    const userIdentifier = appState.currentUser ? (appState.currentUser.id || appState.currentUser.rollNo || appState.currentUser.name) : '07';

    const totalSessions = localRecords.length;
    let attendedSessions = 0;

    const subjectsData = officialSubjects.map(sub => {
      const subRecords = localRecords.filter(r => 
        (r.subject && r.subject.toUpperCase().includes(sub.code.substring(0, 4))) || 
        (r.subject && sub.name.toUpperCase().includes(r.subject.toUpperCase())) ||
        (r.subject && r.subject.toUpperCase().includes(sub.name.split(' ')[0].toUpperCase()))
      );
      const held = subRecords.length;

      let attended = 0;
      if (isStudent) {
        attended = subRecords.filter(r => {
          if (r.records && Array.isArray(r.records)) {
            const cleanId = String(userIdentifier).toLowerCase();
            const match = r.records.find(s => 
              (s.enrollment && s.enrollment.toLowerCase() === cleanId) ||
              (s.rollNo && s.rollNo.toLowerCase() === cleanId) ||
              (s.name && s.name.toLowerCase() === cleanId)
            );
            return match ? match.present === true : false;
          }
          return true;
        }).length;
        attendedSessions += attended;
      } else {
        // Average attendance for class
        let totalPresentCount = 0;
        let totalStudentCount = 0;
        subRecords.forEach(r => {
          if (Array.isArray(r.records)) {
            totalPresentCount += r.records.filter(s => s.present === true).length;
            totalStudentCount += r.records.length;
          }
        });
        attended = held > 0 && totalStudentCount > 0 ? (totalPresentCount / subRecords.length).toFixed(0) : 0;
      }

      const pct = held > 0 
        ? (isStudent ? ((attended / held) * 100).toFixed(1) + "%" : "Active Tracking") 
        : "--%";

      return {
        ...sub,
        held,
        attended,
        pct,
        status: held === 0 ? "Pending Marking" : (isStudent ? (attended / held >= 0.75 ? "Eligible" : "Attendance Low") : "Logged")
      };
    });

    // Student stats
    const studentStats = CAMPUS_DATA.getStudentAttendance(userIdentifier);
    const hasRecords = totalSessions > 0;

    // Class roster stats for Admin & Faculty
    const rosterStats = (CAMPUS_DATA.studentRoster || []).map(student => {
      const stats = CAMPUS_DATA.getStudentAttendance(student.enrollment);
      return {
        ...student,
        stats
      };
    });

    const atRiskCount = rosterStats.filter(s => s.stats.totalHeld > 0 && !s.stats.compliant).length;

    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 1.5rem;">
        
        <!-- HEADER -->
        <div class="flex items-center justify-between" style="flex-wrap: wrap; gap: 1rem;">
          <div>
            <div class="flex items-center gap-2" style="margin-bottom: 0.25rem;">
              <span class="badge badge-blue">Class 2452 - IT (Semester 5)</span>
              <span class="badge badge-green">● LIVE REAL-TIME</span>
            </div>
            <h2 style="font-size: 2rem; font-weight: 800; color: var(--text-primary); margin: 0;">Attendance Analytics & Tracking</h2>
            <p style="font-size: 0.9rem; color: var(--text-secondary); margin-top: 0.2rem;">
              Tapi Diploma Engineering College • Real-time statutory GTU 75% compliance tracking.
            </p>
          </div>

          <div class="flex items-center gap-2">
            ${(isAdmin || isFaculty) ? `
              <button class="btn btn-primary" onclick="appState.setView('attendance-mark')">
                <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                <span>Take Attendance</span>
              </button>
            ` : ''}
            <span class="badge ${hasRecords ? (isStudent ? (studentStats.compliant ? 'badge-available' : 'badge-out-of-stock') : 'badge-available') : 'badge-secondary'}" style="font-size: 0.85rem; padding: 0.4rem 0.85rem;">
              ${isStudent ? `Overall: ${studentStats.percentageStr}` : `Total Sessions: ${totalSessions}`}
            </span>
          </div>
        </div>

        <!-- SUMMARY STATS TILES -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
          <div class="card-editorial" style="padding: 1.25rem;">
            <span style="font-size: 0.72rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted);">Total Lectures Logged</span>
            <div style="font-size: 1.8rem; font-weight: 800; color: var(--text-primary); margin-top: 0.2rem;">${totalSessions}</div>
            <div style="font-size: 0.76rem; color: var(--color-accent-blue); font-weight: 600;">Across 6 IT subjects</div>
          </div>

          <div class="card-editorial" style="padding: 1.25rem;">
            <span style="font-size: 0.72rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted);">${isStudent ? 'Your Attended Sessions' : 'Enrolled Students'}</span>
            <div style="font-size: 1.8rem; font-weight: 800; color: var(--color-success); margin-top: 0.2rem;">${isStudent ? studentStats.totalAttended : '10'}</div>
            <div style="font-size: 0.76rem; color: var(--text-muted); font-weight: 600;">${isStudent ? `Out of ${totalSessions} held` : 'Class 2452 - IT'}</div>
          </div>

          <div class="card-editorial" style="padding: 1.25rem;">
            <span style="font-size: 0.72rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted);">${isStudent ? 'Your Attendance Rate' : 'GTU 75% Rule Compliance'}</span>
            <div style="font-size: 1.8rem; font-weight: 800; color: ${isStudent ? (studentStats.compliant ? 'var(--color-success)' : 'var(--color-error)') : (atRiskCount > 0 ? 'var(--color-warning)' : 'var(--color-success)')}; margin-top: 0.2rem;">
              ${isStudent ? studentStats.percentageStr : (hasRecords ? `${10 - atRiskCount} of 10 Eligible` : 'Awaiting Records')}
            </div>
            <div style="font-size: 0.76rem; color: ${isStudent ? (studentStats.compliant ? 'var(--color-success)' : 'var(--color-error)') : 'var(--text-muted)'}; font-weight: 600;">
              ${isStudent ? (studentStats.compliant ? '✓ University Eligible' : '⚠️ Risk of Detention') : `${atRiskCount} at risk (<75%)`}
            </div>
          </div>

          <div class="card-editorial" style="padding: 1.25rem;">
            <span style="font-size: 0.72rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted);">Term Duration</span>
            <div style="font-size: 1.8rem; font-weight: 800; color: var(--color-accent-blue); margin-top: 0.2rem;">Term '26</div>
            <div style="font-size: 0.76rem; color: var(--text-muted); font-weight: 600;">15/06/2026 To 30/10/2026</div>
          </div>
        </div>

        <!-- AI RISK COMPLIANCE BANNER -->
        <div class="card-editorial" style="background: ${hasRecords ? (isStudent && !studentStats.compliant ? '#FEF2F2' : 'var(--tint-soft-green)') : 'var(--bg-surface-subtle)'}; border-left: 4px solid ${hasRecords ? (isStudent && !studentStats.compliant ? 'var(--color-error)' : 'var(--color-success)') : 'var(--color-accent-blue)'};">
          <div class="flex justify-between items-center" style="margin-bottom: 0.4rem; flex-wrap: wrap; gap: 0.5rem;">
            <div class="flex items-center gap-2">
              <span class="badge ${hasRecords ? 'badge-available' : 'badge-blue'}">AI Statutory Compliance Engine</span>
              <strong style="color: ${hasRecords ? (isStudent && !studentStats.compliant ? '#991B1B' : 'var(--color-success)') : 'var(--text-primary)'}; font-size: 0.95rem;">
                ${isStudent 
                  ? (hasRecords ? `Academic Standing: ${studentStats.statusText}` : 'Awaiting Faculty Lecture Submissions')
                  : `Class Performance: ${totalSessions} sessions recorded across IT department`
                }
              </strong>
            </div>
            <span style="font-size: 0.78rem; color: var(--text-muted); font-weight: 600;">
              GTU Mandatory Minimum: 75%
            </span>
          </div>
          <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5; margin: 0;">
            ${hasRecords 
              ? (isStudent 
                  ? `Your personal attendance is logged in real-time. You have attended ${studentStats.totalAttended} of ${totalSessions} sessions (${studentStats.percentageStr}). Maintain regular attendance to qualify for GTU winter examination hall tickets.`
                  : `Automated GTU statutory tracking is active for Class 2452 - IT. Faculty attendance submissions automatically synchronize across student portals, administrator dashboards, and institutional reports.`
                )
              : `All pre-filled mock attendance has been cleared for the new term. As faculty take roll calls in the Faculty Portal, live calculations will update here instantly in real time.`
            }
          </p>
        </div>

        <!-- SUBJECT BREAKDOWN TABLE -->
        <div class="card-editorial" style="padding: 1.5rem;">
          <h3 style="font-size: 1.15rem; font-weight: 700; margin-bottom: 1rem;">Subject-Wise Attendance Breakdown</h3>
          <div class="table-responsive-card">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Subject Code & Name</th>
                  <th>Faculty</th>
                  <th>${isStudent ? 'Your Attended' : 'Avg Students/Class'}</th>
                  <th>Sessions Held</th>
                  <th>Attendance %</th>
                  <th>Compliance Status</th>
                </tr>
              </thead>
              <tbody>
                ${subjectsData.map(s => `
                  <tr>
                    <td>
                      <strong>${s.name}</strong><br>
                      <span style="font-size: 0.72rem; font-family: monospace; color: var(--text-muted);">${s.code}</span>
                    </td>
                    <td>${s.faculty}</td>
                    <td style="font-weight: 600;">${s.held > 0 ? s.attended : 0}</td>
                    <td>${s.held}</td>
                    <td style="font-weight: 700;">${s.pct}</td>
                    <td>
                      <span class="badge ${s.held === 0 ? 'badge-secondary' : (s.status === 'Eligible' ? 'badge-available' : (s.status === 'Logged' ? 'badge-blue' : 'badge-out-of-stock'))}">
                        ${s.status}
                      </span>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- ADMIN & FACULTY ONLY: CLASS 2452 STUDENT ROSTER COMPLIANCE TABLE -->
        ${(isAdmin || isFaculty) ? `
          <div class="card-editorial" style="padding: 1.5rem;">
            <div class="flex items-center justify-between" style="margin-bottom: 1rem; flex-wrap: wrap; gap: 0.5rem;">
              <div>
                <h3 style="font-size: 1.15rem; font-weight: 700; margin: 0;">Class 2452 IT Student Roster Compliance</h3>
                <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.2rem;">Live individual student attendance tracking and GTU detention eligibility.</p>
              </div>
              <span class="badge badge-purple">10 Students Enrolled</span>
            </div>

            <div class="table-responsive-card">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Roll No</th>
                    <th>Enrollment ID</th>
                    <th>Student Name</th>
                    <th>Attended / Total</th>
                    <th>Attendance %</th>
                    <th>GTU Eligibility</th>
                  </tr>
                </thead>
                <tbody>
                  ${rosterStats.map(s => `
                    <tr>
                      <td style="font-weight: 700;">#${s.rollNo}</td>
                      <td style="font-family: monospace; color: var(--color-accent-blue);">${s.enrollment}</td>
                      <td style="font-weight: 600;">${s.name}</td>
                      <td>${s.stats.totalHeld > 0 ? `${s.stats.totalAttended} / ${s.stats.totalHeld}` : '0 / 0'}</td>
                      <td style="font-weight: 700; color: ${s.stats.totalHeld > 0 ? (s.stats.compliant ? 'var(--color-success)' : 'var(--color-error)') : 'var(--text-muted)'};">
                        ${s.stats.percentageStr}
                      </td>
                      <td>
                        <span class="badge ${s.stats.totalHeld === 0 ? 'badge-secondary' : (s.stats.compliant ? 'badge-available' : 'badge-out-of-stock')}">
                          ${s.stats.statusText}
                        </span>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        ` : ''}

        <!-- RECENT ATTENDANCE SESSIONS LOG -->
        <div class="card-editorial" style="padding: 1.5rem;">
          <h3 style="font-size: 1.15rem; font-weight: 700; margin-bottom: 1rem;">Recent Class Sessions Log</h3>
          ${localRecords.length === 0 ? `
            <div style="padding: 2rem 1rem; text-align: center; color: var(--text-muted);">
              <svg width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" style="margin: 0 auto 0.5rem; display: block; color: var(--color-accent-blue);"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              <div style="font-weight: 700; color: var(--text-primary); font-size: 0.95rem;">No Recorded Sessions Yet</div>
              <div style="font-size: 0.8rem; margin-top: 0.2rem;">When faculty mark attendance from the Faculty Portal, sessions appear here in real time.</div>
            </div>
          ` : `
            <div style="display: flex; flex-direction: column; gap: 0.75rem;">
              ${localRecords.slice(0, 8).map(sess => {
                const esc = window.SecurityUtils ? window.SecurityUtils.escapeHtml : (s => s);
                const presentCount = Array.isArray(sess.records) ? sess.records.filter(r => r.present === true).length : 0;
                const totalCount = Array.isArray(sess.records) ? sess.records.length : 0;
                return `
                  <div style="padding: 0.85rem; border-radius: var(--radius-md); border: 1px solid var(--border-color); background: var(--bg-surface-subtle); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
                    <div>
                      <div class="flex items-center gap-2">
                        <strong style="font-size: 0.92rem;">${esc(sess.subject)}</strong>
                        <span class="badge badge-blue" style="font-size: 0.7rem;">${esc(sess.classId || 'Class 2452 - IT')}</span>
                      </div>
                      <div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 0.2rem;">
                        Date: <strong>${esc(sess.date || 'Today')}</strong> • Marked by: <strong>${esc(sess.recordedBy || 'Faculty')}</strong>
                      </div>
                    </div>
                    <div style="text-align: right;">
                      <span class="badge badge-available">${presentCount} / ${totalCount} Present</span>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          `}
        </div>

      </div>
    `;
  }
}
