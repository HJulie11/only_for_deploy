import React, { useState, useContext } from 'react'
import { storeContext } from '../context/storeContext'
import axios from 'axios'
import LocalStorage from '@/constants/localstorage';

interface TranscriptPopupProps {
    onClose: () => void;
    onSave: (transcript: string) => void;
}

const TranscriptPopup: React.FC<TranscriptPopupProps> = ({ onClose, onSave }) => {
    const [ transcript, setTranscript ] = useState('');
    const [ isModalOpen, setIsModalOpen ] = useState(false);
    const { token, url } = useContext(storeContext);

    const handleSave = () => {
        onSave(transcript);
        onClose();
    }

    // const handleTranscriptSubmit = async () => {
    //     try {
    //         const token = LocalStorage.getItem('token');
    //         if (!token) {
    //             console.error('Token is missing');
    //             return;
    //         }

    //         const response = await axios.post(`${url}/api/user/upload-transcript`, {
    //             // userId,
    //             fileStorageName,
    //             transcript,
    //         });

    //         if (response.status === 200) {
    //             console.log('Transcript uploaded successfully:', response.data.message);
    //             onClose();
    //         } else {
    //             console.error('Failed to upload transcript:', response.data.message);
    //         }
    //     } catch (error) {
    //         console.error('Error uploading transcript:', error);
    //     }
    // }

    // const handleTranscriptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     if (e.target.value){
    //         onUpload(e.target.value)
    //     }
    // }

    // const handleUpload = async () => {
    //     // Send transcript to the server
    //     const response = await fetch('/api/user/upload-transcript', {
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/json',
    //       },
    //       body: JSON.stringify({ audioId: audio.id, transcript }),
    //     });
    
    //     if (response.ok) {
    //       closeModal(); // Close the modal on success
    //     } else {
    //       console.error('Failed to upload transcript');
    //     }
    // };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded-md shadow-md w-[60%] h-[85%]">
            <h2 className="text-xl font-semibold mb-4 text-purple-heavy">Edit Transcript</h2>
            <textarea
                name="transcript"
                // value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                placeholder="Enter new transcript"
                className="w-full h-[85%] p-2 border border-gray-300 rounded"
            />
            
            <div className="flex justify-end mt-4">
            <button className="mr-2 px-4 py-2 bg-gray-300 rounded-lg" onClick={onClose}>
                Cancel
            </button>
            <button className="px-4 py-2 bg-purple-heavy text-white rounded-lg" onClick={handleSave}>
                Save Transcript
            </button>
            </div>
        </div>
        </div>
    )
}

export default TranscriptPopup