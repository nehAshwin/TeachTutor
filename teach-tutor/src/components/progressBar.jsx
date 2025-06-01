import React from 'react';

const ProgressBar = ({currentStep}) => {
    const fillHeight = Math.min(currentStep / 3, 1) * 100;  // percentage fill

    return(
        <div className="fixed top-1/2 right-4 transform -translate-y-1/2 h-72 w-6 bg-gray-200 rounded-full shadow-inner overflow-hidden">
            <div
                className="absolute top-0 left-0 w-full bg-[#054BB4] transition-all duration-500 rounded-full"
                style={{ height: `${fillHeight}%` }}
            />
        </div>
    );
};

export default ProgressBar