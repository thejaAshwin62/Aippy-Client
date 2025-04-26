import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { MapPin, Briefcase, Clock, X } from "lucide-react"
import customFetch from "../lib/customFetch"

const JobCard = ({ job, index, user, onViewJob, showMockInterviewButton }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Check if user has already applied
  const hasApplied = user?.appliedJobIds?.includes(job.id);

  const handleStartMockInterview = async () => {
    try {
      setIsLoading(true);
      if (!user || !user.id) {
        navigate('/login');
        return;
      }

      // Fetch job details
      const jobResponse = await customFetch.get(`/jobs/${job.id}`);
      const jobDetails = jobResponse.data;

      // Generate mock questions with job details in the request body
      await customFetch.post(`/mock-questions/generate/job/${job.id}/user/${user.id}`, {
        techStack: jobDetails.techStack.join(', '),
        jobDescription: jobDetails.description,
        yearsOfExperience: jobDetails.yearsOfExperience.toString()
      });

      // Navigate to mock interview with both IDs
      navigate(`/mock-interview/${job.id}`, { 
        state: { 
          userId: user.id,
          jobId: job.id
        }
      });
    } catch (error) {
      console.error('Error starting mock interview:', error);
      if (error.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
      className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100"
    >
      <div className="p-4 sm:p-6">
        <div className="flex flex-col md:flex-row md:items-center">
          <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
            {job.company.logo ? (
              <img
                src={job.company.logo}
                alt={`${job.company.companyName} logo`}
                className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg"
              />
            ) : (
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-indigo-100 flex items-center justify-center text-xl sm:text-2xl font-bold text-indigo-600">
                {job.company.companyName?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <div className="flex-grow">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">{job.title}</h2>
                <p className="text-indigo-600 font-medium text-sm sm:text-base">{job.company.companyName}</p>
              </div>

              <div className="mt-2 md:mt-0">
                <span className="text-gray-900 font-medium text-sm sm:text-base">
                  ${job.salary ? job.salary.toLocaleString() : 'Not specified'}
                </span>
              </div>
            </div>

            <div className="mt-3 sm:mt-4 flex flex-wrap gap-2">
              {job.techStack.map((tech) => (
                <span key={tech} className="px-2 sm:px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs sm:text-sm">
                  {tech}
                </span>
              ))}
            </div>

            <div className="mt-3 sm:mt-4 flex flex-wrap gap-2 md:gap-6 text-gray-600 text-sm">
              <div className="flex items-center">
                <MapPin size={16} className="mr-1" />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center">
                <Briefcase size={16} className="mr-1" />
                <span>{job.jobType}</span>
              </div>
              <div className="flex items-center">
                <Clock size={16} className="mr-1" />
                <span>{job.yearsOfExperience} years experience</span>
              </div>
              {job.mockInterviewRequired && (
                <div className="flex items-center">
                  <span className="text-indigo-600 font-medium">Min Score: {job.minimumMockScore || 'Not specified'}%</span>
                </div>
              )}
            </div>

            <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row gap-2 sm:gap-3">
              {hasApplied ? (
                <div className="w-full sm:w-auto flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 rounded-lg bg-green-100 text-green-800 font-medium text-sm sm:text-base">
                  ✓ Already Applied
                </div>
              ) : (
                showMockInterviewButton && (
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="w-full sm:w-auto">
                    <button
                      onClick={handleStartMockInterview}
                      disabled={isLoading}
                      className="w-full inline-flex justify-center items-center px-4 sm:px-6 py-2 sm:py-3 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                    >
                      {isLoading ? (
                        <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white"></div>
                      ) : (
                        'Start Mock Interview'
                      )}
                    </button>
                  </motion.div>
                )
              )}

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onViewJob(job)}
                className="w-full sm:w-auto inline-flex justify-center items-center px-4 sm:px-6 py-2 sm:py-3 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors text-sm sm:text-base"
              >
                View
              </motion.button>

              {hasApplied && (
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate(`/feedback/${job.id}`)}
                  className="w-full sm:w-auto inline-flex justify-center items-center px-4 sm:px-6 py-2 sm:py-3 rounded-lg border border-indigo-300 text-indigo-700 font-medium hover:bg-indigo-50 transition-colors text-sm sm:text-base"
                >
                  View Application
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default JobCard; 