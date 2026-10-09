import React, { useState } from 'react';
import { 
  GraduationCap, 
  Award, 
  BookOpen, 
  Download, 
  Printer, 
  Filter, 
  ChevronDown, 
  CheckCircle2, 
  FileCheck, 
  Search,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';

export default function AcademicRecords() {
  const [selectedTerm, setSelectedTerm] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Summary Metrics
  const summary = {
    cgpa: "3.84",
    majorGpa: "3.92",
    creditsEarned: 84,
    totalRequired: 120,
    academicStanding: "Good Standing (Dean's List)"
  };

  // Course History Data grouped by term
  const academicTerms = [
    {
      term: "Fall 2026",
      status: "In Progress",
      gpa: "3.88",
      credits: 12,
      courses: [
        { code: "MIS 310", title: "Database Management Systems", credits: 3, grade: "A-", points: 3.7, status: "Enrolled" },
        { code: "MIS 420", title: "Systems Analysis & Design", credits: 3, grade: "A", points: 4.0, status: "Enrolled" },
        { code: "CS 205", title: "Web Application Development", credits: 3, grade: "A", points: 4.0, status: "Enrolled" },
        { code: "BUS 210", title: "Business Analytics", credits: 3, grade: "B+", points: 3.3, status: "Enrolled" }
      ]
    },
    {
      term: "Spring 2026",
      status: "Completed",
      gpa: "3.85",
      credits: 15,
      courses: [
        { code: "MIS 210", title: "Enterprise Systems", credits: 3, grade: "A", points: 4.0, status: "Completed" },
        { code: "CS 102", title: "Data Structures & Algorithms", credits: 4, grade: "A-", points: 3.7, status: "Completed" },
        { code: "MGT 301", title: "Principles of Management", credits: 3, grade: "A", points: 4.0, status: "Completed" },
        { code: "STAT 201", title: "Business Statistics", credits: 3, grade: "B+", points: 3.3, status: "Completed" },
        { code: "ENG 202", title: "Technical Writing", credits: 2, grade: "A", points: 4.0, status: "Completed" }
      ]
    },
    {
      term: "Fall 2025",
      status: "Completed",
      gpa: "3.80",
      credits: 15,
      courses: [
        { code: "MIS 101", title: "Introduction to MIS", credits: 3, grade: "A", points: 4.0, status: "Completed" },
        { code: "CS 101", title: "Computer Programming I", credits: 4, grade: "A", points: 4.0, status: "Completed" },
        { code: "MATH 115", title: "Calculus for Business", credits: 3, grade: "B", points: 3.0, status: "Completed" },
        { code: "ECON 101", title: "Microeconomics", credits: 3, grade: "A-", points: 3.7, status: "Completed" },
        { code: "ORGL 100", title: "University Leadership Seminar", credits: 2, grade: "P", points: 0.0, status: "Completed" }
      ]
    }
  ];

  // Filter terms according to dropdown selection
  const filteredTerms = selectedTerm === 'All' 
    ? academicTerms 
    : academicTerms.filter(t => t.term === selectedTerm);

  const getGradeBadge = (grade) => {
    if (grade.startsWith('A')) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (grade.startsWith('B')) return 'bg-blue-50 text-blue-700 border-blue-200';
    if (grade.startsWith('C')) return 'bg-amber-50 text-amber-700 border-amber-200';
    return 'bg-slate-100 text-slate-700 border-slate-200';
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Title & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1">
              <GraduationCap className="h-4 w-4" />
              <span>Student Academic Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Academic Transcript & Records</h1>
            <p className="text-sm text-slate-500">Official course grade history, cumulative GPA calculations, and credit progress.</p>
          </div>

          <div className="flex items-center space-x-3">
            <button 
              onClick={() => window.print()}
              className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 font-medium text-sm px-4 py-2.5 rounded-xl flex items-center space-x-2 transition shadow-sm"
            >
              <Printer className="h-4 w-4 text-slate-500" />
              <span>Print Page</span>
            </button>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm px-4 py-2.5 rounded-xl flex items-center space-x-2 transition shadow-sm shadow-indigo-600/20">
              <Download className="h-4 w-4" />
              <span>Download Official PDF</span>
            </button>
          </div>
        </div>

        {/* Academic Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold uppercase tracking-wider">Cumulative GPA</span>
              <Award className="h-5 w-5 text-indigo-600" />
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-black text-slate-900">{summary.cgpa}</span>
              <span className="text-xs text-slate-400 font-medium">/ 4.00</span>
            </div>
            <span className="inline-block text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/50">
              {summary.academicStanding}
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold uppercase tracking-wider">Major GPA (MIS)</span>
              <Sparkles className="h-5 w-5 text-amber-500" />
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-black text-slate-900">{summary.majorGpa}</span>
              <span className="text-xs text-slate-400 font-medium">/ 4.00</span>
            </div>
            <p className="text-xs text-slate-500">Based on core MIS courses</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold uppercase tracking-wider">Credits Earned</span>
              <BookOpen className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-black text-slate-900">{summary.creditsEarned}</span>
              <span className="text-xs text-slate-400 font-medium">/ {summary.totalRequired} Total</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-indigo-600 h-full rounded-full" 
                style={{ width: `${(summary.creditsEarned / summary.totalRequired) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold uppercase tracking-wider">Degree Status</span>
              <FileCheck className="h-5 w-5 text-emerald-600" />
            </div>
            <div className="text-lg font-bold text-slate-900">Senior Year (70%)</div>
            <p className="text-xs text-slate-500">Expected Graduation: Spring 2027</p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search course code or title..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 pl-9 pr-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <Filter className="h-4 w-4 text-slate-400 hidden sm:block" />
            <span className="text-xs font-semibold text-slate-500 hidden sm:block">Term Filter:</span>
            <select 
              value={selectedTerm}
              onChange={(e) => setSelectedTerm(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-700 text-sm font-medium rounded-xl px-3 py-2 w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="All">All Semesters</option>
              <option value="Fall 2026">Fall 2026</option>
              <option value="Spring 2026">Spring 2026</option>
              <option value="Fall 2025">Fall 2025</option>
            </select>
          </div>
        </div>

        {/* Term Tables */}
        <div className="space-y-6">
          {filteredTerms.map((termBlock, idx) => {
            const coursesToShow = termBlock.courses.filter(c => 
              c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
              c.title.toLowerCase().includes(searchTerm.toLowerCase())
            );

            if (coursesToShow.length === 0) return null;

            return (
              <div key={idx} className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                
                {/* Term Subheader */}
                <div className="bg-slate-50 border-b border-slate-200 p-4 sm:p-5 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center space-x-3">
                    <h2 className="font-bold text-slate-900 text-lg">{termBlock.term}</h2>
                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                      termBlock.status === 'In Progress' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {termBlock.status}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-xs font-semibold text-slate-600">
                    <div>Term Credits: <span className="text-slate-900">{termBlock.credits}</span></div>
                    <div className="h-3 w-px bg-slate-300"></div>
                    <div>Term GPA: <span className="text-slate-900">{termBlock.gpa}</span></div>
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 text-[11px] uppercase tracking-wider bg-white">
                        <th className="p-4 font-semibold">Course Code</th>
                        <th className="p-4 font-semibold">Course Title</th>
                        <th className="p-4 font-semibold">Credits</th>
                        <th className="p-4 font-semibold">Grade</th>
                        <th className="p-4 font-semibold">Grade Points</th>
                        <th className="p-4 font-semibold text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                      {coursesToShow.map((course, cIdx) => (
                        <tr key={cIdx} className="hover:bg-slate-50/80 transition">
                          <td className="p-4 font-mono font-bold text-indigo-600">{course.code}</td>
                          <td className="p-4 font-semibold text-slate-800">{course.title}</td>
                          <td className="p-4 text-slate-600">{course.credits}.0</td>
                          <td className="p-4">
                            <span className={`inline-block font-extrabold text-xs px-2.5 py-1 rounded-md border ${getGradeBadge(course.grade)}`}>
                              {course.grade}
                            </span>
                          </td>
                          <td className="p-4 text-slate-600 font-mono">{course.points.toFixed(1)}</td>
                          <td className="p-4 text-right">
                            <span className="inline-flex items-center space-x-1 text-xs text-slate-500 font-medium">
                              {course.status === 'Completed' && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />}
                              <span>{course.status}</span>
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}