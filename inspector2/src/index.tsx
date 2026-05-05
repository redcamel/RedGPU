import RedGPUContext from "../../src/context/RedGPUContext";
import React from 'react';
import ReactDOM from 'react-dom/client';
import {useInspectorStore} from './store';
import App from './App';

/**
 * RedGPUInspector (React Version)
 * 엔진과 리액트 UI 사이의 브릿지 역할을 수행합니다.
 */
class RedGPUInspector {
    private root: ReactDOM.Root | null = null;
    private domRoot: HTMLElement | null = null;

    constructor() {
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
    render(redGPUContext: RedGPUContext, time: number) {
        if (this.useDebugPanel) {
            this.ensureMounted();
        } else {
            this.unmount();
        }
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
