"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Users,
  Building,
  Briefcase,
  BarChart2,
  Activity,
  Search,
  Filter,
  CheckCircle,
  AlertCircle,
  Settings,
  Bell,
  Menu,
  X,
  PieChart,
  TrendingUp,
  UserPlus,
  RefreshCw,
  Download,
  Clock,
  ArrowUpRight,
  HelpCircle,
  Layers,
  Mail,
  ArrowLeft,
  Building2,
  ChevronDown,
  Trash2,
} from "lucide-react"

import { Link } from "react-router-dom"
import { cn } from "../../lib/utils"
import customFetch from "../../lib/customFetch"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';

// Monthly data for charts
const monthlyData = {
  users: [120, 150, 180, 210, 250, 280, 320, 350, 380, 410, 450, 480],
  companies: [30, 40, 45, 55, 65, 75, 85, 95, 105, 115, 125, 135],
  jobs: [80, 100, 130, 160, 190, 220, 250, 280, 310, 340, 370, 400],
  applications: [200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750],
}

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCompanies: 0,
    totalJobs: 0,
    usersRequestingCompany: 0
  })
  const [users, setUsers] = useState([])
  const [companies, setCompanies] = useState([])
  const [jobs, setJobs] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [roleFilter, setRoleFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedUser, setSelectedUser] = useState(null)
  const [showUserModal, setShowUserModal] = useState(false)
  const [showCompanyModal, setShowCompanyModal] = useState(false)
  const [selectedCompany, setSelectedCompany] = useState(null)
  const [notification, setNotification] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [timeRange, setTimeRange] = useState("month")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [recentActivity, setRecentActivity] = useState([])
  const [growthData, setGrowthData] = useState({
    users: [],
    companies: [],
    jobs: []
  })
  const[topCompanies, setTopCompanies] = useState([])

  useEffect(() => {
    fetchDashboardData()
  }, [])

  useEffect(()=>{
    const fetchTopCompanies = async () => {
      try {
        const response = await customFetch.get('/admin/top-companies')
        setTopCompanies(response.data)
      } catch (error) {
        console.error('Error fetching top companies:', error)
        showNotification('error', 'Failed to load top companies')
      }
    }
    fetchTopCompanies()
  }, [])

  // console.log(topCompanies)

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true)
      
      // Fetch admin stats
      const statsResponse = await customFetch.get('/admin/stats')
      setStats(statsResponse.data)
      
      // Fetch users
      const usersResponse = await customFetch.get('/admin/users')
      setUsers(usersResponse.data)
      
      // Fetch companies
      const companiesResponse = await customFetch.get('/admin/companies')
      setCompanies(companiesResponse.data)
      
      // Fetch jobs
      const jobsResponse = await customFetch.get('/admin/jobs')
      setJobs(jobsResponse.data)

      // Create growth data
      const growthData = {
        users: Array(1).fill(0).map((_, i) => Math.floor(Math.random() * 100) + 50), // Example data
        companies: Array(1).fill(0).map((_, i) => Math.floor(Math.random() * 50) + 20), // Example data
        jobs: Array(1).fill(0).map((_, i) => Math.floor(Math.random() * 200) + 100) // Example data
      }
      setGrowthData(growthData)

      // Create recent activity from latest items
      const latestUser = usersResponse.data[0]
      const latestCompany = companiesResponse.data[0]
      const latestJob = jobsResponse.data[0]

      const activity = []
      if (latestUser) {
        activity.push({
          type: 'user',
          title: 'New User Registration',
          description: `${latestUser.name || latestUser.email} joined as a user`,
          time: 'Just now',
          icon: <UserPlus size={16} className="text-blue-500" />,
          color: 'blue'
        })
      }
      if (latestCompany) {
        activity.push({
          type: 'company',
          title: 'New Company Registration',
          description: `${latestCompany.companyName} created an account`,
          time: 'Just now',
          icon: <Building size={16} className="text-purple-500" />,
          color: 'purple'
        })
      }
      if (latestJob) {
        activity.push({
          type: 'job',
          title: 'New Job Posted',
          description: `${latestJob.title} position at ${latestJob.company}`,
          time: 'Just now',
          icon: <Briefcase size={16} className="text-indigo-500" />,
          color: 'indigo'
        })
      }
      setRecentActivity(activity)

    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      showNotification('error', 'Failed to load dashboard data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleUserRoleChange = async (userId, newRole) => {
    try {
      setIsLoading(true)
      // In a real application, you would update the user role via API
      // await customFetch.put(`/admin/users/${userId}/role`, { role: newRole })

      // For demo purposes, we'll update the local state
      setUsers((prevUsers) => prevUsers.map((user) => (user.id === userId ? { ...user, role: newRole } : user)))

      showNotification("success", `User role updated to ${newRole} successfully!`)
      setIsLoading(false)
    } catch (error) {
      console.error("Error updating user role:", error)
      showNotification("error", "Failed to update user role. Please try again.")
      setIsLoading(false)
    }
  }

  const handleUserStatusChange = async (userId, newStatus) => {
    try {
      setIsLoading(true)
      // In a real application, you would update the user status via API
      // await customFetch.put(`/admin/users/${userId}/status`, { status: newStatus })

      // For demo purposes, we'll update the local state
      setUsers((prevUsers) => prevUsers.map((user) => (user.id === userId ? { ...user, status: newStatus } : user)))

      showNotification("success", `User status updated to ${newStatus} successfully!`)
      setIsLoading(false)
    } catch (error) {
      console.error("Error updating user status:", error)
      showNotification("error", "Failed to update user status. Please try again.")
      setIsLoading(false)
    }
  }

  const handleCompanyStatusChange = async (companyId, newStatus) => {
    try {
      setIsLoading(true)
      // In a real application, you would update the company status via API
      // await customFetch.put(`/admin/companies/${companyId}/status`, { status: newStatus })

      // For demo purposes, we'll update the local state
      setCompanies((prevCompanies) =>
        prevCompanies.map((company) => (company.id === companyId ? { ...company, status: newStatus } : company)),
      )

      showNotification("success", `Company status updated to ${newStatus} successfully!`)
      setIsLoading(false)
    } catch (error) {
      console.error("Error updating company status:", error)
      showNotification("error", "Failed to update company status. Please try again.")
      setIsLoading(false)
    }
  }


  const showNotification = (type, message) => {
    setNotification({ type, message })
    // Auto-hide notification after 3 seconds
    setTimeout(() => {
      setNotification(null)
    }, 3000)
  }

  // Filter users based on search term, status, and role
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      searchTerm === "" ||
      (user.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (user.email?.toLowerCase() || "").includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesStatus && matchesRole;
  });

  // Filter companies based on search term and status
  const filteredCompanies = companies.filter((company) => {
    const matchesSearch =
      searchTerm === "" ||
      (company.name?.toLowerCase() || "").includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || company.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Filter jobs based on search term and status
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      searchTerm === "" ||
      (job.title?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (job.company?.companyName?.toLowerCase() || "").includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem)
  const currentCompanies = filteredCompanies.slice(indexOfFirstItem, indexOfLastItem)
  const currentJobs = filteredJobs.slice(indexOfFirstItem, indexOfLastItem)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  // If loading, show loading state
  if (isLoading && !stats) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  // If error, show error state
  if (error && !stats) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
          <p className="mt-4 text-gray-600">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex mt-14">
  {/* Sidebar */}
  <AnimatePresence>
        {(sidebarOpen || mobileMenuOpen) && (
          <motion.aside
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg border-r border-gray-200 ${
              mobileMenuOpen ? "block" : "hidden md:block"
            }`}
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <Link to="/" className="flex items-center">
                  <div className="text-2xl font-bold text-indigo-600">
                    <span className="text-gray-900">AI</span>pply
                  </div>
                </Link>
                <button
                  onClick={() => {
                    setSidebarOpen(!sidebarOpen)
                    setMobileMenuOpen(false)
                  }}
                  className="md:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-4">
                <nav className="px-4 space-y-1">
                  <SidebarLink
                    icon={<Activity />}
                    label="Dashboard"
                    active={activeTab === "dashboard"}
                    onClick={() => setActiveTab("dashboard")}
                  />
                  <SidebarLink
                    icon={<Users />}
                    label="Users"
                    active={activeTab === "users"}
                    onClick={() => setActiveTab("users")}
                  />
                  <SidebarLink
                    icon={<Building />}
                    label="Companies"
                    active={activeTab === "companies"}
                    onClick={() => setActiveTab("companies")}
                  />
                  <SidebarLink
                    icon={<Briefcase />}
                    label="Jobs"
                    active={activeTab === "jobs"}
                    onClick={() => setActiveTab("jobs")}
                  />
                  <SidebarLink
                    icon={<BarChart2 />}
                    label="Analytics"
                    active={activeTab === "analytics"}
                    onClick={() => setActiveTab("analytics")}
                  />
                  <SidebarLink
                    icon={<Settings />}
                    label="Settings"
                    active={activeTab === "settings"}
                    onClick={() => setActiveTab("settings")}
                  />
                </nav>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className={cn("flex-1 transition-all duration-300 ease-in-out", sidebarOpen ? "md:ml-64" : "md:ml-0")}>
        {/* Top Navigation */}
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center">
              <button
                onClick={() => {
                  setSidebarOpen(!sidebarOpen)
                  setMobileMenuOpen(false)
                }}
                className="hidden md:block p-2 mr-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              >
                <Menu size={20} />
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 mr-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              >
                <Menu size={20} />
              </button>
              <h1 className="text-xl font-semibold text-gray-800">Admin Dashboard</h1>
            </div>

            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 relative">
                <Bell size={20} />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="relative">
                <button className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium">
                    A
                  </div>
                  <span className="hidden md:block text-sm font-medium text-gray-700">Admin User</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          {/* Stats Overview */}
          <div className="mb-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
              >
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
                    <Users size={24} />
                  </div>
                  <div className="ml-4">
                    <h2 className="text-sm font-medium text-gray-500">Total Users</h2>
                    <p className="text-2xl font-semibold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      <span className="text-green-600">+{stats.userGrowth || 0}%</span> from last month
                    </p>
                    <div className="flex items-center mt-2">
                      <Users size={16} className="text-gray-400 mr-1" />
                      <span className="text-sm font-medium">{stats.recentUsers || 0} new</span>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
              >
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-green-100 text-green-600">
                    <Building2 size={24} />
                  </div>
                  <div className="ml-4">
                    <h2 className="text-sm font-medium text-gray-500">Total Companies</h2>
                    <p className="text-2xl font-semibold text-gray-900">{stats.totalCompanies.toLocaleString()}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      <span className="text-green-600">+{stats.companyGrowth || 0}%</span> from last month
                    </p>
                    <div className="flex items-center mt-2">
                      <Building2 size={16} className="text-gray-400 mr-1" />
                      <span className="text-sm font-medium">{stats.recentCompanies || 0} new</span>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
              >
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                    <Briefcase size={24} />
                  </div>
                  <div className="ml-4">
                    <h2 className="text-sm font-medium text-gray-500">Total Jobs</h2>
                    <p className="text-2xl font-semibold text-gray-900">{stats.totalJobs.toLocaleString()}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      <span className="text-green-600">+{stats.jobGrowth || 0}%</span> from last month
                    </p>
                    <div className="flex items-center mt-2">
                      <Briefcase size={16} className="text-gray-400 mr-1" />
                      <span className="text-sm font-medium">{stats.recentJobs || 0} new</span>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
                className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
              >
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                    <UserPlus size={24} />
                  </div>
                  <div className="ml-4">
                    <h2 className="text-sm font-medium text-gray-500">Pending Approvals</h2>
                    <p className="text-2xl font-semibold text-gray-900">{stats.usersRequestingCompany}</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Tabs */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              {/* Page Title */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
                  <p className="text-gray-600">Welcome to the admin dashboard. Here's an overview of your platform.</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="mt-4 md:mt-0 flex items-center space-x-3"
                >
                  <button className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                    <RefreshCw size={16} className="mr-2" />
                    Refresh
                  </button>
                  <button className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                    <Download size={16} className="mr-2" />
                    Export
                  </button>
                </motion.div>
              </div>

              {/* Stats Overview - Bento Grid */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Total Users */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="md:col-span-3 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Total Users</h3>
                      <div className="p-3 bg-blue-50 rounded-full">
                        <Users size={20} className="text-blue-600" />
                      </div>
                    </div>
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-3xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          <span className="text-green-600">+{stats.userGrowth || 0}%</span> from last month
                        </p>
                        <div className="flex items-center mt-2">
                          <Users size={16} className="text-gray-400 mr-1" />
                          <span className="text-sm font-medium">{stats.recentUsers || 0} new</span>
                        </div>
                      </div>
                      <div className="flex items-center text-green-600 bg-green-50 px-3 py-1 rounded-full">
                        <ArrowUpRight size={16} className="mr-1" />
                        <span className="text-sm font-medium">{stats.recentUsers || 0} new</span>
                      </div>
                    </div>
                  </div>
                  <div className="h-1 w-full bg-gradient-to-r from-blue-400 to-blue-600"></div>
                </motion.div>

                {/* Total Companies */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="md:col-span-3 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Total Companies</h3>
                      <div className="p-3 bg-purple-50 rounded-full">
                        <Building size={20} className="text-purple-600" />
                      </div>
                    </div>
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-3xl font-bold text-gray-900">{stats.totalCompanies.toLocaleString()}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          <span className="text-green-600">+{stats.companyGrowth || 0}%</span> from last month
                        </p>
                        <div className="flex items-center mt-2">
                          <Building2 size={16} className="text-gray-400 mr-1" />
                          <span className="text-sm font-medium">{stats.recentCompanies || 0} new</span>
                        </div>
                      </div>
                      <div className="flex items-center text-green-600 bg-green-50 px-3 py-1 rounded-full">
                        <ArrowUpRight size={16} className="mr-1" />
                        <span className="text-sm font-medium">{stats.recentCompanies || 0} new</span>
                      </div>
                    </div>
                  </div>
                  <div className="h-1 w-full bg-gradient-to-r from-purple-400 to-purple-600"></div>
                </motion.div>

                {/* Total Jobs */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="md:col-span-3 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Total Jobs</h3>
                      <div className="p-3 bg-indigo-50 rounded-full">
                        <Briefcase size={20} className="text-indigo-600" />
                      </div>
                    </div>
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-3xl font-bold text-gray-900">{stats.totalJobs.toLocaleString()}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          <span className="text-green-600">+{stats.jobGrowth || 0}%</span> from last month
                        </p>
                        <div className="flex items-center mt-2">
                          <Briefcase size={16} className="text-gray-400 mr-1" />
                          <span className="text-sm font-medium">{stats.recentJobs || 0} new</span>
                        </div>
                      </div>
                      <div className="flex items-center text-green-600 bg-green-50 px-3 py-1 rounded-full">
                        <ArrowUpRight size={16} className="mr-1" />
                        <span className="text-sm font-medium">{stats.recentJobs || 0} new</span>
                      </div>
                    </div>
                  </div>
                  <div className="h-1 w-full bg-gradient-to-r from-indigo-400 to-indigo-600"></div>
                </motion.div>

                {/* Active Jobs */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="md:col-span-3 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Active Jobs</h3>
                      <div className="p-3 bg-green-50 rounded-full">
                        <CheckCircle size={20} className="text-green-600" />
                      </div>
                    </div>
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-3xl font-bold text-gray-900">{(stats.activeJobs || 0).toLocaleString()}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          {stats.totalJobs > 0 ? ((stats.activeJobs || 0) / stats.totalJobs * 100).toFixed(1) : 0}% of total jobs
                        </p>
                      </div>
                      <div className="flex items-center text-green-600 bg-green-50 px-3 py-1 rounded-full">
                        <TrendingUp size={16} className="mr-1" />
                        <span className="text-sm font-medium">Active</span>
                      </div>
                    </div>
                  </div>
                  <div className="h-1 w-full bg-gradient-to-r from-green-400 to-green-600"></div>
                </motion.div>

                {/* Growth Chart - Larger card spanning 8 columns */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="md:col-span-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Platform Growth</h3>
                      <p className="text-sm text-gray-500">Total counts of users, companies, and jobs</p>
                    </div>
                  </div>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={[
                        { name: 'Users', count: stats.totalUsers },
                        { name: 'Companies', count: stats.totalCompanies },
                        { name: 'Jobs', count: stats.totalJobs },
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Bar dataKey="count">
                          <Cell key="users" fill="#6366f1" />
                          <Cell key="companies" fill="#a21caf" />
                          <Cell key="jobs" fill="#059669" />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>

                {/* Pending Approvals - Taller card spanning 4 columns */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                  className="md:col-span-4 bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Pending Approvals</h3>
                      <p className="text-sm text-gray-500">Users and companies awaiting verification</p>
                    </div>
                    <div className="p-3 bg-yellow-50 rounded-full">
                      <Clock size={20} className="text-yellow-600" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Removed Pending Users card */}
                    <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                      <div className="flex items-center">
                        <Building size={20} className="text-yellow-600 mr-3" />
                        <div>
                          <p className="font-medium text-gray-900">Pending Companies</p>
                          <p className="text-sm text-gray-500">Awaiting verification</p>
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-gray-900">{stats.usersRequestingCompany || 0}</div>
                    </div>
                    <button
                      className="w-full mt-2 px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 transition-colors text-sm font-medium"
                      onClick={() => setActiveTab('users')}
                    >
                      View All Pending Approvals
                    </button>
                  </div>
                </motion.div>

                {/* Distribution Chart */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  className="md:col-span-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">User Distribution</h3>
                      <p className="text-sm text-gray-500">Distribution of users by role and status</p>
                    </div>
                    <div className="p-3 bg-indigo-50 rounded-full">
                      <PieChart size={20} className="text-indigo-600" />
                    </div>
                  </div>

                  <div className="h-64 flex items-center justify-center">
                    <DistributionChart data={{ user: stats.totalUsers, company: stats.totalCompanies }} />
                  </div>
                </motion.div>

                {/* Recent Activity */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.9 }}
                  className="md:col-span-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                      <p className="text-sm text-gray-500">Latest actions on the platform</p>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-full">
                      <Activity size={20} className="text-purple-600" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <ActivityItem
                        key={index}
                        icon={activity.icon}
                        title={activity.title}
                        description={activity.description}
                        time={activity.time}
                        color={activity.color}
                      />
                    ))}
                  </div>

                  <button 
                   onClick={() => setActiveTab("analytics")}
                  className="w-full mt-4 px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
                    View All Activity
                  </button>
                </motion.div>
              </div>

              {/* Recent Users and Companies */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Recent Users */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.0 }}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                >
                  <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900">Recent Users</h3>
                    <button
                      onClick={() => setActiveTab("users")}
                      className="text-sm text-indigo-600 hover:text-indigo-800"
                    >
                      View All
                    </button>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {users.slice(0, 2).map((user) => (
                      <div key={user.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium">
                              {user.name ? user.name.charAt(0) : user.email.charAt(0)}
                            </div>
                            <div className="ml-3">
                              <p className="text-sm font-medium text-gray-900">{user.name || 'Unnamed User'}</p>
                              <p className="text-xs text-gray-500">{user.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                              {user.role || 'user'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === "users" && (
            <div className="space-y-6">
              {/* Page Title */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
                  <p className="text-gray-600">Manage all users and their roles on the platform.</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="flex items-center space-x-3"
                >
                  <button className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                    <Filter size={16} className="mr-2" />
                    Filter
                  </button>
                  <button className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                    <UserPlus size={16} className="mr-2" />
                    Add User
                  </button>
                </motion.div>
              </div>

              {/* Search and Filters */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-4"
              >
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      placeholder="Search users by name or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </motion.div>

              {/* Users Table */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
              >
                {/* Mobile view - card style */}
                <div className="block md:hidden">
                  {currentUsers.map((user) => (
                    <div key={user.id} className="p-4 border-b border-gray-200">
                      <div className="flex items-center mb-3">
                        <div className="flex-shrink-0 h-10 w-10">
                          {user.avatar ? (
                            <img
                              className="h-10 w-10 rounded-full"
                              src={user.avatar || "/placeholder.svg"}
                              alt={`${user.name}'s avatar`}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                              <span className="text-indigo-600 font-medium">
                                {user.name ? user.name.charAt(0) : "?"}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{user.name || "Unnamed User"}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-gray-500 block">Role:</span>
                          <span
                            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              user.role === "admin"
                                ? "bg-purple-100 text-purple-800"
                                : user.role === "company"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {user.role}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500 block">Created:</span>
                          <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div>
                          <span className="text-gray-500 block">Request Company:</span>
                          <span className={user.requestForCompany ? "font-bold text-yellow-800" : ""}>
                            {user.requestForCompany ? "Yes" : "No"}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500 block">Action:</span>
                          <select
                            value={user.role}
                            onChange={async (e) => {
                              const newRole = e.target.value
                              try {
                                setIsLoading(true)
                                await customFetch.put(`/admin/users/${user.id}/role`, { role: newRole })
                                setUsers((prevUsers) =>
                                  prevUsers.map((u) => (u.id === user.id ? { ...u, role: newRole } : u)),
                                )
                                showNotification("success", `User role updated to ${newRole} successfully!`)
                              } catch (error) {
                                showNotification("error", "Failed to update user role. Please try again.")
                              } finally {
                                setIsLoading(false)
                              }
                            }}
                            className="bg-white border border-gray-300 text-gray-700 py-1 px-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                          >
                            <option value="User">User</option>
                            <option value="Admin">Admin</option>
                            <option value="Company">Company</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop view - table style */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Created
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          RequestCompany
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                {user.avatar ? (
                                  <img
                                    className="h-10 w-10 rounded-full"
                                    src={user.avatar || "/placeholder.svg"}
                                    alt={`${user.name}'s avatar`}
                                  />
                                ) : (
                                  <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                    <span className="text-indigo-600 font-medium">
                                      {user.name ? user.name.charAt(0) : "?"}
                                    </span>
                                  </div>
                                )}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-500">{user.email}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                user.role === "admin"
                                  ? "bg-purple-100 text-purple-800"
                                  : user.role === "company"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>
                          <td
                            className={`px-6 py-4 whitespace-nowrap text-sm ${user.requestForCompany ? "bg-yellow-100 font-bold text-yellow-800" : "text-gray-500"}`}
                          >
                            {user.requestForCompany ? "Yes" : "No"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <select
                              value={user.role}
                              onChange={async (e) => {
                                const newRole = e.target.value
                                try {
                                  setIsLoading(true)
                                  await customFetch.put(`/admin/users/${user.id}/role`, { role: newRole })
                                  setUsers((prevUsers) =>
                                    prevUsers.map((u) => (u.id === user.id ? { ...u, role: newRole } : u)),
                                  )
                                  showNotification("success", `User role updated to ${newRole} successfully!`)
                                } catch (error) {
                                  showNotification("error", "Failed to update user role. Please try again.")
                                } finally {
                                  setIsLoading(false)
                                }
                              }}
                              className="bg-white border border-gray-300 text-gray-700 py-1 px-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                              <option value="User">User</option>
                              <option value="Admin">Admin</option>
                              <option value="Company">Company</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="px-4 sm:px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-sm text-gray-500 text-center sm:text-left">
                    Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredUsers.length)} of{" "}
                    {filteredUsers.length} users
                  </div>
                  <div className="flex flex-wrap justify-center gap-2">
                    <button
                      onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                      disabled={currentPage === 1}
                      className={`px-3 py-1 rounded-md ${
                        currentPage === 1
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      Previous
                    </button>
                    {Array.from({ length: Math.min(5, Math.ceil(filteredUsers.length / itemsPerPage)) }, (_, i) => {
                      // Show first page, last page, current page, and pages around current
                      const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
                      let pageNum

                      if (totalPages <= 5) {
                        pageNum = i + 1
                      } else if (currentPage <= 3) {
                        pageNum = i + 1
                        if (i === 4) pageNum = totalPages
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i
                        if (i === 0) pageNum = 1
                      } else {
                        pageNum = currentPage - 2 + i
                        if (i === 0) pageNum = 1
                        if (i === 4) pageNum = totalPages
                      }

                      return (
                        <button
                          key={i}
                          onClick={() => paginate(pageNum)}
                          className={`px-3 py-1 rounded-md ${
                            currentPage === pageNum
                              ? "bg-indigo-600 text-white"
                              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          }`}
                        >
                          {pageNum}
                        </button>
                      )
                    })}
                    <button
                      onClick={() =>
                        paginate(
                          currentPage < Math.ceil(filteredUsers.length / itemsPerPage)
                            ? currentPage + 1
                            : Math.ceil(filteredUsers.length / itemsPerPage),
                        )
                      }
                      disabled={currentPage === Math.ceil(filteredUsers.length / itemsPerPage)}
                      className={`px-3 py-1 rounded-md ${
                        currentPage === Math.ceil(filteredUsers.length / itemsPerPage)
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}

          {/* Companies Tab */}
          {activeTab === "companies" && (
            <div className="space-y-6">
              {/* Page Title */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="text-2xl font-bold text-gray-900">Company Management</h2>
                  <p className="text-gray-600">Manage all companies registered on the platform.</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="mt-4 md:mt-0 flex items-center space-x-3"
                >
                  <button className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                    <Filter size={16} className="mr-2" />
                    Filter
                  </button>
                  <button className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                    <Building size={16} className="mr-2" />
                    Add Company
                  </button>
                </motion.div>
              </div>

              {/* Search and Filters */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-4"
              >
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      placeholder="Search companies by name or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </motion.div>

              {/* Companies Table */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
              >
                {/* Mobile view - card style */}
                <div className="block md:hidden">
                  {currentCompanies.map((company) => (
                    <div key={company.id} className="p-4 border-b border-gray-200">
                      <div className="mb-3">
                        <h3 className="text-lg font-medium text-gray-900">{company.companyName}</h3>
                        <p className="text-sm text-gray-500">{company.companyEmail}</p>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-gray-500 block font-medium">Description:</span>
                          <p className="text-gray-700">{company.description}</p>
                        </div>
                        <div>
                          <span className="text-gray-500 block font-medium">Website:</span>
                          <a
                            href={company.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline break-all"
                          >
                            {company.website}
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop view - table style */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Company Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Company Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Description
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Website
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentCompanies.map((company) => (
                        <tr key={company.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-normal break-words">{company.companyName}</td>
                          <td className="px-6 py-4 whitespace-normal break-words">{company.companyEmail}</td>
                          <td className="px-6 py-4 whitespace-normal break-words">{company.description}</td>
                          <td className="px-6 py-4 whitespace-normal break-words">
                            <a
                              href={company.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              {company.website}
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="px-4 sm:px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-sm text-gray-500 text-center sm:text-left">
                    Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredCompanies.length)} of{" "}
                    {filteredCompanies.length} companies
                  </div>
                  <div className="flex flex-wrap justify-center gap-2">
                    <button
                      onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                      disabled={currentPage === 1}
                      className={`px-3 py-1 rounded-md ${
                        currentPage === 1
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      Previous
                    </button>
                    {Array.from({ length: Math.min(5, Math.ceil(filteredCompanies.length / itemsPerPage)) }, (_, i) => {
                      // Show first page, last page, current page, and pages around current
                      const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage)
                      let pageNum

                      if (totalPages <= 5) {
                        pageNum = i + 1
                      } else if (currentPage <= 3) {
                        pageNum = i + 1
                        if (i === 4) pageNum = totalPages
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i
                        if (i === 0) pageNum = 1
                      } else {
                        pageNum = currentPage - 2 + i
                        if (i === 0) pageNum = 1
                        if (i === 4) pageNum = totalPages
                      }

                      return (
                        <button
                          key={i}
                          onClick={() => paginate(pageNum)}
                          className={`px-3 py-1 rounded-md ${
                            currentPage === pageNum
                              ? "bg-indigo-600 text-white"
                              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          }`}
                        >
                          {pageNum}
                        </button>
                      )
                    })}
                    <button
                      onClick={() =>
                        paginate(
                          currentPage < Math.ceil(filteredCompanies.length / itemsPerPage)
                            ? currentPage + 1
                            : Math.ceil(filteredCompanies.length / itemsPerPage),
                        )
                      }
                      disabled={currentPage === Math.ceil(filteredCompanies.length / itemsPerPage)}
                      className={`px-3 py-1 rounded-md ${
                        currentPage === Math.ceil(filteredCompanies.length / itemsPerPage)
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}

          {/* Jobs Tab */}
          {activeTab === "jobs" && (
            <div className="space-y-6">
              {/* Page Title */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="text-2xl font-bold text-gray-900">Job Management</h2>
                  <p className="text-gray-600">Manage all job listings on the platform.</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="mt-4 md:mt-0 flex items-center space-x-3"
                >
                  <button className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                    <Filter size={16} className="mr-2" />
                    Filter
                  </button>
                  <button className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                    <Briefcase size={16} className="mr-2" />
                    Add Job
                  </button>
                </motion.div>
              </div>

              {/* Search and Filters */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-4"
              >
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      placeholder="Search jobs by title or company..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </motion.div>

              {/* Jobs Table */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
              >
                {/* Mobile view - card style */}
                <div className="block md:hidden">
                  {currentJobs.map((job) => (
                    <div key={job.id} className="p-4 border-b border-gray-200">
                      <div className="mb-3">
                        <h3 className="text-lg font-medium text-gray-900">{job.title}</h3>
                        <p className="text-sm font-medium text-indigo-600">{job.company?.companyName || "-"}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-gray-500 block">Company Email:</span>
                          <span className="text-gray-700">{job.company?.companyEmail || "-"}</span>
                        </div>
                        <div>
                          <span className="text-gray-500 block">Location:</span>
                          <span className="text-gray-700">{job.location || "-"}</span>
                        </div>
                        <div>
                          <span className="text-gray-500 block">Salary:</span>
                          <span className="text-gray-700">{job.salary ? `$${job.salary.toLocaleString()}` : "-"}</span>
                        </div>
                        <div>
                          <span className="text-gray-500 block">Posted Date:</span>
                          <span className="text-gray-700">
                            {job.postedDate ? new Date(job.postedDate).toLocaleDateString() : "-"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop view - table style */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Title
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Company Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Company Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Location
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Salary
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Posted Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentJobs.map((job) => (
                        <tr key={job.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-normal break-words">{job.title}</td>
                          <td className="px-6 py-4 whitespace-normal break-words">{job.company?.companyName || "-"}</td>
                          <td className="px-6 py-4 whitespace-normal break-words">
                            {job.company?.companyEmail || "-"}
                          </td>
                          <td className="px-6 py-4 whitespace-normal break-words">{job.location || "-"}</td>
                          <td className="px-6 py-4 whitespace-normal break-words">
                            {job.salary ? `$${job.salary.toLocaleString()}` : "-"}
                          </td>
                          <td className="px-6 py-4 whitespace-normal break-words">
                            {job.postedDate ? new Date(job.postedDate).toLocaleDateString() : "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="px-4 sm:px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-sm text-gray-500 text-center sm:text-left">
                    Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredJobs.length)} of{" "}
                    {filteredJobs.length} jobs
                  </div>
                  <div className="flex flex-wrap justify-center gap-2">
                    <button
                      onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                      disabled={currentPage === 1}
                      className={`px-3 py-1 rounded-md ${
                        currentPage === 1
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      Previous
                    </button>
                    {Array.from({ length: Math.min(5, Math.ceil(filteredJobs.length / itemsPerPage)) }, (_, i) => {
                      // Show first page, last page, current page, and pages around current
                      const totalPages = Math.ceil(filteredJobs.length / itemsPerPage)
                      let pageNum

                      if (totalPages <= 5) {
                        pageNum = i + 1
                      } else if (currentPage <= 3) {
                        pageNum = i + 1
                        if (i === 4) pageNum = totalPages
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i
                        if (i === 0) pageNum = 1
                      } else {
                        pageNum = currentPage - 2 + i
                        if (i === 0) pageNum = 1
                        if (i === 4) pageNum = totalPages
                      }

                      return (
                        <button
                          key={i}
                          onClick={() => paginate(pageNum)}
                          className={`px-3 py-1 rounded-md ${
                            currentPage === pageNum
                              ? "bg-indigo-600 text-white"
                              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          }`}
                        >
                          {pageNum}
                        </button>
                      )
                    })}
                    <button
                      onClick={() =>
                        paginate(
                          currentPage < Math.ceil(filteredJobs.length / itemsPerPage)
                            ? currentPage + 1
                            : Math.ceil(filteredJobs.length / itemsPerPage),
                        )
                      }
                      disabled={currentPage === Math.ceil(filteredJobs.length / itemsPerPage)}
                      className={`px-3 py-1 rounded-md ${
                        currentPage === Math.ceil(filteredJobs.length / itemsPerPage)
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === "analytics" && <div className="space-y-6">{/* Analytics content */}</div>}

          {/* Settings Tab */}
          {activeTab === "settings" && <div className="space-y-6">{/* Settings content */}</div>}
        </main>
      </div>

      {/* User Edit Modal */}
      <AnimatePresence>
        {showUserModal && selectedUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-lg max-w-md w-full p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">Edit User</h3>
                <button
                  onClick={() => {
                    setShowUserModal(false)
                    setSelectedUser(null)
                  }}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X size={20} className="text-gray-500" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    id="edit-name"
                    defaultValue={selectedUser.name}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label htmlFor="edit-email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="edit-email"
                    defaultValue={selectedUser.email}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label htmlFor="edit-role" className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <select
                    id="edit-role"
                    defaultValue={selectedUser.role}
                    onChange={(e) => handleUserRoleChange(selectedUser.id, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="user">User</option>
                    <option value="company">Company</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="edit-status" className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    id="edit-status"
                    defaultValue={selectedUser.status}
                    onChange={(e) => handleUserStatusChange(selectedUser.id, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    onClick={() => {
                      setShowUserModal(false)
                      setSelectedUser(null)
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      showNotification("success", "User updated successfully!")
                      setShowUserModal(false)
                      setSelectedUser(null)
                    }}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Company Edit Modal */}
      <AnimatePresence>
        {showCompanyModal && selectedCompany && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-lg max-w-md w-full p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">Edit Company</h3>
                <button
                  onClick={() => {
                    setShowCompanyModal(false)
                    setSelectedCompany(null)
                  }}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X size={20} className="text-gray-500" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="edit-company-name" className="block text-sm font-medium text-gray-700 mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    id="edit-company-name"
                    defaultValue={selectedCompany.name}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label htmlFor="edit-company-email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="edit-company-email"
                    defaultValue={selectedCompany.email}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label htmlFor="edit-company-industry" className="block text-sm font-medium text-gray-700 mb-1">
                    Industry
                  </label>
                  <input
                    type="text"
                    id="edit-company-industry"
                    defaultValue={selectedCompany.industry}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label htmlFor="edit-company-status" className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    id="edit-company-status"
                    defaultValue={selectedCompany.status}
                    onChange={(e) => handleCompanyStatusChange(selectedCompany.id, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    onClick={() => {
                      setShowCompanyModal(false)
                      setSelectedCompany(null)
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      showNotification("success", "Company updated successfully!")
                      setShowCompanyModal(false)
                      setSelectedCompany(null)
                    }}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Helper Components
const SidebarLink = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center w-full px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
      active ? "bg-indigo-50 text-indigo-600" : "text-gray-700 hover:bg-gray-100"
    }`}
  >
    <span className="mr-3">{icon}</span>
    {label}
  </button>
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

// Chart Components
const GrowthChart = ({ data }) => {
  const maxValue = Math.max(
    ...data.users,
    ...data.companies,
    ...data.jobs
  )

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  return (
    <div className="w-full h-full">
      <div className="flex items-end justify-between h-48 px-2">
        {data.users.map((value, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className="flex items-end space-x-1">
              <div
                className="w-8 bg-blue-500 rounded-t-md"
                style={{ height: `${(value / maxValue) * 100}%` }}
              ></div>
              <div
                className="w-8 bg-purple-500 rounded-t-md"
                style={{ height: `${(data.companies[index] / maxValue) * 100}%` }}
              ></div>
              <div
                className="w-8 bg-indigo-500 rounded-t-md"
                style={{ height: `${(data.jobs[index] / maxValue) * 100}%` }}
              ></div>
            </div>
            <span className="text-xs text-gray-500 mt-1">{months[index]}</span>
          </div>
        ))}
      </div>
      <div className="flex justify-center space-x-4 mt-4">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
          <span className="text-xs text-gray-600">Users</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
          <span className="text-xs text-gray-600">Companies</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-indigo-500 rounded-full mr-2"></div>
          <span className="text-xs text-gray-600">Jobs</span>
        </div>
      </div>
    </div>
  )
}

const DistributionChart = ({ data }) => {
  const filteredData = {
    user: data.user || 0,
    company: data.company || 0
  }
  const total = Object.values(filteredData).reduce((sum, count) => sum + count, 0)
  const colors = {
    user: '#3b82f6',      // blue-500
    company: '#ec4899'    // pink-500
  }

  if (total === 0) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center">
        <svg width="200" height="200" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="90" fill="#f3f4f6" />
        </svg>
        <div className="mt-4 text-gray-400 text-sm">No data</div>
      </div>
    )
  }

  // Calculate pie slices
  let startAngle = 0
  const slices = Object.entries(filteredData).map(([role, count]) => {
    const value = count / total
    const angle = value * 360
    const endAngle = startAngle + angle
    const largeArc = angle > 180 ? 1 : 0
    const x1 = 100 + 90 * Math.cos((Math.PI * (startAngle - 90)) / 180)
    const y1 = 100 + 90 * Math.sin((Math.PI * (startAngle - 90)) / 180)
    const x2 = 100 + 90 * Math.cos((Math.PI * (endAngle - 90)) / 180)
    const y2 = 100 + 90 * Math.sin((Math.PI * (endAngle - 90)) / 180)
    const path = `M100,100 L${x1},${y1} A90,90 0 ${largeArc},1 ${x2},${y2} Z`
    const slice = { path, color: colors[role], role, count }
    startAngle += angle
    return slice
  })

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <svg width="200" height="200" viewBox="0 0 200 200">
        {slices.map((slice, i) => (
          <path key={i} d={slice.path} fill={slice.color} stroke="#fff" strokeWidth="2" />
        ))}
      </svg>
      <div className="flex flex-col space-y-2 mt-4">
        {Object.entries(filteredData).map(([role, count]) => (
          <div key={role} className="flex items-center">
            <span className="inline-block w-3 h-3 rounded-full mr-2" style={{ backgroundColor: colors[role] }}></span>
            <span className="text-sm text-gray-600 capitalize">{role === 'user' ? 'Users' : 'Companies'}</span>
            <span className="text-sm text-gray-500 ml-2">({count})</span>
          </div>
        ))}
      </div>
    </div>
  )
}

const ApplicationsChart = ({ data }) => {
  return (
    <div className="w-full h-full flex items-end justify-between px-2 sm:px-4">
      {data.map((value, index) => (
        <div key={index} className="flex flex-col items-center flex-1 min-w-[20px]">
          <div
            className="w-full max-w-[24px] bg-gradient-to-t from-green-600 to-green-400 rounded-t-md"
            style={{ height: `${(value / Math.max(...data)) * 100}%` }}
          ></div>
          <span className="text-[10px] sm:text-xs text-gray-500 mt-1">{index + 1}</span>
        </div>
      ))}
    </div>
  );
};

export default AdminDashboard
