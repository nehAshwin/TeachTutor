import React, { useState, useRef } from 'react';
// import Modal from './components/modal';
import ReactMarkdown from 'react-markdown';

export default function TeachAssistant() {
  //stores and tracks constant variables
  const [studyMaterial, setStudyMaterial] = useState('');
  const [explanation, setExplanation] = useState('');
  const [aiFeedback, setAiFeedback] = useState(null);
  // const [step, setStep] = useState(1);

  // const [modalOpen, setModalOpen] = useState(false);
  // const [modalMessage, setModalMessage] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const refPaste = useRef(null);
  const refExplain = useRef(null);
  const refFeedback = useRef(null);

  const scrollTo = (ref) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // const showModal = (message) => {
  //   setModalMessage(message);
  //   setModalOpen(true);
  // };

  // function (button) to pull study material and set next page
  // const handleStartTeaching = () => {
  //   if (studyMaterial.trim() === '') {
  //     showModal('Please enter your study material before proceeding.');
  //     return;
  //   }
  //   setStep(2);
  //   // if (studyMaterial.trim() !== '') {
  //   //   setStep(2);
  //   // }
  // };

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
      // showModal('Please provide your explanation before submitting.');
      return;
    }

    try {

      setIsLoading(true);
      simulateProgress();

      scrollTo(refFeedback);

      // console.log(studyMaterial);

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
        // .split('\n')[0] || '',
        // followUp: data.response.split('\n')[1] || '',
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
      {/* <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} message={modalMessage} /> */}
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
          <h2 className="text-xl font-semibold mb-2">🧠 Teach What You Know</h2>
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
              <h2 className="text-xl font-semibold">⏳ Generating Feedback...</h2>
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
              <h2 className="text-xl font-semibold mb-2">🤖 AI Feedback</h2>
              <ReactMarkdown>{aiFeedback.summary}</ReactMarkdown>
              {/* <p className="mb-2">{aiFeedback.summary}</p> */}
              {/* <ReactMarkdown>{aiFeedback.followUp}</ReactMarkdown> */}
              <p>{aiFeedback.followUp}</p>
            </>
          ) : (
            <p>Waiting for submission...</p>
          )}
        </div>
      </div>
    </div>


    // <div className="max-w-3xl mx-auto p-6 space-y-6">
    //   <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} message={modalMessage} />

    //   {step === 1 && (
    //     <div className="bg-white shadow-lg rounded-2xl p-6">
    //       <h2 className="text-xl font-semibold mb-2">📘 Paste Study Material</h2>
    //       <textarea
    //         className="w-full h-40 border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
    //         placeholder="Paste your study notes or content here..."
    //         value={studyMaterial}
    //         onChange={(e) => setStudyMaterial(e.target.value)}
    //       />
    //       <div className="text-right mt-4">
    //         <button
    //           className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
    //           onClick={handleStartTeaching}
    //         >
    //           Start Teaching
    //         </button>
    //       </div>
    //     </div>
    //   )}

    //   {step === 2 && (
    //     <div className="bg-white shadow-lg rounded-2xl p-6">
    //       <h2 className="text-xl font-semibold mb-2">🧠 Teach What You Know</h2>
    //       <textarea
    //         className="w-full h-40 border rounded p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
    //         placeholder="Explain the content in your own words..."
    //         value={explanation}
    //         onChange={(e) => setExplanation(e.target.value)}
    //       />
    //       <div className="text-right mt-4">
    //         <button
    //           className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
    //           onClick={() => setStep(1)}
    //         >
    //           Back
    //         </button>
    //         <button
    //           className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
    //           onClick={handleSubmitExplanation}
    //         >
    //           Submit Explanation
    //         </button>
    //       </div>
    //     </div>
    //   )}

    //   {step === 3 && aiFeedback && (
    //     <div className="bg-white shadow-lg rounded-2xl p-6">
    //       <h2 className="text-xl font-semibold mb-2">🤖 AI Feedback</h2>
    //       <ReactMarkdown>{aiFeedback.summary}</ReactMarkdown>
    //       <p>{aiFeedback.followUp}</p>
    //     </div>
    //   )}

    //   {isLoading && (
    //     <div className="bg-white shadow-lg rounded-2xl p-6 flex flex-col items-center space-y-4">
    //       <h2 className="text-xl font-semibold">Generating Feedback...</h2>
    //       <div className="w-full bg-gray-200 rounded-full h-4">
    //         <div
    //           className="bg-blue-600 h-4 rounded-full transition-all duration-200"
    //           style={{width: `${loadingProgress}%`}}
    //         ></div>
    //       </div>
    //     </div>
    //   )}
    // </div>
  );
}
