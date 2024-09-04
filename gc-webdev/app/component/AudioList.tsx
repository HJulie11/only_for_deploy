import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AudioCard from './AudioCard';
import { storeContext } from '../context/storeContext';

interface AudioFile {
  fileDisplayName: string;
  fileStorageName: string;
}

const AudioList: React.FC = () => {
  const [audioFiles, setAudioFiles] = useState<AudioFile[]>([]);
  const [userId, setUserId] = useState<string | null>(null);  // Add state for userId
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
        <AudioCard key={index} fileDisplayName={file.fileDisplayName} fileStorageName={file.fileStorageName}/>
      ))}
    </div>
  );
};

export default AudioList;