'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Student {
  student_id: number;
  full_name: string;
}

export default function TaskFormPage() {
  const [taskType, setTaskType] = useState('PERSONAL');
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [status, setStatus] = useState('Pending');
  const [studentId, setStudentId] = useState('');
  const [projectId, setProjectId] = useState('');
  const [category, setCategory] = useState('');
  const [estimatedHours, setEstimatedHours] = useState('2');

  const [students, setStudents] = useState<Student[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(true);

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchStudents() {
      try {
        const res = await fetch('/api/students');
        if (res.ok) {
          const data = await res.json();
          setStudents(data.students || data || []);
        }
      } catch (err) {
        console.error('Failed to load students:', err);
      } finally {
        setLoadingStudents(false);
      }
    }
    fetchStudents();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSubmitted(false);
    setError('');

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task_type: taskType.trim(),
          title: title.trim(),
          due_date: dueDate,
          priority: priority.trim(),
          status: status.trim(),
          student_id: taskType === 'PERSONAL' && studentId ? Number(studentId) : null,
          project_id: taskType === 'PROJECT' && projectId ? Number(projectId) : null,
          category: category.trim() || null,
          estimated_hours: estimatedHours ? Number(estimatedHours) : null,
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || result.details || 'Failed to save task record.');

      setSubmitted(true);
      setTitle('');
      setDueDate('');
      setCategory('');
      setEstimatedHours('2');
      setStudentId('');
      setProjectId('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = 'w-full bg-[#161e2e] border border-[#212d40] rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-sky-500';
  const labelClass = 'block text-xs font-semibold text-slate-300 mb-1';

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-200 p-6 md:p-12 font-sans">
      <div className="max-w-xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#212d40] pb-4">
          <div>
            <h1 className="text-xl font-bold text-white">Add New Academic Task</h1>
            <p className="text-xs text-slate-400 mt-1">Create a new task record with Polymorphic validation.</p>
          </div>
          <Link href="/maintenance" className="px-3 py-1.5 bg-[#161e2e] border border-[#212d40] rounded-lg text-xs text-sky-400 hover:bg-[#1e293b] transition-colors whitespace-nowrap">
            &larr; Back to Maintenance
          </Link>
        </div>

        {/* Success Alert */}
        {submitted && (
          <div role="status" className="bg-emerald-950/40 border border-emerald-500/40 p-4 rounded-xl text-emerald-300 text-xs">
            ✓ Academic task added successfully!
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div role="alert" className="bg-red-950/40 border border-red-500/40 p-4 rounded-xl text-red-300 text-xs">
            <p className="font-bold">Error</p>
            <p className="mt-1">{error}</p>
          </div>
        )}

        {/* Form Card */}
        <form onSubmit={handleSubmit} className="bg-[#111723] border border-[#212d40] rounded-xl p-6 space-y-4 shadow-xl">
          
          {/* Task Type */}
          <div>
            <label className={labelClass}>Task Type</label>
            <select 
              value={taskType} 
              onChange={(e) => {
                setTaskType(e.target.value);
                if (e.target.value === 'PROJECT') setStudentId('');
                if (e.target.value === 'PERSONAL') setProjectId('');
              }} 
              className={inputClass}
            >
              <option value="PERSONAL">PERSONAL (Requires Student)</option>
              <option value="PROJECT">PROJECT (Requires Project ID)</option>
            </select>
          </div>

          {/* Title */}
          <div>
            <label className={labelClass}>Task Title</label>
            <input 
              type="text" 
              required
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="e.g. Database Design Milestones" 
              className={inputClass} 
            />
          </div>

          {/* Conditional Field: Student ID (Only for PERSONAL) */}
          {taskType === 'PERSONAL' && (
            <div>
              <label className={labelClass}>Assigned Student (Required for PERSONAL)</label>
              <select 
                required
                value={studentId} 
                onChange={(e) => setStudentId(e.target.value)} 
                className={inputClass}
              >
                <option value="">{loadingStudents ? 'Loading students...' : '-- Select Student --'}</option>
                {students.map((s) => (
                  <option key={s.student_id} value={s.student_id}>
                    {s.full_name} (ID: {s.student_id})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Conditional Field: Project ID (Only for PROJECT) */}
          {taskType === 'PROJECT' && (
            <div>
              <label className={labelClass}>Project ID (Required for PROJECT)</label>
              <input 
                type="number" 
                required
                min="1"
                value={projectId} 
                onChange={(e) => setProjectId(e.target.value)} 
                placeholder="e.g. 1" 
                className={inputClass} 
              />
            </div>
          )}

          {/* Due Date */}
          <div>
            <label className={labelClass}>Due Date</label>
            <input 
              type="date" 
              required
              value={dueDate} 
              onChange={(e) => setDueDate(e.target.value)} 
              className={inputClass} 
            />
          </div>

          {/* Priority */}
          <div>
            <label className={labelClass}>Priority</label>
            <select value={priority} onChange={(e) => setPriority(e.target.value)} className={inputClass}>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className={labelClass}>Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className={inputClass}>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          {/* Category */}
          <div>
            <label className={labelClass}>Category</label>
            <input 
              type="text" 
              value={category} 
              onChange={(e) => setCategory(e.target.value)} 
              placeholder="e.g. Development" 
              className={inputClass} 
            />
          </div>

          {/* Estimated Hours */}
          <div>
            <label className={labelClass}>Estimated Hours</label>
            <input 
              type="number" 
              step="0.1" 
              min="0" 
              value={estimatedHours} 
              onChange={(e) => setEstimatedHours(e.target.value)} 
              className={inputClass} 
            />
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-sky-500 hover:bg-sky-600 disabled:bg-slate-600 text-white py-2.5 rounded-lg text-xs font-semibold transition-all mt-4"
          >
            {loading ? 'Saving Task...' : 'Save Task Record'}
          </button>

        </form>
      </div>
    </div>
  );
}