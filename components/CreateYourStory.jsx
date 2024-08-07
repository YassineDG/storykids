"use client";
import React, { useState, useRef } from 'react';
import { useSession } from "next-auth/react";
import axios from 'axios';
import StoryInput from './StoryInput';
import StoryOutput from './StoryOutput';
import TranslationsSection from './TranslationsSection';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import { FaChevronUp, FaChevronDown } from 'react-icons/fa';
import { PulseLoader } from 'react-spinners';

const LoadingIndicator = ({ message = "Processing" }) => {
  return (
    <div className="fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center z-50">
      <span className="mr-2">{message}</span>
      <PulseLoader color="#ffffff" size={10} />
    </div>
  );
};

const CreateYourStory = () => {
  const { data: session } = useSession();

  const [currentStory, setCurrentStory] = useState({
    id: null,
    title: '',
    content: '',
    translations: {},
    audioUrl: ''
  });
  const [showTranslations, setShowTranslations] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState('LYsWTGXIoorfYEvGkpzF');
  const [targetLang, setTargetLang] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [showAudioPlayer, setShowAudioPlayer] = useState(true);
  const audioPlayerRef = useRef(null);

  const [cachedStories, setCachedStories] = useState({});
  const [cachedAudio, setCachedAudio] = useState({});

  const saveOrUpdateStory = async (storyData) => {
    if (!session) return;
    try {
      let response;
      if (storyData.id) {
        response = await axios.put(`/api/stories/update/${storyData.id}`, storyData);
      } else {
        response = await axios.post('/api/stories/save', storyData);
      }
      return response.data;
    } catch (error) {
      console.error('Error saving/updating story:', error);
      throw error;
    }
  };

  const generateStory = async (prompt) => {
    if (cachedStories[prompt]) {
      setCurrentStory(cachedStories[prompt]);
      return;
    }
  
    setIsLoading(true);
    setLoadingMessage('Generating story');
    try {
      const response = await axios.post('/api/generateStory', { prompt });
      const newStory = {
        id: null,
        title: response.data.title,
        content: response.data.story,
        translations: {},
        audioUrl: ''
      };
      
      if (session) {
        const savedStory = await saveOrUpdateStory(newStory);
        newStory.id = savedStory.id;
      }
  
      setCurrentStory(newStory);
      setCachedStories(prev => ({ ...prev, [prompt]: newStory }));
      setShowTranslations(false);
    } catch (error) {
      console.error('Error generating story:', error);
      throw error; // Propagate the error to be handled in StoryInput
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  };
  
  const translateStory = async (language) => {
    setIsLoading(true);
    setLoadingMessage('Translating story');
    try {
      const [storyResponse, titleResponse] = await Promise.all([
        axios.post('/api/translate', { text: currentStory.content, targetLang: language }),
        axios.post('/api/translate', { text: currentStory.title, targetLang: language })
      ]);
      const translatedStory = storyResponse.data.translatedText;
      const translatedTitle = titleResponse.data.translatedText;

      const updatedStory = {
        ...currentStory,
        translations: {
          ...currentStory.translations,
          [language]: { title: translatedTitle, content: translatedStory }
        }
      };

      if (session) {
        const savedStory = await saveOrUpdateStory(updatedStory);
        updatedStory.id = savedStory.id;
      }

      setCurrentStory(updatedStory);
      setShowTranslations(true);
      setTargetLang(language);
    } catch (error) {
      console.error('Error translating story:', error);
      alert('Failed to translate story. Please try again.');
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  };

  const listenStory = async (isTranslated = false) => {
    const textToRead = isTranslated
      ? `${currentStory.translations[targetLang].title}. ${currentStory.translations[targetLang].content}`
      : `${currentStory.title}. ${currentStory.content}`;
    const language = isTranslated ? targetLang : 'en-US';
    const cacheKey = `${textToRead}_${selectedVoice}_${language}`;
  
    if (cachedAudio[cacheKey]) {
      setCurrentStory(prev => ({ ...prev, audioUrl: cachedAudio[cacheKey] }));
      setShowAudioPlayer(true);
      setTimeout(() => audioPlayerRef.current?.audio?.current?.play(), 100);
      return;
    }
  
    setIsLoading(true);
    setLoadingMessage('Generating audio');
    try {
      const response = await axios.post('/api/textToSpeech', {
        text: textToRead,
        voiceId: selectedVoice,
        language: language
      }, {
        responseType: 'arraybuffer'
      });
  
      const audioBlob = new Blob([response.data], { type: 'audio/mpeg' });
      const audioUrl = await uploadAudio(audioBlob);
      
      const updatedStory = { ...currentStory, audioUrl };
      
      if (session) {
        const savedStory = await saveOrUpdateStory(updatedStory);
        updatedStory.id = savedStory.id;
      }

      setCurrentStory(updatedStory);
      setCachedAudio(prev => ({ ...prev, [cacheKey]: audioUrl }));
      setShowAudioPlayer(true);
      setTimeout(() => audioPlayerRef.current?.audio?.current?.play(), 100);
    } catch (error) {
      console.error('Error in listenStory:', error);
      alert(`Failed to generate audio: ${error.message}. Please try again.`);
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  };
  
  const uploadAudio = async (audioBlob) => {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'audio.mp3');
    
    try {
      const response = await axios.post('/api/upload-audio', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (response.data && response.data.url) {
        return response.data.url;
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Error uploading audio:', error);
      throw new Error(`Failed to upload audio: ${error.message}`);
    }
  };

  return (
    <div className="container mx-auto p-4 pb-24">
      <div className="input-section mb-4">
        <StoryInput placeholder="Type your story title..." onGenerate={generateStory} />
      </div>
      {currentStory.content && (
        <div className="output-translate-section flex flex-col md:flex-row gap-4 w-full">
          <div className="output-section w-full p-4 bg-purple-800 bg-opacity-60 text-white rounded shadow-lg">
            <StoryOutput
              story={currentStory.content}
              title={currentStory.title}
              onTranslate={translateStory}
              onListen={() => listenStory(false)}
              selectedVoice={selectedVoice}
              onVoiceChange={setSelectedVoice}
              isLoading={isLoading}
            />
          </div>
          {showTranslations && currentStory.translations[targetLang] && (
            <TranslationsSection 
              translatedText={currentStory.translations[targetLang].content}
              translatedTitle={currentStory.translations[targetLang].title}
              onListen={() => listenStory(true)}
              targetLang={targetLang}
              selectedVoice={selectedVoice}
              onVoiceChange={setSelectedVoice}
              isLoading={isLoading}
            />
          )}
        </div>
      )}
      {currentStory.audioUrl && (
        <div className={`fixed ${showAudioPlayer ? 'bottom-0' : '-bottom-20'} left-0 right-0 transition-all duration-300 ease-in-out z-40`}>
          <div className="bg-blue-950 bg-opacity-80 text-white p-2 relative">
            <AudioPlayer
              ref={audioPlayerRef}
              src={`/api/audio/${currentStory.audioUrl}`}
              onPlay={e => console.log("onPlay")}
              style={{ backgroundColor: 'transparent', color: 'white' }}
              autoPlayAfterSrcChange={false}
            />
            <button 
              onClick={() => setShowAudioPlayer(!showAudioPlayer)}
              className="absolute -top-8 right-4 bg-blue-500 text-white p-2 rounded-t-md"
            >
              {showAudioPlayer ? <FaChevronDown /> : <FaChevronUp />}
            </button>
          </div>
        </div>
      )}
      {isLoading && <LoadingIndicator message={loadingMessage} />}
    </div>
  );
};

export default CreateYourStory;