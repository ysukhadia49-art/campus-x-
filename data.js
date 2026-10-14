/* ==========================================================
   Campus X AI - Mock Campus Data (Step 1 & 2 Setup)
   Tapi Diploma Engineering College - Class 2452 IT
   ========================================================== */

const CAMPUS_DATA = {
  institution: {
    name: "Tapi Diploma Engineering College, Surat",
    department: "Information Technology Department",
    projectTitle: "Campus X AI (Off Campus AI)",
    class: "2452 - IT",
    team: [
      { name: "Rahil Shah", enrollment: "246470316103", role: "AI Lead & Backend" },
      { name: "Jahaan Randaria", enrollment: "246470316106", role: "Database & Cloud" },
      { name: "Parshva Shah", enrollment: "246470316113", role: "Full Stack & Testing" },
      { name: "Parth Sonar", enrollment: "246470316115", role: "UI/UX & Mobile" },
      { name: "Yug Sukhadia", enrollment: "246470316116", role: "Frontend & Architecture" }
    ]
  },

  roles: {
    student: {
      name: "Yug Sukhadia",
      roleTitle: "Student (Class 2452 - IT)",
      enrollment: "246470316116",
      avatarInitials: "YS",
      stats: [
        { label: "Overall Attendance", value: "88.5%", trend: "+2.4% vs last month", positive: true, icon: "calendar" },
        { label: "Current SPI / CGPA", value: "8.72", trend: "Top 5% in Class", positive: true, icon: "award" },
        { label: "Active Assignments", value: "3 Due", trend: "Next: Machine Learning (Tomorrow)", positive: false, icon: "file-text" },
        { label: "Campus AI Queries", value: "48 Solved", trend: "Saved 4.2 hrs study time", positive: true, icon: "sparkles" }
      ],
      quickActions: [
        { title: "Ask AI Assistant", desc: "Instant doubt solving & timetable inquiry", badge: "AI Powered" },
        { title: "Stationery Requisition", desc: "Request lab sheets, logbooks, components", badge: "Smart Inventory" },
        { title: "Report Issue / Complaint", desc: "Direct ticket to college administration", badge: "Tracked" },
        { title: "Lost & Found Board", desc: "Browse items or report found belongings", badge: "Active" }
      ]
    },

    faculty: {
      name: "Prof. S. R. Patel",
      roleTitle: "Senior Lecturer (IT Dept)",
      enrollment: "FAC-IT-042",
      avatarInitials: "SP",
      stats: [
        { label: "Lectures Today", value: "4 Scheduled", trend: "Next: 11:30 AM Lab 3", positive: true, icon: "clock" },
        { label: "Batch Attendance", value: "91.8%", trend: "Calculated via AI scan", positive: true, icon: "users" },
        { label: "Pending Evaluations", value: "18 Submissions", trend: "2 batches pending", positive: false, icon: "check-square" },
        { label: "Lab Inventory Status", value: "94% Stocked", trend: "3 items low on stock", positive: false, icon: "box" }
      ],
      quickActions: [
        { title: "One-Click AI Attendance", desc: "Scan and log student presence instantly", badge: "AI Vision" },
        { title: "Broadcast Announcement", desc: "Send push notifications to class students", badge: "Instant" },
        { title: "Lab Stationery Request", desc: "Restock lab consumables & equipment", badge: "ERP Sync" },
        { title: "Performance Predictions", desc: "Identify students needing academic support", badge: "Predictive" }
      ]
    },

    admin: {
      name: "Admin Controller",
      roleTitle: "Campus Operations Admin",
      enrollment: "ADM-HQ-001",
      avatarInitials: "AC",
      stats: [
        { label: "Total Students", value: "1,248", trend: "All semesters active", positive: true, icon: "users" },
        { label: "Active Faculty", value: "86 Members", trend: "Full staff on-duty", positive: true, icon: "user-check" },
        { label: "Open Complaints", value: "4 Tickets", trend: "Average resolution: 1.8 hrs", positive: true, icon: "alert-circle" },
        { label: "Campus Facility Status", value: "99.4% Operational", trend: "All systems nominal", positive: true, icon: "shield-check" }
      ],
      quickActions: [
        { title: "Campus Announcement Broadcast", desc: "Dispatch official notices to students & staff", badge: "Instant" },
        { title: "Inventory Forecasting", desc: "AI-calculated reorder quantities", badge: "Smart ERP" },
        { title: "Grievance Management", desc: "Resolve and dispatch staff to reported issues", badge: "Priority" },
        { title: "Ecosystem Analytics", desc: "Full campus footfall and efficiency report", badge: "Live KPI" }
      ]
    }
  },

  stationeryAlerts: [
    { item: "Data Science A4 Lab Journals", status: "Low Stock (14 left)", urgency: "warning", reorderSuggested: 100 },
    { item: "Whiteboard Dry-Erase Markers", status: "Critical (4 packs left)", urgency: "danger", reorderSuggested: 25 },
    { item: "Microcontroller Breadboards", status: "Good (65 units)", urgency: "success", reorderSuggested: 0 }
  ],

  recentComplaints: [
    { id: "TDEC-2401", title: "Projector flickering in Room 204", dept: "IT Infrastructure", status: "In Progress", priority: "Medium" },
    { id: "TDEC-2402", title: "Wi-Fi coverage in Library 2nd Floor", dept: "Network Admin", status: "Assigned", priority: "High" }
  ],

  lostAndFound: [
    { title: "Casio Scientific Calculator fx-991EX", location: "Library Desk 12", date: "Today, 10:15 AM", status: "Claim Pending" },
    { title: "College ID Card (Class 2452)", location: "Canteen Counter", date: "Yesterday", status: "Returned" }
  ]
};
