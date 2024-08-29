// "use client";

// import React from 'react';
// import { useRouter } from 'next/navigation';
// import Dictation_textbox from '../component/Dictation_textbox';
// import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

// const ReadingPage = () => {
//   const router = useRouter() as AppRouterInstance & { query: Record<string, string | string[]> };
//   const { url, userAnswer, correctedWords } = router.query;
//   const correctedWordsMap = correctedWords ? JSON.parse(correctedWords as string) : {}; // Parse corrected words

//   const renderUserAnswer = () => {
//     const userAnswerWords = (userAnswer as string).split(' ');
//     const transcriptWords = (url as string).split(' '); // Assuming you want to use `url` as transcript for now

//     return transcriptWords.map((word, index) => {
//       const isCorrected = correctedWordsMap[index];

//       return (
//         <span key={index} className={`mr-2 ${isCorrected ? 'text-red-500' : 'text-black'}`}>
//           {userAnswerWords[index] || word}
//         </span>
//       );
//     });
//   };

//   return (
//     <div className='flex flex-col p-20 h-screen'>
//       <div className='flex flex-row w-full py-3'>
//         <div className='flex h-full w-full center items-center '>
//           <button className='flex w-[170px] h-[50px] p-2 center items-center justify-center rounded-lg bg-purple-middle text-white'>
//             <p>제출하기</p>
//           </button>
//         </div>
//         <div className='flex flex-col w-[45%] h-full mr-0'>
//           <div className='flex flex-row py-3 px-5 center items-center justify-center' style={{
//             borderRadius: '10px',
//             border: '1px solid rgba(0, 0, 0, 0.2)',
//             backgroundColor: 'rgba(255, 255, 255, 0.5)'
//           }}>
//             <p>횟수 check</p>
//             <input type='checkbox' className='ml-10' />
//             <input type='checkbox' className='ml-10' />
//             <input type='checkbox' className='ml-10' />
//             <input type='checkbox' className='ml-10' />
//             <input type='checkbox' className='ml-10' />
//           </div>
//         </div>
//       </div>
//       <div className='flex flex-col p-4'>
//         <Dictation_textbox value={renderUserAnswer().join('')} readOnly />
//       </div>
//     </div>
//   );
// };

// ReadingPage.getLayout = function getLayout(page: React.ReactNode) {
//   return page;
// };

// export default ReadingPage;

"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

const ReadingPageContent = () => {
  const searchParams = useSearchParams();
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [correctedWords, setCorrectedWords] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    const userAnswerParam = searchParams.get('userAnswer') ?? '';
    const correctedWordsParam = searchParams.get('correctedWords') ?? '{}';

    setUserAnswer(userAnswerParam);
    setCorrectedWords(JSON.parse(correctedWordsParam));
  }, [searchParams]);

  const renderUserAnswer = () => {
    const userAnswerWords = userAnswer.split(' ');

    return userAnswerWords.map((word, index) => {
      const isCorrected = correctedWords[index];
      return (
        <span
          key={index}
          className={isCorrected ? 'text-red-500' : 'text-black'}
          style={{ marginRight: '5px' }}
        >
          {word}
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
      <div className='flex flex-col p-4'>
        <div className='w-full h-full border border-gray-300 rounded overflow-wrap-auto overflow-y-auto'>
          {renderUserAnswer()}
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

ReadingPage.getLayout = function getLayout(page: React.ReactNode) {
  return page;
};

export default ReadingPage;
