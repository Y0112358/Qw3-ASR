import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Settings, Menu } from 'lucide-react';

export const PrototypeView: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState<string>("");
  const [partial, setPartial] = useState<string>("");
  const intervalRef = useRef<number | null>(null);

  const demoPhrases = [
    "Testing the Qwen model...",
    "Running locally on Android...",
    "Traditional Chinese support is enabled...",
    "Privacy is preserved...",
    "No server upload required."
  ];

  const startDemo = () => {
    setIsRecording(true);
    let phraseIndex = 0;
    
    intervalRef.current = window.setInterval(() => {
      const phrase = demoPhrases[phraseIndex % demoPhrases.length];
      setPartial(phrase);
      
      // Simulate "finalizing" a sentence every 2 seconds
      setTimeout(() => {
        setTranscript(prev => prev + phrase + " ");
        setPartial("");
        phraseIndex++;
      }, 1500);

    }, 2000);
  };

  const stopDemo = () => {
    setIsRecording(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setPartial("");
  };

  return (
    <div className="max-w-4xl mx-auto p-6 flex flex-col items-center">
      <h2 className="text-2xl font-bold text-white mb-6">Mobile UI Prototype</h2>
      
      {/* Phone Frame */}
      <div className="relative w-[320px] h-[640px] bg-black rounded-[3rem] border-4 border-slate-700 shadow-2xl overflow-hidden flex flex-col">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-black rounded-b-xl z-20"></div>
        
        {/* Status Bar */}
        <div className="h-8 bg-slate-900 w-full flex items-center justify-between px-6 text-[10px] text-white z-10">
          <span>9:41</span>
          <div className="flex gap-1">
            <div className="w-3 h-3 bg-white rounded-full opacity-20"></div>
            <div className="w-3 h-3 bg-white rounded-full"></div>
          </div>
        </div>

        {/* App Header */}
        <div className="bg-indigo-600 p-4 flex justify-between items-center shadow-md z-10">
            <Menu className="w-5 h-5 text-white" />
            <h1 className="font-bold text-white tracking-wide">Qwen3 Note</h1>
            <Settings className="w-5 h-5 text-white" />
        </div>

        {/* Content Area */}
        <div className="flex-grow bg-slate-50 p-4 overflow-y-auto">
            {transcript ? (
                <p className="text-slate-800 text-lg leading-relaxed font-serif">
                    {transcript}
                    <span className="text-indigo-600 font-medium">{partial}</span>
                    {isRecording && <span className="inline-block w-2 h-4 bg-indigo-500 ml-1 animate-pulse"></span>}
                </p>
            ) : (
                <div className="h-full flex items-center justify-center text-slate-400 text-center">
                    <p>Tap microphone to start <br/> local transcription</p>
                </div>
            )}
        </div>

        {/* Control Bar */}
        <div className="h-24 bg-white border-t border-slate-200 flex items-center justify-center relative">
            <button 
                onClick={isRecording ? stopDemo : startDemo}
                className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
                    isRecording 
                    ? 'bg-red-500 scale-110 shadow-red-500/30' 
                    : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/30'
                }`}
            >
                {isRecording ? <MicOff className="w-8 h-8 text-white" /> : <Mic className="w-8 h-8 text-white" />}
            </button>
            <div className="absolute bottom-2 text-[10px] text-slate-400 font-mono">
                Model: Qwen3-0.6B (Int8)
            </div>
        </div>
      </div>

      <p className="mt-8 text-slate-500 text-sm max-w-md text-center">
        This is a visual simulation of the final Android application interface. 
        The logic runs completely on-device using the script generated in the "Script Generator" tab.
      </p>
    </div>
  );
};