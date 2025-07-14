import React from 'react';

const ProgressBar = ({ currentStep }) => {
  const steps = [
    { id: 1, label: 'Study Material' },
    { id: 2, label: 'Teach Back' },
    { id: 3, label: 'AI Feedback' }
  ];

  return (
    <div className="w-full bg-gray-100 rounded-lg p-1">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                  currentStep >= step.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-300 text-gray-600'
                }`}
              >
                {currentStep > step.id ? '✓' : step.id}
              </div>
              <span
                className={`text-xs mt-1 font-medium transition-colors ${
                  currentStep >= step.id ? 'text-blue-600' : 'text-gray-500'
                }`}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-2 transition-colors ${
                  currentStep > step.id ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ProgressBar;