import React, { useState, useEffect, useRef } from 'react';
import profilePic from './pic.png';
import {
  Briefcase,
  GraduationCap,
  Mail,
  Phone,
  MapPin,
  Check,
  Copy,
  Sun,
  Moon,
  Menu,
  X,
  ChevronUp,
  Sparkles,
  BookOpen,
  Code,
  Shield,
  Award,
  ArrowUpRight,
  User,
  Cpu,
  Layers,
  Send,
  MessageSquare

} from 'lucide-react';

export default function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState('');
  const [skillFilter, setSkillFilter] = useState('all');
  const [activeSection, setActiveSection] = useState('home');
  
  // Profile picture image source
  const profileImgSrc = profilePic;

  // Contact form state
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Toggle Dark/Light Mode
  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  // Copy to clipboard helper
  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(''), 2200);
  };

  // Handle Contact Form Submit
  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      setFormSubmitted(true);
      setTimeout(() => {
        setFormSubmitted(false);
        setFormData({ name: '', email: '', subject: '', message: '' });
      }, 4000);
    }
  };

  // Skills Categories
  const skillCategories = [
    { id: 'all', label: 'All Skills' },
    { id: 'tech', label: 'Tech & IT' },
    { id: 'education', label: 'Teaching & Pedagogy' },
    { id: 'soft', label: 'Management & Support' },
  ];

  const allSkills = [
    { id: '01', title: 'Teaching & Instruction', desc: 'Supporting learning with clear instruction.', cat: 'education', icon: BookOpen },
    { id: '02', title: 'Lesson Planning', desc: 'Preparing structured learning activities.', cat: 'education', icon: Layers },
    { id: '03', title: 'Learner-Centered Teaching', desc: 'Adapting instruction around learners.', cat: 'education', icon: User },
    { id: '04', title: 'Classroom & Online Instruction', desc: 'Facilitating learning in person and online.', cat: 'education', icon: BookOpen },
    { id: '05', title: 'Student Assessment', desc: 'Checking progress and understanding.', cat: 'education', icon: Award },
    { id: '06', title: 'Technical Communication', desc: 'Explaining information and support clearly.', cat: 'tech', icon: Cpu },
    { id: '07', title: 'Student Mentoring', desc: 'Encouraging and guiding learners.', cat: 'education', icon: User },
    { id: '08', title: 'Classroom Management', desc: 'Creating an organized learning environment.', cat: 'education', icon: Shield },
    { id: '09', title: 'Time Management', desc: 'Prioritizing tasks and meeting deadlines.', cat: 'soft', icon: Sparkles },
    { id: '10', title: 'Collaboration & Adaptability', desc: 'Working flexibly across teams and tasks.', cat: 'soft', icon: Code },
  ];

  const filteredSkills = skillFilter === 'all'
    ? allSkills
    : allSkills.filter(s => s.cat === skillFilter);

  // Active section tracker
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'experience', 'about', 'skills', 'education', 'contact'];
      const scrollPos = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`min-h-screen transition-colors duration-300 font-sans selection:bg-cyan-500 selection:text-white ${
      darkMode ? 'bg-[#0b0f17] text-slate-100' : 'bg-slate-50 text-slate-800'
    }`}>
      {/* Background Subtle Gradient Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className={`absolute -top-40 -left-40 w-96 h-96 rounded-full blur-3xl opacity-20 transition-all duration-700 ${
          darkMode ? 'bg-cyan-500' : 'bg-blue-400'
        }`} />
        <div className={`absolute top-1/3 -right-20 w-96 h-96 rounded-full blur-3xl opacity-20 transition-all duration-700 ${
          darkMode ? 'bg-emerald-500' : 'bg-teal-400'
        }`} />
        <div className={`absolute -bottom-40 left-1/3 w-96 h-96 rounded-full blur-3xl opacity-20 transition-all duration-700 ${
          darkMode ? 'bg-indigo-500' : 'bg-indigo-300'
        }`} />
      </div>

      {/* Top Navbar */}
      <header className={`sticky top-0 z-50 backdrop-blur-md border-b transition-colors duration-300 ${
        darkMode ? 'bg-[#0b0f17]/80 border-slate-800/80' : 'bg-white/80 border-slate-200'
      }`}>
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between relative">
          {/* Logo */}
          <a href="#home" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-emerald-400 flex items-center justify-center text-slate-950 font-black text-lg shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              MC
            </div>
            <span className="font-bold text-lg tracking-tight hidden sm:inline">
              Michael <span className="text-cyan-400">Cuamag</span>
            </span>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold">
            {[
              { name: 'Experience', id: 'experience' },
              { name: 'About', id: 'about' },
              { name: 'Skills', id: 'skills' },
              { name: 'Education', id: 'education' },
              { name: 'Contact', id: 'contact' },
            ].map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                className={`transition-colors duration-200 hover:text-cyan-400 relative py-1 ${
                  activeSection === link.id
                    ? darkMode ? 'text-cyan-400' : 'text-cyan-600'
                    : darkMode ? 'text-slate-300' : 'text-slate-600'
                }`}
              >
                {link.name}
                {activeSection === link.id && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-400 rounded-full animate-pulse" />
                )}
              </a>
            ))}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className={`p-2.5 rounded-xl border transition-all duration-300 ${
                darkMode
                  ? 'border-slate-700 bg-slate-800/60 text-amber-300 hover:bg-slate-800 hover:border-slate-600'
                  : 'border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <a
              href="#contact"
              className="hidden sm:flex items-center gap-2 text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-400 text-slate-950 hover:opacity-95 shadow-lg shadow-cyan-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Hire Me <ArrowUpRight size={16} />
            </a>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className={`md:hidden p-2.5 rounded-xl border ${
                darkMode ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-slate-100'
              }`}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {menuOpen && (
          <div className={`md:hidden border-b px-6 py-6 space-y-4 animate-in slide-in-from-top duration-300 ${
            darkMode ? 'bg-[#0b0f17] border-slate-800' : 'bg-white border-slate-200'
          }`}>
            {[
              { name: 'Experience', id: 'experience' },
              { name: 'About', id: 'about' },
              { name: 'Skills', id: 'skills' },
              { name: 'Education', id: 'education' },
              { name: 'Contact', id: 'contact' },
            ].map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={() => setMenuOpen(false)}
                className={`block text-base font-semibold py-2 transition-colors ${
                  activeSection === link.id ? 'text-cyan-400' : ''
                }`}
              >
                {link.name}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setMenuOpen(false)}
              className="block text-center w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-400 text-slate-950 font-bold"
            >
              Get In Touch
            </a>
          </div>
        )}
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-6 space-y-28 pt-10 pb-20">
        {/* HERO SECTION */}
        <section id="home" className="pt-6 md:pt-12 grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-semibold tracking-wide uppercase ${
              darkMode
                ? 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300'
                : 'border-cyan-600/20 bg-cyan-50 text-cyan-700'
            }`}>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Information Systems Specialist & Educator
            </div>

            <h1 className="text-4xl sm:text-6xl xl:text-7xl font-extrabold tracking-tight leading-[1.08]">
              Michael <br />
              <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent italic font-serif">
                Cuamag
              </span>
            </h1>

            <p className={`text-base sm:text-lg max-w-2xl leading-relaxed ${
              darkMode ? 'text-slate-300' : 'text-slate-600'
            }`}>
              Information Systems graduate based in Panabo City, PH. Experienced in virtual administration, data &amp; document management, IT end-user support, and technical instruction with a passion for empowering learners and optimizing operations.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <a
                href="#experience"
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:scale-[1.02] transition-all flex items-center gap-2"
              >
                View Experience <ArrowUpRight size={18} />
              </a>
              <a
                href="mailto:cuamag.michael@dnsc.edu.ph"
                className={`px-6 py-3.5 rounded-xl border text-sm font-semibold transition-all hover:scale-[1.02] flex items-center gap-2 ${
                  darkMode
                    ? 'border-slate-700 bg-slate-900/60 hover:bg-slate-800 hover:border-slate-600 text-slate-200'
                    : 'border-slate-300 bg-white hover:bg-slate-100 text-slate-800'
                }`}
              >
                <Mail size={16} /> Contact Directly
              </a>
            </div>
          </div>

          {/* HERO PHOTO SLOT & CARD GRAPHIC */}
          <div className="lg:col-span-5 flex justify-center">
            <div className={`relative w-full max-w-md rounded-3xl p-6 border flex flex-col justify-between overflow-hidden shadow-2xl backdrop-blur-xl transition-all duration-500 hover:border-cyan-500/50 ${
              darkMode
                ? 'bg-gradient-to-b from-slate-900/90 to-slate-950/90 border-slate-800'
                : 'bg-gradient-to-b from-white to-slate-100 border-slate-200'
            }`}>
              {/* Decorative background ambient glow */}
              <div className="absolute -top-16 -right-16 w-48 h-48 bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 rounded-full blur-2xl pointer-events-none" />

              {/* Status Indicator */}
              <div className="flex justify-between items-center mb-6 z-10">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Available for Opportunities
                </div>
              </div>

              {/* PERMANENT PORTRAIT PHOTO FRAME SLOT */}
              <div className="relative z-10 mb-6 group">
                <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden border-2 border-slate-700/50 shadow-2xl flex flex-col items-center justify-center bg-gradient-to-b from-slate-800/90 via-slate-900 to-slate-950 transition-all duration-500 group-hover:scale-[1.01] group-hover:border-cyan-500/50">
                  <div className="w-full h-full relative overflow-hidden bg-slate-900 flex items-center justify-center">
                    <img
                      src={profileImgSrc}
                      alt="Michael Cuamag"
                      className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                      onError={(e) => {
                        // Fallback UI if pic.png is not found in the local directory
                        e.target.onerror = null;
                        e.target.src = 'pic.png';
                      }}
                    />
                    {/* Gradient overlay for blending */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60" />
                  </div>

                  {/* Photo Overlay Badge on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4 pointer-events-none">
                    <p className="text-xs text-slate-200 font-semibold tracking-wide">
                      Michael Cuamag · Panabo City, PH
                    </p>
                  </div>
                </div>
              </div>

              {/* Education / Degree Quick Info */}
                <div>       <span className="font-semibold text-cyan-400 uppercase tracking-wider">Front-End Developer</span></div>
              <div className="space-y-3 z-10 pt-2 border-t border-slate-800/60">
                <div className="flex justify-between items-center text-xs">                                       
               
                        <p>     <span className="font-semibold text-cyan-400 uppercase tracking-wider">Education</span></p>  
             
                              <span className={`font-mono ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>2021 – Present</span>
                </div>
                <div>
                  <h3 className="text-base font-bold">BS in Information Systems</h3>
                  <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Davao del Norte State College</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CORE COMPETENCIES STRIP */}
        <section className={`py-6 px-8 rounded-2xl border backdrop-blur-md transition-all ${
          darkMode ? 'bg-slate-900/40 border-slate-800/80' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex flex-wrap items-center justify-between gap-6">
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Core Competencies</span>
            {[
              'Information Management',
              'IT & User Support',
              'Instruction & Teaching',
              'Data Integrity',
              'Team Collaboration'
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 text-sm font-semibold">
                <span>{item}</span>
                {idx < 4 && <span className="text-cyan-500/50">•</span>}
              </div>
            ))}
          </div>
        </section>

        {/* WORK EXPERIENCE */}
        <section id="experience" className="space-y-8 scroll-mt-28">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">01 / Experience</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Virtual Experience Program</h2>
            <p className={`max-w-2xl text-sm sm:text-base ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Hands-on practical experience supporting digital operations, records quality, end-users, and remote cross-functional teamwork.
            </p>
          </div>

          <div className={`p-8 rounded-3xl border transition-all duration-300 shadow-xl ${
            darkMode
              ? 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-6 mb-8 border-slate-800">
              <div>
                <h3 className="text-2xl font-bold flex items-center gap-2">
                  <Briefcase size={22} className="text-cyan-400" />
                  Virtual Experience Program Specialist
                </h3>
                <p className={`text-sm mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Administrative Operations · Data Management · IT &amp; Customer Support
                </p>
              </div>
              <span className="px-4 py-1.5 rounded-full text-xs font-semibold border border-cyan-500/30 bg-cyan-500/10 text-cyan-400">
                Program Experience
              </span>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Column 1 */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 font-bold text-sm tracking-wide uppercase text-cyan-400">
                  <Cpu size={16} /> Records &amp; Operations
                </div>
                <ul className={`space-y-3 text-sm leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                  <li className="flex gap-2">
                    <span className="text-cyan-400 font-bold">•</span>
                    Managed and organized digital documents, records, and administrative files efficiently.
                  </li>
                  <li className="flex gap-2">
                    <span className="text-cyan-400 font-bold">•</span>
                    Entered, reviewed, and verified information to maintain data integrity, accuracy, and confidentiality.
                  </li>
                  <li className="flex gap-2">
                    <span className="text-cyan-400 font-bold">•</span>
                    Maintained databases and updated records using MS Office and Google Workspace.
                  </li>
                  <li className="flex gap-2">
                    <span className="text-cyan-400 font-bold">•</span>
                    Prepared operational reports, tracked tasks, and monitored progress timelines.
                  </li>
                </ul>
              </div>

              {/* Column 2 */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 font-bold text-sm tracking-wide uppercase text-emerald-400">
                  <Shield size={16} /> IT &amp; User Support
                </div>
                <ul className={`space-y-3 text-sm leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                  <li className="flex gap-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    Provided responsive IT and customer support via email, chat, and remote assistance.
                  </li>
                  <li className="flex gap-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    Resolved user technical inquiries and systematically documented resolution activities.
                  </li>
                  <li className="flex gap-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    Coordinated with cross-functional teams to resolve workflow and documentation bottlenecks.
                  </li>
                </ul>
              </div>

              {/* Column 3 */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 font-bold text-sm tracking-wide uppercase text-indigo-400">
                  <Layers size={16} /> Coordination &amp; Delivery
                </div>
                <ul className={`space-y-3 text-sm leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                  <li className="flex gap-2">
                    <span className="text-indigo-400 font-bold">•</span>
                    Utilized Monday.com, Slack, and MS Teams to facilitate remote project coordination.
                  </li>
                  <li className="flex gap-2">
                    <span className="text-indigo-400 font-bold">•</span>
                    Demonstrated self-direction in a fully remote setup, hitting key deliverables on time.
                  </li>
                  <li className="flex gap-2">
                    <span className="text-indigo-400 font-bold">•</span>
                    Applied structured problem-solving to balance multiple priority assignments smoothly.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ABOUT / PROFILE */}
        <section id="about" className="scroll-mt-28">
          <div className={`p-8 sm:p-12 rounded-3xl border ${
            darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-slate-100/80 border-slate-200'
          }`}>
            <div className="grid lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-4 space-y-4">
                <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">02 / Professional Profile</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  Information management, user support, &amp; education.
                </h2>
              </div>

              <div className="lg:col-span-8 space-y-6">
                <p className={`text-base sm:text-lg leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  Michael Cuamag is an Information Systems graduate based in Gredu, Panabo City, Davao del Norte, Philippines. He holds a Bachelor of Science in Information Systems from Davao del Norte State College and is currently advancing his research and technical mastery with a Master in Information Systems at the University of Immaculate Conception.
                </p>
                <p className={`text-sm sm:text-base leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  His core capabilities encompass document and database management, remote IT and user support, workflow reporting, and cross-team coordination. Complemented by his academic background in education, Michael brings an articulate, learner-centered approach to training and assisting end-users.
                </p>

                <div className="flex flex-wrap gap-2 pt-2">
                  {[
                    'Information Systems',
                    'Virtual Administration',
                    'IT Support',
                    'Education & Mentorship',
                    'Database Management'
                  ].map((tag, idx) => (
                    <span
                      key={idx}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border ${
                        darkMode
                          ? 'border-slate-700 bg-slate-800/80 text-slate-300'
                          : 'border-slate-300 bg-white text-slate-700'
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SKILLS SECTION */}
        <section id="skills" className="space-y-8 scroll-mt-28">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">03 / Core Skills</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Areas of Expertise</h2>
              <p className={`text-sm sm:text-base ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Filter by skill category to explore key strengths and functional expertise.
              </p>
            </div>

            {/* Category Filter Tabs */}
            <div className={`p-1.5 rounded-2xl border flex flex-wrap gap-1 ${
              darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-200/60 border-slate-300'
            }`}>
              {skillCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSkillFilter(cat.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    skillFilter === cat.id
                      ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                      : darkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Skills Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredSkills.map((skill) => {
              const IconComp = skill.icon;
              return (
                <div
                  key={skill.id}
                  className={`p-6 rounded-2xl border transition-all duration-300 group hover:-translate-y-1 ${
                    darkMode
                      ? 'bg-slate-900/50 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/80'
                      : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 group-hover:scale-110 transition-transform">
                      <IconComp size={18} />
                    </div>
                    <span className="text-xs font-mono text-slate-500">{skill.id}</span>
                  </div>
                  <h3 className="font-bold text-lg mb-1 tracking-tight">{skill.title}</h3>
                  <p className={`text-xs leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    {skill.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* EDUCATION SECTION */}
        <section id="education" className="space-y-8 scroll-mt-28">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">04 / Education</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Academic Background</h2>
            <p className={`text-sm sm:text-base ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Formal study in information systems, education, and instructional practices.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Degree 1 */}
            <div className={`p-6 rounded-3xl border flex flex-col justify-between transition-all hover:border-slate-700 ${
              darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <div className="space-y-3">
                <div className="p-2.5 w-max rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                  <GraduationCap size={20} />
                </div>
                <h3 className="font-bold text-lg leading-snug">Master in Information Systems</h3>
                <p className={`text-xs font-medium ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  University of Immaculate Conception
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-slate-800/60 flex items-center justify-between text-xs font-bold text-cyan-400">
                <span>Ongoing Pursuit</span>
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              </div>
            </div>

            {/* Degree 2 */}
            <div className={`p-6 rounded-3xl border flex flex-col justify-between transition-all hover:border-slate-700 ${
              darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <div className="space-y-3">
                <div className="p-2.5 w-max rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <Award size={20} />
                </div>
                <h3 className="font-bold text-lg leading-snug">BS in Information Systems</h3>
                <p className={`text-xs font-medium ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Davao del Norte State College
                </p>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <Sparkles size={12} /> Best in Research and/or Innovation Award
                </div>
              </div>
              <div className="pt-6 mt-6 border-t border-slate-800/60 text-xs font-bold text-slate-500">
                2021 – 2025
              </div>
            </div>

            {/* Degree 3 */}
            <div className={`p-6 rounded-3xl border flex flex-col justify-between transition-all hover:border-slate-700 ${
              darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <div className="space-y-3">
                <div className="p-2.5 w-max rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                  <BookOpen size={20} />
                </div>
                <h3 className="font-bold text-lg leading-snug">BS in Education</h3>
                <p className={`text-xs font-medium ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  North Davao College Inc.
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-slate-800/60 text-xs font-bold text-slate-500">
                2026
              </div>
            </div>
          </div>
        </section>

        {/* CONTACT SECTION WITH FORM */}
        <section id="contact" className="scroll-mt-28">
          <div className="relative rounded-3xl p-8 sm:p-12 overflow-hidden border border-cyan-500/30 bg-gradient-to-br from-cyan-950/80 via-slate-900 to-slate-950 text-white shadow-2xl">
            <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

            <div className="grid lg:grid-cols-12 gap-10 items-start relative z-10">
              {/* Left Info Column */}
              <div className="lg:col-span-5 space-y-6">
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">05 / Contact Information</span>
                  <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                    Let’s Connect &amp; Collaborate
                  </h2>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    Available for administrative operations, data management, technical support, or instructional roles. Reach out directly or send a message.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  {/* Email Box */}
                  <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 shrink-0">
                        <Mail size={18} />
                      </div>
                      <div className="truncate">
                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Email</div>
                        <a href="mailto:cuamag.michael@dnsc.edu.ph" className="text-xs sm:text-sm font-bold text-slate-100 hover:text-cyan-400 transition-colors truncate block">
                          cuamag.michael@dnsc.edu.ph
                        </a>
                      </div>
                    </div>
                    <button
                      onClick={() => handleCopy('cuamag.michael@dnsc.edu.ph', 'email')}
                      className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors shrink-0"
                      title="Copy Email"
                    >
                      {copied === 'email' ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                    </button>
                  </div>

                  {/* Phone Box */}
                  <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0">
                        <Phone size={18} />
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Telephone</div>
                        <a href="tel:+639352065661" className="text-xs sm:text-sm font-bold text-slate-100 hover:text-emerald-400 transition-colors">
                          +63 935 206 5661
                        </a>
                      </div>
                    </div>
                    <button
                      onClick={() => handleCopy('+639352065661', 'phone')}
                      className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors shrink-0"
                      title="Copy Phone"
                    >
                      {copied === 'phone' ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 pt-2">
                  <MapPin size={16} className="text-cyan-400 shrink-0" />
                  Gredu, Panabo City, Davao del Norte, Philippines
                </div>
              </div>

              {/* Right Message Form Column */}
              <div className="lg:col-span-7">
                <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-md shadow-xl">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <MessageSquare size={18} className="text-cyan-400" /> Send a Direct Message
                  </h3>

                  {formSubmitted ? (
                    <div className="p-6 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-center space-y-2 my-4">
                      <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto text-emerald-400">
                        <Check size={20} />
                      </div>
                      <p className="font-bold text-base">Message Sent Successfully!</p>
                      <p className="text-xs text-slate-300">Thank you for reaching out, Michael will get back to you shortly.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleContactSubmit} className="space-y-4">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-300">Your Name</label>
                          <input
                            type="text"
                            required
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-300">Email Address</label>
                          <input
                            type="email"
                            required
                            placeholder="john@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300">Subject</label>
                        <input
                          type="text"
                          placeholder="Project Opportunity / Inquiry"
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300">Message</label>
                        <textarea
                          required
                          rows={4}
                          placeholder="Write your message or inquiry here..."
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors resize-none"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider hover:opacity-95 shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2"
                      >
                        <Send size={14} /> Send Message
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className={`border-t transition-colors duration-300 relative z-10 ${
        darkMode ? 'border-slate-800/80 bg-[#080b11]' : 'border-slate-200 bg-slate-100'
      }`}>
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p className={darkMode ? 'text-slate-400' : 'text-slate-600'}>
            © {new Date().getFullYear()} <span className="font-bold text-cyan-400">Michael Cuamag</span>. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <a href="mailto:cuamag.michael@dnsc.edu.ph" className="hover:text-cyan-400 transition-colors">
              Email
            </a>
            <a href="tel:+639352065661" className="hover:text-cyan-400 transition-colors">
              Call
            </a>
            <a
              href="#home"
              className="p-2 rounded-xl border border-slate-700 hover:border-slate-500 transition-colors flex items-center gap-1"
            >
              Top <ChevronUp size={14} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}