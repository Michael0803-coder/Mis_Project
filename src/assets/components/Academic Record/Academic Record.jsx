      import React, { useState, useMemo } from 'react';
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
        Sparkles,
        Users,
        Calendar,
        Clock,
        AlertTriangle,
        Plus,
        X,
        Eye,
        Edit,
        Trash2,
        Building,
        Mail,
        Phone,
        UserCheck,
        Check,
        XCircle,
        HelpCircle,
        LayoutDashboard,
        TrendingUp,
        FileText,
        MessageSquare,
        ShieldAlert,
        ChevronRight,
        UserPlus
      } from 'lucide-react';

      // Mock Data Store
      const INITIAL_STUDENTS = [
        {
          id: "STU-2024-001",
          name: "Alex Morgan",
          email: "a.morgan@university.edu",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250",
          department: "Management Information Systems",
          major: "B.S. Information Systems",
          year: "Senior",
          status: "Active",
          advisor: "Dr. Evelyn Reed",
          phone: "+1 (555) 234-5678",
          enrollmentDate: "2023-09-01",
          cgpa: 3.84,
          majorGpa: 3.92,
          creditsEarned: 84,
          totalRequired: 120,
          academicStanding: "Good Standing (Dean's List)",
          attendanceRate: 94.2
        },
        {
          id: "STU-2024-002",
          name: "Marcus Chen",
          email: "m.chen@university.edu",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250",
          department: "Computer Science",
          major: "B.S. Computer Science",
          year: "Junior",
          status: "Active",
          advisor: "Prof. Alan Turing",
          phone: "+1 (555) 876-5432",
          enrollmentDate: "2024-09-01",
          cgpa: 3.65,
          majorGpa: 3.75,
          creditsEarned: 60,
          totalRequired: 120,
          academicStanding: "Good Standing",
          attendanceRate: 81.5
        },
        {
          id: "STU-2024-003",
          name: "Sophia Rodriguez",
          email: "s.rodriguez@university.edu",
          avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250",
          department: "Business Administration",
          major: "B.B.A. Finance",
          year: "Sophomore",
          status: "On Leave",
          advisor: "Dr. Robert Vance",
          phone: "+1 (555) 345-6789",
          enrollmentDate: "2025-01-15",
          cgpa: 3.40,
          majorGpa: 3.50,
          creditsEarned: 32,
          totalRequired: 120,
          academicStanding: "Good Standing",
          attendanceRate: 78.0
        },
        {
          id: "STU-2024-004",
          name: "David Kim",
          email: "d.kim@university.edu",
          avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250",
          department: "Data Science",
          major: "B.S. Data Analytics",
          year: "Senior",
          status: "Graduated",
          advisor: "Dr. Clara Oswald",
          phone: "+1 (555) 901-2345",
          enrollmentDate: "2022-09-01",
          cgpa: 3.95,
          majorGpa: 4.00,
          creditsEarned: 120,
          totalRequired: 120,
          academicStanding: "High Honors",
          attendanceRate: 98.1
        }
      ];

      const INITIAL_ACADEMIC_TERMS = [
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

      const INITIAL_ATTENDANCE_RECORDS = [
        { id: 1, studentId: "STU-2024-001", studentName: "Alex Morgan", course: "MIS 310", date: "2026-10-12", status: "Present", remark: "On time" },
        { id: 2, studentId: "STU-2024-002", studentName: "Marcus Chen", course: "CS 205", date: "2026-10-12", status: "Late", remark: "15 mins delayed" },
        { id: 3, studentId: "STU-2024-003", studentName: "Sophia Rodriguez", course: "BUS 210", date: "2026-10-12", status: "Absent", remark: "Medical leave" },
        { id: 4, studentId: "STU-2024-001", studentName: "Alex Morgan", course: "MIS 420", date: "2026-10-11", status: "Present", remark: "Active participation" },
        { id: 5, studentId: "STU-2024-002", studentName: "Marcus Chen", course: "MIS 310", date: "2026-10-11", status: "Absent", remark: "Unexcused" },
        { id: 6, studentId: "STU-2024-004", studentName: "David Kim", course: "CS 205", date: "2026-10-10", status: "Present", remark: "On time" },
      ];

      const INITIAL_SERVICE_REQUESTS = [
        { id: "REQ-901", studentId: "STU-2024-001", studentName: "Alex Morgan", type: "Official Transcript Request", date: "2026-10-10", priority: "High", status: "Approved", notes: "Sent to Graduate Admissions" },
        { id: "REQ-902", studentId: "STU-2024-002", studentName: "Marcus Chen", type: "Financial Aid Appeal", date: "2026-10-11", priority: "Urgent", status: "Under Review", notes: "Awaiting tax document verification" },
        { id: "REQ-903", studentId: "STU-2024-003", studentName: "Sophia Rodriguez", type: "Housing Transfer Request", date: "2026-10-08", priority: "Medium", status: "Pending", notes: "Requested dorm reassignment" },
        { id: "REQ-904", studentId: "STU-2024-001", studentName: "Alex Morgan", type: "Advisor Appointment", date: "2026-10-05", priority: "Low", status: "Approved", notes: "Degree audit consultation" },
        { id: "REQ-905", studentId: "STU-2024-004", studentName: "David Kim", type: "Student ID Replacement", date: "2026-10-02", priority: "Low", status: "Completed", notes: "Card printed and dispatched" }
      ];

      export default function AcademicRecords() {
        const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'students' | 'academics' | 'attendance' | 'services'
        
        // App Dynamic State
        const [students, setStudents] = useState(INITIAL_STUDENTS);
        const [academicTerms, setAcademicTerms] = useState(INITIAL_ACADEMIC_TERMS);
        const [attendanceLogs, setAttendanceLogs] = useState(INITIAL_ATTENDANCE_RECORDS);
        const [serviceRequests, setServiceRequests] = useState(INITIAL_SERVICE_REQUESTS);

        // Selected Active Student Context (Defaulting to Alex Morgan)
        const [selectedStudent, setSelectedStudent] = useState(INITIAL_STUDENTS[0]);

        // Academic Records Filter State
        const [selectedTerm, setSelectedTerm] = useState('All');
        const [academicSearch, setAcademicSearch] = useState('');

        // Modals & Forms State
        const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
        const [isAddCourseOpen, setIsAddCourseOpen] = useState(false);
        const [isAddServiceReqOpen, setIsAddServiceReqOpen] = useState(false);
        const [isMarkAttendanceOpen, setIsMarkAttendanceOpen] = useState(false);
        const [selectedServiceReq, setSelectedServiceReq] = useState(null);

        // Form Fields State
        const [newStudent, setNewStudent] = useState({
          name: '', email: '', department: 'Computer Science', major: '', year: 'Freshman', status: 'Active', advisor: '', phone: ''
        });

        const [newCourse, setNewCourse] = useState({
          term: 'Fall 2026', code: '', title: '', credits: 3, grade: 'A', status: 'Enrolled'
        });

        const [newRequest, setNewRequest] = useState({
          type: 'Official Transcript Request', priority: 'Medium', notes: ''
        });

        const [newAttendance, setNewAttendance] = useState({
          studentId: INITIAL_STUDENTS[0].id, course: 'MIS 310', date: new Date().toISOString().split('T')[0], status: 'Present', remark: ''
        });

        const globalMetrics = useMemo(() => {
          const total = students.length;
          const avgGpa = (students.reduce((acc, curr) => acc + curr.cgpa, 0) / total).toFixed(2);
          const avgAttendance = (students.reduce((acc, curr) => acc + curr.attendanceRate, 0) / total).toFixed(1);
          const pendingRequests = serviceRequests.filter(r => r.status === 'Pending' || r.status === 'Under Review').length;
          const lowAttendanceCount = students.filter(s => s.attendanceRate < 85).length;
          return { total, avgGpa, avgAttendance, pendingRequests, lowAttendanceCount };
        }, [students, serviceRequests]);

        // Handle Add Student
        const handleAddStudent = (e) => {
          e.preventDefault();
          const createdStudent = {
            ...newStudent,
            id: `STU-2024-00${students.length + 1}`,
            avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250`,
            enrollmentDate: new Date().toISOString().split('T')[0],
            cgpa: 3.50,
            majorGpa: 3.60,
            creditsEarned: 15,
            totalRequired: 120,
            academicStanding: "Good Standing",
            attendanceRate: 92.0
          };
          setStudents([createdStudent, ...students]);
          setIsAddStudentOpen(false);
          setNewStudent({ name: '', email: '', department: 'Computer Science', major: '', year: 'Freshman', status: 'Active', advisor: '', phone: '' });
        };

        // Handle Add Course Record
        const handleAddCourse = (e) => {
          e.preventDefault();
          const pointMap = { 'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7, 'C+': 2.3, 'C': 2.0, 'P': 0.0 };
          const gradePoints = pointMap[newCourse.grade] || 3.0;

          const updatedTerms = academicTerms.map(termObj => {
            if (termObj.term === newCourse.term) {
              return {
                ...termObj,
                courses: [...termObj.courses, {
                  code: newCourse.code,
                  title: newCourse.title,
                  credits: Number(newCourse.credits),
                  grade: newCourse.grade,
                  points: gradePoints,
                  status: newCourse.status
                }]
              };
            }
            return termObj;
          });

          setAcademicTerms(updatedTerms);
          setIsAddCourseOpen(false);
          setNewCourse({ term: 'Fall 2026', code: '', title: '', credits: 3, grade: 'A', status: 'Enrolled' });
        };

        // Handle Add Service Request
        const handleAddServiceRequest = (e) => {
          e.preventDefault();
          const req = {
            id: `REQ-${Math.floor(100 + Math.random() * 900)}`,
            studentId: selectedStudent.id,
            studentName: selectedStudent.name,
            type: newRequest.type,
            date: new Date().toISOString().split('T')[0],
            priority: newRequest.priority,
            status: 'Pending',
            notes: newRequest.notes || 'No extra remarks'
          };
          setServiceRequests([req, ...serviceRequests]);
          setIsAddServiceReqOpen(false);
          setNewRequest({ type: 'Official Transcript Request', priority: 'Medium', notes: '' });
        };

        // Handle Add Attendance Log
        const handleMarkAttendance = (e) => {
          e.preventDefault();
          const stu = students.find(s => s.id === newAttendance.studentId);
          const log = {
            id: Date.now(),
            studentId: newAttendance.studentId,
            studentName: stu ? stu.name : 'Unknown Student',
            course: newAttendance.course,
            date: newAttendance.date,
            status: newAttendance.status,
            remark: newAttendance.remark || 'Direct entry'
          };
          setAttendanceLogs([log, ...attendanceLogs]);
          setIsMarkAttendanceOpen(false);
          setNewAttendance({ studentId: selectedStudent.id, course: 'MIS 310', date: new Date().toISOString().split('T')[0], status: 'Present', remark: '' });
        };

        // Badge utility functions
        const getGradeBadge = (grade) => {
          if (grade.startsWith('A')) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
          if (grade.startsWith('B')) return 'bg-blue-50 text-blue-700 border-blue-200';
          if (grade.startsWith('C')) return 'bg-amber-50 text-amber-700 border-amber-200';
          return 'bg-slate-100 text-slate-700 border-slate-200';
        };

        const getStatusBadge = (status) => {
          switch (status) {
            case 'Active':
            case 'Approved':
            case 'Completed':
            case 'Present':
              return 'bg-emerald-100 text-emerald-800 border-emerald-200';
            case 'Under Review':
            case 'Late':
            case 'On Leave':
              return 'bg-amber-100 text-amber-800 border-amber-200';
            case 'Pending':
            case 'Enrolled':
            case 'In Progress':
              return 'bg-indigo-100 text-indigo-800 border-indigo-200';
            case 'Absent':
            case 'Rejected':
              return 'bg-rose-100 text-rose-800 border-rose-200';
            default:
              return 'bg-slate-100 text-slate-700 border-slate-200';
          }
        };

        return (
          <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col lg:flex-row">
            
            {/* Sidebar Navigation */}
            <aside className="w-full lg:w-64 bg-slate-900 text-slate-300 flex-shrink-0 flex flex-col justify-between border-r border-slate-800">
              <div>
                {/* Brand Header */}
                <div className="p-5 flex items-center space-x-3 border-b border-slate-800">
                  <div className="bg-indigo-600 p-2.5 rounded-xl text-white shadow-lg shadow-indigo-500/30">
                    <GraduationCap className="h-6 w-6" />
                  </div>
                  <div>
                    <h1 className="font-extrabold text-white text-base leading-snug tracking-wide">EduData Central</h1>
                    <p className="text-[11px] text-slate-400 font-medium">Data Management System</p>
                  </div>
                </div>

                {/* Navigation Links */}
                <nav className="p-4 space-y-1.5">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`w-full flex items-center space-x-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition ${
                      activeTab === 'overview' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <LayoutDashboard className="h-5 w-5" />
                    <span>Dashboard Overview</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('students')}
                    className={`w-full flex items-center space-x-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition ${
                      activeTab === 'students' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <Users className="h-5 w-5" />
                    <span>Student Directory</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('academics')}
                    className={`w-full flex items-center space-x-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition ${
                      activeTab === 'academics' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <BookOpen className="h-5 w-5" />
                    <span>Academic Records</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('attendance')}
                    className={`w-full flex items-center space-x-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition ${
                      activeTab === 'attendance' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <Calendar className="h-5 w-5" />
                    <span>Attendance Tracking</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('services')}
                    className={`w-full flex items-center space-x-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition ${
                      activeTab === 'services' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <MessageSquare className="h-5 w-5" />
                    <span>Student Services</span>
                  </button>
                </nav>
              </div>

              {/* Active Context Profile Card */}
              <div className="p-4 border-t border-slate-800 bg-slate-900/50">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">Active Student Context</div>
                <div className="flex items-center space-x-3 bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/50">
                  <img src={selectedStudent.avatar} alt={selectedStudent.name} className="h-9 w-9 rounded-full object-cover border border-slate-600" />
                  <div className="overflow-hidden">
                    <div className="text-xs font-bold text-white truncate">{selectedStudent.name}</div>
                    <div className="text-[11px] text-indigo-400 font-mono truncate">{selectedStudent.id}</div>
                  </div>
                </div>
              </div>
            </aside>

            {/* Main Content View Container */}
            <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">

              {/* ========================================================================= */}
              {/* MODULE 0: OVERVIEW DASHBOARD                                               */}
              {/* ========================================================================= */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Institutional Dashboard</h1>
                      <p className="text-sm text-slate-500">Real-time overview of academic performance, attendance metrics, and pending requests.</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button onClick={() => setIsAddStudentOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl flex items-center space-x-2 shadow-sm shadow-indigo-600/20 transition">
                        <UserPlus className="h-4 w-4" />
                        <span>New Student</span>
                      </button>
                    </div>
                  </div>

                  {/* Metric KPI Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                      <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Enrolled</p>
                        <p className="text-3xl font-black text-slate-900 mt-1">{globalMetrics.total}</p>
                        <p className="text-xs text-emerald-600 font-medium mt-1 flex items-center">
                          <TrendingUp className="h-3 w-3 mr-1" /> +12% from last term
                        </p>
                      </div>
                      <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                        <Users className="h-6 w-6" />
                      </div>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                      <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Average CGPA</p>
                        <p className="text-3xl font-black text-slate-900 mt-1">{globalMetrics.avgGpa}</p>
                        <p className="text-xs text-indigo-600 font-medium mt-1">Across all departments</p>
                      </div>
                      <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
                        <Award className="h-6 w-6" />
                      </div>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                      <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Avg Attendance</p>
                        <p className="text-3xl font-black text-slate-900 mt-1">{globalMetrics.avgAttendance}%</p>
                        <p className="text-xs text-rose-500 font-medium mt-1">{globalMetrics.lowAttendanceCount} students at risk</p>
                      </div>
                      <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                        <UserCheck className="h-6 w-6" />
                      </div>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                      <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Open Services</p>
                        <p className="text-3xl font-black text-slate-900 mt-1">{globalMetrics.pendingRequests}</p>
                        <p className="text-xs text-slate-500 font-medium mt-1">Requests requiring action</p>
                      </div>
                      <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl">
                        <MessageSquare className="h-6 w-6" />
                      </div>
                    </div>
                  </div>

                  {/* Quick Overview Layout Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Quick Student Selection */}
                    <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-extrabold text-slate-900 text-lg">Top Student Profiles</h3>
                        <button onClick={() => setActiveTab('students')} className="text-xs font-bold text-indigo-600 hover:underline flex items-center">
                          View All Directory <ChevronRight className="h-3.5 w-3.5 ml-0.5" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {students.map((stu) => (
                          <div 
                            key={stu.id}
                            onClick={() => setSelectedStudent(stu)}
                            className={`p-4 rounded-xl border transition cursor-pointer flex items-center space-x-4 ${
                              selectedStudent.id === stu.id ? 'border-indigo-500 bg-indigo-50/30 shadow-sm' : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                            }`}
                          >
                            <img src={stu.avatar} alt={stu.name} className="h-12 w-12 rounded-full object-cover border border-slate-200" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h4 className="text-sm font-bold text-slate-900 truncate">{stu.name}</h4>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusBadge(stu.status)}`}>
                                  {stu.status}
                                </span>
                              </div>
                              <p className="text-xs text-slate-500 truncate">{stu.major}</p>
                              <div className="mt-2 flex items-center space-x-3 text-[11px] font-medium text-slate-600">
                                <span>GPA: <strong className="text-slate-900">{stu.cgpa}</strong></span>
                                <span>•</span>
                                <span>Att: <strong className="text-slate-900">{stu.attendanceRate}%</strong></span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Attendance Risk Alert Panel */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center space-x-2 text-rose-600 mb-2">
                          <ShieldAlert className="h-5 w-5" />
                          <h3 className="font-extrabold text-slate-900 text-lg">Attendance Risk Alerts</h3>
                        </div>
                        <p className="text-xs text-slate-500 mb-4">Students falling below the mandatory 85% attendance threshold.</p>
                        
                        <div className="space-y-3">
                          {students.filter(s => s.attendanceRate < 85).map(s => (
                            <div key={s.id} className="p-3 bg-rose-50 border border-rose-100 rounded-xl flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <img src={s.avatar} alt={s.name} className="h-8 w-8 rounded-full object-cover" />
                                <div>
                                  <div className="text-xs font-bold text-slate-900">{s.name}</div>
                                  <div className="text-[10px] text-rose-700 font-semibold">{s.attendanceRate}% Attendance</div>
                                </div>
                              </div>
                              <button 
                                onClick={() => { setSelectedStudent(s); setActiveTab('attendance'); }}
                                className="text-xs font-bold bg-white text-rose-700 px-2.5 py-1 rounded-lg border border-rose-200 hover:bg-rose-100"
                              >
                                Review
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-100">
                        <button onClick={() => setIsAddServiceReqOpen(true)} className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2.5 rounded-xl flex items-center justify-center space-x-2">
                          <Plus className="h-4 w-4" />
                          <span>Create Academic Intervention Ticket</span>
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* ========================================================================= */}
              {/* MODULE 1: STUDENT PROFILES MANAGEMENT                                      */}
              {/* ========================================================================= */}
              {activeTab === 'students' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Student Directory & Profiles</h1>
                      <p className="text-sm text-slate-500">Manage master student enrollment, contact information, and academic statuses.</p>
                    </div>
                    <button onClick={() => setIsAddStudentOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl flex items-center space-x-2 shadow-sm shadow-indigo-600/20 transition">
                      <UserPlus className="h-4 w-4" />
                      <span>Add Student Record</span>
                    </button>
                  </div>

                  {/* Search & Filter Bar */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="relative w-full sm:w-80">
                      <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                      <input 
                        type="text" 
                        placeholder="Search student name, ID, or major..." 
                        className="w-full bg-slate-50 border border-slate-200 pl-9 pr-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                      />
                    </div>

                    <div className="flex items-center space-x-3 w-full sm:w-auto">
                      <Filter className="h-4 w-4 text-slate-400 hidden sm:block" />
                      <select className="bg-slate-50 border border-slate-200 text-slate-700 text-sm font-medium rounded-xl px-3 py-2 w-full sm:w-auto">
                        <option value="All">All Departments</option>
                        <option value="MIS">Management Information Systems</option>
                        <option value="CS">Computer Science</option>
                        <option value="BUS">Business Administration</option>
                      </select>
                    </div>
                  </div>

                  {/* Directory Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                    {students.map((stu) => (
                      <div key={stu.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-4">
                            <img src={stu.avatar} alt={stu.name} className="h-16 w-16 rounded-2xl object-cover border-2 border-slate-100 shadow-sm" />
                            <div>
                              <div className="flex items-center space-x-2">
                                <h3 className="text-lg font-bold text-slate-900">{stu.name}</h3>
                                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${getStatusBadge(stu.status)}`}>
                                  {stu.status}
                                </span>
                              </div>
                              <p className="text-xs font-mono text-indigo-600 font-semibold">{stu.id}</p>
                              <p className="text-xs text-slate-500 mt-0.5">{stu.department}</p>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                          <div>
                            <span className="text-slate-400 font-medium block">Degree Major:</span>
                            <span className="font-semibold text-slate-800">{stu.major}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 font-medium block">Academic Year:</span>
                            <span className="font-semibold text-slate-800">{stu.year}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 font-medium block">Faculty Advisor:</span>
                            <span className="font-semibold text-slate-800">{stu.advisor}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 font-medium block">Contact Email:</span>
                            <span className="font-semibold text-slate-800 truncate block">{stu.email}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center space-x-4 text-xs font-semibold">
                            <div className="text-slate-600">GPA: <span className="text-slate-900 font-bold">{stu.cgpa}</span></div>
                            <div className="text-slate-600">Credits: <span className="text-slate-900 font-bold">{stu.creditsEarned}</span></div>
                          </div>
                          <button 
                            onClick={() => { setSelectedStudent(stu); setActiveTab('academics'); }}
                            className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-2 rounded-xl transition flex items-center space-x-1"
                          >
                            <span>View Full Record</span>
                            <ArrowUpRight className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ========================================================================= */}
              {/* MODULE 2: ACADEMIC RECORDS & TRANSCRIPTS (Preserved & Expanded)           */}
              {/* ========================================================================= */}
              {activeTab === 'academics' && (
                <div className="space-y-8">
                  
                  {/* Header Title & Actions */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <div className="flex items-center space-x-2 text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1">
                        <GraduationCap className="h-4 w-4" />
                        <span>Student Academic Portal • {selectedStudent.name}</span>
                      </div>
                      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Academic Transcript & Records</h1>
                      <p className="text-sm text-slate-500">Official course grade history, cumulative GPA calculations, and credit progress.</p>
                    </div>

                    <div className="flex items-center space-x-3">
                      <button 
                        onClick={() => setIsAddCourseOpen(true)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm px-4 py-2.5 rounded-xl flex items-center space-x-2 transition shadow-sm"
                      >
                        <Plus className="h-4 w-4" />
                        <span>Add Course Entry</span>
                      </button>
                      <button 
                        onClick={() => window.print()}
                        className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 font-medium text-sm px-4 py-2.5 rounded-xl flex items-center space-x-2 transition shadow-sm"
                      >
                        <Printer className="h-4 w-4 text-slate-500" />
                        <span className="hidden sm:inline">Print Page</span>
                      </button>
                      <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm px-4 py-2.5 rounded-xl flex items-center space-x-2 transition shadow-sm shadow-indigo-600/20">
                        <Download className="h-4 w-4" />
                        <span className="hidden sm:inline">Download Official PDF</span>
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
                        <span className="text-3xl font-black text-slate-900">{selectedStudent.cgpa}</span>
                        <span className="text-xs text-slate-400 font-medium">/ 4.00</span>
                      </div>
                      <span className="inline-block text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/50">
                        {selectedStudent.academicStanding}
                      </span>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                      <div className="flex items-center justify-between text-slate-500">
                        <span className="text-xs font-semibold uppercase tracking-wider">Major GPA</span>
                        <Sparkles className="h-5 w-5 text-amber-500" />
                      </div>
                      <div className="flex items-baseline space-x-2">
                        <span className="text-3xl font-black text-slate-900">{selectedStudent.majorGpa}</span>
                        <span className="text-xs text-slate-400 font-medium">/ 4.00</span>
                      </div>
                      <p className="text-xs text-slate-500">Based on core major courses</p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                      <div className="flex items-center justify-between text-slate-500">
                        <span className="text-xs font-semibold uppercase tracking-wider">Credits Earned</span>
                        <BookOpen className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex items-baseline space-x-2">
                        <span className="text-3xl font-black text-slate-900">{selectedStudent.creditsEarned}</span>
                        <span className="text-xs text-slate-400 font-medium">/ {selectedStudent.totalRequired} Total</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div 
                          className="bg-indigo-600 h-full rounded-full" 
                          style={{ width: `${(selectedStudent.creditsEarned / selectedStudent.totalRequired) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                      <div className="flex items-center justify-between text-slate-500">
                        <span className="text-xs font-semibold uppercase tracking-wider">Degree Status</span>
                        <FileCheck className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div className="text-lg font-bold text-slate-900">{selectedStudent.year} Year</div>
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
                        value={academicSearch}
                        onChange={(e) => setAcademicSearch(e.target.value)}
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
                    {academicTerms
                      .filter(t => selectedTerm === 'All' || t.term === selectedTerm)
                      .map((termBlock, idx) => {
                        const coursesToShow = termBlock.courses.filter(c => 
                          c.code.toLowerCase().includes(academicSearch.toLowerCase()) ||
                          c.title.toLowerCase().includes(academicSearch.toLowerCase())
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
              )}

              {/* ========================================================================= */}
              {/* MODULE 3: ATTENDANCE TRACKING & ANALYTICS                                  */}
              {/* ========================================================================= */}
              {activeTab === 'attendance' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Attendance Analytics</h1>
                      <p className="text-sm text-slate-500">Track student course presence, late check-ins, and automated risk warnings.</p>
                    </div>
                    <button onClick={() => setIsMarkAttendanceOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl flex items-center space-x-2 shadow-sm shadow-indigo-600/20 transition">
                      <UserCheck className="h-4 w-4" />
                      <span>Mark New Attendance</span>
                    </button>
                  </div>

                  {/* Attendance Analytics Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    {/* Individual Student Heatmap Box */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-extrabold text-slate-900 text-base">Student Overall Presence</h3>
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                          {selectedStudent.attendanceRate}% Rate
                        </span>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-xs font-medium text-slate-600 mb-1">
                            <span>Present (Present / Late)</span>
                            <span className="font-bold text-slate-900">92%</span>
                          </div>
                          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div className="bg-emerald-500 h-full rounded-full" style={{ width: '92%' }}></div>
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-xs font-medium text-slate-600 mb-1">
                            <span>Unexcused Absences</span>
                            <span className="font-bold text-slate-900">8%</span>
                          </div>
                          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div className="bg-rose-500 h-full rounded-full" style={{ width: '8%' }}></div>
                          </div>
                        </div>
                      </div>

                      {/* Heatmap Visual Matrix Mock */}
                      <div className="pt-2">
                        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">30-Day Presence Activity Heatmap</div>
                        <div className="grid grid-cols-7 gap-1.5">
                          {Array.from({ length: 28 }).map((_, i) => {
                            const isAbsent = i === 5 || i === 18;
                            const isLate = i === 12;
                            return (
                              <div 
                                key={i} 
                                title={`Day ${i+1}`}
                                className={`h-7 rounded-md flex items-center justify-center text-[10px] font-bold ${
                                  isAbsent ? 'bg-rose-100 text-rose-700 border border-rose-200' :
                                  isLate ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                                  'bg-emerald-100 text-emerald-700 border border-emerald-200'
                                }`}
                              >
                                {i+1}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Attendance Log Table */}
                    <div className="md:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between">
                      <div>
                        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                          <h3 className="font-extrabold text-slate-900 text-base">Recent Attendance Entry Logs</h3>
                          <span className="text-xs text-slate-400 font-medium">Real-time status updates</span>
                        </div>

                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="border-b border-slate-100 text-slate-400 text-[11px] uppercase tracking-wider bg-slate-50">
                                <th className="p-3.5 font-semibold">Student Name</th>
                                <th className="p-3.5 font-semibold">Course Code</th>
                                <th className="p-3.5 font-semibold">Date</th>
                                <th className="p-3.5 font-semibold">Status</th>
                                <th className="p-3.5 font-semibold">Remarks</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-xs">
                              {attendanceLogs.map((log) => (
                                <tr key={log.id} className="hover:bg-slate-50/80 transition">
                                  <td className="p-3.5 font-bold text-slate-900">{log.studentName}</td>
                                  <td className="p-3.5 font-mono text-indigo-600 font-semibold">{log.course}</td>
                                  <td className="p-3.5 text-slate-600">{log.date}</td>
                                  <td className="p-3.5">
                                    <span className={`inline-block font-extrabold text-[10px] px-2 py-0.5 rounded-full border ${getStatusBadge(log.status)}`}>
                                      {log.status}
                                    </span>
                                  </td>
                                  <td className="p-3.5 text-slate-500 italic">{log.remark}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* ========================================================================= */}
              {/* MODULE 4: STUDENT SERVICES & TICKETS MANAGEMENT                          */}
              {/* ========================================================================= */}
              {activeTab === 'services' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Student Services & Service Tickets</h1>
                      <p className="text-sm text-slate-500">Track and fulfill official administrative requests, advisor appointments, and financial aid appeals.</p>
                    </div>
                    <button onClick={() => setIsAddServiceReqOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl flex items-center space-x-2 shadow-sm shadow-indigo-600/20 transition">
                      <Plus className="h-4 w-4" />
                      <span>Submit New Request</span>
                    </button>
                  </div>

                  {/* Service Ticket Table */}
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-slate-100 text-slate-400 text-[11px] uppercase tracking-wider bg-slate-50">
                            <th className="p-4 font-semibold">Ticket ID</th>
                            <th className="p-4 font-semibold">Student</th>
                            <th className="p-4 font-semibold">Request Type</th>
                            <th className="p-4 font-semibold">Submission Date</th>
                            <th className="p-4 font-semibold">Priority</th>
                            <th className="p-4 font-semibold">Status</th>
                            <th className="p-4 font-semibold text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm">
                          {serviceRequests.map((req) => (
                            <tr key={req.id} className="hover:bg-slate-50/80 transition">
                              <td className="p-4 font-mono font-bold text-slate-900">{req.id}</td>
                              <td className="p-4 font-semibold text-slate-800">{req.studentName}</td>
                              <td className="p-4 text-slate-700 font-medium">{req.type}</td>
                              <td className="p-4 text-slate-500 text-xs">{req.date}</td>
                              <td className="p-4">
                                <span className={`text-xs font-bold ${
                                  req.priority === 'Urgent' ? 'text-rose-600' :
                                  req.priority === 'High' ? 'text-amber-600' : 'text-slate-600'
                                }`}>
                                  {req.priority}
                                </span>
                              </td>
                              <td className="p-4">
                                <span className={`inline-block font-extrabold text-xs px-2.5 py-0.5 rounded-full border ${getStatusBadge(req.status)}`}>
                                  {req.status}
                                </span>
                              </td>
                              <td className="p-4 text-right">
                                <button 
                                  onClick={() => setSelectedServiceReq(req)}
                                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-lg transition"
                                >
                                  Manage Ticket
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

            </main>

            {/* ========================================================================= */}
            {/* INTERACTIVE MODALS                                                         */}
            {/* ========================================================================= */}

            {/* Modal 1: Add New Student */}
            {isAddStudentOpen && (
              <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-lg font-bold text-slate-900">Register New Student Profile</h3>
                    <button onClick={() => setIsAddStudentOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="h-5 w-5" /></button>
                  </div>
                  <form onSubmit={handleAddStudent} className="space-y-4 text-xs">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Full Student Name</label>
                      <input 
                        type="text" required placeholder="e.g. Eleanor Vance" 
                        value={newStudent.name} onChange={(e) => setNewStudent({...newStudent, name: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20" 
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Email Address</label>
                        <input 
                          type="email" required placeholder="e.vance@university.edu" 
                          value={newStudent.email} onChange={(e) => setNewStudent({...newStudent, email: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20" 
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Academic Year</label>
                        <select 
                          value={newStudent.year} onChange={(e) => setNewStudent({...newStudent, year: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl font-medium"
                        >
                          <option value="Freshman">Freshman</option>
                          <option value="Sophomore">Sophomore</option>
                          <option value="Junior">Junior</option>
                          <option value="Senior">Senior</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Department</label>
                        <input 
                          type="text" required placeholder="Computer Science" 
                          value={newStudent.department} onChange={(e) => setNewStudent({...newStudent, department: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl font-medium" 
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Assigned Faculty Advisor</label>
                        <input 
                          type="text" required placeholder="Dr. Evelyn Reed" 
                          value={newStudent.advisor} onChange={(e) => setNewStudent({...newStudent, advisor: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl font-medium" 
                        />
                      </div>
                    </div>
                    <div className="pt-3 flex items-center justify-end space-x-3 border-t border-slate-100">
                      <button type="button" onClick={() => setIsAddStudentOpen(false)} className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-xl">Cancel</button>
                      <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md shadow-indigo-600/20">Save Student Record</button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Modal 2: Add Course Entry */}
            {isAddCourseOpen && (
              <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-lg font-bold text-slate-900">Add Academic Course Entry</h3>
                    <button onClick={() => setIsAddCourseOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="h-5 w-5" /></button>
                  </div>
                  <form onSubmit={handleAddCourse} className="space-y-4 text-xs">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Target Academic Term</label>
                      <select 
                        value={newCourse.term} onChange={(e) => setNewCourse({...newCourse, term: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl font-medium"
                      >
                        <option value="Fall 2026">Fall 2026</option>
                        <option value="Spring 2026">Spring 2026</option>
                        <option value="Fall 2025">Fall 2025</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Course Code</label>
                        <input 
                          type="text" required placeholder="e.g. MIS 350" 
                          value={newCourse.code} onChange={(e) => setNewCourse({...newCourse, code: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl font-medium" 
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Credits</label>
                        <input 
                          type="number" min="1" max="6" required 
                          value={newCourse.credits} onChange={(e) => setNewCourse({...newCourse, credits: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl font-medium" 
                        />
                      </div>
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Course Title</label>
                      <input 
                        type="text" required placeholder="e.g. Cloud Computing Systems" 
                        value={newCourse.title} onChange={(e) => setNewCourse({...newCourse, title: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl font-medium" 
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Earned Grade</label>
                        <select 
                          value={newCourse.grade} onChange={(e) => setNewCourse({...newCourse, grade: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl font-medium"
                        >
                          <option value="A">A (4.0)</option>
                          <option value="A-">A- (3.7)</option>
                          <option value="B+">B+ (3.3)</option>
                          <option value="B">B (3.0)</option>
                          <option value="C+">C+ (2.3)</option>
                        </select>
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Course Status</label>
                        <select 
                          value={newCourse.status} onChange={(e) => setNewCourse({...newCourse, status: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl font-medium"
                        >
                          <option value="Enrolled">Enrolled</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </div>
                    </div>
                    <div className="pt-3 flex items-center justify-end space-x-3 border-t border-slate-100">
                      <button type="button" onClick={() => setIsAddCourseOpen(false)} className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-xl">Cancel</button>
                      <button type="submit" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md shadow-emerald-600/20">Append Course Entry</button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Modal 3: Add Service Request */}
            {isAddServiceReqOpen && (
              <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-lg font-bold text-slate-900">Submit Service Ticket</h3>
                    <button onClick={() => setIsAddServiceReqOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="h-5 w-5" /></button>
                  </div>
                  <form onSubmit={handleAddServiceRequest} className="space-y-4 text-xs">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Student Context</label>
                      <input type="text" disabled value={`${selectedStudent.name} (${selectedStudent.id})`} className="w-full bg-slate-100 border border-slate-200 p-2.5 rounded-xl font-semibold text-slate-600" />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Service Request Category</label>
                      <select 
                        value={newRequest.type} onChange={(e) => setNewRequest({...newRequest, type: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl font-medium"
                      >
                        <option value="Official Transcript Request">Official Transcript Request</option>
                        <option value="Financial Aid Appeal">Financial Aid Appeal</option>
                        <option value="Housing Transfer Request">Housing Transfer Request</option>
                        <option value="Advisor Appointment">Advisor Appointment</option>
                        <option value="Student ID Replacement">Student ID Replacement</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Priority Level</label>
                      <select 
                        value={newRequest.priority} onChange={(e) => setNewRequest({...newRequest, priority: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl font-medium"
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Urgent">Urgent</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Notes / Reason</label>
                      <textarea 
                        rows="3" placeholder="Provide details regarding this request..."
                        value={newRequest.notes} onChange={(e) => setNewRequest({...newRequest, notes: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl font-medium"
                      ></textarea>
                    </div>
                    <div className="pt-3 flex items-center justify-end space-x-3 border-t border-slate-100">
                      <button type="button" onClick={() => setIsAddServiceReqOpen(false)} className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-xl">Cancel</button>
                      <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md shadow-indigo-600/20">Submit Request</button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Modal 4: Mark Attendance Entry */}
            {isMarkAttendanceOpen && (
              <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-lg font-bold text-slate-900">Mark Attendance Entry</h3>
                    <button onClick={() => setIsMarkAttendanceOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="h-5 w-5" /></button>
                  </div>
                  <form onSubmit={handleMarkAttendance} className="space-y-4 text-xs">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Select Student</label>
                      <select 
                        value={newAttendance.studentId} onChange={(e) => setNewAttendance({...newAttendance, studentId: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl font-medium"
                      >
                        {students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.id})</option>)}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Course Code</label>
                        <input 
                          type="text" required value={newAttendance.course} onChange={(e) => setNewAttendance({...newAttendance, course: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl font-medium" 
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Status</label>
                        <select 
                          value={newAttendance.status} onChange={(e) => setNewAttendance({...newAttendance, status: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl font-medium"
                        >
                          <option value="Present">Present</option>
                          <option value="Late">Late</option>
                          <option value="Absent">Absent</option>
                          <option value="Excused">Excused</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Remarks / Justification</label>
                      <input 
                        type="text" placeholder="e.g. Arrived 10 mins late" 
                        value={newAttendance.remark} onChange={(e) => setNewAttendance({...newAttendance, remark: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl font-medium" 
                      />
                    </div>
                    <div className="pt-3 flex items-center justify-end space-x-3 border-t border-slate-100">
                      <button type="button" onClick={() => setIsMarkAttendanceOpen(false)} className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-xl">Cancel</button>
                      <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md shadow-indigo-600/20">Log Entry</button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Service Request Action Modal */}
            {selectedServiceReq && (
              <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-base font-bold text-slate-900">Manage Service Ticket {selectedServiceReq.id}</h3>
                    <button onClick={() => setSelectedServiceReq(null)} className="text-slate-400 hover:text-slate-600"><X className="h-5 w-5" /></button>
                  </div>
                  <div className="space-y-2 text-xs">
                    <p><strong>Student:</strong> {selectedServiceReq.studentName}</p>
                    <p><strong>Category:</strong> {selectedServiceReq.type}</p>
                    <p><strong>Remarks:</strong> {selectedServiceReq.notes}</p>
                  </div>
                  <div className="pt-3 space-y-2">
                    <p className="text-xs font-bold text-slate-700">Update Ticket Status:</p>
                    <div className="grid grid-cols-2 gap-2">
                      {['Pending', 'Under Review', 'Approved', 'Rejected'].map((statusOption) => (
                        <button
                          key={statusOption}
                          onClick={() => {
                            setServiceRequests(serviceRequests.map(r => r.id === selectedServiceReq.id ? { ...r, status: statusOption } : r));
                            setSelectedServiceReq(null);
                          }}
                          className={`p-2 rounded-xl text-xs font-bold border transition ${
                            selectedServiceReq.status === statusOption ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                          }`}
                        >
                          {statusOption}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        );
      }