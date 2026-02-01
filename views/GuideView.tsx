import React from 'react';
import { CheckCircle2, Copy } from 'lucide-react';

const Step: React.FC<{ num: number; title: string; cmd?: string; desc: string }> = ({ num, title, cmd, desc }) => (
  <div className="flex gap-4 mb-8 relative">
    <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-sm">
      {num}
    </div>
    <div className="flex-grow">
      <h3 className="text-lg font-semibold text-slate-200 mb-1">{title}</h3>
      <p className="text-slate-400 text-sm mb-3">{desc}</p>
      {cmd && (
        <div className="bg-black/50 rounded-lg p-3 border border-slate-800 flex justify-between items-center group">
          <code className="text-green-400 font-mono text-sm">{cmd}</code>
          <button 
            onClick={() => navigator.clipboard.writeText(cmd)}
            className="text-slate-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Copy className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
    {num !== 6 && <div className="absolute left-4 top-10 bottom-[-20px] w-0.5 bg-slate-800" />}
  </div>
);

export const GuideView: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Installation Guide</h2>
        <p className="text-slate-400">Follow these steps on your Android device using the Termux app.</p>
      </div>

      <div className="bg-slate-900 rounded-xl p-8 border border-slate-800 shadow-xl">
        <Step 
          num={1} 
          title="Update Termux" 
          desc="Ensure your repositories are up to date." 
          cmd="pkg update && pkg upgrade" 
        />
        <Step 
          num={2} 
          title="Install Proot-Distro" 
          desc="This tool allows you to run Linux distributions inside Termux." 
          cmd="pkg install proot-distro" 
        />
        <Step 
          num={3} 
          title="Install Ubuntu" 
          desc="Install and login to a Ubuntu environment." 
          cmd="proot-distro install ubuntu && proot-distro login ubuntu" 
        />
        <Step 
          num={4} 
          title="Install Python & Dependencies" 
          desc="Inside Ubuntu, install Python and Git." 
          cmd="apt update && apt install python3 python3-pip git" 
        />
        <Step 
          num={5} 
          title="Install Machine Learning Libraries" 
          desc="Install PyTorch and Transformers. This may take a while." 
          cmd="pip install torch transformers librosa accelerate soundfile" 
        />
        <Step 
          num={6} 
          title="Run the Script" 
          desc="Copy the generated script from the 'Script Generator' tab into a file and run it." 
          cmd="python3 asr.py" 
        />
      </div>

      <div className="mt-6 flex items-center gap-3 bg-emerald-900/20 p-4 rounded-lg border border-emerald-500/20">
        <CheckCircle2 className="text-emerald-500 w-6 h-6" />
        <div>
          <h4 className="text-emerald-400 font-medium">Ready for Offline Use</h4>
          <p className="text-emerald-300/60 text-sm">Once the model weights are downloaded during the first run, internet access is no longer required.</p>
        </div>
      </div>
    </div>
  );
};