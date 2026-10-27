'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ClassScheduleFormPage() {
  const [subjectId, setSubjectId] = useState('');
  const [dayOfWeek, setDayOfWeek] = useState('Monday');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [lectureType, setLectureType] = useState('Lecture');

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSubmitted(false);
    setError('');

    try {
      const response = await fetch('/api/schedules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject_id: Number(subjectId),
          day_of_week: dayOfWeek.trim(),
          start_time: startTime.trim(),
          end_time: endTime.trim(),
          room_number: roomNumber.trim(),
          lecture_type: lectureType.trim(),
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || result.details || 'Failed to save schedule.');

      setSubmitted(true);
      setSubjectId('');
      setStartTime('');
      setEndTime('');
      setRoomNumber('');
      setLectureType('Lecture');
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
            <h1 className="text-xl font-bold text-white">Add New Class Schedule</h1>
            <p className="text-xs text-slate-400 mt-1">Manage and assign course lecture times and rooms.</p>
          </div>
          <Link href="/maintenance" className="px-3 py-1.5 bg-[#161e2e] border border-[#212d40] rounded-lg text-xs text-sky-400 hover:bg-[#1e293b] transition-colors whitespace-nowrap">
            &larr; Back to Maintenance
          </Link>
        </div>

        {/* Success Alert */}
        {submitted && (
          <div role="status" className="bg-emerald-950/40 border border-emerald-500/40 p-4 rounded-xl text-emerald-300 text-xs">
            ✓ Class schedule added successfully!
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
          
          {/* Subject ID */}
          <div>
            <label className={labelClass}>Subject ID</label>
            <input 
              type="number" 
              required
              min="1"
              value={subjectId} 
              onChange={(e) => setSubjectId(e.target.value)} 
              placeholder="e.g. 1" 
              className={inputClass} 
            />
          </div>

          {/* Day of Week */}
          <div>
            <label className={labelClass}>Day of Week</label>
            <select value={dayOfWeek} onChange={(e) => setDayOfWeek(e.target.value)} className={inputClass}>
              <option value="Monday">Monday</option>
              <option value="Tuesday">Tuesday</option>
              <option value="Wednesday">Wednesday</option>
              <option value="Thursday">Thursday</option>
              <option value="Friday">Friday</option>
              <option value="Saturday">Saturday</option>
              <option value="Sunday">Sunday</option>
            </select>
          </div>

          /* Start Time */
          <div>
            <label className={labelClass}>Start Time</label>
            <input 
              type="text" 
              required
              value={startTime} 
              onChange={(e) => setStartTime(e.target.value)} 
              placeholder="e.g. 09:00:00" 
              className={inputClass} 
            />
          </div>

          {/* End Time */}
          <div>
            <label className={labelClass}>End Time</label>
            <input 
              type="text" 
              required
              value={endTime} 
              onChange={(e) => setEndTime(e.target.value)} 
              placeholder="e.g. 10:20:00" 
              className={inputClass} 
            />
          </div>

          {/* Room Number */}
          <div>
            <label className={labelClass}>Room Number</label>
            <input 
              type="text" 
              required
              value={roomNumber} 
              onChange={(e) => setRoomNumber(e.target.value)} 
              placeholder="e.g. Room 302" 
              className={inputClass} 
            />
          </div>

          {/* Lecture Type */}
          <div>
            <label className={labelClass}>Lecture Type</label>
            <input 
              type="text" 
              value={lectureType} 
              onChange={(e) => setLectureType(e.target.value)} 
              placeholder="e.g. Lecture, Lab" 
              className={inputClass} 
            />
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-sky-500 hover:bg-sky-600 disabled:bg-slate-600 text-white py-2.5 rounded-lg text-xs font-semibold transition-all mt-4"
          >
            {loading ? 'Saving Schedule...' : 'Save Class Schedule'}
          </button>

        </form>
      </div>
    </div>
  );
}