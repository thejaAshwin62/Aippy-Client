import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Filter, X, Mail, Globe } from "lucide-react"
import customFetch from "../lib/customFetch"
import JobCard from "../components/JobCard"
import { useNavigate } from "react-router-dom"
import { toast } from "react-hot-toast"

const JobListings = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTech, setSelectedTech] = useState([])
  const [selectedExperience, setSelectedExperience] = useState("")
  const [jobs, setJobs] = useState([])
  const [filteredJobs, setFilteredJobs] = useState([])
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [error, setError] = useState(null)
  const [showJobDetailModal, setShowJobDetailModal] = useState(false)
  const [selectedJob, setSelectedJob] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(()=>{
    const fetchUserDetails = async () => {
      try {
        const response = await customFetch.get('/current-user')
        setUser(response.data)
      } catch (err) {
        console.error('Error fetching user details:', err)        
        toast.error("Failed to fetch user data")
        navigate("/login")
      }
    }
    fetchUserDetails()
  }, [])
  console.log(user);


  // Fetch jobs from backend
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setIsLoading(true)
        const response = await customFetch.get('/jobs')
        console.log(response);
        
        setJobs(response.data)
        setFilteredJobs(response.data)
      } catch (err) {
        if (err.response?.status === 401) {
          navigate('/login')
        } else {
          setError(err.response?.data?.message || 'Failed to fetch jobs')
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchJobs()
  }, [])

  // Filter jobs based on search term and filters
  useEffect(() => {
    let result = jobs

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(
        (job) =>
          job.title.toLowerCase().includes(term) ||
          job.company.companyName.toLowerCase().includes(term) ||
          job.location.toLowerCase().includes(term)
      )
    }

    // Filter by tech stack
    if (selectedTech.length > 0) {
      result = result.filter((job) => 
        selectedTech.every((tech) => job.techStack.includes(tech))
      )
    }

    // Filter by experience
    if (selectedExperience) {
      result = result.filter((job) => {
        const jobYears = job.yearsOfExperience
        const filterYears = parseInt(selectedExperience)
        return jobYears <= filterYears
      })
    }

    setFilteredJobs(result)
  }, [searchTerm, selectedTech, selectedExperience, jobs])

  const toggleTechFilter = (tech) => {
    setSelectedTech((prev) =>
      prev.includes(tech) ? prev.filter((t) => t !== tech) : [...prev, tech]
    )
  }

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedTech([])
    setSelectedExperience("")
  }

  // Get all unique tech stack items from jobs
  const allTechOptions = [...new Set(jobs.flatMap((job) => job.techStack))].sort()
  const experienceOptions = ["0-1 years", "1-2 years", "2+ years", "3+ years", "5+ years"]

  // Add handler for viewing job details
  const handleViewJob = (job) => {
    setSelectedJob(job);
    setShowJobDetailModal(true);
  };

  if (isLoading) {
    return (
      <div className="pt-24 pb-16 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="pt-24 pb-16 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold text-gray-900"
          >
            Find Your Perfect Job
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-2 text-lg text-gray-600"
          >
            Browse through our curated list of opportunities
          </motion.p>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search jobs, companies, or locations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center justify-center px-4 py-3 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 md:w-auto"
            >
              <Filter size={20} className="mr-2" />
              Filters
            </motion.button>
          </div>

          {/* Filters Panel */}
          <AnimatePresence>
            {isFilterOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 bg-white rounded-lg border border-gray-300 p-4 overflow-hidden"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-gray-900">Filter Jobs</h3>
                  <button onClick={clearFilters} className="text-sm text-indigo-600 hover:text-indigo-800">
                    Clear all filters
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Tech Stack</h4>
                    <div className="flex flex-wrap gap-2">
                      {allTechOptions.map((tech) => (
                        <button
                          key={tech}
                          onClick={() => toggleTechFilter(tech)}
                          className={`px-3 py-1 rounded-full text-sm ${
                            selectedTech.includes(tech)
                              ? "bg-indigo-100 text-indigo-800 border-indigo-300"
                              : "bg-gray-100 text-gray-800 border-gray-200"
                          } border hover:bg-indigo-100 hover:text-indigo-800 transition-colors`}
                        >
                          {tech}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Experience Level</h4>
                    <div className="flex flex-wrap gap-2">
                      {experienceOptions.map((exp) => (
                        <button
                          key={exp}
                          onClick={() => setSelectedExperience(exp === selectedExperience ? "" : exp)}
                          className={`px-3 py-1 rounded-full text-sm ${
                            exp === selectedExperience
                              ? "bg-indigo-100 text-indigo-800 border-indigo-300"
                              : "bg-gray-100 text-gray-800 border-gray-200"
                          } border hover:bg-indigo-100 hover:text-indigo-800 transition-colors`}
                        >
                          {exp}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Active Filters */}
          {(selectedTech.length > 0 || selectedExperience) && (
            <div className="mt-4 flex flex-wrap gap-2">
              {selectedTech.map((tech) => (
                <div
                  key={tech}
                  className="flex items-center bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm"
                >
                  {tech}
                  <button onClick={() => toggleTechFilter(tech)} className="ml-1 focus:outline-none">
                    <X size={14} />
                  </button>
                </div>
              ))}

              {selectedExperience && (
                <div className="flex items-center bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm">
                  {selectedExperience} experience
                  <button onClick={() => setSelectedExperience("")} className="ml-1 focus:outline-none">
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Job Listings */}
        <div className="grid grid-cols-1 gap-6">
          <AnimatePresence>
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job, index) => (
                <JobCard 
                  key={job.id} 
                  job={job} 
                  index={index} 
                  user={user}
                  onViewJob={handleViewJob}
                  showMockInterviewButton={user?.role === "User"}
                />
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="text-center py-12"
              >
                <h3 className="text-xl font-medium text-gray-900 mb-2">No jobs found</h3>
                <p className="text-gray-600">Try adjusting your search or filters</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Job Detail Modal */}
        {showJobDetailModal && selectedJob && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full mx-4 sm:mx-0 p-0 relative max-h-[90vh] overflow-y-auto"
            >
              <button
                className="absolute top-4 right-4 sm:top-6 sm:right-6 text-gray-400 hover:text-gray-700 text-2xl p-2 rounded-full hover:bg-gray-100 transition-colors"
                onClick={() => setShowJobDetailModal(false)}
              >
                <X size={24} />
              </button>
              <div className="p-4 sm:p-8 pb-0">
                <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-indigo-700">Job Details</h2>
              </div>
              <div className="p-4 sm:p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {/* Job Info Card */}
                  <div className="bg-white rounded-xl p-4 sm:p-6 flex flex-col justify-between border border-gray-100 shadow-sm">
                    <div>
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">{selectedJob.title}</h3>
                      <p className="text-indigo-600 font-medium mb-3 sm:mb-4">{selectedJob.company.companyName}</p>
                      <div className="space-y-2 text-gray-600 text-sm sm:text-base">
                        <p><span className="font-medium">Location:</span> {selectedJob.location}</p>
                        <p><span className="font-medium">Job Type:</span> {selectedJob.jobType}</p>
                        <p><span className="font-medium">Experience:</span> {selectedJob.yearsOfExperience} years</p>
                        <p><span className="font-medium">Tech Stack:</span> {selectedJob.techStack.join(', ')}</p>
                      </div>
                      <div className="mt-3 sm:mt-4">
                        <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                        <p className="text-gray-600 text-sm sm:text-base">{selectedJob.description}</p>
                      </div>
                    </div>
                    <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <span className="text-xl sm:text-2xl font-bold text-indigo-700">${selectedJob.salary ? selectedJob.salary.toLocaleString() : 'Not specified'}</span>
                      <div className="flex flex-col text-right text-xs sm:text-sm text-gray-600">
                        <span><span className="font-medium">Mock Interview Required:</span> {selectedJob.mockInterviewRequired ? 'Yes' : 'No'}</span>
                        {selectedJob.mockInterviewRequired && (
                          <>
                            <span><span className="font-medium">Minimum Score:</span> {selectedJob.minimumMockScore || 'Not specified'}%</span>
                            <span><span className="font-medium">Interview Weight:</span> {selectedJob.mockInterviewPercentage || 'Not specified'}%</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  {/* Company Info Card */}
                  <div className="bg-white rounded-xl p-4 sm:p-6 flex flex-col justify-between border border-gray-100 shadow-sm">
                    <div>
                      <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">About the Company</h4>
                      <div className="text-gray-700 text-sm sm:text-base mb-3">{selectedJob.company.description}</div>
                    </div>
                    <div className="flex flex-wrap gap-3 text-xs sm:text-sm text-gray-600 mt-2 items-center">
                      <span className="flex items-center">
                        <Mail size={14} className="mr-1" />
                        {selectedJob.company.companyEmail}
                      </span>
                      {selectedJob.company.website && (
                        <span className="flex items-center">
                          <Globe size={14} className="mr-1" />
                          <a
                            href={selectedJob.company.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 hover:underline"
                          >
                            {selectedJob.company.website.replace(/^https?:\/\/(www\.)?/, "")}
                          </a>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}

export default JobListings
