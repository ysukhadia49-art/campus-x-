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
    "ysukhadia49@gmail.com": {
      id: "246470316116",
      email: "ysukhadia49@gmail.com",
      name: "Yug Sukhadia",
      role: "STUDENT",
      roleTitle: "Student (Class 2452 - IT)",
      department: "Information Technology",
      semester: "Semester 5",
      phone: "+91 98251 00000",
      avatarInitials: "YS",
      academicRisk: {
        level: "Low Risk",
        score: "98/100",
        summary: "Optimal academic standing with consistent attendance.",
        factors: []
      }
    },
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

  // Full Weekly Student Timetable (Tapi Diploma IT Dept [16], Class 2452 - IT)
  weeklyStudentSchedule: {
    1: [ // Monday
      { time: "10:00 AM", subject: "SPC - Structured Programming with C", room: "S-21", faculty: "Mrs. Disha P. Prajapati (DPP)", type: "theory", color: "#2563EB" },
      { time: "11:00 AM", subject: "AIPD - AI Product Design", room: "S-21", faculty: "Mrs. Dipika K. Patel (DKP)", type: "theory", color: "#7C3AED" },
      { time: "12:00 PM", subject: "EIDW - Emotional Intelligence & Digital Wellbeing", room: "S-21", faculty: "Ms. Krupali D. Vaghashiya (KDV)", type: "theory", color: "#059669" },
      { time: "01:00 PM", subject: "Recess / Lunch Break", room: "Campus Canteen", faculty: "Enjoy your break! ☕", type: "break", color: "#A87932" },
      { time: "01:30 PM", subject: "SPC Lab (Batch A: DPP, T-16) / EIDW Lab (Batch B: KDV, T-14)", room: "Lab T-16 / T-14", faculty: "Mrs. Disha Prajapati / Ms. Krupali Vaghashiya", type: "lab", color: "#2563EB" },
      { time: "03:20 PM", subject: "Short Recess", room: "Campus", faculty: "10 mins tea break", type: "break", color: "#A87932" },
      { time: "03:30 PM", subject: "CDCT Lab (Batch A: MSD, T-13) / AIPD Lab (Batch B: DKP, T-15)", room: "Lab T-13 / T-15", faculty: "Miss. Mayuri Devganiya / Mrs. Dipika Patel", type: "lab", color: "#D97706" }
    ],
    2: [ // Tuesday
      { time: "10:00 AM", subject: "AIPE - AI with Prompt Engineering", room: "S-21", faculty: "Mrs. Binita B. Acharya (BBA)", type: "theory", color: "#059669" },
      { time: "11:00 AM", subject: "SPC - Structured Programming with C", room: "S-21", faculty: "Mrs. Disha P. Prajapati (DPP)", type: "theory", color: "#2563EB" },
      { time: "12:00 PM", subject: "CDCT - Cloud & Data Center Technology", room: "S-21", faculty: "Miss. Mayuri S. Devganiya (MSD)", type: "theory", color: "#D97706" },
      { time: "01:00 PM", subject: "Recess / Lunch Break", room: "Campus Canteen", faculty: "Enjoy your break! ☕", type: "break", color: "#A87932" },
      { time: "01:30 PM", subject: "AIPE Lab (Batch A: AKV, T-13) / SPC Lab (Batch B: DPP, T-16)", room: "Lab T-13 / T-16", faculty: "Mrs. Aesha Virani / Mrs. Disha Prajapati", type: "lab", color: "#059669" },
      { time: "03:20 PM", subject: "Short Recess", room: "Campus", faculty: "10 mins tea break", type: "break", color: "#A87932" },
      { time: "03:30 PM", subject: "Independent Study & Project Mentorship", room: "Central Library", faculty: "Department Faculty", type: "study", color: "#6B7280" }
    ],
    3: [ // Wednesday
      { time: "10:00 AM", subject: "AIPD - AI Product Design", room: "S-21", faculty: "Mrs. Dipika K. Patel (DKP)", type: "theory", color: "#7C3AED" },
      { time: "11:00 AM", subject: "CDCT - Cloud & Data Center Technology", room: "S-21", faculty: "Miss. Mayuri S. Devganiya (MSD)", type: "theory", color: "#D97706" },
      { time: "12:00 PM", subject: "AIPE - AI with Prompt Engineering", room: "S-21", faculty: "Mrs. Binita B. Acharya (BBA)", type: "theory", color: "#059669" },
      { time: "01:00 PM", subject: "Recess / Lunch Break", room: "Campus Canteen", faculty: "Enjoy your break! ☕", type: "break", color: "#A87932" },
      { time: "01:30 PM", subject: "Technical Seminar & Co-Curricular Lab", room: "Room S-25", faculty: "IT Faculty Team", type: "study", color: "#6B7280" }
    ],
    4: [ // Thursday
      { time: "10:00 AM", subject: "APTITUDE - Quantitative & Technical Skills", room: "S-21", faculty: "General Aptitude Faculty", type: "theory", color: "#2563EB" },
      { time: "11:00 AM", subject: "AIPE - AI with Prompt Engineering", room: "S-21", faculty: "Mrs. Binita B. Acharya (BBA)", type: "theory", color: "#059669" },
      { time: "12:00 PM", subject: "EIDW - Emotional Intelligence & Digital Wellbeing", room: "S-21", faculty: "Ms. Krupali D. Vaghashiya (KDV)", type: "theory", color: "#0284C7" },
      { time: "01:00 PM", subject: "Recess / Lunch Break", room: "Campus Canteen", faculty: "Enjoy your break! ☕", type: "break", color: "#A87932" },
      { time: "01:30 PM", subject: "AIPD Lab (Batch A: DKP, T-16) / AIPE Lab (Batch B: AKV, T-13)", room: "Lab T-16 / T-13", faculty: "Mrs. Dipika Patel / Mrs. Aesha Virani", type: "lab", color: "#7C3AED" },
      { time: "03:20 PM", subject: "Short Recess", room: "Campus", faculty: "10 mins tea break", type: "break", color: "#A87932" },
      { time: "03:30 PM", subject: "EIDW Lab (Batch A: KDV, T-14) / CDCT Lab (Batch B: MSD, T-13)", room: "Lab T-14 / T-13", faculty: "Ms. Krupali Vaghashiya / Miss. Mayuri Devganiya", type: "lab", color: "#D97706" }
    ],
    5: [ // Friday
      { time: "10:00 AM", subject: "SPC - Structured Programming with C", room: "S-21", faculty: "Mrs. Disha P. Prajapati (DPP)", type: "theory", color: "#2563EB" },
      { time: "11:00 AM", subject: "CDCT - Cloud & Data Center Technology", room: "S-21", faculty: "Miss. Mayuri S. Devganiya (MSD)", type: "theory", color: "#D97706" },
      { time: "12:00 PM", subject: "AIPD - AI Product Design", room: "S-21", faculty: "Mrs. Dipika K. Patel (DKP)", type: "theory", color: "#7C3AED" },
      { time: "01:00 PM", subject: "Recess / Lunch Break", room: "Campus Canteen", faculty: "Enjoy your break! ☕", type: "break", color: "#A87932" },
      { time: "01:30 PM", subject: "Minor Project (Batch A: NAP, T-15 / Batch B: HSJ, T-14)", room: "Lab T-15 / T-14", faculty: "Miss. Nikita Patel / Mrs. Hina Jayani", type: "lab", color: "#7C3AED" },
      { time: "03:20 PM", subject: "Short Recess", room: "Campus", faculty: "10 mins tea break", type: "break", color: "#A87932" },
      { time: "03:30 PM", subject: "Minor Project (Batch A: AKV, T-16 / Batch B: BBA, T-16)", room: "Lab T-16", faculty: "Mrs. Aesha Virani / Mrs. Binita Acharya", type: "lab", color: "#059669" }
    ],
    6: [ // Saturday
      { time: "10:00 AM", subject: "Minor Project (Batch A: AKV / Batch B: DBL)", room: "Lab T-13", faculty: "Mrs. Aesha Virani / Mrs. Dipika Patel", type: "lab", color: "#7C3AED" },
      { time: "12:00 PM", subject: "Minor Project Progress Review & Mentorship", room: "Room S-21", faculty: "Project Evaluation Committee", type: "theory", color: "#2563EB" }
    ],
    0: [ // Sunday
      { time: "All Day", subject: "Weekend - No Scheduled Lectures", room: "Campus Closed", faculty: "Rest & Independent Practice", type: "break", color: "#6B7280" }
    ]
  },

  // Dynamic getter for today's schedule based on the real-world day of week
  get studentSchedule() {
    const day = new Date().getDay();
    return this.weeklyStudentSchedule[day] || this.weeklyStudentSchedule[4];
  },

  getTodaySchedule(dayIndex) {
    if (dayIndex !== undefined && dayIndex !== null) {
      return this.weeklyStudentSchedule[dayIndex] || this.weeklyStudentSchedule[4];
    }
    const day = new Date().getDay();
    return this.weeklyStudentSchedule[day] || this.weeklyStudentSchedule[4];
  },

  // Weekly Faculty Schedule
  weeklyFacultySchedule: {
    1: [
      { time: "10:00 AM", class: "Class 2452 - IT", subject: "SPC (Theory)", room: "S-21", attendanceDone: false },
      { time: "01:30 PM", class: "Class 2452 - IT", subject: "SPC (Lab Batch A)", room: "Lab T-16", attendanceDone: false }
    ],
    2: [
      { time: "11:00 AM", class: "Class 2452 - IT", subject: "SPC (Theory)", room: "S-21", attendanceDone: false },
      { time: "01:30 PM", class: "Class 2452 - IT", subject: "SPC (Lab Batch B)", room: "Lab T-16", attendanceDone: false }
    ],
    3: [
      { time: "10:00 AM", class: "Class 2452 - IT", subject: "AIPD (Theory)", room: "S-21", attendanceDone: false }
    ],
    4: [
      { time: "10:00 AM", class: "Class 2452 - IT", subject: "Aptitude (Theory)", room: "S-21", attendanceDone: false },
      { time: "11:00 AM", class: "Class 2452 - IT", subject: "AIPE (Theory)", room: "S-21", attendanceDone: false },
      { time: "01:30 PM", class: "Class 2452 - IT", subject: "AIPD (Lab Batch A)", room: "Lab T-16", attendanceDone: false },
      { time: "03:30 PM", class: "Class 2452 - IT", subject: "EIDW (Lab Batch A)", room: "Lab T-14", attendanceDone: false }
    ],
    5: [
      { time: "10:00 AM", class: "Class 2452 - IT", subject: "SPC (Theory)", room: "S-21", attendanceDone: false },
      { time: "01:30 PM", class: "Class 2452 - IT", subject: "Minor Project (Batch A)", room: "Lab T-15", attendanceDone: false },
      { time: "03:30 PM", class: "Class 2452 - IT", subject: "Minor Project (Batch A)", room: "Lab T-16", attendanceDone: false }
    ],
    6: [
      { time: "10:00 AM", class: "Class 2452 - IT", subject: "Minor Project (Batch A)", room: "Lab T-13", attendanceDone: false }
    ],
    0: []
  },

  get facultySchedule() {
    const day = new Date().getDay();
    return this.weeklyFacultySchedule[day] || this.weeklyFacultySchedule[4];
  },

  // Attention Items (Dynamic, loaded from storage if present)
  attentionItems: (() => {
    try {
      const stored = localStorage.getItem('campusx_attention');
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return [];
  })(),

  // Stationery Inventory Store
  stationeryInventory: (() => {
    try {
      const stored = localStorage.getItem('campusx_inventory');
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return [
      { id: "STN-101", name: "Blue Ball Pen (Reynolds 0.45)", category: "Writing", price: 10, stock: 126, minStock: 50, unit: "pcs", status: "AVAILABLE", predictedDemand: 475 },
      { id: "STN-102", name: "Data Science A4 Spiral Lab Journal", category: "Notebooks", price: 65, stock: 14, minStock: 25, unit: "books", status: "LOW_STOCK", predictedDemand: 120 },
      { id: "STN-103", name: "Engineering Drawing Sheet (Imperial A2)", category: "Sheets", price: 15, stock: 0, minStock: 40, unit: "sheets", status: "OUT_OF_STOCK", predictedDemand: 250 },
      { id: "STN-104", name: "Casio Scientific Calculator fx-991EX", category: "Calculators", price: 1250, stock: 8, minStock: 5, unit: "units", status: "AVAILABLE", predictedDemand: 15 },
      { id: "STN-105", name: "Whiteboard Dry-Erase Markers (Pack of 4)", category: "Writing", price: 140, stock: 6, minStock: 15, unit: "packs", status: "LOW_STOCK", predictedDemand: 60 },
      { id: "STN-106", name: "Microcontroller Solderless Breadboard Kit", category: "Electronics Lab", price: 180, stock: 42, minStock: 20, unit: "kits", status: "AVAILABLE", predictedDemand: 45 },
      { id: "STN-107", name: "Chemistry & IT White Lab Coat (Size 38)", category: "Apparel", price: 380, stock: 19, minStock: 10, unit: "pcs", status: "AVAILABLE", predictedDemand: 30 },
      { id: "STN-108", name: "Graph Paper Pad (100 Sheets mm grid)", category: "Sheets", price: 45, stock: 2, minStock: 20, unit: "pads", status: "LOW_STOCK", predictedDemand: 80 }
    ];
  })(),

  // Student Attendance Roster for Faculty Marking (All students start unmarked)
  studentRoster: [
    { rollNo: "01", enrollment: "246470316101", name: "Aarav Mehta", present: null },
    { rollNo: "02", enrollment: "246470316103", name: "Rahil Shah", present: null },
    { rollNo: "03", enrollment: "246470316106", name: "Jahaan Randaria", present: null },
    { rollNo: "04", enrollment: "246470316110", name: "Kavya Patel", present: null },
    { rollNo: "05", enrollment: "246470316113", name: "Parshva Shah", present: null },
    { rollNo: "06", enrollment: "246470316115", name: "Parth Sonar", present: null },
    { rollNo: "07", enrollment: "246470316116", name: "Yug Sukhadia", present: null },
    { rollNo: "08", enrollment: "246470316120", name: "Diya Sharma", present: null },
    { rollNo: "09", enrollment: "246470316122", name: "Meet Vora", present: null },
    { rollNo: "10", enrollment: "246470316125", name: "Rohan Trivedi", present: null }
  ],

  // Lost & Found Directory (Dynamic, persisted in local storage)
  lostAndFound: (() => {
    try {
      const stored = localStorage.getItem('campusx_lost_found');
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return [];
  })(),

  // Complaints / Maintenance Tickets (Dynamic, persisted in local storage)
  complaints: (() => {
    try {
      const stored = localStorage.getItem('campusx_complaints');
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return [];
  })(),

  // Campus Notices (Dynamic, persisted in local storage)
  notices: (() => {
    try {
      const stored = localStorage.getItem('campusx_notices');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return [
      {
        id: "NTC-501",
        category: "Academic Circular",
        title: "GTU Mid-Semester Examination Schedule (Winter 2026)",
        date: "Today",
        time: "9:00 AM",
        audience: "All Semester 5 IT Students",
        department: "Information Technology",
        priority: "High",
        pinned: true,
        postedBy: "Dr. A. K. Joshi (Admin)",
        description: "All 3rd and 5th-semester diploma engineering students are required to verify their examination slots and hall ticket particulars with departmental coordinators.",
        desc: "All 3rd and 5th-semester diploma engineering students are required to verify their examination slots and hall ticket particulars with departmental coordinators."
      },
      {
        id: "NTC-502",
        category: "Campus Event",
        title: "Annual Tech Symposium \"IGNITE 2026\" Registrations Open",
        date: "Yesterday",
        time: "2:30 PM",
        audience: "All Students & Faculty",
        department: "All Departments",
        priority: "Normal",
        pinned: false,
        postedBy: "Prof. S. R. Patel (Faculty)",
        description: "Paper presentation, robotics challenge, and coding hackathon entries are now accepted at the central auditorium lobby.",
        desc: "Paper presentation, robotics challenge, and coding hackathon entries are now accepted at the central auditorium lobby."
      },
      {
        id: "NTC-503",
        category: "Campus Services",
        title: "Stationery Requisition Guidelines for Practical Journals",
        date: "10 Sep 2026",
        time: "11:00 AM",
        audience: "All Departments",
        department: "Campus Support Services",
        priority: "Normal",
        pinned: false,
        postedBy: "Ramesh Bhai Patel (Stationery)",
        description: "Certified A4 engineering and programming journals are now available at the Central Stationery counter. Check real-time counter rush before visiting.",
        desc: "Certified A4 engineering and programming journals are now available at the Central Stationery counter. Check real-time counter rush before visiting."
      }
    ];
  })(),

  // Real-Time Student Attendance Calculation Engine
  getStudentAttendance(studentIdentifier) {
    let recs = [];
    try {
      recs = JSON.parse(localStorage.getItem('campusx_attendance_records') || '[]');
    } catch(e) {}
    if (!Array.isArray(recs) || recs.length === 0) {
      return { totalHeld: 0, totalAttended: 0, percentage: null, percentageStr: "--%", compliant: true, statusText: "Awaiting Markings" };
    }
    const cleanId = String(studentIdentifier || '').trim().toLowerCase();
    let attended = 0;
    recs.forEach(r => {
      if (Array.isArray(r.records)) {
        const match = r.records.find(s => 
          (s.enrollment && s.enrollment.toLowerCase() === cleanId) ||
          (s.rollNo && s.rollNo.toLowerCase() === cleanId) ||
          (s.name && s.name.toLowerCase() === cleanId)
        );
        if (match && match.present) attended++;
      } else {
        attended++;
      }
    });
    const pct = Number(((attended / recs.length) * 100).toFixed(1));
    const compliant = pct >= 75;
    return {
      totalHeld: recs.length,
      totalAttended: attended,
      percentage: pct,
      percentageStr: `${pct}%`,
      compliant,
      statusText: compliant ? "GTU Compliant" : "Low Attendance"
    };
  },

  // Emergency Hotlines & Campus Safety Hotlines
  emergencyContacts: [
    { 
      id: 'SEC-1', 
      title: 'Campus Security Control Room', 
      phone: '+91 261 2345678', 
      type: 'Security', 
      location: 'Gate 1 Main Guard Command Station', 
      available: '24/7 Priority Line' 
    },
    { 
      id: 'MED-1', 
      title: 'Medical First Aid & Doctor on Call', 
      phone: '+91 261 2345679', 
      type: 'Medical', 
      location: 'Campus Health Clinic, Ground Floor Room 102', 
      available: '24/7 On-Duty Medical' 
    },
    { 
      id: 'FIRE-1', 
      title: 'Campus Fire & Safety Officer', 
      phone: '+91 94280 12345', 
      type: 'Fire Safety', 
      location: 'Central Disaster Response Post, Block B', 
      available: '24/7 Emergency Response' 
    },
    { 
      id: 'WARD-1', 
      title: 'Hostel Chief Warden Office', 
      phone: '+91 261 2345680', 
      type: 'Hostel Care', 
      location: 'Hostel Administrative Office', 
      available: '8:00 AM - 10:00 PM' 
    }
  ],

  // Emergency Alert Broadcast Feed
  emergencyBroadcasts: (() => {
    try {
      const stored = localStorage.getItem('campusx_emergency_broadcasts');
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return [
      { 
        id: 1, 
        text: 'ALERT: Electrical maintenance near Computer Lab 4 tomorrow 10 AM. Stay alert around ground transformers.', 
        sender: 'Admin Office', 
        time: 'Yesterday',
        priority: 'Notice'
      },
      { 
        id: 2, 
        text: 'CAMPUS ADVISORY: Heavy rainfall alert in Surat region. Please keep to designated covered corridors.', 
        sender: 'Campus Security', 
        time: '2 days ago',
        priority: 'Advisory'
      }
    ];
  })(),
  uploadedTimetables: (() => {
    try {
      const stored = localStorage.getItem('campusx_uploaded_timetables');
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return [
      {
        id: "TT-2452-BASE",
        classId: "Class 2452 - IT",
        className: "Class 2452 - IT (Room S-21 / S-25)",
        semester: "5th Semester",
        department: "Information Technology [16]",
        room: "S-21 / S-25 (Second Floor)",
        term: "15/06/2026 To 30/10/2026",
        effectiveDate: "2026-06-15",
        title: "Official 5th Sem IT Weekly Time Table",
        uploadedBy: "Mrs. Binita B. Acharya (H.O.D.)",
        uploadedByRole: "FACULTY",
        uploadedAt: "2026-06-15T09:00:00.000Z",
        attachmentName: "Official_5th_Sem_IT_Timetable_TDEC.pdf",
        attachmentSize: "184 KB",
        attachmentUrl: null,
        attachmentType: "application/pdf",
        description: "Official statutory teaching and practical allocation for 5th Semester Information Technology, Approved by GTU & Academic Council.",
        isDefault: true,
        totalHours: 40
      }
    ];
  })()
};

// Hydrate any registered institutional accounts from persistent local storage
try {
  const customUsers = JSON.parse(localStorage.getItem('campusx_custom_users') || '{}');
  Object.assign(CAMPUS_DATA.accounts, customUsers);
} catch (e) {}

window.CAMPUS_DATA = CAMPUS_DATA;

