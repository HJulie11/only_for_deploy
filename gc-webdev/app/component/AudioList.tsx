"use client";
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AudioCard from './AudioCard';
import { storeContext } from '../context/storeContext';

interface AudioFile {
  fileDisplayName: string;
  fileStorageName: string;
  progress?: number;
}

const AudioList: React.FC = () => {
  const [audioFiles, setAudioFiles] = useState<AudioFile[]>([]);
  const { url } = useContext(storeContext);

  useEffect(() => {
    const fetchAudioFiles = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('Token is missing');
          return;
        }

        const response = await axios.get(`${url}/api/user/audio-files`, {
          headers: {
            'token': token,
          },
        });

        const files = response.data.audioFiles;

        const filesWithProgress = await Promise.all(
          files.map(async (file: AudioFile) => {
            try {
              const progressResponse = await axios.get(`${url}/api/user/audio-files`, {
                headers: {
                  'token': token,
                },
                params: {
                  fileStorageName: file.fileStorageName,
                },
              });
              return { ...file, progress: progressResponse.data.progress };
            } catch (progressError) {
              console.error(`Error fetching progress for ${file.fileStorageName}:`, progressError);
              return file; //return the file without progress if an error occurs
            }
          })
        );

        console.log(response)

        setAudioFiles(response.data.audioFiles);
      } catch (error) {
        console.error('Error fetching audio files:', error);
      }
    };

    fetchAudioFiles();
  }, []);

  if (!audioFiles || audioFiles.length === 0) {
    return <div></div>;
  }

  return (
    <div>
      {audioFiles.map((file, index) => (
        <AudioCard key={index} fileDisplayName={file.fileDisplayName} fileStorageName={file.fileStorageName} progress={file.progress}/>
      ))}
    </div>
  );
};

export default AudioList;