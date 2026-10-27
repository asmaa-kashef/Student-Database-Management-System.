import Link from 'next/link';

export default function Home() {
  return (
    <div className="bg-[#0b0f17] text-slate-200 font-sans min-h-screen flex flex-col md:flex-row antialiased overflow-x-hidden selection:bg-sky-500 selection:text-white">

      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-[#111723] border-r border-[#212d40] flex flex-col justify-between shrink-0 min-h-screen p-3">
        <div>
          {/* Brand Header */}
          <div className="p-3 flex items-center justify-between border-b border-[#212d40]/50 mb-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-400/30 flex items-center justify-center text-sky-400">
                <i className="fa-solid fa-graduation-cap text-lg"></i>
              </div>
              <div>
                <h1 className="font-bold text-sm tracking-wider text-slate-100 uppercase">AIMAP</h1>
                <p className="text-[10px] text-slate-400 -mt-1 font-medium">Academic Portal</p>
              </div>
            </div>
          </div>

          {/* Profile Card */}
          <div className="m-1 p-3 bg-[#161e2e]/60 rounded-xl border border-[#212d40] flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-full bg-emerald-800/60 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center justify-center shrink-0">
              STD
            </div>
            <div>
              <h2 className="text-xs font-semibold text-slate-100 leading-tight">Student A.</h2>
              <p className="text-[10px] text-slate-400">Student (3rd Sem)</p>
            </div>
          </div>

          {/* Workspace Links */}
          <nav className="px-1 py-1 space-y-5">
            <div>
              <span className="px-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">WORKSPACE</span>
              <ul className="space-y-1 text-xs">
                <li>
                  <Link href="/" className="flex items-center justify-between px-3 py-2 rounded-lg bg-sky-500/15 text-sky-400 font-medium border border-sky-500/20 shadow-sm">
                    <span className="flex items-center gap-3">
                      <i className="fa-solid fa-border-all w-4"></i> Dashboard
                    </span>
                  </Link>
                </li>
                
                {/* Data Maintenance Link */}
                <li>
                  <Link href="/maintenance" className="flex items-center justify-between px-3 py-2 text-sky-400 hover:text-sky-300 hover:bg-[#1e293b] rounded-lg transition-all border border-sky-500/30 bg-sky-500/10">
                    <span className="flex items-center gap-3">
                      <i className="fa-solid fa-database w-4"></i> Data Maintenance
                    </span>
                    <span className="text-[10px] bg-sky-500/20 text-sky-300 px-1.5 py-0.5 rounded font-medium">Admin</span>
                  </Link>
                </li>

                <li>
                  <a href="#" className="flex items-center justify-between px-3 py-2 text-slate-400 hover:text-slate-200 hover:bg-[#1e293b] rounded-lg transition-all">
                    <span className="flex items-center gap-3">
                      <i className="fa-regular fa-folder w-4"></i> My Subjects
                    </span>
                    <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400">5</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center justify-between px-3 py-2 text-slate-400 hover:text-slate-200 hover:bg-[#1e293b] rounded-lg transition-all">
                    <span className="flex items-center gap-3">
                      <i className="fa-regular fa-clock w-4"></i> Deadlines
                    </span>
                    <span className="text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/30 px-1.5 py-0.5 rounded font-medium">7 Due</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center justify-between px-3 py-2 text-slate-400 hover:text-slate-200 hover:bg-[#1e293b] rounded-lg transition-all">
                    <span className="flex items-center gap-3">
                      <i className="fa-solid fa-diagram-project w-4"></i> Projects
                    </span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.5 rounded font-medium">67%</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center justify-between px-3 py-2 text-slate-400 hover:text-slate-200 hover:bg-[#1e293b] rounded-lg transition-all">
                    <span className="flex items-center gap-3">
                      <i className="fa-regular fa-circle-check w-4"></i> Tasks
                    </span>
                    <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400">6</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-slate-200 hover:bg-[#1e293b] rounded-lg transition-all">
                    <i className="fa-regular fa-calendar-days w-4"></i> Class Schedule
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-slate-200 hover:bg-[#1e293b] rounded-lg transition-all">
                    <i className="fa-solid fa-chart-line w-4"></i> Analytics
                  </a>
                </li>
              </ul>
            </div>

            {/* Course Submissions */}
            <div>
              <span className="px-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">COURSE SUBMISSIONS</span>
              <ul className="space-y-1 text-xs">
                <li>
                  <a href="#" className="flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-slate-200 hover:bg-[#1e293b] rounded-lg transition-all">
                    <i className="fa-regular fa-file-lines w-4"></i> Assignment 1 Report
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-slate-200 hover:bg-[#1e293b] rounded-lg transition-all">
                    <i className="fa-solid fa-database w-4"></i> Assignment 2 Schema
                  </a>
                </li>
              </ul>
            </div>
          </nav>
        </div>

        {/* Footer */}
        <div className="p-2 border-t border-[#212d40] bg-[#0b0f17]/40 text-[11px] text-slate-500 space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="flex items-center gap-1.5 text-slate-400 text-xs">
              <i className="fa-solid fa-moon text-amber-400"></i> Dark Mode Active
            </span>
          </div>
          <Link href="/imprint" className="w-full text-center py-2 px-2 bg-[#161e2e] hover:bg-[#1e293b] border border-[#212d40] rounded-lg text-xs text-sky-400 transition-colors flex items-center justify-center gap-2">
            <i className="fa-solid fa-scale-balanced"></i> Imprint & Disclaimer
          </Link>
        </div>
      </aside>

      {/* Main Content Workspace */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#0b0f17] overflow-y-auto">
        
        {/* Header Command Center */}
        <header className="p-4 md:px-8 border-b border-[#212d40] flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#111723]/40 sticky top-0 backdrop-blur-md z-10">
          <div>
            <h1 className="text-lg md:text-xl font-bold text-slate-100">Personalized Academic Dashboard</h1>
            <p className="text-xs text-slate-400">Centralized command center for enrolled subjects, deadlines, and project milestones.</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative flex-1 sm:w-72">
              <i className="fa-solid fa-magnifying-glass absolute left-3 top-2.5 text-slate-500 text-xs"></i>
              <input 
                type="text" 
                placeholder="Search notes, deadlines, tasks..." 
                className="w-full bg-[#161e2e] border border-[#212d40] rounded-lg pl-8 pr-4 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors"
              />
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg text-xs font-semibold shadow-md flex items-center gap-1.5 transition-all shrink-0">
              + Add Task
            </button>
          </div>
        </header>

        {/* Content Body Wrapper */}
        <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto w-full">

          {/* Workload Alert Banner */}
          <div className="bg-[#2d1518]/80 border border-[#7f1d1d] rounded-xl p-4 glow-alert flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-rose-500/20 border border-rose-500/40 text-amber-400 flex items-center justify-center shrink-0 mt-0.5 text-sm">
              <i className="fa-solid fa-bolt"></i>
            </div>
            <div>
              <h3 className="text-xs md:text-sm font-bold text-rose-300 tracking-wide">
                Workload Conflict Detected: 2 Deadlines Within 72 Hours
              </h3>
              <p className="text-xs text-rose-200/80 mt-1 leading-relaxed">
                Upcoming cluster: <strong className="text-slate-200">Databases — Assignment 1</strong> and <strong className="text-slate-200">Current Topics in Data Engineering — Project Proposal</strong>.
              </p>
            </div>
          </div>

          {/* Top Stat Cards Grid (4 Columns) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Card 1 */}
            <div className="bg-[#161e2e] border border-[#212d40] rounded-xl p-4 flex flex-col justify-between h-32">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400">Enrolled Subjects</span>
                <span className="text-[10px] bg-slate-800 text-slate-400 border border-slate-700 px-2 py-0.5 rounded font-medium">Fall 2026</span>
              </div>
              <div>
                <span className="text-3xl font-extrabold text-slate-100">5</span>
              </div>
              <div className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
                • All workspaces active
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-[#161e2e] border border-[#212d40] rounded-xl p-4 flex flex-col justify-between h-32">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400">Upcoming Deadlines</span>
                <span className="text-[10px] bg-slate-800 text-slate-400 border border-slate-700 px-2 py-0.5 rounded font-medium">Next 7 Days</span>
              </div>
              <div>
                <span className="text-3xl font-extrabold text-slate-100">3</span>
              </div>
              <div className="text-[11px] text-amber-400 font-medium truncate">
                Next: Databases ER Diagram
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-[#161e2e] border border-[#212d40] rounded-xl p-4 flex flex-col justify-between h-32">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400">Pending Study Tasks</span>
                <span className="text-[10px] bg-slate-800 text-slate-400 border border-slate-700 px-2 py-0.5 rounded font-medium">Active</span>
              </div>
              <div>
                <span className="text-3xl font-extrabold text-slate-100">6</span>
              </div>
              <div className="text-[11px] text-sky-400 font-medium">
                2 High Priority
              </div>
            </div>

            {/* Card 4 */}
            <div className="bg-[#161e2e] border border-[#212d40] rounded-xl p-4 flex flex-col justify-between h-32">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400">Database Project</span>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-medium">Milestone 4/6</span>
              </div>
              <div>
                <span className="text-3xl font-extrabold text-slate-100">67%</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-sky-400 h-full rounded-full" style={{ width: '67%' }}></div>
              </div>
            </div>

          </div>

          {/* Main Content Split Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column (2 Span): Deliverables */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-slate-200">Upcoming Deliverables</h2>
                  <p className="text-[10px] text-slate-400 mt-0.5">Real-time compilation across all enrolled courses</p>
                </div>
                <a href="#" className="text-xs text-sky-400 hover:text-sky-300 font-medium">
                  View All &rarr;
                </a>
              </div>

              {/* Items */}
              <div className="space-y-3">
                <div className="bg-[#161e2e] border border-[#212d40] rounded-xl p-4 flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xs font-semibold text-slate-100">Assignment 1: ER Diagram & Service Description</h3>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Databases • Due Sep 17, 11:59 PM • 10 pts
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[10px] font-bold shrink-0">
                    HIGH
                  </span>
                </div>

                <div className="bg-[#161e2e] border border-[#212d40] rounded-xl p-4 flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xs font-semibold text-slate-100">Project Proposal & Data Sources</h3>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Current Topics in Data Engineering • Due Sep 20, 11:59 PM • 25 pts
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[10px] font-bold shrink-0">
                    HIGH
                  </span>
                </div>

                <div className="bg-[#161e2e] border border-[#212d40] rounded-xl p-4 flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xs font-semibold text-slate-100">Assignment 1: Async Data Scraper</h3>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Python Programming • Due Sep 23, 11:59 PM • 20 pts
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-bold shrink-0">
                    MEDIUM
                  </span>
                </div>

                <div className="bg-[#161e2e] border border-[#212d40] rounded-xl p-4 flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xs font-semibold text-slate-100">Assignment 2: MySQL Logical Schema & Mapping</h3>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Databases • Due Sep 24, 11:59 PM • 20 pts
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[10px] font-bold shrink-0">
                    HIGH
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column (1 Span): Widgets */}
            <div className="space-y-6">
              
              {/* Today's Classes */}
              <div className="bg-[#161e2e] border border-[#212d40] rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-[#212d40]/60 pb-2">
                  <h2 className="text-xs font-bold text-slate-100">Today's Classes</h2>
                  <span className="text-[10px] bg-slate-800 text-slate-400 border border-slate-700 px-2 py-0.5 rounded font-medium">Monday</span>
                </div>

                <div className="space-y-2">
                  <div className="bg-[#0b0f17]/70 border border-[#212d40] rounded-lg p-3 flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-semibold text-slate-200">Databases (Lecture)</h3>
                      <p className="text-[10px] text-slate-400 mt-0.5">Lecture Hall 1 • Prof. Dr. Peter Baumann</p>
                    </div>
                    <span className="text-[10px] font-semibold text-slate-300 bg-slate-800 px-2 py-1 rounded border border-slate-700">
                      10:00 - 12:00
                    </span>
                  </div>

                  <div className="bg-[#0b0f17]/70 border border-[#212d40] rounded-lg p-3 flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-semibold text-slate-200">Python Programming (Lab)</h3>
                      <p className="text-[10px] text-slate-400 mt-0.5">CS Lab 4 • Dr. Sarah Connor</p>
                    </div>
                    <span className="text-[10px] font-semibold text-slate-300 bg-slate-800 px-2 py-1 rounded border border-slate-700">
                      14:00 - 16:00
                    </span>
                  </div>
                </div>
              </div>

              {/* Database Project Progress */}
              <div className="bg-[#161e2e] border border-[#212d40] rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-[#212d40]/60 pb-2">
                  <h2 className="text-xs font-bold text-slate-100">Database Project Progress</h2>
                  <span className="text-[10px] bg-slate-800 text-slate-400 border border-slate-700 px-2 py-0.5 rounded font-medium">Team 3</span>
                </div>

                <ul className="space-y-2 text-xs">
                  <li className="flex items-center gap-2.5 text-slate-300">
                    <i className="fa-solid fa-check text-emerald-400 text-xs"></i>
                    <span>Requirements & Service Description</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-slate-300">
                    <i className="fa-solid fa-check text-emerald-400 text-xs"></i>
                    <span>Conceptual ER Diagram</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-slate-300">
                    <i className="fa-solid fa-[#38bdf8] fa-gear text-sky-400 text-xs"></i>
                    <span>Relational Schema & Web CD</span>
                  </li>
                </ul>
              </div>

            </div>

          </div>

        </div>
      </main>
    </div>
  );
}