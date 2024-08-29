import React, { useState, useContext } from 'react'
import { storeContext } from '../context/storeContext'
import axios from 'axios'

interface TranscriptPopupProps {
    fileStorageName: string;
    onClose: () => void;
    userId: string;
}

const TranscriptPopup: React.FC<TranscriptPopupProps> = ({ fileStorageName, onClose, userId }) => {
    const [transcript, setTranscript] = useState('');
    const { token, url } = useContext(storeContext);


    const handleTranscriptSubmit = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('Token is missing');
                return;
            }

            const response = await axios.post(`${url}/api/user/upload-transcript`, {
                // userId,
                fileStorageName,
                transcript,
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200) {
                console.log('Transcript uploaded successfully:', response.data.message);
                onClose();
            } else {
                console.error('Failed to upload transcript:', response.data.message);
            }
        } catch (error) {
            console.error('Error uploading transcript:', error);
        }
    }


    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded-md shadow-md w-[60%] h-[60%]">
            <h2 className="text-xl font-semibold mb-4 text-purple-heavy">Edit Transcript</h2>
            <textarea
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                placeholder="Enter new transcript"
                className="w-full h-[90%] p-2 border border-gray-300 rounded"
            />
            <div className="flex justify-end mt-4">
            <button className="mr-2 px-4 py-2 bg-gray-300 rounded-lg" onClick={onClose}>
                Cancel
            </button>
            <button className="px-4 py-2 bg-purple-heavy text-white rounded-lg" onClick={handleTranscriptSubmit}>
                Save Transcript
            </button>
            </div>
        </div>
        </div>
    )
}

export default TranscriptPopup