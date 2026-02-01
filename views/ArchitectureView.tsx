import React from 'react';
import { Layers, Smartphone, Terminal, Box, Play } from 'lucide-react';

const NodeCard: React.FC<{ icon: any; title: string; desc: string; color: string }> = ({
  icon: Icon,
  title,
  desc,
  color,
}) => (
  <div className={`flex flex-col items-center p-4 bg-slate-900 border border-${color}-500/30 rounded-xl w-48 shadow-lg z-10 hover:scale-105 transition-transform duration-300`}>
    <div className={`p-3 rounded-full bg-${color}-500/10 mb-3`}>
      <Icon className={`w-6 h-6 text-${color}-400`} />
    </div>
    <h3 className="font-bold text-slate-100 text-sm">{title}</h3>
    <p className="text-xs text-slate-400 text-center mt-1">{desc}</p>
  </div>
);

const ArrowDown = () => (
  <div className="h-8 w-0.5 bg-slate-700 my-1 relative">
    <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b-2 border-r-2 border-slate-700 transform rotate-45"></div>
  </div>
);

export const ArchitectureView: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto p-6 flex flex-col items-center">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-white mb-3">System Architecture</h2>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Recommended stack for running large speech models on Android without rooting, leveraging Termux and Proot-Distro for a complete Linux environment.
        </p>
      </div>

      <div className="relative flex flex-col items-center">
        {/* Layer 1: Hardware */}
        <NodeCard 
          icon={Smartphone} 
          title="Android Hardware" 
          desc="Snapdragon / MediaTek SoC (CPU/NPU)" 
          color="slate" 
        />
        <ArrowDown />

        {/* Layer 2: Android OS & Termux */}
        <NodeCard 
          icon={Terminal} 
          title="Termux Environment" 
          desc="Terminal Emulator & Linux Environment App" 
          color="green" 
        />
        <ArrowDown />

        {/* Layer 3: Proot Distro */}
        <div className="relative p-6 border-2 border-dashed border-slate-700 rounded-2xl bg-slate-900/30 backdrop-blur-sm">
           <div className="absolute -top-3 left-4 bg-slate-950 px-2 text-xs font-mono text-slate-500">
             VIRTUALIZED FILESYSTEM
           </div>
           
           <div className="flex flex-col items-center gap-2">
              <NodeCard 
                icon={Layers} 
                title="Proot-Distro (Ubuntu)" 
                desc="Compatibility Layer for standard Linux binaries" 
                color="orange" 
              />
              <ArrowDown />
              
              <div className="flex gap-8 mt-2">
                <NodeCard 
                  icon={Box} 
                  title="Transformers Cache" 
                  desc="~/.cache/huggingface (Model Weights)" 
                  color="blue" 
                />
                <NodeCard 
                  icon={Play} 
                  title="Python Runtime" 
                  desc="PyTorch, Librosa, NumPy" 
                  color="indigo" 
                />
              </div>
           </div>
        </div>
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
        <div className="bg-slate-900 p-5 rounded-lg border-l-4 border-indigo-500">
            <h4 className="font-bold text-white mb-2">Why Proot?</h4>
            <p className="text-sm text-slate-400">
                Direct Termux Python can struggle with `manylinux` wheels required by PyTorch and Transformers. 
                Using Ubuntu via Proot ensures seamless installation of dependencies.
            </p>
        </div>
        <div className="bg-slate-900 p-5 rounded-lg border-l-4 border-emerald-500">
            <h4 className="font-bold text-white mb-2">Privacy Assurance</h4>
            <p className="text-sm text-slate-400">
                By setting `local_files_only=True` in the Transformers config (after initial download), 
                the model runs entirely offline. No audio data leaves the `Proot` container.
            </p>
        </div>
      </div>
    </div>
  );
};