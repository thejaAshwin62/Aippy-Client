import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Briefcase, MapPin,  DollarSign, Check, Loader2, X } from 'lucide-react'

export const JobPostingForm = ({ onClose, initialData = null, onSubmit, isEditMode = false, allowedJobTypes }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    salary: "",
    jobType: allowedJobTypes && allowedJobTypes.length > 0 ? allowedJobTypes[0] : "Full-time",
    yearsOfExperience: "",
    techStack: "",
    mockInterviewRequired: false,
    minimumMockScore: "",
    mockInterviewPercentage: "",
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        description: initialData.description || "",
        location: initialData.location || "",
        salary: initialData.salary || "",
        jobType: initialData.jobType || (allowedJobTypes && allowedJobTypes.length > 0 ? allowedJobTypes[0] : "Full-time"),
        yearsOfExperience: initialData.yearsOfExperience || "",
        techStack: initialData.techStack?.join(", ") || "",
        mockInterviewRequired: initialData.mockInterviewRequired || false,
        minimumMockScore: initialData.minimumMockScore || "",
        mockInterviewPercentage: initialData.mockInterviewPercentage || "",
      })
    }
  }, [initialData, allowedJobTypes])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }))
    }
  }

  const validate = () => {
    const newErrors = {}

    // Only validate required fields if creating a new job
    if (!isEditMode) {
    if (!formData.title.trim()) {
      newErrors.title = "Job title is required"
    }
    if (!formData.description.trim()) {
      newErrors.description = "Job description is required"
    }
    if (!formData.location.trim()) {
      newErrors.location = "Location is required"
    }
      if (!formData.salary.trim()) {
        newErrors.salary = "Salary is required"
      }
      if (!formData.yearsOfExperience.trim()) {
      newErrors.yearsOfExperience = "Years of experience is required"
      }
      if (!formData.techStack.trim()) {
        newErrors.techStack = "Tech stack is required"
      }
    }

    // Validate mock interview fields if required
    if (formData.mockInterviewRequired) {
      if (!formData.minimumMockScore) {
        newErrors.minimumMockScore = "Minimum mock score is required"
      } else if (isNaN(formData.minimumMockScore) || formData.minimumMockScore < 0 || formData.minimumMockScore > 100) {
      newErrors.minimumMockScore = "Score must be between 0 and 100"
    }
      if (!formData.mockInterviewPercentage) {
        newErrors.mockInterviewPercentage = "Interview percentage is required"
      } else if (isNaN(formData.mockInterviewPercentage) || formData.mockInterviewPercentage < 0 || formData.mockInterviewPercentage > 100) {
      newErrors.mockInterviewPercentage = "Percentage must be between 0 and 100"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)
    try {
      // Convert tech stack string to array
      const submissionData = {
        ...formData,
        techStack: formData.techStack.split(",").map(tech => tech.trim()),
      }
      await onSubmit(submissionData)
      onClose()
    } catch (error) {
      console.error("Error submitting form:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="relative">
      {/* Close button for modal */}
      <button
        onClick={onClose}
        className="fixed top-16 right-4 z-50 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
      >
        <X size={25} className="sm:w-6 sm:h-6" />
      </button>

      <div className="flex w-full mx-auto mt-4 sm:mt-6">
        {/* Left sidebar - Hide on mobile */}
        <div className="hidden md:flex w-72 bg-white border-r border-gray-200 flex-col">
          <div className="p-6 ">
            </div>

          <div className="flex-1 px-6 py-8">
            <div className="space-y-8">
              <StepItem number={1} title="JOB DETAILS" completed={true} />
              <StepItem number={2} title="REQUIREMENTS" completed={true} />
              <StepItem number={3} title="INTERVIEW SETUP" completed={true} />
              <StepItem number={4} title="REVIEW & SUBMIT" active={true} />
                    </div>
                      </div>
          
          <div className="p-6">
            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                  <Briefcase className="w-6 h-6 text-indigo-600" />
                  </div>
              </div>
              <p className="text-sm text-gray-600 text-center leading-relaxed">
                {isEditMode ? "Update your job posting to attract the best candidates." : "Create a new job posting to find your perfect candidate."}
              </p>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 p-4 mt-10 sm:mt-1 sm:p-6 md:p-8 lg:p-12 max-h-[90vh] overflow-y-auto">
          <div className="max-w-3xl mx-auto">
            {/* Form error message */}
            {errors.submit && (
              <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm sm:text-base text-red-600">{errors.submit}</p>
              </div>
            )}

            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                {isEditMode ? "Edit Job Posting" : "Create Job Posting"}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    JOB TITLE {isEditMode && "(Optional)"}
                  </label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-2 text-sm sm:text-base rounded-lg border ${
                        errors.title ? "border-red-500" : "border-gray-300"
                      } focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                      placeholder="Enter job title"
                    />
                  </div>
                  {errors.title && (
                    <p className="mt-1 text-xs sm:text-sm text-red-500">{errors.title}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    JOB DESCRIPTION {isEditMode && "(Optional)"}
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      errors.description ? "border-red-500" : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none`}
                    placeholder="Describe the job responsibilities and requirements..."
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-500">{errors.description}</p>
                  )}
                  </div>

                  <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    LOCATION {isEditMode && "(Optional)"}
                    </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                        errors.location ? "border-red-500" : "border-gray-300"
                      } focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                      placeholder="Enter job location"
                    />
                  </div>
                  {errors.location && (
                    <p className="mt-1 text-sm text-red-500">{errors.location}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    SALARY {isEditMode && "(Optional)"}
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      name="salary"
                      value={formData.salary}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                        errors.salary ? "border-red-500" : "border-gray-300"
                      } focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                      placeholder="Enter salary range"
                    />
                  </div>
                  {errors.salary && (
                    <p className="mt-1 text-sm text-red-500">{errors.salary}</p>
                  )}
                  </div>

                  <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    JOB TYPE {isEditMode && "(Optional)"}
                    </label>
                    <select
                      name="jobType"
                      value={formData.jobType}
                      onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                    {(allowedJobTypes || [
                      'FULL_TIME', 'PART_TIME', 'CONTRACT', 'REMOTE']
                    ).map(type => (
                        <option key={type} value={type}>
                        {type.replace('_', ' ').replace('FULL TIME', 'Full Time').replace('PART TIME', 'Part Time').replace('HYBRID', 'Hybrid').replace('REMOTE', 'Remote')}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    YEARS OF EXPERIENCE {isEditMode && "(Optional)"}
                    </label>
                    <input
                      type="number"
                      name="yearsOfExperience"
                      value={formData.yearsOfExperience}
                      onChange={handleChange}
                      min="0"
                    className={`w-full px-4 py-2 rounded-lg border ${
                        errors.yearsOfExperience ? "border-red-500" : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                    placeholder="Enter years of experience"
                    />
                    {errors.yearsOfExperience && (
                      <p className="mt-1 text-sm text-red-500">{errors.yearsOfExperience}</p>
                    )}
                  </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    TECH STACK {isEditMode && "(Optional)"}
                    </label>
                  <input
                    type="text"
                    name="techStack"
                    value={formData.techStack}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      errors.techStack ? "border-red-500" : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                    placeholder="Enter tech stack (comma-separated)"
                  />
                  {errors.techStack && (
                    <p className="mt-1 text-sm text-red-500">{errors.techStack}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="mockInterviewRequired"
                      name="mockInterviewRequired"
                      checked={formData.mockInterviewRequired}
                      onChange={handleChange}
                      className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <label htmlFor="mockInterviewRequired" className="text-sm font-medium text-gray-700">
                      Require Mock Interview
                    </label>
                  </div>
                  </div>

                {formData.mockInterviewRequired && (
                  <>
                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        MINIMUM MOCK SCORE {isEditMode && "(Optional)"}
                    </label>
                      <input
                        type="number"
                        name="minimumMockScore"
                        value={formData.minimumMockScore}
                        onChange={handleChange}
                        min="0"
                        max="100"
                        className={`w-full px-4 py-2 rounded-lg border ${
                          errors.minimumMockScore ? "border-red-500" : "border-gray-300"
                        } focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                        placeholder="Enter minimum score (0-100)"
                      />
                      {errors.minimumMockScore && (
                        <p className="mt-1 text-sm text-red-500">{errors.minimumMockScore}</p>
                      )}
                  </div>

                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        INTERVIEW WEIGHT {isEditMode && "(Optional)"}
                    </label>
                      <input
                        type="number"
                        name="mockInterviewPercentage"
                        value={formData.mockInterviewPercentage}
                        onChange={handleChange}
                        min="0"
                        max="100"
                        className={`w-full px-4 py-2 rounded-lg border ${
                          errors.mockInterviewPercentage ? "border-red-500" : "border-gray-300"
                        } focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                        placeholder="Enter interview weight (0-100)"
                      />
                    {errors.mockInterviewPercentage && (
                      <p className="mt-1 text-sm text-red-500">{errors.mockInterviewPercentage}</p>
                    )}
                    </div>
                  </>
                )}
              </div>

              <div className="pt-4">
                <div className="flex items-start mb-4 sm:mb-6">
                  <div className="flex items-center h-5">
                    <input
                      id="terms"
                      type="checkbox"
                      checked={acceptTerms}
                      onChange={() => setAcceptTerms(!acceptTerms)}
                      className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-indigo-300"
                    />
                  </div>
                  <label htmlFor="terms" className="ml-2 text-xs sm:text-sm text-gray-600">
                    I confirm that all the information provided is accurate and complete
                  </label>
                </div>
                {errors.terms && <p className="mt-1 text-xs sm:text-sm text-red-500 mb-4">{errors.terms}</p>}

                <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full sm:w-auto px-4 sm:px-6 py-2 border border-gray-300 rounded-lg text-sm sm:text-base text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-indigo-600 rounded-lg text-sm sm:text-base text-white hover:bg-indigo-700 transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                        Saving...
                      </span>
                    ) : isEditMode ? (
                      "Save Changes"
                    ) : (
                      "Create Job"
                    )}
                  </motion.button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

// Step item component for the sidebar
const StepItem = ({ number, title, completed, active }) => {
  return (
    <div className="flex items-center">
      <div 
        className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
          completed ? 'bg-green-500 text-white' : 
          active ? 'bg-indigo-600 text-white' : 
          'bg-gray-200 text-gray-600'
        }`}
      >
        {completed ? <Check className="w-3 h-3" /> : number}
      </div>
      <span className={`text-xs font-medium tracking-wider ${
        active ? 'text-indigo-600' : 
        completed ? 'text-green-500' : 
        'text-gray-400'
      }`}>
        {title}
      </span>
    </div>
  )
}
