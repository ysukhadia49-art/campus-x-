/* ==========================================================
   Campus X AI - Realistic Mock Data Store
   College: Tapi Diploma Engineering College, Surat
   ========================================================== */

const CAMPUS_DATA = {
  college: {
    name: "Tapi Diploma Engineering College, Surat",
    affiliation: "Gujarat Technological University (647)",
    department: "Information Technology Department",
    currentTerm: "Semester 5 • Academic Year 2026-27",
    class: "2452 - IT"
  },

  // Accounts for Role Recognition (No manual role dropdown during auth!)
  // Note: Password hashes are strictly server-side and never exposed to the client
  accounts: {
    "student@tapi.edu": {
      id: "246470316113",
      email: "student@tapi.edu",
      name: "Parshva Shah",
      role: "STUDENT",
      roleTitle: "Student (Class 2452 - IT)",
      department: "Information Technology",
      semester: "Semester 5",
      phone: "+91 98251 44321",
      avatarInitials: "PS",
      academicRisk: {
        level: "Low Risk",
        score: "94/100",
        summary: "Excellent academic standing with zero backlogs and consistent lecture attendance.",
        factors: [
          { name: "Attendance Compliance", status: "Optimal (89.2%)", positive: true },
          { name: "Internal Assessments", status: "Above Average (26/30)", positive: true },
          { name: "Lab Submission Timeliness", status: "All On Schedule", positive: true }
        ]
      }
    },
    "faculty@tapi.edu": {
      id: "FAC-IT-042",
      email: "faculty@tapi.edu",
      name: "Prof. S. R. Patel",
      role: "FACULTY",
      roleTitle: "Senior Lecturer & Academic Mentor",
      department: "Information Technology",
      designation: "Head of AI Lab & Senior Lecturer",
      phone: "+91 94280 12345",
      avatarInitials: "SP",
      subjects: ["AIPD (Theory & Lab)", "Data Structures", "Python Applications"]
    },
    "admin@tapi.edu": {
      id: "ADM-HQ-001",
      email: "admin@tapi.edu",
      name: "Dr. A. K. Joshi",
      role: "ADMIN",
      roleTitle: "Campus Operations Controller",
      department: "Central Administration",
      permissions: "Full Institutional Access",
      phone: "+91 98241 99887",
      avatarInitials: "AJ"
    },
    "stationery@tapi.edu": {
      id: "STN-OP-004",
      email: "stationery@tapi.edu",
      name: "Ramesh Bhai Patel",
      role: "STATIONERY_OPERATOR",
      roleTitle: "Central Stationery & Inventory Manager",
      department: "Campus Support Services",
      phone: "+91 97230 65432",
      avatarInitials: "RP"
    }
  },

  // Student Today's Schedule (Matching Visual Reference)
  studentSchedule: [
    { time: "09:00 AM", subject: "SPC (Theory)", room: "R-201", faculty: "Prof. Mehta", type: "theory", color: "#3E6E9E" },
    { time: "11:00 AM", subject: "EIDW (Lab)", room: "Lab-3", faculty: "Prof. Sharma", type: "lab", color: "#3F7D5A" },
    { time: "01:00 PM", subject: "Lunch Break", room: "Campus Canteen", faculty: "Enjoy your break! ☕", type: "break", color: "#A87932" },
    { time: "02:00 PM", subject: "AIPD (Theory)", room: "R-305", faculty: "Prof. Patel", type: "theory", color: "#3E6E9E" },
    { time: "04:00 PM", subject: "Library Time", room: "Central Library Desk 4", faculty: "Good time to get ahead 🌿", type: "study", color: "#7B8794" }
  ],

  // Faculty Today's Classes
  facultySchedule: [
    { time: "09:00 AM", class: "Class 2451 - IT", subject: "Python Programming", room: "Lab-2", attendanceDone: true },
    { time: "11:30 AM", class: "Class 2452 - IT", subject: "AIPD (Lab Batch A)", room: "Lab-3", attendanceDone: false },
    { time: "02:00 PM", class: "Class 2452 - IT", subject: "AIPD (Theory)", room: "R-305", attendanceDone: false },
    { time: "03:30 PM", class: "Class 2453 - IT", subject: "Project Mentorship", room: "Seminar Hall 1", attendanceDone: false }
  ],

  // Attention Items ("3 things need your attention.")
  attentionItems: [
    {
      id: "att-1",
      title: "Mid-term Exam Schedule Released",
      desc: "Check your GTU mid-semester exam dates and seating allocations now.",
      time: "2h ago",
      icon: "file-text",
      color: "#A94A4A",
      bg: "#FDF2F2"
    },
    {
      id: "att-2",
      title: "Library Book Due",
      desc: "\"Data Structures and Algorithms in C\" is due in 3 days.",
      time: "5h ago",
      icon: "book",
      color: "#3F7D5A",
      bg: "#EEF4EC"
    },
    {
      id: "att-3",
      title: "Hostel Maintenance Notice",
      desc: "Water supply maintenance scheduled tomorrow (10 AM – 1 PM in Block B).",
      time: "1d ago",
      icon: "wrench",
      color: "#A87932",
      bg: "#F5EEE7"
    }
  ],

  // Stationery Inventory Store
  stationeryInventory: [
    { id: "STN-101", name: "Blue Ball Pen (Reynolds 0.45)", category: "Writing", price: 10, stock: 126, minStock: 50, unit: "pcs", status: "AVAILABLE", predictedDemand: 475 },
    { id: "STN-102", name: "Data Science A4 Spiral Lab Journal", category: "Notebooks", price: 65, stock: 14, minStock: 25, unit: "books", status: "LOW_STOCK", predictedDemand: 120 },
    { id: "STN-103", name: "Engineering Drawing Sheet (Imperial A2)", category: "Sheets", price: 15, stock: 0, minStock: 40, unit: "sheets", status: "OUT_OF_STOCK", predictedDemand: 250 },
    { id: "STN-104", name: "Casio Scientific Calculator fx-991EX", category: "Calculators", price: 1250, stock: 8, minStock: 5, unit: "units", status: "AVAILABLE", predictedDemand: 15 },
    { id: "STN-105", name: "Whiteboard Dry-Erase Markers (Pack of 4)", category: "Writing", price: 140, stock: 6, minStock: 15, unit: "packs", status: "LOW_STOCK", predictedDemand: 60 },
    { id: "STN-106", name: "Microcontroller Solderless Breadboard Kit", category: "Electronics Lab", price: 180, stock: 42, minStock: 20, unit: "kits", status: "AVAILABLE", predictedDemand: 45 },
    { id: "STN-107", name: "Chemistry & IT White Lab Coat (Size 38)", category: "Apparel", price: 380, stock: 19, minStock: 10, unit: "pcs", status: "AVAILABLE", predictedDemand: 30 },
    { id: "STN-108", name: "Graph Paper Pad (100 Sheets mm grid)", category: "Sheets", price: 45, stock: 2, minStock: 20, unit: "pads", status: "LOW_STOCK", predictedDemand: 80 }
  ],

  // Student Attendance Roster for Faculty Marking
  studentRoster: [
    { rollNo: "01", enrollment: "246470316101", name: "Aarav Mehta", present: true, attendancePct: "92%" },
    { rollNo: "02", enrollment: "246470316103", name: "Rahil Shah", present: true, attendancePct: "94%" },
    { rollNo: "03", enrollment: "246470316106", name: "Jahaan Randaria", present: true, attendancePct: "91%" },
    { rollNo: "04", enrollment: "246470316110", name: "Kavya Patel", present: false, attendancePct: "78%" },
    { rollNo: "05", enrollment: "246470316113", name: "Parshva Shah", present: true, attendancePct: "89%" },
    { rollNo: "06", enrollment: "246470316115", name: "Parth Sonar", present: true, attendancePct: "87%" },
    { rollNo: "07", enrollment: "246470316116", name: "Yug Sukhadia", present: true, attendancePct: "93%" },
    { rollNo: "08", enrollment: "246470316120", name: "Diya Sharma", present: true, attendancePct: "96%" },
    { rollNo: "09", enrollment: "246470316122", name: "Meet Vora", present: false, attendancePct: "74%" },
    { rollNo: "10", enrollment: "246470316125", name: "Rohan Trivedi", present: true, attendancePct: "88%" }
  ],

  // Lost & Found Items
  lostAndFound: [
    {
      id: "LF-301",
      item: "Black Leather Bi-fold Wallet",
      type: "LOST",
      category: "Personal Accessories",
      reportedBy: "Parshva Shah (246470316113)",
      location: "Near Central Library Corridor",
      date: "10 Sep 2026",
      time: "02:15 PM",
      status: "POTENTIAL_MATCH",
      desc: "Contains GTU college ID and library membership card.",
      matchId: "LF-304"
    },
    {
      id: "LF-302",
      item: "Casio Scientific Calculator fx-991CW",
      type: "FOUND",
      category: "Electronics",
      reportedBy: "Campus Cleaning Staff",
      location: "Room 204 Desk 14",
      date: "11 Sep 2026",
      time: "09:30 AM",
      status: "CLAIM_PENDING",
      desc: "Black scientific calculator with silver keypad borders."
    },
    {
      id: "LF-303",
      item: "Blue Stainless Steel Water Bottle (Milton)",
      type: "LOST",
      category: "Personal Belongings",
      reportedBy: "Kavya Patel (246470316110)",
      location: "Sports Ground Pavilion",
      date: "09 Sep 2026",
      time: "04:45 PM",
      status: "LOST",
      desc: "750ml blue insulated bottle with Tapi stickers."
    },
    {
      id: "LF-304",
      item: "Black Men's Leather Wallet",
      type: "FOUND",
      category: "Personal Accessories",
      reportedBy: "Library Attendant (Mr. Dave)",
      location: "Reading Hall Table 3",
      date: "10 Sep 2026",
      time: "03:00 PM",
      status: "POTENTIAL_MATCH",
      desc: "Handed over to library enquiry counter. Contains GTU student card.",
      matchId: "LF-301"
    }
  ],

  // Complaints / Maintenance Tickets
  complaints: [
    {
      id: "CMP-401",
      category: "IT Infrastructure",
      subject: "Lab 3 Overhead Projector Flickering",
      description: "HDMI feed repeatedly disconnects during afternoon AIPD lab sessions.",
      location: "IT Lab 3, 2nd Floor, Main Building",
      reportedBy: "Prof. S. R. Patel",
      date: "Today, 10:15 AM",
      status: "ASSIGNED",
      assignedTo: "Hardware Maintenance Team (Mr. Rakesh)",
      priority: "HIGH"
    },
    {
      id: "CMP-402",
      category: "Campus Facilities",
      subject: "Water tap leakage near Block B Washroom",
      description: "Continuous dripping water causing slippery floor near staircase.",
      location: "Hostel Block B Ground Floor",
      reportedBy: "Parshva Shah",
      date: "Yesterday",
      status: "IN_REVIEW",
      assignedTo: "Plumbing Department",
      priority: "MEDIUM"
    },
    {
      id: "CMP-403",
      category: "Network & Wi-Fi",
      subject: "Wi-Fi Access Point unreachable in Reading Room",
      description: "SSID 'Tapi_Student_5G' shows authentication errors since morning.",
      location: "Central Library 1st Floor",
      reportedBy: "Student Council",
      date: "09 Sep 2026",
      status: "RESOLVED",
      assignedTo: "Network Operations Centre",
      priority: "LOW"
    }
  ],

  // Campus Notices
  notices: [
    {
      id: "NTC-501",
      category: "Academic",
      title: "GTU Mid-Semester Examination Schedule (Winter 2026)",
      date: "11 Sep 2026",
      audience: "All Semester 5 IT Students",
      priority: "URGENT",
      content: "Mid-semester theory examinations will commence from 24th September 2026. Hall tickets will be issued via the student portal."
    },
    {
      id: "NTC-502",
      category: "Campus Services",
      title: "Stationery Requisition Guidelines for Practical Journals",
      date: "10 Sep 2026",
      audience: "All Departments",
      priority: "NORMAL",
      content: "Certified A4 engineering and programming journals are now available at the Central Stationery counter. Check real-time counter rush before visiting."
    },
    {
      id: "NTC-503",
      category: "Events",
      title: "Annual Tech Fest 'Innovate Tapi 2026' Registrations Open",
      date: "08 Sep 2026",
      audience: "All Students & Faculty",
      priority: "NORMAL",
      content: "Participate in AI Hackathon, Web Speed Coding, and Circuit Debugging. Exciting awards and industry sponsorship."
    }
  ]
};

window.CAMPUS_DATA = CAMPUS_DATA;

