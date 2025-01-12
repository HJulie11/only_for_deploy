"use client"
import React, { useEffect, useState, Suspense, useRef, useContext } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import LocalStorage from "@/constants/localstorage";
import axios from "axios";
import {storeContext} from "../context/storeContext";

const debounce = (func: Function, delay: number) => {
  let timeoutId: NodeJS.Timeout | undefined; // Declare timeoutId here

  return (...args: any) => {
    if (timeoutId) clearTimeout(timeoutId); // Clear existing timeout if any
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

const CorrectionPageContent = () => {
  const searchParams = useSearchParams();
  const transcript = searchParams.get("transcript")?.split(" ") || [];
  const userAnswerParam = searchParams.get("userAnswer") || "[]";
  const userId = searchParams.get("userId") || "";
  const fileStorageName = searchParams.get("fileStorageName") ?? "";
  // const userAnswer = userAnswerParam ? JSON.parse(userAnswerParam) : [];
  const userAnswer = JSON.parse(userAnswerParam);
  const { url: apiUrl } = useContext(storeContext);

  const [correctedWords, setCorrectedWords] = useState<string[]>(userAnswer);
  const [editableWords, setEditableWords] = useState<Set<number>>(new Set());
  const [editedIncorrectWords, setEditedIncorrectWords] = useState<Set<number>>(new Set());
  const [isAllCorrected, setIsAllCorrected] = useState<boolean>(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const normalizeApostrophes = (text: string) => {
    return text.replace(/[’‘]/g, "'"); // Replace smart quotes with standard apostrophe
  };

  const isCorrectWord = (input: string, transcriptWord: string) => {
    const normalizedInput = normalizeApostrophes(input.trim());
    const normalizedTranscript = normalizeApostrophes(transcriptWord.trim());
  
    if (normalizedInput === normalizedTranscript) return true;
  
    const contractions = ["you've", "I'll", "it's", "he's", "she's", "they're", "we're"];
    return contractions.includes(normalizedTranscript) && contractions.includes(normalizedInput);
  };

  // Effect to check if all incorrect words are corrected
  useEffect(() => {
    const checkAllCorrected = debounce(() => {
      const allCorrected = Array.from(editableWords).every((index) =>
        isCorrectWord(correctedWords[index], transcript[index])
      );
      setIsAllCorrected(allCorrected);
    }, 300); // Adjust the delay as needed

    checkAllCorrected(); // Call the debounced function

    // Cleanup function
    return () => {
      // Since timeoutId is scoped in debounce, we don't need cleanup here
    };
  }, [correctedWords, editableWords, transcript]); // Only re-run this effect when correctedWords or editableWords changes

  // Existing useEffect for updating editableWords
  useEffect(() => {
    const incorrectIndices = userAnswer
      .map((input: string, index: number) => {
        return !isCorrectWord(input, transcript[index]) ? index : null;
      })
      .filter((index: number | null) => index !== null);
  
    const newEditableWords: Set<number> = new Set(incorrectIndices);
  
    setEditableWords((prev) => {
      if (JSON.stringify(Array.from(prev)) !== JSON.stringify(Array.from(newEditableWords))) {
        return newEditableWords;
      }
      return prev;
    });
  }, [userAnswer, transcript]); // This could also be optimized if necessary

  const handleWordClick = (index: number) => {
    if (editableWords.has(index)) {
      const newEditableWords = new Set(editableWords);
      newEditableWords.delete(index);
      setEditableWords(newEditableWords);
    } else {
      setEditableWords((prev) => new Set(prev).add(index));
    }
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
      while (prevIndex >= 0 && !editableWords.has(prevIndex)) {
        prevIndex--;
      }
  
      if (prevIndex >= 0) {
        inputRefs.current[prevIndex]?.focus();
      }
    }
  };

  const handleInputChange = (index: number, value: string) => {
    const newCorrectedWords = [...correctedWords];
    newCorrectedWords[index] = value;
    setCorrectedWords(newCorrectedWords);
    
    if (!editedIncorrectWords.has(index)) {
      setEditedIncorrectWords((prev) => new Set(prev).add(index));
    }
  };

  const handleSubmit = async () => {
    try {
      const token = LocalStorage.getItem('token');
      const response = await axios.post(
        `${apiUrl}/api/user/update-progress`,
        {
          userId,
          fileStorageName,
          progress: 70
        },
        {
          headers: { token }
        }
      );

      if (response.status === 200) {
        console.log('Progress updated successfully!');
      } else {
        console.error('Failed to update progress.');
      }
    } catch (error) {
      console.error('Failed to update progress:', error);
    }
  }

  const filteredCorrectWords = correctedWords
    .map((word, index) => {
      return editedIncorrectWords.has(index) ? `${word}*` : word; // Append '*' to edited words
    })
    .filter((word, index) => index < transcript.length || word.trim() !== "");

  return (
    <div className="flex flex-row p-20 h-screen">
      <div className="flex flex-col w-[50%] h-full center items-center justify-center">
        <div className="w-full h-full p-4 text-lg border border-gray-300 rounded overflow-auto">
          <pre
            className="p-2 text-black"
            style={{ whiteSpace: "pre-wrap", wordWrap: "break-word", overflowWrap: "break-word" }}
          >
            {transcript.map((word, index) => {
              const isEditable = editableWords.has(index);
              const isEdited = editedIncorrectWords.has(index);
              const isCorrect = isCorrectWord(correctedWords[index], transcript[index]);
              const isInitiallyIncorrect = !isCorrectWord(userAnswer[index], transcript[index]);

              return (
                <span
                  key={index}
                  className="bg-gray-100 rounded"
                  style={{
                    display: "inline-block",
                    margin: "5px",
                    color: isEdited ? "red" : isInitiallyIncorrect ? "black" : "black",
                  }}
                >
                  {isEditable ? (
                    <input
                      type="text"
                      className="bg-gray-100 rounded"
                      value={correctedWords[index]}
                      onKeyDown={(e) => handleKeyPress(e, index)}
                      onChange={(e) => handleInputChange(index, e.target.value)}
                      ref = {(el) => {
                        inputRefs.current[index] = el;
                      }} // Store input reference
                      onFocus={(e) => e.target.select()}
                      style={{ width: `${word.length}ch` }}
                      onBlur={() => handleWordClick(index)} // Save and blur input
                    />
                  ) : (
                    <span onClick={() => handleWordClick(index)}>{correctedWords[index]}</span>
                  )}
                </span>
              );
            })}
          </pre>
        </div>
      </div>

      <div className="flex flex-col w-[50%] h-full px-5 center items-center justify-center">
        <div className="flex h-[90%] w-full center items-center justify-center">
          <div className="w-full h-full p-4 text-lg border border-gray-300 rounded overflow-y-scroll">
            <pre className="p-2 m-1 text-black" style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
              {transcript.join(" ")}
            </pre>
          </div>
        </div>

        <div className="flex h-[10%] w-full center items-center justify-center">
          <Link
            href={{
              pathname: "/reading",
              query: { correctedAnswers: JSON.stringify(filteredCorrectWords), fileStorageName, userId},
            }}
            onClick={handleSubmit}
            className={`flex w-[170px] h-[50px] p-2 center items-center justify-center rounded-lg ${isAllCorrected ? 'bg-purple-middle' : 'bg-gray-400'} text-white`}
            style={{ pointerEvents: isAllCorrected ? 'auto' : 'none' }} // Disable click when not all corrected
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
