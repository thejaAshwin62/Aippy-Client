import { useEffect } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { ChevronDown, Briefcase, User, Zap, Shield, Award } from "lucide-react"
import { SparklesCore } from "../components/ui/sparkles"
import { TypewriterEffect } from "../components/ui/typewriter-effect"
import { InfiniteMovingCards } from "../components/ui/infinite-moving-cards"
import { CardContainer, CardBody, CardItem } from "../components/ui/3d-card"
import Footer from "../components/Footer"

const LandingPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Testimonials for InfiniteMovingCards
  const testimonials = [
    {
      name: "Sarah J.",
      text: "AIpply helped me prepare for interviews like never before. The AI mock interviews were incredibly realistic and the feedback was spot on. I landed my dream job at a tech giant!",
    },
    {
      name: "Michael T.",
      text: "As a hiring manager, AIpply has revolutionized our recruitment process. The quality of candidates has improved dramatically, and the AI screening saves us countless hours.",
    },
    {
      name: "Emily R.",
      text: "The personalized feedback after each mock interview helped me identify my weaknesses and improve rapidly. I'm now much more confident in real interviews.",
    },
    {
      name: "David K.",
      text: "I was skeptical about AI-powered job applications, but AIpply exceeded my expectations. The platform is intuitive, and the AI feedback is genuinely helpful.",
    },
    {
      name: "Jessica M.",
      text: "After using AIpply for just two weeks, I received three job offers! The AI-powered interview preparation made all the difference in my confidence and performance.",
    },
  ]

  // Words for TypewriterEffect
  const words = [
    { text: "Apply" },
    { text: "with" },
    { text: "Confidence." },
    { text: "Stand" },
    { text: "Out" },
    { text: "with" },
    { text: "AI.", className: "text-indigo-500" },
  ]

  
  return (
    <>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            alt="People working together"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/90 to-black/70" />
        </div>

        {/* Sparkles overlay */}
        <div className="absolute inset-0 z-1">
          <SparklesCore
            id="tsparticlesfullpage"
            background="transparent"
            minSize={0.6}
            maxSize={1.4}
            particleDensity={70}
            particleColor="#ffffff"
            particleSpeed={0.2}
            className="opacity-50"
          />
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10 mt-16">
          <div className="max-w-3xl">
            <div className="mb-8">
              <TypewriterEffect words={words} className="text-white" />
            </div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-6 text-xl text-gray-300 max-w-2xl"
            >
              AIpply uses artificial intelligence to help you prepare for interviews, highlight your strengths, and land
              your dream job.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-16 flex flex-col sm:flex-row gap-4 items-center justify-center"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/jobs"
                  className="flex items-center justify-center px-8 py-4 rounded-full bg-indigo-600 text-white font-medium text-lg hover:bg-indigo-700 transition-colors"
                >
                  <Briefcase size={20} className="mr-2" />
                  Get Started
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white"
        >
          <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}>
            <ChevronDown size={32} />
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-3xl md:text-4xl font-bold text-gray-900"
            >
              How AIpply Works
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto"
            >
              Our AI-powered platform revolutionizes the job application process
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <CardContainer className="w-full">
              <FeatureCard
                icon={<Zap className="text-indigo-600" size={32} />}
                title="AI Mock Interviews"
                description="Practice with our AI interviewer to get real-time feedback and improve your responses."
                delay={0}
              />
            </CardContainer>
            <CardContainer className="w-full">
              <FeatureCard
                icon={<Shield className="text-indigo-600" size={32} />}
                title="Skill Assessment"
                description="Get an objective evaluation of your technical and soft skills to highlight your strengths."
                delay={0.2}
              />
            </CardContainer>
            <CardContainer className="w-full">
              <FeatureCard
                icon={<Award className="text-indigo-600" size={32} />}
                title="Application Tracking"
                description="Track all your job applications in one place and never miss an opportunity."
                delay={0.4}
              />
            </CardContainer>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-900 text-white overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 mb-10">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-3xl md:text-4xl font-bold"
            >
              What Our Users Say
            </motion.h2>
          </div>
        </div>

        <InfiniteMovingCards items={testimonials} direction="left" speed="slow" className="py-10 h-[40vh]" />
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-3xl md:text-4xl font-bold text-gray-900"
            >
              The AIpply Process
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto"
            >
              From application to interview, we've got you covered
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <motion.img
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                src="https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt="Person using laptop"
                className="rounded-lg shadow-xl w-full h-auto"
              />
            </div>

            <div className="space-y-8">
              <ProcessStep
                number="01"
                title="Find the Perfect Job"
                description="Browse through our curated list of job opportunities that match your skills and experience."
                delay={0}
              />
              <ProcessStep
                number="02"
                title="Prepare with AI"
                description="Use our AI mock interview system to practice answering common interview questions for your target role."
                delay={0.2}
              />
              <ProcessStep
                number="03"
                title="Apply with Confidence"
                description="Submit your application with the knowledge that you're fully prepared for the interview process."
                delay={0.4}
              />
              <ProcessStep
                number="04"
                title="Track Your Progress"
                description="Monitor the status of your applications and receive updates as you move through the hiring process."
                delay={0.6}
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-indigo-600">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-3xl md:text-4xl font-bold text-white"
          >
            Ready to Transform Your Job Search?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-4 text-xl text-indigo-100 max-w-2xl mx-auto"
          >
            Join thousands of job seekers who have found their dream jobs through AIpply.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-10"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-block">
              <Link
                to="/register"
                className="px-8 py-4 rounded-full bg-white text-indigo-600 font-medium text-lg hover:bg-gray-100 transition-colors"
              >
                Get Started Today
              </Link>
            </motion.div>
          </motion.div>
         
        </div>
      </section>
      <Footer />
    </>
  )
}

// Helper Components
const FeatureCard = ({ icon, title, description, delay }) => (
  <CardBody className="h-auto w-full">
    <CardItem translateZ={50} className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
      <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mb-6">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-4">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </CardItem>
  </CardBody>
)

const ProcessStep = ({ number, title, description, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, delay }}
    className="flex gap-6"
  >
    <div className="flex-shrink-0">
      <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
        {number}
      </div>
    </div>
    <div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  </motion.div>
)

export default LandingPage
