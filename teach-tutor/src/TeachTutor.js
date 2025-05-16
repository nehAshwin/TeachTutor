import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

export default function TeachAssistant() {
  //stores and tracks constant variables
  const [studyMaterial, setStudyMaterial] = useState('');
  const [explanation, setExplanation] = useState('');
  const [aiFeedback, setAiFeedback] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const refStart = useRef(null);
  const refPaste = useRef(null);
  const refExplain = useRef(null);
  const refFeedback = useRef(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
  })

  useEffect(() => {
    if (refStart.current) {
      refStart.current.scrollIntoView({ behavior: 'auto' });
    }
  }, []);

  const scrollTo = (ref) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // function randomly simulates a progress bar 
  const simulateProgress = () => {
    setLoadingProgress(0);
    let progress = 0;

    const interval = setInterval(() => {
      progress += Math.random() * 3; //increment randomly
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
      }

      setLoadingProgress(progress);
    }, 300);
  };



  // function (button) to pull user explanation and set next page to feedback
  const handleSubmitExplanation = async () => {
    if (explanation.trim() === '') {
      return;
    }

    try {

      setIsLoading(true);
      simulateProgress();

      scrollTo(refFeedback);

      const prompt = 'Act as a student trying to learn from the user teaching. Right now, the user is using teaching as a method of studying, and you are the student they are teaching to.\n\nHere is the content the student is trying to learn: \n' + studyMaterial + '\n\nHere is their explanation of the content: \n' + explanation + '\n\nGive concise feedback:\n\n1. Compare the user\'s explanation to the given study material. Categorize the topics into concepts they understand well, concepts they might need to refresh, and concepts they missed\n2. Ask follow up questions test their understanding further based on concepts they missed from their study material.'

      /*
      Prompt:
  
      Act as a student trying to learn from the user teaching. 
      Right now, the user is using teaching as a method of 
      studying, and you are the student they are teaching to.
  
      Here is the content the student is trying to learn:
      [studyMaterial]
  
      Here is their explanation of the content:
      [explanation]
  
      Give concise feedback:
  
      1. Compare the user's explanation to the given study material. Categorize the topics into 
        concepts they understand well, concepts they might need to refresh, and concepts they missed
      2. Ask follow up questions test their understanding further based on concepts they missed from their study material.
      */

      const response = await fetch('http://127.0.0.1:5000/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      setAiFeedback({
        summary: data.response
      });

      // setStep(3);

    } catch (error) {
      console.error('Error generating feedback:', error);
      setAiFeedback({
        summary: '❌ Error: Could not get feedback. Please try again later.',
        followUp: '',
      });
      // setStep(3);
      scrollTo(refFeedback);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='overflow-hidden'>
      <div ref={refStart} className="h-screen snap-start flex">
        <div className="w-1/2 flex flex-col justify-center items-center">
          <div className="w-full max-w-md px-6 text-left">
            <p className="text-lg mb-8">Study Smarter with Active Recall</p>
            <h1 className="text-4xl font-bold mb-6">Teach the Tutor</h1>
            <p className="text-lg mb-8">No more passive studying. Discover a smarter way to learn — by teaching. Click “Start” below to begin your study session.</p>
            <button
              className="text-white font-semibold px-6 py-3 rounded-2xl hover:bg-blue-100 transition"
              style={{ backgroundColor: "#054BB4" }}
              onClick={() => refPaste.current.scrollIntoView({ behavior: 'smooth' })}
            >
              Start
            </button>
          </div>
        </div>
        <div className = "w-1/2 flex items-center justify-center relative">
          <div 
            className="w-3/4 md:w-[500px] h-3/4 md:h-[500px] bg-[#b6c4de] rounded-full shadow-lg"
          ></div>
          <img
            src="/images/overlay.png"
            alt="Overlay"
            className="absolute w-[600px] h-auto"
            style={{top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
          />
        </div>
      </div>
      {/* paste section */}
      <div ref={refPaste} className="h-screen snap-start flex items-center justify-center px-4">
        <div className="max-w-3xl w-full bg-white shadow-lg rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-2">Paste Study Material</h2>
        <textarea
          className="w-full h-40 border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder='Paste your study notes or content here...'
          value={studyMaterial}
          onChange={(e) => setStudyMaterial(e.target.value)}
        />
        <div className="text-right mt-4">
          <button
            className={`px-4 py-2 rounded text-white ${studyMaterial.trim() ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-300 cursor-not-allowed'}`}
            disabled={!studyMaterial.trim()}
            onClick={() => scrollTo(refExplain)}
          >
            Next
          </button>
        </div>
      </div>
      </div>
      {/* explain section */}
      <div ref={refExplain} className="h-screen snap-start overflow-y-scroll snap-y snap-mandatory flex items-center justify-center px-4">
        <div className="max-w-3xl w-full bg-white shadow-lg rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-2">Teach What You Know</h2>
          <textarea
            className="w-full h-40 border rounded p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Explain the content in your own words..."
            value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
          />
          <div className="mt-4 flex justify-between">
            <button
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
              onClick={() => scrollTo(refPaste)}
            >
              Back
            </button>
            <button
              className={`px-4 py-2 rounded text-white ${explanation.trim() ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-300 cursor-not-allowed'}`}
              disabled={!explanation.trim()}
              onClick={() => handleSubmitExplanation()}
            >
              Submit
            </button>
          </div>
        </div>
      </div>

      {/* Feedback Section */}
      <div ref={refFeedback} className="h-screen snap-start flex items-center justify-center px-4">
        <div className="max-w-3xl w-full bg-white shadow-lg rounded-2xl p-6">
          {isLoading ? (
            <div className="text-center">
              <h2 className="text-xl font-semibold">Generating Feedback...</h2>
              <div className="w-full bg-gray-200 rounded-full h-4 mt-4">
                <div
                  className="bg-blue-600 h-4 rounded-full transition-all duration-200"
                  style={{ width: `${loadingProgress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-2">{Math.round(loadingProgress)}%</p>
            </div>
          ) : aiFeedback ? (
            <>
              <h2 className="text-xl font-semibold mb-2">AI Feedback</h2>
              <ReactMarkdown>{aiFeedback.summary}</ReactMarkdown>
              <p>{aiFeedback.followUp}</p>
            </>
          ) : (
            <p>Waiting for submission...</p>
          )}
        </div>
      </div>
    </div>

  );
}
