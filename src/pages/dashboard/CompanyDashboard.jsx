"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Briefcase,
  Users,
  Clock,
  Plus,
  Search,
  Eye,
  Edit,
  Trash,
  Building,
  AlertCircle,
  Mail,
  Globe,
  X,
  BarChart2,
  TrendingUp,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Layers,
} from "lucide-react"
import CompanyProfileForm from "../../components/dashboard/CompanyProfileForm"
import { JobPostingForm } from "../../components/dashboard/JobPostingForm"
import customFetch from "../../lib/customFetch"
import { useNavigate } from "react-router-dom"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';


const CompanyDashboard = () => {
  const [activeTab, setActiveTab] = useState("jobs")
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("newest")
  const [statusFilter, setStatusFilter] = useState("all")
  const [expandedJob, setExpandedJob] = useState(null)
  const [showCompanyForm, setShowCompanyForm] = useState(false)
  const [showJobForm, setShowJobForm] = useState(false)
  const [companyProfile, setCompanyProfile] = useState(null)
  const [notification, setNotification] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [jobs, setJobs] = useState([])
  const [jobStats, setJobStats] = useState({})
  const [loadingStats, setLoadingStats] = useState({})
  const [editingJob, setEditingJob] = useState(null)
  const [applicants, setApplicants] = useState([])
  const [loadingApplicants, setLoadingApplicants] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState(null)
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [selectedApplication, setSelectedApplication] = useState(null)
  const [statusNote, setStatusNote] = useState("")
  const [companyStats, setCompanyStats] = useState({
    activeJobs: 0,
    totalApplicants: 0,
    applicationsByStatus: {
      REJECTED: 0,
      PENDING: 0,
      APPROVED: 0,
      VALIDATING: 0,
    },
  })
  const [deletingJob, setDeletingJob] = useState(null)
  const [showApplicantsModal, setShowApplicantsModal] = useState(false)
  const [modalApplicants, setModalApplicants] = useState([])
  const [modalApplicantsLoading, setModalApplicantsLoading] = useState(false)
  const [modalApplicantsError, setModalApplicantsError] = useState(null)
  const [modalJobTitle, setModalJobTitle] = useState("")
  const [recentActivities, setRecentActivities] = useState([])
  const [showJobDetailModal, setShowJobDetailModal] = useState(false)
  const [jobDetail, setJobDetail] = useState(null)
  const [jobDetailLoading, setJobDetailLoading] = useState(false)
  const [jobDetailError, setJobDetailError] = useState(null)
  const [statusSelectValue, setStatusSelectValue] = useState("")
  const navigate = useNavigate()


  

  useEffect(() => {
    window.scrollTo(0, 0)
    fetchCurrentUser()
  }, [])

  // console.log(jobs)

  const fetchCurrentUser = async () => {
    try {
      setIsLoading(true)
      const response = await customFetch.get("/current-user")
      const user = response.data
      // console.log(user)
      setCurrentUser(user)

      // Check if user has Company role
      if (user.role !== "Company") {
        setError("You don't have permission to access this page. Only Company users can access the dashboard.")
        setIsLoading(false)
        return
      }

      // If user has a companyId, fetch company profile and jobs
      if (user.companyId) {
        await Promise.all([fetchCompanyProfile(user.companyId), fetchCompanyJobs(user.companyId)])
      }
    } catch (error) {
      console.error("Error fetching current user:", error)
      setError("Failed to load user data. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchCompanyProfile = async (companyId) => {
    try {
      const response = await customFetch.get(`/companies/${companyId}`)
      setCompanyProfile(response.data)
    } catch (error) {
      console.error("Error fetching company profile:", error)
      setError("Failed to load company profile. Please try again.")
    }
  }

  const fetchCompanyJobs = async (companyId) => {
    try {
      const response = await customFetch.get(`/jobs/company/${companyId}`)
      setJobs(response.data)

      // Fetch stats for all jobs
      response.data.forEach((job) => {
        fetchJobStats(job.id)
      })
    } catch (error) {
      console.error("Error fetching company jobs:", error)
      setError("Failed to load company jobs. Please try again.")
    }
  }

  const fetchJobStats = async (jobId) => {
    if (jobStats[jobId] || loadingStats[jobId]) return

    try {
      setLoadingStats((prev) => ({ ...prev, [jobId]: true }))
      const response = await customFetch.get(`/applications/job/${jobId}/stats`)
      setJobStats((prev) => ({ ...prev, [jobId]: response.data }))
    } catch (error) {
      console.error("Error fetching job stats:", error)
    } finally {
      setLoadingStats((prev) => ({ ...prev, [jobId]: false }))
    }
  }

  const fetchApplicants = async (companyId) => {
    try {
      setLoadingApplicants(true)
      const response = await customFetch.get(`/applications/company/${companyId}/applicants`)
      setApplicants(response.data)
    } catch (error) {
      console.error("Error fetching applicants:", error)
      setError("Failed to load applicants. Please try again.")
    } finally {
      setLoadingApplicants(false)
    }
  }

  useEffect(() => {
    if (currentUser?.companyId && activeTab === "applicants") {
      fetchApplicants(currentUser.companyId)
    }
  }, [currentUser?.companyId, activeTab])

  const toggleJobExpand = (jobId) => {
    setExpandedJob(expandedJob === jobId ? null : jobId)
  }

  const showNotification = (type, message) => {
    setNotification({ type, message })
    // Auto-hide notification after 3 seconds
    setTimeout(() => {
      setNotification(null)
    }, 3000)
  }

  const handleCompanyProfileSubmit = async (data) => {
    try {
      setIsLoading(true)

      if (currentUser?.companyId) {
        // Update existing company
        await customFetch.put(`/companies/${currentUser.companyId}`, data)
        showNotification("success", "Company profile updated successfully!")
      } else {
        // Create new company
        const response = await customFetch.post("/companies", data)
        await fetchCurrentUser() // Refresh user data to get new companyId
        showNotification("success", "Company profile created successfully!")
      }

      // Fetch updated company profile
      if (currentUser?.companyId) {
        await fetchCompanyProfile(currentUser.companyId)
      }
    } catch (error) {
      console.error("Error updating company profile:", error)
      showNotification("error", "Failed to update company profile. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handlePostNewJob = () => {
    navigate("/dashboard/post-job")
  }

  const handleEditJob = async (jobData) => {
    try {
      setIsLoading(true)
      await customFetch.put(`/jobs/${editingJob.id}`, jobData)
      showNotification("success", "Job updated successfully!")
      setShowJobForm(false)
      setEditingJob(null)
      // Refresh jobs list
      if (currentUser?.companyId) {
        await fetchCompanyJobs(currentUser.companyId)
      }
    } catch (error) {
      console.error("Error updating job:", error)
      showNotification("error", "Failed to update job. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusUpdate = async (applicationId, newStatus, notes) => {
    try {
      setUpdatingStatus(applicationId)
      await customFetch.put(`/applications/${applicationId}/status`, {
        status: newStatus,
        notes: notes,
      })

      // Refresh applicants list
      if (currentUser?.companyId) {
        await fetchApplicants(currentUser.companyId)
      }

      showNotification("success", "Application status updated successfully")
      setShowStatusModal(false)
      setSelectedApplication(null)
      setStatusNote("")
    } catch (error) {
      console.error("Error updating status:", error)
      showNotification("error", "Failed to update application status")
    } finally {
      setUpdatingStatus(null)
    }
  }

  const fetchCompanyStats = async (companyId) => {
    try {
      const response = await customFetch.get(`/stats/company/${companyId}`)
      setCompanyStats(response.data)
    } catch (error) {
      console.error("Error fetching company stats:", error)
      setError("Failed to load company statistics. Please try again.")
    }
  }

  useEffect(() => {
    if (currentUser?.companyId) {
      fetchCompanyStats(currentUser.companyId)
    }
  }, [currentUser?.companyId])

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job? This action cannot be undone.")) {
      return
    }

    try {
      setDeletingJob(jobId)
      await customFetch.delete(`/jobs/${jobId}`)

      // Refresh jobs list
      if (currentUser?.companyId) {
        await fetchCompanyJobs(currentUser.companyId)
        await fetchCompanyStats(currentUser.companyId)
      }

      showNotification("success", "Job deleted successfully")
    } catch (error) {
      console.error("Error deleting job:", error)
      showNotification("error", "Failed to delete job. Please try again.")
    } finally {
      setDeletingJob(null)
    }
  }

  const handleViewAllApplicants = async (jobId, jobTitle) => {
    setShowApplicantsModal(true)
    setModalApplicants([])
    setModalApplicantsLoading(true)
    setModalApplicantsError(null)
    setModalJobTitle(jobTitle)
    try {
      const response = await customFetch.get(`/applications/job/${jobId}/detailed`)
      setModalApplicants(response.data)
    } catch (error) {
      setModalApplicantsError("Failed to load applicants. Please try again.")
    } finally {
      setModalApplicantsLoading(false)
    }
  }

  const handleViewJobDetail = async (jobId) => {
    setShowJobDetailModal(true)
    setJobDetail(null)
    setJobDetailLoading(true)
    setJobDetailError(null)
    try {
      const response = await customFetch.get(`/jobs/${jobId}`)
      setJobDetail(response.data)
    } catch (error) {
      setJobDetailError("Failed to load job details. Please try again.")
    } finally {
      setJobDetailLoading(false)
    }
  }

  // Filter and sort jobs
  const filteredJobs = jobs
    .filter((job) => {
      // Filter by search term
      if (searchTerm && !job.title.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false
      }

      // Filter by status
      if (statusFilter !== "all" && job.status.toLowerCase() !== statusFilter) {
        return false
      }

      return true
    })
    .sort((a, b) => {
      // Sort by selected option
      if (sortBy === "newest") {
        return new Date(b.postedDate) - new Date(a.postedDate)
      } else if (sortBy === "applicants") {
        return b.applicantsCount - a.applicantsCount
      } else if (sortBy === "views") {
        return b.views - a.views
      }
      return 0
    })

  // Filter applicants
  const filteredApplicants = applicants.filter((applicant) => {
    if (
      searchTerm &&
      !applicant.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !applicant.jobTitle.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false
    }

    if (statusFilter !== "all" && applicant.status.toLowerCase() !== statusFilter.toLowerCase()) {
      return false
    }

    return true
  })

  // Fetch recent activities
  useEffect(() => {
    const fetchRecentActivities = async () => {
      if (!currentUser?.companyId) return;
      try {
        // Fetch jobs and applications for this company
        const [jobsRes, applicantsRes] = await Promise.all([
          customFetch.get(`/jobs/company/${currentUser.companyId}`),
          customFetch.get(`/applications/company/${currentUser.companyId}`)
        ])
        const jobs = jobsRes.data || [];
        const applications = applicantsRes.data || [];
        let activities = [];

        // New Job Posted
        jobs.forEach(job => {
          activities.push({
            type: 'job',
            title: 'New Job Posted',
            description: job.title,
            time: job.postedDate,
            icon: <Briefcase size={16} className="text-indigo-500" />,
            color: 'indigo',
            createdAt: job.postedDate
          })
        })

        // New Applicant & Application Approved
        applications.forEach(app => {
          // New Applicant
          activities.push({
            type: 'applicant',
            title: 'New Applicant',
            description: `${app.userName} applied for ${app.jobTitle}`,
            time: app.appliedAt,
            icon: <Users size={16} className="text-blue-500" />,
            color: 'blue',
            createdAt: app.appliedAt
          })
          // Application Approved
          if (app.status === 'APPROVED') {
            activities.push({
              type: 'approved',
              title: 'Application Approved',
              description: `${app.userName} was approved for ${app.jobTitle}`,
              time: app.approvedAt || app.updatedAt || app.appliedAt,
              icon: <CheckCircle size={16} className="text-green-500" />,
              color: 'green',
              createdAt: app.updatedAt || app.approvedAt || app.appliedAt
            })
          }
        })

        // Sort by most recent
        activities = activities.filter(a => a.createdAt).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setRecentActivities(activities.slice(0, 5)); // Show only the 5 most recent
      } catch (err) {
        // fallback: do nothing
      }
    }
    fetchRecentActivities();
  }, [currentUser?.companyId, jobs, applicants])

  // When opening the modal, initialize the select value
  useEffect(() => {
    if (showStatusModal && selectedApplication) {
      setStatusSelectValue(selectedApplication.status || "PENDING");
    }
  }, [showStatusModal, selectedApplication]);

  // If loading, show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 sm:pt-24 pb-8 sm:pb-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-t-2 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-sm sm:text-base text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  // If error, show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 sm:pt-24 pb-8 sm:pb-16 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 sm:h-12 sm:w-12 text-red-500 mx-auto" />
          <p className="mt-4 text-sm sm:text-base text-gray-600">{error}</p>
          {currentUser?.role !== "Company" ? (
            <button
              onClick={() => navigate("/jobs")}
              className="mt-4 px-4 py-2 bg-indigo-600 text-sm sm:text-base text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Go to Jobs
            </button>
          ) : (
            <button
              onClick={fetchCurrentUser}
              className="mt-4 px-4 py-2 bg-indigo-600 text-sm sm:text-base text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    )
  }

  // If user doesn't have a company, show only the company creation form
  if (!currentUser?.companyId) {
    return (
      <div className="min-h-screen bg-gray-50 mt-8 sm:mt-10 mb-8 sm:mb-10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-6 sm:mb-8 pt-4 sm:pt-8"
            >
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Welcome to Aipply</h1>
              <p className="text-sm sm:text-base text-gray-600 mt-2">Create your company profile to get started</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <CompanyProfileForm onClose={() => {}} onSubmit={handleCompanyProfileSubmit} isCreateOnly={true} />
            </motion.div>
          </div>
        </div>
      </div>
    )
  }

  const statusData = [
    { label: 'Pending', value: companyStats.applicationsByStatus.PENDING || 0, color: '#facc15' },
    { label: 'Validating', value: companyStats.applicationsByStatus.VALIDATING || 0, color: '#3b82f6' },
    { label: 'Approved', value: companyStats.applicationsByStatus.APPROVED || 0, color: '#22c55e' },
    { label: 'Rejected', value: companyStats.applicationsByStatus.REJECTED || 0, color: '#ef4444' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-16 sm:pt-24 pb-8 sm:pb-16">
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`fixed top-16 sm:top-20 right-4 z-50 p-3 sm:p-4 rounded-lg shadow-lg ${
            notification.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          <div className="flex items-center">
            {notification.type === "success" ? (
              <CheckCircleIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            ) : (
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            )}
            <p className="text-sm sm:text-base">{notification.message}</p>
          </div>
        </motion.div>
      )}

      <div className="container mx-auto px-4 md:px-6">
        {/* Modern Header with Gradient Background */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative mb-6 sm:mb-8 rounded-2xl overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 opacity-90"></div>
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1074&q=80')] opacity-10 mix-blend-overlay"></div>
          <div className="relative z-10 px-4 sm:px-6 py-8 sm:py-10 md:py-12 flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">Company Dashboard</h1>
              <p className="text-sm sm:text-base text-indigo-100 mt-2 max-w-xl">
                Manage your job postings, track applicants, and grow your team with AIpply's intelligent hiring platform
              </p>
            </div>

            <div className="mt-6 md:mt-0 flex flex-wrap gap-3">
              {!companyProfile ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowCompanyForm(true)}
                  className="w-full sm:w-auto flex items-center justify-center px-4 sm:px-5 py-2 sm:py-2.5 bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors shadow-md text-sm sm:text-base"
                >
                  <Building size={16} className="mr-2" />
                  Create Company Profile
                </motion.button>
              ) : (
                <>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowCompanyForm(true)}
                    className="w-full sm:w-auto flex items-center justify-center px-4 sm:px-5 py-2 sm:py-2.5 bg-white/20 backdrop-blur-sm text-white border border-white/30 rounded-lg hover:bg-white/30 transition-colors text-sm sm:text-base"
                  >
                    <Edit size={16} className="mr-2" />
                    Edit Profile
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handlePostNewJob}
                    className="w-full sm:w-auto flex items-center justify-center px-4 sm:px-5 py-2 sm:py-2.5 bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors shadow-md text-sm sm:text-base"
                  >
                    <Plus size={16} className="mr-2" />
                    Post New Job
                  </motion.button>
                </>
              )}
            </div>
          </div>
        </motion.div>

        {/* Company Profile Card - Enhanced */}
        {companyProfile && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white rounded-xl shadow-md overflow-hidden mb-6 sm:mb-8 border border-gray-100 hover:shadow-lg transition-shadow duration-300"
          >
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-16 sm:h-24"></div>
            <div className="px-4 sm:px-6 py-4 sm:py-5 flex flex-col md:flex-row md:items-center">
              <div className="flex-shrink-0 -mt-8 sm:-mt-12 md:-mt-16 mb-4 md:mb-0 md:mr-6">
                <div className="w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-full bg-white p-1 shadow-lg">
                  <div className="w-full h-full rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 flex items-center justify-center text-white text-xl sm:text-2xl md:text-3xl font-bold">
                    {companyProfile.companyName.charAt(0)}
                  </div>
                </div>
              </div>

              <div className="flex-grow">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{companyProfile.companyName}</h2>
                    <p className="text-sm sm:text-base text-gray-600 mb-3 max-w-2xl">{companyProfile.description}</p>
                    <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                      <span className="flex items-center px-2 sm:px-3 py-1 bg-indigo-50 rounded-full">
                        <Mail size={14} className="mr-1 sm:mr-2 text-indigo-500" />
                        {companyProfile.companyEmail}
                      </span>
                      {companyProfile.website && (
                        <span className="flex items-center px-2 sm:px-3 py-1 bg-purple-50 rounded-full">
                          <Globe size={14} className="mr-1 sm:mr-2 text-purple-500" />
                          <a
                            href={companyProfile.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 hover:underline"
                          >
                            {companyProfile.website.replace(/^https?:\/\/(www\.)?/, "")}
                          </a>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 md:mt-0">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowCompanyForm(true)}
                      className="w-full sm:w-auto flex items-center justify-center px-3 sm:px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors text-sm sm:text-base"
                    >
                      <Edit size={14} className="mr-2" />
                      Edit Profile
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Dashboard Stats - Bento Grid */}
        <div className="mb-6 sm:mb-8 grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6">
          {/* Main Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="md:col-span-4 bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300"
          >
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Active Jobs</h3>
                <div className="p-3 bg-indigo-50 rounded-full">
                  <Briefcase size={20} className="text-indigo-600" />
                </div>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-4xl font-bold text-gray-900">{companyStats.activeJobs}</p>
                  <p className="text-sm text-gray-500 mt-1">Currently active job postings</p>
                </div>
                <div className="flex items-center text-green-600 bg-green-50 px-3 py-1 rounded-full">
                  <ArrowUpRight size={16} className="mr-1" />
                  <span className="text-sm font-medium">Active</span>
                </div>
              </div>
            </div>
            <div className="h-1 w-full bg-gradient-to-r from-indigo-500 to-purple-500"></div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="md:col-span-4 bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300"
          >
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Total Applicants</h3>
                <div className="p-3 bg-blue-50 rounded-full">
                  <Users size={20} className="text-blue-600" />
                </div>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-4xl font-bold text-gray-900">{companyStats.totalApplicants}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {companyStats.applicationsByStatus.PENDING} pending, {companyStats.applicationsByStatus.VALIDATING}{" "}
                    validating
                  </p>
                </div>
                <div className="flex items-center text-green-600 bg-green-50 px-3 py-1 rounded-full">
                  <ArrowUpRight size={16} className="mr-1" />
                  <span className="text-sm font-medium">Growing</span>
                </div>
              </div>
            </div>
            <div className="h-1 w-full bg-gradient-to-r from-blue-500 to-cyan-500"></div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="md:col-span-4 bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300"
          >
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Application Status</h3>
                <div className="p-3 bg-green-50 rounded-full">
                  <CheckCircle size={20} className="text-green-600" />
                </div>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-4xl font-bold text-gray-900">{companyStats.applicationsByStatus.APPROVED}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Approved ({companyStats.applicationsByStatus.REJECTED} rejected)
                  </p>
                </div>
                <div
                  className={`flex items-center ${companyStats.applicationsByStatus.APPROVED > companyStats.applicationsByStatus.REJECTED ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50"} px-3 py-1 rounded-full`}
                >
                  {companyStats.applicationsByStatus.APPROVED > companyStats.applicationsByStatus.REJECTED ? (
                    <>
                      <ArrowUpRight size={16} className="mr-1" />
                      <span className="text-sm font-medium">Good</span>
                    </>
                  ) : (
                    <>
                      <ArrowDownRight size={16} className="mr-1" />
                      <span className="text-sm font-medium">Low</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="h-1 w-full bg-gradient-to-r from-green-500 to-emerald-500"></div>
          </motion.div>

          {/* Application Status Chart - Larger card spanning 8 columns */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="md:col-span-8 bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-shadow duration-300"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Application Overview</h3>
                <p className="text-sm text-gray-500">Distribution of applications by status</p>
              </div>
              <div className="p-3 bg-indigo-50 rounded-full">
                <BarChart2 size={20} className="text-indigo-600" />
              </div>
            </div>

            {/* Custom Bar Chart */}
            <div className="w-full max-w-2xl mx-auto">
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={statusData} margin={{ top: 30, right: 30, left: 0, bottom: 10 }} barCategoryGap={40}>
                  <defs>
                    <linearGradient id="pendingGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#fde68a" />
                      <stop offset="100%" stopColor="#facc15" />
                    </linearGradient>
                    <linearGradient id="validatingGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#93c5fd" />
                      <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                    <linearGradient id="approvedGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6ee7b7" />
                      <stop offset="100%" stopColor="#22c55e" />
                    </linearGradient>
                    <linearGradient id="rejectedGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#fca5a5" />
                      <stop offset="100%" stopColor="#ef4444" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="label" tick={{ fontSize: 14, fill: '#64748b', fontWeight: 500 }} axisLine={false} tickLine={false} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 14, fill: '#64748b', fontWeight: 500 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: 12, background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
                    labelStyle={{ fontWeight: 600, color: '#6366f1' }}
                    cursor={{ fill: 'rgba(99,102,241,0.08)' }}
                  />
                  <Bar
                    dataKey="value"
                    radius={[12, 12, 0, 0]}
                    minPointSize={4}
                    isAnimationActive={true}
                    label={{
                      position: 'top',
                      fill: '#334155',
                      fontWeight: 700,
                      fontSize: 16,
                    }}
                  >
                    <Cell key="cell-pending" fill="url(#pendingGradient)" />
                    <Cell key="cell-validating" fill="url(#validatingGradient)" />
                    <Cell key="cell-approved" fill="url(#approvedGradient)" />
                    <Cell key="cell-rejected" fill="url(#rejectedGradient)" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Recent Activity - Taller card spanning 4 columns */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="md:col-span-4 bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-shadow duration-300"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                <p className="text-sm text-gray-500">Latest updates from your dashboard</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-full">
                <Clock size={20} className="text-purple-600" />
              </div>
            </div>

            <div className="space-y-5">
              {recentActivities.length === 0 ? (
                <p className="text-gray-500 text-center">No recent activity.</p>
              ) : (
                recentActivities.map((activity, idx) => (
                  <ActivityItem
                    key={idx}
                    icon={activity.icon}
                    title={activity.title}
                    description={activity.description}
                    time={activity.createdAt ? new Date(activity.createdAt).toLocaleString() : ''}
                    color={activity.color}
                  />
                ))
              )}
            </div>
          </motion.div>

          {/* Additional Bento Grid cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="md:col-span-6 bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-shadow duration-300"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Top Performing Jobs</h3>
                <p className="text-sm text-gray-500">Jobs with the most applicants</p>
              </div>
              <div className="p-3 bg-green-50 rounded-full">
                <TrendingUp size={20} className="text-green-600" />
              </div>
            </div>

            <div className="space-y-4">
              {jobs
                .sort((a, b) => (jobStats[b.id]?.totalApplicants || 0) - (jobStats[a.id]?.totalApplicants || 0))
                .slice(0, 3)
                .map((job, index) => (
                  <div
                    key={job.id}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          index === 0
                            ? "bg-yellow-100 text-yellow-600"
                            : index === 1
                            ? "bg-gray-100 text-gray-600"
                            : "bg-orange-100 text-orange-600"
                        }`}
                      >
                        {index + 1}
                      </div>
                      <div className="ml-3">
                        <p className="font-medium text-gray-900">{job.title}</p>
                        <p className="text-sm text-gray-500">{jobStats[job.id]?.totalApplicants || 0} applicants</p>
                      </div>
                    </div>
                    <button
                      className="text-indigo-600 text-sm font-medium hover:underline focus:outline-none"
                      onClick={() => handleViewJobDetail(job.id)}
                    >
                      View
                    </button>
                  </div>
                ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
            className="md:col-span-6 bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-shadow duration-300"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Hiring Progress</h3>
                <p className="text-sm text-gray-500">Status of your hiring pipeline</p>
              </div>
              <div className="p-3 bg-indigo-50 rounded-full">
                <Layers size={20} className="text-indigo-600" />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-700">Applications</span>
                  <span className="font-medium text-gray-900">{companyStats.totalApplicants}</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: "100%" }}></div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-700">Screening</span>
                  <span className="font-medium text-gray-900">{companyStats.applicationsByStatus.VALIDATING}</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{
                      width: `${(companyStats.applicationsByStatus.VALIDATING / companyStats.totalApplicants) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-700">Approved</span>
                  <span className="font-medium text-gray-900">{companyStats.applicationsByStatus.APPROVED}</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full"
                    style={{
                      width: `${(companyStats.applicationsByStatus.APPROVED / companyStats.totalApplicants) * 100}%`,
                    }}
                  ></div>
                </div>
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
              active={activeTab === "jobs"}
              onClick={() => setActiveTab("jobs")}
              label="Posted Jobs"
              count={jobs.length}
            />
            <TabButton
              active={activeTab === "applicants"}
              onClick={() => setActiveTab("applicants")}
              label="Applicants"
              count={applicants.length}
            />
          </div>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mb-6 flex flex-col gap-4"
        >
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder={activeTab === "jobs" ? "Search jobs..." : "Search applicants..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 transition-colors"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex items-center">
              <label htmlFor="statusFilter" className="mr-2 text-xs sm:text-sm text-gray-600">
                <Filter size={14} className="inline mr-1" /> Filter:
              </label>
              <select
                id="statusFilter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full sm:w-auto bg-white border border-gray-200 text-gray-700 py-2 px-3 rounded-lg focus:outline-none focus:border-indigo-500 text-sm"
              >
                <option value="all">All Status</option>
                {activeTab === "jobs" ? (
                  <>
                    <option value="active">Active</option>
                    <option value="closed">Closed</option>
                  </>
                ) : (
                  <>
                    <option value="pending">Pending</option>
                    <option value="validating">Validating</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </>
                )}
              </select>
            </div>

            {activeTab === "jobs" && (
              <div className="flex items-center">
                <label htmlFor="sortBy" className="mr-2 text-xs sm:text-sm text-gray-600">
                  <Layers size={14} className="inline mr-1" /> Sort:
                </label>
                <select
                  id="sortBy"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full sm:w-auto bg-white border border-gray-200 text-gray-700 py-2 px-3 rounded-lg focus:outline-none focus:border-indigo-500 text-sm"
                >
                  <option value="newest">Newest</option>
                  <option value="applicants">Most Applicants</option>
                  <option value="views">Most Views</option>
                </select>
              </div>
            )}
          </div>
        </motion.div>

        {/* Jobs List */}
        {activeTab === "jobs" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            {filteredJobs.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4 sm:p-6 text-center">
                <p className="text-sm sm:text-base text-gray-600">No jobs found.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredJobs.map((job) => (
                  <motion.div
                    key={job.id}
                    className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-3">
                        <h2 className="text-lg sm:text-xl font-semibold text-gray-900">{job.title}</h2>
                        <div className="flex flex-wrap gap-2 text-xs sm:text-sm text-gray-500">
                          <span className="flex items-center">
                            <Clock size={14} className="mr-1" />
                            {new Date(job.postedDate).toLocaleDateString()}
                          </span>
                          <span className="flex items-center">
                            <Users size={14} className="mr-1" />
                            {jobStats[job.id]?.totalApplicants || 0} Applicants
                          </span>
                        </div>
                      </div>
                      <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 line-clamp-2">{job.description?.substring(0, 150)}...</p>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {Array.isArray(job.techStack)
                          ? job.techStack.map((tech, idx) => (
                              <span key={idx} className="px-2 sm:px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs sm:text-sm font-medium">
                                {tech}
                              </span>
                            ))
                          : job.techStack && typeof job.techStack === 'string'
                            ? job.techStack.split(',').map((tech, idx) => (
                                <span key={idx} className="px-2 sm:px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs sm:text-sm font-medium">
                                  {tech.trim()}
                                </span>
                              ))
                            : null}
                      </div>
                      <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-gray-700 mb-3 sm:mb-4">
                        <span><span className="font-semibold">Experience:</span> {job.yearsOfExperience} yrs</span>
                        <span><span className="font-semibold">Type:</span> {job.jobType}</span>
                        <span><span className="font-semibold">Location:</span> {job.location}</span>
                        <span><span className="font-semibold">Salary:</span> ${job.salary ? job.salary.toLocaleString() : 'Not specified'}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
                        <div className="flex flex-wrap gap-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              setEditingJob(job)
                              setShowJobForm(true)
                            }}
                            className="flex-1 sm:flex-none flex items-center justify-center px-3 sm:px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors text-sm"
                          >
                            <Edit size={14} className="mr-2" />
                            Edit
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleDeleteJob(job.id)}
                            className="flex-1 sm:flex-none flex items-center justify-center px-3 sm:px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm"
                          >
                            <Trash size={14} className="mr-2" />
                            Delete
                          </motion.button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleViewJobDetail(job.id)}
                            className="flex-1 sm:flex-none flex items-center justify-center px-3 sm:px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors text-sm"
                          >
                            <Eye size={14} className="mr-2" />
                            View
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleViewAllApplicants(job.id, job.title)}
                            className="flex-1 sm:flex-none flex items-center justify-center px-3 sm:px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm"
                          >
                            <Users size={14} className="mr-2" />
                            View Applicants
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Applicants List */}
        {activeTab === "applicants" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            {loadingApplicants ? (
              <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4 sm:p-6 text-center">
                <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 border-t-2 border-b-2 border-indigo-600 mx-auto"></div>
                <p className="mt-4 text-sm sm:text-base text-gray-600">Loading applicants...</p>
              </div>
            ) : filteredApplicants.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4 sm:p-6 text-center">
                <p className="text-sm sm:text-base text-gray-600">No applicants found.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredApplicants.map((applicant) => (
                  <motion.div
                    key={applicant.applicationId}
                    className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-3">
                        <div className="flex items-center">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                            <span className="text-indigo-600 font-medium text-sm sm:text-base">
                              {applicant.applicantName?.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">{applicant.applicantName}</h2>
                            <p className="text-xs sm:text-sm text-gray-500">Applied for: {applicant.jobTitle}</p>
                          </div>
                        </div>
                        <span
                          className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
                            applicant.status?.toLowerCase() === "pending"
                              ? "bg-yellow-50 text-yellow-700"
                              : applicant.status?.toLowerCase() === "validating"
                                ? "bg-blue-50 text-blue-700"
                                : applicant.status?.toLowerCase() === "approved"
                                  ? "bg-green-50 text-green-700"
                                  : "bg-red-50 text-red-700"
                          }`}
                        >
                          {applicant.status}
                        </span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
                        <p className="text-sm text-gray-600">Email: {applicant.applicantEmail}</p>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            setSelectedApplication({ ...applicant, id: applicant.applicationId })
                            setShowStatusModal(true)
                          }}
                          className="w-full sm:w-auto flex items-center justify-center px-3 sm:px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors text-sm"
                        >
                          Update Status
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Company Profile Form Modal */}
        {showCompanyForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="bg-white rounded-xl shadow-lg max-w-4xl w-full p-8"
            >
              <CompanyProfileForm
                company={companyProfile}
                initialData={companyProfile}
                onClose={() => setShowCompanyForm(false)}
                onSubmit={handleCompanyProfileSubmit}
                isCreateOnly={false}
              />
            </motion.div>
          </div>
        )}

        {/* Job Form Modal */}
        {showJobForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="bg-white rounded-xl shadow-lg max-w-5xl w-full p-8"
            >
              <JobPostingForm
                job={editingJob}
                initialData={editingJob}
                onClose={() => {
                  setShowJobForm(false)
                  setEditingJob(null)
                }}
                onSubmit={editingJob ? handleEditJob : handlePostNewJob}
                isEditMode={!!editingJob}
                allowedJobTypes={['PART_TIME', 'HYBRID', 'FULL_TIME', 'REMOTE']}
              />
            </motion.div>
          </div>
        )}

        {/* Status Update Modal */}
        {showStatusModal && selectedApplication && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="bg-white rounded-xl shadow-lg max-w-md w-full p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Update Application Status</h2>
              <p className="text-gray-600 mb-4">Applicant: {selectedApplication.applicantName}</p>
              <div className="mb-4">
                <label htmlFor="statusNote" className="block text-gray-700 text-sm font-bold mb-2">
                  Notes:
                </label>
                <textarea
                  id="statusNote"
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  rows="4"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="statusSelect" className="block text-gray-700 text-sm font-bold mb-2">
                  Status:
                </label>
                <select
                  id="statusSelect"
                  value={statusSelectValue}
                  onChange={e => setStatusSelectValue(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="PENDING">PENDING</option>
                  <option value="VALIDATING">VALIDATING</option>
                  <option value="APPROVED">APPROVED</option>
                  <option value="REJECTED">REJECTED</option>
                </select>
              </div>
              <div className="flex justify-end gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowStatusModal(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleStatusUpdate(selectedApplication.id, statusSelectValue, statusNote)}
                  className={`px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors ${updatingStatus === selectedApplication.id ? "opacity-50 cursor-not-allowed" : ""}`}
                  disabled={updatingStatus === selectedApplication.id}
                >
                  {updatingStatus === selectedApplication.id ? "Updating..." : "Update"}
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Applicants Modal */}
        {showApplicantsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="bg-white rounded-xl shadow-lg max-w-4xl w-full p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Applicants for {modalJobTitle}</h2>
                <button className="text-gray-500 hover:text-gray-700" onClick={() => setShowApplicantsModal(false)}>
                  <X size={24} />
                </button>
              </div>

              {modalApplicantsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                  <span className="ml-2 text-gray-500">Loading applicants...</span>
                </div>
              ) : modalApplicantsError ? (
                <div className="text-red-600 py-8 text-center">{modalApplicantsError}</div>
              ) : modalApplicants.length === 0 ? (
                <div className="text-gray-600 py-8 text-center">No applicants found for this job.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 rounded-lg overflow-hidden">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Experience</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Score</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {modalApplicants.map((app) => (
                        <tr key={app.applicationId} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3">{app.userName}</td>
                          <td className="px-4 py-3">{app.userEmail}</td>
                          <td className="px-4 py-3">{app.yearsOfExperience} yrs</td>
                          <td className="px-4 py-3">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                app.status?.toLowerCase() === "pending"
                                  ? "bg-yellow-50 text-yellow-700"
                                  : app.status?.toLowerCase() === "validating"
                                    ? "bg-blue-50 text-blue-700"
                                    : app.status?.toLowerCase() === "approved"
                                      ? "bg-green-50 text-green-700"
                                      : "bg-red-50 text-red-700"
                              }`}
                            >
                              {app.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center">
                              <div className="w-16 bg-gray-200 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full ${
                                    app.interviewScore >= 80
                                      ? "bg-green-600"
                                      : app.interviewScore >= 70
                                    ? "bg-yellow-500"
                                    : "bg-red-600"
                                  }`}
                                  style={{ width: `${app.interviewScore}%` }}
                                ></div>
                              </div>
                              <span className="ml-2 text-sm">{app.interviewScore}%</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => {
                                setSelectedApplication({ ...app, id: app.applicationId })
                                setShowStatusModal(true)
                                setShowApplicantsModal(false)
                              }}
                              className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-md hover:bg-indigo-100 transition-colors text-sm"
                            >
                              Update
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          </div>
        )}

        {/* Job Detail Modal */}
        {showJobDetailModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4 sm:p-0">
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto relative"
            >
              <button
                className="absolute top-2 right-2 sm:top-4 sm:right-4 p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
                onClick={() => setShowJobDetailModal(false)}
              >
                <X size={20} className="sm:w-6 sm:h-6" />
              </button>
              <div className="p-4 sm:p-6 md:p-8">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 text-indigo-700">Job Details</h2>
                {jobDetailLoading ? (
                  <div className="flex items-center justify-center py-8 sm:py-12">
                    <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 border-b-2 border-indigo-600"></div>
                    <span className="ml-3 text-sm sm:text-base text-gray-500">Loading job details...</span>
                  </div>
                ) : jobDetailError ? (
                  <div className="text-red-600 py-8 sm:py-12 text-center text-sm sm:text-base">{jobDetailError}</div>
                ) : jobDetail ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
                    {/* Job Info Card */}
                    <div className="bg-gray-50 rounded-xl p-4 sm:p-6 flex flex-col justify-between shadow-sm">
                      <div>
                        <div className="flex flex-col gap-1 mb-3 sm:mb-4">
                          <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900">{jobDetail.title}</h3>
                          <p className="text-sm sm:text-base text-gray-600">{jobDetail.company.companyName}</p>
                        </div>
                        <div className="text-sm sm:text-base text-gray-700 mb-3 sm:mb-4">{jobDetail.description}</div>
                        <div className="flex flex-wrap gap-2 mb-3 sm:mb-4">
                          {jobDetail.techStack?.map((tech, idx) => (
                            <span key={idx} className="px-2 sm:px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs sm:text-sm font-medium">
                              {tech}
                            </span>
                          ))}
                        </div>
                        <div className="flex flex-col gap-2 text-sm sm:text-base text-gray-700 mb-2">
                          <div className="flex items-center gap-2">
                            <Clock size={14} className="mr-1 text-indigo-500" />
                            <span>Posted: {new Date(jobDetail.postedDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Type:</span> {jobDetail.jobType}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Location:</span> {jobDetail.location}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Experience:</span> {jobDetail.yearsOfExperience} years
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <span className="text-lg sm:text-xl md:text-2xl font-bold text-indigo-700">${jobDetail.salary?.toLocaleString() || 'Not specified'}</span>
                        <div className="flex flex-col text-right text-xs sm:text-sm text-gray-600">
                          <span><span className="font-medium">Mock Interview Required:</span> {jobDetail.mockInterviewRequired ? 'Yes' : 'No'}</span>
                          {jobDetail.mockInterviewRequired && (
                            <>
                              <span><span className="font-medium">Minimum Score:</span> {jobDetail.minimumMockScore || 'Not specified'}%</span>
                              <span><span className="font-medium">Interview Weight:</span> {jobDetail.mockInterviewPercentage || 'Not specified'}%</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    {/* Company Info Card */}
                    <div className="bg-white rounded-xl p-4 sm:p-6 flex flex-col justify-between border border-gray-100 shadow-sm">
                      <div>
                        <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">About the Company</h4>
                        <div className="text-sm sm:text-base text-gray-700 mb-3">{jobDetail.company.description}</div>
                      </div>
                      <div className="flex flex-wrap gap-3 text-xs sm:text-sm text-gray-600 mt-2 items-center">
                        <span className="flex items-center">
                          <Mail size={14} className="mr-1" />
                          {jobDetail.company.companyEmail}
                        </span>
                        {jobDetail.company.website && (
                          <span className="flex items-center">
                            <Globe size={14} className="mr-1" />
                            <a
                              href={jobDetail.company.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-indigo-600 hover:underline"
                            >
                              {jobDetail.company.website.replace(/^https?:\/\/(www\.)?/, "")}
                            </a>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}

// Helper Components
const BarChartItem = ({ label, value, maxValue, color, gradient }) => (
  <div className="flex flex-col items-center">
    <div className="relative h-full w-12">
      <div
        className={`absolute bottom-0 w-full ${color} rounded-t-md`}
        style={{ height: `${(value / maxValue) * 100}%` }}
      >
        <div className={`absolute inset-0 bg-gradient-to-t ${gradient} opacity-70`}></div>
      </div>
    </div>
    <p className="text-xs text-gray-500 mt-2">{label}</p>
    <p className="text-sm font-medium text-gray-700">{value}</p>
  </div>
)

const ActivityItem = ({ icon, title, description, time, color }) => (
  <div className="flex items-center gap-4">
    <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-${color}-50`}>{icon}</div>
    <div>
      <h4 className="text-sm font-medium text-gray-900">{title}</h4>
      <p className="text-xs text-gray-500">{description}</p>
      <p className="text-xs text-gray-400">{time}</p>
    </div>
  </div>
)

const TabButton = ({ active, onClick, label, count }) => (
  <button
    onClick={onClick}
    className={`relative pb-4 ${active ? "text-indigo-600 font-medium" : "text-gray-600 hover:text-gray-900"}`}
  >
    <span className="flex items-center">
      {label}
      <span className="ml-2 bg-gray-100 text-gray-700 text-xs font-medium px-2 py-0.5 rounded-full">{count}</span>
    </span>
    {active && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />}
  </button>
)

// Missing components
const CheckCircleIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
      clipRule="evenodd"
    />
  </svg>
)

export default CompanyDashboard
