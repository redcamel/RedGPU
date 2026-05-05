import RedGPUContext from "../../src/context/RedGPUContext";
import React from 'react';
import ReactDOM from 'react-dom/client';
import {useInspectorStore} from './store';
import App from './App';
import { collectStats } from './utils/collectStats';
import { FPSMeter } from './components/FPS';

/**
 * RedGPUInspector2 (React Version)
 * 엔진과 리액트 UI 사이의 브릿지 역할을 수행합니다.
 */
class RedGPUInspector2 {
    private root: ReactDOM.Root | null = null;
    private domRoot: HTMLElement | null = null;
    private rafId: number | null = null;
    private redGPUContext: RedGPUContext | null = null;
    private fpsMeter: FPSMeter = new FPSMeter();


    constructor(redGPUContext: RedGPUContext) {
        this.redGPUContext = redGPUContext;
        
        // [KO] 스토어에 redGPUContext 저장
        // [EN] Store redGPUContext in the store
        useInspectorStore.getState().setRedGPUContext(redGPUContext);

        // [KO] Zustand 스토어 상태 변화 구독 (패널 활성화/비활성화 감지)
        // [EN] Subscribe to Zustand store state changes (Detect panel activation/deactivation)
        useInspectorStore.subscribe((state) => {
            if (state.useDebugPanel) {
                this.ensureMounted();
                this.startLoop();
            } else {
                this.stopLoop();
                this.unmount();
            }
        });
    }

    get useDebugPanel(): boolean {
        return useInspectorStore.getState().useDebugPanel;
    }

    set useDebugPanel(value: boolean) {
        useInspectorStore.getState().setUseDebugPanel(value);
    }

    /**
     * 엔진의 렌더 루프에서 호출됩니다.
     */
    render() {
        if (this.useDebugPanel) {
            this.ensureMounted();
            this.startLoop();
        }
    }

    private startLoop() {
        if (this.rafId) return;
        const loop = (time: number) => {
            // [KO] 패널이 비활성화된 경우 루프 중단
            // [EN] Stop the loop if the panel is deactivated
            if (!this.useDebugPanel) {
                this.stopLoop();
                return;
            }

            this.updateStats(time);
            this.rafId = requestAnimationFrame(loop);
        };
        this.rafId = requestAnimationFrame(loop);
    }

    private stopLoop() {
        if (this.rafId) {
            cancelAnimationFrame(this.rafId);
            this.rafId = null;
        }
    }

    private updateStats(time: number) {
        if (!this.redGPUContext) return;
        
        // [KO] 엔진 통계 수집
        // [EN] Collect engine statistics
        const stats = collectStats(this.redGPUContext, time);
        
        // [KO] FPS 통계 계산
        // [EN] Calculate FPS statistics
        const fpsStats = this.fpsMeter.update(time);
        
        useInspectorStore.getState().setStats({
            ...stats,
            ...(fpsStats || {})
        });
    }


    private ensureMounted() {
        if (!this.domRoot) {
            this.domRoot = document.createElement('div');
            this.domRoot.className = 'RedGPUDebugPanel-React';
            document.body.appendChild(this.domRoot);

            this.root = ReactDOM.createRoot(this.domRoot);
            this.root.render(
                <React.StrictMode>
                    <App/>
                </React.StrictMode>
            );
        }
    }

    private unmount() {
        if (this.root) {
            this.root.unmount();
            this.root = null;
        }
        if (this.domRoot) {
            this.domRoot.remove();
            this.domRoot = null;
        }
    }
}

export default RedGPUInspector2;
