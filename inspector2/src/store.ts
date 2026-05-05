import {create} from 'zustand';

export interface InspectorState {
    useDebugPanel: boolean;
    setUseDebugPanel: (value: boolean) => void;
}

export const useInspectorStore = create<InspectorState>((set) => ({
    useDebugPanel: false,
    setUseDebugPanel: (value) => set({useDebugPanel: value}),
}));
