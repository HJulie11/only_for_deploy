import LocalStorage from '@/constants/localstorage';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { storeContext } from '../context/storeContext';
import TranscriptPopup from './TranscriptPopup';

interface AudioCardProps {
  fileDisplayName: string;
  fileStorageName: string;
}

const AudioCard: React.FC<AudioCardProps> = ({ fileDisplayName, fileStorageName }) => {
  const [progress, setProgress] = useState(0);
  const router = useRouter();
  const { token, url } = useContext(storeContext);
  const [showTranscriptModal, setShowTranscriptModal] = useState(false);

  const handleTranscriptClick = () => {
    setShowTranscriptModal(true);
  }

  console.log(fileDisplayName); // Add this inside AudioCard component to see the file object

  const handleClick = () => {
    // Navigate to DictationPage with fileStorageName as a query parameter
    router.push(`/dictation?fileStorageName=${encodeURIComponent(fileStorageName)}`);
  };


  useEffect(() => {
    const fakeUpload = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(fakeUpload);
          return 100;
        }
        return prev + 10;
      });
    }, 500); // Simulate upload progress every 500ms

    return () => clearInterval(fakeUpload);
  }, []);

  return (
    <div  className='flex center items-center justify-center mb-2'>
      <div className='flex flex-col w-[70%] h-auto bg-white border-[1.5px] border-purple-light rounded-[10px] px-10'>
        <div onClick={handleClick} className='text-[25px] font-bold mt-[28px] cursor-pointer'>{fileDisplayName}</div>
        <div className='w-full mt-[20px]'>
          <div className='relative h-4 rounded-full bg-gray-30'>
            <div className='absolute top-0 left-0 h-4 rounded-full bg-purple-heavy' style={{ width: `${progress}%` }}></div>
          </div>
        </div>
        <div className='text-[20px] font-semi-bold mt-[10px] text-gray-30'>
          {progress < 100 ? 'Uploading...' : 'Upload Complete'}
        </div>

        <div className="mt-4 mb-4">
          <button
            className='bg-gray-20 text-white px-4 py-2 rounded-lg hover:bg-purple-heavy'
            onClick={(e) => {
              e.stopPropagation();
              handleTranscriptClick();
            }}
          >
            Upload Transcript
          </button>
        </div>
      </div>
      {showTranscriptModal && (
        <TranscriptPopup
          fileStorageName={fileStorageName}
          onClose={() => setShowTranscriptModal(false)}
          userId={token}
        />
      )}
    </div>
  );
};

export default AudioCard;