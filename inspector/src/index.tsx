import RedGPUContext from "@redgpu/src/context/RedGPUContext";
import React from 'react';
import ReactDOM from 'react-dom/client';
import {useInspectorStore} from './store';
import App from './App';
import {collectStats} from './utils/collectStats';
import {FPSMeter} from './components/monitor/FPS';

/**
 * RedGPUInspector (React Version)
 * 엔진과 리액트 UI 사이의 브릿지 역할을 수행합니다.
 */
class RedGPUInspector {
    private root: ReactDOM.Root | null = null;
    private domRoot: HTMLElement | null = null;
    private rafId: number | null = null;
    private redGPUContext: RedGPUContext | null = null;
    private fpsMeter: FPSMeter = new FPSMeter();
    private unsubscribe: (() => void) | null = null;
    private isDisposed = false;


    constructor(redGPUContext: RedGPUContext) {
        this.redGPUContext = redGPUContext;

        // [KO] 스토어에 redGPUContext 저장
        // [EN] Store redGPUContext in the store
        useInspectorStore.getState().setRedGPUContext(redGPUContext);

        // [KO] Zustand 스토어 상태 변화 구독 (패널 활성화/비활성화 감지)
        // [EN] Subscribe to Zustand store state changes (Detect panel activation/deactivation)
        this.unsubscribe = useInspectorStore.subscribe((state) => {
            if (state.useDebugPanel) {
                this.ensureMounted();
                this.startLoop();
            } else {
                this.stopLoop();
                this.unmount();
            }
        });

        // [KO] 브라우징이 변경되거나 리로드/언로드될 때 자동으로 리소스 해제
        // [EN] Automatically release resources when browsing changes or page reloads/unloads
        window.addEventListener('beforeunload', this.handleUnload);
        window.addEventListener('pagehide', this.handleUnload);
    }

    public dispose() {
        if (this.isDisposed) return;
        this.isDisposed = true;

        window.removeEventListener('beforeunload', this.handleUnload);
        window.removeEventListener('pagehide', this.handleUnload);

        this.stopLoop();
        this.unmount();

        if (this.unsubscribe) {
            this.unsubscribe();
            this.unsubscribe = null;
        }

        // [KO] Zustand 스토어의 Context 참조 제거
        // [EN] Remove Context reference in Zustand store
        useInspectorStore.getState().setRedGPUContext(null);

        this.redGPUContext = null;

        // [KO] 전역 변수 참조 제거
        // [EN] Remove global variable reference
        if ((window as any).redGPUInspector === this) {
            (window as any).redGPUInspector = null;
        }
    }

    private handleUnload = () => {
        this.dispose();
    };

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

        // [KO] 모든 통계 데이터를 매 프레임(60FPS) 수집하여 그래프와 수치를 부드럽게 업데이트
        const stats = collectStats(this.redGPUContext, time);
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

export default RedGPUInspector;
