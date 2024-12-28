import React from 'react';

const Error = ({ errMessage, type = 'error' }) => {
  const message = typeof errMessage === "string" 
    ? errMessage 
    : JSON.stringify(errMessage, null, 2);

  // Different illustrations for different error types
  const illustrations = {
    error: (
      <svg 
        className="w-48 h-48 mb-6 text-red-500"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle 
          cx="12" 
          cy="12" 
          r="10" 
          className="stroke-current animate-pulse"
          strokeWidth="2"
        />
        <path 
          d="M8 8L16 16M8 16L16 8" 
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
    network: (
      <svg 
        className="w-48 h-48 mb-6 text-red-500"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          d="M4 4L20 20" 
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path 
          d="M12 4C16.4183 4 20 7.58172 20 12"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="animate-spin-slow"
        />
      </svg>
    )
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="flex flex-col items-center justify-center p-8 rounded-xl bg-white shadow-lg animate-slideIn">
        {/* Dynamic Illustration */}
        {illustrations[type] || illustrations.error}

        {/* Error Content */}
        <div className="text-center w-full">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            {type === 'network' ? 'Connection Error' : 'Error Occurred'}
          </h3>
          
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r">
            <p className="text-red-700 text-sm whitespace-pre-wrap font-medium">
              {message}
            </p>
          </div>

          {/* Optional: Retry Button */}
          <button 
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-2 bg-red-500 text-white rounded-lg
              hover:bg-red-600 transition-colors duration-200
              focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default Error;