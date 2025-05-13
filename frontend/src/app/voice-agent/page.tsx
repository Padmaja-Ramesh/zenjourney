'use client';

import React, { useState, useEffect } from 'react';

interface VoiceState {
  transcript: string;
  isRecording: boolean;
  agentReply: string;
  finalTranscript: string;
  error: string | null;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8002';

const VoiceAgent: React.FC = () => {
  const [state, setState] = useState<VoiceState>({
    transcript: '',
    isRecording: false,
    agentReply: '',
    finalTranscript: '',
    error: null
  });

  let recognition: any;

  const updateState = (updates: Partial<VoiceState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const startRecording = async (): Promise<void> => {
    if (!navigator.mediaDevices) {
      updateState({ error: 'Your browser does not support speech recognition.' });
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      updateState({ error: 'Your browser does not support speech recognition.' });
      return;
    }

    recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = true;

    recognition.onstart = () => {
      updateState({ isRecording: true, transcript: 'Listening...', error: null });
    };

    recognition.onresult = (event: any): void => {
      let interimTranscript = '';
      let finalResult = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalResult += result[0].transcript;
        } else {
          interimTranscript += result[0].transcript;
        }
      }

      if (interimTranscript) {
        updateState({ transcript: interimTranscript });
      }

      if (finalResult) {
        updateState({
          finalTranscript: finalResult,
          transcript: '',
          isRecording: false
        });
      }
    };

    recognition.onerror = (event: any) => {
      updateState({
        error: `Error occurred while listening: ${event.error}`,
        isRecording: false
      });
    };

    recognition.onend = () => {
      updateState({ isRecording: false });
    };

    try {
      recognition.start();
    } catch (error) {
      updateState({
        error: `Failed to start recording: ${error instanceof Error ? error.message : 'Unknown error'}`,
        isRecording: false
      });
    }
  };

  const sendAudioToBackend = async (audioTranscript: string): Promise<void> => {
    try {
      console.log('Sending transcript to backend:', audioTranscript);
      
      const response = await fetch(`${BACKEND_URL}/transcribe-real`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ audioTranscript }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Backend response:', data);
      updateState({ transcript: `Transcribed Text: ${data.transcript}` });
    } catch (error) {
      console.error('Error sending audio to server:', error);
      updateState({
        error: `Error: ${error instanceof Error ? error.message : 'Failed to connect to server. Please ensure the backend is running.'}`
      });
    }
  };

  const handleSendTranscript = async () => {
    try {
      console.log('Sending final transcript:', state.finalTranscript);
      
      await sendAudioToBackend(state.finalTranscript);

      const response = await fetch(`${BACKEND_URL}/agent-response`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ transcript: state.finalTranscript }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Agent response:', data);
      
      updateState({
        transcript: `You said: ${state.finalTranscript}`,
        agentReply: data.response
      });
      speakResponse(data.response);
    } catch (error) {
      console.error('Error processing request:', error);
      updateState({
        error: `Error processing request: ${error instanceof Error ? error.message : 'Unknown error'}`,
        agentReply: 'Sorry, there was an error processing your request. Please ensure the backend server is running.'
      });
    }
  };

  const handleRedo = () => {
    updateState({
      transcript: '',
      finalTranscript: '',
      agentReply: '',
      error: null
    });
    if (recognition) {
      recognition.start();
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, []);

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

      {state.error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {state.error}
        </div>
      )}

      <div className="text-center mb-8">
        <button 
          onClick={startRecording} 
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
          disabled={state.isRecording}
        >
          {state.isRecording ? 'Recording...' : 'Start Talking'}
        </button>
      </div>

      {state.isRecording && state.transcript && (
        <div className="text-center mb-4">
          <h3 className="font-semibold text-lg mb-2">Listening...</h3>
          <p className="italic text-gray-600">{state.transcript}</p>
        </div>
      )}

      {!state.isRecording && state.finalTranscript && (
        <div className="mb-6">
          <h3 className="font-semibold text-lg mb-2">Transcribed Text (editable)</h3>
          <textarea
            className="w-full border rounded-md p-3 text-gray-800"
            rows={4}
            value={state.finalTranscript}
            onChange={(e) => updateState({ finalTranscript: e.target.value })}
          />
          <div className="flex justify-center space-x-4 mt-4">
            <button
              onClick={handleSendTranscript}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
            >
              Send
            </button>
            <button
              onClick={handleRedo}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded"
            >
              Redo
            </button>
          </div>
        </div>
      )}

      {state.agentReply && (
        <div className="mt-8">
          <h3 className="font-semibold text-lg mb-2">Assistant Response</h3>
          <p className="bg-gray-100 p-4 rounded-md text-gray-800">{state.agentReply}</p>
        </div>
      )}
    </div>
  );
};

export default VoiceAgent;
