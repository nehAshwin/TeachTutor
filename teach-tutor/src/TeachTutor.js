import React, { useState } from 'react';
import Modal from './components/modal';
import ReactMarkdown from 'react-markdown';

export default function TeachAssistant() {
    //stores and tracks constant variables
  const [studyMaterial, setStudyMaterial] = useState('');
  const [explanation, setExplanation] = useState('');
  const [aiFeedback, setAiFeedback] = useState(null);
  const [step, setStep] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const showModal = (message) => {
    setModalMessage(message);
    setModalOpen(true);
  };

  // function (button) to pull study material and set next page
  const handleStartTeaching = () => {
    if (studyMaterial.trim() === '') {
      showModal('Please enter your study material before proceeding.');
      return;
    }
    setStep(2);
    // if (studyMaterial.trim() !== '') {
    //   setStep(2);
    // }
  };

  // function (button) to pull user explanation and set next page to feedback
  const handleSubmitExplanation = async () => {
    if (explanation.trim() === '') {
      showModal('Please provide your explanation before submitting.');
      return;
    }

      try{
        const prompt = 'Act as a student trying to learn from the user teaching. Right now, the user is using teaching as a method of studying, and you are the student they are teaching to.\n\nHere is the content the student is trying to learn: \n'+studyMaterial+'\n\nHere is their explanation of the content: \n'+explanation+'\n\nGive concise feedback:\n\n1. Compare the user\'s explanation to the given study material. Categorize the topics into concepts they understand well, concepts they might need to refresh, and concepts they missed\n2. Ask follow up questions test their understanding further based on concepts they missed from their study material.'
      
    /*
    Prompt:

    Act as a student trying to learn from the user teaching. 
    Right now, the user is using teaching as a method of 
    studying, and you are the student they are teaching to.

    Here is the content the student is trying to learn:
    [studyMaterial]
    Here is the content the student is trying to learn:
    [studyMaterial]

    Here is their explanation of the content:
    [explanation]
    Here is their explanation of the content:
    [explanation]

    Give concise feedback:
    Give concise feedback:

    1. Compare the user's explanation to the given study material. Categorize the topics into 
      concepts they understand well, concepts they might need to refresh, and concepts they missed
    2. Ask follow up questions test their understanding further based on concepts they missed from their study material.
    */

      const response =  await fetch('http://127.0.0.1:5000/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({prompt}),
      });

      const data = await response.json();

      setAiFeedback({
        summary: data.response
        // .split('\n')[0] || '',
        // followUp: data.response.split('\n')[1] || '',
      });

      setStep(3);
    } catch(error){
      console.error('Error generating feedback:', error);
      setAiFeedback({
        summary: '❌ Error: Could not get feedback. Please try again later.',
        followUp: '',
      });
      setStep(3);
    }

  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} message={modalMessage} />

      {step === 1 && (
        <div className="bg-white shadow-lg rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-2">📘 Paste Study Material</h2>
          <textarea
            className="w-full h-40 border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Paste your study notes or content here..."
            value={studyMaterial}
            onChange={(e) => setStudyMaterial(e.target.value)}
          />
          <div className="text-right mt-4">
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={handleStartTeaching}
            >
              Start Teaching
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="bg-white shadow-lg rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-2">🧠 Teach What You Know</h2>
          <textarea
            className="w-full h-40 border rounded p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Explain the content in your own words..."
            value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
          />
          <div className="text-right mt-4">
            <button
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              onClick={handleSubmitExplanation}
            >
              Submit Explanation
            </button>
          </div>
        </div>
      )}

      {step === 3 && aiFeedback && (
        <div className="bg-white shadow-lg rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-2">🤖 AI Feedback</h2>
          <ReactMarkdown>{aiFeedback.summary}</ReactMarkdown>
          <p>{aiFeedback.followUp}</p>
        </div>
      )}
    </div>
  );
}
