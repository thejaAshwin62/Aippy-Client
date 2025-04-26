import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Check, Building, Mail, Globe, X } from 'lucide-react'


const CompanyProfileForm = ({ onClose, initialData = null, onSubmit, isCreateOnly = false }) => {
  const [formData, setFormData] = useState({
    companyName: "",
    companyEmail: "",
    website: "",
    description: "",
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)

  useEffect(() => {
    if (initialData) {
      setFormData({
        companyName: initialData.companyName || "",
        companyEmail: initialData.companyEmail || "",
        website: initialData.website || "",
        description: initialData.description || "",
      })
    }
  }, [initialData])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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

    // Only validate required fields if creating a new company
    if (isCreateOnly) {
    if (!formData.companyName.trim()) {
      newErrors.companyName = "Company name is required"
    }
    if (!formData.companyEmail.trim()) {
      newErrors.companyEmail = "Company email is required"
    }
    if (!formData.description.trim()) {
        newErrors.description = "Company description is required"
      }
    }

    // Validate email format if provided
    if (formData.companyEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.companyEmail)) {
      newErrors.companyEmail = "Invalid email format"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)
    try {
      await onSubmit(formData)
      if (!isCreateOnly) {
        onClose()
      }
    } catch (error) {
      console.error("Error submitting form:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="relative">
      {/* Close button for modal */}
      {!isCreateOnly && (
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 sm:top-4 sm:right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X size={20} className="sm:w-6 sm:h-6" />
        </button>
      )}

      <div className="flex">
        {/* Left sidebar - Hide on mobile */}
        <div className="hidden md:flex w-72 bg-white border-r border-gray-200 flex-col">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center">
             
            </div>
          </div>
          
          <div className="flex-1 px-6 py-8">
            <div className="space-y-8">
              <StepItem number={1} title="BASIC INFORMATION" completed={true} />
              <StepItem number={2} title="COMPANY DETAILS" completed={true} />
              <StepItem number={3} title="CONTACT INFO" completed={true} />
              <StepItem number={4} title="DOCUMENTS" completed={true} />
              <StepItem number={5} title="REVIEW & SUBMIT" active={true} />
            </div>
          </div>
          
          <div className="p-6">
            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                  <Building className="w-6 h-6 text-indigo-600" />
                </div>
              </div>
              <p className="text-sm text-gray-600 text-center leading-relaxed">
                Complete your company registration to start posting jobs and connecting with talented candidates.
              </p>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 p-4 sm:p-6 md:p-8 lg:p-12 max-h-[90vh] overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            {/* Form error message */}
            {errors.submit && (
              <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm sm:text-base text-red-600">{errors.submit}</p>
              </div>
            )}

            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                {initialData ? "Edit Company Profile" : "Create Company Profile"}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    COMPANY NAME {!isCreateOnly && "(Optional)"}
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-2 text-sm sm:text-base rounded-lg border ${
                        errors.companyName ? "border-red-500" : "border-gray-300"
                      } focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                      placeholder="Enter company name"
                    />
                  </div>
                  {errors.companyName && (
                    <p className="mt-1 text-xs sm:text-sm text-red-500">{errors.companyName}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    COMPANY EMAIL {!isCreateOnly && "(Optional)"}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="email"
                    name="companyEmail"
                    value={formData.companyEmail}
                    onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                      errors.companyEmail ? "border-red-500" : "border-gray-300"
                      } focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                      placeholder="Enter company email"
                  />
                  </div>
                  {errors.companyEmail && (
                    <p className="mt-1 text-sm text-red-500">{errors.companyEmail}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    WEBSITE (Optional)
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                      errors.website ? "border-red-500" : "border-gray-300"
                      } focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                      placeholder="https://example.com"
                  />
                  </div>
                  {errors.website && (
                    <p className="mt-1 text-sm text-red-500">{errors.website}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    COMPANY DESCRIPTION {!isCreateOnly && "(Optional)"}
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className={`w-full px-4 py-2 text-sm sm:text-base rounded-lg border ${
                      errors.description ? "border-red-500" : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none`}
                    placeholder="Describe your company..."
                  />
                  {errors.description && (
                    <p className="mt-1 text-xs sm:text-sm text-red-500">{errors.description}</p>
                  )}
                </div>
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
                    I accept the <a href="#" className="text-indigo-600 hover:underline">Term of Conditions</a> and <a href="#" className="text-indigo-600 hover:underline">Privacy Policy</a>
                  </label>
                </div>
                {errors.terms && <p className="mt-1 text-xs sm:text-sm text-red-500 mb-4">{errors.terms}</p>}

                <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
                  {!isCreateOnly && (
                    <button
                      type="button"
                      onClick={onClose}
                      className="w-full sm:w-auto px-4 sm:px-6 py-2 border border-gray-300 rounded-lg text-sm sm:text-base text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-indigo-600 rounded-lg text-sm sm:text-base text-white hover:bg-indigo-700 transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </span>
                    ) : initialData ? (
                      "Save Changes"
                    ) : (
                      "Create Profile"
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

export default CompanyProfileForm
