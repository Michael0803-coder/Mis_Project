import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Landing from './assets/components/LandingPage/landing.jsx'
import StudentLandingPage from './assets/components/Student/student.jsx'
import Admin from './assets/components/Admin/admin.jsx'
import AcademicRecords from './assets/components/Academic Record/Academic Record.jsx'
import StudentServices from './assets/components/Student Services/StudentServices.jsx'



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <StudentServices/>
  </StrictMode>,
)
