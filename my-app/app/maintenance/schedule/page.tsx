
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Subject {
  subject_id: number;
  subject_name: string;
  course_code: string;
}

export default function ClassScheduleFormPage() {
  const [subjectId, setSubjectId] = useState('');
  const [dayOfWeek, setDayOfWeek] = useState('Monday');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [lectureType, setLectureType] = useState('Lecture');

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loadingSubjects, setLoadingSubjects] = useState(true);

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch subjects
  useEffect(() => {
    let cancelled = false;

    async function fetchSubjects() {
      setLoadingSubjects(true);

      try {
        const response = await fetch('/api/subjects', {
          method: 'GET',
          credentials: 'same-origin',
          cache: 'no-store',
        });

        const data = await response.json();

        if (response.status === 401 || response.status === 403) {
          throw new Error(
            'Your administrator session has expired. Please sign in again.'
          );
        }

        if (!response.ok) {
          throw new Error(data.error || 'Failed to load subjects.');
        }

        const subjectList = Array.isArray(data)
          ? data
          : data.subjects || [];

        if (!cancelled) {
          setSubjects(subjectList);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : 'Failed to load subjects.'
          );
        }
      } finally {
        if (!cancelled) {
          setLoadingSubjects(false);
        }
      }
    }

    fetchSubjects();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setLoading(true);
    setSubmitted(false);
    setError('');
    setSuccessMessage('');

    const numericSubjectId = Number(subjectId);

    // Validate subject
    if (
      !Number.isSafeInteger(numericSubjectId) ||
      numericSubjectId <= 0 ||
      !subjects.some(
        (subject) => subject.subject_id === numericSubjectId
      )
    ) {
      setError('Please select a valid subject.');
      setLoading(false);
      return;
    }

    // Validate time format
    const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;

    if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
      setError('Please enter valid start and end times.');
      setLoading(false);
      return;
    }

    // Ensure end time is after start time
    if (endTime <= startTime) {
      setError('End time must be later than start time.');
      setLoading(false);
      return;
    }

    const savedRoomNumber = roomNumber.trim();
    const savedLectureType = lectureType.trim();

    if (!savedRoomNumber || !savedLectureType) {
      setError('Room number and lecture type are required.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/schedules', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
        body: JSON.stringify({
          subject_id: numericSubjectId,
          day_of_week: dayOfWeek,
          start_time: `${startTime}:00`,
          end_time: `${endTime}:00`,
          room_number: savedRoomNumber,
          lecture_type: savedLectureType,
        }),
      });

      const result = await response.json();

      if (response.status === 401 || response.status === 403) {
        throw new Error(
          'Your administrator session has expired. Please sign in again.'
        );
      }

      if (!response.ok) {
        throw new Error(
          result.error ||
          result.details ||
          'Failed to save schedule.'
        );
      }

      setSuccessMessage(
        `Class schedule for ${dayOfWeek}, ${startTime}–${endTime} added successfully!`
      );

      setSubmitted(true);

      setSubjectId('');
      setStartTime('');
      setEndTime('');
      setRoomNumber('');
      setLectureType('Lecture');

    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'An unexpected error occurred.'
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full bg-[#161e2e] border border-[#212d40] rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-sky-500';

  const labelClass =
    'block text-xs font-semibold text-slate-300 mb-1';

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-200 p-6 md:p-12 font-sans">
      <div className="max-w-xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#212d40] pb-4 gap-4">
          <div>
            <h1 className="text-xl font-bold text-white">
              Add New Class Schedule
            </h1>

            <p className="text-xs text-slate-400 mt-1">
              Manage and assign course lecture times and rooms.
            </p>
          </div>

          <Link
            href="/maintenance/dashboard"
            className="px-3 py-1.5 bg-[#161e2e] border border-[#212d40] rounded-lg text-xs text-sky-400 hover:bg-[#1e293b] transition-colors whitespace-nowrap"
          >
            &larr; Back to Dashboard
          </Link>
        </div>

        {/* Success Alert */}
        {submitted && (
          <div
            role="status"
            className="bg-emerald-950/40 border border-emerald-500/40 p-4 rounded-xl text-emerald-300 text-xs"
          >
            ✓ {successMessage}
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div
            role="alert"
            className="bg-red-950/40 border border-red-500/40 p-4 rounded-xl text-red-300 text-xs"
          >
            <p className="font-bold">Error</p>
            <p className="mt-1">{error}</p>
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-[#111723] border border-[#212d40] rounded-xl p-6 space-y-4 shadow-xl"
        >

          {/* Subject */}
          <div>
            <label htmlFor="subjectId" className={labelClass}>
              Course / Subject
            </label>

            <select
              id="subjectId"
              required
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              disabled={loadingSubjects || subjects.length === 0}
              className={inputClass}
            >
              <option value="">
                {loadingSubjects
                  ? 'Loading subjects...'
                  : subjects.length === 0
                    ? 'No subjects available'
                    : '-- Select Subject --'}
              </option>

              {subjects.map((subject) => (
                <option
                  key={subject.subject_id}
                  value={subject.subject_id}
                >
                  {subject.course_code
                    ? `${subject.course_code} - ${subject.subject_name}`
                    : subject.subject_name}
                </option>
              ))}
            </select>

            {!loadingSubjects && subjects.length === 0 && (
              <p className="text-xs text-amber-400 mt-2">
                Add a subject before creating a class schedule.
              </p>
            )}
          </div>

          {/* Day */}
          <div>
            <label htmlFor="dayOfWeek" className={labelClass}>
              Day of Week
            </label>

            <select
              id="dayOfWeek"
              value={dayOfWeek}
              onChange={(e) => setDayOfWeek(e.target.value)}
              className={inputClass}
            >
              <option value="Monday">Monday</option>
              <option value="Tuesday">Tuesday</option>
              <option value="Wednesday">Wednesday</option>
              <option value="Thursday">Thursday</option>
              <option value="Friday">Friday</option>
              <option value="Saturday">Saturday</option>
              <option value="Sunday">Sunday</option>
            </select>
          </div>

          {/* Start Time */}
          <div>
            <label htmlFor="startTime" className={labelClass}>
              Start Time
            </label>

            <input
              id="startTime"
              type="time"
              required
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className={inputClass}
            />
          </div>

          {/* End Time */}
          <div>
            <label htmlFor="endTime" className={labelClass}>
              End Time
            </label>

            <input
              id="endTime"
              type="time"
              required
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className={inputClass}
            />
          </div>

          {/* Room */}
          <div>
            <label htmlFor="roomNumber" className={labelClass}>
              Room Number
            </label>

            <input
              id="roomNumber"
              type="text"
              required
              maxLength={50}
              value={roomNumber}
              onChange={(e) => setRoomNumber(e.target.value)}
              placeholder="e.g. Room 302"
              className={inputClass}
            />
          </div>

          {/* Lecture Type */}
          <div>
            <label htmlFor="lectureType" className={labelClass}>
              Lecture Type
            </label>

            <select
              id="lectureType"
              value={lectureType}
              onChange={(e) => setLectureType(e.target.value)}
              className={inputClass}
            >
              <option value="Lecture">Lecture</option>
              <option value="Lab">Lab</option>
              <option value="Tutorial">Tutorial</option>
              <option value="Seminar">Seminar</option>
            </select>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={
              loading ||
              loadingSubjects ||
              subjects.length === 0
            }
            className="w-full bg-sky-500 hover:bg-sky-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white py-2.5 rounded-lg text-xs font-semibold transition-all mt-4"
          >
            {loading ? 'Saving Schedule...' : 'Save Class Schedule'}
          </button>

        </form>
      </div>
    </div>
  );
}
