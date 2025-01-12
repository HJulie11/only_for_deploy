"use client"
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Upload from '../component/Upload';
import AudioList from '../component/AudioList';
import MainLayout from '../component/MainLayout';
import { storeContext } from '../context/storeContext';

const Page = () => {
  const { url } = useContext(storeContext);
  
  const handleUpload = async (files: File[]) => {
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('audioFile', file);
      });

      const token = localStorage.getItem('token');
      console.log('Token:', token);
      if (!token) {
        console.error('Token is missing');
        return;
      }

      const response = await axios.post(`${url}/api/user/upload-audio`, formData, {
        headers: {
          'token': token,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data && response.data.success) {
        console.log('Files uploaded successfully:', response.data.message);
      } else {
        console.error('Failed to upload files:', response.data.message);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error uploading files:', error.message, error.response);
      } else {
        console.error('Error uploading files:', error);
      }
    }
    // window.location.reload();
  };

  return (
    <MainLayout>
      <div className='flex center items-center justify-center mt-10 mb-5'>
        <div className='text-[30px] font-semi-bold text-purple-heavy'>나의 오디오</div>
      </div>
      <div className='flex center items-center justify-center'>
        <Upload onUpload={handleUpload} />
      </div>
      <AudioList />
    </MainLayout>
  );
};

export default Page;