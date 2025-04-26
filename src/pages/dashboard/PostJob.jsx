"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { JobPostingForm } from "../../components/dashboard/JobPostingForm"
import customFetch from "../../lib/customFetch"

const PostJob = () => {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchCurrentUser()
  }, [])

  const fetchCurrentUser = async () => {
    try {
      setIsLoading(true)
      const response = await customFetch.get("/current-user")
      const user = response.data
      setCurrentUser(user)
    } catch (error) {
      console.error("Error fetching user:", error)
      setError("Failed to load user data. Please try again.")
      navigate("/dashboard/company")
    } finally {
      setIsLoading(false)
    }
  }

  const handleJobSubmit = async (data) => {
    try {
      setIsSubmitting(true)
      setError(null)
      
      if (!currentUser?.companyId) {
        throw new Error("No company ID found")
      }

      // Add current date and time and company ID
      const jobData = {
        ...data,
        postedDate: new Date().toISOString(),
        company: {
          id: currentUser.companyId
        }
      }
      
      await customFetch.post("/jobs", jobData)
      
      // Redirect back to dashboard on success
      navigate("/dashboard/company")
    } catch (error) {
      console.error("Error posting job:", error)
      setError(error.message || "Failed to post job. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    navigate("/dashboard/company")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (!currentUser?.companyId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-sm sm:text-base text-red-600 mb-4">Please create a company profile first.</p>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-4 py-2 bg-indigo-600 text-sm sm:text-base text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen overflow-hidden bg-gray-50">
      {error && (
        <div className="fixed top-4 right-4 z-50 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg shadow-lg">
          <p className="text-sm sm:text-base text-red-600">{error}</p>
        </div>
      )}
      
      <div className="h-full overflow-y-auto">
        <JobPostingForm 
          onClose={handleCancel}
          onSubmit={handleJobSubmit}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  )
}

export default PostJob 