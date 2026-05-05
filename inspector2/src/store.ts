import {create} from 'zustand';
import RedGPUContext from "../../src/context/RedGPUContext";

export interface InspectorState {
  useDebugPanel: boolean;
  redGPUContext: RedGPUContext | null;
  // 엔진 타임스탬프
  lastUpdateTime: number;
  // FPS 통계
  fps: number;
  avgFps: number;
  low1Fps: number;
  low01Fps: number;
  frameTime: string;
  // 엔진 통계
  totalNum3DGroups: number;
  totalNum3DObjects: number;
  totalNumInstances: number;
  totalNumDrawCalls: number;
  totalNumTriangles: number;
  totalNumPoints: number;
  totalUsedVideoMemory: number;
  // 액션
  setStats: (stats: Partial<InspectorState>) => void;
  setUseDebugPanel: (value: boolean) => void;
  setRedGPUContext: (value: RedGPUContext) => void;
}

export const useInspectorStore = create<InspectorState>((set) => ({
  useDebugPanel: false,
  redGPUContext: null,
  lastUpdateTime: 0,
  fps: 0,
  avgFps: 0,
  low1Fps: 0,
  low01Fps: 0,
  frameTime: '0ms',
  totalNum3DGroups: 0,
  totalNum3DObjects: 0,
  totalNumInstances: 0,
  totalNumDrawCalls: 0,
  totalNumTriangles: 0,
  totalNumPoints: 0,
  totalUsedVideoMemory: 0,
  setStats: (stats) => set((state) => ({ ...state, ...stats })),
  setUseDebugPanel: (value) => set({ useDebugPanel: value }),
  setRedGPUContext: (value) => set({ redGPUContext: value }),
}));
