/* ==========================================================
   Campus X AI - Conversational Assistant View ("Ask Campus X.")
   Section 44: Clean conversational shortcut, no sci-fi orbs/robots
   ========================================================== */

class AiChatView {
  static chatHistory = [
    {
      sender: "ai",
      text: "Hello! I'm Campus X, your campus shortcut for Tapi Diploma Engineering College. How can I assist you today?"
    }
  ];

  static render(container) {
    container.innerHTML = `
      <div style="max-width: 840px; margin: 0 auto; display: flex; flex-direction: column; gap: 1.5rem;">
        <div>
          <h2 style="font-size: 2rem; font-weight: 800;">Ask Campus X.</h2>
          <p style="font-size: 0.9rem; color: var(--text-secondary);">Your campus shortcut. Classes, exams, services and queries answered instantly.</p>
        </div>

        <!-- Chat Conversation Card -->
        <div class="card-editorial" style="padding: 1.5rem; display: flex; flex-direction: column; height: 480px;">
          
          <div id="chatMessageLog" style="flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 0.85rem; padding-right: 0.5rem; margin-bottom: 1rem;">
            ${AiChatView.chatHistory.map(msg => `
              <div style="align-self: ${msg.sender === 'user' ? 'flex-end' : 'flex-start'}; 
                          background: ${msg.sender === 'user' ? 'var(--sidebar-bg)' : 'var(--bg-surface-subtle)'}; 
                          color: ${msg.sender === 'user' ? '#ffffff' : 'var(--text-primary)'}; 
                          border: ${msg.sender === 'user' ? 'none' : '1px solid var(--border-color)'}; 
                          padding: 0.75rem 1rem; border-radius: var(--radius-md); font-size: 0.86rem; max-width: 80%;">
                ${AiChatView.formatMessageText(msg.text)}
              </div>
            `).join('')}
          </div>

          <!-- Prompt Input Bar -->
          <div class="flex items-center gap-2">
            <input type="text" id="aiPageInput" class="form-input" placeholder="Ask about attendance, timetable, exams, stationery..." onkeydown="if(event.key==='Enter') AiChatView.sendQuery()" maxlength="250">
            <button class="btn btn-primary" onclick="AiChatView.sendQuery()">Send</button>
          </div>

          <!-- Quick Suggested Chips (Section 44) -->
          <div class="flex flex-wrap gap-2" style="margin-top: 1rem;">
            <button class="ask-ai-chip" onclick="AiChatView.askSuggested('What\'s my attendance?')">What's my attendance?</button>
            <button class="ask-ai-chip" onclick="AiChatView.askSuggested('What\'s my exam schedule?')">What's my exam schedule?</button>
            <button class="ask-ai-chip" onclick="AiChatView.askSuggested('Where is today\'s class?')">Where is today's class?</button>
            <button class="ask-ai-chip" onclick="AiChatView.askSuggested('Is the stationery counter busy?')">Is the stationery counter busy?</button>
            <button class="ask-ai-chip" onclick="AiChatView.askSuggested('Where can I report a lost item?')">Report lost item</button>
          </div>

        </div>
      </div>
    `;
  }

  static formatMessageText(text) {
    const esc = window.SecurityUtils ? window.SecurityUtils.escapeHtml : (s => s);
    const safe = esc(text);
    return safe.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  }

  static askSuggested(prompt) {
    const input = document.getElementById('aiPageInput');
    if (input) input.value = prompt;
    AiChatView.sendQuery();
  }

  static sendQuery() {
    const input = document.getElementById('aiPageInput');
    if (!input) return;
    const rawQ = input.value.trim();
    if (!rawQ) return;

    // Sanitize user query length & content
    const q = window.SecurityUtils ? window.SecurityUtils.sanitizeInput(rawQ, 250) : rawQ.slice(0, 250);

    AiChatView.chatHistory.push({ sender: 'user', text: q });
    input.value = '';

    // Render immediately with user message + thinking indicator
    const container = document.getElementById('viewContainer');
    if (container) {
      AiChatView.render(container);
      const log = document.getElementById('chatMessageLog');
      if (log) {
        const thinking = document.createElement('div');
        thinking.className = 'ai-thinking-box';
        thinking.id = 'aiThinkingIndicator';
        thinking.innerHTML = `
          <span style="font-weight: 700; color: var(--color-primary); font-size: 0.82rem;">Campus X AI</span>
          <span style="font-size: 0.8rem; color: var(--text-muted);">Thinking</span>
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

    // Generate responsive realistic answer grounded in state
    let reply = "I've checked the campus records for Tapi Diploma Engineering College.";

    if (q.toLowerCase().includes("attendance")) {
      reply = "Your overall attendance across all subjects is **88.5%** (Class 2452 IT). In AIPD Theory, you are at 91.4% with zero detention risks.";
    } else if (q.toLowerCase().includes("exam")) {
      reply = "GTU Mid-Semester Winter examinations begin on **24th September 2026**. First paper is System Programming & Compiler (SPC) at 10:30 AM in Hall 2.";
    } else if (q.toLowerCase().includes("class") || q.toLowerCase().includes("schedule")) {
      reply = "Your next class today is **EIDW (Lab) at 11:00 AM** in Lab-3 with Prof. Sharma. Followed by Lunch Break at 1:00 PM.";
    } else if (q.toLowerCase().includes("stationery") || q.toLowerCase().includes("busy") || q.toLowerCase().includes("rush")) {
      reply = appState.stationeryRush 
        ? "🚨 The Central Stationery counter is currently **BUSY** with high student footfall. Waiting time is approx 10-15 minutes."
        : "● The Central Stationery counter is **NORMAL**. Average service time is under 2 minutes.";
    } else if (q.toLowerCase().includes("lost") || q.toLowerCase().includes("found")) {
      reply = "You can report or browse lost belongings directly in the **Lost & Found Hub**. A black leather wallet was recently matched!";
    } else {
      reply = `Regarding "${q}": All academic schedules and college services for Tapi Diploma Engineering College are updated in real-time. Feel free to navigate using the sidebar.`;
    }

    setTimeout(() => {
      AiChatView.chatHistory.push({ sender: 'ai', text: reply });
      if (container) {
        AiChatView.render(container);
        const log = document.getElementById('chatMessageLog');
        if (log) log.scrollTop = log.scrollHeight;
      }
    }, 550);
  }
}
