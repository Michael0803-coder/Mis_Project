import React, { useState } from 'react';
import { 
  BookOpen, 
  GraduationCap, 
  Calendar, 
  Clock, 
  CheckCircle, 
  FileText, 
  Bell, 
  User, 
  LogOut, 
  ChevronRight, 
  TrendingUp,
  AlertCircle
} from 'lucide-react';

export default function StudentLandingPage() {
  // Mock student data (In a real MIS, this comes from an API/database)
  const [student] = useState({
    name: "Alex Johnson",
    studentId: "MIS-2026-8942",
    program: "B.S. Management Information Systems",
    gpa: "3.84",
    creditsCompleted: 84,
    totalCredits: 120,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256"
  });

  const courses = [
    { code: "MIS 310", name: "Database Management Systems", instructor: "Dr. Aris Thorne", room: "Tech Hall 302", time: "MWF 10:00 - 11:30 AM", progress: 75 },
    { code: "MIS 420", name: "Systems Analysis & Design", instructor: "Prof. Sarah Jenkins", room: "Lab B-12", time: "TTh 01:00 - 02:30 PM", progress: 60 },
    { code: "CS 205", name: "Web Application Development", instructor: "Dr. Marcus Vance", room: "Online / Sync", time: "MWF 02:00 - 03:30 PM", progress: 88 },
    { code: "BUS 210", name: "Business Analytics", instructor: "Prof. Elena Rostova", room: "Business Bldg 104", time: "TTh 09:00 - 10:30 AM", progress: 45 }
  ];

  const upcomingDeadlines = [
    { id: 1, title: "Database ERD Project Submission", course: "MIS 310", dueDate: "Tomorrow, 11:59 PM", priority: "High" },
    { id: 2, title: "Sprint 2 Code Review", course: "CS 205", dueDate: "Oct 12, 05:00 PM", priority: "Medium" },
    { id: 3, title: "System Feasibility Report", course: "MIS 420", dueDate: "Oct 15, 11:59 PM", priority: "Low" }
  ];

  const announcements = [
    { id: 1, title: "Midterm Examination Schedule Published", date: "Oct 08, 2026", category: "Academic" },
    { id: 2, title: "Campus-wide Hackathon Registration Open", date: "Oct 05, 2026", category: "Event" }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      
      {/* Top Navigation Bar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-indigo-600 text-white p-2 rounded-lg">
                <GraduationCap className="h-6 w-6" />
              </div>
              <span className="font-bold text-xl text-slate-900 tracking-tight">EduPulse <span className="text-indigo-600 text-sm font-normal">MIS Portal</span></span>
            </div>

            <div className="flex items-center space-x-4">
              <button className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-full relative transition">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-rose-500 rounded-full"></span>
              </button>
              <div className="h-6 w-px bg-slate-200"></div>
              <div className="flex items-center space-x-3">
                <img className="h-9 w-9 rounded-full object-cover border border-slate-200" src={student.avatar} alt={student.name} />
                <div className="hidden md:block text-left">
                  <p className="text-sm font-semibold text-slate-900 leading-none">{student.name}</p>
                  <p className="text-xs text-slate-500 mt-1">{student.studentId}</p>
                </div>
              </div>
              <button className="text-slate-400 hover:text-rose-600 p-2 rounded-lg hover:bg-rose-50 transition">
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
          <div className="md:flex md:items-center md:justify-between">
            <div className="space-y-2">
              <span className="inline-block px-3 py-1 bg-indigo-500/30 text-indigo-200 rounded-full text-xs font-medium backdrop-blur-md border border-indigo-400/20">
                Fall Semester 2026
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Welcome back, {student.name}! 👋</h1>
              <p className="text-indigo-200 text-sm">{student.program}</p>
            </div>
            <div className="mt-6 md:mt-0 flex items-center space-x-3">
              <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition shadow-lg shadow-indigo-600/30 flex items-center space-x-2">
                <FileText className="h-4 w-4" />
                <span>View Transcript</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Academic Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Cumulative GPA</p>
              <p className="text-2xl font-bold text-slate-900">{student.gpa}</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <BookOpen className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Active Courses</p>
              <p className="text-2xl font-bold text-slate-900">{courses.length}</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
              <CheckCircle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Degree Progress</p>
              <p className="text-2xl font-bold text-slate-900">
                {Math.round((student.creditsCompleted / student.totalCredits) * 100)}%
              </p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Credits Earned</p>
              <p className="text-2xl font-bold text-slate-900">{student.creditsCompleted} / {student.totalCredits}</p>
            </div>
          </div>
        </div>

        {/* Content Section: Enrolled Courses & Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Column: Active Courses (2/3 width) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-900">Enrolled Courses</h2>
              <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center space-x-1">
                <span>Course Catalog</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {courses.map((course, idx) => (
                <div key={idx} className="bg-white border border-slate-200 rounded-xl p-5 hover:border-indigo-300 transition shadow-sm">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
                        {course.code}
                      </span>
                      <h3 className="font-bold text-slate-900 text-base mt-2">{course.name}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">{course.instructor}</p>
                    </div>
                    <span className="text-xs text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md font-medium">
                      {course.room}
                    </span>
                  </div>

                  <div className="flex items-center text-xs text-slate-500 space-x-4 mb-4">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3.5 w-3.5 text-slate-400" />
                      <span>{course.time}</span>
                    </div>
                  </div>

                  {/* Course Progress */}
                  <div>
                    <div className="flex justify-between text-xs font-medium mb-1.5">
                      <span className="text-slate-500">Course Completion</span>
                      <span className="text-slate-700 font-semibold">{course.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-indigo-600 h-full rounded-full transition-all duration-500" style={{ width: `${course.progress}%` }}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Deadlines & System Announcements (1/3 width) */}
          <div className="space-y-6">
            
            {/* Upcoming Deadlines */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h2 className="font-bold text-slate-900 flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-amber-500" />
                  <span>Upcoming Deadlines</span>
                </h2>
              </div>
              <div className="space-y-3">
                {upcomingDeadlines.map((item) => (
                  <div key={item.id} className="p-3 bg-slate-50 border border-slate-100 rounded-lg hover:bg-slate-100/80 transition">
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-semibold text-slate-500">{item.course}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        item.priority === 'High' ? 'bg-rose-100 text-rose-700' :
                        item.priority === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-slate-200 text-slate-600'
                      }`}>
                        {item.priority}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-slate-800 mt-1">{item.title}</p>
                    <p className="text-xs text-slate-500 mt-2 flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{item.dueDate}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* System Announcements */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="font-bold text-slate-900">System Announcements</h2>
              </div>
              <div className="space-y-3">
                {announcements.map((note) => (
                  <div key={note.id} className="space-y-1">
                    <div className="flex justify-between items-center text-xs text-slate-400">
                      <span>{note.category}</span>
                      <span>{note.date}</span>
                    </div>
                    <p className="text-sm font-medium text-slate-700 hover:text-indigo-600 cursor-pointer transition">
                      {note.title}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

      </main>
    </div>
  );
}