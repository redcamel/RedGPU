import RedGPUContext from "@redgpu/src/context/RedGPUContext";
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { useExampleHelperStore } from './store';
import { findCurrentExample } from './utils/exampleFinder';

/**
 * RedGPUExampleHelper
 */
class RedGPUExampleHelper {
    private root: ReactDOM.Root | null = null;
    private domRoot: HTMLElement | null = null;

    constructor(redGPUContext: RedGPUContext) {
        useExampleHelperStore.getState().setRedGPUContext(redGPUContext);
        
        // 현재 예제 정보 설정
        const currentExample = findCurrentExample(window.location.pathname);
        useExampleHelperStore.getState().setCurrentExample(currentExample);

        this.init();
    }

    private init() {
        if (!this.domRoot) {
            this.domRoot = document.createElement('div');
            this.domRoot.className = 'RedGPUExampleHelper';
            document.body.appendChild(this.domRoot);

            this.root = ReactDOM.createRoot(this.domRoot);
            this.root.render(
                <React.StrictMode>
                    <App/>
                </React.StrictMode>
            );
        }
    }

    public destroy() {
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

export default RedGPUExampleHelper;
