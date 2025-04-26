"use client"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { AnimatePresence } from "framer-motion"
import "./App.css"
// Layout
import Header from "./components/Header"
import { createContext, useState } from "react"

// Pages
import LandingPage from "./pages/LandingPage"
import JobListings from "./pages/JobListings"
import MockInterview from "./pages/MockInterview"
import InterviewFeedback from "./pages/InterviewFeedback"
import CompanyDashboard from "./pages/dashboard/CompanyDashboard"
import CandidateDashboard from "./pages/dashboard/CandidateDashboard"
import Login from "./pages/Login"
import Register from "./pages/Register"

// Import animations CSS
import "./components/ui/animations.css"
import PostJob from "./pages/dashboard/PostJob"
import AdminDashboard from "./pages/admin/AdminDashboard"
export const UserContext = createContext()

function App() {
  const [currentUser, setCurrentUser] = useState(null)
  return (
    <Router>
      <UserContext.Provider value={{ currentUser, setCurrentUser }}>
        <div className="flex flex-col min-h-screen bg-gray-50">
          <Header />
          <main className="flex-grow">
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/jobs" element={<JobListings />} />
                <Route path="/mock-interview/:jobId" element={<MockInterview />} />
                <Route path="/feedback/:jobId" element={<InterviewFeedback />} />
                <Route path="/dashboard/company" element={<CompanyDashboard />} />
                <Route path="/dashboard/candidate" element={<CandidateDashboard />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/login" element={<Login setCurrentUser={setCurrentUser} />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard/post-job" element={<PostJob />} />
              </Routes>
            </AnimatePresence>
          </main>
        </div>
      </UserContext.Provider>
    </Router>
  )
}

export default App
