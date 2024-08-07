"use client";
import React, { useEffect, useState, useCallback } from 'react';
import { useSession } from "next-auth/react";
import axios from 'axios';
import Link from 'next/link';
import StoryOutput from './StoryOutput';
import TranslationsSection from './TranslationsSection';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import { FaChevronUp, FaChevronDown, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';

const YourStoryCollections = () => {
  const { data: session } = useSession();
  const [stories, setStories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedStory, setSelectedStory] = useState(null);
  const [showTranslations, setShowTranslations] = useState(false);
  const [audioUrl, setAudioUrl] = useState('');
  const [showAudioPlayer, setShowAudioPlayer] = useState(false);
  const storiesPerPage = 9;

  const fetchStories = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`/api/stories/get?page=${currentPage}&limit=${storiesPerPage}`);
      setStories(response.data.stories);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching stories:", error);
      alert("Failed to fetch stories. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, storiesPerPage]);

  useEffect(() => {
    if (session) {
      fetchStories();
    }
  }, [session, currentPage, fetchStories]);

  const handleStoryClick = (story) => {
    setSelectedStory(story);
    setShowTranslations(false);
    if (story.audioUrl) {
      setAudioUrl(`/api/audio/${story.audioUrl}`);
      setShowAudioPlayer(true);
    } else {
      setAudioUrl('');
      setShowAudioPlayer(false);
    }
  };

  const handleDeleteStory = async (storyId) => {
    if (window.confirm("Are you sure you want to delete this story?")) {
      setIsLoading(true);
      try {
        await axios.delete(`/api/stories/delete?id=${storyId}`);
        setStories(stories.filter(story => story.id !== storyId));
        if (selectedStory && selectedStory.id === storyId) {
          setSelectedStory(null);
        }
        toast.success("Story deleted successfully");
      } catch (error) {
        console.error("Error deleting story:", error);
        alert("Failed to delete the story. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleTranslate = async (language) => {
    if (!selectedStory) return;
    
    setIsLoading(true);
    try {
      const response = await axios.post('/api/translate', {
        text: selectedStory.content,
        targetLang: language
      });
      
      const updatedStory = {
        ...selectedStory,
        translations: {
          ...selectedStory.translations,
          [language]: { content: response.data.translatedText }
        }
      };
      
      setSelectedStory(updatedStory);
      setShowTranslations(true);
      
      setStories(stories.map(story => 
        story.id === selectedStory.id ? updatedStory : story
      ));
      
      await axios.post('/api/stories/save', updatedStory);
    } catch (error) {
      console.error("Error translating story:", error);
      alert("Failed to translate the story. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleListen = async (isTranslated = false) => {
    if (!selectedStory) return;
    
    const textToRead = isTranslated 
      ? selectedStory.translations[Object.keys(selectedStory.translations)[0]].content
      : selectedStory.content;
    
    setIsLoading(true);
    try {
      const response = await axios.post('/api/textToSpeech', {
        text: textToRead,
        language: isTranslated ? Object.keys(selectedStory.translations)[0] : 'en-US'
      }, {
        responseType: 'arraybuffer'
      });

      const audioBlob = new Blob([response.data], { type: 'audio/mpeg' });
      const audioUrl = await uploadAudio(audioBlob);
      
      const updatedStory = { ...selectedStory, audioUrl };
      setSelectedStory(updatedStory);
      setAudioUrl(`/api/audio/${audioUrl}`);
      setShowAudioPlayer(true);
      
      setStories(stories.map(story => 
        story.id === selectedStory.id ? updatedStory : story
      ));
      
      await axios.post('/api/stories/save', updatedStory);
    } catch (error) {
      console.error("Error generating audio:", error);
      alert("Failed to generate audio. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const uploadAudio = async (audioBlob) => {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'audio.mp3');
    
    const response = await axios.post('/api/upload-audio', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    
    return response.data.url;
  };

  if (!session) {
    return (
      <div className="text-center bg-white/10 backdrop-blur-sm rounded-lg shadow-lg p-6">
        <p className="text-white mb-4">Please sign in to view your stories.</p>
        <Link 
          href="/api/auth/signin" 
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition-colors"
        >
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 pb-24">
      <h2 className="text-3xl font-bold mb-6 text-center text-white">Your Story Collections</h2>
      {isLoading ? (
        <p className="text-center text-white">Loading your stories...</p>
      ) : stories.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {stories.map((story) => (
              <div 
                key={story.id} 
                className="bg-purple-800 bg-opacity-60 p-6 rounded-lg shadow-lg cursor-pointer hover:bg-opacity-70 transition-all relative"
              >
                <div onClick={() => handleStoryClick(story)}>
                  <h3 className="text-xl font-semibold mb-3 text-white">{story.title}</h3>
                  <p className="text-sm text-gray-300 mb-4">{story.content.substring(0, 150)}...</p>
                  {Object.entries(story.translations || {}).map(([lang, translation]) => (
                    <div key={lang} className="mt-2">
                      <p className="text-xs text-gray-400">{lang} Translation:</p>
                      <p className="text-sm text-gray-300">{translation.content.substring(0, 50)}...</p>
                    </div>
                  ))}
                  {story.audioUrl && (
                    <p className="text-xs text-gray-400 mt-2">Audio available</p>
                  )}
                  <span className="text-xs text-gray-400 block mt-2">
                    Created: {new Date(story.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteStory(story.id);
                  }}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
          {selectedStory && (
            <div className="mt-8 bg-purple-900 bg-opacity-60 p-6 rounded-lg shadow-lg">
              <StoryOutput
                story={selectedStory.content}
                title={selectedStory.title}
                onTranslate={handleTranslate}
                onListen={handleListen}
              />
              {Object.entries(selectedStory.translations || {}).map(([lang, translation]) => (
                <TranslationsSection 
                  key={lang}
                  translatedText={translation.content}
                  translatedTitle={selectedStory.title}
                  onListen={() => handleListen(true)}
                  targetLang={lang}
                />
              ))}
            </div>
          )}
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-l disabled:opacity-50"
            >
              Previous
            </button>
            <span className="bg-blue-600 text-white font-bold py-2 px-4">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <p className="text-center text-white">You haven&apos;t saved any stories yet.</p>
      )}
      {audioUrl && (
        <div className={`fixed ${showAudioPlayer ? 'bottom-0' : '-bottom-20'} left-0 right-0 transition-all duration-300 ease-in-out z-40`}>
          <div className="bg-blue-950 bg-opacity-80 text-white p-2 relative">
            <AudioPlayer
              src={audioUrl}
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
    </div>
  );
};

export default YourStoryCollections;