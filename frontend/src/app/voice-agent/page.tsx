'use client';

import React, { useState } from 'react';

const VoiceAgent: React.FC = () => {
  const [transcript, setTranscript] = useState<string>('');  // State to hold the transcript text
  const [isRecording, setIsRecording] = useState<boolean>(false);  // State to track recording status
  const [agentReply, setAgentReply] = useState<string>('');
const [finalTranscript, setFinalTranscript] = useState('');
// Declare this at the top of your component
let recognition: any;

const startRecording = async (): Promise<void> => {
  if (!navigator.mediaDevices) {
    setTranscript('Your browser does not support speech recognition.');
    return;
  }

  const SpeechRecognition =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    setTranscript('Your browser does not support speech recognition.');
    return;
  }

  recognition = new SpeechRecognition(); // Use the outer scoped variable
  recognition.lang = 'en-US';
  recognition.interimResults = true;

  recognition.onstart = () => {
    setIsRecording(true);
    setTranscript('Listening...');
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
      setTranscript(interimTranscript);
    }

    if (finalResult) {
      setFinalTranscript(finalResult);
      setTranscript('');
      setIsRecording(false);
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

//   const startRecording = async (): Promise<void> => {
//     if (!navigator.mediaDevices) {
//       setTranscript('Your browser does not support speech recognition.');
//       return;
//     }
  
//     const SpeechRecognition =
//       (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  
//     if (!SpeechRecognition) {
//       setTranscript('Your browser does not support speech recognition.');
//       return;
//     }
  
//     const recognition = new SpeechRecognition();
//     recognition.lang = 'en-US';
//     recognition.interimResults = true;
  
//     recognition.onstart = () => {
//       setIsRecording(true);
//       setTranscript('Listening...');
//     };
//     recognition.onresult = (event:  any): void => {
//         let interimTranscript = '';
//         let finalResult = '';
      
//         for (let i = event.resultIndex; i < event.results.length; i++) {
//           const result = event.results[i];
      
//           if (result.isFinal) {
//             finalResult += result[0].transcript;
//           } else {
//             interimTranscript += result[0].transcript;
//           }
//         }
      
//         if (interimTranscript) {
//           setTranscript(interimTranscript); // Show live partial text
//         }
      
//         if (finalResult) {
//           setFinalTranscript(finalResult); // Store for user review
//           setTranscript(''); // Clear interim display
//           setIsRecording(false); // Stop recording UI/indicator
//         }
//       };
      
  
//     // recognition.onresult = async (event: SpeechRecognitionEvent): Promise<void> => {
//     //     let interimTranscript = '';
//     //     let finalTranscript = '';
      
//     //     for (let i = event.resultIndex; i < event.results.length; i++) {
//     //       const result = event.results[i];
      
//     //       if (result.isFinal) {
//     //         finalTranscript += result[0].transcript;
//     //       } else {
//     //         interimTranscript += result[0].transcript;
//     //       }
//     //     }
      
//     //     if (interimTranscript) {
//     //       setTranscript(interimTranscript); // live preview
//     //     }
      
//     //     if (finalTranscript) {
//     //       setTranscript(`You said: ${finalTranscript}`);
//     //       await sendAudioToBackend(finalTranscript);
      
//     //       try {
//     //         const response = await fetch('http://localhost:5000/agent-response', {
//     //           method: 'POST',
//     //           headers: { 'Content-Type': 'application/json' },
//     //           body: JSON.stringify({ transcript: finalTranscript }),
//     //         });
      
//     //         const data = await response.json();
//     //         const agentResponse = data.response;
      
//     //         setAgentReply(agentResponse);
//     //         speakResponse(agentResponse);
//     //       } catch (err) {
//     //         setAgentReply('Sorry, there was an error processing your request.');
//     //       }
//     //     }
//     //   };
      
  
//     recognition.onerror = () => {
//       setTranscript('Error occurred while listening.');
//     };
  
//     recognition.onend = () => {
//       setIsRecording(false);
//     };
  
//     recognition.start();
//   };
  
  
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

const handleSendTranscript = async () => {
    try {
      await sendAudioToBackend(finalTranscript);
  
      const response = await fetch('https://zenjourney-1.onrender.com/agent-response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript: finalTranscript }),
      });
  
      const data = await response.json();
      setTranscript(`You said: ${finalTranscript}`);
      setAgentReply(data.response);
      speakResponse(data.response);
    } catch (err) {
      setAgentReply('Sorry, there was an error processing your request.');
    }
  };

  const handleRedo = () => {
    setTranscript('');
    setFinalTranscript('');
    setAgentReply('');
    setIsRecording(true);
    recognition.start(); // restart recording
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
  
      {/* Live interim transcript while speaking */}
      {isRecording && transcript && (
        <div className="text-center mb-4">
          <h3 className="font-semibold text-lg mb-2">Listening...</h3>
          <p className="italic text-gray-600">{transcript}</p>
        </div>
      )}
  
      {/* Final transcript and review section */}
      {!isRecording && finalTranscript && (
        <div className="mb-6">
          <h3 className="font-semibold text-lg mb-2">Transcribed Text (editable)</h3>
          <textarea
            className="w-full border rounded-md p-3 text-gray-800"
            rows={4}
            value={finalTranscript}
            onChange={(e) => setFinalTranscript(e.target.value)}
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
  
      {/* Assistant reply */}
      {agentReply && (
        <div className="mt-8">
          <h3 className="font-semibold text-lg mb-2">Assistant Response</h3>
          <p className="bg-gray-100 p-4 rounded-md text-gray-800">{agentReply}</p>
        </div>
      )}
    </div>
  );
  
};

export default VoiceAgent;
