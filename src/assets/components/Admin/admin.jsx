import React, { useState } from 'react';
import { 
  Users, 
  BookOpen, 
  GraduationCap, 
  TrendingUp, 
  ShieldAlert, 
  Search, 
  Bell, 
  Plus, 
  MoreVertical, 
  Filter, 
  Settings, 
  BarChart2, 
  CheckCircle2, 
  XCircle,
  FileSpreadsheet,
  LogOut
} from 'lucide-react';

export default function Admin() {
  const [searchTerm, setSearchTerm] = useState('');

  // System Stats
  const stats = [
    { label: "Total Students", value: "2,845", change: "+12% this term", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Active Courses", value: "142", change: "4 pending approval", icon: BookOpen, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Faculty Members", value: "98", change: "95% active status", icon: GraduationCap, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "System Alerts", value: "3", change: "Requires attention", icon: ShieldAlert, color: "text-rose-600", bg: "bg-rose-50" }
  ];

  // Mock Recent Users / Students for MIS Management
  const recentUsers = [
    { id: "MIS-8942", name: "Alex Johnson", role: "Student", program: "BS MIS", status: "Active", gpa: "3.84" },
    { id: "FAC-1029", name: "Dr. Aris Thorne", role: "Faculty", program: "Computer Science", status: "Active", gpa: "N/A" },
    { id: "MIS-9021", name: "Samantha Reed", role: "Student", program: "BS MIS", status: "Pending", gpa: "3.42" },
    { id: "MIS-8811", name: "Michael Chang", role: "Student", program: "BS Info Tech", status: "Active", gpa: "2.95" },
    { id: "FAC-1102", name: "Prof. Sarah Jenkins", role: "Faculty", program: "Business Admin", status: "Inactive", gpa: "N/A" }
  ];

  return (
    <div className="min-h-screen bg-slate-100 font-sans flex text-slate-800">
      
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-slate-900 text-slate-300 hidden md:flex flex-col justify-between border-r border-slate-800">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-8">
            <div className="bg-indigo-600 text-white p-2 rounded-xl">
              <BarChart2 className="h-6 w-6" />
            </div>
            <div>
              <h1 className="font-bold text-white text-lg leading-none">EduPulse</h1>
              <span className="text-xs text-slate-400 font-medium">MIS Admin Console</span>
            </div>
          </div>

          <nav className="space-y-1">
            <a href="#" className="flex items-center space-x-3 bg-indigo-600/20 text-indigo-400 font-medium px-4 py-3 rounded-xl border border-indigo-500/30">
              <BarChart2 className="h-5 w-5" />
              <span>Overview</span>
            </a>
            <a href="#" className="flex items-center space-x-3 text-slate-400 hover:bg-slate-800 hover:text-slate-200 font-medium px-4 py-3 rounded-xl transition">
              <Users className="h-5 w-5" />
              <span>User Management</span>
            </a>
            <a href="#" className="flex items-center space-x-3 text-slate-400 hover:bg-slate-800 hover:text-slate-200 font-medium px-4 py-3 rounded-xl transition">
              <BookOpen className="h-5 w-5" />
              <span>Courses & Curricula</span>
            </a>
            <a href="#" className="flex items-center space-x-3 text-slate-400 hover:bg-slate-800 hover:text-slate-200 font-medium px-4 py-3 rounded-xl transition">
              <FileSpreadsheet className="h-5 w-5" />
              <span>Reports & Analytics</span>
            </a>
            <a href="#" className="flex items-center space-x-3 text-slate-400 hover:bg-slate-800 hover:text-slate-200 font-medium px-4 py-3 rounded-xl transition">
              <Settings className="h-5 w-5" />
              <span>System Settings</span>
            </a>
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center space-x-3 px-2 py-2">
            <div className="h-9 w-9 bg-indigo-600 text-white font-bold flex items-center justify-center rounded-full">
              AD
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-semibold text-white truncate">Admin User</p>
              <p className="text-xs text-slate-400 truncate">sysadmin@edupulse.edu</p>
            </div>
            <button className="text-slate-400 hover:text-rose-400 p-1">
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content View */}
      <div className="flex-1 flex flex-col min-w-0 overflow-auto">
        
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center space-x-4 flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search students, faculty, or IDs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 pl-9 pr-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-xl relative transition">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-rose-500 rounded-full"></span>
            </button>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm px-4 py-2 rounded-xl flex items-center space-x-2 transition shadow-sm">
              <Plus className="h-4 w-4" />
              <span>Add New User</span>
            </button>
          </div>
        </header>

        {/* Dashboard Area */}
        <main className="p-6 space-y-6 max-w-7xl mx-auto w-full">
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">System Administration Overview</h1>
              <p className="text-sm text-slate-500">Monitor academic performance, registration metrics, and portal activity.</p>
            </div>
            <div className="flex items-center space-x-2">
              <button className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-3.5 py-2 rounded-xl text-sm font-medium flex items-center space-x-2 shadow-sm">
                <Filter className="h-4 w-4 text-slate-400" />
                <span>Filter Term</span>
              </button>
              <button className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-3.5 py-2 rounded-xl text-sm font-medium flex items-center space-x-2 shadow-sm">
                <FileSpreadsheet className="h-4 w-4 text-slate-400" />
                <span>Export Audit</span>
              </button>
            </div>
          </div>

          {/* Metric Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, idx) => {
              const IconTag = stat.icon;
              return (
                <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{stat.label}</span>
                    <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.color}`}>
                      <IconTag className="h-5 w-5" />
                    </div>
                  </div>
                  <div>
                    <span className="text-3xl font-extrabold text-slate-900">{stat.value}</span>
                    <p className="text-xs text-slate-500 mt-1 font-medium">{stat.change}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Data Table Container */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-bold text-slate-900 text-base">User Directory & Management</h2>
                <p className="text-xs text-slate-500">Manage enrollment status and verify system privileges.</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs uppercase tracking-wider">
                    <th className="p-4 font-semibold">User Details</th>
                    <th className="p-4 font-semibold">Role</th>
                    <th className="p-4 font-semibold">Program/Dept</th>
                    <th className="p-4 font-semibold">GPA</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {recentUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50/80 transition">
                      <td className="p-4">
                        <div className="font-semibold text-slate-900">{user.name}</div>
                        <div className="text-xs text-slate-400 font-mono">{user.id}</div>
                      </td>
                      <td className="p-4">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-md ${
                          user.role === 'Faculty' ? 'bg-purple-50 text-purple-700' : 'bg-blue-50 text-blue-700'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="p-4 text-slate-600 font-medium">{user.program}</td>
                      <td className="p-4 text-slate-600 font-semibold">{user.gpa}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center space-x-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
                          user.status === 'Active' ? 'bg-emerald-50 text-emerald-700' :
                          user.status === 'Pending' ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {user.status === 'Active' && <CheckCircle2 className="h-3 w-3" />}
                          {user.status === 'Inactive' && <XCircle className="h-3 w-3" />}
                          <span>{user.status}</span>
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100">
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}