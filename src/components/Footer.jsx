import { Link, useNavigate } from "react-router-dom"
import { Github, Twitter, Linkedin, Mail, LogOut } from "lucide-react"
import { useState, useEffect } from "react"
import { toast } from "react-toastify"


const Footer = () => {
  const navigate = useNavigate()
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("token")
    setIsAuthenticated(!!token)
  }, [])

  const handleLogout = async () => {
    try {
      // Clear local storage
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      
      // Update authentication state
      setIsAuthenticated(false)
      
      // Show success message
      toast.success("Logged out successfully")
      
      // Navigate to home page
      navigate("/")
    } catch (error) {
      toast.error("Error logging out")
    }
  }

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="text-2xl font-bold">
              <span className="text-white">AI</span>
              <span className="text-indigo-400">pply</span>
            </Link>
            <p className="mt-4 text-gray-400">Apply with Confidence. Stand Out with AI.</p>
            <div className="flex space-x-4 mt-6">
              <SocialIcon icon={<Twitter size={20} />} />
              <SocialIcon icon={<Linkedin size={20} />} />
              <SocialIcon icon={<Github size={20} />} />
              <SocialIcon icon={<Mail size={20} />} />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">For Candidates</h3>
            <ul className="space-y-2">
              <FooterLink to="/">Home</FooterLink>
              <FooterLink to="/jobs">Browse Jobs</FooterLink>
              <FooterLink to="/dashboard/candidate">My Applications</FooterLink>
              <FooterLink to="/">AI Interview Prep</FooterLink>
              <FooterLink to="/">Career Resources</FooterLink>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">For Companies</h3>
            <ul className="space-y-2">
              <FooterLink to="/dashboard/company">Post a Job</FooterLink>
              <FooterLink to="/">Talent Search</FooterLink>
              <FooterLink to="/">AI Screening</FooterLink>
              <FooterLink to="/">Enterprise Solutions</FooterLink>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <FooterLink to="/">About Us</FooterLink>
              <FooterLink to="/">Blog</FooterLink>
              <FooterLink to="/">Privacy Policy</FooterLink>
              <FooterLink to="/">Terms of Service</FooterLink>
              {isAuthenticated ? (
                <li>
                  <button
                    onClick={handleLogout}
                    className="text-gray-400 hover:text-indigo-400 transition-colors flex items-center gap-2"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </li>
              ) : (
                <>
                  <FooterLink to="/login">Sign In</FooterLink>
                  <FooterLink to="/register">Register</FooterLink>
                </>
              )}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} AIpply. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

const SocialIcon = ({ icon }) => (
  <a
    href="#"
    className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-indigo-600 transition-colors"
  >
    {icon}
  </a>
)

const FooterLink = ({ to, children }) => (
  <li>
    <Link to={to} className="text-gray-400 hover:text-indigo-400 transition-colors">
      {children}
    </Link>
  </li>
)

export default Footer
