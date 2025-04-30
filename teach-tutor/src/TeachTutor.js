import React, { useState } from 'react';

export default function TeachAssistant() {
  
    //stores and tracks constant variables
  const [studyMaterial, setStudyMaterial] = useState('');
  const [explanation, setExplanation] = useState('');
  const [aiFeedback, setAiFeedback] = useState(null);
  const [step, setStep] = useState(1);

  // function (button) to pull study material and set next page
  const handleStartTeaching = () => {
    if (studyMaterial.trim() !== '') {
      setStep(2);
    }
  };

  // function (button) to pull user explanation and set next page to feedback
  const handleSubmitExplanation = async () => {
    if (explanation.trim() !== '') {

      try{
        const prompt = 'Act as a tutor helping a student learn by letting the student teach the content.\n\nHere is the content the student is trying to learn: \n'+studyMaterial+'\n\nHere is their explanation of the content: \n'+explanation+'\n\nGive concise feedback:\n\n1. Say which parts of the content they understand well and which parts they need to improve their understanding of.\n2. 2. Ask follow up questions to point them towards concepts that they missed.'
        
/*
Prompt:

Act as a tutor helping a student learn by letting the student teach the content.

Here is the content the student is trying to learn:
[studyMaterial]

Here is their explanation of the content:
[explanation]

Give concise feedback:

1. Say which parts of the content they understand well and which parts they need to improve their understanding of
2. Ask follow up questions to point them towards concepts that they missed
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
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
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
          <p className="mb-2">{aiFeedback.summary}</p>
          <p>{aiFeedback.followUp}</p>
        </div>
      )}
    </div>
  );
}
