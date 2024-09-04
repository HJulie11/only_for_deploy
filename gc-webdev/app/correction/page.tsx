"use client";

import React, { useEffect, useState, Suspense, useContext } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Dictation_textbox from '../component/Dictation_textbox';
import Link from 'next/link';
import axios from 'axios';
import { storeContext } from '../context/storeContext';
import LocalStorage from '@/constants/localstorage';

const CorrectionPageContent: React.FC = () => {
  const searchParams = useSearchParams();
  const url = searchParams.get('url') ?? '';
  const userAnswerFromParams = searchParams.get('userAnswer') ?? '';
  const cardType = searchParams.get('cardType') ?? '';
  const userId = searchParams.get('userId') ?? '';
  const fileStorageName = searchParams.get('fileStorageName');
  const { url: apiUrl } = useContext(storeContext);

  const [transcript, setTranscript] = useState('');
  const [userAnswer, setUserAnswer] = useState(userAnswerFromParams);
  const [editableIndexes, setEditableIndexes] = useState<number[]>([]);
  const [initialWrongIndexes, setInitialWrongIndexes] = useState<number[]>([]);
  const [editedWords, setEditedWords] = useState<{ [key: number]: boolean }>({});
  const [correctedWords, setCorrectedWords] = useState<{ [key: number]: boolean }>({});
  const [allCorrect, setAllCorrect] = useState(false);
  const router = useRouter();

  const getTranscript = async () => {
    try {
      const response = await fetch(`http://localhost:4000/api/transcript?url=${encodeURIComponent(url)}`);
      if (response.ok) {
        const data = await response.json();
        console.log("News Transcript Data:", data);
        setTranscript(data.transcript || '');  // Ensure no undefined
        initializeUserAnswer(data.transcript || '', userAnswerFromParams);
      } else {
        console.error('Error fetching transcript:', response.statusText);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Axios error:', error.response?.data || error.message);
        console.log('Axios error:', error.response?.data || error.message);
      } else {
        console.error('Unexpected error:', error);
        console.log('Unexpected error:', error);
      }
    }
  };

  const getAudioTranscript = async () => {
    try {
      const token = LocalStorage.getItem('token');
      if (!token) {
        console.error('Token is missing');
        return;
      }

      console.log("Requesting transcript with:", {
        url: `${apiUrl}/api/user/audio-transcript`,
        token,
        userId,
        fileStorageName,
      });

      const response = await axios.get(`${apiUrl}/api/user/audio-transcript`, {
        headers: {
          'token': token,
        },
        params: {
          userId,
          fileStorageName,
        },
      });

      console.log(response)

      setTranscript(response.data.transcript || '');  // Ensure no undefined
      initializeUserAnswer(response.data.transcript || '', userAnswerFromParams);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Axios error:', error.response?.data || error.message);
        console.log('Axios error:', error.response?.data || error.message);
      } else {
        console.error('Unexpected error:', error);
        console.log('Unexpected error:', error);
      }
    } 
  }

  useEffect(() => {
    if (cardType === 'news') {
      getTranscript();
      console.log(getTranscript)
    } else if (cardType === 'audio') {
      getAudioTranscript();
      console.log(getAudioTranscript)
    }
  }, [url, cardType, userId, fileStorageName]);
  
  

  const initializeUserAnswer = (transcriptText: string, userAnswerText: string) => {
    setUserAnswer(userAnswerText);
    compareAnswers(transcriptText, userAnswerText)
    // Optionally handle other initializations if needed
  };

  const compareAnswers = (transcriptText: string, userAnswerText: string) => {
    const transcriptWords = transcriptText.split(' ' || '\n');
    const userAnswerWords = userAnswerText.split(' ' || '\n');
    const wrongIndexes = [];

    for (let i = 0; i < transcriptWords.length; i++) {
      if (userAnswerWords[i] !== transcriptWords[i]) {
        wrongIndexes.push(i);
      }
    }

    setEditableIndexes(wrongIndexes);
    setInitialWrongIndexes(wrongIndexes);
    checkIfAllCorrect(transcriptText, userAnswerText);
  };

  const checkIfAllCorrect = (transcriptText: string, userAnswerText: string) => {
    const transcriptWords = transcriptText.split(' ');
    const userAnswerWords = userAnswerText.split(' ');
    const allCorrect = transcriptWords.every((word, index) => word === userAnswerWords[index]);
    setAllCorrect(allCorrect);
  };

  const handleWordChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    if (!editableIndexes.includes(index)) return;

    const newUserAnswerWords = userAnswer.split(' ');
    newUserAnswerWords[index] = event.target.value;
    setUserAnswer(newUserAnswerWords.join(' '));

    const newEditedWords = { ...editedWords };
    newEditedWords[index] = true;
    setEditedWords(newEditedWords);

    const newCorrectedWords = { ...correctedWords };
    newCorrectedWords[index] = true;
    setCorrectedWords(newCorrectedWords);
  };

  const renderUserAnswer = () => {
    const userAnswerWords = userAnswer.split(' ');
    const transcriptWords = transcript.split(' ');

    return transcriptWords.map((word, index) => {
      const isEditable = editableIndexes.includes(index);
      const isCorrected = correctedWords[index];
      const userWord = userAnswerWords[index] || '';

      return isEditable ? (
        <input
          key={index}
          value={userWord}
          style={{ width: `${calculateInputWidth(userWord)}px` }}
          className={`mr-2 focus:border-blue-500 ${isCorrected ? 'text-red-500' : 'text-black'}`}
          onChange={(event) => handleWordChange(index, event)}
          onKeyDown={(event) => preventSpacebarTab(event, index)}
        />
      ) : (
        <span key={index} className={`mr-2 ${isCorrected ? 'text-red-500' : 'text-black'}`}>
          {userWord}
        </span>
      );
    });
  };

  const calculateInputWidth = (word: string) => Math.max(30, word.length * 12);

  const preventSpacebarTab = (event: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (event.key === ' ' || event.key === 'Tab') {
      event.preventDefault();
      const inputs = document.querySelectorAll('input');
      const nextIndex = index + 1;

      if (inputs[nextIndex]) {
        (inputs[nextIndex] as HTMLInputElement).focus();
      }
    }
  };

  return (
    <div className='flex flex-row p-20 h-screen'>
      <div className='flex flex-col w-[50%] h-full center items-center justify-center'>
        <div className='w-full h-full p-4 text-lg border border-gray-300 rounded overflow-auto'>
          {renderUserAnswer()}
        </div>
      </div>

      <div className='flex flex-col w-[50%] h-full px-5 center items-center justify-center'>
        <div className='flex h-[90%] w-full center items-center justify-center mb-10'>
          {/* <Dictation_textbox value={transcript.replace(/&amp;#39;/g, '\'')} readOnly /> */}
          <div className='w-full h-full p-4 text-lg border border-gray-300 rounded overflow-y-scroll'>{transcript}</div>
        </div> 

        <div className='flex h-[10%] w-full center items-center justify-center'>
          <Link
            href={{
              pathname: "/reading",
              query: { userAnswer, correctedWords: JSON.stringify(correctedWords) },
            }}
            className='flex w-[170px] h-[50px] p-2 center items-center justify-center rounded-lg bg-purple-middle text-white'
          >
            <p>제출하기</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

const CorrectionPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CorrectionPageContent />
    </Suspense>
  );
};

CorrectionPage.getLayout = function getLayout(page: React.ReactNode) {
  return page;
};

export default CorrectionPage;