"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Briefcase,
  CheckCircle,
  Clock,
  AlertTriangle,
  X,
  Search,
  FileText,
  User,
  Mail,
  Edit,
  Save,
  Sparkles,
  TrendingUp,
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import customFetch from "../../lib/customFetch"
import toast from "react-hot-toast"
import { generatePerformanceInsights } from "../../components/AI/geminiAi"

const CandidateDashboard = () => {
  const [activeTab, setActiveTab] = useState("applications")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [user, setUser] = useState(null)
  const [stats, setStats] = useState(null)
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [interviewFeedbacks, setInterviewFeedbacks] = useState([])
  const [performanceInsights, setPerformanceInsights] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    yearsOfExperience: "",
    skills: "",
    bio: "",
  })
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    window.scrollTo(0, 0)
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      const response = await customFetch("/current-user")
      const userData = await response.data
      // console.log(userData)
      setUser(userData)
      setProfileData({
        name: userData.name || "",
        email: userData.email || "",
        yearsOfExperience: userData.yearsOfExperience || "",
        skills: userData.skills?.join(", ") || "",
        bio: userData.bio || "",
      })
      fetchStats(userData.id)
      fetchAppliedJobs(userData.id)
    } catch (error) {
      console.error("Error fetching user data:", error)
      toast.error("Failed to fetch user data")
      navigate("/login")
    }
  }

  const fetchStats = async (userId) => {
    try {
      const response = await customFetch(`/stats/user/${userId}`)
      const statsData = await response.data
      // console.log("fetchstatus", statsData)
      setStats(statsData)
    } catch (error) {
      console.error("Error fetching stats:", error)
      toast.error("Failed to fetch statistics")
    }
  }

  const fetchAppliedJobs = async (userId) => {
    try {
      const response = await customFetch(`/users/${userId}/applied-jobs`)
      const jobsData = await response.data
      // console.log("fetchappliedjobs", jobsData)`
      setApplications(jobsData)
    } catch (error) {
      console.error("Error fetching applied jobs:", error)
      toast.error("Failed to fetch applied jobs")
    } finally {
      setLoading(false)
    }
  }

  const fetchInterviewFeedback = async (userId, jobId) => {
    try {
      const response = await customFetch(`/feedback/user/${userId}/job/${jobId}`)
      const feedbackData = await response.data
      // console.log("Interview feedback:", feedbackData)
      return feedbackData
    } catch (error) {
      console.error("Error fetching interview feedback:", error)
      return null
    }
  }

  const analyzeFeedbacks = async (feedbacks) => {
    setIsAnalyzing(true)
    try {
      const insights = await generatePerformanceInsights(feedbacks)
      // console.log("Performance insights:", insights)
      setPerformanceInsights(insights)
    } catch (error) {
      console.error("Error analyzing feedbacks:", error)
      toast.error("Failed to analyze interview performance")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const fetchAllInterviewFeedbacks = async (userId, jobIds) => {
    try {
      const feedbackPromises = jobIds.map((jobId) => fetchInterviewFeedback(userId, jobId))
      const feedbacks = await Promise.all(feedbackPromises)
      const validFeedbacks = feedbacks.filter((feedback) => feedback !== null)
      setInterviewFeedbacks(validFeedbacks)

      if (validFeedbacks.length > 0) {
        await analyzeFeedbacks(validFeedbacks)
      }
    } catch (error) {
      console.error("Error fetching all interview feedbacks:", error)
      toast.error("Failed to fetch interview feedbacks")
    }
  }

  useEffect(() => {
    if (user && user.appliedJobIds && user.appliedJobIds.length > 0) {
      fetchAllInterviewFeedbacks(user.id, user.appliedJobIds)
    }
  }, [user])

  // Filter applications
  const filteredApplications = applications.filter((app) => {
    // Filter by search term
    if (
      searchTerm &&
      !app.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !app.company.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false
    }

    // Filter by status
    if (statusFilter !== "all" && app.applicationStatus.toLowerCase() !== statusFilter.toLowerCase()) {
      return false
    }

    return true
  })

  const handleViewInterview = (jobId) => {
    navigate(`/feedback/${jobId}`)
  }

  const handleProfileChange = (e) => {
    const { name, value } = e.target
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    setIsUpdatingProfile(true)

    try {
      // Only send name, email, and yearsOfExperience
      const updatedProfile = {
        name: profileData.name,
        email: profileData.email,
        yearsOfExperience: profileData.yearsOfExperience,
      }

      await customFetch.put(`/users/${user.id}`, updatedProfile)

      // Update local user data
      setUser((prev) => ({
        ...prev,
        ...updatedProfile,
      }))

      toast.success("Profile updated successfully")
      setShowProfileModal(false)
    } catch (error) {
      console.error("Error updating profile:", error)
      toast.error("Failed to update profile")
    } finally {
      setIsUpdatingProfile(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-16 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading dashboard...</p>
      </div>
    </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16 pb-16">
      {/* Header with gradient background */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-8 px-4 md:px-6 mb-8">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
                className="text-3xl font-bold"
            >
                Welcome, {user?.name}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
                className="text-indigo-100 mt-1"
            >
              Track your job applications and interview performance
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-4 md:mt-0 flex space-x-3"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
                onClick={() => setShowProfileModal(true)}
                className="flex items-center px-4 py-2 bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
              >
                <User size={18} className="mr-2" />
                Update Profile
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/jobs")}
                className="flex items-center px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-400 transition-colors"
            >
              <Briefcase size={18} className="mr-2" />
              Browse Jobs
            </motion.button>
          </motion.div>
          </div>
        </div>
        </div>

      {/* Only show the rest of the dashboard if user is not a Company */}
      <>
        {user?.role === 'Company' || user?.role === 'Admin' ? (
          <div className="container mx-auto px-4 md:px-6">
            {/* User Profile Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-xl shadow-md overflow-hidden mb-8"
            >
              <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-24"></div>
              <div className="px-6 py-5 flex flex-col md:flex-row md:items-center">
                <div className="flex-shrink-0 -mt-12 md:-mt-16 mb-4 md:mb-0 md:mr-6">
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-white p-1 shadow-lg">
                    <div className="w-full h-full rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 flex items-center justify-center text-white text-3xl font-bold">
                      {user?.name?.charAt(0) || "U"}
                    </div>
                  </div>
                </div>
                <div className="flex-grow">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{user?.name}</h2>
                      <p className="text-gray-600 flex items-center mt-1">
                        <Mail size={16} className="mr-2" />
                        {user?.email}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {user?.skills?.map((skill, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs font-medium rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="mt-4 md:mt-0">
                      <button
                        onClick={() => setShowProfileModal(true)}
                        className="flex items-center text-sm text-indigo-600 hover:text-indigo-800"
                      >
                        <Edit size={16} className="mr-1" />
                        Edit Profile
                      </button>
                    </div>
        </div>

                 {user?.role==="Company" || user?.role==="Admin" ? <>
                 </> : <>
                 <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500">Experience</p>
                      <p className="font-medium">{user?.yearsOfExperience || "Not specified"} years</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500">Applications</p>
                      <p className="font-medium">{stats?.totalApplications || 0}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500">Interviews</p>
                      <p className="font-medium">{interviewFeedbacks?.length || 0}</p>
                    </div>
                  </div>
                 </>}
                </div>
              </div>
            </motion.div>
          </div>
        ) : (
          <div className="container mx-auto px-4 md:px-6">
            {/* Bento Grid Dashboard Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl shadow-md p-6 border-t-4 border-indigo-500"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 mb-1">Total Applications</p>
                    <h3 className="text-2xl font-bold text-gray-900">{stats?.totalApplications?.toString() || "0"}</h3>
                    <p className="text-xs text-indigo-600 mt-1">Your job search journey</p>
                  </div>
                  <div className="p-3 bg-indigo-50 rounded-lg">
                    <Briefcase size={24} className="text-indigo-600" />
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl shadow-md p-6 border-t-4 border-green-500"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 mb-1">Shortlisted</p>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {stats?.shortlistedApplications?.toString() || "0"}
                    </h3>
                    <p className="text-xs text-green-600 mt-1">Moving forward in the process</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <CheckCircle size={24} className="text-green-600" />
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl shadow-md p-6 border-t-4 border-yellow-500"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 mb-1">Pending</p>
                    <h3 className="text-2xl font-bold text-gray-900">{stats?.pendingApplications?.toString() || "0"}</h3>
                    <p className="text-xs text-yellow-600 mt-1">Awaiting response</p>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <Clock size={24} className="text-yellow-600" />
                  </div>
                </div>
        </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl shadow-md p-6 border-t-4 border-red-500"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 mb-1">Rejected</p>
                    <h3 className="text-2xl font-bold text-gray-900">{stats?.rejectedApplications?.toString() || "0"}</h3>
                    <p className="text-xs text-red-600 mt-1">Learning opportunities</p>
                  </div>
                  <div className="p-3 bg-red-50 rounded-lg">
                    <X size={24} className="text-red-600" />
                  </div>
                </div>
              </motion.div>
            </div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-6 border-b border-gray-200"
        >
          <div className="flex space-x-8">
            <TabButton
              active={activeTab === "applications"}
              onClick={() => setActiveTab("applications")}
              label="My Applications"
            />
            <TabButton
              active={activeTab === "performance"}
              onClick={() => setActiveTab("performance")}
              label="Interview Performance"
            />
          </div>
        </motion.div>

        {/* Content based on active tab */}
        {activeTab === "applications" ? (
          <ApplicationsTab
            applications={filteredApplications}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
                onViewInterview={handleViewInterview}
          />
        ) : (
              <PerformanceTab performanceInsights={performanceInsights} isAnalyzing={isAnalyzing} />
            )}
          </div>
        )}
      </>

      {/* Profile Update Modal */}
      <AnimatePresence>
        {showProfileModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Update Your Profile</h2>
                  <button
                    onClick={() => setShowProfileModal(false)}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              <form onSubmit={handleProfileSubmit} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={profileData.name}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Enter your email address"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
                    <input
                      type="number"
                      name="yearsOfExperience"
                      value={profileData.yearsOfExperience}
                      onChange={handleProfileChange}
                      min="0"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Enter years of experience"
                    />
                  </div>

                  {/* <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Skills (comma separated)</label>
                    <input
                      type="text"
                      name="skills"
                      value={profileData.skills}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="React, JavaScript, Node.js"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                    <textarea
                      name="bio"
                      value={profileData.bio}
                      onChange={handleProfileChange}
                      rows={4}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                      placeholder="Tell us about yourself..."
                    />
                  </div>*/}
                </div> 

                <div className="mt-6 flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowProfileModal(false)}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdatingProfile}
                    className="px-6 py-2 bg-indigo-600 rounded-lg text-white hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center"
                  >
                    {isUpdatingProfile ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                        Updating...
                      </>
                    ) : (
                      <>
                        <Save size={18} className="mr-2" />
                        Save Changes
                      </>
                    )}
                  </button>
      </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Helper Components
const StatCard = ({ icon, title, value }) => (
  <motion.div whileHover={{ y: -5 }} className="bg-white rounded-xl shadow-md p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-600 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
      </div>
      <div className="p-3 bg-gray-100 rounded-lg">{icon}</div>
    </div>
  </motion.div>
)

const TabButton = ({ active, onClick, label }) => (
  <button
    onClick={onClick}
    className={`relative pb-4 ${active ? "text-indigo-600 font-medium" : "text-gray-600 hover:text-gray-900"}`}
  >
    {label}
    {active && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />}
  </button>
)

const ApplicationsTab = ({
  applications,
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  onViewInterview,
}) => (
  <>
    {/* Search and Filter */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-6 flex flex-col md:flex-row gap-4"
    >
      <div className="relative flex-grow">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search applications..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>

      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
      >
        <option value="all">All Status</option>
        <option value="shortlisted">Shortlisted</option>
        <option value="pending">Pending</option>
        <option value="rejected">Rejected</option>
      </select>
    </motion.div>

    {/* Applications List - Bento Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {applications.length > 0 ? (
        applications.map((application, index) => (
          <ApplicationCard
            key={application.jobId}
            application={application}
            index={index}
            onViewInterview={onViewInterview}
          />
        ))
      ) : (
        <div className="md:col-span-2 text-center py-12 bg-white rounded-xl shadow-md">
          <div className="flex flex-col items-center">
            <div className="p-4 bg-indigo-50 rounded-full mb-4">
              <Briefcase size={32} className="text-indigo-600" />
            </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">No applications found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search or filters</p>
            <button
              onClick={() => navigate("/jobs")}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Browse Jobs
            </button>
          </div>
        </div>
      )}
    </div>
  </>
)

const ApplicationCard = ({ application, index, onViewInterview }) => {
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "shortlisted":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
      className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100"
    >
      <div className="p-6">
        <div className="flex flex-col">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
              <h3 className="text-xl font-semibold text-gray-900">{application.title}</h3>
                <p className="text-indigo-600 font-medium">{application.company}</p>
              </div>

              <div className="mt-2 md:mt-0">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.applicationStatus)}`}
              >
                {application.applicationStatus}
                </span>
              </div>
            </div>

            <div className="mt-4 flex flex-col md:flex-row md:items-center text-gray-600 gap-2 md:gap-6">
              <div className="flex items-center">
                <Briefcase size={18} className="mr-1" />
                <span>{application.location}</span>
              </div>
              <div className="flex items-center">
                <Clock size={18} className="mr-1" />
                <span>Applied on {new Date(application.appliedDate).toLocaleDateString()}</span>
              </div>
            </div>

          {application.mockInterviewRequired && (
              <div className="mt-4">
              <p className="text-sm text-gray-600 mb-1">Mock Interview Attended</p>
              <p className="text-sm text-gray-900">Minimum Score: {application.minimumMockScore}%</p>
              </div>
            )}

            <div className="mt-6 flex flex-wrap gap-3">
            {application.mockInterviewRequired && (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onViewInterview(application.jobId)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
              >
                <FileText size={16} className="mr-2" />
                View Interview
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

const PerformanceTab = ({ performanceInsights, isAnalyzing }) => {
  if (!performanceInsights && !isAnalyzing) {
    return (
      <div className="text-center py-12 bg-white rounded-xl shadow-md">
        <h3 className="text-xl font-medium text-gray-900 mb-2">No performance data available</h3>
        <p className="text-gray-600">Complete some mock interviews to see your performance metrics</p>
      </div>
    )
  }

  if (isAnalyzing) {
    return (
      <div className="text-center py-12 bg-white rounded-xl shadow-md">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <h3 className="text-xl font-medium text-gray-900 mb-2">Analyzing your performance</h3>
        <p className="text-gray-600">Please wait while we generate insights...</p>
      </div>
    )
  }

  return (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Overall Performance Score */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="lg:col-span-1 bg-white rounded-xl shadow-md p-6"
    >
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Overall Performance</h3>
      <div className="flex flex-col items-center">
        <div className="relative w-48 h-48">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="10" />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
                stroke={
                  performanceInsights.overallScore >= 80
                    ? "#10b981"
                    : performanceInsights.overallScore >= 70
                      ? "#f59e0b"
                      : "#ef4444"
                }
              strokeWidth="10"
                strokeDasharray={`${(2 * Math.PI * 45 * performanceInsights.overallScore) / 100} ${2 * Math.PI * 45 * (1 - performanceInsights.overallScore / 100)}`}
              strokeDashoffset={2 * Math.PI * 45 * 0.25}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center flex-col">
              <span className="text-4xl font-bold text-gray-900">{performanceInsights.overallScore}%</span>
            <span className="text-sm text-gray-600">Overall Score</span>
          </div>
        </div>

        <div className="mt-8 w-full space-y-4">
            {performanceInsights.categories?.map((category, index) => (
            <div key={index}>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">{category.name}</span>
                <span className="text-sm font-medium text-gray-700">{category.score}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    category.score >= 80 ? "bg-green-600" : category.score >= 70 ? "bg-yellow-500" : "bg-red-600"
                  }`}
                  style={{ width: `${category.score}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>

      {/* Performance Insights */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="lg:col-span-2 bg-white rounded-xl shadow-md p-6"
    >
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Performance Summary</h3>
        <p className="text-gray-700 mb-6">{performanceInsights.summary}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Strengths */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Key Strengths</h4>
            <ul className="space-y-3">
              {performanceInsights.commonStrengths.map((strength, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle size={20} className="text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{strength}</span>
                  </li>
              ))}
                </ul>
              </div>

          {/* Areas for Improvement */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Areas for Improvement</h4>
            <ul className="space-y-3">
              {performanceInsights.recurringImprovements.map((improvement, index) => (
                <li key={index} className="flex items-start">
                  <AlertTriangle size={20} className="text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{improvement}</span>
                  </li>
              ))}
                </ul>
              </div>
            </div>
      </motion.div>

      {/* Performance Trends */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="lg:col-span-2 bg-white rounded-xl shadow-md p-6"
      >
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Performance Trends</h3>
        <div className="bg-gray-50 rounded-lg p-6">
          <ul className="space-y-3">
            {performanceInsights.trends.map((trend, index) => (
              <li key={index} className="flex items-start">
                <TrendingUp size={20} className="text-indigo-600 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">{trend}</span>
              </li>
            ))}
          </ul>
      </div>
      </motion.div>

      {/* Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="lg:col-span-1 bg-white rounded-xl shadow-md p-6"
      >
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Recommendations</h3>
        <div className="bg-gray-50 rounded-lg p-6">
          <ul className="space-y-3">
            {performanceInsights.recommendations.map((recommendation, index) => (
              <li key={index} className="flex items-start">
                <Sparkles size={20} className="text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">{recommendation}</span>
              </li>
            ))}
          </ul>
      </div>
    </motion.div>
  </div>
)
}

export default CandidateDashboard
