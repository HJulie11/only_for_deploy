"use client";

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

const ReadingPageContent: React.FC = () => {
  const searchParams = useSearchParams();
  
  // Get corrected answers from the search parameters
  const correctedAnswers = searchParams.get("correctedAnswers") || "[]";
  const correctedWords = JSON.parse(correctedAnswers);

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
      <div className='h-full p-4 border border-gray-300 rounded overflow-auto'>
        <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
          {correctedWords.map((word: string, index: number) => (
            <span key={index} style={{ color: word.endsWith('*') ? 'red' : 'black' }}>
              {word.replace('*', '')} {/* Remove '*' when displaying */}
            </span>
          ))}
        </pre>
      </div>

      {/* <div className='flex h-[10%] w-full center items-center justify-center'>
        <button className='flex w-[170px] h-[50px] p-2 center items-center justify-center rounded-lg bg-purple-middle text-white'>
          <p>제출하기</p>
        </button>
      </div> */}
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
