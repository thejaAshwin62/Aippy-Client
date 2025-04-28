"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Mic, MicOff, Camera, CameraOff, Send, ArrowLeft, ArrowRight, X, Mic2 } from "lucide-react"
import axios from 'axios';
import { toast } from 'react-hot-toast';

const MockInterview = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { userId } = location.state || {};
  
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(true);
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [stream, setStream] = useState(null);
  const videoRef = useRef(null);
  const [mediaError, setMediaError] = useState(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState(null);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [finalTranscript, setFinalTranscript] = useState('');
  const recognitionRef = useRef(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setIsLoading(true);
        // console.log('Fetching questions for job:', jobId, 'and user:', userId);
        
        const response = await axios.get(`/api/v1/mock-questions/job/${jobId}/user/${userId}`, {
          withCredentials: true
        });
        
        // console.log('Questions response:', response.data);
        
        if (response.data && Array.isArray(response.data)) {
          // Take only first 5 questions
          const fiveQuestions = response.data.slice(0, 5);
          setQuestions(fiveQuestions);
          setAnswers(new Array(fiveQuestions.length).fill(""));
        } else {
          console.error('Invalid questions data:', response.data);
          setError('Invalid questions data received');
        }
      } catch (error) {
        console.error('Error fetching questions:', error);
        setError(error.response?.data?.message || 'Failed to load questions');
      } finally {
        setIsLoading(false);
      }
    };

    if (permissionsGranted) {
      fetchQuestions();
    }
  }, [jobId, userId, permissionsGranted]);

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const initializeMediaDevices = async () => {
    setIsInitializing(true);
    setMediaError(null);
    
    try {
      // First try with both video and audio
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }, 
        audio: true 
      });
      
      setStream(mediaStream);
      setShowPermissionModal(false);
      setPermissionsGranted(true);
      setIsCameraOn(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();
      }
    } catch (error) {
      console.error('Error accessing media devices:', error);
      
      // If both video and audio fail, try video only
      if (error.name === 'AbortError' || error.name === 'NotAllowedError') {
        try {
          const videoOnlyStream = await navigator.mediaDevices.getUserMedia({ 
            video: {
              width: { ideal: 1280 },
              height: { ideal: 720 }
            }
          });
          
          setStream(videoOnlyStream);
          setShowPermissionModal(false);
          setPermissionsGranted(true);
          setIsCameraOn(true);
          
          if (videoRef.current) {
            videoRef.current.srcObject = videoOnlyStream;
            await videoRef.current.play();
          }
        } catch (videoError) {
          console.error('Error accessing video only:', videoError);
          setMediaError('Unable to access camera. Please check your camera permissions and try again.');
        }
      } else {
        setMediaError('Unable to access media devices. Please check your permissions and try again.');
      }
    } finally {
      setIsInitializing(false);
    }
  };

  const handlePermissionGrant = async () => {
    await initializeMediaDevices();
  };

  const handlePermissionDeny = () => {
    setShowPermissionModal(false);
    setPermissionsGranted(false);
    setMediaError('Camera and microphone access is required for the mock interview.');
    navigate('/jobs');
  };

  const toggleCamera = async () => {
    if (!isCameraOn) {
      // Re-enabling camera
      await initializeMediaDevices();
    } else {
      // Disabling camera
      if (stream) {
        const videoTrack = stream.getVideoTracks()[0];
        if (videoTrack) {
          videoTrack.enabled = false;
          setIsCameraOn(false);
        }
      }
    }
  };

  const toggleMic = () => {
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsRecording(!isRecording);
    if (!isRecording) {
          setTimeRemaining(120);
    } else {
          setTimeRemaining(null);
        }
      }
    }
  };

  // Cleanup function for media stream
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  useEffect(() => {
    let timer
    if (isRecording && timeRemaining > 0) {
      timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1)
      }, 1000)
    } else if (timeRemaining === 0) {
      setIsRecording(false)
    }

    return () => clearTimeout(timer)
  }, [isRecording, timeRemaining])

  const handleAnswerChange = (e) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = e.target.value;
    setAnswers(newAnswers);
    setIsTyping(true);
  };

  const submitAnswer = async (questionId, answer) => {
    try {
      // Get the current answer text
      const currentAnswer = answers[currentQuestionIndex] || '';
      
      if (!currentAnswer.trim()) {
        toast.error('Please provide an answer before submitting');
        return false;
      }

      // console.log('Submitting answer:', {
      //   mockQuestionId: questionId,
      //   userId: userId,
      //   userAnswer: currentAnswer
      // });

      const response = await axios.post('/api/v1/user-answers/submit', {
        mockQuestionId: questionId,
        userId: userId,
        userAnswer: currentAnswer
      }, {
        withCredentials: true
      });

      if (response.status === 200) {
        toast.success('Answer submitted successfully!');
        return true;
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
      toast.error('Failed to submit answer. Please try again.');
      return false;
    }
  };

  const handleNextQuestion = async () => {
    if (currentQuestionIndex < questions.length - 1) {
      // Save current answer before moving to next question
      const newAnswers = [...answers];
      const currentAnswer = finalTranscript + interimTranscript;
      newAnswers[currentQuestionIndex] = currentAnswer;
      setAnswers(newAnswers);
      
      // Submit the current answer
      const currentQuestion = questions[currentQuestionIndex];
      const submitted = await submitAnswer(currentQuestion.id, currentAnswer);
      
      if (submitted) {
        // Reset speech recognition states
        setFinalTranscript('');
        setInterimTranscript('');
        setIsListening(false);
        if (recognitionRef.current) {
          recognitionRef.current.stop();
        }
        
        // Move to next question
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setIsRecording(false);
        setTimeRemaining(null);
      }
    } else {
      // Save final answer before navigating to feedback
      const newAnswers = [...answers];
      const currentAnswer = finalTranscript + interimTranscript;
      newAnswers[currentQuestionIndex] = currentAnswer;
      setAnswers(newAnswers);
      
      // Submit the final answer
      const currentQuestion = questions[currentQuestionIndex];
      const submitted = await submitAnswer(currentQuestion.id, currentAnswer);
      
      if (submitted) {
        // Stop any ongoing recording
        if (recognitionRef.current) {
          recognitionRef.current.stop();
        }
        
        navigate(`/feedback/${jobId}`, { 
          state: { 
            answers: newAnswers,
            questions
          }
        });
      }
    }
  };

  const handlePrevQuestion = async () => {
    if (currentQuestionIndex > 0) {
      // Save current answer before moving to previous question
      const newAnswers = [...answers];
      const currentAnswer = finalTranscript + interimTranscript;
      newAnswers[currentQuestionIndex] = currentAnswer;
      setAnswers(newAnswers);
      
      // Submit the current answer
      const currentQuestion = questions[currentQuestionIndex];
      const submitted = await submitAnswer(currentQuestion.id, currentAnswer);
      
      if (submitted) {
        // Reset speech recognition states
        setFinalTranscript('');
        setInterimTranscript('');
        setIsListening(false);
        if (recognitionRef.current) {
          recognitionRef.current.stop();
        }
        
        // Move to previous question
        setCurrentQuestionIndex(currentQuestionIndex - 1);
        setIsRecording(false);
        setTimeRemaining(null);
      }
    }
  };

  // Update the textarea value to show the saved answer for the current question
  const getCurrentAnswer = () => {
    if (isListening) {
      return finalTranscript + interimTranscript;
    }
    return answers[currentQuestionIndex] || '';
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      // Configure recognition settings
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onstart = () => {
        console.log('Speech recognition started');
        setIsListening(true);
        setSpeechError(null);
      };

      recognitionRef.current.onresult = (event) => {
        console.log('Speech recognition result:', event);
        let currentInterim = '';
        let currentFinal = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            currentFinal += transcript + ' ';
          } else {
            currentInterim += transcript;
          }
        }

        // Update interim results immediately
        if (currentInterim) {
          setInterimTranscript(currentInterim);
        }

        // Accumulate final results
        if (currentFinal) {
          setFinalTranscript(prev => {
            const newTranscript = prev + currentFinal;
            // Update the answer in the answers array
            const newAnswers = [...answers];
            newAnswers[currentQuestionIndex] = newTranscript;
            setAnswers(newAnswers);
            return newTranscript;
          });
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        
        switch (event.error) {
          case 'no-speech':
            setSpeechError('No speech detected. Please speak louder or check your microphone.');
            break;
          case 'audio-capture':
            setSpeechError('No microphone detected. Please check your microphone connection.');
            break;
          case 'not-allowed':
            setSpeechError('Microphone access denied. Please allow microphone access.');
            break;
          case 'network':
            setSpeechError('Network error occurred. Please check your internet connection.');
            break;
          default:
            setSpeechError(`Speech recognition error: ${event.error}`);
        }
        
        setIsListening(false);
        setInterimTranscript('');
      };

      recognitionRef.current.onend = () => {
        console.log('Speech recognition ended');
        if (isListening) {
          // If we're still supposed to be listening, restart the recognition
          try {
            recognitionRef.current.start();
          } catch (error) {
            console.error('Error restarting speech recognition:', error);
            setIsListening(false);
          }
        } else {
          setInterimTranscript('');
        }
      };
    }
  }, []);

  const toggleSpeechToText = () => {
    if (!recognitionRef.current) {
      setSpeechError('Speech recognition is not supported in your browser');
      return;
    }

    try {
      if (isListening) {
        // Stop recording
        recognitionRef.current.stop();
        setIsListening(false);
        setInterimTranscript('');
      } else {
        // Start recording
        setSpeechError(null);
        setInterimTranscript('');
        
        // Request microphone permission explicitly
        navigator.mediaDevices.getUserMedia({ audio: true })
          .then(() => {
            recognitionRef.current.start();
          })
          .catch((error) => {
            console.error('Microphone permission error:', error);
            setSpeechError('Please allow microphone access to use speech recognition.');
          });
      }
    } catch (error) {
      console.error('Speech recognition error:', error);
      setSpeechError('Failed to start speech recognition. Please try again.');
      setIsListening(false);
      setInterimTranscript('');
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => navigate('/jobs')}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Return to Jobs
          </button>
        </div>
      </div>
    );
  }

  if (!isLoading && !error && questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Questions Available</h2>
          <p className="text-gray-600 mb-4">There are no mock interview questions available for this job.</p>
          <button
            onClick={() => navigate('/jobs')}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Return to Jobs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-16">
      {/* Permission Modal */}
      <AnimatePresence>
        {showPermissionModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 max-w-md w-full"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Camera & Microphone Access</h2>
              <p className="text-gray-600 mb-6">
                AIpply needs access to your camera and microphone to conduct the mock interview. This helps create a
                realistic interview experience.
              </p>
              {mediaError && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg">
                  {mediaError}
                </div>
              )}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handlePermissionGrant}
                  disabled={isInitializing}
                  className={`flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors ${
                    isInitializing ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isInitializing ? 'Initializing...' : 'Allow Access'}
                </button>
                <button
                  onClick={handlePermissionDeny}
                  disabled={isInitializing}
                  className={`flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors ${
                    isInitializing ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  Continue Without Access
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-4 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
            <button
              onClick={() => navigate("/jobs")}
              className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center"
            >
              <X size={16} className="mr-1" />
              Exit Interview
            </button>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: `${(currentQuestionIndex / questions.length) * 100}%` }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-indigo-600"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Video Feed */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="relative aspect-video bg-gray-900 flex items-center justify-center">
                {isCameraOn && stream ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                    style={{ transform: 'scaleX(-1)' }} // Mirror the video
                  />
                ) : (
                  <div className="text-white text-center p-4">
                    <Camera size={48} className="mx-auto mb-2 opacity-50" />
                    <p>Camera is off</p>
                  </div>
                )}

                {isRecording && (
                  <div className="absolute top-4 right-4 bg-red-600 text-white px-2 py-1 rounded-full text-sm flex items-center">
                    <span className="animate-pulse mr-1">●</span>
                    {timeRemaining !== null && formatTime(timeRemaining)}
                  </div>
                )}
              </div>

              <div className="p-4 flex justify-center space-x-4">
                <button
                  onClick={toggleMic}
                  className={`p-3 rounded-full ${
                    isRecording ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-600"
                  } hover:bg-gray-200 transition-colors`}
                >
                  {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
                </button>

                <button
                  onClick={toggleCamera}
                  className={`p-3 rounded-full ${
                    isCameraOn ? "bg-gray-100 text-gray-600" : "bg-gray-100 text-gray-600"
                  } hover:bg-gray-200 transition-colors`}
                >
                  {isCameraOn ? <Camera size={20} /> : <CameraOff size={20} />}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Question and Answer */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md h-full flex flex-col">
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Question {currentQuestionIndex + 1}</h2>
                <p className="text-gray-700">{currentQuestion?.question}</p>

                {/* Hint */}
                <div className="mt-4 bg-indigo-50 border border-indigo-100 rounded-lg p-3">
                  <p className="text-sm text-indigo-800">
                    <span className="font-medium">Hint:</span> {currentQuestion?.hint}
                  </p>
                </div>
              </div>

              <div className="p-6 flex-grow flex flex-col">
                <div className="flex-grow">
                  <div className="flex justify-between items-center mb-2">
                    <label htmlFor="answer" className="block text-sm font-medium text-gray-700">
                    Your Answer
                  </label>
                    <button
                      onClick={toggleSpeechToText}
                      className={`p-2 rounded-full ${
                        isListening 
                          ? 'bg-red-100 text-red-600' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      } transition-colors`}
                      title={isListening ? 'Stop recording' : 'Start recording'}
                    >
                      <Mic2 size={20} className={isListening ? 'animate-pulse' : ''} />
                    </button>
                  </div>
                  {speechError && (
                    <div className="mb-2 p-2 bg-red-50 text-red-600 text-sm rounded-lg">
                      {speechError}
                    </div>
                  )}
                  <div className="relative">
                  <textarea
                    id="answer"
                      value={getCurrentAnswer()}
                    onChange={handleAnswerChange}
                    placeholder="Type your answer here or use the microphone to record..."
                    className="w-full h-40 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                  />
                    {isListening && (
                      <div className="absolute bottom-2 right-2 flex items-center space-x-2">
                        <span className="animate-pulse text-red-500 text-sm">Recording...</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6 flex justify-between">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handlePrevQuestion}
                    disabled={currentQuestionIndex === 0}
                    className={`flex items-center px-4 py-2 rounded-lg ${
                      currentQuestionIndex === 0
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    } transition-colors`}
                  >
                    <ArrowLeft size={18} className="mr-2" />
                    Previous
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleNextQuestion}
                    className="flex items-center px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    {currentQuestionIndex < questions.length - 1 ? (
                      <>
                        Next
                        <ArrowRight size={18} className="ml-2" />
                      </>
                    ) : (
                      <>
                        Finish Interview
                        <Send size={18} className="ml-2" />
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MockInterview
