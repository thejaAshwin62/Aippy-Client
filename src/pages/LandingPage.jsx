"use client";

import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import {
  ChevronDown,
  Briefcase,
  User,
  Shield,
  CheckCircle,
  ArrowRight,
  Star,
  Sparkles,
  Code,
  MessageSquare,
  LineChart,
  Rocket,
  Brain,
} from "lucide-react";
import { SparklesCore } from "../components/ui/sparkles";
import { TypewriterEffect } from "../components/ui/typewriter-effect";
import { InfiniteMovingCards } from "../components/ui/infinite-moving-cards";
import Footer from "../components/Footer";
import { BackgroundGradient } from "../components/ui/background-gradient";


const LandingPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const statsRef = useRef(null);
  const processRef = useRef(null);

  // Parallax effect for hero section
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  // Animated counter for stats
  const count1 = useMotionValue(0);
  const count2 = useMotionValue(0);
  const count3 = useMotionValue(0);

  const smoothCount1 = useSpring(count1, { stiffness: 100, damping: 30 });
  const smoothCount2 = useSpring(count2, { stiffness: 100, damping: 30 });
  const smoothCount3 = useSpring(count3, { stiffness: 100, damping: 30 });

  useEffect(() => {
    window.scrollTo(0, 0);
    setIsVisible(true);

    const timeout = setTimeout(() => {
      count1.set(95);
      count2.set(10000);
      count3.set(85);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [count1, count2, count3]);

  // Testimonials for InfiniteMovingCards
  const testimonials = [
    {
      name: "Sarah J.",
      title: "Software Engineer",
      text: "AIpply helped me prepare for interviews like never before. The AI mock interviews were incredibly realistic and the feedback was spot on. I landed my dream job at a tech giant!",
      avatar:
        "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    },
    {
      name: "Michael T.",
      title: "Hiring Manager",
      text: "As a hiring manager, AIpply has revolutionized our recruitment process. The quality of candidates has improved dramatically, and the AI screening saves us countless hours.",
      avatar:
        "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    },
    {
      name: "Emily R.",
      title: "UX Designer",
      text: "The personalized feedback after each mock interview helped me identify my weaknesses and improve rapidly. I'm now much more confident in real interviews.",
      avatar:
        "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    },
    {
      name: "David K.",
      title: "Data Scientist",
      text: "I was skeptical about AI-powered job applications, but AIpply exceeded my expectations. The platform is intuitive, and the AI feedback is genuinely helpful.",
      avatar:
        "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    },
    {
      name: "Jessica M.",
      title: "Product Manager",
      text: "After using AIpply for just two weeks, I received three job offers! The AI-powered interview preparation made all the difference in my confidence and performance.",
      avatar:
        "https://images.pexels.com/photos/1587009/pexels-photo-1587009.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    },
  ];

  // Words for TypewriterEffect
  const words = [
    { text: "Apply" },
    { text: "with" },
    { text: "Confidence." },
    { text: "Stand" },
    { text: "Out" },
    { text: "with" },
    { text: "AI.", className: "text-purple-600" },
  ];



  // Features data
  const features = [
    {
      title: "AI Mock Interviews",
      description:
        "Practice with our AI interviewer to get real-time feedback and improve your responses.",
      icon: <MessageSquare className="text-purple-600" size={32} />,
      color: "from-purple-100 to-purple-200",
      delay: 0.1,
    },
    {
      title: "Skill Assessment",
      description:
        "Get an objective evaluation of your technical and soft skills to highlight your strengths.",
      icon: <Brain className="text-cyan-600" size={32} />,
      color: "from-cyan-100 to-blue-200",
      delay: 0.2,
    },
    {
      title: "Application Tracking",
      description:
        "Track all your job applications in one place and never miss an opportunity.",
      icon: <LineChart className="text-emerald-600" size={32} />,
      color: "from-emerald-100 to-green-200",
      delay: 0.3,
    },
    {
      title: "AI Skill Matcher",
      description:
        "Use AI to match your skills with the best job opportunities, recommending roles based on your experience and expertise.",
      icon: <Brain className="text-yellow-600" size={32} />,
      color: "from-yellow-100 to-yellow-200",
      delay: 0.4,
    },
  ];

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Hero Section */}
          <section
            ref={heroRef}
            className="relative h-screen flex items-center overflow-hidden"
          >
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-purple-50 via-indigo-50 to-white z-0">
              <div className="absolute inset-0 bg-[url('/grid-pattern.png')] opacity-20"></div>
            </div>

            {/* Animated Particles */}
            <div className="absolute inset-0 z-10">
              <SparklesCore
                id="tsparticlesfullpage"
                background="transparent"
                minSize={2}
                maxSize={3}
                particleDensity={100}
                particleColor="#8b5cf6"
                particleSpeed={0.2}
                className="opacity-50"
              />
            </div>

            {/* Floating Elements */}
            <motion.div
              className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-purple-200/50 blur-3xl"
              animate={{
                x: [0, 30, 0],
                y: [0, -30, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                repeat: Number.POSITIVE_INFINITY,
                duration: 8,
                ease: "easeInOut",
              }}
            />

            <motion.div
              className="absolute bottom-1/3 right-1/4 w-72 h-72 rounded-full bg-blue-200/50 blur-3xl"
              animate={{
                x: [0, -40, 0],
                y: [0, 40, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                repeat: Number.POSITIVE_INFINITY,
                duration: 10,
                ease: "easeInOut",
              }}
            />

            {/* Hero Content */}
            <div className="container mx-auto px-4 md:px-6 relative z-20">
              <motion.div
                className="max-w-4xl mx-auto text-center"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                {/* Logo */}
                <motion.div
                  className="flex items-center justify-center mb-8"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                    delay: 0.2,
                  }}
                >
                  <div className="relative w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <Sparkles className="w-10 h-10 text-white" />
                    <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </motion.div>

                {/* Headline */}
                <div className="mb-8">
                  <TypewriterEffect
                    words={words}
                    className="text-gray-800 text-4xl md:text-6xl font-bold"
                  />
                </div>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="mt-6 text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto leading-relaxed"
                >
                  AIpply uses cutting-edge artificial intelligence to help you
                  prepare for interviews, highlight your strengths, and land
                  your dream job.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="mt-12 flex flex-col sm:flex-row gap-6 items-center justify-center"
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative group"
                  >
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full opacity-75 group-hover:opacity-100 blur transition duration-200"></div>
                    <Link
                      to="/jobs"
                      className="relative flex items-center justify-center px-8 py-4 rounded-full bg-white text-purple-700 font-medium text-lg transition-colors"
                    >
                      <Briefcase size={20} className="mr-2" />
                      Get Started
                      <motion.div
                        className="absolute right-4 opacity-0 group-hover:opacity-100 group-hover:right-2"
                        transition={{ duration: 0.3 }}
                      >
                        <ArrowRight size={18} />
                      </motion.div>
                    </Link>
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
              style={{ opacity, y }}
              className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-gray-600"
            >
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
              >
                <ChevronDown size={32} />
              </motion.div>
            </motion.div>
          </section>

          {/* Stats Section */}
          <section
            ref={statsRef}
            className="py-20 bg-white relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[url('/grid-pattern.png')] opacity-5"></div>

            {/* Animated Gradient Blobs */}
            <motion.div
              className="absolute top-0 left-1/4 w-64 h-64 rounded-full bg-purple-100/80 blur-3xl"
              animate={{
                x: [0, 50, 0],
                y: [0, 30, 0],
              }}
              transition={{
                repeat: Number.POSITIVE_INFINITY,
                duration: 8,
                ease: "easeInOut",
              }}
            />

            <motion.div
              className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-blue-100/80 blur-3xl"
              animate={{
                x: [0, -30, 0],
                y: [0, -50, 0],
              }}
              transition={{
                repeat: Number.POSITIVE_INFINITY,
                duration: 10,
                ease: "easeInOut",
              }}
            />

            <div className="container mx-auto px-4 md:px-6 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="bg-gradient-to-br from-purple-50 to-purple-100 backdrop-blur-sm rounded-3xl p-8 border border-purple-200 shadow-xl"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-4 p-3 bg-purple-200 rounded-2xl">
                      <CheckCircle className="w-8 h-8 text-purple-600" />
                    </div>
                    <motion.h3 className="text-5xl font-bold text-purple-700 mb-2">
                      {smoothCount1.get().toFixed(0)}%
                    </motion.h3>
                    <p className="text-purple-600">Success Rate</p>
                    <p className="mt-4 text-gray-600 text-sm">
                      Of our users successfully land interviews within 30 days
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="bg-gradient-to-br from-blue-50 to-blue-100 backdrop-blur-sm rounded-3xl p-8 border border-blue-200 shadow-xl"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-4 p-3 bg-blue-200 rounded-2xl">
                      <User className="w-8 h-8 text-blue-600" />
                    </div>
                    <motion.h3 className="text-5xl font-bold text-blue-700 mb-2">
                      {smoothCount2.get().toFixed(0)}+
                    </motion.h3>
                    <p className="text-blue-600">Active Users</p>
                    <p className="mt-4 text-gray-600 text-sm">
                      Professionals using AIpply to advance their careers
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="bg-gradient-to-br from-emerald-50 to-emerald-100 backdrop-blur-sm rounded-3xl p-8 border border-emerald-200 shadow-xl"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-4 p-3 bg-emerald-200 rounded-2xl">
                      <Star className="w-8 h-8 text-emerald-600" />
                    </div>
                    <motion.h3 className="text-5xl font-bold text-emerald-700 mb-2">
                      {smoothCount3.get().toFixed(0)}%
                    </motion.h3>
                    <p className="text-emerald-600">Satisfaction</p>
                    <p className="mt-4 text-gray-600 text-sm">
                      Of employers report higher quality candidates through
                      AIpply
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Features Section - Bento Grid */}
          <section
            ref={featuresRef}
            className="py-24 bg-gray-50 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[url('/grid-pattern.png')] opacity-5"></div>

            <div className="container mx-auto px-4 md:px-6 relative z-10">
              <div className="text-center mb-16">
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="inline-block mb-4 px-4 py-1.5 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-full backdrop-blur-sm border border-purple-200"
                >
                  <span className="text-sm font-medium bg-gradient-to-r from-purple-600 to-indigo-600 inline-block text-transparent bg-clip-text">
                    Powered by AI
                  </span>
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="text-4xl md:text-5xl font-bold text-gray-800 mb-6"
                >
                  <span className="bg-gradient-to-r from-purple-600 via-indigo-600 to-emerald-600 inline-block text-transparent bg-clip-text">
                    Revolutionary Features
                  </span>
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto"
                >
                  Our AI-powered platform revolutionizes the job application
                  process with cutting-edge tools
                </motion.p>
              </div>

              {/* Bento Grid Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Main Feature */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="lg:col-span-2 lg:row-span-2 relative group"
                >
                  <BackgroundGradient className="rounded-3xl p-8 h-full">
                    <div className="relative h-full flex flex-col">
                      <div className="absolute top-0 right-0 p-3 bg-purple-100 rounded-full">
                        <Rocket className="w-6 h-6 text-purple-600" />
                      </div>

                      <h3 className="text-2xl font-bold text-gray-800 mb-4">
                        AI-Powered Career Acceleration
                      </h3>

                      <p className="text-gray-600 mb-6">
                        Our advanced AI analyzes your skills, experience, and
                        career goals to create a personalized roadmap for
                        success. Get tailored job recommendations, interview
                        preparation, and skill development plans that will help
                        you stand out from the competition.
                      </p>

                      <div className="mt-auto">
                        <div className="relative overflow-hidden rounded-xl">
                          <motion.img
                            initial={{ scale: 1.2, y: 20 }}
                            whileInView={{ scale: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            src="https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                            alt="AI Career Acceleration"
                            className="w-full h-64 object-cover rounded-xl"
                          />
                          <div className="absolute inset-0  to-transparent"></div>
                        
                        </div>
                      </div>
                    </div>
                  </BackgroundGradient>
                </motion.div>

                {/* Feature Cards */}
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: feature.delay }}
                    className="relative group"
                  >
                    <div
                      className={`h-full bg-gradient-to-br ${
                        feature.color
                      } backdrop-blur-sm rounded-3xl p-8  border-${
                        feature.color.split(" ")[1]
                      }/50 shadow-lg hover:shadow-xl transition-all duration-300`}
                    >
                      <div className="mb-6 p-3 bg-white rounded-2xl inline-block">
                        {feature.icon}
                      </div>

                      <h3 className="text-xl font-bold text-gray-800 mb-3">
                        {feature.title}
                      </h3>

                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  </motion.div>
                ))}

                {/* Additional Feature */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="relative group"
                >
                  <div className="h-full bg-gradient-to-br from-rose-50 to-rose-100 backdrop-blur-sm rounded-3xl p-8 border border-rose-200 shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="mb-6 p-3 bg-rose-200 rounded-2xl inline-block">
                      <Shield className="w-8 h-8 text-rose-600" />
                    </div>

                    <h3 className="text-xl font-bold text-gray-800 mb-3">
                      Advanced Security
                    </h3>

                    <p className="text-gray-600">
                      Your data is protected with enterprise-grade security. We
                      use encryption and follow strict privacy protocols.
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Testimonials Section */}
          <section className="py-24 bg-gradient-to-br from-indigo-50 to-purple-50 overflow-hidden relative">
            <div className="absolute inset-0 bg-[url('/grid-pattern.png')] opacity-5"></div>

            <div className="container mx-auto px-4 md:px-6 mb-10 relative z-10">
              <div className="text-center mb-16">
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="inline-block mb-4 px-4 py-1.5 bg-gradient-to-r from-emerald-100 to-green-100 rounded-full backdrop-blur-sm border border-emerald-200"
                >
                  <span className="text-sm font-medium bg-gradient-to-r from-emerald-600 to-green-600 inline-block text-transparent bg-clip-text">
                    Success Stories
                  </span>
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="text-4xl md:text-5xl font-bold text-gray-800 mb-6"
                >
                  <span className="bg-gradient-to-r from-emerald-600 to-green-600 inline-block text-transparent bg-clip-text">
                    What Our Users Say
                  </span>
                </motion.h2>
              </div>
            </div>

            <div className="relative">
              <InfiniteMovingCards
                items={testimonials}
                direction="left"
                speed="slow"
                className="py-10"
              />
            </div>

            {/* Featured Testimonial */}
            <div className="container mx-auto px-4 md:px-6 mt-16 relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="max-w-4xl mx-auto bg-white rounded-3xl p-8 md:p-12 border border-purple-100 shadow-xl"
              >
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-purple-100 flex-shrink-0">
                    <img
                      src="https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                      alt="Featured Testimonial"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div>
                    <div className="flex mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-5 h-5 text-yellow-500 fill-yellow-500"
                        />
                      ))}
                    </div>

                    <p className="text-xl text-gray-700 italic mb-6">
                      "AIpply completely transformed my job search. The AI mock
                      interviews were incredibly realistic, and the feedback
                      helped me identify areas where I needed to improve. Within
                      three weeks of using the platform, I received multiple job
                      offers from top companies in my field."
                    </p>

                    <div>
                      <h4 className="text-lg font-semibold text-gray-800">
                        Robert Chen
                      </h4>
                      <p className="text-gray-600">
                        Senior Software Engineer at TechCorp
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* How It Works Section */}
          <section
            ref={processRef}
            className="py-24 bg-white relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[url('/grid-pattern.png')] opacity-5"></div>

            {/* Animated Gradient Blobs */}
            <motion.div
              className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-purple-100/50 blur-3xl"
              animate={{
                x: [0, -30, 0],
                y: [0, 30, 0],
              }}
              transition={{
                repeat: Number.POSITIVE_INFINITY,
                duration: 8,
                ease: "easeInOut",
              }}
            />

            <motion.div
              className="absolute bottom-1/4 left-1/4 w-80 h-80 rounded-full bg-blue-100/50 blur-3xl"
              animate={{
                x: [0, 40, 0],
                y: [0, -40, 0],
              }}
              transition={{
                repeat: Number.POSITIVE_INFINITY,
                duration: 10,
                ease: "easeInOut",
              }}
            />

            <div className="container mx-auto px-4 md:px-6 relative z-10">
              <div className="text-center mb-16">
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="inline-block mb-4 px-4 py-1.5 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-full backdrop-blur-sm border border-blue-200"
                >
                  <span className="text-sm font-medium bg-gradient-to-r from-blue-600 to-cyan-600 inline-block text-transparent bg-clip-text">
                    Simple Process
                  </span>
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="text-4xl md:text-5xl font-bold text-gray-800 mb-6"
                >
                  <span className="bg-gradient-to-r from-blue-600 to-cyan-600 inline-block text-transparent bg-clip-text">
                    The AIpply Process
                  </span>
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto"
                >
                  From application to interview, we've got you covered every
                  step of the way
                </motion.p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                <div>
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="relative rounded-3xl overflow-hidden"
                  >
                    <img
                      src="https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                      alt="Person using laptop"
                      className="w-full h-auto rounded-3xl shadow-2xl"
                    />
                    <div className="absolute inset-0 via-transparent to-transparent"></div>

                    {/* Floating UI Elements */}
                    <motion.div
                      className="absolute top-8 right-8 bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-emerald-200"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                        <span className="text-gray-800 text-sm">
                          Interview Ready
                        </span>
                      </div>
                    </motion.div>

                    <motion.div
                      className="absolute bottom-8 left-8 bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-purple-200"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.6 }}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                        <span className="text-gray-800 text-sm">
                          AI-Powered Insights
                        </span>
                      </div>
                    </motion.div>
                  </motion.div>
                </div>

                <div className="space-y-12">
                  <ProcessStep
                    number="01"
                    title="Find the Perfect Job"
                    description="Browse through our curated list of job opportunities that match your skills and experience."
                    delay={0}
                    icon={<Briefcase className="w-6 h-6 text-blue-600" />}
                  />
                  <ProcessStep
                    number="02"
                    title="Prepare with AI"
                    description="Use our AI mock interview system to practice answering common interview questions for your target role."
                    delay={0.2}
                    icon={<Brain className="w-6 h-6 text-purple-600" />}
                  />
                  <ProcessStep
                    number="03"
                    title="Apply with Confidence"
                    description="Submit your application with the knowledge that you're fully prepared for the interview process."
                    delay={0.4}
                    icon={<CheckCircle className="w-6 h-6 text-emerald-600" />}
                  />
                  <ProcessStep
                    number="04"
                    title="Track Your Progress"
                    description="Monitor the status of your applications and receive updates as you move through the hiring process."
                    delay={0.6}
                    icon={<LineChart className="w-6 h-6 text-amber-600" />}
                  />
                </div>
              </div>
            </div>
          </section>

        

          {/* CTA Section */}
          <section className="py-24 bg-gradient-to-br from-purple-100 to-indigo-100 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/grid-pattern.png')] opacity-10"></div>

            {/* Animated Particles */}
            <div className="absolute inset-0">
              <SparklesCore
                id="tsparticlesCTA"
                background="transparent"
                minSize={0.6}
                maxSize={1.4}
                particleDensity={40}
                particleColor="#8b5cf6"
                particleSpeed={0.2}
                className="opacity-30"
              />
            </div>

            <div className="container mx-auto px-4 md:px-6 text-center relative z-10">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="text-4xl md:text-5xl font-bold text-gray-800 mb-6"
              >
                Ready to Transform Your Job Search?
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto"
              >
                Join thousands of job seekers who have found their dream jobs
                through AIpply.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="mt-12 flex flex-col sm:flex-row gap-6 items-center justify-center"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative group"
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full opacity-70 group-hover:opacity-100 blur transition duration-200"></div>
                  <Link
                    to="/register"
                    className="relative flex items-center justify-center px-8 py-4 rounded-full bg-white text-purple-700 font-medium text-lg transition-colors"
                  >
                    Get Started Today
                    <motion.div
                      className="absolute right-4 opacity-0 group-hover:opacity-100 group-hover:right-2"
                      transition={{ duration: 0.3 }}
                    >
                      <ArrowRight size={18} />
                    </motion.div>
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </section>

          <Footer />
        </>
      )}
    </AnimatePresence>
  );
};

// Helper Components
const ProcessStep = ({ number, title, description, delay, icon }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, delay }}
    className="flex gap-6"
  >
    <div className="flex-shrink-0">
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center border border-blue-200">
        {icon}
      </div>
    </div>
    <div>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-sm font-bold text-blue-600">{number}</span>
        <h3 className="text-xl font-bold text-gray-800">{title}</h3>
      </div>
      <p className="text-gray-600">{description}</p>
    </div>
  </motion.div>
);

export default LandingPage;
