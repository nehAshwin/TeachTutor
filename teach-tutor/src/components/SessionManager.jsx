import React, { useState } from 'react';

const SessionManager = ({ savedSessions, onLoadSession, onClearHistory }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (savedSessions.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Recent Sessions</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            {isExpanded ? 'Show Less' : 'Show More'}
          </button>
          <button
            onClick={onClearHistory}
            className="text-sm text-red-600 hover:text-red-700"
          >
            Clear All
          </button>
        </div>
      </div>
      
      <div className="space-y-3">
        {(isExpanded ? savedSessions : savedSessions.slice(0, 3)).map((session) => (
          <div
            key={session.id}
            className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors cursor-pointer"
            onClick={() => onLoadSession(session)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {session.studyMaterial.substring(0, 60)}...
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(session.timestamp).toLocaleDateString()} at{' '}
                  {new Date(session.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
                {session.aiFeedback && (
                  <div className="mt-2 flex items-center text-xs text-green-600">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Feedback available
                  </div>
                )}
              </div>
              <button className="ml-2 text-blue-600 hover:text-blue-700 text-sm">
                Load
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {savedSessions.length > 3 && !isExpanded && (
        <button
          onClick={() => setIsExpanded(true)}
          className="w-full mt-3 text-sm text-blue-600 hover:text-blue-700"
        >
          Show {savedSessions.length - 3} more sessions
        </button>
      )}
    </div>
  );
};

export default SessionManager; 