'use client';
import { useState, useEffect } from 'react';
import { useAuth } from './AuthProvider';

export default function VoiceInterface() {
  const { user } = useAuth();
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks: Blob[] = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        setIsProcessing(true);
        try {
          const response = await fetch('/api/voice/query', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              audio_url: audioUrl,
              user_id: user?.uid
            })
          });
          
          const data = await response.json();
          setTranscript(data.transcript);
          setResponse(data.response);
        } catch (error) {
          console.error('Error processing audio:', error);
        }
        setIsProcessing(false);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  return (
    <div className="p-6 bg-gray-800 rounded-lg">
      <div className="flex flex-col items-center space-y-4">
        <button
          onClick={startRecording}
          className={`p-4 rounded-full ${
            isRecording ? 'bg-red-500' : 'bg-blue-500'
          }`}
        >
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </button>
        
        {transcript && (
          <div className="w-full">
            <h3 className="text-lg font-semibold mb-2">Transcript:</h3>
            <p className="bg-gray-700 p-4 rounded">{transcript}</p>
          </div>
        )}
        
        {response && (
          <div className="w-full">
            <h3 className="text-lg font-semibold mb-2">Response:</h3>
            <p className="bg-gray-700 p-4 rounded">{response}</p>
          </div>
        )}
        
        {isProcessing && (
          <div className="animate-pulse">Processing...</div>
        )}
      </div>
    </div>
  );
}
