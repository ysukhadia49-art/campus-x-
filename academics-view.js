/* ==========================================================
   Campus X AI - Academics, Timetable & AI Risk View
   Sections 36-38, 46: Timetable, Attendance Breakdown & AI Risk UI
   ========================================================== */

class AcademicsView {
  static renderTimetable(container) {
    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 1.5rem;">
        <div class="flex items-center justify-between">
          <div>
            <h2 style="font-size: 2rem; font-weight: 800;">Class Timetable</h2>
            <p style="font-size: 0.9rem; color: var(--text-secondary);">Semester 5 • Class 2452 - IT • Tapi Diploma Engineering College</p>
          </div>
          <span class="badge badge-blue">Thursday Highlighted</span>
        </div>

        <div class="table-responsive-card">
          <table class="data-table">
            <thead>
              <tr>
                <th>Day</th>
                <th>09:00 - 10:00</th>
                <th>10:00 - 11:00</th>
                <th>11:15 - 01:15</th>
                <th>02:00 - 03:00</th>
                <th>03:00 - 04:00</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="font-weight: 700;">Monday</td>
                <td>AIPD (R-305)</td>
                <td>SPC (R-201)</td>
                <td>AIPD Lab (Lab 3)</td>
                <td>Python (R-204)</td>
                <td>Library</td>
              </tr>
              <tr>
                <td style="font-weight: 700;">Tuesday</td>
                <td>Python (R-204)</td>
                <td>AIPD (R-305)</td>
                <td>Python Lab (Lab 2)</td>
                <td>SPC (R-201)</td>
                <td>Mentorship</td>
              </tr>
              <tr>
                <td style="font-weight: 700;">Wednesday</td>
                <td>SPC (R-201)</td>
                <td>Python (R-204)</td>
                <td>EIDW Lab (Lab 3)</td>
                <td>AIPD (R-305)</td>
                <td>Sports</td>
              </tr>
              <tr style="background: var(--tint-soft-blue); font-weight: 600;">
                <td style="font-weight: 800; color: var(--color-accent-blue);">Thursday (Today)</td>
                <td>SPC (Theory, R-201)</td>
                <td>Self Study</td>
                <td>EIDW Lab (Lab 3)</td>
                <td>AIPD (Theory, R-305)</td>
                <td>Library Time</td>
              </tr>
              <tr>
                <td style="font-weight: 700;">Friday</td>
                <td>AIPD (R-305)</td>
                <td>SPC (R-201)</td>
                <td>Project Lab (Lab 4)</td>
                <td>Seminar</td>
                <td>Club Activity</td>
              </tr>
              <tr>
                <td style="font-weight: 700;">Saturday</td>
                <td>Weekly Test</td>
                <td>Remedial Class</td>
                <td>Library & Project</td>
                <td>-</td>
                <td>-</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  static renderAttendance(container) {
    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 1.5rem;">
        <div class="flex items-center justify-between">
          <div>
            <h2 style="font-size: 2rem; font-weight: 800;">Attendance Analytics</h2>
            <p style="font-size: 0.9rem; color: var(--text-secondary);">Real-time GTU lecture attendance & AI compliance metrics.</p>
          </div>
          <span class="badge badge-available">Overall: 88.5% (Eligible)</span>
        </div>

        <!-- 1. AI RISK UI (Section 46) -->
        <div class="card-editorial" style="background: var(--tint-soft-green); border-color: #A7F3D0;">
          <div class="flex justify-between items-center" style="margin-bottom: 0.5rem;">
            <div class="flex items-center gap-2">
              <span class="badge badge-available">AI Risk Assessment</span>
              <strong style="color: var(--color-success); font-size: 1rem;">Academic Standing: Low Risk (94/100)</strong>
            </div>
            <span style="font-size: 0.78rem; color: var(--color-success); font-weight: 700;">Zero Exam Detainment Risk</span>
          </div>
          <p style="font-size: 0.85rem; color: #065F46; line-height: 1.5;">
            <strong>Factors affecting your current risk level:</strong><br>
            • Attendance compliance: 88.5% (Well above GTU 75% statutory requirement)<br>
            • Internal assessments: 26/30 average in Mid-term tests<br>
            • Laboratory work: 100% journals certified and submitted on time.
          </p>
        </div>

        <!-- SUBJECT BREAKDOWN TABLE -->
        <div class="table-responsive-card">
          <table class="data-table">
            <thead>
              <tr>
                <th>Subject Code & Name</th>
                <th>Faculty</th>
                <th>Lectures Attended</th>
                <th>Total Held</th>
                <th>Attendance %</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>AIPD (Artificial Intelligence & Python)</strong></td>
                <td>Prof. S. R. Patel</td>
                <td>32</td>
                <td>35</td>
                <td style="font-weight: 700;">91.4%</td>
                <td><span class="badge badge-available">Excellent</span></td>
              </tr>
              <tr>
                <td><strong>SPC (System Programming & Compiler)</strong></td>
                <td>Prof. Mehta</td>
                <td>28</td>
                <td>32</td>
                <td style="font-weight: 700;">87.5%</td>
                <td><span class="badge badge-available">Good</span></td>
              </tr>
              <tr>
                <td><strong>EIDW (Engineering Innovation & Data Works)</strong></td>
                <td>Prof. Sharma</td>
                <td>26</td>
                <td>30</td>
                <td style="font-weight: 700;">86.6%</td>
                <td><span class="badge badge-available">Good</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `;
  }
}
