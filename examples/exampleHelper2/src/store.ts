import {create} from 'zustand';
import RedGPUContext from "@redgpu/src/context/RedGPUContext";

export interface ExampleHelperState {
    redGPUContext: RedGPUContext | null;
    setRedGPUContext: (value: RedGPUContext) => void;
}

export const useExampleHelperStore = create<ExampleHelperState>((set) => ({
    redGPUContext: null,
    setRedGPUContext: (value) => set({redGPUContext: value}),
}));
