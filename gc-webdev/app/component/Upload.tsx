import React, { useRef } from 'react';
import Image from 'next/image';
import dragDrop from '@/public/drag and drop.svg';

interface UploadProps {
  onUpload: (files: File[]) => void;
}

const Upload: React.FC<UploadProps> = ({ onUpload }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    onUpload(files);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      onUpload(files);
    }
  };

  return (
    <div
      className='flex flex-col center items-center justify-center border-dashed border-2 border-purple-heavy bg-purple-light bg-opacity-[0.8] w-[75%] h-[136px] rounded-[10px] mt-10 mb-5'
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      <input
        type='file'
        accept='audio/*'
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
        multiple
      />
      <Image src={dragDrop} alt='dragDrop' />
      {/* <p className='text-[23px] font-light mt-[10px]'>🎧 원하는 음원 업로드하기</p> */}
      <button
        className='mt-3'
        onClick={() => fileInputRef.current?.click()}
      >
        <p className='text-[23px] font-light mt-[10px]'>🎧 원하는 음원 업로드하기</p>
      </button>
    </div>
  );
};

export default Upload;