import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Star, Clock, ArrowLeft, MessageCircle, ThumbsUp, Award, Loader2, CheckCircle, XCircle } from "lucide-react"
import { format } from 'date-fns'
import toast from 'react-hot-toast'
import customFetch from "../lib/customFetch"

const InterviewFeedback = () => {
  const { jobId: jobId } = useParams()
  const navigate = useNavigate()
  const [feedbacks, setFeedbacks] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [error, setError] = useState(null)
  const [isApplying, setIsApplying] = useState(false)
  const [hasApplied, setHasApplied] = useState(false)
  const [jobDetails, setJobDetails] = useState(null)

  // Check if user has already applied
  const isAlreadyApplied = user?.appliedJobIds?.includes(parseInt(jobId))

  // Fetch user details
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await customFetch.get('/current-user')
        setUser(response.data)
      } catch (err) {
        console.error('Error fetching user details:', err)
        toast.error('Failed to load user details')
        if (err.response?.status === 401) {
          navigate('/login')
        }
      }
    }
    fetchUserDetails()
  }, [navigate])

  // Fetch job details
  useEffect(() => {
    const fetchJobDetails = async () => {
      if (!jobId) return;
      
      try {
        const response = await customFetch.get(`/jobs/${jobId}`)
        setJobDetails(response.data)
      } catch (error) {
        console.error('Error fetching job details:', error)
        toast.error('Failed to load job details')
      }
    }

    fetchJobDetails()
  }, [jobId])

  // console.log(user);
  // console.log(jobId);

  // Fetch feedback once we have the user
  useEffect(() => {
    const fetchFeedback = async () => {
      if (!user?.id || !jobId) return;
      
      try {
        setIsLoading(true)
        const response = await customFetch.get(`/feedback/user/${user.id}/job/${jobId}`)
        // console.log(response.data);
        
        setFeedbacks(response.data)
      } catch (error) {
        console.error('Error fetching feedback:', error)
        toast.error('Failed to load feedback')
        setError('Failed to load feedback. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchFeedback()
  }, [user, jobId])

  const getOverallScore = () => {
    if (feedbacks.length === 0) return 0
    const totalRating = feedbacks.reduce((sum, feedback) => sum + feedback.rating, 0)
    return Math.round((totalRating / (feedbacks.length * 5)) * 100)
  }

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        size={20}
        className={`${
          index < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
        }`}
      />
    ))
  }

  // Calculate eligibility
  const score = getOverallScore()
  const minimumRequiredScore = jobDetails?.minimumMockScore || 0
  const isEligible = score >= minimumRequiredScore

  const handleApplyJob = async () => {
    if (!user?.id || !jobId) return;
    
    try {
      setIsApplying(true)
      await customFetch.post('/applications/apply', {
        jobId: parseInt(jobId),
        userId: user.id
      });
      setHasApplied(true)
      toast.success(
        'Successfully applied for the job!', 
        {
          duration: 4000,
          icon: '🎉',
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        }
      );
    } catch (error) {
      console.error('Error applying for job:', error)
      toast.error(
        error.response?.data?.message || 'Failed to apply for the job',
        {
          duration: 4000,
          icon: '❌',
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        }
      );
    } finally {
      setIsApplying(false)
    }
  }

  const renderEligibilitySection = () => {
    const score = getOverallScore()
    const minimumRequiredScore = jobDetails?.minimumMockScore || 0
    const isEligible = score >= minimumRequiredScore

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl shadow-md p-6 mt-8 mb-8"
      >
        <div className="flex flex-col items-center text-center">
          <div className="mb-4">
            {isAlreadyApplied ? (
              <CheckCircle className="w-12 h-12 text-blue-500" />
            ) : isEligible ? (
              <CheckCircle className="w-12 h-12 text-green-500" />
            ) : (
              <XCircle className="w-12 h-12 text-red-500" />
            )}
          </div>
          
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {isAlreadyApplied 
              ? 'Already Applied'
              : isEligible 
                ? 'Congratulations!' 
                : 'Not Eligible'
            }
          </h2>
          
          <p className="text-gray-600 mb-4">
            {isAlreadyApplied 
              ? 'You have already applied for this job. Check your applications for status.'
              : isEligible 
                ? 'You have passed the mock interview and are eligible to apply for this job.'
                : `You need a score of at least ${minimumRequiredScore}% to be eligible. Your current score is ${score}%.`
            }
          </p>

          {isAlreadyApplied && (
            <button
              onClick={() => navigate('/dashboard/candidate')}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              View Application Status
            </button>
          )}

          {isEligible && !isAlreadyApplied && !hasApplied && (
            <button
              onClick={handleApplyJob}
              disabled={isApplying}
              className={`inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors
                ${isApplying ? 'opacity-75 cursor-not-allowed' : ''}`}
            >
              {isApplying ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Applying...
                </>
              ) : (
                'Apply for Job'
              )}
            </button>
          )}

          {hasApplied && (
            <div className="flex items-center text-green-500">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span>Successfully applied!</span>
            </div>
          )}

          {!isEligible && !isAlreadyApplied && (
            <button
              onClick={() => navigate(`/jobs`)}
              className="inline-flex items-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Retry Mock Interview
            </button>
          )}
        </div>
      </motion.div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/jobs')}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Return to Jobs
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16 sm:pt-24 pb-8 sm:pb-16">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0 mb-6 sm:mb-8"
        >
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">Interview Feedback</h1>
            <p className="text-sm sm:text-base text-gray-600">Review your performance and feedback from the mock interview.</p>
          </div>
          <button
            onClick={() => navigate('/jobs')}
            className="flex items-center px-3 sm:px-4 py-2 text-gray-600 hover:text-gray-900 text-sm sm:text-base"
          >
            <ArrowLeft size={18} className="mr-2" />
            Back to Jobs
          </button>
        </motion.div>

        {/* Overall Score Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-6 sm:mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Overall Performance</h2>
              <div className="flex items-center space-x-2">
                <Award className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
                <span className="text-base sm:text-lg font-medium text-gray-900">{getOverallScore()}% Score</span>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">Questions Completed</div>
              <div className="text-xl sm:text-2xl font-bold text-indigo-600">{feedbacks.length} / 5</div>
            </div>
          </div>
        </motion.div>

        {/* Eligibility and Apply Section */}
        {!isLoading && !error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-6 sm:mb-8"
          >
            <div className="flex flex-col items-center text-center">
              <div className="mb-3 sm:mb-4">
                {isAlreadyApplied ? (
                  <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-blue-500" />
                ) : isEligible ? (
                  <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-green-500" />
                ) : (
                  <XCircle className="w-10 h-10 sm:w-12 sm:h-12 text-red-500" />
                )}
              </div>
              
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1 sm:mb-2">
                {isAlreadyApplied 
                  ? 'Already Applied'
                  : isEligible 
                    ? 'Congratulations!' 
                    : 'Not Eligible'
                }
              </h2>
              
              <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
                {isAlreadyApplied 
                  ? 'You have already applied for this job. Check your applications for status.'
                  : isEligible 
                    ? 'You have passed the mock interview and are eligible to apply for this job.'
                    : `You need a score of at least ${minimumRequiredScore}% to be eligible. Your current score is ${score}%.`
                }
              </p>

              {isAlreadyApplied && (
                <button
                  onClick={() => navigate('/dashboard/candidate')}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
                >
                  View Application Status
                </button>
              )}

              {isEligible && !isAlreadyApplied && !hasApplied && (
                <button
                  onClick={handleApplyJob}
                  disabled={isApplying}
                  className={`w-full sm:w-auto inline-flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm sm:text-base
                    ${isApplying ? 'opacity-75 cursor-not-allowed' : ''}`}
                >
                  {isApplying ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Applying...
                    </>
                  ) : (
                    'Apply for Job'
                  )}
                </button>
              )}

              {hasApplied && (
                <div className="flex items-center text-green-500 text-sm sm:text-base">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  <span>Successfully applied!</span>
                </div>
              )}

              {!isEligible && !isAlreadyApplied && (
                <button
                  onClick={() => navigate(`/jobs`)}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm sm:text-base"
                >
                  Retry Mock Interview
                </button>
              )}
            </div>
          </motion.div>
        )}

        {/* Feedback Cards */}
        <div className="space-y-4 sm:space-y-6">
          {feedbacks.map((feedback, index) => (
            <motion.div
              key={feedback.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="bg-white rounded-xl shadow-md overflow-hidden"
            >
              <div className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-3 sm:mb-4">
                  <span className="px-2 sm:px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs sm:text-sm font-medium">
                    Question {index + 1}
                  </span>
                  <div className="flex items-center text-xs sm:text-sm text-gray-500">
                    <Clock size={14} className="mr-1" />
                    {format(new Date(feedback.createdAt), 'MMM d, yyyy h:mm a')}
                  </div>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  {/* Question */}
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">
                      {feedback.question}
                    </h3>
                    <div className="flex items-start">
                      <MessageCircle size={14} className="text-gray-400 mr-2 mt-1" />
                      <p className="text-sm sm:text-base text-gray-600">{feedback.userAnswer}</p>
                    </div>
                  </div>

                  {/* Feedback Section */}
                  <div className="bg-indigo-50 rounded-lg p-3 sm:p-4">
                    <div className="flex items-start space-x-2 sm:space-x-3">
                      <ThumbsUp className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 mt-1" />
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1 text-sm sm:text-base">Feedback</h4>
                        <p className="text-sm sm:text-base text-gray-700">{feedback.feedback}</p>
                      </div>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-3 sm:pt-4 border-t border-gray-100 gap-2 sm:gap-0">
                    <div className="flex items-center space-x-1">
                      {renderStars(feedback.rating)}
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-gray-600">
                      Rating: {feedback.rating}/5
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {feedbacks.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8 sm:py-12"
          >
            <p className="text-sm sm:text-base text-gray-600">No feedback available yet.</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default InterviewFeedback
