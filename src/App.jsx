"use client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import React, { Suspense, createContext, useState } from "react";

import Header from "./components/Header";
import "./App.css";
import "./components/ui/animations.css";

// Lazy load pages
const LandingPage = React.lazy(() => import("./pages/LandingPage"));
const JobListings = React.lazy(() => import("./pages/JobListings"));
const MockInterview = React.lazy(() => import("./pages/MockInterview"));
const InterviewFeedback = React.lazy(() => import("./pages/InterviewFeedback"));
const CompanyDashboard = React.lazy(() =>
  import("./pages/dashboard/CompanyDashboard")
);
const CandidateDashboard = React.lazy(() =>
  import("./pages/dashboard/CandidateDashboard")
);
const AdminDashboard = React.lazy(() => import("./pages/admin/AdminDashboard"));
const Login = React.lazy(() => import("./pages/Login"));
const Register = React.lazy(() => import("./pages/Register"));
const PostJob = React.lazy(() => import("./pages/dashboard/PostJob"));

export const UserContext = createContext();

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  return (
    <Router>
      <UserContext.Provider value={{ currentUser, setCurrentUser }}>
        <div className="flex flex-col min-h-screen bg-gray-50">
          <Header />
          <main className="flex-grow">
            {/* Suspense will show fallback while lazy components load */}
            <Suspense
              fallback={<div className="text-center p-10">Loading...</div>}
            >
              <AnimatePresence mode="wait">
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/jobs" element={<JobListings />} />
                  <Route
                    path="/mock-interview/:jobId"
                    element={<MockInterview />}
                  />
                  <Route
                    path="/feedback/:jobId"
                    element={<InterviewFeedback />}
                  />
                  <Route
                    path="/dashboard/company"
                    element={<CompanyDashboard />}
                  />
                  <Route
                    path="/dashboard/candidate"
                    element={<CandidateDashboard />}
                  />
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route
                    path="/login"
                    element={<Login setCurrentUser={setCurrentUser} />}
                  />
                  <Route path="/register" element={<Register />} />
                  <Route path="/dashboard/post-job" element={<PostJob />} />
                </Routes>
              </AnimatePresence>
            </Suspense>
          </main>
        </div>
      </UserContext.Provider>
    </Router>
  );
}

export default App;
