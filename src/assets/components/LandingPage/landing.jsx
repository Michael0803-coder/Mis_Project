import { useState } from 'react';

const LandingPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', program: 'stem' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* Header / Navigation */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-md shadow-indigo-200">
              A
            </div>
            <span className="font-bold text-xl text-slate-900 tracking-tight">Apex Academy</span>
          </div>

          <nav className="hidden md:flex items-center gap-8 font-medium text-slate-600 text-sm">
            <a href="#about" className="hover:text-indigo-600 transition-colors">About Us</a>
            <a href="#programs" className="hover:text-indigo-600 transition-colors">Programs</a>
            <a href="#features" className="hover:text-indigo-600 transition-colors">Why Apex</a>
            <a href="#testimonials" className="hover:text-indigo-600 transition-colors">Testimonials</a>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <a href="#enroll" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-lg shadow-sm transition-all hover:shadow-md">
              Apply Now
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 hover:text-slate-900 focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-100 px-4 pt-2 pb-6 space-y-3">
            <a href="#about" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-600 font-medium">About Us</a>
            <a href="#programs" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-600 font-medium">Programs</a>
            <a href="#features" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-600 font-medium">Why Apex</a>
            <a href="#testimonials" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-600 font-medium">Testimonials</a>
            <a href="#enroll" onClick={() => setMobileMenuOpen(false)} className="block w-full text-center bg-indigo-600 text-white font-semibold py-2.5 rounded-lg">
              Apply Now
            </a>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-full border border-indigo-100">
                🎓 Enrollment Open for Fall 2026
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight">
                Empowering Minds, <br />
                <span className="text-indigo-600">Inspiring Futures.</span>
              </h1>
              <p className="text-lg text-slate-600 max-w-xl">
                Apex Academy offers a world-class curriculum designed to cultivate critical thinking, creativity, and leadership in students from K-12.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <a href="#enroll" className="bg-indigo-600 hover:bg-indigo-700 text-white text-center font-semibold px-8 py-3.5 rounded-lg shadow-lg shadow-indigo-200 transition-all">
                  Get Started
                </a>
                <a href="#programs" className="bg-white hover:bg-slate-50 text-slate-700 text-center font-semibold px-8 py-3.5 rounded-lg border border-slate-200 shadow-sm transition-all">
                  Explore Programs
                </a>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="absolute -top-4 -left-4 w-72 h-72 bg-indigo-200/50 rounded-full blur-3xl -z-10"></div>
                <div className="bg-white p-4 rounded-2xl shadow-xl border border-slate-100">
                  <img
                    src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800"
                    alt="Students collaborating"
                    className="rounded-xl object-cover w-full h-80 lg:h-96"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl lg:text-4xl font-bold text-indigo-400">99%</div>
              <div className="text-slate-400 text-sm mt-1">Graduation Rate</div>
            </div>
            <div>
              <div className="text-3xl lg:text-4xl font-bold text-indigo-400">12:1</div>
              <div className="text-slate-400 text-sm mt-1">Student to Teacher Ratio</div>
            </div>
            <div>
              <div className="text-3xl lg:text-4xl font-bold text-indigo-400">25+</div>
              <div className="text-slate-400 text-sm mt-1">Advanced Programs</div>
            </div>
            <div>
              <div className="text-3xl lg:text-4xl font-bold text-indigo-400">50+</div>
              <div className="text-slate-400 text-sm mt-1">Clubs & Athletics</div>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section id="programs" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Academic Excellence</h2>
            <p className="text-slate-600 mt-3">Comprehensive educational pathways tailored to every stage of learning.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Primary School (K-5)",
                desc: "Building strong foundational skills through play-based and inquiry-led learning experiences.",
                icon: "🌱"
              },
              {
                title: "Middle School (6-8)",
                desc: "Fostering independence, critical thinking, and social-emotional growth during pivotal years.",
                icon: "🔍"
              },
              {
                title: "High School (9-12)",
                desc: "Rigorous academic preparation with AP courses, STEM tracks, and college readiness programs.",
                icon: "🎓"
              }
            ].map((program, idx) => (
              <div key={idx} className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-md transition-shadow">
                <div className="text-4xl mb-4">{program.icon}</div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{program.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">{program.desc}</p>
                <a href="#enroll" className="text-indigo-600 font-semibold text-sm hover:underline inline-flex items-center gap-1">
                  Learn more &rarr;
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact / Enrollment Section */}
      <section id="enroll" className="py-20 bg-indigo-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-12 border border-slate-100">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-900">Request Information</h2>
              <p className="text-slate-600 mt-2">Schedule a campus tour or speak with our admissions team.</p>
            </div>

            {submitted ? (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-6 rounded-xl text-center">
                <h3 className="font-bold text-lg">Thank you for reaching out!</h3>
                <p className="text-sm mt-1">Our admissions representative will contact you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    placeholder="Jane Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    placeholder="jane@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Program of Interest</label>
                  <select
                    value={formData.program}
                    onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="primary">Primary School (K-5)</option>
                    <option value="middle">Middle School (6-8)</option>
                    <option value="high">High School (9-12)</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg shadow-md transition-all mt-2"
                >
                  Submit Inquiry
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
              A
            </div>
            <span className="font-bold text-white tracking-tight">Apex Academy</span>
          </div>
          {/* <p className="text-sm">© 2026 Apex Academy. All rights reserved.</p> */}
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;