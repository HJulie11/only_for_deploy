"use client";

import React, { useEffect, useState, Suspense } from 'react';
import Dictation_textbox from '../component/Dictation_textbox';
import { useSearchParams } from 'next/navigation';

const CorrectionPageContent = () => {
  const searchParams = useSearchParams();
  const url = searchParams.get('url') ?? '';
  const [transcript, setTranscript] = useState('');

  useEffect(() => {
    const getTranscript = async () => {
      if (url) {
        try {
          const response = await fetch(`http://localhost:4000/api/transcript?url=${encodeURIComponent(url)}`);
          if (response.ok) {
            const data = await response.json();
            setTranscript(data.transcript);
          } else {
            console.error('Error fetching transcript:', response.statusText);
          }
        } catch (error) {
          console.error('Error fetching transcript:', error);
        }
      }
    };

    getTranscript();
  }, [url]);

  return (
    <div className='flex flex-row p-20 h-screen'>
      <div className='flex w-[50%] h-full center items-center justify-center'>
        <Dictation_textbox />
      </div>
      <div className='flex flex-col w-[50%] h-full px-5 center items-center justify-center'>
        <div className='p-[5px] flex h-[80%] w-full center items-center justify-center'>
        <Dictation_textbox value={transcript.replace(/&amp;#39;/g, '\'')} readOnly/>
        </div>
        <div className='flex h-[20%] w-full center items-center justify-center'>
          <a href="/reading" className='flex w-[170px] h-[50px] p-2 center items-center justify-center rounded-lg bg-purple-middle text-white'>
            <p>제출하기</p> {/* submit */}
          </a>
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