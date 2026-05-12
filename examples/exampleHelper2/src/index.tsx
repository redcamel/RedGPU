import RedGPUContext from "@redgpu/src/context/RedGPUContext";
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {GuiConfig, useExampleHelperStore} from './store';
import {findCurrentExample} from './utils/exampleFinder';

/**
 * RedGPUExampleHelper
 */
class RedGPUExampleHelper {
    private root: ReactDOM.Root | null = null;
    private domRoot: HTMLElement | null = null;

    constructor(redGPUContext: RedGPUContext, guiCallback?: GuiConfig | ((gui: any) => void)) {
        useExampleHelperStore.getState().setRedGPUContext(redGPUContext);
        if (guiCallback) {
            if (typeof guiCallback === 'function') {
                useExampleHelperStore.getState().setGuiConfig({
                    guiCallback: guiCallback
                });
            } else {
                useExampleHelperStore.getState().setGuiConfig(guiCallback);
            }
        }

        this.init();
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

    private async init() {
        // 현재 예제 정보 설정
        const currentExample = await findCurrentExample(window.location.pathname);
        useExampleHelperStore.getState().setCurrentExample(currentExample);

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
}

export default RedGPUExampleHelper;
