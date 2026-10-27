import Link from 'next/link';

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-200 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#212d40] pb-4">
          <div>
            <h1 className="text-xl font-bold text-white">Database Maintenance Panel</h1>
            <p className="text-xs text-slate-400 mt-1">Central management hub for inserting entities and relationships[cite: 1].</p>
          </div>
          <Link href="/" className="px-3 py-1.5 bg-[#161e2e] border border-[#212d40] rounded-lg text-xs text-sky-400 hover:bg-[#1e293b]">
            &larr; Back to Dashboard
          </Link>
        </div>

        {/* Entities & Relationships Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Entities Section */}
          <div className="bg-[#111723] border border-[#212d40] rounded-xl p-5 space-y-3">
            <h2 className="text-sm font-bold text-sky-400 uppercase tracking-wider">Entity Input Forms (6 Required)</h2>
            <ul className="space-y-2 text-xs">
              <li><Link href="/maintenance/student" className="block p-2 bg-[#161e2e] hover:bg-[#1e293b] rounded border border-[#212d40] text-slate-200">1. Add New Student Form</Link></li>
              <li><Link href="/maintenance/course" className="block p-2 bg-[#161e2e] hover:bg-[#1e293b] rounded border border-[#212d40] text-slate-200">2. Add New Course Form</Link></li>
              <li><Link href="/maintenance/assignment" className="block p-2 bg-[#161e2e] hover:bg-[#1e293b] rounded border border-[#212d40] text-slate-200">3. Add New Assignment Form</Link></li>
              <li><Link href="/maintenance/task" className="block p-2 bg-[#161e2e] hover:bg-[#1e293b] rounded border border-[#212d40] text-slate-200">4. Add New Task Form</Link></li>
              <li><Link href="/maintenance/schedule" className="block p-2 bg-[#161e2e] hover:bg-[#1e293b] rounded border border-[#212d40] text-slate-200">5. Add New Class Schedule Form</Link></li>
              <li><Link href="/maintenance/project" className="block p-2 bg-[#161e2e] hover:bg-[#1e293b] rounded border border-[#212d40] text-slate-200">6. Add New Project Form</Link></li>
            </ul>
          </div>

          {/* Relationships Section */}
          <div className="bg-[#111723] border border-[#212d40] rounded-xl p-5 space-y-3">
            <h2 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">Relationship Input Forms (3 Required)</h2>
            <ul className="space-y-2 text-xs">
              <li><Link href="/maintenance/enrollment" className="block p-2 bg-[#161e2e] hover:bg-[#1e293b] rounded border border-[#212d40] text-slate-200">1. Enrollment (Student & Course)</Link></li>
              <li><Link href="/maintenance/submission" className="block p-2 bg-[#161e2e] hover:bg-[#1e293b] rounded border border-[#212d40] text-slate-200">2. Submission (Student & Assignment)</Link></li>
              <li><Link href="/maintenance/task-course" className="block p-2 bg-[#161e2e] hover:bg-[#1e293b] rounded border border-[#212d40] text-slate-200">3. Task Assignment (Task & Course)</Link></li>
            </ul>
          </div>

        </div>

      </div>
    </div>
  );
}