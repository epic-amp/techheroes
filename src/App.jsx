import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  LayoutDashboard, Users, UsersRound, FolderKanban, ClipboardList, BookOpen,
  MessageSquare, GraduationCap, BarChart3, Settings, Search, Plus, Pencil,
  Trash2, X, Bell, Sun, Moon, Globe, LogOut, Send, Paperclip, Download,
  Upload, CheckCircle2, Clock, AlertTriangle, FileText, Image as ImageIcon,
  ChevronRight, Menu, Award, TrendingUp, Pin, CircleUserRound, Star,
  Calendar, Filter, ShieldCheck, Sparkles, ArrowUpRight
} from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar
} from "recharts";

/* ============================== i18n ============================== */
const T = {
  en: {
    dir: "ltr", brand: "TechHeroes", tagline: "Empowering Learning Through Collaboration",
    student: "Student", team: "Team", tutor: "Tutor", admin: "Admin",
    studentLogin: "Student Login", teamLogin: "Team Login", tutorLogin: "Tutor / Admin",
    studentId: "Student ID", teamId: "Team ID", password: "Password",
    login: "Log in", enterAsTeam: "Enter as Team", continueAs: "Continue as",
    demoHint: "Demo access — tap a role to explore",
    welcome: "Welcome back", signOut: "Sign out",
    nav: {
      dashboard: "Dashboard", students: "Students", teams: "Teams", groups: "Groups",
      assignments: "Assignments", materials: "Materials", chats: "Chats",
      grades: "Grades", analytics: "Analytics", settings: "Settings",
      myGroups: "My Groups", myMaterials: "Materials", myAssignments: "Assignments",
      myGrades: "Grades", chat: "Chat", profile: "Profile",
    },
    stats: {
      totalStudents: "Total students", totalTeams: "Total teams", activeGroups: "Active groups",
      pendingAssignments: "Pending assignments", submittedAssignments: "Submitted", avgGrade: "Average grade",
    },
    charts: { studentProgress: "Student progress", assignmentCompletion: "Assignment completion", groupActivity: "Group activity" },
    addStudent: "Add student", editStudent: "Edit student", deleteStudent: "Delete student",
    name: "Name", email: "Email", group: "Group", status: "Status", actions: "Actions",
    active: "Active", inactive: "Inactive", searchStudents: "Search students…",
    allGroups: "All groups", save: "Save", cancel: "Cancel", create: "Create",
    createGroup: "Create group", groupName: "Group name", members: "Members",
    progress: "Progress", tasks: "Tasks", rename: "Rename", deleteGroup: "Delete",
    uploadMaterial: "Upload material", title: "Title", assignTo: "Assign to",
    type: "Type", date: "Date", createAssignment: "Create assignment",
    description: "Description", deadline: "Deadline", attachments: "Attachments",
    pending: "Pending", submitted: "Submitted", late: "Late", graded: "Graded",
    individual: "Individual", groupAssignment: "Group", viewSubmissions: "Submissions",
    download: "Download", grade: "Grade", feedback: "Feedback", giveGrade: "Grade it",
    personalChat: "Personal", groupChat: "Groups", typeMessage: "Type a message…",
    pinned: "Pinned", send: "Send", engagement: "Student engagement",
    completionRate: "Completion rate", topPerformers: "Top performers",
    atRisk: "At-risk students", language: "Language", appearance: "Appearance",
    light: "Light", dark: "Dark", notifications: "Notifications",
    notifPrefs: "Notification preferences", emailNotif: "Email notifications",
    pushNotif: "Push notifications", profileMgmt: "Profile", fullName: "Full name",
    submit: "Submit work", submitted2: "Submitted", uploadFiles: "Upload files",
    dragDrop: "Drag files here or browse — PDF, DOCX, PPTX, XLSX, ZIP, JPG, PNG",
    yourGrade: "Your grade", noGradeYet: "Awaiting grade", openChat: "Open chat",
    notifTitle: "Notifications", markAllRead: "Mark all read", viewAll: "View all",
    newAssignment: "New assignment", newMaterial: "New material", newMessage: "New message",
    gradePublished: "Grade published", deadlineSoon: "Deadline approaching",
    seeDetails: "See details", overview: "Overview", thisWeek: "this week",
    of: "of", complete: "complete", noResults: "No students match your search.",
    confirmDelete: "Remove this account? This can't be undone.",
    teamMembers: "Team members", teamSubmissions: "Team submissions",
    contactTutor: "Message tutor", performance: "Performance",
    deadlines: "Upcoming deadlines", recentActivity: "Recent activity",
    quickActions: "Quick actions", searchMessages: "Search messages…",
  },
  ar: {
    dir: "rtl", brand: "TechHeroes", tagline: "تمكين التعلم من خلال التعاون",
    student: "طالب", team: "فريق", tutor: "المعلّم", admin: "مشرف",
    studentLogin: "دخول الطالب", teamLogin: "دخول الفريق", tutorLogin: "المعلّم / المشرف",
    studentId: "رقم الطالب", teamId: "رقم الفريق", password: "كلمة المرور",
    login: "تسجيل الدخول", enterAsTeam: "الدخول كفريق", continueAs: "المتابعة كـ",
    demoHint: "وصول تجريبي — اختر دورًا للاستكشاف",
    welcome: "مرحبًا بعودتك", signOut: "تسجيل الخروج",
    nav: {
      dashboard: "لوحة التحكم", students: "الطلاب", teams: "الفِرق", groups: "المجموعات",
      assignments: "الواجبات", materials: "المواد", chats: "المحادثات",
      grades: "الدرجات", analytics: "التحليلات", settings: "الإعدادات",
      myGroups: "مجموعاتي", myMaterials: "المواد", myAssignments: "الواجبات",
      myGrades: "الدرجات", chat: "المحادثة", profile: "الملف الشخصي",
    },
    stats: {
      totalStudents: "إجمالي الطلاب", totalTeams: "إجمالي الفِرق", activeGroups: "المجموعات النشطة",
      pendingAssignments: "واجبات معلّقة", submittedAssignments: "تم التسليم", avgGrade: "متوسط الدرجات",
    },
    charts: { studentProgress: "تقدّم الطلاب", assignmentCompletion: "إنجاز الواجبات", groupActivity: "نشاط المجموعات" },
    addStudent: "إضافة طالب", editStudent: "تعديل الطالب", deleteStudent: "حذف الطالب",
    name: "الاسم", email: "البريد الإلكتروني", group: "المجموعة", status: "الحالة", actions: "إجراءات",
    active: "نشط", inactive: "غير نشط", searchStudents: "ابحث عن طالب…",
    allGroups: "كل المجموعات", save: "حفظ", cancel: "إلغاء", create: "إنشاء",
    createGroup: "إنشاء مجموعة", groupName: "اسم المجموعة", members: "الأعضاء",
    progress: "التقدّم", tasks: "المهام", rename: "إعادة تسمية", deleteGroup: "حذف",
    uploadMaterial: "رفع مادة", title: "العنوان", assignTo: "تعيين إلى",
    type: "النوع", date: "التاريخ", createAssignment: "إنشاء واجب",
    description: "الوصف", deadline: "الموعد النهائي", attachments: "المرفقات",
    pending: "معلّق", submitted: "تم التسليم", late: "متأخر", graded: "مُقيّم",
    individual: "فردي", groupAssignment: "جماعي", viewSubmissions: "التسليمات",
    download: "تنزيل", grade: "الدرجة", feedback: "الملاحظات", giveGrade: "تقييم",
    personalChat: "خاص", groupChat: "المجموعات", typeMessage: "اكتب رسالة…",
    pinned: "مثبّت", send: "إرسال", engagement: "تفاعل الطلاب",
    completionRate: "نسبة الإنجاز", topPerformers: "الأعلى أداءً",
    atRisk: "طلاب بحاجة لمتابعة", language: "اللغة", appearance: "المظهر",
    light: "فاتح", dark: "داكن", notifications: "الإشعارات",
    notifPrefs: "تفضيلات الإشعارات", emailNotif: "إشعارات البريد",
    pushNotif: "الإشعارات الفورية", profileMgmt: "الملف الشخصي", fullName: "الاسم الكامل",
    submit: "تسليم العمل", submitted2: "تم التسليم", uploadFiles: "رفع الملفات",
    dragDrop: "اسحب الملفات هنا أو تصفّح — PDF, DOCX, PPTX, XLSX, ZIP, JPG, PNG",
    yourGrade: "درجتك", noGradeYet: "بانتظار التقييم", openChat: "فتح المحادثة",
    notifTitle: "الإشعارات", markAllRead: "تعليم الكل كمقروء", viewAll: "عرض الكل",
    newAssignment: "واجب جديد", newMaterial: "مادة جديدة", newMessage: "رسالة جديدة",
    gradePublished: "نُشرت الدرجة", deadlineSoon: "اقتراب الموعد النهائي",
    seeDetails: "التفاصيل", overview: "نظرة عامة", thisWeek: "هذا الأسبوع",
    of: "من", complete: "مكتمل", noResults: "لا يوجد طلاب مطابقون.",
    confirmDelete: "حذف هذا الحساب؟ لا يمكن التراجع.",
    teamMembers: "أعضاء الفريق", teamSubmissions: "تسليمات الفريق",
    contactTutor: "مراسلة المعلّم", performance: "الأداء",
    deadlines: "مواعيد قادمة", recentActivity: "النشاط الأخير",
    quickActions: "إجراءات سريعة", searchMessages: "ابحث في الرسائل…",
  },
};

/* ============================== Seed data ============================== */
const SEED_STUDENTS = [
  { id: "S-24001", name: "Layla Hassan", email: "layla@techheroes.io", group: "Frontend Cohort", status: "active", grade: 94 },
  { id: "S-24002", name: "Omar Khalil", email: "omar@techheroes.io", group: "Backend Cohort", status: "active", grade: 88 },
  { id: "S-24003", name: "Sara Nasser", email: "sara@techheroes.io", group: "Frontend Cohort", status: "active", grade: 76 },
  { id: "S-24004", name: "Yusuf Amin", email: "yusuf@techheroes.io", group: "Data Cohort", status: "inactive", grade: 61 },
  { id: "S-24005", name: "Mariam Adel", email: "mariam@techheroes.io", group: "Backend Cohort", status: "active", grade: 91 },
  { id: "S-24006", name: "Karim Fouad", email: "karim@techheroes.io", group: "Data Cohort", status: "active", grade: 58 },
  { id: "S-24007", name: "Nour Saleh", email: "nour@techheroes.io", group: "Frontend Cohort", status: "active", grade: 83 },
];
const SEED_GROUPS = [
  { id: "g1", name: "Frontend Cohort", desc: "React, UI systems & accessibility", members: 3, progress: 78, tasks: 12, materials: 9 },
  { id: "g2", name: "Backend Cohort", desc: "APIs, databases & auth", members: 2, progress: 64, tasks: 10, materials: 7 },
  { id: "g3", name: "Data Cohort", desc: "Python, SQL & visualization", members: 2, progress: 41, tasks: 8, materials: 6 },
];
const SEED_ASSIGNMENTS = [
  { id: "a1", title: "Responsive Landing Page", group: "Frontend Cohort", deadline: "Jun 22", type: "group", status: "submitted" },
  { id: "a2", title: "REST API with JWT Auth", group: "Backend Cohort", deadline: "Jun 25", type: "individual", status: "pending" },
  { id: "a3", title: "Sales Data Cleaning", group: "Data Cohort", deadline: "Jun 18", type: "individual", status: "late" },
  { id: "a4", title: "Accessibility Audit", group: "Frontend Cohort", deadline: "Jun 28", type: "group", status: "graded" },
];
const SEED_MATERIALS = [
  { id: "m1", title: "React Hooks — Deep Dive", type: "PDF", target: "Frontend Cohort", date: "Jun 10" },
  { id: "m2", title: "Designing REST APIs", type: "PPTX", target: "Backend Cohort", date: "Jun 11" },
  { id: "m3", title: "Intro to Pandas", type: "Video", target: "Data Cohort", date: "Jun 12" },
  { id: "m4", title: "Color & Contrast Guide", type: "Link", target: "All groups", date: "Jun 13" },
  { id: "m5", title: "SQL Cheat Sheet", type: "DOCX", target: "S-24004", date: "Jun 14" },
];
const SEED_GRADES = [
  { id: "gr1", student: "Layla Hassan", assignment: "Responsive Landing Page", grade: 95, letter: "A", feedback: "Excellent work. Meets all requirements." },
  { id: "gr2", student: "Omar Khalil", assignment: "REST API with JWT Auth", grade: 88, letter: "B+", feedback: "Solid. Tighten error handling." },
  { id: "gr3", student: "Sara Nasser", assignment: "Accessibility Audit", grade: 79, letter: "B", feedback: "Good start — check focus order." },
  { id: "gr4", student: "Karim Fouad", assignment: "Sales Data Cleaning", grade: 58, letter: "D", feedback: "Let's review together this week." },
];
const PROGRESS_SERIES = [
  { w: "W1", Frontend: 30, Backend: 22, Data: 18 },
  { w: "W2", Frontend: 45, Backend: 35, Data: 25 },
  { w: "W3", Frontend: 58, Backend: 44, Data: 30 },
  { w: "W4", Frontend: 66, Backend: 52, Data: 35 },
  { w: "W5", Frontend: 78, Backend: 64, Data: 41 },
];
const COMPLETION_SERIES = [
  { name: "Frontend", value: 86 }, { name: "Backend", value: 71 }, { name: "Data", value: 53 },
];
const ACTIVITY_SERIES = [
  { d: "Mon", msgs: 42 }, { d: "Tue", msgs: 65 }, { d: "Wed", msgs: 51 },
  { d: "Thu", msgs: 78 }, { d: "Fri", msgs: 96 }, { d: "Sat", msgs: 34 }, { d: "Sun", msgs: 21 },
];
const SEED_NOTIFS = [
  { id: "n1", kind: "assignment", t: "New assignment", b: "REST API with JWT Auth · due Jun 25", read: false },
  { id: "n2", kind: "grade", t: "Grade published", b: "Responsive Landing Page · 95 (A)", read: false },
  { id: "n3", kind: "message", t: "New message", b: "Omar Khalil sent you a message", read: false },
  { id: "n4", kind: "deadline", t: "Deadline approaching", b: "Sales Data Cleaning · due tomorrow", read: true },
];
const initialChats = () => ([
  { id: "c1", who: "Layla Hassan", role: "student", last: "Thanks, that helped!", unread: 0, msgs: [
    { from: "them", text: "Hi! Quick question on the landing page grid.", time: "09:12" },
    { from: "me", text: "Sure — use a 12-column layout and collapse to 4 on mobile.", time: "09:15" },
    { from: "them", text: "Thanks, that helped!", time: "09:16" },
  ]},
  { id: "c2", who: "Omar Khalil", role: "student", last: "Pushed the auth fix.", unread: 2, msgs: [
    { from: "them", text: "JWT refresh is failing on logout.", time: "10:01" },
    { from: "me", text: "Clear the refresh cookie server-side on logout.", time: "10:04" },
    { from: "them", text: "Pushed the auth fix.", time: "10:20" },
  ]},
  { id: "g1", who: "Frontend Cohort", role: "group", last: "Pinned: rubric posted 📌", unread: 5, pinned: "Rubric for the landing page is posted in Materials.", msgs: [
    { from: "Sara", text: "Is the audit individual or group?", time: "11:00" },
    { from: "me", text: "Group — one submission per team.", time: "11:02" },
    { from: "Nour", text: "Got it, thanks!", time: "11:05" },
  ]},
]);

/* ============================== Small UI atoms ============================== */
const cx = (...a) => a.filter(Boolean).join(" ");

function Badge({ kind, children }) {
  return <span className={cx("th-badge", kind && `th-badge--${kind}`)}>{children}</span>;
}

function Avatar({ name, size = 36 }) {
  const initials = name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
  return <span className="th-avatar" style={{ width: size, height: size, fontSize: size * 0.38 }}>{initials}</span>;
}

function Modal({ open, onClose, title, children, footer }) {
  if (!open) return null;
  return (
    <div className="th-modal-scrim" onClick={onClose}>
      <div className="th-modal" onClick={e => e.stopPropagation()}>
        <div className="th-modal__head">
          <h3>{title}</h3>
          <button className="th-iconbtn" onClick={onClose} aria-label="Close"><X size={18} /></button>
        </div>
        <div className="th-modal__body">{children}</div>
        {footer && <div className="th-modal__foot">{footer}</div>}
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return <label className="th-field"><span className="th-field__label">{label}</span>{children}</label>;
}

function Donut({ value }) {
  const data = [{ name: "v", value, fill: "var(--brand)" }];
  return (
    <ResponsiveContainer width="100%" height={120}>
      <RadialBarChart innerRadius="70%" outerRadius="100%" data={data} startAngle={90} endAngle={-270}>
        <RadialBar background={{ fill: "var(--line)" }} dataKey="value" cornerRadius={20} />
      </RadialBarChart>
    </ResponsiveContainer>
  );
}

/* ============================== Login ============================== */
function Login({ t, lang, theme, onLang, onTheme, onLogin }) {
  const [tab, setTab] = useState("student");
  const fields = {
    student: { id: t.studentId, ph: "S-24001" },
    tutor: { id: t.tutor, ph: "tutor@techheroes.io" },
  }[tab];

  return (
    <div className="th-login">
      <div className="th-login__topbar">
        <Brandmark t={t} />
        <div className="th-login__controls">
          <button className="th-pillbtn" onClick={onLang}><Globe size={16} />{lang === "en" ? "العربية" : "English"}</button>
          <button className="th-iconbtn th-iconbtn--ring" onClick={onTheme} aria-label="Toggle theme">
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          </button>
        </div>
      </div>

      <div className="th-login__grid">
        <section className="th-hero">
          <div className="th-hero__orbit" aria-hidden="true">
            <span className="th-orbit th-orbit--1" /><span className="th-orbit th-orbit--2" />
            <span className="th-spark"><Sparkles size={20} /></span>
          </div>
          <p className="th-eyebrow"><ShieldCheck size={14} /> {t.brand}</p>
          <h1 className="th-hero__title">{t.tagline}</h1>
          <p className="th-hero__sub">
            {lang === "en"
              ? "An organized learning environment where tutors guide, students build, and everyone grows — together."
              : "بيئة تعلّم منظّمة يوجّه فيها المعلّمون، ويتعلّم فيها الطلاب وينمون — معًا."}
          </p>
          <div className="th-hero__stats">
            <div><strong>320+</strong><span>{t.stats.totalStudents}</span></div>
            <div><strong>24</strong><span>{t.stats.activeGroups}</span></div>
            <div><strong>96%</strong><span>{t.completionRate}</span></div>
          </div>
        </section>

        <section className="th-authcard">
          <div className="th-segment">
            {["student", "tutor"].map(k => (
              <button key={k} className={cx("th-segment__btn", tab === k && "is-active")} onClick={() => setTab(k)}>
                {k === "student" ? t.student : t.tutor}
              </button>
            ))}
          </div>

          <h2 className="th-authcard__title">
            {tab === "student" ? t.studentLogin : t.tutorLogin}
          </h2>

          <Field label={fields.id}>
            <input className="th-input" defaultValue={fields.ph} placeholder={fields.ph} />
          </Field>
          <Field label={t.password}>
            <input className="th-input" type="password" defaultValue="demo1234" />
          </Field>

          <button className="th-btn th-btn--primary th-btn--lg" onClick={() => onLogin(tab)}>
            {t.login} <ChevronRight size={18} className="th-rtl-flip" />
          </button>

          <div className="th-divider"><span>{t.demoHint}</span></div>
          <div className="th-demo-roles">
            <button className="th-chip" onClick={() => onLogin("tutor")}><GraduationCap size={15} /> {t.tutor}</button>
            <button className="th-chip" onClick={() => onLogin("student")}><CircleUserRound size={15} /> {t.student}</button>
          </div>
        </section>
      </div>
    </div>
  );
}

function Brandmark({ t, compact }) {
  return (
    <div className={cx("th-brand", compact && "th-brand--compact")}>
      <span className="th-brand__mark"><GraduationCap size={20} /><i className="th-brand__spark" /></span>
      {!compact && <span className="th-brand__text">{t.brand}</span>}
    </div>
  );
}

/* ============================== Shell ============================== */
function Shell({ t, lang, theme, role, onLang, onTheme, onLogout, children, nav, view, setView, notifs, setNotifs }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const unread = notifs.filter(n => !n.read).length;
  const roleLabel = role === "tutor" ? t.tutor : t.student;

  return (
    <div className="th-shell">
      <aside className={cx("th-sidebar", mobileOpen && "is-open")}>
        <div className="th-sidebar__head">
          <Brandmark t={t} />
          <button className="th-iconbtn th-sidebar__close" onClick={() => setMobileOpen(false)}><X size={18} /></button>
        </div>
        <nav className="th-nav">
          {nav.map(item => (
            <button key={item.key}
              className={cx("th-nav__item", view === item.key && "is-active")}
              onClick={() => { setView(item.key); setMobileOpen(false); }}>
              <item.icon size={18} />
              <span>{item.label}</span>
              {view === item.key && <span className="th-nav__bar" />}
            </button>
          ))}
        </nav>
        <div className="th-sidebar__foot">
          <div className="th-userpill">
            <Avatar name={role === "tutor" ? "Dr Amina Said" : "Layla Hassan"} size={34} />
            <div className="th-userpill__meta">
              <strong>{role === "tutor" ? "Dr Amina Said" : "Layla Hassan"}</strong>
              <span>{roleLabel}</span>
            </div>
            <button className="th-iconbtn" onClick={onLogout} aria-label={t.signOut}><LogOut size={16} /></button>
          </div>
        </div>
      </aside>

      {mobileOpen && <div className="th-scrim" onClick={() => setMobileOpen(false)} />}

      <div className="th-main">
        <header className="th-topbar">
          <button className="th-iconbtn th-topbar__menu" onClick={() => setMobileOpen(true)}><Menu size={20} /></button>
          <div className="th-topbar__title">
            <span className="th-topbar__crumb">{roleLabel}</span>
            <ChevronRight size={14} className="th-rtl-flip th-topbar__sep" />
            <strong>{nav.find(n => n.key === view)?.label}</strong>
          </div>
          <div className="th-topbar__actions">
            <button className="th-pillbtn" onClick={onLang}><Globe size={16} />{lang === "en" ? "ع" : "EN"}</button>
            <button className="th-iconbtn th-iconbtn--ring" onClick={onTheme} aria-label="Toggle theme">
              {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            <div className="th-bellwrap">
              <button className="th-iconbtn th-iconbtn--ring" onClick={() => setBellOpen(o => !o)} aria-label={t.notifications}>
                <Bell size={18} />{unread > 0 && <span className="th-bell-dot">{unread}</span>}
              </button>
              {bellOpen && (
                <div className="th-popover" onMouseLeave={() => setBellOpen(false)}>
                  <div className="th-popover__head">
                    <strong>{t.notifTitle}</strong>
                    <button className="th-link" onClick={() => setNotifs(notifs.map(n => ({ ...n, read: true })))}>{t.markAllRead}</button>
                  </div>
                  <div className="th-popover__list">
                    {notifs.map(n => (
                      <div key={n.id} className={cx("th-notif", !n.read && "is-unread")}>
                        <span className={cx("th-notif__ic", `th-notif__ic--${n.kind}`)}>
                          {n.kind === "assignment" ? <ClipboardList size={15} /> : n.kind === "grade" ? <Award size={15} /> :
                           n.kind === "message" ? <MessageSquare size={15} /> : <Clock size={15} />}
                        </span>
                        <div><strong>{n.t}</strong><span>{n.b}</span></div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>
        <main className="th-content">{children}</main>
      </div>
    </div>
  );
}

/* ============================== Reusable section bits ============================== */
function PageHead({ title, subtitle, action }) {
  return (
    <div className="th-pagehead">
      <div><h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</div>
      {action}
    </div>
  );
}

function Card({ children, className }) { return <div className={cx("th-card", className)}>{children}</div>; }

/* ============================== TUTOR sections ============================== */
function TutorDashboard({ t, lang, students, groups, assignments }) {
  const avg = Math.round(students.reduce((s, x) => s + x.grade, 0) / students.length);
  const stats = [
    { k: "totalStudents", v: students.length, ic: Users, d: "+3 " + t.thisWeek },
    { k: "activeGroups", v: groups.length, ic: FolderKanban, d: t.overview },
    { k: "pendingAssignments", v: assignments.filter(a => a.status === "pending" || a.status === "late").length, ic: ClipboardList, d: "" },
    { k: "submittedAssignments", v: assignments.filter(a => a.status === "submitted" || a.status === "graded").length, ic: CheckCircle2, d: "" },
    { k: "avgGrade", v: avg, ic: Award, d: t.overview, suffix: "" },
  ];
  const localized = lang === "ar"; // legend localization
  return (
    <>
      <PageHead title={t.nav.dashboard} subtitle={t.welcome + ", Dr Amina."} />
      <div className="th-statgrid">
        {stats.map(s => (
          <Card key={s.k} className="th-stat">
            <span className="th-stat__ic"><s.ic size={20} /></span>
            <div className="th-stat__body">
              <span className="th-stat__label">{t.stats[s.k]}</span>
              <strong className="th-stat__value">{s.v}</strong>
              {s.d && <span className="th-stat__delta"><ArrowUpRight size={12} className="th-rtl-flip" />{s.d}</span>}
            </div>
          </Card>
        ))}
      </div>

      <div className="th-chartgrid">
        <Card className="th-chartcard th-chartcard--wide">
          <div className="th-chartcard__head"><h3>{t.charts.studentProgress}</h3><Badge kind="brand"><TrendingUp size={12} /> +14%</Badge></div>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={PROGRESS_SERIES} margin={{ left: -18, right: 8, top: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" vertical={false} />
              <XAxis dataKey="w" stroke="var(--muted)" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis stroke="var(--muted)" tickLine={false} axisLine={false} fontSize={12} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="Frontend" stroke="var(--brand)" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="Backend" stroke="var(--ink-soft)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="Data" stroke="var(--muted)" strokeWidth={2} strokeDasharray="4 4" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="th-chartcard">
          <div className="th-chartcard__head"><h3>{t.charts.assignmentCompletion}</h3></div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={COMPLETION_SERIES} margin={{ left: -18, right: 8, top: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" vertical={false} />
              <XAxis dataKey="name" stroke="var(--muted)" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis stroke="var(--muted)" tickLine={false} axisLine={false} fontSize={12} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "var(--brand-soft)" }} />
              <Bar dataKey="value" radius={[8, 8, 0, 0]} fill="var(--brand)" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="th-chartcard th-chartcard--wide">
          <div className="th-chartcard__head"><h3>{t.charts.groupActivity}</h3></div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={ACTIVITY_SERIES} margin={{ left: -18, right: 8, top: 8 }}>
              <defs>
                <linearGradient id="actfill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--brand)" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="var(--brand)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" vertical={false} />
              <XAxis dataKey="d" stroke="var(--muted)" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis stroke="var(--muted)" tickLine={false} axisLine={false} fontSize={12} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="msgs" stroke="var(--brand)" strokeWidth={2.5} fill="url(#actfill)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card className="th-chartcard">
          <div className="th-chartcard__head"><h3>{t.deadlines}</h3></div>
          <ul className="th-deadlines">
            {assignments.slice(0, 4).map(a => (
              <li key={a.id}>
                <span className="th-deadlines__cal"><Calendar size={15} /></span>
                <div><strong>{a.title}</strong><span>{a.group}</span></div>
                <Badge kind={statusKind(a.status)}>{a.deadline}</Badge>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  );
}

function StudentsSection({ t, students, setStudents, groups }) {
  const [q, setQ] = useState("");
  const [groupF, setGroupF] = useState("");
  const [modal, setModal] = useState(null); // {mode, data}
  const filtered = students.filter(s =>
    (s.name.toLowerCase().includes(q.toLowerCase()) || s.id.toLowerCase().includes(q.toLowerCase())) &&
    (!groupF || s.group === groupF)
  );
  const blank = { id: "", name: "", email: "", group: groups[0]?.name || "", status: "active", grade: 0 };

  const save = (data) => {
    if (modal.mode === "add") setStudents([...students, { ...data, grade: Number(data.grade) || 0 }]);
    else setStudents(students.map(s => s.id === modal.data.id ? { ...data, grade: Number(data.grade) || 0 } : s));
    setModal(null);
  };
  const del = (id) => { if (window.confirm(t.confirmDelete)) setStudents(students.filter(s => s.id !== id)); };

  return (
    <>
      <PageHead title={t.nav.students} subtitle={`${students.length} ${t.nav.students.toLowerCase()}`}
        action={<button className="th-btn th-btn--primary" onClick={() => setModal({ mode: "add", data: blank })}><Plus size={16} />{t.addStudent}</button>} />
      <Card>
        <div className="th-toolbar">
          <div className="th-search">
            <Search size={16} />
            <input value={q} onChange={e => setQ(e.target.value)} placeholder={t.searchStudents} />
          </div>
          <div className="th-select">
            <Filter size={15} />
            <select value={groupF} onChange={e => setGroupF(e.target.value)}>
              <option value="">{t.allGroups}</option>
              {groups.map(g => <option key={g.id} value={g.name}>{g.name}</option>)}
            </select>
          </div>
        </div>
        <div className="th-tablewrap">
          <table className="th-table">
            <thead><tr>
              <th>{t.name}</th><th>S-NUM</th><th>{t.email}</th><th>{t.group}</th><th>{t.status}</th><th className="th-ta-end">{t.actions}</th>
            </tr></thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id}>
                  <td><div className="th-cellname"><Avatar name={s.name} size={32} /><span>{s.name}</span></div></td>
                  <td><span className="th-mono">{s.id}</span></td>
                  <td className="th-muted">{s.email}</td>
                  <td>{s.group}</td>
                  <td><Badge kind={s.status === "active" ? "ok" : "muted"}>{s.status === "active" ? t.active : t.inactive}</Badge></td>
                  <td className="th-ta-end">
                    <div className="th-rowactions">
                      <button className="th-iconbtn" onClick={() => setModal({ mode: "edit", data: s })}><Pencil size={15} /></button>
                      <button className="th-iconbtn th-iconbtn--danger" onClick={() => del(s.id)}><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="th-empty">{t.noResults}</div>}
        </div>
      </Card>

      <StudentModal t={t} modal={modal} groups={groups} onClose={() => setModal(null)} onSave={save} />
    </>
  );
}

function StudentModal({ t, modal, groups, onClose, onSave }) {
  const [form, setForm] = useState(null);
  useEffect(() => { setForm(modal?.data ? { ...modal.data } : null); }, [modal]);
  if (!modal || !form) return null;
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  return (
    <Modal open onClose={onClose} title={modal.mode === "add" ? t.addStudent : t.editStudent}
      footer={<>
        <button className="th-btn" onClick={onClose}>{t.cancel}</button>
        <button className="th-btn th-btn--primary" onClick={() => onSave(form)}>{t.save}</button>
      </>}>
      <div className="th-formgrid">
        <Field label={t.fullName}><input className="th-input" value={form.name} onChange={e => set("name", e.target.value)} /></Field>
        <Field label="S-NUM"><input className="th-input" value={form.id} onChange={e => set("id", e.target.value)} placeholder="S-24008" /></Field>
        <Field label={t.email}><input className="th-input" value={form.email} onChange={e => set("email", e.target.value)} /></Field>
        <Field label={t.group}>
          <select className="th-input" value={form.group} onChange={e => set("group", e.target.value)}>
            {groups.map(g => <option key={g.id} value={g.name}>{g.name}</option>)}
          </select>
        </Field>
        <Field label={t.status}>
          <select className="th-input" value={form.status} onChange={e => set("status", e.target.value)}>
            <option value="active">{t.active}</option><option value="inactive">{t.inactive}</option>
          </select>
        </Field>
        <Field label={t.grade}><input className="th-input" type="number" value={form.grade} onChange={e => set("grade", e.target.value)} /></Field>
      </div>
    </Modal>
  );
}

function GroupsSection({ t, groups, setGroups }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const create = () => {
    if (!name.trim()) return;
    setGroups([...groups, { id: "g" + Date.now(), name, desc: "New learning group", members: 0, progress: 0, tasks: 0, materials: 0 }]);
    setName(""); setOpen(false);
  };
  return (
    <>
      <PageHead title={t.nav.groups} subtitle={`${groups.length} ${t.nav.groups.toLowerCase()}`}
        action={<button className="th-btn th-btn--primary" onClick={() => setOpen(true)}><Plus size={16} />{t.createGroup}</button>} />
      <div className="th-cardgrid">
        {groups.map(g => (
          <Card key={g.id} className="th-groupcard">
            <div className="th-groupcard__head">
              <div><strong>{g.name}</strong><p>{g.desc}</p></div>
              <div className="th-rowactions">
                <button className="th-iconbtn"><Pencil size={15} /></button>
                <button className="th-iconbtn th-iconbtn--danger" onClick={() => setGroups(groups.filter(x => x.id !== g.id))}><Trash2 size={15} /></button>
              </div>
            </div>
            <div className="th-progress"><div className="th-progress__bar" style={{ width: g.progress + "%" }} /></div>
            <div className="th-progress__label"><span>{t.progress}</span><strong>{g.progress}%</strong></div>
            <div className="th-groupcard__meta">
              <span><Users size={14} />{g.members} {t.members.toLowerCase()}</span>
              <span><ClipboardList size={14} />{g.tasks} {t.tasks.toLowerCase()}</span>
              <span><BookOpen size={14} />{g.materials} {t.nav.materials.toLowerCase()}</span>
            </div>
          </Card>
        ))}
      </div>
      <Modal open={open} onClose={() => setOpen(false)} title={t.createGroup}
        footer={<><button className="th-btn" onClick={() => setOpen(false)}>{t.cancel}</button>
          <button className="th-btn th-btn--primary" onClick={create}>{t.create}</button></>}>
        <Field label={t.groupName}><input className="th-input" value={name} onChange={e => setName(e.target.value)} placeholder="Mobile Cohort" autoFocus /></Field>
      </Modal>
    </>
  );
}

function AssignmentsSection({ t, assignments, setAssignments, groups }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", group: groups[0]?.name || "", deadline: "", type: "group" });
  const create = () => {
    if (!form.title.trim()) return;
    setAssignments([{ id: "a" + Date.now(), ...form, deadline: form.deadline || "Jun 30", status: "pending" }, ...assignments]);
    setForm({ title: "", group: groups[0]?.name || "", deadline: "", type: "group" }); setOpen(false);
  };
  return (
    <>
      <PageHead title={t.nav.assignments}
        action={<button className="th-btn th-btn--primary" onClick={() => setOpen(true)}><Plus size={16} />{t.createAssignment}</button>} />
      <Card>
        <div className="th-tablewrap">
          <table className="th-table">
            <thead><tr><th>{t.title}</th><th>{t.group}</th><th>{t.type}</th><th>{t.deadline}</th><th>{t.status}</th><th className="th-ta-end">{t.actions}</th></tr></thead>
            <tbody>
              {assignments.map(a => (
                <tr key={a.id}>
                  <td><strong>{a.title}</strong></td>
                  <td>{a.group}</td>
                  <td><Badge kind="muted">{a.type === "group" ? t.groupAssignment : t.individual}</Badge></td>
                  <td className="th-muted">{a.deadline}</td>
                  <td><Badge kind={statusKind(a.status)}>{t[a.status]}</Badge></td>
                  <td className="th-ta-end"><button className="th-link">{t.viewSubmissions}<ChevronRight size={14} className="th-rtl-flip" /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <Modal open={open} onClose={() => setOpen(false)} title={t.createAssignment}
        footer={<><button className="th-btn" onClick={() => setOpen(false)}>{t.cancel}</button>
          <button className="th-btn th-btn--primary" onClick={create}>{t.create}</button></>}>
        <div className="th-formgrid">
          <Field label={t.title}><input className="th-input th-col-2" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></Field>
          <Field label={t.group}><select className="th-input" value={form.group} onChange={e => setForm({ ...form, group: e.target.value })}>{groups.map(g => <option key={g.id}>{g.name}</option>)}</select></Field>
          <Field label={t.type}><select className="th-input" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}><option value="group">{t.groupAssignment}</option><option value="individual">{t.individual}</option></select></Field>
          <Field label={t.deadline}><input className="th-input" value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })} placeholder="Jun 30" /></Field>
          <Field label={t.attachments}><div className="th-dropmini"><Upload size={15} />{t.uploadFiles}</div></Field>
        </div>
      </Modal>
    </>
  );
}

function MaterialsSection({ t, materials, setMaterials, groups }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", type: "PDF", target: "All groups" });
  const create = () => {
    if (!form.title.trim()) return;
    setMaterials([{ id: "m" + Date.now(), ...form, date: "Jun 17" }, ...materials]);
    setForm({ title: "", type: "PDF", target: "All groups" }); setOpen(false);
  };
  return (
    <>
      <PageHead title={t.nav.materials}
        action={<button className="th-btn th-btn--primary" onClick={() => setOpen(true)}><Upload size={16} />{t.uploadMaterial}</button>} />
      <Card>
        <div className="th-tablewrap">
          <table className="th-table">
            <thead><tr><th>{t.title}</th><th>{t.type}</th><th>{t.assignTo}</th><th>{t.date}</th><th className="th-ta-end">{t.actions}</th></tr></thead>
            <tbody>
              {materials.map(m => (
                <tr key={m.id}>
                  <td><div className="th-cellname"><span className="th-fileic">{fileIcon(m.type)}</span><strong>{m.title}</strong></div></td>
                  <td><Badge kind="muted">{m.type}</Badge></td>
                  <td>{m.target}</td>
                  <td className="th-muted">{m.date}</td>
                  <td className="th-ta-end"><div className="th-rowactions"><button className="th-iconbtn"><Download size={15} /></button><button className="th-iconbtn th-iconbtn--danger" onClick={() => setMaterials(materials.filter(x => x.id !== m.id))}><Trash2 size={15} /></button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <Modal open={open} onClose={() => setOpen(false)} title={t.uploadMaterial}
        footer={<><button className="th-btn" onClick={() => setOpen(false)}>{t.cancel}</button>
          <button className="th-btn th-btn--primary" onClick={create}>{t.create}</button></>}>
        <div className="th-formgrid">
          <Field label={t.title}><input className="th-input th-col-2" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></Field>
          <Field label={t.type}><select className="th-input" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>{["PDF", "PPTX", "DOCX", "Video", "Image", "Link"].map(x => <option key={x}>{x}</option>)}</select></Field>
          <Field label={t.assignTo}><select className="th-input" value={form.target} onChange={e => setForm({ ...form, target: e.target.value })}><option>All groups</option>{groups.map(g => <option key={g.id}>{g.name}</option>)}</select></Field>
          <div className="th-col-2"><div className="th-dropzone"><Upload size={20} /><span>{t.dragDrop}</span></div></div>
        </div>
      </Modal>
    </>
  );
}

function GradesSection({ t, grades, setGrades }) {
  const [edit, setEdit] = useState(null);
  return (
    <>
      <PageHead title={t.nav.grades} subtitle={t.overview} />
      <Card>
        <div className="th-tablewrap">
          <table className="th-table">
            <thead><tr><th>{t.student}</th><th>{t.nav.assignments}</th><th>{t.grade}</th><th>{t.feedback}</th><th className="th-ta-end">{t.actions}</th></tr></thead>
            <tbody>
              {grades.map(g => (
                <tr key={g.id}>
                  <td><div className="th-cellname"><Avatar name={g.student} size={30} /><span>{g.student}</span></div></td>
                  <td>{g.assignment}</td>
                  <td><span className="th-gradechip"><strong>{g.grade}</strong><i>{g.letter}</i></span></td>
                  <td className="th-muted th-clip">{g.feedback}</td>
                  <td className="th-ta-end"><button className="th-btn th-btn--sm" onClick={() => setEdit(g)}><Pencil size={14} />{t.giveGrade}</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <Modal open={!!edit} onClose={() => setEdit(null)} title={t.giveGrade}
        footer={<><button className="th-btn" onClick={() => setEdit(null)}>{t.cancel}</button>
          <button className="th-btn th-btn--primary" onClick={() => { setGrades(grades.map(x => x.id === edit.id ? edit : x)); setEdit(null); }}>{t.save}</button></>}>
        {edit && <div className="th-formgrid">
          <Field label={t.student}><input className="th-input" value={edit.student} disabled /></Field>
          <Field label={t.grade}><input className="th-input" type="number" value={edit.grade} onChange={e => setEdit({ ...edit, grade: Number(e.target.value) })} /></Field>
          <Field label={t.feedback}><textarea className="th-input th-textarea th-col-2" rows={4} value={edit.feedback} onChange={e => setEdit({ ...edit, feedback: e.target.value })} /></Field>
        </div>}
      </Modal>
    </>
  );
}

function ChatsSection({ t, chats, setChats, role }) {
  const [tab, setTab] = useState("personal");
  const [activeId, setActiveId] = useState(chats[0].id);
  const [draft, setDraft] = useState("");
  const list = chats.filter(c => tab === "personal" ? c.role !== "group" : c.role === "group");
  const active = chats.find(c => c.id === activeId) || list[0];
  const endRef = useRef(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [active?.msgs.length, activeId]);

  const send = () => {
    if (!draft.trim()) return;
    setChats(chats.map(c => c.id === active.id
      ? { ...c, last: draft, msgs: [...c.msgs, { from: "me", text: draft, time: now() }] } : c));
    setDraft("");
  };

  return (
    <>
      <PageHead title={t.nav.chats} />
      <Card className="th-chatlayout">
        <div className="th-chatlist">
          <div className="th-segment th-segment--sm">
            <button className={cx("th-segment__btn", tab === "personal" && "is-active")} onClick={() => { setTab("personal"); }}>{t.personalChat}</button>
            <button className={cx("th-segment__btn", tab === "group" && "is-active")} onClick={() => { setTab("group"); }}>{t.groupChat}</button>
          </div>
          <div className="th-search th-search--flat"><Search size={15} /><input placeholder={t.searchMessages} /></div>
          <div className="th-threadlist">
            {list.map(c => (
              <button key={c.id} className={cx("th-thread", active?.id === c.id && "is-active")} onClick={() => setActiveId(c.id)}>
                <Avatar name={c.who} size={38} />
                <div className="th-thread__meta"><strong>{c.who}</strong><span>{c.last}</span></div>
                {c.unread > 0 && <span className="th-thread__badge">{c.unread}</span>}
              </button>
            ))}
          </div>
        </div>
        <div className="th-chatpane">
          {active && <>
            <div className="th-chatpane__head">
              <Avatar name={active.who} size={40} />
              <div><strong>{active.who}</strong><span className="th-muted">{active.role === "group" ? t.groupChat : t.student}</span></div>
            </div>
            {active.pinned && <div className="th-pinned"><Pin size={14} /> <span>{active.pinned}</span></div>}
            <div className="th-messages">
              {active.msgs.map((m, i) => (
                <div key={i} className={cx("th-msg", m.from === "me" ? "th-msg--me" : "th-msg--them")}>
                  {active.role === "group" && m.from !== "me" && <span className="th-msg__who">{m.from}</span>}
                  <div className="th-msg__bubble">{m.text}</div>
                  <span className="th-msg__time">{m.time}</span>
                </div>
              ))}
              <div ref={endRef} />
            </div>
            <div className="th-composer">
              <button className="th-iconbtn"><Paperclip size={18} /></button>
              <input className="th-composer__input" value={draft} onChange={e => setDraft(e.target.value)}
                onKeyDown={e => e.key === "Enter" && send()} placeholder={t.typeMessage} />
              <button className="th-btn th-btn--primary th-btn--icon" onClick={send}><Send size={16} className="th-rtl-flip" /></button>
            </div>
          </>}
        </div>
      </Card>
    </>
  );
}

function AnalyticsSection({ t, students }) {
  const top = [...students].sort((a, b) => b.grade - a.grade).slice(0, 4);
  const risk = students.filter(s => s.grade < 65);
  const engagement = [
    { d: "Mon", v: 72 }, { d: "Tue", v: 81 }, { d: "Wed", v: 76 }, { d: "Thu", v: 88 }, { d: "Fri", v: 92 }, { d: "Sat", v: 60 }, { d: "Sun", v: 48 },
  ];
  return (
    <>
      <PageHead title={t.nav.analytics} subtitle={t.overview} />
      <div className="th-chartgrid">
        <Card className="th-chartcard th-chartcard--wide">
          <div className="th-chartcard__head"><h3>{t.engagement}</h3><Badge kind="brand">{t.thisWeek}</Badge></div>
          <ResponsiveContainer width="100%" height={230}>
            <AreaChart data={engagement} margin={{ left: -18, right: 8, top: 8 }}>
              <defs><linearGradient id="eng" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--brand)" stopOpacity={0.3} /><stop offset="100%" stopColor="var(--brand)" stopOpacity={0} /></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" vertical={false} />
              <XAxis dataKey="d" stroke="var(--muted)" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis stroke="var(--muted)" tickLine={false} axisLine={false} fontSize={12} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="v" stroke="var(--brand)" strokeWidth={2.5} fill="url(#eng)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
        <Card className="th-chartcard">
          <div className="th-chartcard__head"><h3>{t.completionRate}</h3></div>
          <div className="th-donutwrap"><Donut value={78} /><div className="th-donut__center"><strong>78%</strong><span>{t.complete}</span></div></div>
        </Card>
        <Card className="th-chartcard">
          <div className="th-chartcard__head"><h3>{t.topPerformers}</h3></div>
          <ul className="th-ranklist">
            {top.map((s, i) => (
              <li key={s.id}><span className="th-rank">{i + 1}</span><Avatar name={s.name} size={30} /><strong>{s.name}</strong><span className="th-gradechip th-gradechip--sm"><Star size={12} />{s.grade}</span></li>
            ))}
          </ul>
        </Card>
        <Card className="th-chartcard">
          <div className="th-chartcard__head"><h3>{t.atRisk}</h3></div>
          {risk.length === 0 ? <div className="th-empty">—</div> :
            <ul className="th-ranklist">
              {risk.map(s => (
                <li key={s.id}><span className="th-rank th-rank--warn"><AlertTriangle size={13} /></span><Avatar name={s.name} size={30} /><strong>{s.name}</strong><span className="th-gradechip th-gradechip--warn">{s.grade}</span></li>
              ))}
            </ul>}
        </Card>
      </div>
    </>
  );
}

function SettingsSection({ t, lang, theme, onLang, onTheme }) {
  const [email, setEmail] = useState(true);
  const [push, setPush] = useState(true);
  return (
    <>
      <PageHead title={t.nav.settings} />
      <div className="th-settingsgrid">
        <Card className="th-setblock">
          <h3><Globe size={16} /> {t.language}</h3>
          <div className="th-segment">
            <button className={cx("th-segment__btn", lang === "en" && "is-active")} onClick={() => lang !== "en" && onLang()}>English</button>
            <button className={cx("th-segment__btn", lang === "ar" && "is-active")} onClick={() => lang !== "ar" && onLang()}>العربية</button>
          </div>
        </Card>
        <Card className="th-setblock">
          <h3><Sun size={16} /> {t.appearance}</h3>
          <div className="th-segment">
            <button className={cx("th-segment__btn", theme === "light" && "is-active")} onClick={() => theme !== "light" && onTheme()}>{t.light}</button>
            <button className={cx("th-segment__btn", theme === "dark" && "is-active")} onClick={() => theme !== "dark" && onTheme()}>{t.dark}</button>
          </div>
        </Card>
        <Card className="th-setblock th-col-2">
          <h3><CircleUserRound size={16} /> {t.profileMgmt}</h3>
          <div className="th-formgrid">
            <Field label={t.fullName}><input className="th-input" defaultValue="Dr Amina Said" /></Field>
            <Field label={t.email}><input className="th-input" defaultValue="amina@techheroes.io" /></Field>
          </div>
        </Card>
        <Card className="th-setblock th-col-2">
          <h3><Bell size={16} /> {t.notifPrefs}</h3>
          <Toggle label={t.emailNotif} on={email} onClick={() => setEmail(!email)} />
          <Toggle label={t.pushNotif} on={push} onClick={() => setPush(!push)} />
        </Card>
      </div>
    </>
  );
}

function Toggle({ label, on, onClick }) {
  return (
    <button className="th-toggle" onClick={onClick}>
      <span>{label}</span>
      <span className={cx("th-switch", on && "is-on")}><i /></span>
    </button>
  );
}

/* ============================== STUDENT views ============================== */
function StudentHome({ t, materials, assignments, grades, chats, setChats, lang, theme, onLang, onTheme, view }) {
  if (view === "myGroups") return <StudentGroups t={t} />;
  if (view === "myMaterials") return <StudentMaterials t={t} materials={materials} />;
  if (view === "myAssignments") return <StudentAssignments t={t} assignments={assignments} />;
  if (view === "myGrades") return <StudentGrades t={t} grades={grades} />;
  if (view === "chat") return <ChatsSection t={t} chats={chats} setChats={setChats} role="student" />;
  if (view === "profile") return <SettingsSection t={t} lang={lang} theme={theme} onLang={onLang} onTheme={onTheme} />;
  return null;
}

function StudentGroups({ t }) {
  const myGroups = [SEED_GROUPS[0]];
  return (
    <>
      <PageHead title={t.nav.myGroups} subtitle={t.welcome + ", Layla."} />
      <div className="th-cardgrid">
        {myGroups.map(g => (
          <Card key={g.id} className="th-groupcard">
            <div className="th-groupcard__head"><div><strong>{g.name}</strong><p>{g.desc}</p></div><Badge kind="ok">{t.active}</Badge></div>
            <div className="th-progress"><div className="th-progress__bar" style={{ width: g.progress + "%" }} /></div>
            <div className="th-progress__label"><span>{t.progress}</span><strong>{g.progress}%</strong></div>
            <div className="th-groupcard__meta">
              <span><Users size={14} />{g.members} {t.members.toLowerCase()}</span>
              <span><BookOpen size={14} />{g.materials} {t.nav.materials.toLowerCase()}</span>
            </div>
          </Card>
        ))}
        <Card className="th-promo">
          <Sparkles size={22} />
          <strong>{t.recentActivity}</strong>
          <p>{t.newMaterial}: React Hooks — Deep Dive</p>
        </Card>
      </div>
    </>
  );
}

function StudentMaterials({ t, materials }) {
  const mine = materials.filter(m => m.target === "Frontend Cohort" || m.target === "All groups");
  return (
    <>
      <PageHead title={t.nav.myMaterials} subtitle={`${mine.length} ${t.nav.materials.toLowerCase()}`} />
      <div className="th-cardgrid th-cardgrid--3">
        {mine.map(m => (
          <Card key={m.id} className="th-matcard">
            <span className="th-fileic th-fileic--lg">{fileIcon(m.type)}</span>
            <strong>{m.title}</strong>
            <span className="th-muted">{m.type} · {m.date}</span>
            <button className="th-btn th-btn--sm th-btn--block"><Download size={14} />{t.download}</button>
          </Card>
        ))}
      </div>
    </>
  );
}

function StudentAssignments({ t, assignments }) {
  const mine = assignments.filter(a => a.group === "Frontend Cohort");
  const [submit, setSubmit] = useState(null);
  const [done, setDone] = useState({});
  return (
    <>
      <PageHead title={t.nav.myAssignments} />
      <div className="th-cardgrid th-cardgrid--2">
        {mine.map(a => {
          const status = done[a.id] ? "submitted" : a.status;
          return (
            <Card key={a.id} className="th-asgcard">
              <div className="th-asgcard__head">
                <strong>{a.title}</strong>
                <Badge kind={statusKind(status)}>{t[status]}</Badge>
              </div>
              <p className="th-muted">{a.group} · {t.deadline}: {a.deadline}</p>
              <div className="th-asgcard__foot">
                {status === "graded" ? <span className="th-gradechip"><strong>92</strong><i>A-</i></span> :
                  <button className="th-btn th-btn--primary th-btn--sm" onClick={() => setSubmit(a)}><Upload size={14} />{t.submit}</button>}
              </div>
            </Card>
          );
        })}
      </div>
      <Modal open={!!submit} onClose={() => setSubmit(null)} title={`${t.submit} — ${submit?.title || ""}`}
        footer={<><button className="th-btn" onClick={() => setSubmit(null)}>{t.cancel}</button>
          <button className="th-btn th-btn--primary" onClick={() => { setDone({ ...done, [submit.id]: true }); setSubmit(null); }}>{t.submit}</button></>}>
        <div className="th-dropzone"><Upload size={22} /><span>{t.dragDrop}</span></div>
        <div className="th-filechips">
          <span className="th-filechip"><FileText size={13} /> report.pdf <X size={12} /></span>
          <span className="th-filechip"><ImageIcon size={13} /> screenshot.png <X size={12} /></span>
        </div>
      </Modal>
    </>
  );
}

function StudentGrades({ t, grades }) {
  const mine = grades.filter(g => g.student === "Layla Hassan").concat([
    { id: "gx", student: "Layla Hassan", assignment: "Accessibility Audit", grade: null, letter: "—", feedback: "" },
  ]);
  return (
    <>
      <PageHead title={t.nav.myGrades} />
      <div className="th-cardgrid th-cardgrid--2">
        {mine.map(g => (
          <Card key={g.id} className="th-gradecard">
            <div className="th-gradecard__top">
              <strong>{g.assignment}</strong>
              {g.grade != null ? <span className="th-gradechip th-gradechip--lg"><strong>{g.grade}</strong><i>{g.letter}</i></span>
                : <Badge kind="warn">{t.noGradeYet}</Badge>}
            </div>
            {g.feedback && <p className="th-feedback"><MessageSquare size={14} /> {g.feedback}</p>}
          </Card>
        ))}
      </div>
    </>
  );
}


/* ============================== helpers ============================== */
const tooltipStyle = { background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 10, color: "var(--ink)", fontSize: 12, boxShadow: "0 8px 30px rgba(0,0,0,0.12)" };
function statusKind(s) { return s === "graded" ? "ok" : s === "submitted" ? "brand" : s === "late" ? "warn" : "muted"; }
function fileIcon(type) {
  if (type === "Image" || type === "PNG" || type === "JPG") return <ImageIcon size={16} />;
  if (type === "Video") return <BookOpen size={16} />;
  return <FileText size={16} />;
}
function now() { const d = new Date(); return d.getHours().toString().padStart(2, "0") + ":" + d.getMinutes().toString().padStart(2, "0"); }

/* ============================== Root App ============================== */
export default function App() {
  const [lang, setLang] = useState("en");
  const [theme, setTheme] = useState("light");
  const [session, setSession] = useState(null); // 'tutor' | 'student' | 'team'
  const [view, setView] = useState("dashboard");

  const [students, setStudents] = useState(SEED_STUDENTS);
  const [groups, setGroups] = useState(SEED_GROUPS);
  const [assignments, setAssignments] = useState(SEED_ASSIGNMENTS);
  const [materials, setMaterials] = useState(SEED_MATERIALS);
  const [grades, setGrades] = useState(SEED_GRADES);
  const [chats, setChats] = useState(initialChats());
  const [notifs, setNotifs] = useState(SEED_NOTIFS);

  const t = T[lang];
  const dir = t.dir;
  const toggleLang = () => setLang(l => l === "en" ? "ar" : "en");
  const toggleTheme = () => setTheme(th => th === "light" ? "dark" : "light");

  const startSession = (role) => {
    setSession(role);
    setView(role === "tutor" ? "dashboard" : "myGroups");
  };
  const logout = () => setSession(null);

  const tutorNav = [
    { key: "dashboard", label: t.nav.dashboard, icon: LayoutDashboard },
    { key: "students", label: t.nav.students, icon: Users },
    { key: "groups", label: t.nav.groups, icon: FolderKanban },
    { key: "assignments", label: t.nav.assignments, icon: ClipboardList },
    { key: "materials", label: t.nav.materials, icon: BookOpen },
    { key: "chats", label: t.nav.chats, icon: MessageSquare },
    { key: "grades", label: t.nav.grades, icon: GraduationCap },
    { key: "analytics", label: t.nav.analytics, icon: BarChart3 },
    { key: "settings", label: t.nav.settings, icon: Settings },
  ];
  const studentNav = [
    { key: "myGroups", label: t.nav.myGroups, icon: FolderKanban },
    { key: "myMaterials", label: t.nav.myMaterials, icon: BookOpen },
    { key: "myAssignments", label: t.nav.myAssignments, icon: ClipboardList },
    { key: "myGrades", label: t.nav.myGrades, icon: GraduationCap },
    { key: "chat", label: t.nav.chat, icon: MessageSquare },
    { key: "profile", label: t.nav.profile, icon: Settings },
  ];

  const themeVars = theme === "light" ? LIGHT : DARK;

  return (
    <div className="th-root" dir={dir} data-theme={theme} style={{ ...themeVars, fontFamily: lang === "ar" ? "var(--font-ar)" : "var(--font-ui)" }}>
      <style>{CSS}</style>
      {!session ? (
        <Login t={t} lang={lang} theme={theme} onLang={toggleLang} onTheme={toggleTheme} onLogin={startSession} />
      ) : (
        <Shell t={t} lang={lang} theme={theme} role={session}
          nav={session === "tutor" ? tutorNav : studentNav}
          view={view} setView={setView} onLang={toggleLang} onTheme={toggleTheme} onLogout={logout}
          notifs={notifs} setNotifs={setNotifs}>
          {session === "tutor" && <>
            {view === "dashboard" && <TutorDashboard t={t} lang={lang} students={students} groups={groups} assignments={assignments} />}
            {view === "students" && <StudentsSection t={t} students={students} setStudents={setStudents} groups={groups} />}
            {view === "groups" && <GroupsSection t={t} groups={groups} setGroups={setGroups} />}
            {view === "assignments" && <AssignmentsSection t={t} assignments={assignments} setAssignments={setAssignments} groups={groups} />}
            {view === "materials" && <MaterialsSection t={t} materials={materials} setMaterials={setMaterials} groups={groups} />}
            {view === "chats" && <ChatsSection t={t} chats={chats} setChats={setChats} role="tutor" />}
            {view === "grades" && <GradesSection t={t} grades={grades} setGrades={setGrades} />}
            {view === "analytics" && <AnalyticsSection t={t} students={students} />}
            {view === "settings" && <SettingsSection t={t} lang={lang} theme={theme} onLang={toggleLang} onTheme={toggleTheme} />}
          </>}
          {session === "student" &&
            <StudentHome t={t} materials={materials} assignments={assignments} grades={grades} chats={chats} setChats={setChats}
              lang={lang} theme={theme} onLang={toggleLang} onTheme={toggleTheme} view={view} />}
        </Shell>
      )}
    </div>
  );
}

/* ============================== Theme tokens ============================== */
const LIGHT = {
  "--bg": "#F8F6F2", "--surface": "#FFFFFF", "--surface-2": "#FBFAF7",
  "--ink": "#121212", "--ink-soft": "#454545", "--muted": "#8A857C",
  "--line": "rgba(18,18,18,0.09)", "--brand": "#FF7A00", "--brand-ink": "#FFFFFF",
  "--brand-soft": "rgba(255,122,0,0.12)", "--ok": "#1F9D5B", "--ok-soft": "rgba(31,157,91,0.12)",
  "--warn": "#E0892F", "--warn-soft": "rgba(224,137,47,0.14)",
  "--shadow": "0 1px 2px rgba(18,18,18,0.04), 0 8px 24px rgba(18,18,18,0.05)",
  "--shadow-lg": "0 24px 60px rgba(18,18,18,0.16)",
};
const DARK = {
  "--bg": "#0E0E0F", "--surface": "#1A1A1C", "--surface-2": "#171719",
  "--ink": "#F4F1EC", "--ink-soft": "#C7C2BA", "--muted": "#8C877E",
  "--line": "rgba(248,246,242,0.10)", "--brand": "#FF7A00", "--brand-ink": "#121212",
  "--brand-soft": "rgba(255,122,0,0.16)", "--ok": "#34C77B", "--ok-soft": "rgba(52,199,123,0.14)",
  "--warn": "#F0A64B", "--warn-soft": "rgba(240,166,75,0.16)",
  "--shadow": "0 1px 2px rgba(0,0,0,0.4), 0 10px 30px rgba(0,0,0,0.35)",
  "--shadow-lg": "0 30px 70px rgba(0,0,0,0.6)",
};

/* ============================== CSS ============================== */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&display=swap');

.th-root{
  --font-ui:'Inter',system-ui,-apple-system,sans-serif;
  --font-display:'Space Grotesk','Inter',sans-serif;
  --font-ar:'IBM Plex Sans Arabic','Inter',sans-serif;
  --r:14px; --r-sm:10px;
  background:var(--bg); color:var(--ink); min-height:100vh;
  -webkit-font-smoothing:antialiased; line-height:1.5;
}
.th-root *{ box-sizing:border-box; }
.th-root[dir="rtl"] .th-rtl-flip{ transform:scaleX(-1); }
button{ font-family:inherit; cursor:pointer; }
input,select,textarea{ font-family:inherit; }
h1,h2,h3{ margin:0; font-family:var(--font-display); letter-spacing:-0.02em; }
.th-root[dir="rtl"] h1,.th-root[dir="rtl"] h2,.th-root[dir="rtl"] h3{ font-family:var(--font-ar); letter-spacing:0; }
@media (prefers-reduced-motion:reduce){ *{ animation:none!important; transition:none!important; } }

/* ---------- atoms ---------- */
.th-badge{ display:inline-flex; align-items:center; gap:4px; font-size:11.5px; font-weight:600;
  padding:3px 9px; border-radius:999px; background:var(--surface-2); color:var(--ink-soft); border:1px solid var(--line); white-space:nowrap; }
.th-badge--brand{ background:var(--brand-soft); color:var(--brand); border-color:transparent; }
.th-badge--ok{ background:var(--ok-soft); color:var(--ok); border-color:transparent; }
.th-badge--warn{ background:var(--warn-soft); color:var(--warn); border-color:transparent; }
.th-badge--muted{ background:var(--surface-2); color:var(--muted); }
.th-avatar{ display:inline-flex; align-items:center; justify-content:center; border-radius:50%;
  background:linear-gradient(135deg,var(--brand),#ff9d44); color:#fff; font-weight:700; flex:none; font-family:var(--font-display); }
.th-mono{ font-variant-numeric:tabular-nums; font-feature-settings:"tnum"; letter-spacing:0.02em; }
.th-muted{ color:var(--muted); }

.th-btn{ display:inline-flex; align-items:center; justify-content:center; gap:7px; border:1px solid var(--line);
  background:var(--surface); color:var(--ink); padding:9px 15px; border-radius:var(--r-sm); font-weight:600; font-size:13.5px;
  transition:.18s ease; white-space:nowrap; }
.th-btn:hover{ background:var(--surface-2); transform:translateY(-1px); }
.th-btn--primary{ background:var(--brand); color:var(--brand-ink); border-color:transparent; box-shadow:0 6px 16px rgba(255,122,0,.28); }
.th-btn--primary:hover{ filter:brightness(1.05); box-shadow:0 8px 22px rgba(255,122,0,.36); }
.th-btn--lg{ padding:13px 18px; font-size:15px; width:100%; }
.th-btn--sm{ padding:6px 11px; font-size:12.5px; }
.th-btn--block{ width:100%; }
.th-btn--icon{ padding:9px 11px; }
.th-iconbtn{ display:inline-flex; align-items:center; justify-content:center; width:36px; height:36px; border-radius:var(--r-sm);
  border:1px solid transparent; background:transparent; color:var(--ink-soft); transition:.16s ease; }
.th-iconbtn:hover{ background:var(--surface-2); color:var(--ink); }
.th-iconbtn--ring{ border-color:var(--line); }
.th-iconbtn--danger:hover{ background:var(--warn-soft); color:#d6453a; }
.th-pillbtn{ display:inline-flex; align-items:center; gap:7px; padding:7px 13px; border-radius:999px;
  border:1px solid var(--line); background:var(--surface); color:var(--ink); font-weight:600; font-size:13px; transition:.16s; }
.th-pillbtn:hover{ background:var(--surface-2); }
.th-link{ display:inline-flex; align-items:center; gap:3px; background:none; border:none; color:var(--brand); font-weight:600; font-size:13px; padding:0; }
.th-link:hover{ text-decoration:underline; }
.th-card{ background:var(--surface); border:1px solid var(--line); border-radius:var(--r); box-shadow:var(--shadow); }

/* ---------- LOGIN ---------- */
.th-login{ min-height:100vh; display:flex; flex-direction:column; padding:22px clamp(18px,5vw,56px); }
.th-login__topbar{ display:flex; align-items:center; justify-content:space-between; }
.th-login__controls{ display:flex; align-items:center; gap:10px; }
.th-login__grid{ flex:1; display:grid; grid-template-columns:1.05fr 0.95fr; gap:clamp(28px,5vw,72px); align-items:center; max-width:1180px; width:100%; margin:0 auto; }
@media (max-width:920px){ .th-login__grid{ grid-template-columns:1fr; gap:30px; padding-top:8px; } .th-hero{ text-align:center; } }

.th-brand{ display:inline-flex; align-items:center; gap:11px; }
.th-brand__mark{ position:relative; display:inline-flex; align-items:center; justify-content:center; width:42px; height:42px;
  border-radius:12px; background:var(--ink); color:var(--brand); box-shadow:var(--shadow); }
.th-brand__spark{ position:absolute; top:-3px; right:-3px; width:11px; height:11px; border-radius:50%;
  background:var(--brand); box-shadow:0 0 0 3px var(--bg); animation:pulse 2.6s ease-in-out infinite; }
.th-root[dir="rtl"] .th-brand__spark{ right:auto; left:-3px; }
.th-brand__text{ font-family:var(--font-display); font-weight:700; font-size:21px; letter-spacing:-0.03em; }
.th-brand--compact .th-brand__mark{ width:38px; height:38px; }
@keyframes pulse{ 0%,100%{ transform:scale(1); opacity:1; } 50%{ transform:scale(1.25); opacity:.7; } }

.th-hero{ position:relative; }
.th-eyebrow{ display:inline-flex; align-items:center; gap:6px; font-size:12.5px; font-weight:600; letter-spacing:.08em;
  text-transform:uppercase; color:var(--brand); margin:0 0 18px; }
.th-hero__title{ font-size:clamp(34px,5vw,56px); line-height:1.05; margin:0 0 18px; max-width:14ch; }
.th-hero{ }
.th-hero__sub{ font-size:16px; color:var(--ink-soft); max-width:46ch; margin:0 0 30px; }
.th-hero__stats{ display:flex; gap:30px; flex-wrap:wrap; }
.th-hero__stats div{ display:flex; flex-direction:column; }
.th-hero__stats strong{ font-family:var(--font-display); font-size:28px; }
.th-hero__stats span{ font-size:12.5px; color:var(--muted); }
@media (max-width:920px){ .th-hero__stats{ justify-content:center; } .th-hero__sub{ margin-inline:auto; } }
.th-hero__orbit{ position:absolute; top:-14px; inset-inline-end:0; width:90px; height:90px; opacity:.9; }
@media (max-width:920px){ .th-hero__orbit{ display:none; } }
.th-orbit{ position:absolute; inset:0; border:1.5px dashed var(--line); border-radius:50%; }
.th-orbit--1{ animation:spin 18s linear infinite; }
.th-orbit--2{ inset:18px; border-color:var(--brand-soft); animation:spin 12s linear infinite reverse; }
.th-spark{ position:absolute; inset:0; display:flex; align-items:center; justify-content:center; color:var(--brand); }
@keyframes spin{ to{ transform:rotate(360deg); } }

.th-authcard{ background:var(--surface); border:1px solid var(--line); border-radius:20px; padding:clamp(22px,3vw,32px);
  box-shadow:var(--shadow-lg); max-width:430px; width:100%; justify-self:end; animation:rise .5s cubic-bezier(.2,.7,.3,1) both; }
.th-root[dir="rtl"] .th-authcard{ justify-self:start; }
@media (max-width:920px){ .th-authcard{ justify-self:center; } }
@keyframes rise{ from{ opacity:0; transform:translateY(14px); } to{ opacity:1; transform:none; } }
.th-authcard__title{ font-size:21px; margin:18px 0 18px; }
.th-segment{ display:flex; gap:4px; padding:4px; background:var(--surface-2); border:1px solid var(--line); border-radius:12px; }
.th-segment--sm{ border-radius:10px; }
.th-segment__btn{ flex:1; border:none; background:transparent; padding:9px 8px; border-radius:9px; font-weight:600; font-size:13px;
  color:var(--muted); transition:.18s; }
.th-segment__btn.is-active{ background:var(--surface); color:var(--ink); box-shadow:var(--shadow); }
.th-field{ display:block; margin-bottom:14px; }
.th-field__label{ display:block; font-size:12.5px; font-weight:600; color:var(--ink-soft); margin-bottom:6px; }
.th-input{ width:100%; padding:11px 13px; border:1px solid var(--line); border-radius:var(--r-sm); background:var(--surface-2);
  color:var(--ink); font-size:14px; transition:.16s; }
.th-input:focus{ outline:none; border-color:var(--brand); box-shadow:0 0 0 3px var(--brand-soft); background:var(--surface); }
.th-textarea{ resize:vertical; min-height:84px; }
.th-divider{ display:flex; align-items:center; gap:12px; margin:20px 0 14px; color:var(--muted); font-size:12px; }
.th-divider::before,.th-divider::after{ content:""; flex:1; height:1px; background:var(--line); }
.th-demo-roles{ display:flex; gap:8px; }
.th-chip{ flex:1; display:inline-flex; align-items:center; justify-content:center; gap:6px; padding:9px 8px; border-radius:var(--r-sm);
  border:1px solid var(--line); background:var(--surface-2); color:var(--ink-soft); font-weight:600; font-size:12.5px; transition:.16s; }
.th-chip:hover{ border-color:var(--brand); color:var(--brand); background:var(--brand-soft); }

/* ---------- SHELL ---------- */
.th-shell{ display:flex; min-height:100vh; }
.th-sidebar{ width:256px; flex:none; background:var(--surface); border-inline-end:1px solid var(--line);
  display:flex; flex-direction:column; position:sticky; top:0; height:100vh; }
.th-sidebar__head{ display:flex; align-items:center; justify-content:space-between; padding:20px 18px; }
.th-sidebar__close{ display:none; }
.th-nav{ flex:1; padding:6px 12px; overflow-y:auto; display:flex; flex-direction:column; gap:2px; }
.th-nav__item{ position:relative; display:flex; align-items:center; gap:11px; padding:10px 13px; border-radius:var(--r-sm);
  border:none; background:transparent; color:var(--ink-soft); font-weight:600; font-size:13.5px; width:100%; text-align:start; transition:.15s; }
.th-nav__item:hover{ background:var(--surface-2); color:var(--ink); }
.th-nav__item.is-active{ background:var(--brand-soft); color:var(--brand); }
.th-nav__bar{ position:absolute; inset-inline-start:-12px; top:50%; transform:translateY(-50%); width:3px; height:20px;
  background:var(--brand); border-radius:0 3px 3px 0; }
.th-root[dir="rtl"] .th-nav__bar{ border-radius:3px 0 0 3px; }
.th-sidebar__foot{ padding:12px; border-top:1px solid var(--line); }
.th-userpill{ display:flex; align-items:center; gap:10px; padding:8px; border-radius:var(--r-sm); background:var(--surface-2); }
.th-userpill__meta{ flex:1; min-width:0; display:flex; flex-direction:column; }
.th-userpill__meta strong{ font-size:13px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.th-userpill__meta span{ font-size:11.5px; color:var(--muted); }

.th-main{ flex:1; min-width:0; display:flex; flex-direction:column; }
.th-topbar{ position:sticky; top:0; z-index:20; display:flex; align-items:center; gap:14px;
  padding:14px clamp(16px,3vw,28px); background:color-mix(in srgb,var(--bg) 82%,transparent);
  backdrop-filter:blur(14px); border-bottom:1px solid var(--line); }
.th-topbar__menu{ display:none; }
.th-topbar__title{ display:flex; align-items:center; gap:7px; font-size:14px; }
.th-topbar__crumb{ color:var(--muted); }
.th-topbar__sep{ color:var(--muted); }
.th-topbar__title strong{ font-family:var(--font-display); letter-spacing:-0.01em; }
.th-root[dir="rtl"] .th-topbar__title strong{ font-family:var(--font-ar); }
.th-topbar__actions{ margin-inline-start:auto; display:flex; align-items:center; gap:9px; }
.th-bellwrap{ position:relative; }
.th-bell-dot{ position:absolute; top:2px; inset-inline-end:2px; min-width:16px; height:16px; padding:0 4px; border-radius:999px;
  background:var(--brand); color:#fff; font-size:10px; font-weight:700; display:flex; align-items:center; justify-content:center;
  box-shadow:0 0 0 2px var(--bg); }
.th-popover{ position:absolute; inset-inline-end:0; top:46px; width:330px; background:var(--surface); border:1px solid var(--line);
  border-radius:var(--r); box-shadow:var(--shadow-lg); overflow:hidden; animation:rise .2s ease both; z-index:40; }
.th-popover__head{ display:flex; align-items:center; justify-content:space-between; padding:13px 15px; border-bottom:1px solid var(--line); }
.th-popover__list{ max-height:330px; overflow-y:auto; }
.th-notif{ display:flex; gap:11px; padding:12px 15px; border-bottom:1px solid var(--line); }
.th-notif:last-child{ border-bottom:none; }
.th-notif.is-unread{ background:var(--brand-soft); }
.th-notif__ic{ display:flex; align-items:center; justify-content:center; width:32px; height:32px; border-radius:9px; flex:none;
  background:var(--surface-2); color:var(--ink-soft); }
.th-notif__ic--grade{ color:var(--ok); background:var(--ok-soft); }
.th-notif__ic--assignment{ color:var(--brand); background:var(--brand-soft); }
.th-notif div{ display:flex; flex-direction:column; }
.th-notif strong{ font-size:13px; }
.th-notif span{ font-size:12px; color:var(--muted); }

.th-content{ padding:clamp(18px,3vw,30px); max-width:1320px; width:100%; margin:0 auto; }
.th-scrim{ position:fixed; inset:0; background:rgba(0,0,0,.45); z-index:30; }

/* responsive sidebar */
@media (max-width:880px){
  .th-sidebar{ position:fixed; z-index:50; inset-inline-start:0; top:0; transform:translateX(-105%); transition:transform .25s ease; box-shadow:var(--shadow-lg); }
  .th-root[dir="rtl"] .th-sidebar{ transform:translateX(105%); }
  .th-sidebar.is-open{ transform:none; }
  .th-sidebar__close{ display:inline-flex; }
  .th-topbar__menu{ display:inline-flex; }
}

/* ---------- page head ---------- */
.th-pagehead{ display:flex; align-items:flex-end; justify-content:space-between; gap:14px; margin-bottom:20px; flex-wrap:wrap; }
.th-pagehead h2{ font-size:25px; }
.th-pagehead p{ margin:5px 0 0; color:var(--muted); font-size:14px; }

/* ---------- stats ---------- */
.th-statgrid{ display:grid; grid-template-columns:repeat(3,1fr); gap:14px; margin-bottom:18px; }
.th-statgrid--3{ grid-template-columns:repeat(3,1fr); }
@media (max-width:1100px){ .th-statgrid{ grid-template-columns:repeat(2,1fr); } }
@media (max-width:560px){ .th-statgrid{ grid-template-columns:1fr; } }
.th-stat{ display:flex; align-items:center; gap:14px; padding:16px 18px; }
.th-stat__ic{ display:flex; align-items:center; justify-content:center; width:46px; height:46px; border-radius:13px; flex:none;
  background:var(--brand-soft); color:var(--brand); }
.th-stat__body{ display:flex; flex-direction:column; min-width:0; }
.th-stat__label{ font-size:12.5px; color:var(--muted); }
.th-stat__value{ font-family:var(--font-display); font-size:27px; line-height:1.15; }
.th-stat__delta{ display:inline-flex; align-items:center; gap:3px; font-size:11.5px; color:var(--ok); font-weight:600; }

/* ---------- charts ---------- */
.th-chartgrid{ display:grid; grid-template-columns:repeat(3,1fr); gap:14px; }
.th-chartcard{ padding:18px; min-width:0; }
.th-chartcard--wide{ grid-column:span 2; }
@media (max-width:980px){ .th-chartgrid{ grid-template-columns:1fr; } .th-chartcard--wide{ grid-column:span 1; } }
.th-chartcard__head{ display:flex; align-items:center; justify-content:space-between; margin-bottom:14px; }
.th-chartcard__head h3{ font-size:15px; }
.th-deadlines{ list-style:none; margin:0; padding:0; display:flex; flex-direction:column; gap:10px; }
.th-deadlines li{ display:flex; align-items:center; gap:11px; }
.th-deadlines__cal{ display:flex; align-items:center; justify-content:center; width:36px; height:36px; border-radius:10px;
  background:var(--surface-2); color:var(--ink-soft); flex:none; }
.th-deadlines div{ flex:1; min-width:0; display:flex; flex-direction:column; }
.th-deadlines strong{ font-size:13.5px; }
.th-deadlines span{ font-size:12px; color:var(--muted); }
.th-donutwrap{ position:relative; }
.th-donut__center{ position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; }
.th-donut__center strong{ font-family:var(--font-display); font-size:26px; }
.th-donut__center span{ font-size:11px; color:var(--muted); }
.th-ranklist{ list-style:none; margin:0; padding:0; display:flex; flex-direction:column; gap:9px; }
.th-ranklist li{ display:flex; align-items:center; gap:10px; }
.th-ranklist strong{ flex:1; font-size:13.5px; font-weight:600; }
.th-rank{ display:flex; align-items:center; justify-content:center; width:22px; height:22px; border-radius:7px; flex:none;
  background:var(--brand-soft); color:var(--brand); font-size:12px; font-weight:700; }
.th-rank--warn{ background:var(--warn-soft); color:var(--warn); }
.th-gradechip{ display:inline-flex; align-items:center; gap:5px; padding:3px 9px; border-radius:8px; background:var(--ok-soft); color:var(--ok); font-weight:700; }
.th-gradechip i{ font-style:normal; font-size:11px; opacity:.75; }
.th-gradechip--sm{ font-size:12px; padding:2px 7px; }
.th-gradechip--warn{ background:var(--warn-soft); color:var(--warn); }
.th-gradechip--lg{ font-size:18px; padding:5px 12px; }

/* ---------- toolbar / table ---------- */
.th-toolbar{ display:flex; gap:11px; padding:14px; flex-wrap:wrap; }
.th-search{ display:flex; align-items:center; gap:8px; padding:9px 13px; border:1px solid var(--line); border-radius:var(--r-sm);
  background:var(--surface-2); flex:1; min-width:200px; color:var(--muted); }
.th-search input{ border:none; background:none; outline:none; color:var(--ink); font-size:13.5px; width:100%; }
.th-search--flat{ background:transparent; }
.th-select{ display:flex; align-items:center; gap:7px; padding:0 11px; border:1px solid var(--line); border-radius:var(--r-sm); background:var(--surface-2); color:var(--muted); }
.th-select select{ border:none; background:none; outline:none; color:var(--ink); font-size:13.5px; padding:9px 4px; }
.th-tablewrap{ overflow-x:auto; }
.th-table{ width:100%; border-collapse:collapse; min-width:640px; }
.th-table th{ text-align:start; font-size:11.5px; font-weight:600; text-transform:uppercase; letter-spacing:.05em; color:var(--muted);
  padding:11px 16px; border-bottom:1px solid var(--line); white-space:nowrap; }
.th-table td{ padding:13px 16px; border-bottom:1px solid var(--line); font-size:13.5px; }
.th-table tbody tr{ transition:.12s; }
.th-table tbody tr:hover{ background:var(--surface-2); }
.th-table tbody tr:last-child td{ border-bottom:none; }
.th-ta-end{ text-align:end; }
.th-cellname{ display:flex; align-items:center; gap:10px; font-weight:600; }
.th-rowactions{ display:inline-flex; gap:4px; justify-content:flex-end; }
.th-fileic{ display:flex; align-items:center; justify-content:center; width:32px; height:32px; border-radius:9px; background:var(--brand-soft); color:var(--brand); flex:none; }
.th-fileic--lg{ width:48px; height:48px; border-radius:13px; }
.th-clip{ max-width:280px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.th-empty{ text-align:center; padding:34px; color:var(--muted); font-size:13.5px; }

/* ---------- card grids ---------- */
.th-cardgrid{ display:grid; grid-template-columns:repeat(auto-fill,minmax(290px,1fr)); gap:14px; }
.th-cardgrid--2{ grid-template-columns:repeat(2,1fr); }
.th-cardgrid--3{ grid-template-columns:repeat(3,1fr); }
@media (max-width:760px){ .th-cardgrid--2,.th-cardgrid--3{ grid-template-columns:1fr; } }
.th-teamcard,.th-groupcard,.th-asgcard,.th-gradecard,.th-matcard,.th-promo{ padding:18px; }
.th-teamcard__head{ display:flex; align-items:center; gap:11px; margin-bottom:13px; }
.th-teamcard__head div{ flex:1; min-width:0; display:flex; flex-direction:column; }
.th-teamcard__head strong{ font-size:15px; }
.th-teamcard__project{ display:flex; align-items:center; gap:7px; font-size:13px; color:var(--ink-soft); margin:0 0 14px; }
.th-teamcard__foot{ display:flex; align-items:center; justify-content:space-between; font-size:12.5px; color:var(--muted); }
.th-teamcard__foot span{ display:inline-flex; align-items:center; gap:5px; }

.th-groupcard__head{ display:flex; align-items:flex-start; justify-content:space-between; gap:10px; margin-bottom:14px; }
.th-groupcard__head strong{ font-size:15.5px; }
.th-groupcard__head p{ margin:4px 0 0; font-size:12.5px; color:var(--muted); }
.th-progress{ height:7px; border-radius:99px; background:var(--surface-2); overflow:hidden; border:1px solid var(--line); }
.th-progress__bar{ height:100%; background:linear-gradient(90deg,var(--brand),#ff9d44); border-radius:99px; transition:width .6s cubic-bezier(.2,.7,.3,1); }
.th-progress__label{ display:flex; justify-content:space-between; font-size:12px; color:var(--muted); margin:7px 0 14px; }
.th-progress__label strong{ color:var(--ink); }
.th-groupcard__meta{ display:flex; gap:14px; flex-wrap:wrap; font-size:12px; color:var(--muted); }
.th-groupcard__meta span{ display:inline-flex; align-items:center; gap:5px; }

.th-asgcard__head{ display:flex; align-items:flex-start; justify-content:space-between; gap:10px; }
.th-asgcard__head strong{ font-size:15px; }
.th-asgcard p{ margin:8px 0 14px; font-size:12.5px; }
.th-asgcard__foot{ display:flex; align-items:center; justify-content:space-between; }

.th-matcard{ display:flex; flex-direction:column; align-items:flex-start; gap:8px; }
.th-matcard strong{ font-size:14.5px; }
.th-matcard .th-btn{ margin-top:6px; }

.th-gradecard__top{ display:flex; align-items:center; justify-content:space-between; gap:10px; }
.th-gradecard__top strong{ font-size:15px; }
.th-feedback{ display:flex; gap:8px; margin:13px 0 0; padding:12px; border-radius:var(--r-sm); background:var(--surface-2); font-size:13px; color:var(--ink-soft); }
.th-promo{ display:flex; flex-direction:column; gap:7px; background:linear-gradient(135deg,var(--brand-soft),transparent); color:var(--ink); border-style:dashed; }
.th-promo strong{ font-size:15px; }
.th-promo p{ font-size:13px; color:var(--ink-soft); margin:0; }

/* ---------- chat ---------- */
.th-chatlayout{ display:grid; grid-template-columns:300px 1fr; height:min(640px,72vh); overflow:hidden; padding:0; }
@media (max-width:760px){ .th-chatlayout{ grid-template-columns:1fr; } .th-chatpane{ display:none; } }
.th-chatlist{ border-inline-end:1px solid var(--line); display:flex; flex-direction:column; padding:14px; gap:12px; min-height:0; }
.th-threadlist{ flex:1; overflow-y:auto; display:flex; flex-direction:column; gap:3px; margin:0 -6px; }
.th-thread{ display:flex; align-items:center; gap:11px; padding:10px; border-radius:var(--r-sm); border:none; background:transparent; text-align:start; width:100%; transition:.14s; }
.th-thread:hover{ background:var(--surface-2); }
.th-thread.is-active{ background:var(--brand-soft); }
.th-thread__meta{ flex:1; min-width:0; display:flex; flex-direction:column; }
.th-thread__meta strong{ font-size:13.5px; }
.th-thread__meta span{ font-size:12px; color:var(--muted); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:170px; }
.th-thread__badge{ min-width:19px; height:19px; padding:0 5px; border-radius:99px; background:var(--brand); color:#fff; font-size:11px; font-weight:700; display:flex; align-items:center; justify-content:center; }
.th-chatpane{ display:flex; flex-direction:column; min-height:0; }
.th-chatpane__head{ display:flex; align-items:center; gap:11px; padding:15px 18px; border-bottom:1px solid var(--line); }
.th-chatpane__head div{ display:flex; flex-direction:column; }
.th-chatpane__head strong{ font-size:14.5px; }
.th-chatpane__head span{ font-size:12px; }
.th-pinned{ display:flex; align-items:center; gap:8px; padding:10px 18px; background:var(--warn-soft); color:var(--warn); font-size:12.5px; font-weight:500; }
.th-messages{ flex:1; overflow-y:auto; padding:18px; display:flex; flex-direction:column; gap:12px; }
.th-msg{ display:flex; flex-direction:column; max-width:74%; }
.th-msg--me{ align-self:flex-end; align-items:flex-end; }
.th-msg--them{ align-self:flex-start; }
.th-msg__who{ font-size:11px; font-weight:600; color:var(--brand); margin:0 4px 3px; }
.th-msg__bubble{ padding:10px 14px; border-radius:16px; font-size:13.5px; line-height:1.45; }
.th-msg--them .th-msg__bubble{ background:var(--surface-2); border:1px solid var(--line); border-bottom-left-radius:5px; }
.th-msg--me .th-msg__bubble{ background:var(--brand); color:var(--brand-ink); border-bottom-right-radius:5px; }
.th-root[dir="rtl"] .th-msg--them .th-msg__bubble{ border-bottom-left-radius:16px; border-bottom-right-radius:5px; }
.th-root[dir="rtl"] .th-msg--me .th-msg__bubble{ border-bottom-right-radius:16px; border-bottom-left-radius:5px; }
.th-msg__time{ font-size:10.5px; color:var(--muted); margin:4px 4px 0; }
.th-composer{ display:flex; align-items:center; gap:9px; padding:13px 16px; border-top:1px solid var(--line); }
.th-composer__input{ flex:1; padding:11px 14px; border:1px solid var(--line); border-radius:99px; background:var(--surface-2); color:var(--ink); font-size:13.5px; outline:none; }
.th-composer__input:focus{ border-color:var(--brand); box-shadow:0 0 0 3px var(--brand-soft); }

/* ---------- settings ---------- */
.th-settingsgrid{ display:grid; grid-template-columns:repeat(2,1fr); gap:14px; }
@media (max-width:760px){ .th-settingsgrid{ grid-template-columns:1fr; } }
.th-setblock{ padding:20px; }
.th-setblock h3{ display:flex; align-items:center; gap:9px; font-size:15px; margin-bottom:15px; }
.th-col-2{ grid-column:span 2; }
@media (max-width:760px){ .th-col-2{ grid-column:span 1; } }
.th-formgrid{ display:grid; grid-template-columns:1fr 1fr; gap:13px; }
.th-formgrid .th-field{ margin-bottom:0; }
@media (max-width:560px){ .th-formgrid{ grid-template-columns:1fr; } }
.th-toggle{ display:flex; align-items:center; justify-content:space-between; width:100%; padding:11px 0; border:none; background:none; color:var(--ink); font-size:14px; font-weight:500; border-bottom:1px solid var(--line); }
.th-toggle:last-child{ border-bottom:none; }
.th-switch{ width:44px; height:25px; border-radius:99px; background:var(--surface-2); border:1px solid var(--line); position:relative; transition:.2s; flex:none; }
.th-switch i{ position:absolute; top:2px; inset-inline-start:2px; width:19px; height:19px; border-radius:50%; background:#fff; box-shadow:var(--shadow); transition:.2s; }
.th-switch.is-on{ background:var(--brand); border-color:transparent; }
.th-switch.is-on i{ inset-inline-start:21px; }

/* ---------- team ---------- */
.th-memberrow{ display:flex; gap:18px; flex-wrap:wrap; padding-top:4px; }
.th-member{ display:flex; flex-direction:column; align-items:center; gap:7px; font-size:12.5px; }

/* ---------- modal ---------- */
.th-modal-scrim{ position:fixed; inset:0; background:rgba(10,10,10,.5); backdrop-filter:blur(4px); z-index:60; display:flex; align-items:center; justify-content:center; padding:20px; animation:fade .18s ease; }
@keyframes fade{ from{ opacity:0; } to{ opacity:1; } }
.th-modal{ background:var(--surface); border:1px solid var(--line); border-radius:18px; box-shadow:var(--shadow-lg); width:min(520px,100%); max-height:90vh; overflow:hidden; display:flex; flex-direction:column; animation:rise .22s cubic-bezier(.2,.7,.3,1) both; }
.th-modal__head{ display:flex; align-items:center; justify-content:space-between; padding:18px 20px; border-bottom:1px solid var(--line); }
.th-modal__head h3{ font-size:17px; }
.th-modal__body{ padding:20px; overflow-y:auto; }
.th-modal__foot{ display:flex; justify-content:flex-end; gap:10px; padding:15px 20px; border-top:1px solid var(--line); }
.th-dropzone{ display:flex; flex-direction:column; align-items:center; gap:9px; padding:28px; border:1.6px dashed var(--line); border-radius:var(--r); background:var(--surface-2); color:var(--muted); font-size:12.5px; text-align:center; transition:.16s; }
.th-dropzone:hover{ border-color:var(--brand); color:var(--brand); }
.th-dropmini{ display:flex; align-items:center; gap:8px; padding:11px 13px; border:1.4px dashed var(--line); border-radius:var(--r-sm); background:var(--surface-2); color:var(--muted); font-size:13px; }
.th-filechips{ display:flex; gap:8px; flex-wrap:wrap; margin-top:14px; }
.th-filechip{ display:inline-flex; align-items:center; gap:6px; padding:6px 10px; border-radius:99px; background:var(--surface-2); border:1px solid var(--line); font-size:12px; color:var(--ink-soft); }
.th-filechip svg:last-child{ cursor:pointer; color:var(--muted); }
`;
