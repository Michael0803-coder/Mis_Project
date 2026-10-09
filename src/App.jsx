import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', program: 'stem' })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="school-app">
      {/* Navigation Header */}
      <header className="header">
        <div className="header-container">
          <div className="brand">
            <img src={viteLogo} className="logo" alt="Apex Academy Logo" />
            <span className="brand-name">Apex Academy</span>
          </div>

          <nav className={`nav-links ${mobileMenuOpen ? 'active' : ''}`}>
            <a href="#about" onClick={() => setMobileMenuOpen(false)}>About Us</a>
            <a href="#programs" onClick={() => setMobileMenuOpen(false)}>Programs</a>
            <a href="#features" onClick={() => setMobileMenuOpen(false)}>Why Apex</a>
            <a href="#enroll" onClick={() => setMobileMenuOpen(false)}>Admissions</a>
            <a href="#enroll" className="btn-primary mobile-only" onClick={() => setMobileMenuOpen(false)}>
              Apply Now
            </a>
          </nav>

          <div className="header-actions">
            <a href="#enroll" className="btn-primary desktop-only">Apply Now</a>
            <button 
              type="button" 
              className="menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="hero" className="hero-section">
        <div className="hero-content">
          <span className="badge">🎓 Admissions Open for Fall 2026</span>
          <h1>Empowering Minds, Inspiring Futures</h1>
          <p>
            Welcome to Apex Academy. We provide world-class education designed to foster 
            critical thinking, innovation, and leadership in students from K-12.
          </p>
          <div className="hero-buttons">
            <a href="#enroll" className="btn-primary">Get Started</a>
            <a href="#programs" className="btn-secondary">Explore Programs</a>
          </div>
        </div>
        <div className="hero-image-wrapper">
          <img src={heroImg} className="hero-img" alt="School Campus" />
          <div className="tech-badge">
            <img src={reactLogo} className="tech-icon" alt="React" />
            <span>Excellence in EdTech</span>
          </div>
        </div>
      </section>

      <div className="ticks"></div>

      {/* Stats Section */}
      <section id="stats" className="stats-section">
        <div className="stat-card">
          <h3>99%</h3>
          <p>Graduation Rate</p>
        </div>
        <div className="stat-card">
          <h3>12:1</h3>
          <p>Student-Teacher Ratio</p>
        </div>
        <div className="stat-card">
          <h3>25+</h3>
          <p>Advanced Programs</p>
        </div>
        <div className="stat-card">
          <h3>50+</h3>
          <p>Clubs & Athletics</p>
        </div>
      </section>

      <div className="ticks"></div>

      {/* Programs Section */}
      <section id="programs" className="programs-section">
        <h2>Academic Programs</h2>
        <p className="section-subtitle">Tailored educational pathways for every stage of development.</p>

        <div className="programs-grid">
          <div className="program-card">
            <div className="icon">🌱</div>
            <h3>Primary School (K-5)</h3>
            <p>Building strong foundational skills through interactive, inquiry-based learning.</p>
            <a href="#enroll">Learn More →</a>
          </div>
          <div className="program-card">
            <div className="icon">🔍</div>
            <h3>Middle School (6-8)</h3>
            <p>Fostering academic independence, critical thinking, and social development.</p>
            <a href="#enroll">Learn More →</a>
          </div>
          <div className="program-card">
            <div className="icon">🎓</div>
            <h3>High School (9-12)</h3>
            <p>Rigorous college preparation with advanced placement and specialized STEM tracks.</p>
            <a href="#enroll">Learn More →</a>
          </div>
        </div>
      </section>

      <div className="ticks"></div>

      {/* Enrollment Form Section */}
      <section id="enroll" className="enroll-section">
        <div className="form-container">
          <h2>Request Information</h2>
          <p>Schedule a campus tour or speak directly with our admissions team.</p>

          {submitted ? (
            <div className="success-message">
              <h3>Thank you for reaching out!</h3>
              <p>Our admissions representative will contact you within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="enroll-form">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  id="name"
                  type="text"
                  required
                  placeholder="Jane Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="jane@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label htmlFor="program">Program of Interest</label>
                <select
                  id="program"
                  value={formData.program}
                  onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                >
                  <option value="primary">Primary School (K-5)</option>
                  <option value="middle">Middle School (6-8)</option>
                  <option value="high">High School (9-12)</option>
                </select>
              </div>

              <button type="submit" className="btn-primary btn-full">
                Submit Inquiry
              </button>
            </form>
          )}
        </div>
      </section>

      <div className="ticks"></div>

      {/* Social / Connect Section */}
      <section id="social" className="social-section">
        <h2>Connect With Our Community</h2>
        <p>Follow Apex Academy updates across our platforms</p>
        <ul className="social-links">
          <li>
            <a href="https://github.com" target="_blank" rel="noreferrer">
              <svg className="button-icon" role="presentation" aria-hidden="true">
                <use href="/icons.svg#github-icon"></use>
              </svg>
              GitHub
            </a>
          </li>
          <li>
            <a href="https://discord.com" target="_blank" rel="noreferrer">
              <svg className="button-icon" role="presentation" aria-hidden="true">
                <use href="/icons.svg#discord-icon"></use>
              </svg>
              Discord
            </a>
          </li>
          <li>
            <a href="https://x.com" target="_blank" rel="noreferrer">
              <svg className="button-icon" role="presentation" aria-hidden="true">
                <use href="/icons.svg#x-icon"></use>
              </svg>
              X.com
            </a>
          </li>
        </ul>
      </section>

      <footer className="footer">
        <p>© 2026 Apex Academy. Powered by React & Vite.</p>
      </footer>
    </div>
  )
}

export default App