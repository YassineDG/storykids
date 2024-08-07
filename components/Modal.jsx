import React from 'react';
import Link from 'next/link';

const Modal = ({ children, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-purple-900 bg-opacity-90 p-6 rounded-lg shadow-xl text-white max-w-md w-full">
        {children}
        <button 
          onClick={onClose} 
          className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded w-full"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;