// /frontend/app/level-selection/page.tsx
"use client";
import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';

const LevelSelectionPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const fileStorageName = searchParams.get('fileStorageName') ?? '';
  const cardType = searchParams.get('cardType') ?? '';
  const url = searchParams.get('url') ?? '';
  const userId = searchParams.get('userId') ?? '';

  const handleLevelSelect = (level: string) => {
    router.push(`/dictation?fileStorageName=${fileStorageName}&cardType=${cardType}&level=${level}&url=${url}&userId=${userId}`);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-2xl font-bold mb-4 text-purple-heavy">단계 선택</h2>
      <button onClick={() => handleLevelSelect('15')} className="btn text-white bg-gray-400 hover:bg-purple-heavy p-3 w-[25%] text-center rounded-full mb-3">1단계 {/*1 Blank per 15 words*/}</button>
      <button onClick={() => handleLevelSelect('10')} className="btn text-white bg-gray-400 hover:bg-purple-heavy p-3 w-[25%] text-center rounded-full mb-3">2단계 {/*1 Blank per 10 words*/}</button>
      <button onClick={() => handleLevelSelect('5')} className="btn text-white bg-gray-400 hover:bg-purple-heavy p-3 w-[25%] text-center rounded-full mb-3">3단계 {/*1 Blank per 5 words*/}</button>
      <button onClick={() => handleLevelSelect('full')} className="btn text-white bg-gray-400 hover:bg-purple-heavy p-3 w-[25%] text-center rounded-full mb-3">4단계 {/* Full blank */}</button>
    </div>
  );
};

export default LevelSelectionPage;
