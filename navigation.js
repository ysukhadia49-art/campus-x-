/* ==========================================================
   Campus X AI - Navigation & State Management
   Step 2: Component & Layout Handlers
   ========================================================== */

class NavigationController {
  constructor() {
    this.currentRole = 'student';
    this.currentView = 'overview';
    this.isSidebarOpen = false;

    this.initListeners();
  }

  initListeners() {
    // Role Switcher
    const roleSelect = document.getElementById('roleSelector');
    if (roleSelect) {
      roleSelect.addEventListener('change', (e) => {
        this.switchRole(e.target.value);
      });
    }

    // Sidebar Hamburger Toggle (Mobile)
    const toggleBtn = document.getElementById('sidebarToggleBtn');
    const sidebar = document.getElementById('appSidebar');
    if (toggleBtn && sidebar) {
      toggleBtn.addEventListener('click', () => {
        this.isSidebarOpen = !this.isSidebarOpen;
        sidebar.classList.toggle('open', this.isSidebarOpen);
      });
    }

    // Sidebar Navigation Links
    const menuLinks = document.querySelectorAll('.menu-item');
    menuLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        menuLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        
        const targetView = link.getAttribute('data-view');
        if (targetView) {
          this.switchView(targetView);
        }

        // Close sidebar on mobile after clicking
        if (window.innerWidth < 768 && sidebar) {
          this.isSidebarOpen = false;
          sidebar.classList.remove('open');
        }
      });
    });

    // Mobile Bottom Nav Links
    const mobileLinks = document.querySelectorAll('.mobile-nav-item');
    mobileLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        mobileLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        const targetView = link.getAttribute('data-view');
        if (targetView) {
          this.switchView(targetView);
        }
      });
    });

    // Navigation events initialized
  }

  switchRole(roleKey) {
    if (!CAMPUS_DATA.roles[roleKey]) return;
    this.currentRole = roleKey;
    
    // Update Profile Header
    const roleData = CAMPUS_DATA.roles[roleKey];
    const nameEl = document.getElementById('userProfileName');
    const roleEl = document.getElementById('userProfileRole');
    const avatarEl = document.getElementById('userAvatar');

    if (nameEl) nameEl.textContent = roleData.name;
    if (roleEl) roleEl.textContent = roleData.roleTitle;
    if (avatarEl) avatarEl.textContent = roleData.avatarInitials;

    // Trigger UI rerender in app controller
    if (window.campusApp) {
      window.campusApp.renderRoleDashboard(roleKey);
    }
  }

  switchView(viewName) {
    this.currentView = viewName;
    const viewTitleEl = document.getElementById('pageTitle');
    const viewDescEl = document.getElementById('pageDescription');

    const titles = {
      'overview': { title: 'Dashboard Overview', desc: 'Unified Intelligence Hub for Campus Operations' },
      'academics': { title: 'Academics & Timetables', desc: 'Real-time lectures, syllabus tracking, and exam schedules' },
      'attendance': { title: 'AI Attendance Analytics', desc: 'Automated facial & smart RFID attendance logging' },
      'inventory': { title: 'Stationery & Inventory ERP', desc: 'Automated predictive stocking for college resources' },
      'complaints': { title: 'Grievance & Complaint Portal', desc: 'Transparent ticket tracking for campus maintenance' },
      'lost-found': { title: 'Lost & Found Hub', desc: 'Digital community bulletin for displaced campus items' },
      'ai-chat': { title: 'Campus X AI Virtual Assistant', desc: '24/7 Generative AI assistant for students & faculty' }
    };

    if (titles[viewName]) {
      if (viewTitleEl) viewTitleEl.textContent = titles[viewName].title;
      if (viewDescEl) viewDescEl.textContent = titles[viewName].desc;
    }
  }
}
