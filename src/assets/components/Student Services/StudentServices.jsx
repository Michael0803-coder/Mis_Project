import React, { useState } from 'react';
import { 
  Headphones, 
  HelpCircle, 
  Search, 
  Calendar, 
  DollarSign, 
  BookOpen, 
  HeartHandshake, 
  FileText, 
  ChevronRight, 
  Send, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight,
  ShieldCheck,
  UserCheck
} from 'lucide-react';

export default function StudentServices() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [openFaq, setOpenFaq] = useState(null);
  const [ticketSubmitted, setTicketSubmitted] = useState(false);

  // Form State
  const [ticket, setTicket] = useState({
    serviceType: 'IT Support',
    subject: '',
    description: '',
    urgency: 'Medium'
  });

  const categories = [
    { name: 'All', icon: BookOpen },
    { name: 'Academic Advising', icon: UserCheck },
    { name: 'IT & LMS Support', icon: Headphones },
    { name: 'Financial Aid', icon: DollarSign },
    { name: 'Registrar', icon: FileText },
    { name: 'Career Services', icon: HeartHandshake }
  ];

  const servicesList = [
    {
      id: 1,
      title: "Schedule Academic Advising",
      category: "Academic Advising",
      description: "Book 1-on-1 sessions with your assigned MIS advisor to plan course pathways, track graduation progress, or discuss academic standing.",
      actionText: "Book Appointment",
      turnaround: "Same-week availability",
      badge: "Popular"
    },
    {
      id: 2,
      title: "Password & Account Recovery",
      category: "IT & LMS Support",
      description: "Reset your university SSO portal, Canvas LMS, or campus Wi-Fi credentials instantly.",
      actionText: "Reset Credentials",
      turnaround: "Instant Automated",
      badge: "24/7 Self-Service"
    },
    {
      id: 3,
      title: "FAFSA & Scholarship Status",
      category: "Financial Aid",
      description: "Track federal loan disbursemets, departmental MIS merit scholarships, and submit additional financial verification documents.",
      actionText: "Check Aid Portal",
      turnaround: "Updated Daily",
      badge: "Action Required"
    },
    {
      id: 4,
      title: "Official Transcript Request",
      category: "Registrar",
      description: "Order official electronic (eTranscript) or printed physical transcripts sent to prospective employers or graduate schools.",
      actionText: "Order Transcript",
      turnaround: "1 - 2 Business Days",
      badge: null
    },
    {
      id: 5,
      title: "Resume Review & Internship Coaching",
      category: "Career Services",
      description: "Get your technical resume reviewed by MIS career coaches, prepare for mock interviews, or apply to exclusive tech co-ops.",
      actionText: "Upload Resume",
      turnaround: "48-hour feedback",
      badge: "High Value"
    },
    {
      id: 6,
      title: "Course Add / Drop Request",
      category: "Registrar",
      description: "Submit late course registration override requests, drop courses, or apply for pass/fail grade options before deadlines.",
      actionText: "Submit Form",
      turnaround: "3 - 5 Business Days",
      badge: null
    }
  ];

  const faqs = [
    {
      q: "How do I request an override for a prerequisite in an MIS course?",
      a: "Prerequisite overrides require approval from the Department Chair or instructor. You can submit an Academic Exception Request ticket below with your unofficial transcript attached."
    },
    {
      q: "When are financial aid disbursements released for the current semester?",
      a: "Financial aid is disbursed during the second week of official classes after enrollment verification is confirmed by the Registrar."
    },
    {
      q: "How can I book a study room in the Technology Building?",
      a: "Study rooms can be reserved online up to 7 days in advance using the Library & Campus Spaces portal link inside the IT & LMS category."
    }
  ];

  const handleSubmitTicket = (e) => {
    e.preventDefault();
    if (!ticket.subject || !ticket.description) return;
    setTicketSubmitted(true);
    setTimeout(() => {
      setTicketSubmitted(false);
      setTicket({ serviceType: 'IT Support', subject: '', description: '', urgency: 'Medium' });
    }, 4000);
  };

  const filteredServices = servicesList.filter(s => {
    const matchesCategory = activeCategory === 'All' || s.category === activeCategory;
    const matchesSearch = s.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          s.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Hero */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-3">
            <span className="inline-flex items-center space-x-2 px-3 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-400/20 rounded-full text-xs font-semibold backdrop-blur-md">
              <ShieldCheck className="h-4 w-4 text-indigo-400" />
              <span>EduPulse Help & Services Hub</span>
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">How can we assist you today?</h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Access campus services, schedule appointments with department advisors, or submit support tickets to administrative departments.
            </p>
          </div>

          {/* Search Box inside Hero */}
          <div className="mt-6 max-w-xl relative z-10">
            <div className="relative">
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search for services (e.g., transcripts, advising, wifi)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-slate-400 pl-11 pr-4 py-3 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white/20 transition"
              />
            </div>
          </div>

          <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.name;
            return (
              <button
                key={idx}
                onClick={() => setActiveCategory(cat.name)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition ${
                  isActive 
                    ? 'bg-indigo-600 text-white shadow-sm' 
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* Services Directory Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <div key={service.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:border-indigo-300 transition flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
                    {service.category}
                  </span>
                  {service.badge && (
                    <span className="text-[10px] font-extrabold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                      {service.badge}
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-slate-900 text-lg">{service.title}</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">{service.description}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 flex items-center space-x-1">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{service.turnaround}</span>
                </span>
                <button className="text-indigo-600 hover:text-indigo-700 text-xs font-bold flex items-center space-x-1 hover:underline">
                  <span>{service.actionText}</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Support Ticket & FAQ Dual Column Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
          
          {/* Column 1 & 2: Support Ticket Submission Form */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
                <Headphones className="h-5 w-5 text-indigo-600" />
                <span>Submit a Student Support Ticket</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Have a specific query or technical issue? Direct your ticket to the responsible university team.
              </p>
            </div>

            {ticketSubmitted ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center space-x-4 text-emerald-800">
                <CheckCircle2 className="h-8 w-8 text-emerald-600 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-sm">Support Ticket Created Successfully!</h4>
                  <p className="text-xs text-emerald-700 mt-0.5">Ticket #TK-2026-9041 has been dispatched. Check your student email for status updates.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitTicket} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Target Department</label>
                    <select 
                      value={ticket.serviceType}
                      onChange={(e) => setTicket({...ticket, serviceType: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    >
                      <option value="IT Support">IT & Canvas LMS Support</option>
                      <option value="Academic Advising">Academic Advising</option>
                      <option value="Registrar">Registrar & Records</option>
                      <option value="Financial Aid">Financial Aid Office</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Priority Level</label>
                    <select 
                      value={ticket.urgency}
                      onChange={(e) => setTicket({...ticket, urgency: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    >
                      <option value="Low">Low - General Inquiry</option>
                      <option value="Medium">Medium - Standard Request</option>
                      <option value="High">High - Urgent Deadline Issue</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Subject / Summary</label>
                  <input 
                    type="text"
                    required
                    placeholder="Brief description of your request..."
                    value={ticket.subject}
                    onChange={(e) => setTicket({...ticket, subject: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Detailed Explanation</label>
                  <textarea 
                    rows={4}
                    required
                    placeholder="Provide specific details, course codes, or error messages..."
                    value={ticket.description}
                    onChange={(e) => setTicket({...ticket, description: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  ></textarea>
                </div>

                <button 
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm px-6 py-2.5 rounded-xl flex items-center space-x-2 transition shadow-sm shadow-indigo-600/20"
                >
                  <Send className="h-4 w-4" />
                  <span>Dispatch Ticket</span>
                </button>
              </form>
            )}
          </div>

          {/* Column 3: Frequently Asked Questions Accordion */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="font-bold text-slate-900 text-lg flex items-center space-x-2 border-b border-slate-100 pb-3">
              <HelpCircle className="h-5 w-5 text-indigo-600" />
              <span>Frequently Asked</span>
            </h2>

            <div className="space-y-3">
              {faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div key={idx} className="border border-slate-100 rounded-xl overflow-hidden">
                    <button 
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full text-left p-3.5 bg-slate-50/50 hover:bg-slate-100/80 font-semibold text-xs text-slate-800 flex justify-between items-center transition"
                    >
                      <span>{faq.q}</span>
                      <ChevronRight className={`h-4 w-4 text-slate-400 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
                    </button>
                    {isOpen && (
                      <div className="p-3.5 bg-white text-xs text-slate-600 border-t border-slate-100 leading-relaxed">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}