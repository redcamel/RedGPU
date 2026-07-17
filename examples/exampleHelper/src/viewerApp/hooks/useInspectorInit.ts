import {useEffect} from 'react';
import RedGPUContext from "@redgpu/src/context/RedGPUContext";

/**
 * [KO] RedGPU Inspector를 동적으로 초기화하는 훅입니다.
 * [EN] Hook that dynamically initializes the RedGPU Inspector.
 */
export const useInspectorInit = (redGPUContext: RedGPUContext | null, setDebugActive: (active: boolean) => void) => {
    useEffect(() => {
        let isCurrent = true;
        let inspectorInstance: any = null;

        if (redGPUContext) {
            const initInspector = async () => {
                try {
                    const RELATIVE_PATH = '../../../inspector/dist/index.js';
                    const inspectorPath = new URL(RELATIVE_PATH, import.meta.url).href;
                    // @ts-ignore
                    const {default: RedGPUInspector} = await import(/* @vite-ignore */ inspectorPath);

                    if (!isCurrent) return;

                    if (!window.redGPUInspector) {
                        inspectorInstance = new RedGPUInspector(redGPUContext);
                        window.redGPUInspector = inspectorInstance;
                        setDebugActive(window.redGPUInspector.useDebugPanel);
                    } else {
                        inspectorInstance = window.redGPUInspector;
                    }
                } catch (e) {
                    console.error('Failed to load Inspector:', e);
                }
            };
            initInspector();
        }

        return () => {
            isCurrent = false;
            // [KO] 컴포넌트가 언마운트되거나 context가 변경될 때 인스펙터 리소스 해제
            // [EN] Release inspector resources when component unmounts or context changes
            if (inspectorInstance && typeof inspectorInstance.dispose === 'function') {
                inspectorInstance.dispose();
            }
            if (window.redGPUInspector && window.redGPUInspector === inspectorInstance) {
                window.redGPUInspector = null;
            }
        };
    }, [redGPUContext, setDebugActive]);
};
