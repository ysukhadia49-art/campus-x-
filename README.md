# Campus X AI — Centralized Campus Intelligence & Academic Portal 🎓⚡

> **"Everything campus, in one place. Smart Campus. Smarter Future."**  
> Developed for Tapi Diploma Engineering College.

![CampusX AI Banner](campus-x-brand-logo.jpg)

---

## 🌟 Overview

**Campus X AI** is a production-grade, high-fidelity college campus management web application. It unifies essential campus operations into an intuitive, role-based single-page application (SPA) with a dedicated Express.js backend.

### 👥 Role-Based Portals:
1. **👨‍🎓 Student Portal**: Live attendance tracking, semester grades, exam timetables, fee receipts, assignment submissions, and quick announcements.
2. **👩‍🏫 Faculty Portal**: Attendance marking, grade entry, syllabus tracker, leave requests, and student communication.
3. **🏛️ Administrator Portal**: Campus analytics, faculty workload management, departmental notices, and financial overviews.
4. **🖨️ Stationery & Print Operator Portal**: Digital queue management, print rush hours, file printing jobs, payment settlement, and inventory control.
5. **🤖 Campus AI Assistant**: Contextual campus chatbot for instant queries on syllabus, campus map, guidelines, and office hours.
6. **🔍 Lost & Found**: Community item recovery bulletin with image tagging and claiming verification.
7. **📢 Complaints & Grievance Redressal**: Real-time ticket submission with status tracking (Pending $\rightarrow$ In Progress $\rightarrow$ Resolved).

---

## 🚀 Quick Start Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- Git

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

### 3. Run the Application

#### Start Backend API Server:
```bash
npm start
```
The Express API server starts on `http://localhost:5000`.

#### Launch Web Frontend:
Open `index.html` directly in any modern browser, or use a local static server:
```bash
npx serve .
```

---

## 📁 Repository Structure (Flat - All Files in Root)

```text
git-repo/
├── index.html              # Main Single Page Application (SPA) entry point
├── campusx.bundle.js       # Complete consolidated application bundle
├── variables.css           # Design tokens, color palette, gradients
├── base.css                # Typography, reset, and core layout
├── components.css          # Reusable UI widgets, cards, and buttons
├── layout.css              # Responsive grid and navbar layouts
├── auth.css                # Authentication modal & sign-in styles
├── server.js               # Express REST API backend, JWT auth, and mock DB
├── package.json            # Node.js project configuration and scripts
├── package-lock.json       # Locked dependency versions
├── .env.example            # Sample environment variables
├── .gitignore              # Files excluded from version control
├── git-manual.html         # Interactive Git Manual & Developer Handbook
├── brand-identity.html     # Brand identity and visual design showcase
├── test-security.js        # Automated security test suite
├── prepare-www.js          # Build script
└── *.svg, *.jpg, *.png     # Brand logos, icons, and vector assets
```


---

## 🔒 Security & Best Practices
- **XSS Protection**: HTML sanitization on all user-submitted content.
- **JWT & Password Hashing**: Express server uses `bcryptjs` and `jsonwebtoken`.
- **Zero Build Tool Clutter**: Native HTML5, modern vanilla CSS, and vanilla JavaScript for blazing speed without unnecessary framework overhead.

---

## 📜 License
Developed for Tapi Diploma Engineering College. Distributed under the ISC License.
