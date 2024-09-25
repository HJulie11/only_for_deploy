// reading/page.tsx
"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

const ReadingPageContent: React.FC = () => {
  const searchParams = useSearchParams();
  const userAnswer = searchParams.get("userAnswer") ?? "";
  const correctedWords = searchParams.get("correctedWords") ?? "";

  // Parse correctedWords from JSON
  const correctedWordsObj = correctedWords ? JSON.parse(correctedWords) : {};

  const renderUserAnswer = () => {
    const userWordsArray = userAnswer.trim().split(/(?<=[^\s])(?=\W)|\s+/).filter(Boolean);

    return userWordsArray.map((word, index) => {
      const editedWord = correctedWordsObj[index]; // Get the edited word
      
      // Show the edited word if it exists, otherwise show the original
      const displayWord = editedWord !== undefined ? editedWord : word;

      const shouldNotWrap = ['.', ')'].includes(word); // Replace with your specific words

      return (
        <span
          key={index}
          className={`${editedWord !== undefined ? "text-red-500" : "text-black"} ${shouldNotWrap ? 'no-wrap' : ''}`}
        >
          {displayWord}
        </span>
      );
    });
  };

  return (
    <div className='flex flex-col p-20 h-screen'>
      <div className='flex flex-row w-full py-3'>
        <div className='flex h-full w-full center items-center'>
          <button className='flex w-[170px] h-[50px] p-2 center items-center justify-center rounded-lg bg-purple-middle text-white'>
            <p>제출하기</p>
          </button>
        </div>

        <div className='flex flex-col w-[45%] h-full mr-0'>
          <div className='flex flex-row py-3 px-5 center items-center justify-center' style={{
            borderRadius: '10px',
            border: '1px solid rgba(0, 0, 0, 0.2)',
            backgroundColor: 'rgba(255, 255, 255, 0.5)'
          }}>
            <p>횟수 check</p>
            <input type='checkbox' className='ml-10' />
            <input type='checkbox' className='ml-10' />
            <input type='checkbox' className='ml-10' />
            <input type='checkbox' className='ml-10' />
            <input type='checkbox' className='ml-10' />
          </div>
        </div>
      </div>
      <div className='h-full p-4'>
        <div className='w-full h-full border border-gray-300 rounded overflow-wrap-auto overflow-y-scroll'>
          <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
            {renderUserAnswer()}
          </pre>
        </div>
      </div>
    </div>
  );
};

const ReadingPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ReadingPageContent />
    </Suspense>
  );
};

export default ReadingPage;
