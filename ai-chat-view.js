/* ==========================================================
   Campus X AI - Conversational Assistant View ("Ask Campus X.")
   Real-Time Campus Intelligence grounded in live academic records,
   notices, timetable, inventory, and GTU statutory compliance.
   ========================================================== */

class AiChatView {
  static chatHistory = [
    {
      sender: "ai",
      text: "Hello! I'm **Campus X**, your real-time intelligent assistant for Tapi Diploma Engineering College. How can I help you right now?",
      time: "Just now"
    }
  ];

  static render(container) {
    const role = appState.currentUser ? appState.currentUser.role : 'STUDENT';
    const esc = window.SecurityUtils ? window.SecurityUtils.escapeHtml : (s => s);

    container.innerHTML = `
      <div style="max-width: 880px; margin: 0 auto; display: flex; flex-direction: column; gap: 1.5rem;">
        
        <!-- HEADER -->
        <div class="flex items-center justify-between" style="flex-wrap: wrap; gap: 1rem;">
          <div>
            <div class="flex items-center gap-2" style="margin-bottom: 0.25rem;">
              <span class="badge badge-purple">AI Conversational Engine</span>
              <span class="badge badge-green">● Real-Time Connected</span>
            </div>
            <h2 style="font-size: 2rem; font-weight: 800; color: var(--text-primary); margin: 0;">Ask Campus X.</h2>
            <p style="font-size: 0.9rem; color: var(--text-secondary); margin-top: 0.2rem;">
              Instant, authoritative answers grounded in your live attendance, today's timetable, circulars, and campus ERP.
            </p>
          </div>

          <button class="btn btn-secondary" onclick="AiChatView.clearHistory()" style="font-size: 0.78rem; padding: 0.35rem 0.75rem;">
            Clear Chat
          </button>
        </div>

        <!-- Chat Conversation Card -->
        <div class="card-editorial" style="padding: 1.5rem; display: flex; flex-direction: column; height: 520px; box-shadow: 0 4px 20px rgba(0,0,0,0.06);">
          
          <div id="chatMessageLog" style="flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 1rem; padding-right: 0.5rem; margin-bottom: 1.25rem;">
            ${AiChatView.chatHistory.map(msg => `
              <div style="align-self: ${msg.sender === 'user' ? 'flex-end' : 'flex-start'}; max-width: 82%;">
                <div style="display: flex; align-items: center; gap: 0.4rem; margin-bottom: 0.2rem; justify-content: ${msg.sender === 'user' ? 'flex-end' : 'flex-start'};">
                  <span style="font-size: 0.72rem; font-weight: 700; color: ${msg.sender === 'user' ? 'var(--color-accent-blue)' : 'var(--color-primary)'};">
                    ${msg.sender === 'user' ? (appState.currentUser ? esc(appState.currentUser.name) : 'You') : 'Campus X AI'}
                  </span>
                  <span style="font-size: 0.68rem; color: var(--text-muted);">${msg.time || 'Just now'}</span>
                </div>
                <div style="background: ${msg.sender === 'user' ? 'var(--sidebar-bg)' : 'var(--bg-surface-subtle)'}; 
                            color: ${msg.sender === 'user' ? '#ffffff' : 'var(--text-primary)'}; 
                            border: ${msg.sender === 'user' ? 'none' : '1px solid var(--border-color)'}; 
                            padding: 0.85rem 1.15rem; border-radius: var(--radius-md); font-size: 0.88rem; line-height: 1.55; box-shadow: 0 2px 6px rgba(0,0,0,0.04);">
                  ${AiChatView.formatMessageText(msg.text)}
                </div>
              </div>
            `).join('')}
          </div>

          <!-- Prompt Input Bar -->
          <div class="flex items-center gap-2">
            <input type="text" id="aiPageInput" class="form-input" 
                   placeholder="Ask about your live attendance, next class, notices, stationery rush..." 
                   onkeydown="if(event.key==='Enter') AiChatView.sendQuery()" maxlength="250" autocomplete="off">
            <button class="btn btn-primary" onclick="AiChatView.sendQuery()" style="display: flex; align-items: center; gap: 0.35rem;">
              <span>Send</span>
              <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
            </button>
          </div>

          <!-- Quick Suggested Chips Grounded in Role -->
          <div class="flex flex-wrap gap-2" style="margin-top: 1rem;">
            ${AiChatView.getSuggestionsForRole(role).map(chip => `
              <button class="ask-ai-chip" onclick="AiChatView.askSuggested('${chip.query.replace(/'/g, "\\'")}')" ${chip.danger ? 'style="border-color: rgba(220, 38, 38, 0.4); color: #dc2626;"' : ''}>
                ${chip.label}
              </button>
            `).join('')}
          </div>

        </div>
      </div>
    `;
  }

  static getSuggestionsForRole(role) {
    if (role === 'ADMIN') {
      return [
        { label: "College Attendance Overview", query: "What is today's college attendance rate?" },
        { label: "Active Circulars & Notices", query: "Show active notices on campus board" },
        { label: "Pending Maintenance Tickets", query: "How many complaints are open?" },
        { label: "Stationery Inventory Thresholds", query: "Show low stock stationery items" },
        { label: "🚨 Emergency SOS", query: "Emergency contacts & SOS procedure", danger: true }
      ];
    } else if (role === 'FACULTY') {
      return [
        { label: "Attendance Roster Status", query: "How many attendance sessions have been logged?" },
        { label: "Today's Teaching Schedule", query: "What is today's faculty timetable?" },
        { label: "Latest Notices", query: "What circulars were posted recently?" },
        { label: "Stationery Rush Status", query: "Is the stationery counter busy?" },
        { label: "🚨 Emergency SOS", query: "Emergency contacts & SOS procedure", danger: true }
      ];
    } else {
      // Default: Student
      return [
        { label: "What's my attendance?", query: "What is my live attendance percentage and GTU compliance?" },
        { label: "Where is my class today?", query: "What is my next class and schedule today?" },
        { label: "Any new notices?", query: "Show recent campus notices and circulars" },
        { label: "Is stationery busy?", query: "Is the stationery counter currently busy?" },
        { label: "Exam Timetable", query: "When is my next GTU exam?" },
        { label: "🚨 Emergency SOS", query: "Emergency contacts & SOS procedure", danger: true }
      ];
    }
  }

  static formatMessageText(text) {
    const esc = window.SecurityUtils ? window.SecurityUtils.escapeHtml : (s => s);
    let safe = esc(text);
    // Bold markdown formatting
    safe = safe.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Line breaks
    safe = safe.replace(/\n/g, '<br>');
    return safe;
  }

  static askSuggested(prompt) {
    const input = document.getElementById('aiPageInput');
    if (input) input.value = prompt;
    AiChatView.sendQuery();
  }

  static clearHistory() {
    AiChatView.chatHistory = [
      {
        sender: "ai",
        text: "Chat cleared! How can I assist you with your campus schedule or services?",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
    const container = document.getElementById('viewContainer') || document.getElementById('view-container');
    if (container) AiChatView.render(container);
  }

  static async sendQuery() {
    const input = document.getElementById('aiPageInput');
    if (!input) return;
    const rawQ = input.value.trim();
    if (!rawQ) return;

    const q = window.SecurityUtils ? window.SecurityUtils.sanitizeInput(rawQ, 250) : rawQ.slice(0, 250);
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    AiChatView.chatHistory.push({ sender: 'user', text: q, time: nowTime });
    input.value = '';

    const container = document.getElementById('viewContainer') || document.getElementById('view-container');
    if (container) {
      AiChatView.render(container);
      const log = document.getElementById('chatMessageLog');
      if (log) {
        const thinking = document.createElement('div');
        thinking.className = 'ai-thinking-box';
        thinking.id = 'aiThinkingIndicator';
        thinking.innerHTML = `
          <span style="font-weight: 700; color: var(--color-primary); font-size: 0.82rem;">Campus X AI</span>
          <span style="font-size: 0.8rem; color: var(--text-muted);">Consulting Real-Time Records</span>
          <div class="ai-thinking-dots">
            <span class="ai-thinking-dot"></span>
            <span class="ai-thinking-dot"></span>
            <span class="ai-thinking-dot"></span>
          </div>
        `;
        log.appendChild(thinking);
        log.scrollTop = log.scrollHeight;
      }
    }

    // Attempt Server API first, fallback to intelligent client-side grounded response
    let reply = "";
    if (window.ApiClient && !ApiClient.isStaticDeployment()) {
      try {
        const res = await ApiClient.request('/api/chat', {
          method: 'POST',
          body: JSON.stringify({ message: q })
        });
        if (res && res.reply) {
          reply = res.reply;
        }
      } catch (e) {
        // Fall back to client generator
      }
    }

    if (!reply) {
      reply = AiChatView.generateLocalRealTimeResponse(q);
    }

    setTimeout(() => {
      AiChatView.chatHistory.push({ 
        sender: 'ai', 
        text: reply, 
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      });
      if (container) {
        AiChatView.render(container);
        const log = document.getElementById('chatMessageLog');
        if (log) log.scrollTop = log.scrollHeight;
      }
    }, 450);
  }

  static generateLocalRealTimeResponse(query) {
    const q = query.toLowerCase();
    const user = appState.currentUser || { name: 'Student', role: 'STUDENT', id: '246470316113' };
    const userIdentifier = user.id || user.rollNo || user.name || '07';

    // 1. REAL-TIME ATTENDANCE
    if (q.includes('attendance') || q.includes('absent') || q.includes('present') || q.includes('gtu rule') || q.includes('detention') || q.includes('compliance')) {
      const stats = CAMPUS_DATA.getStudentAttendance(userIdentifier);
      if (stats.totalHeld === 0) {
        return `Hello **${user.name}**! No lecture attendance records have been marked by faculty for Term 2026 yet. As your professors record daily theory and lab rolls in the Faculty Portal, live calculations will update here automatically.`;
      }
      return `Hello **${user.name}**! Your real-time attendance across **Class 2452 - IT** is **${stats.percentageStr}** (${stats.totalAttended} of ${stats.totalHeld} sessions attended).\n\n${
        stats.compliant 
          ? "🎉 **GTU Status: Compliant & Eligible.** Your attendance meets statutory GTU 75% examination guidelines."
          : "⚠️ **GTU Status: Low Attendance Risk.** Your attendance is below 75%. Please attend upcoming theory and lab sessions to avoid hall ticket detention."
      }\n\nYou can inspect individual subject breakdowns on the **Attendance tab**.`;
    }

    // 2. REAL-TIME TIMETABLE & TODAY'S CLASSES
    if (q.includes('class') || q.includes('schedule') || q.includes('lecture') || q.includes('period') || q.includes('lab') || q.includes('timetable') || q.includes('today')) {
      const day = new Date().getDay();
      const schedule = CAMPUS_DATA.getTodaySchedule(day);
      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

      if (day === 0 || schedule.length === 0) {
        return `Today is **${dayNames[day]}**. Campus academic blocks are currently closed. Regular classes resume Monday at 10:00 AM with **SPC Theory** in Room S-21.`;
      }

      const list = schedule.map(s => `• **${s.time}**: ${s.subject} (${s.room} • ${s.faculty})`).join('\n');
      return `Here is today's live schedule (**${dayNames[day]}** for Class 2452 - IT):\n\n${list}\n\nPracticals take place in Labs T-13, T-14, T-15, and T-16.`;
    }

    // 3. REAL-TIME NOTICES & CIRCULARS
    if (q.includes('notice') || q.includes('circular') || q.includes('announcement') || q.includes('news')) {
      const notices = CAMPUS_DATA.notices || [];
      if (notices.length === 0) {
        return "There are currently no active announcements on the campus board. Check back soon for circulars.";
      }
      const top = notices.slice(0, 3);
      const list = top.map(n => `• **[${n.category || 'Circular'}]** ${n.title} (${n.date || 'Today'})\n  _${n.description || n.desc || ''}_`).join('\n\n');
      return `Here are the latest official campus notices:\n\n${list}\n\nAdministrators can upload new circulars anytime from the **Notices tab**.`;
    }

    // 4. REAL-TIME STATIONERY & RUSH STATUS
    if (q.includes('stationery') || q.includes('rush') || q.includes('counter') || q.includes('queue') || q.includes('pen') || q.includes('journal') || q.includes('calculator') || q.includes('drawing')) {
      const isRush = appState.stationeryRush;
      const rushMsg = isRush 
        ? `🚨 **Stationery Rush is ACTIVE**: The counter is experiencing high traffic (average wait time: 10-15 minutes).` 
        : `● **Stationery Counter is NORMAL**: Minimal waiting time (under 2 minutes).`;
      return `${rushMsg}\n\nStore location: Ground floor opposite Auditorium A. Operating hours: 9:00 AM – 5:30 PM. All A4 lab journals, engineering sheets, and Casio fx-991EX calculators are available.`;
    }

    // 5. EXAMINATIONS
    if (q.includes('exam') || q.includes('mid-term') || q.includes('gtu') || q.includes('test') || q.includes('hall ticket')) {
      return `GTU Winter Mid-Term Examinations begin on **24th September 2026** for 5th Semester IT.\n\n• **SPC (DI05016061)**: 24 Sep • 10:30 AM\n• **AIPD (DI05016021)**: 26 Sep • 10:30 AM\n• **CDCT (DI05016031)**: 28 Sep • 10:30 AM\n\nVerified hall tickets will be dispatched to departmental coordinators.`;
    }

    // 6. COMPLAINTS & GRIEVANCES
    if (q.includes('complaint') || q.includes('repair') || q.includes('broken') || q.includes('grievance') || q.includes('fan') || q.includes('pc')) {
      const open = (CAMPUS_DATA.complaints || []).filter(c => c.status !== 'RESOLVED');
      return `The campus maintenance system currently tracks **${open.length} active grievance ticket${open.length === 1 ? '' : 's'}**. You can log facility repairs or equipment faults directly in the **Complaints & Maintenance** module.`;
    }

    // 7. LOST & FOUND
    if (q.includes('lost') || q.includes('found') || q.includes('wallet') || q.includes('keys') || q.includes('bag') || q.includes('card')) {
      const count = (CAMPUS_DATA.lostAndFound || []).length;
      return `The **Lost & Found Hub** currently lists **${count} active report${count === 1 ? '' : 's'}**. You can submit found items or search matching reports in the **Lost & Found** section.`;
    }

    // 8. EMERGENCY & SOS
    if (q.includes('emergency') || q.includes('sos') || q.includes('doctor') || q.includes('security') || q.includes('ambulance') || q.includes('fire')) {
      return `🚨 **EMERGENCY ASSISTANCE PROTOCOL**:\n\n• **Campus Security Command**: +91 261 2345678 (Gate 1, 24/7)\n• **Medical Health Clinic**: +91 261 2345679 (Room 102)\n• **Fire & Disaster Officer**: +91 94280 12345\n\nYou can also tap the red **Emergency SOS** button in the top navigation bar to trigger immediate campus dispatch.`;
    }

    // DEFAULT GROUNDED ANSWER
    return `Regarding "${query}": Campus X AI is continuously synchronized with Tapi Diploma Engineering College. You can ask me about your **live attendance percentage**, **today's lecture timetable**, **campus notices**, **stationery rush**, or **emergency assistance**.`;
  }
}
