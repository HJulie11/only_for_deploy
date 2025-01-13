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
  const level = searchParams.get('level') ?? 'full_blank';
  const cardType = searchParams.get('cardType') ?? '';
  const userId = searchParams.get('userId') ?? '';

  const [transcript, setTranscript] = useState<string>('');
  const [userAnswer, setUserAnswer] = useState<string[]>([]);
  const [showPopup, setShowPopup] = useState(false); // State to show/hide the popup
  const [initialBlanks, setInitialBlanks] = useState<string[]>([]);

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
        // const token = LocalStorage.getItem("token");
        // if (!token) return;


        // const response = await axios.get(`${apiUrl}/api/user/audio-transcript`, {
        //   headers: { token },
        //   params: { userId, fileStorageName },
        // });
        // fetchedTranscript = response.data.transcript || '';

        try {
          const token = LocalStorage.getItem("token");
          const response = await axios.get(`${apiUrl}/api/user/audio-transcript`, {
            headers: { token },
            params: { userId, fileStorageName },
          });
          fetchedTranscript = response.data.transcript || '';

          if (!token) throw new Error("User token not found in localStorage");
        } catch (error) {
          console.error("LocalStorage access error:", error);
        }
      }

      setTranscript(fetchedTranscript);
      
      // Adjust blanks based on the selected level
      const words = fetchedTranscript.split(/\s+/);
      // let blanks = words.map(() => '');
      let blanks = [...words];

      if (level === 'full') {
        blanks = Array(words.length).fill('');
      } else {
        const blankFrequency = parseInt(level);
        blanks = words.map((word, index) => (index % blankFrequency === 0 ? '' : word));
      }

      setInitialBlanks(blanks.map((word) => word === '' ? '' : word));
      setUserAnswer(blanks);
    };

    fetchTranscript();
  }, [audioUrl, fileStorageName, level]);

  const handleInput = (index: number, value: string) => {
    const updatedInput = [...userAnswer];
    updatedInput[index] = value;
    setUserAnswer(updatedInput);
  };

  // const handleSubmit = () => {
  //   const queryString = new URLSearchParams({
  //     url,
  //     userAnswer: JSON.stringify(userAnswer), // Convert userAnswer array to a string
  //     cardType,
  //     fileStorageName,
  //     userId,
  //     transcript
  //   }).toString();

  //   sessionStorage.setItem("userAnswer", JSON.stringify(userAnswer));
  //   sessionStorage.setItem("transcript", transcript);

  //   if (userAnswer.length && transcript.length) {
  //     console.log("Navigating to correction page with data:", queryString);
  //     router.push(`/correction?url=${url}&cardType=${cardType}&fileStorageName=${fileStorageName}&userId=${userId}`);
  //   } else {
  //     console.log("submit failed : useranswer or transcript is empty");
  //     return () => {if(!queryString) return <p>데이터를 조회중입니다..</p>}
  //   }
  // };
  const handleSubmit = async () => {
    try {
      const token = LocalStorage.getItem("token");
      const response = await axios.post(
        `${apiUrl}/api/user/update-progress`,
        {
          userId,
          fileStorageName,
          progress: 30
        },
        { headers: { token }}
      );

      if (response.status === 200) {
        console.log('Progress updated successfully:', response.data.message);
      } else {
        console.error('Failed to update progress:', response.data.message);
      }
    } catch (error) {
      console.error('Error updating progress:', error);
    }

    // const queryString = new URLSearchParams({
    //   url,
    //   userAnswer: JSON.stringify(userAnswer), // Convert userAnswer array to a string
    //   cardType,
    //   fileStorageName,
    //   userId,
    //   transcript
    // }).toString();

    // sessionStorage.setItem("userAnswer", JSON.stringify(userAnswer));
    // sessionStorage.setItem("transcript", transcript);

    // if (userAnswer.length && transcript.length) {
    //   console.log("Navigating to correction page with data:", queryString);
    //   router.push(`/correction?url=${url}&cardType=${cardType}&fileStorageName=${fileStorageName}&userId=${userId}`);
    // } else {
    //   console.log("submit failed : useranswer or transcript is empty");
    // }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === ' ') {
      e.preventDefault();
      let nextIndex = index + 1;
      while (nextIndex < userAnswer.length && userAnswer[nextIndex] !== '') {
        nextIndex++;
      }

      // Move to the next word, even if it's on the next line or paragraph
      if (nextIndex < userAnswer.length) {
        inputRefs.current[nextIndex]?.focus();
      }
    } else if ((e.ctrlKey || e.metaKey) && e.key === 'Backspace') { // command/ctrl + backspace
      // switch(e.key) {
      //   case 'ArrowRight':
      e.preventDefault();

      let prevIndex = index - 1;
      while (prevIndex >= 0 && initialBlanks[prevIndex] !== '') {
        prevIndex--;
      }
  
      if (prevIndex >= 0) {
        inputRefs.current[prevIndex]?.focus();
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
        <div className='flex flex-col w-[60%]'>
          <button className="ml-0 mb-3 rounded-full bg-gray-100 text-purple-heavy p-2 w-[20%] hover:bg-gray-200 text-sm" onClick={() => setShowPopup(!showPopup)}>
            ℹ 단축키 정보
          </button>

          {/* The popup container */}
          {showPopup && (
            <>
              {/* Shading the rest of the page */}
              <div className="overlay" onClick={() => setShowPopup(false)}></div>

              {/* Popup in the middle of the page */}
              <div className="modal">
                <div className="modal-content flex flex-col center items-center">
                  <div className='p-0'><h2 className='font-bold ml-0 text-purple-heavy mb-7 mt-5'>ℹ 단축키 정보</h2></div>
                  <ul style={{ listStyleType: 'disc', paddingLeft: '20px', textAlign:'left'}} >
                    <li className='mt-1 mb-1'>command/ctrl + P : 음원 재생/멈춤</li>
                    <li className='mb-1'>command/ctrl + R : 5초 앞으로</li>
                    <li className='mb-1'>command/ctrl + F: 5초 뒤로</li>
                    <li className='mb-1'>space : 다음 단어로 이동</li>
                    <li className='mb-7'>command/ctrl + backspace : 이전 단어로 이동</li>
                  </ul>

                  {/* Close button */}
                  <div className='mt-7 mb-3'>
                    <button className="rounded-lg bg-purple-heavy p-2 text-white mr-3" onClick={() => setShowPopup(false)}>
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
          <div className='w-full h-full p-4 text-lg border border-gray-300 rounded overflow-hidden overflow-y-scroll'>
            <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
              {transcript.split(" ").map((word, index) => (
                <input
                  className='bg-gray-100 rounded'
                  key={index}
                  type="text"
                  value={userAnswer[index] || ''} // Use an empty string if undefined
                  onChange={(e) => handleInput(index, e.target.value)}
                  onKeyDown={(e) => handleKeyPress(e, index)}
                  style={{ margin: "5px", width: `${word.length}ch` }} // Adjust input width to fit the word
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }} // Store input reference
                  readOnly={initialBlanks[index] !== ''}
                  onFocus={() => {
                    // Optional: Select input text on focus
                    inputRefs.current[index]?.select();
                  }}
                />
              ))}
            </pre>
          </div>
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
            <audio ref={audioRef} controls src={audioUrl} className='w-[70%] max-w-lg'>
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
            onClick={handleSubmit}
            className='flex mt-10 w-[170px] h-[50px] p-2 center items-center justify-center rounded-lg bg-purple-middle text-white'
          >
          {/* Link with progress attribute added */}
          {/* <Link
            href="#"
            onClick={handleSubmit}
            className='flex mt-10 w-[170px] h-[50px] p-2 center items-center justify-center rounded-lg bg-purple-middle text-white'
          > */}
          {/* <button 
            onClick={handleSubmit}
            className='flex mt-10 w-[170px] h-[50px] p-2 center items-center justify-center rounded-lg bg-purple-middle text-white'
          > */}
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