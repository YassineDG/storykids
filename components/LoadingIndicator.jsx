import React from 'react';
import { PulseLoader } from 'react-spinners';

const LoadingIndicator = ({ message = "Processing" }) => {
  return (
    <div className="fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center">
      <span className="mr-2">{message}</span>
      <PulseLoader color="#ffffff" size={10} />
    </div>
  );
};

export default LoadingIndicator;