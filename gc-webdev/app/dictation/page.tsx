"use client";

import React, { Suspense } from 'react';
import Dictation_textbox from '../component/Dictation_textbox';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

const DictationPageContent = () => {
  const searchParams = useSearchParams();
  const title = searchParams.get('title') ?? 'Default';
  const url = searchParams.get('url') ?? '';
  const thumbnail = searchParams.get('thumbnail') ?? 'Default';
  const key = searchParams.get('key') ?? '';
  const fileStorageName = searchParams.get('fileStorageName') ?? '';

  // Construct URLs
  const embedUrl = `https://www.youtube.com/embed/${key}`;
  const audioUrl = `http://localhost:4000/audioFiles/${fileStorageName}`;

  console.log("fileStorageName:", fileStorageName)
  console.log("audioURL:", audioUrl)

  // Determine the type of content to render
  const isYouTubeVideo = key && key !== 'Default';
  const isAudioFile = fileStorageName && fileStorageName !== '';

  return (
    <>
      <div className='flex flex-row p-20 h-screen'>
        <Dictation_textbox />
        <div className='flex flex-col w-[40%] h-full px-5 center items-center justify-center'>
          {isYouTubeVideo ? (
            <iframe
              width="300"
              height="315"
              src={embedUrl}
              title={title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          ) : isAudioFile ? (
            <audio controls src={audioUrl} className='w-full max-w-lg'>
              Your browser does not support the audio element.
            </audio>
          ) : (
            <p>No content available</p>
          )}
          <Link
            href={{
              pathname: "/correction",
              query: { url }
            }}
            className='flex mt-10 w-[170px] h-[50px] p-2 center items-center justify-center rounded-lg bg-purple-middle text-white'
          >
            <p>제출하기</p> {/*submit*/}
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