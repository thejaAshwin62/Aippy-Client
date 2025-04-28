"use client";

import { useState, useEffect, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, X, User, LogIn } from "lucide-react";
import customFetch from "../lib/customFetch";
import { UserContext } from "../App";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const [loadingUser, setLoadingUser] = useState(currentUser === null);
  const navigate = useNavigate();
  const isLandingPage = location.pathname === "/";

  useEffect(() => {
    if (currentUser === null) {
      const fetchUser = async () => {
        try {
          const res = await customFetch.get("/current-user");
          setCurrentUser(res.data);
        } catch {
          setCurrentUser(null);
        } finally {
          setLoadingUser(false);
        }
      };
      fetchUser();
    } else {
      setLoadingUser(false);
    }
    // eslint-disable-next-line
  }, []);

  // console.log(currentUser)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const handleLogout = async () => {
    try {
      await customFetch.post("/logout");
    } catch {}
    setCurrentUser(null);
    navigate("/");
  };

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-white shadow-md py-2" : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-2xl font-bold text-indigo-600"
            >
              <span className="text-gray-900">AI</span>pply
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <NavLink to="/" scrolled={scrolled} isLandingPage={isLandingPage}>
              Home
            </NavLink>
            <NavLink
              to="/jobs"
              scrolled={scrolled}
              isLandingPage={isLandingPage}
            >
              Browse Jobs
            </NavLink>
            {currentUser?.role === "Company" && (
              <NavLink
                to="/dashboard/company"
                scrolled={scrolled}
                isLandingPage={isLandingPage}
              >
                For Companies
              </NavLink>
            )}
            <NavLink
              to="/dashboard/candidate"
              scrolled={scrolled}
              isLandingPage={isLandingPage}
            >
              Dashboard
            </NavLink>
            {currentUser?.role === "Admin" && (
              <NavLink
                to="/admin"
                scrolled={scrolled}
                isLandingPage={isLandingPage}
              >
                Admin
              </NavLink>
            )}
            <div className="flex items-center space-x-4">
              {loadingUser ? (
                <div className="flex items-center justify-center h-10 w-24">
                  <span className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-indigo-600"></span>
                </div>
              ) : currentUser ? (
                <>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <button
                      onClick={handleLogout}
                      className="flex items-center px-4 py-2 rounded-full border border-red-600 text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Logout
                    </button>
                  </motion.div>
                </>
              ) : (
                <>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      to="/login"
                      className="flex items-center px-4 py-2 rounded-full border border-indigo-600 text-indigo-600 hover:bg-indigo-50 transition-colors"
                    >
                      <LogIn size={18} className="mr-2" />
                      Sign In
                    </Link>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      to="/register"
                      className="flex items-center px-4 py-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                    >
                      <User size={18} className="mr-2" />
                      Register
                    </Link>
                  </motion.div>
                </>
              )}
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden bg-white shadow-lg absolute top-full left-0 right-0"
        >
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <MobileNavLink to="/" scrolled={true} isLandingPage={isLandingPage}>
              Home
            </MobileNavLink>
            <MobileNavLink
              to="/jobs"
              scrolled={true}
              isLandingPage={isLandingPage}
            >
              Browse Jobs
            </MobileNavLink>
            {currentUser?.role === "Company" && (
              <MobileNavLink
                to="/dashboard/company"
                scrolled={true}
                isLandingPage={isLandingPage}
              >
                For Companies
              </MobileNavLink>
            )}
            <MobileNavLink
              to="/dashboard/candidate"
              scrolled={true}
              isLandingPage={isLandingPage}
            >
              Dashboard
            </MobileNavLink>
            {currentUser?.role === "Admin" && (
              <MobileNavLink
                to="/admin"
                scrolled={true}
                isLandingPage={isLandingPage}
              >
                Admin
              </MobileNavLink>
            )}
            {loadingUser ? (
              <div className="flex items-center justify-center h-10 w-24">
                <span className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-indigo-600"></span>
              </div>
            ) : currentUser ? (
              <button
                onClick={handleLogout}
                className="flex items-center justify-center px-4 py-2 rounded-full border border-red-600 text-red-600"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center justify-center px-4 py-2 rounded-full border border-indigo-600 text-indigo-600"
                >
                  <LogIn size={18} className="mr-2" />
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="flex items-center justify-center px-4 py-2 rounded-full bg-indigo-600 text-white"
                >
                  <User size={18} className="mr-2" />
                  Register
                </Link>
              </>
            )}
          </div>
        </motion.div>
      )}
    </header>
  );
};

// Helper components for navigation links
const NavLink = ({ to, children, scrolled, isLandingPage }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link
      to={to}
      className={`relative font-medium transition-colors ${
        isActive ? "text-indigo-600" : "text-gray-900 hover:text-indigo-600"
      }`}
    >
      {children}
      {isActive && (
        <motion.div
          layoutId="underline"
          className="absolute -bottom-1 left-0 right-0 h-0.5 bg-indigo-600"
        />
      )}
    </Link>
  );
};

const MobileNavLink = ({ to, children, scrolled, isLandingPage }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link
      to={to}
      className={`py-2 px-4 block rounded ${
        isLandingPage && !scrolled
          ? isActive
            ? "bg-indigo-800 text-white"
            : "text-white"
          : isActive
          ? "bg-indigo-50 text-indigo-600"
          : "text-gray-900"
      }`}
    >
      {children}
    </Link>
  );
};

export default Header;
