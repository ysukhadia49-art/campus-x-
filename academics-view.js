/* ==========================================================
   Campus X AI - Academics, Timetable & AI Risk View
   Official Tapi Diploma Engineering College 5th Sem IT Timetable
   ========================================================== */

class AcademicsView {
  static renderTimetable(container) {
    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 1.5rem;">
        <!-- INSTITUTION HEADER -->
        <div class="card-editorial" style="padding: 1.5rem; border-left: 4px solid var(--color-accent-blue);">
          <div class="flex items-center justify-between" style="flex-wrap: wrap; gap: 1rem;">
            <div>
              <div style="font-size: 0.75rem; font-weight: 700; letter-spacing: 0.05em; color: var(--color-accent-blue); text-transform: uppercase;">
                Tapi Diploma Engineering College [647] • IT Dept [16]
              </div>
              <h2 style="font-size: 1.75rem; font-weight: 800; margin: 0.25rem 0;">Updated Time Table: 5th Semester</h2>
              <p style="font-size: 0.88rem; color: var(--text-secondary); margin: 0;">
                <strong>Class:</strong> 2452 - IT &nbsp;|&nbsp; 
                <strong>Class Room:</strong> S-21 / S-25 (Second Floor) &nbsp;|&nbsp; 
                <strong>Term Duration:</strong> 15/06/2026 To 30/10/2026
              </p>
            </div>
            <div style="display: flex; gap: 0.5rem; align-items: center;">
              <span class="badge badge-blue">Class 2452 - IT</span>
              <span class="badge badge-purple">40 Hrs/Week</span>
            </div>
          </div>
        </div>

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

  static renderAttendance(container) {
    // Dynamic attendance reading - NO PRE-FILLED / HARDCODED NUMBERS
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

    // Compute stats per subject if records exist
    const totalSessions = localRecords.length;
    let attendedSessions = 0;

    const subjectsData = officialSubjects.map(sub => {
      const subRecords = localRecords.filter(r => r.subject && r.subject.toUpperCase().includes(sub.code.substring(0, 4)) || (r.subject && sub.name.toUpperCase().includes(r.subject.toUpperCase())));
      const held = subRecords.length;
      // In student view, check if student was present
      const attended = subRecords.filter(r => {
        if (r.records && Array.isArray(r.records)) {
          const userRoll = (appState.currentUser && appState.currentUser.rollNo) || "07";
          const match = r.records.find(s => s.rollNo === userRoll);
          return match ? match.present === true : false;
        }
        return true;
      }).length;
      attendedSessions += attended;
      const pct = held > 0 ? ((attended / held) * 100).toFixed(1) + "%" : "--%";
      return {
        ...sub,
        held,
        attended,
        pct,
        status: held === 0 ? "Pending Marking" : (attended / held >= 0.75 ? "Eligible" : "Attendance Low")
      };
    });

    const hasRecords = totalSessions > 0;
    const overallPct = hasRecords ? ((attendedSessions / totalSessions) * 100).toFixed(1) + "%" : "--%";

    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 1.5rem;">
        <div class="flex items-center justify-between" style="flex-wrap: wrap; gap: 1rem;">
          <div>
            <h2 style="font-size: 2rem; font-weight: 800;">Attendance Analytics</h2>
            <p style="font-size: 0.9rem; color: var(--text-secondary);">
              Tapi Diploma Engineering College • Class 2452 - IT (Semester 5)
            </p>
          </div>
          <span class="badge ${hasRecords ? 'badge-available' : 'badge-secondary'}" style="font-size: 0.85rem; padding: 0.4rem 0.8rem;">
            Overall: ${overallPct} ${hasRecords ? '' : '(No Records Marked Yet)'}
          </span>
        </div>

        <!-- AI RISK ASSESSMENT -->
        <div class="card-editorial" style="background: ${hasRecords ? 'var(--tint-soft-green)' : 'var(--bg-surface-subtle)'}; border-color: ${hasRecords ? '#A7F3D0' : 'var(--border-color)'};">
          <div class="flex justify-between items-center" style="margin-bottom: 0.5rem; flex-wrap: wrap; gap: 0.5rem;">
            <div class="flex items-center gap-2">
              <span class="badge ${hasRecords ? 'badge-available' : 'badge-blue'}">AI Risk Assessment</span>
              <strong style="color: ${hasRecords ? 'var(--color-success)' : 'var(--text-primary)'}; font-size: 1rem;">
                Academic Standing: ${hasRecords ? 'Active Tracking' : 'Awaiting Faculty Attendance Submissions'}
              </strong>
            </div>
            <span style="font-size: 0.78rem; color: var(--text-muted); font-weight: 600;">
              GTU Mandatory Minimum: 75%
            </span>
          </div>
          <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5; margin: 0;">
            ${hasRecords 
              ? `Real-time attendance recorded across ${totalSessions} sessions. Keep attending all theory and lab practicals to maintain university clearance.`
              : `All pre-filled mock attendance has been cleared for the new term (15/06/2026 - 30/10/2026). As faculty mark sessions in the Faculty Portal, live attendance calculations and GTU statutory compliance will dynamically update here.`
            }
          </p>
        </div>

        <!-- SUBJECT BREAKDOWN TABLE -->
        <div class="table-responsive-card">
          <table class="data-table">
            <thead>
              <tr>
                <th>Subject Code & Name</th>
                <th>Assigned Faculty</th>
                <th>Lectures Attended</th>
                <th>Total Held</th>
                <th>Attendance %</th>
                <th>Status</th>
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
                    <span class="badge ${s.held === 0 ? 'badge-secondary' : (s.attended / s.held >= 0.75 ? 'badge-available' : 'badge-error')}">
                      ${s.status}
                    </span>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <!-- QUICK HELPER -->
        <div style="font-size: 0.8rem; color: var(--text-muted); text-align: right;">
          Faculty can record new class attendance anytime from the <a href="javascript:void(0)" onclick="appState.setView('attendance-mark')" style="color: var(--color-accent-blue); text-decoration: underline; font-weight: 600;">Faculty Portal &rarr;</a>
        </div>
      </div>
    `;
  }
}
