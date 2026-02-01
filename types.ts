export enum ViewState {
  GENERATOR = 'GENERATOR',
  ARCHITECTURE = 'ARCHITECTURE',
  GUIDE = 'GUIDE',
  PROTOTYPE = 'PROTOTYPE'
}

export interface ScriptConfig {
  mode: 'realtime' | 'file';
  useGpu: boolean; // Placeholder for future Vulkan support logic
  modelSize: '0.6B' | 'Chat';
  language: 'zho' | 'auto';
}
