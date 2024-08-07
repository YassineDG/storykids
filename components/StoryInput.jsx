import React, { useState, useEffect } from "react";
import Lottie from "react-lottie";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import animationData from "../public/generate-now.json";

const LottieIcon = ({ onClick, disabled }) => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div onClick={disabled ? null : onClick} className={`cursor-pointer ${disabled ? 'opacity-50' : ''}`}>
      <Lottie options={defaultOptions} height={48} width={48} />
    </div>
  );
};

const StoryInput = ({ placeholder, onGenerate }) => {
  const [inputValue, setInputValue] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleGenerate = () => {
    if (inputValue.trim() === '') {
      toast.error("Please enter a topic or theme for your story.", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    setIsGenerating(true);
    onGenerate(inputValue)
      .catch((error) => {
        console.error('Error generating story:', error);
        toast.error("Oops! We couldn't generate your story. Please try again.", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      })
      .finally(() => {
        setIsGenerating(false);
      });
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleGenerate();
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center border border-blue-300 rounded-md p-2 shadow-sm bg-transparent backdrop-filter backdrop-blur-lg w-full max-w-2xl">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          className="flex-1 p-3 outline-none bg-transparent text-white placeholder-gray-300 focus:ring-2 focus:ring-blue-500 rounded-md"
          placeholder={placeholder}
          disabled={isGenerating}
        />
        <LottieIcon onClick={handleGenerate} disabled={isGenerating} />
      </div>
      {isGenerating && (
        <p className="mt-2 text-blue-300">Crafting your story... Please wait.</p>
      )}
      <ToastContainer />
    </div>
  );
};

export default StoryInput;