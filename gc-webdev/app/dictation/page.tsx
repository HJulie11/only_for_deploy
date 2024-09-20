"use client";

import React, { useState, Suspense, useContext, useEffect, useRef } from 'react';
import Dictation_textbox from '../component/Dictation_textbox';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { storeContext } from '../context/storeContext';

const DictationPageContent = () => {
  const searchParams = useSearchParams();
  const title = searchParams.get('title') ?? 'Default';
  const url = searchParams.get('url') ?? '';
  const thumbnail = searchParams.get('thumbnail') ?? 'Default';
  const key = searchParams.get('key') ?? '';
  const fileStorageName = searchParams.get('fileStorageName') ?? '';
  const cardType = searchParams.get('cardType') ?? '';
  const userId = searchParams.get('userId') ?? '';
  const { url: apiUrl } = useContext(storeContext);

  // New state to store user input
  const [userAnswer, setUserAnswer] = useState('');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  console.log("Received cardType:", cardType);
  console.log("Received key:", key);
  console.log("Received fileStorageName:", fileStorageName);

  // Construct URLs
  const embedUrl = `https://www.youtube.com/embed/${key}`;
  // const audioUrl = `http://localhost:4000/audioFiles/${fileStorageName}`;
  // const audioUrl = `https://aws-s3-audio-upload-bucket.s3.ap-northeast-2.amazonaws.com/audio/${fileStorageName}`;
  const audioUrl = `${fileStorageName}`

  // Determine the type of content to render
  const isYouTubeVideo = cardType === 'news' && key && key !== 'Default';
  const isAudioFile = cardType === 'audio' && fileStorageName && fileStorageName !== '';

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!audioRef.current) return;
      // window/linux: Alt key, mac: Option key
      if (event.altKey) {
        switch (event.code) {
          case 'KeyP': //Space to toggle play/pause
            event.preventDefault();
            if (audioRef.current.paused) {
              audioRef.current.play();
            } else {
              audioRef.current.pause();
            }
            break;
          case 'KeyR': //Left arrow to rewind 5 seconds
            audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 5);
            break;
          case 'KeyF': //Right arrow to fast forward 5 seconds
            audioRef.current.currentTime = Math.min(audioRef.current.duration, audioRef.current.currentTime + 5);
            break;
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [audioUrl]);

  console.log("Card Type:", cardType);
  console.log("YouTube Key:", key);
  console.log("File Storage Name:", fileStorageName);

  return (
    <>
      <div className='flex flex-row p-20 h-screen'>
        {/* Capture user's answer */}
        <textarea 
          className='w-full h-full p-4 text-lg border border-gray-300 rounded' 
          placeholder='Type your answer here...' 
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
        />
        <div className='flex flex-col w-[40%] h-full px-5 center items-center justify-center'>
          {isYouTubeVideo ? (
              <iframe
                width="300"
                height="315"
                src={embedUrl}
                title={title}
                // frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : isAudioFile ? (
              <audio ref={audioRef} controls src={audioUrl} className='w-full max-w-lg'>
                Your browser does not support the audio element.
              </audio>
            ) : (
              <p>No content available</p>
          )}
          
          {/* Pass user answer and other data via URL */}
          <Link
            href={{
              pathname: "/correction",
              query: { url, userAnswer, cardType, fileStorageName, userId }, // Pass the userAnswer here, cardType
            }}
            className='flex mt-10 w-[170px] h-[50px] p-2 center items-center justify-center rounded-lg bg-purple-middle text-white'
          >
            <p>제출하기</p> {/*submit*/}
          </Link>
        </div>
      </div>
    </>
  );
}

const DictationPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DictationPageContent />
    </Suspense>
  );
};

DictationPage.getLayout = function getLayout(page: React.ReactNode) {
  return page;
};

export default DictationPage;