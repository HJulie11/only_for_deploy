"use client";

import React, { Suspense, use, useContext, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { storeContext } from '../context/storeContext';
import LocalStorage from '@/constants/localstorage';
import axios from 'axios';
import Link from 'next/link';

const ReadingPageContent: React.FC = () => {
  const searchParams = useSearchParams();
  
  // Get corrected answers from the search parameters
  const correctedAnswers = searchParams.get("correctedAnswers") || "[]";
  const { url: apiUrl } = useContext(storeContext);
  const fileStorageName = searchParams.get("fileStorageName") ?? '';
  const userId = searchParams.get("userId") || '';

  const correctedWords = JSON.parse(correctedAnswers);

  // Track the state of the checkboxes
  const [checkboxes, setCheckboxes] = useState([false, false, false, false, false]);

  const handleCheckboxChange = (index: number) => {
    const updateCheckboxes = [...checkboxes];
    updateCheckboxes[index] = !updateCheckboxes[index];
    setCheckboxes(updateCheckboxes);
  };

  const allChecked = checkboxes.every(checked => checked);

  const handleSubmit = async () => {
    console.log("Submitting progress update...");
    console.log("User ID:", userId);
    console.log("File Storage Name:", fileStorageName);
    console.log("Progress:", 100);
    try {
      const token = LocalStorage.getItem("token");
      const response = await axios.post(
        `${apiUrl}/api/user/update-progress`,
        {
          userId,
          fileStorageName,
          progress: 100,
        },
        {
          headers: { token }
        }
      );

      if (response.status === 200) {
        console.log('Successfully updated progress');
      } else {
        console.log('Failed to update progress');
      }
    } catch (error) {
      console.log('Error updating progress:', error);
    }
  }

  return (
    <div className='flex flex-col p-20 h-screen'>
      <div className='flex flex-row w-full py-3'>
        <div className='flex h-full w-full center items-center'>
          <Link  
            href={{
              pathname: "/my_audio",
            }}
            onClick={allChecked ? handleSubmit : undefined} 
            // onClick={handleSubmit}
            // style = {{ pointerEvents: allChecked ? 'auto' : 'none' }}
            className={`flex w-[170px] h-[50px] p-2 center items-center justify-center rounded-lg text-white ${allChecked ? 'bg-purple-middle' : 'bg-gray-400 cursor-not-allowed'}`}
          >
            <p>제출하기</p>
          </Link>
        </div>

        <div className='flex flex-col w-[45%] h-full mr-0'>
          <div className='flex flex-row py-3 px-5 center items-center justify-center' style={{
            borderRadius: '10px',
            border: '1px solid rgba(0, 0, 0, 0.2)',
            backgroundColor: 'rgba(255, 255, 255, 0.5)'
          }}>
            <p>횟수 check</p>
            {checkboxes.map((checked, index) => (
              <input
                key={index}
                type='checkbox'
                className='ml-10'
                checked={checked}
                onChange={() => handleCheckboxChange(index)}
              />
            ))}
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
