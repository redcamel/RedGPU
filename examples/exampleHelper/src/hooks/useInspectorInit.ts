import {useEffect} from 'react';
import RedGPUContext from "@redgpu/src/context/RedGPUContext";

/**
 * [KO] RedGPU Inspector를 동적으로 초기화하는 훅입니다.
 * [EN] Hook that dynamically initializes the RedGPU Inspector.
 */
export const useInspectorInit = (redGPUContext: RedGPUContext | null, setDebugActive: (active: boolean) => void) => {
    useEffect(() => {
        if (redGPUContext) {
            const initInspector = async () => {
                try {
                    const RELATIVE_PATH = '../../../inspector/dist/index.js';
                    const inspectorPath = new URL(RELATIVE_PATH, import.meta.url).href;
                    // @ts-ignore
                    const {default: RedGPUInspector} = await import(/* @vite-ignore */ inspectorPath);
                    if (!window.redGPUInspector) {
                        window.redGPUInspector = new RedGPUInspector(redGPUContext);
                        setDebugActive(window.redGPUInspector.useDebugPanel);
                    }
                } catch (e) {
                    console.error('Failed to load Inspector:', e);
                }
            };
            initInspector();
        }
    }, [redGPUContext, setDebugActive]);
};
