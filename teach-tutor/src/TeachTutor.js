import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import ProgressBar from './components/progressBar';
import SessionManager from './components/SessionManager';
import LoadingSpinner from './components/LoadingSpinner';

export default function TeachAssistant() {
  const [studyMaterial, setStudyMaterial] = useState('');
  const [explanation, setExplanation] = useState('');
  const [aiFeedback, setAiFeedback] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState(null);
  const [savedSessions, setSavedSessions] = useState([]);

  // Load saved sessions from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('teachTutorSessions');
    if (saved) {
      setSavedSessions(JSON.parse(saved));
    }
  }, []);

  // Save sessions to localStorage
  const saveSession = () => {
    const session = {
      id: Date.now(),
      studyMaterial,
      explanation,
      aiFeedback,
      timestamp: new Date().toISOString(),
    };
    const updatedSessions = [session, ...savedSessions].slice(0, 10); // Keep last 10 sessions
    setSavedSessions(updatedSessions);
    localStorage.setItem('teachTutorSessions', JSON.stringify(updatedSessions));
  };

  const simulateProgress = () => {
    setLoadingProgress(0);
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 3;
      if (progress >= 100) {
        clearInterval(interval);
        progress = 100;
      }
      setLoadingProgress(progress);
    }, 300);
  };

  const handleSubmitExplanation = async () => {
    if (explanation.trim() === '') return;

    try {
      setError(null);
      setIsLoading(true);
      simulateProgress();

      const prompt = `Act as a student trying to learn from the user teaching. 
      Right now, the user is using teaching as a method of 
      studying, and you are the student they are teaching to.
  
      Here is the content the student is trying to learn: \n${studyMaterial}
  
      Here is their explanation of the content: \n${explanation}
  
      Give concise feedback:
  
      1. Compare the user's explanation to the given study material. Categorize the topics into 
        concepts they understand well, concepts they might need to refresh, and concepts they missed
      2. Ask follow up questions test their understanding further based on concepts they missed from their study material.`;

      const response = await fetch('http://127.0.0.1:5000/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from server');
      }

      const data = await response.json();

      setAiFeedback({
        summary: data.response
      });

    } catch (error) {
      console.error('Error generating feedback:', error);
      setError('Unable to generate feedback. Please check your connection and try again.');
      setAiFeedback({
        summary: 'Error: Could not get feedback. Please try again later.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetSession = () => {
    setStudyMaterial('');
    setExplanation('');
    setAiFeedback(null);
    setCurrentStep(1);
    setError(null);
  };

  const loadSession = (session) => {
    setStudyMaterial(session.studyMaterial);
    setExplanation(session.explanation);
    setAiFeedback(session.aiFeedback);
    setCurrentStep(3);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">TT</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">TeachTutor</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {hasStarted && (
                <>
                  <button
                    onClick={() => setSavedSessions([])}
                    className="text-gray-500 hover:text-gray-700 text-sm"
                  >
                    Clear History
                  </button>
                  <button
                    onClick={resetSession}
                    className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    New Session
                  </button>
                </>
              )}
              {!hasStarted && (
                <button
                  onClick={() => setHasStarted(true)}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md"
                >
                  Get Started
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {!hasStarted ? (
        // Landing Page
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Master Any Subject by Teaching It
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Transform your learning with the power of active recall. Teach concepts to our AI tutor and get instant feedback on your understanding.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <span className="text-blue-600 text-xl">📝</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Paste Your Material</h3>
                <p className="text-gray-600">Add your study notes, textbook sections, or any content you want to master.</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <span className="text-green-600 text-xl">🎯</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Teach It Back</h3>
                <p className="text-gray-600">Explain the concepts in your own words as if teaching someone else.</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <span className="text-purple-600 text-xl">💡</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Get Smart Feedback</h3>
                <p className="text-gray-600">Receive detailed analysis and targeted questions to strengthen weak areas.</p>
              </div>
            </div>
            
            <button
              onClick={() => setHasStarted(true)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Start Learning Now
            </button>
          </div>
        </div>
      ) : (
        // Main Application
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
                <h3 className="font-semibold text-gray-900 mb-4">Progress</h3>
                <div className="space-y-3">
                  {[1, 2, 3].map((step) => (
                    <div
                      key={step}
                      className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                        currentStep >= step
                          ? 'bg-blue-50 border border-blue-200'
                          : 'bg-gray-50'
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          currentStep >= step
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-300 text-gray-600'
                        }`}
                      >
                        {step}
                      </div>
                      <span
                        className={`text-sm font-medium ${
                          currentStep >= step ? 'text-blue-900' : 'text-gray-500'
                        }`}
                      >
                        {step === 1 && 'Study Material'}
                        {step === 2 && 'Teach Back'}
                        {step === 3 && 'AI Feedback'}
                      </span>
                    </div>
                  ))}
                </div>

                                 {savedSessions.length > 0 && (
                   <div className="mt-8">
                     <SessionManager
                       savedSessions={savedSessions}
                       onLoadSession={loadSession}
                       onClearHistory={() => {
                         setSavedSessions([]);
                         localStorage.removeItem('teachTutorSessions');
                       }}
                     />
                   </div>
                 )}
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-xl shadow-sm p-8">
                {/* Step 1: Study Material */}
                {currentStep === 1 && (
                  <div>
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">Step 1: Add Your Study Material</h2>
                      <p className="text-gray-600">Paste the content you want to learn and understand better.</p>
                    </div>
                    
                    <div className="space-y-4">
                      <textarea
                        className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        placeholder="Paste your study notes, textbook sections, articles, or any content here..."
                        value={studyMaterial}
                        onChange={(e) => setStudyMaterial(e.target.value)}
                      />
                      
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-500">
                          {studyMaterial.length} characters
                        </p>
                        <button
                          onClick={() => setCurrentStep(2)}
                          disabled={!studyMaterial.trim()}
                          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                            studyMaterial.trim()
                              ? 'bg-blue-600 text-white hover:bg-blue-700'
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          Continue
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Teach Back */}
                {currentStep === 2 && (
                  <div>
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">Step 2: Teach It Back</h2>
                      <p className="text-gray-600">Explain the concepts in your own words as if teaching someone else.</p>
                    </div>
                    
                    <div className="space-y-4">
                      <textarea
                        className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        placeholder="Explain the content in your own words. Be as detailed as possible..."
                        value={explanation}
                        onChange={(e) => setExplanation(e.target.value)}
                      />
                      
                      <div className="flex justify-between items-center">
                        <button
                          onClick={() => setCurrentStep(1)}
                          className="px-6 py-2 rounded-lg font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                        >
                          Back
                        </button>
                        <button
                          onClick={() => {
                            handleSubmitExplanation();
                            setCurrentStep(3);
                          }}
                          disabled={!explanation.trim() || isLoading}
                          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                            explanation.trim() && !isLoading
                              ? 'bg-blue-600 text-white hover:bg-blue-700'
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          {isLoading ? 'Generating...' : 'Get Feedback'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: AI Feedback */}
                {currentStep === 3 && (
                  <div>
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">Step 3: AI Feedback</h2>
                      <p className="text-gray-600">Review your understanding and get targeted improvement suggestions.</p>
                    </div>
                    
                                         {isLoading && (
                       <LoadingSpinner progress={loadingProgress} />
                     )}
                    
                    {error && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <span className="text-red-400">⚠️</span>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm text-red-800">{error}</p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {aiFeedback?.summary && !isLoading && (
                      <div className="space-y-6">
                        <div className="prose prose-blue max-w-none">
                          <ReactMarkdown>{aiFeedback.summary}</ReactMarkdown>
                        </div>
                        
                        <div className="flex space-x-4 pt-6 border-t border-gray-200">
                          <button
                            onClick={saveSession}
                            className="px-6 py-2 rounded-lg font-medium bg-green-600 text-white hover:bg-green-700 transition-colors"
                          >
                            Save Session
                          </button>
                          <button
                            onClick={resetSession}
                            className="px-6 py-2 rounded-lg font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                          >
                            Start New Session
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
