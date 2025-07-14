import React from 'react';

const LoadingSpinner = ({ progress, message = "Analyzing your explanation..." }) => {
  return (
    <div className="text-center py-12">
      <div className="inline-flex items-center space-x-3 mb-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="text-gray-700 font-medium">{message}</span>
      </div>
      
      <div className="w-full max-w-md mx-auto">
        <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-sm text-gray-500 mt-2">
          {Math.round(progress)}% complete
        </p>
      </div>
      
      <div className="mt-6 text-xs text-gray-400">
        <p>This may take a few moments...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner; 