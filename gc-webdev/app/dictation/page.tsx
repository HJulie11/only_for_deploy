"use client";

import React, { useState, Suspense, useContext, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { storeContext } from '../context/storeContext';
import axios from 'axios';
import LocalStorage from '../../constants/localstorage';

const DictationPageContent: React.FC = () => {
  const searchParams = useSearchParams();
  const title = searchParams.get('title') ?? 'Default';
  const url = searchParams.get('url') ?? '';
  const key = searchParams.get('key') ?? '';
  const fileStorageName = searchParams.get('fileStorageName') ?? '';
  const cardType = searchParams.get('cardType') ?? '';
  const userId = searchParams.get('userId') ?? '';

  const [transcript, setTranscript] = useState<string>('');
  const [userAnswer, setUserAnswer] = useState<string[]>([]);
  const { url: apiUrl } = useContext(storeContext);
  const router = useRouter();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const isYouTubeVideo = cardType === 'news' && key && key !== 'Default';
  const isAudioFile = cardType === 'audio' && fileStorageName && fileStorageName !== '';

  const audioUrl = fileStorageName;

  useEffect(() => {
    const fetchTranscript = async () => {
      let fetchedTranscript = '';
      if (isYouTubeVideo) {
        const response = await fetch(`${apiUrl}/api/transcript?url=${encodeURIComponent(url)}`);
        if (response.ok) {
          const data = await response.json();
          fetchedTranscript = data.transcript || '';
        }
      } else if (isAudioFile) {
        const token = LocalStorage.getItem("token");
        if (!token) return;

        const response = await axios.get(`${apiUrl}/api/user/audio-transcript`, {
          headers: { token },
          params: { userId, fileStorageName },
        });
        fetchedTranscript = response.data.transcript || '';
      }

      setTranscript(fetchedTranscript);
      setUserAnswer(Array(fetchedTranscript.split(/\s+/).length).fill(''));
    };

    fetchTranscript();
  }, [audioUrl, fileStorageName]);

  const handleInput = (index: number, value: string) => {
    const updatedInput = [...userAnswer];
    updatedInput[index] = value;
    setUserAnswer(updatedInput);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === ' ') {
      e.preventDefault();
      const nextIndex = index + 1;

      // Move to the next word, even if it's on the next line or paragraph
      if (nextIndex < userAnswer.length) {
        inputRefs.current[nextIndex]?.focus();
      }
    }
  };

  // Add global keypress listener for shortcuts
  useEffect(() => {
    const handleGlobalKeyPress = (e: KeyboardEvent) => {
      if (!audioRef.current) return;

      if (e.altKey) {
        switch (e.code) {
          case 'KeyP':
            e.preventDefault();
            audioRef.current.paused ? audioRef.current.play() : audioRef.current.pause();
            break;
          case 'KeyR':
            e.preventDefault();
            audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 5);
            break;
          case 'KeyF':
            e.preventDefault();
            audioRef.current.currentTime = Math.min(audioRef.current.duration, audioRef.current.currentTime + 5);
            break;
          default:
            break;
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyPress);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('keydown', handleGlobalKeyPress);
    };
  }, []);

  return (
    <>
      <div className='flex flex-row p-20 h-screen'>
        <div className='w-full h-full p-4 text-lg border border-gray-300 rounded'>
          <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
            {transcript.split(" ").map((word, index) => (
              <input
                key={index}
                type="text"
                value={userAnswer[index] || ''} // Use an empty string if undefined
                onChange={(e) => handleInput(index, e.target.value)}
                onKeyDown={(e) => handleKeyPress(e, index)}
                style={{ margin: "5px", width: `${word.length}ch` }} // Adjust input width to fit the word
                ref={(el) => {
                  inputRefs.current[index] = el;
                }} // Store input reference
                onFocus={() => {
                  // Optional: Select input text on focus
                  inputRefs.current[index]?.select();
                }}
              />
            ))}
          </pre>
        </div>
        <div className='flex flex-col w-[40%] h-full px-5 center items-center justify-center'>
          {isYouTubeVideo ? (
            <iframe
              width="300"
              height="315"
              src={`https://www.youtube.com/embed/${key}`}
              title={title}
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
          
          <Link
            href={{
              pathname: "/correction",
              query: { url, userAnswer: JSON.stringify(userAnswer), cardType, fileStorageName, userId, transcript },
            }}
            className='flex mt-10 w-[170px] h-[50px] p-2 center items-center justify-center rounded-lg bg-purple-middle text-white'
          >
            <p>제출하기</p>
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
