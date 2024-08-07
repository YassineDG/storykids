import React, { useState } from "react";
import { useSession } from "next-auth/react";
import Link from 'next/link';
import Lottie from "react-lottie";
import listenAnimation from "../public/sound.json";
import Modal from './Modal';

const TranslationsSection = ({ translatedText, translatedTitle, onListen, targetLang, selectedVoice, onVoiceChange, isLoading }) => {
  const { data: session } = useSession();
  const [showModal, setShowModal] = useState(false);

  const listenOptions = {
    loop: true,
    autoplay: true,
    animationData: listenAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const isRTL = ['ar', 'he', 'fa', 'ur'].includes(targetLang);

  const voices = [
    { id: 'LYsWTGXIoorfYEvGkpzF', name: 'Mima (Female)' },
    { id: 'GBv7mTt0atIp3Br8iCZE', name: 'Thomas (Male)' }
  ];

  const handleListenClick = () => {
    if (session) {
      onListen(true);
    } else {
      setShowModal(true);
    }
  };

  return (
    <div className={`translations-section w-full bg-purple-900 bg-opacity-60 text-white rounded shadow-lg relative ${isRTL ? 'rtl' : 'ltr'}`} style={{ height: '1100px' }}>
      <div className="p-4 h-full flex flex-col">
        <h1 className={`text-xl font-bold mb-2 ${isRTL ? 'text-right' : 'text-left'}`} style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
          {translatedTitle || "Translated Title"}
        </h1>
        <div className="flex-grow overflow-y-auto pr-4 mb-16">
          <p className="whitespace-pre-line" style={{ 
            direction: isRTL ? 'rtl' : 'ltr',
            textAlign: isRTL ? 'right' : 'left',
            unicodeBidi: 'plaintext'
          }}>
            {translatedText || "Select a story and language to see the translation here."}
          </p>
        </div>
      </div>
      <div className={`absolute bottom-4 ${isRTL ? 'left-4' : 'right-4'} flex items-center gap-2`}>
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
          className={`bg-transparent border-none cursor-pointer ${!session && 'opacity-50'}`}
          aria-label="Listen to translation"
          disabled={isLoading}
        >
          <Lottie
            options={listenOptions}
            height={45}
            width={70}
          />
        </button>
      </div>

      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <h2 className="text-xl font-bold mb-4">Login Required</h2>
          <p className="mb-4">You need to be logged in to listen to translations. Please log in or sign up to access this feature.</p>
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

export default TranslationsSection;