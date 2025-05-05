'use client';

import React, { useState } from 'react';

const VoiceAgent: React.FC = () => {
  const [transcript, setTranscript] = useState<string>('');  // State to hold the transcript text
  const [isRecording, setIsRecording] = useState<boolean>(false);  // State to track recording status
  const [agentTranscript, setAgentTranscript] = useState<string>('');
  const startRecording = async (): Promise<void> => {
    if (!navigator.mediaDevices || !(window.SpeechRecognition || window.webkitSpeechRecognition)) {
      setTranscript('Your browser does not support speech recognition.');
      return;
    }
  
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.interimResults = true;
  
    recognition.onstart = () => {
      setIsRecording(true);
      setTranscript('Listening...');
    };
  
    recognition.onresult = async (event: SpeechRecognitionEvent): Promise<void> => {
      let currentTranscript = '';
  
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
  
        if (result.isFinal) {
          currentTranscript = result[0].transcript;
          setTranscript(currentTranscript);
  
          // Send to /transcribe-real (optional if you want to log/preview it)
          await sendAudioToBackend(currentTranscript);
  
          // Send final transcript to agent backend
          const response = await fetch('http://localhost:5000/agent-response', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ transcript: currentTranscript }),
          });
  
          const data = await response.json();
          const agentResponse = data.response;
          speakResponse(agentResponse);
          setAgentTranscript(agentResponse); 
        } else {
          currentTranscript += result[0].transcript;
          setTranscript(currentTranscript); // Update live transcript
        }
      }
    };
  
    recognition.onerror = () => {
      setTranscript('Error occurred while listening.');
    };
  
    recognition.onend = () => {
      setIsRecording(false);
    };
  
    recognition.start();
  };
  
  // Optional helper function for debugging or logging
  const sendAudioToBackend = async (audioTranscript: string): Promise<void> => {
    try {
      const response = await fetch('http://localhost:5000/transcribe-real', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ audioTranscript }),
      });
      const data = await response.json();
      setTranscript(`Transcribed Text: ${data.transcript}`);
    } catch (error) {
      setTranscript('Error sending audio to server.');
    }
  };
  
// Function to use SpeechSynthesis API to speak the agent's response
const speakResponse = (responseText: string): void => {
  const utterance = new SpeechSynthesisUtterance(responseText);
  utterance.pitch = 1; // You can adjust the pitch and rate here
  utterance.rate = 1;
  window.speechSynthesis.speak(utterance);
};

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-12">Voice Travel Assistant</h1>
      
      <div className="text-center mb-8">
        <button 
          onClick={startRecording} 
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
          disabled={isRecording}
        >
          {isRecording ? 'Recording...' : 'Start Talking'}
        </button>
      </div>

      <p id="response" className="text-center">{transcript}</p>
      <p id="response" className="text-center">{agentTranscript}</p>
    </div>
  );
};

export default VoiceAgent;
