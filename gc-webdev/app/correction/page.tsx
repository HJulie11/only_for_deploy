"use client";

import React, { useEffect, useState, Suspense, useContext } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { storeContext } from "../context/storeContext";
import LocalStorage from "@/constants/localstorage";

interface Word {
  word: string;
  isCorrect: boolean;
  isMissing: boolean;
  hasBeenEdited: boolean; // Track if the word has been edited
  isEditing: boolean; // Track if the word is being edited
}

const CorrectionPageContent: React.FC = () => {
  const searchParams = useSearchParams();
  const url = searchParams.get("url") ?? "";
  const userAnswerFromParams = searchParams.get("userAnswer") ?? "";
  const cardType = searchParams.get("cardType") ?? "";
  const userId = searchParams.get("userId") ?? "";
  const fileStorageName = searchParams.get("fileStorageName");
  const { url: apiUrl } = useContext(storeContext);

  const [transcript, setTranscript] = useState<string>("");
  const [userWords, setUserWords] = useState<Word[]>([]);
  const [userAnswer, setUserAnswer] = useState(userAnswerFromParams);
  const [correctedWords, setCorrectedWords] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    const getTranscript = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/transcript?url=${encodeURIComponent(url)}`);
        if (response.ok) {
          const data = await response.json();
          setTranscript(data.transcript || "");
        } else {
          console.error("Error fetching transcript:", response.statusText);
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("Axios error:", error.response?.data || error.message);
        } else {
          console.error("Unexpected error:", error);
        }
      }
    };

    const getAudioTranscript = async () => {
      try {
        const token = LocalStorage.getItem("token");
        if (!token) {
          console.error("Token is missing");
          return;
        }

        const response = await axios.get(`${apiUrl}/api/user/audio-transcript`, {
          headers: {
            token: token,
          },
          params: {
            userId,
            fileStorageName,
          },
        });

        setTranscript(response.data.transcript || "");
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("Axios error:", error.response?.data || error.message);
        } else {
          console.error("Unexpected error:", error);
        }
      }
    };

    if (cardType === "news") {
      getTranscript();
    } else if (cardType === "audio") {
      getAudioTranscript();
    }
  }, [url, cardType, userId, fileStorageName]);

  useEffect(() => {
    const compareAnswers = () => {
      const userWordsArray = userAnswer
        .trim()
        .split(/(?<=[^\s])(?=\W)|\s+/)
        .filter(Boolean);
  
      const transcriptWordsArray = transcript
        .trim()
        .split(/(?<=[^\s])(?=\W)|\s+/)
        .filter(Boolean);
  
      const result: Word[] = [];
      let transcriptIndex = 0;
      let userIndex = 0;
  
      while (userIndex < userWordsArray.length || transcriptIndex < transcriptWordsArray.length) {
        if (userIndex >= userWordsArray.length) {
          result.push({ word: transcriptWordsArray[transcriptIndex], isCorrect: false, isMissing: true, hasBeenEdited: false, isEditing: false });
          transcriptIndex++;
        } else if (transcriptIndex >= transcriptWordsArray.length) {
          result.push({ word: userWordsArray[userIndex], isCorrect: false, isMissing: false, hasBeenEdited: false, isEditing: false });
          userIndex++;
        } else {
          const userWord = userWordsArray[userIndex];
          const transcriptWord = transcriptWordsArray[transcriptIndex];
  
          if (userWord === transcriptWord) {
            result.push({ word: userWord, isCorrect: true, isMissing: false, hasBeenEdited: false, isEditing: false });
            userIndex++;
            transcriptIndex++;
          } else {
            if (transcriptWordsArray[transcriptIndex + 1] && userWord === transcriptWordsArray[transcriptIndex + 1]) {
              result.push({ word: transcriptWord, isCorrect: false, isMissing: true, hasBeenEdited: false, isEditing: false });
              transcriptIndex++;
            } else {
              result.push({ word: userWord, isCorrect: false, isMissing: false, hasBeenEdited: false, isEditing: false });
              userIndex++;
              transcriptIndex++;
            }
          }
        }
      }
  
      setUserWords(result);
    };
  
    if (transcript && userAnswer) {
      compareAnswers();
    }
  }, [userAnswer, transcript]);

  const handleWordEdit = (index: number, newWord: string) => {
    const updatedWords = [...userWords];
    updatedWords[index] = { 
      ...updatedWords[index], 
      word: newWord, 
      hasBeenEdited: true // Mark as edited
    };
    setUserWords(updatedWords);
  };
  
  const handleFocus = (index: number) => {
    const updatedWords = [...userWords];
    updatedWords[index] = { ...updatedWords[index], isEditing: true }; // Mark word as being edited
    setUserWords(updatedWords);
  };

  const handleBlur = (index: number, e: React.FocusEvent<HTMLSpanElement>) => {
    handleWordEdit(index, e.target.textContent || '');
    const updatedWords = [...userWords];
    updatedWords[index] = { 
      ...updatedWords[index], 
      isEditing: false 
    }; // Reset editing status
    setUserWords(updatedWords);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLSpanElement>, index: number) => {
    if (e.key === " ") {
      e.preventDefault();
      const nextEditableElement = document.querySelector(`span[contenteditable="true"]:not([data-index="${index}"])`);
      if (nextEditableElement) {
        (nextEditableElement as HTMLElement).focus();
      }
    }
  };

  return (
    <div className="flex flex-row p-20 h-screen">
      <div className="flex flex-col w-[50%] h-full center items-center justify-center">
        <div className="w-full h-full p-4 text-lg border border-gray-300 rounded overflow-auto">
          <pre className='p-2 text-black' style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', overflowWrap: 'break-word' }}>
            {userWords.map((word, index) => {
                // Determine if the word should have special styling
                const shouldNotWrap = ['.', ')'].includes(word.word); // Replace with your specific words

                return (
                  <span
                    key={index}
                    className={`${
                      word.isCorrect
                        ? "text-black"
                        : word.isMissing
                        ? "text-red-400"
                        : word.hasBeenEdited || word.isEditing
                        ? "text-red-500" // Maintain red color if edited
                        : "text-black" // Incorrect but not edited
                    } ${shouldNotWrap ? 'no-wrap' : ''}`} // Apply class conditionally
                    contentEditable={!word.isCorrect}
                    suppressContentEditableWarning={true}
                    onFocus={() => handleFocus(index)} // Set editing state on focus
                    onBlur={(e) => handleBlur(index, e)} // Handle blur event
                    onKeyDown={(e) => handleKeyDown(e, index)} // Handle keydown event
                  >
                    {word.isMissing ? '  ' : word.word}
                  </span>
                );
              })}
          </pre>
        </div>
      </div>

      <div className="flex flex-col w-[50%] h-full px-5 center items-center justify-center">
        <div className="flex h-[90%] w-full center items-center justify-center">
          <div className="w-full h-full p-4 text-lg border border-gray-300 rounded overflow-y-scroll">
            <pre className="p-2 m-1 text-black" style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>{transcript}</pre>
          </div>
        </div>

        <div className="flex h-[10%] w-full center items-center justify-center">
          <Link
            href={{
              pathname: "/reading",
              query: { userAnswer, correctedWords: JSON.stringify(correctedWords) },
            }}
            className="flex w-[170px] h-[50px] p-2 center items-center justify-center rounded-lg bg-purple-middle text-white"
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
