import React, { useState, useMemo } from 'react';
import { Settings, Download, AlertTriangle } from 'lucide-react';
import { CodeBlock } from '../components/CodeBlock';
import { ScriptConfig } from '../types';

export const GeneratorView: React.FC = () => {
  const [config, setConfig] = useState<ScriptConfig>({
    mode: 'file',
    useGpu: false,
    modelSize: '0.6B',
    language: 'zho',
  });

  const generatedScript = useMemo(() => {
    const isRealTime = config.mode === 'realtime';
    
    return `import torch
import sys
import os
${isRealTime ? 'import queue\nimport sounddevice as sd\nimport numpy as np' : 'import librosa'}
from transformers import AutoModelForSpeechSeq2Seq, AutoProcessor, pipeline

# --- Configuration ---
MODEL_ID = "Qwen/Qwen3-ASR-${config.modelSize}"
DEVICE = "${config.useGpu ? 'cuda' : 'cpu'}" # Using ${config.useGpu ? 'GPU' : 'CPU'}
TORCH_DTYPE = ${config.useGpu ? 'torch.float16' : 'torch.float32'}
LANGUAGE = "${config.language === 'zho' ? 'chinese' : 'auto'}"

def initialize_model():
    print(f"Loading {MODEL_ID} on {DEVICE}...")
    
    try:
        model = AutoModelForSpeechSeq2Seq.from_pretrained(
            MODEL_ID, 
            torch_dtype=TORCH_DTYPE, 
            low_cpu_mem_usage=True, 
            use_safetensors=True
        )
        model.to(DEVICE)
    except Exception as e:
        print(f"Error loading model: {e}")
        sys.exit(1)

    processor = AutoProcessor.from_pretrained(MODEL_ID)

    # Initialize the pipeline
    pipe = pipeline(
        "automatic-speech-recognition",
        model=model,
        tokenizer=processor.tokenizer,
        feature_extractor=processor.feature_extractor,
        max_new_tokens=128,
        chunk_length_s=30,
        batch_size=1,
        torch_dtype=TORCH_DTYPE,
        device=DEVICE,
    )
    
    print("Model loaded successfully!")
    return pipe

${isRealTime ? `
# --- Real-time Streaming Logic (Basic Implementation) ---
def record_audio(duration=5, fs=16000):
    print(f"Recording for {duration} seconds...")
    recording = sd.rec(int(duration * fs), samplerate=fs, channels=1, dtype='float32')
    sd.wait()
    return recording.flatten()

def run_realtime(pipe):
    print("Starting Real-time Loop (Press Ctrl+C to stop)")
    print("Note: In Termux, direct microphone access via Python can be tricky.")
    print("Ensure Termux-API is installed or use file-based watching.")
    
    try:
        while True:
            # Capturing simple chunks for demo
            audio_data = record_audio(duration=5)
            
            # Transcribe
            result = pipe(audio_data, generate_kwargs={"language": LANGUAGE})
            
            os.system('clear') # Clear terminal for 'streaming' effect
            print("--- Transcript ---")
            print(result["text"])
            
    except KeyboardInterrupt:
        print("\\nStopping...")
` : `
# --- File-based Logic ---
def transcribe_file(pipe, filepath):
    if not os.path.exists(filepath):
        print(f"File not found: {filepath}")
        return

    print(f"Transcribing {filepath}...")
    
    # Transcribe
    result = pipe(
        filepath, 
        generate_kwargs={"language": LANGUAGE, "task": "transcribe"}
    )
    
    print("\\n--- Result ---")
    print(result["text"])
`}

if __name__ == "__main__":
    asr_pipe = initialize_model()
    
    ${isRealTime 
      ? 'run_realtime(asr_pipe)' 
      : 'transcribe_file(asr_pipe, "input_audio.wav") # Replace with your file path'
    }
`;
  }, [config]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Python Script Generator</h2>
        <p className="text-slate-400">
          Configure your deployment parameters below to generate a tailored Python script for Termux/Proot.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Controls */}
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
            <div className="flex items-center gap-2 mb-6">
              <Settings className="w-5 h-5 text-indigo-400" />
              <h3 className="text-lg font-semibold text-white">Configuration</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Mode</label>
                <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1 rounded-lg">
                  <button
                    onClick={() => setConfig({ ...config, mode: 'file' })}
                    className={`px-3 py-2 text-sm rounded-md transition-all ${
                      config.mode === 'file' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    File Input
                  </button>
                  <button
                    onClick={() => setConfig({ ...config, mode: 'realtime' })}
                    className={`px-3 py-2 text-sm rounded-md transition-all ${
                      config.mode === 'realtime' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Real-time
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Hardware Acceleration</label>
                <select
                  value={config.useGpu ? 'gpu' : 'cpu'}
                  onChange={(e) => setConfig({ ...config, useGpu: e.target.value === 'gpu' })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="cpu">CPU (Safe for Termux)</option>
                  <option value="gpu">GPU (Requires Vulkan/MLC)</option>
                </select>
                {config.useGpu && (
                   <p className="text-xs text-amber-500 mt-1 flex items-center gap-1">
                     <AlertTriangle className="w-3 h-3"/> Advanced setup required
                   </p>
                )}
              </div>

               <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Target Language</label>
                <select
                  value={config.language}
                  onChange={(e) => setConfig({ ...config, language: e.target.value as any })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="zho">Chinese (Traditional/Simplified)</option>
                  <option value="auto">Auto-detect</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="bg-indigo-900/20 border border-indigo-500/30 p-4 rounded-xl">
            <h4 className="text-indigo-300 font-medium mb-2 flex items-center gap-2">
              <Download className="w-4 h-4"/> Next Steps
            </h4>
            <p className="text-sm text-indigo-200/80">
              Save this script as <code>asr.py</code> in your Termux environment. Ensure you have installed <code>transformers</code> and <code>torch</code>.
            </p>
          </div>
        </div>

        {/* Code Output */}
        <div className="md:col-span-2">
            <CodeBlock 
              title={`asr_deploy_${config.mode}.py`} 
              code={generatedScript} 
            />
        </div>
      </div>
    </div>
  );
};