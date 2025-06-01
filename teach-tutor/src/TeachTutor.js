import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import ProgressBar from './components/progressBar';

export default function TeachAssistant() {
  const [studyMaterial, setStudyMaterial] = useState('');
  const [explanation, setExplanation] = useState('');
  const [aiFeedback, setAiFeedback] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const [hasStarted, setHasStarted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const refStart = useRef(null);
  const refPaste = useRef(null);
  const refExplain = useRef(null);
  const refFeedback = useRef(null);

  useEffect(() => {
    if (hasStarted && refPaste.current) {
      refPaste.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [hasStarted]);

  useEffect(() => {
    const sections = [
      { ref: refPaste, step: 1 },
      { ref: refExplain, step: 2 },
      { ref: refFeedback, step: 3 },
    ];

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const match = sections.find((s) => s.ref.current === entry.target);
        if (entry.isIntersecting && match) setCurrentStep(match.step);
      });
    }, { threshold: 0.6 });

    sections.forEach(({ ref }) => ref.current && observer.observe(ref.current));
    return () => observer.disconnect();
  }, []);

  const scrollTo = (ref) => ref.current?.scrollIntoView({ behavior: 'smooth' });

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

        setIsLoading(true);
        simulateProgress();
        scrollTo(refFeedback);

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

        const data = await response.json();

        setAiFeedback({
          summary: data.response
        });

      } catch (error) {
        console.error('Error generating feedback:', error);
        setAiFeedback({
          summary: 'Error: Could not get feedback. Please try again later.',
          followUp: '',
        });
        scrollTo(refFeedback);
      } finally {
        setIsLoading(false);
      }
    };



  return (
    <div className="min-h-screen bg-[#E9EEF5] text-gray-900">
      {!hasStarted ? (
        <div ref={refStart} className="h-screen flex flex-col md:flex-row items-center justify-center px-8">
          <div className="md:w-1/2 flex flex-col justify-center items-start max-w-md">
            <p className="text-lg font-medium mb-4">Study Smarter with Active Recall</p>
            <h1 className="text-4xl font-bold mb-4">Teach the Tutor</h1>
            <p className="text-lg mb-6 text-left">No more passive studying. Discover a smarter way to learn — by teaching.</p>
            <button onClick={() => setHasStarted(true)} className="bg-[#054BB4] text-white px-6 py-3 rounded-xl shadow hover:bg-[#2E5CAF] transition">Start</button>
          </div>
          <div className="md:w-1/2 flex justify-center relative">
            <div className="w-72 h-72 md:w-[500px] md:h-[500px] bg-[#B6C4DE] rounded-full shadow-xl"></div>
            <img src="/images/overlay.png" alt="Overlay" className="absolute w-[450px] md:w-[600px] h-auto top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
        </div>
      ) : (
        <div className="overflow-y-scroll snap-y snap-mandatory">
          <ProgressBar currentStep={currentStep} />

          {/* Step 1 */}
          <div ref={refPaste} className="h-screen snap-start flex flex-col items-center justify-center px-4">
            <h1 className="text-3xl font-semibold mb-4">Step 1: Paste Study Material</h1>
            <text className="mb-10 text-center max-w-3xl">more marketing text more marketing text more marketing text more marketing text more marketing text</text>
            <div className="flex flex-col md:flex-row gap-6 w-full max-w-5xl">
              <textarea
                className="flex-1 h-[400px] p-4 rounded-xl shadow bg-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Paste your study notes or content here..."
                value={studyMaterial}
                onChange={(e) => setStudyMaterial(e.target.value)}
              />
              <div className="flex-1 h-[400px] p-4 rounded-xl shadow bg-white text-gray-900 overflow-y-auto">
                <h3 className="text-lg font-semibold mb-2">Your Custom Text</h3>
                <p className="text-gray-700">
                  You can add any content here—tips, instructions, or even previews of what’s coming next.
                </p>
              </div>
            </div>
            <button
              className={`mt-6 px-6 py-2 rounded-xl text-white ${studyMaterial.trim() ? 'bg-[#054BB4] hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}
              onClick={() => {
                scrollTo(refExplain);
                setCurrentStep(2);
              }}
              disabled={!studyMaterial.trim()}
            >
              Next
            </button>
          </div>

          {/* Step 2 */}
          <div ref={refExplain} className="h-screen snap-start flex flex-col items-center justify-center px-4">
            <h1 className="text-3xl font-semibold mb-4">Step 2: Teach What You Know</h1>
            <div className="flex flex-col md:flex-row gap-6 w-full max-w-5xl">
              <textarea
                className="flex-1 h-[400px] p-4 rounded-xl shadow bg-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Explain the content in your own words..."
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
              />
              <div className="flex-1 h-[400px] p-4 rounded-xl shadow bg-white text-gray-900 overflow-y-auto">
                <h3 className="text-lg font-semibold mb-2">Your Custom Text</h3>
                <p className="text-gray-700">
                  You can add any content here—tips, instructions, or even previews of what’s coming next.
                </p>
              </div>
            </div>
            <div className="flex mt-6 gap-4">
              <button
                className="px-6 py-2 rounded-xl bg-gray-300 hover:bg-gray-400"
                onClick={() => {
                  scrollTo(refPaste);
                  setCurrentStep(1);  
                }}
              >
                Back
              </button>
              <button
                className={`px-6 py-2 rounded-xl text-white ${explanation.trim() ? 'bg-[#054BB4] hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}
                onClick={() => {
                  handleSubmitExplanation(); 
                  scrollTo(refFeedback);
                  setCurrentStep(3); 
                }}
                disabled={!explanation.trim()}
              >
                Get Feedback
              </button>
            </div>
          </div>

          {/* Step 3 */}
          <div ref={refFeedback} className="h-screen snap-start flex flex-col items-center justify-center px-4 text-center">
            <h1 className="text-3xl font-semibold mb-6">Step 3: AI Feedback</h1>
            <div className="w-full max-w-4xl p-6 bg-white rounded-xl shadow">
              {aiFeedback?.summary ? (
                <ReactMarkdown
                  components={{
                    p: ({ node, ...props }) => (
                      <p className="prose prose-blue max-w-none" {...props} />
                    ),
                  }}
                >
                  {aiFeedback.summary}
                </ReactMarkdown>
              ) : (
                <p className="text-gray-500">Waiting for feedback...</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}




//   // progress bar update with page scrolling
//   useEffect(() => {

//     const sections = [
//       { ref: refPaste, step: 1 },
//       { ref: refExplain, step: 2 },
//       { ref: refFeedback, step: 3 },
//     ];

//     const observerOptions = {
//       threshold: 0.6,
//     };

//     const observer = new IntersectionObserver((entries) => {
//       entries.forEach((entry) => {
//         if (entry.isIntersecting) {
//           const matchingSection = sections.find((s) => s.ref.current === entry.target);
//           if (matchingSection) {
//             setCurrentStep(matchingSection.step);
//           }
//         }
//       });
//     }, observerOptions);

//     sections.forEach(({ ref }) => {
//       if (ref.current) observer.observe(ref.current);
//     });

//     return () => observer.disconnect();
//   }, []);

//   const scrollTo = (ref) => {
//     ref.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   // function randomly simulates a progress bar 
//   const simulateProgress = () => {
//     setLoadingProgress(0);
//     let progress = 0;

//     const interval = setInterval(() => {
//       progress += Math.random() * 3; //increment randomly
//       if (progress >= 100) {
//         progress = 100;
//         clearInterval(interval);
//       }

//       setLoadingProgress(progress);
//     }, 300);
//   };

//   // function (button) to pull user explanation and set next page to feedback
//   const handleSubmitExplanation = async () => {
//     if (explanation.trim() === '') {
//       return;
//     }

//     try {

//       setIsLoading(true);
//       simulateProgress();
//       scrollTo(refFeedback);

//       const prompt = 'Act as a student trying to learn from the user teaching. Right now, the user is using teaching as a method of studying, and you are the student they are teaching to.\n\nHere is the content the student is trying to learn: \n' + studyMaterial + '\n\nHere is their explanation of the content: \n' + explanation + '\n\nGive concise feedback:\n\n1. Compare the user\'s explanation to the given study material. Categorize the topics into concepts they understand well, concepts they might need to refresh, and concepts they missed\n2. Ask follow up questions test their understanding further based on concepts they missed from their study material.'

//       /*
//       Prompt:
  
//       Act as a student trying to learn from the user teaching. 
//       Right now, the user is using teaching as a method of 
//       studying, and you are the student they are teaching to.
  
//       Here is the content the student is trying to learn:
//       [studyMaterial]
  
//       Here is their explanation of the content:
//       [explanation]
  
//       Give concise feedback:
  
//       1. Compare the user's explanation to the given study material. Categorize the topics into 
//         concepts they understand well, concepts they might need to refresh, and concepts they missed
//       2. Ask follow up questions test their understanding further based on concepts they missed from their study material.
//       */

//       const response = await fetch('http://127.0.0.1:5000/generate', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ prompt }),
//       });

//       const data = await response.json();

//       setAiFeedback({
//         summary: data.response
//       });

//       // setStep(3);

//     } catch (error) {
//       console.error('Error generating feedback:', error);
//       setAiFeedback({
//         summary: 'Error: Could not get feedback. Please try again later.',
//         followUp: '',
//       });
//       // setStep(3);
//       scrollTo(refFeedback);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (

//     <div>
//       {!hasStarted ? (
//         // --- Start Screen ---
//         <div ref={refStart} className="h-screen snap-start flex">
          
//           {/* left text & start */}
//           <div className="w-1/2 flex flex-col justify-center items-center">
//             <div className="w-full max-w-md px-6 text-left">
//               <p className="text-lg mb-8">Study Smarter with Active Recall</p>
//               <h1 className="text-4xl font-bold mb-6">Teach the Tutor</h1>
//               <p className="text-lg mb-8">No more passive studying. Discover a smarter way to learn — by teaching. Click “Start” below to begin your study session.</p>
//               <button
//                 className="text-white font-semibold px-6 py-3 rounded-2xl hover:bg-blue-100 transition"
//                 style={{ backgroundColor: "#054BB4" }}
//                 onClick={() => setHasStarted(true)}
//               >
//                 Start
//               </button>
//             </div>
//           </div>

//           {/* right image */}
//           <div className="w-1/2 flex items-center justify-center relative">
//             <div 
//               className="w-3/4 md:w-[500px] h-3/4 md:h-[500px] bg-[#b6c4de] rounded-full shadow-lg"
//             ></div>
//             <img
//               src="/images/overlay.png"
//               alt="Overlay"
//               className="absolute w-[600px] h-auto"
//               style={{top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
//             />
//           </div>
//         </div>


// // <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-gray-50 px-8 py-12 gap-12">
// // {/* Left text content */}
// // <div className="w-full md:w-1/2 flex flex-col justify-center items-start max-w-xl">
// //   <p className="text-blue-600 text-lg font-medium mb-4">Study Smarter with Active Recall</p>
// //   <h1 className="text-5xl font-bold leading-tight mb-6 text-gray-900">Teach the Tutor</h1>
// //   <p className="text-gray-700 text-lg mb-8">
// //     No more passive studying. Discover a smarter way to learn — by teaching.
// //     Click “Start” below to begin your study session.
// //   </p>
// //   <button
// //     className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-2xl shadow hover:bg-blue-700 hover:shadow-md transition"
// //     onClick={() => setHasStarted(true)}
// //   >
// //     Start
// //   </button>
// // </div>

// // {/* Right image */}
// // <div className="w-full md:w-1/2 flex items-center justify-center relative">
// //   <div className="w-72 h-72 md:w-[400px] md:h-[400px] bg-gradient-to-tr from-blue-100 to-blue-300 rounded-full shadow-xl"></div>
// //   <img
// //     src="/images/overlay.png"
// //     alt="Overlay"
// //     className="absolute w-[350px] md:w-[500px] h-auto"
// //     style={{
// //       top: '50%',
// //       left: '50%',
// //       transform: 'translate(-50%, -50%)',
// //     }}
// //   />
// // </div>
// // </div>




//       ) : (
//         // --- Study Flow Layout ---
//         <div className="h-screen overflow-y-scroll snap-y snap-mandatory"
//           style={{ backgroundColor: "#E9EEF5" }}
//         >
//           <ProgressBar currentStep={currentStep} />
//           {/* Paste Section */}
//           <div className="h-screen snap-start flex items-center justify-center px-4 relative">
//             {/* Main content */}
//             <div className="flex flex-col items-center justify-center w-full max-w-6xl">
//               <h1 className="text-4xl font-bold mb-2">Step 1: Paste Study Material</h1>
//               <p className="mb-4 text-center max-w-3xl">
//                 more marketing text more marketing text more marketing text more marketing text more marketing text
//               </p>

//               <div className="flex flex-wrap gap-6 w-full">
//                 {/* Text Input Box */}
//                 <div className="flex-1 min-w-[300px] bg-white shadow-lg rounded-2xl p-6 h-[20rem] flex flex-col">
//                   <textarea
//                     className="flex-1 resize-none w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     placeholder="Paste your study notes or content here..."
//                     value={studyMaterial}
//                     onChange={(e) => setStudyMaterial(e.target.value)}
//                   />
//                 </div>

//                 {/* Info Box */}
//                 <div className="flex-1 min-w-[300px] bg-white shadow-lg rounded-2xl p-6 h-[20rem] overflow-y-auto">
//                   <h3 className="text-lg font-semibold mb-2">Your Custom Text</h3>
//                   <p className="text-gray-700">
//                     You can add any content here—tips, instructions, or even previews of what’s coming next.
//                   </p>
//                 </div>
//               </div>

//               <div className="text-right mt-6 w-full max-w-6xl">
//                 <button
//                   className={`px-4 py-2 rounded text-white ${studyMaterial.trim() ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-300 cursor-not-allowed'}`}
//                   disabled={!studyMaterial.trim()}
//                   onClick={() => {
//                     scrollTo(refExplain); // scroll behavior
//                     setCurrentStep(2);    // example progression
//                   }}
//                 >
//                   Next
//                 </button>
//               </div>
//             </div>
//           </div>



//           {/* <div ref={refPaste} className="h-screen snap-start flex flex-col items-center justify-center px-4">
//             <h1 className="text-2xl font-semibold mb-4">Step 1: Paste Study Material</h1>
//             <text className="mb-10">more marketing text more marketing text more marketing text more marketing text more marketing text</text> */}
            
//             {/* text input center */}
//             {/* <div className="flex flex-wrap gap-6 max-w-6xl w-full mb-6"> */}
//               {/* text input */}
//               {/* <div className="flex-1 min-w-[300px] bg-white shadow-lg rounded-2xl p-6 h-[20rem] flex flex-col">
//                 <textarea
//                   className="flex-1 resize-none w-full h-40 border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   placeholder='Paste your study notes or content here...'
//                   value={studyMaterial}
//                   onChange={(e) => setStudyMaterial(e.target.value)}
//                 />
//               </div> */}
//               {/* information */}
//               {/* <div className="flex-1 min-w-[300px] bg-white shadow-lg rounded-2xl p-6 h-[20rem] overflow-y-auto">
//                 <h3 className="text-lg font-semibold mb-2">Your Custom Text</h3>
//                 <p className="text-gray-700">
//                   You can add any content here—tips, instructions, or even previews of what’s coming next.
//                 </p>
//               </div>
//             </div>
            
//             <div className="text-right mt-4">
//               <button
//                 className={`px-4 py-2 rounded text-white ${studyMaterial.trim() ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-300 cursor-not-allowed'}`}
//                 disabled={!studyMaterial.trim()}
//                 onClick={() => scrollTo(refExplain)}
//               >
//                 Next
//               </button>
//             </div>
//           </div> */}

//           {/* Explain Section */}

//           {/* <div ref={refExplain} className="h-screen snap-start flex items-center justify-center px-4 ">
//             <div className="flex flex-col items-center justify-center w-full max-w-6xl">
//               <h1 className="text-4xl font-bold mb-2">Step 2: Teach What You Know</h1>
//               <p className="mb-4 text-center max-w-3xl">
//                 more marketing text more marketing text more marketing text more marketing text more marketing text
//               </p> */}
//               {/* Text Input Box */}
//               {/* <div className="flex-1 min-w-[300px] bg-white shadow-lg rounded-2xl p-6 h-[20rem] flex flex-col"> */}
//                             {/*  w-full bg-white shadow-lg rounded-2xl p-6 */}
//                 {/* <textarea
//                   className="flex-1 resize-none w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   placeholder="Paste your study notes or content here..."
//                   value={studyMaterial}
//                   onChange={(e) => setStudyMaterial(e.target.value)}
//                 />
//               </div>

//               <div className="text-right mt-6 w-full max-w-6xl">
//                   <button
//                     className={`px-4 py-2 rounded text-white bg-blue-600 hover:bg-blue-700`}
//                     onClick={() => {
//                       scrollTo(refPaste); // scroll behavior
//                       setCurrentStep(1);    // example progression
//                     }}
//                   >
//                     Back
//                   </button>
//                   <button
//                     className={`px-4 py-2 rounded text-white ${studyMaterial.trim() ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-300 cursor-not-allowed'}`}
//                     disabled={!studyMaterial.trim()}
//                     onClick={() => {
//                       scrollTo(refExplain); // scroll behavior
//                           setCurrentStep(2);// example progression
//                     }}
//                   >
//                     Next
//                   </button>
//                 </div>
//             </div>
//           </div> */}

//           <div ref={refExplain} className="min-h-screen snap-start flex flex-col items-center justify-center px-4 py-8">
//             <h1 className="text-4xl font-bold mb-2">Step 2: Teach What You Know</h1>
//             <div className="w-full max-w-6xl bg-white shadow-lg rounded-2xl p-6 flex-1 flex flex-col">
//               <textarea
//                 className="w-full flex-1 min-h-[10rem] resize-y border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 placeholder="Explain the content in your own words..."
//                 value={explanation}
//                 onChange={(e) => setExplanation(e.target.value)}
//               />
//             </div>
//             <div className="w-full max-w-3xl mt-6 flex flex-col sm:flex-row justify-between gap-4">
//               <button
//                 className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-blue-700"
//                 onClick={() => {
//                   scrollTo(refPaste)
//                   setCurrentStep(1);
//                 }}
//               >
//                 Back
//               </button>
//               <button
//                 className={`px-4 py-2 rounded text-white ${explanation.trim() ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-300 cursor-not-allowed'}`}
//                 disabled={!explanation.trim()}
//                 onClick={() => {
//                   handleSubmitExplanation()
//                   setCurrentStep(3);
//                 }}
//               >
//                 Submit
//               </button>
//             </div>
//           </div>

//           {/* Feedback Section */}
//           <div ref={refFeedback} className="h-screen snap-start flex items-center justify-center px-4">
//             <div className="max-w-3xl w-full bg-white shadow-lg rounded-2xl p-6">
//               {isLoading ? (
//                 <div className="text-center">
//                   <h2 className="text-xl font-semibold">Generating Feedback...</h2>
//                   <div className="w-full bg-gray-200 rounded-full h-4 mt-4">
//                     <div
//                       className="bg-blue-600 h-4 rounded-full transition-all duration-200"
//                       style={{ width: `${loadingProgress}%` }}
//                     ></div>
//                   </div>
//                   <p className="text-sm text-gray-600 mt-2">{Math.round(loadingProgress)}%</p>
//                 </div>
//               ) : aiFeedback ? (
//                 <>
//                   <h2 className="text-xl font-semibold mb-2">AI Feedback</h2>
//                   <ReactMarkdown>{aiFeedback.summary}</ReactMarkdown>
//                   <p>{aiFeedback.followUp}</p>
//                 </>
//               ) : (
//                 <p>Waiting for submission...</p>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>

//   );
// }
