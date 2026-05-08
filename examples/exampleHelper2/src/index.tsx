import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

/**
 * RedGPUExampleHelper
 */
class RedGPUExampleHelper {
    private root: ReactDOM.Root | null = null;
    private domRoot: HTMLElement | null = null;

    constructor() {
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
