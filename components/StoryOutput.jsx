import React, { useState } from "react";
import { useSession } from "next-auth/react";
import Link from 'next/link';
import Lottie from "react-lottie";
import translateAnimation from "../public/translate.json";
import listenAnimation from "../public/sound.json";
import Modal from './Modal';

const StoryOutput = ({ title, story, onTranslate, onListen, selectedVoice, onVoiceChange, isLoading }) => {
  const { data: session } = useSession();
  const [selectedLanguage, setSelectedLanguage] = useState('ar');
  const [showModal, setShowModal] = useState(false);

  const handleLanguageChange = (event) => {
    setSelectedLanguage(event.target.value);
  };

  const handleTranslateClick = () => {
    onTranslate(selectedLanguage);
  };

  const handleListenClick = () => {
    if (session) {
      onListen(false);
    } else {
      setShowModal(true);
    }
  };

  const translateOptions = {
    loop: true,
    autoplay: true,
    animationData: translateAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const listenOptions = {
    loop: true,
    autoplay: true,
    animationData: listenAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const voices = [
    { id: 'LYsWTGXIoorfYEvGkpzF', name: 'Mima (Female)' },
    { id: 'GBv7mTt0atIp3Br8iCZE', name: 'Thomas (Male)' }
  ];

  return (
    <div className="story-output-container p-4 bg-purple-800 bg-opacity-60 text-white rounded shadow-md">
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <p className="story-text mb-4">{story}</p>

      <div className="buttons flex gap-2 items-center justify-between">
        <div className="flex gap-2 items-center">
          <select
            value={selectedLanguage}
            onChange={handleLanguageChange}
            className="language-select bg-transparent text-white border border-white py-1 px-2 rounded"
          >
            <option value="fr" className="text-black">French</option>
            <option value="ar" className="text-black">Arabic</option>
            <option value="es" className="text-black">Spanish</option>
            <option value="de" className="text-black">German</option>
          </select>
          <button onClick={handleTranslateClick} aria-label="Translate" disabled={isLoading}>
            <Lottie
              options={translateOptions}
              height={25}
              width={25}
            />
          </button>
        </div>
        <div className="flex gap-2 items-center">
          <select
            value={selectedVoice}
            onChange={(e) => onVoiceChange(e.target.value)}
            className="voice-select bg-transparent text-white border border-white py-1 px-2 rounded"
          >
            {voices.map((voice) => (
              <option key={voice.id} value={voice.id} className="text-black">{voice.name}</option>
            ))}
          </select>
          <button 
            onClick={handleListenClick} 
            aria-label="Listen" 
            disabled={isLoading}
            className={`${!session && 'opacity-50'}`}
          >
            <Lottie
              options={listenOptions}
              height={45}
              width={70}
            />
          </button>
        </div>
      </div>

      {showModal && (
  <Modal onClose={() => setShowModal(false)}>
    <h2 className="text-2xl font-bold mb-4 text-center">Login Required</h2>
    <p className="mb-6 text-center">
      You need to be logged in to listen to stories. Please log in or sign up to access this feature.
    </p>
    <div className="flex flex-col gap-4">
      <Link 
        href="/api/auth/signin" 
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded text-center transition duration-300"
      >
        Log In / Sign Up
      </Link>
    </div>
  </Modal>
)}
    </div>
  );
};

export default StoryOutput;