import React from 'react';
import ReactDOM from 'react-dom/client';
import ExamplesApp from './ExamplesApp';

/**
 * [KO] 예제 리스트를 위한 메인 진입점 클래스입니다.
 * [EN] Main entry point class for the example list.
 */
class RedGPUExamples {
    private root: ReactDOM.Root | null = null;
    private domRoot: HTMLElement | null = null;

    constructor() {
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

    private init() {
        if (!this.domRoot) {
            this.domRoot = document.createElement('div');
            this.domRoot.id = 'redgpu-examples-root';
            this.domRoot.style.height = '100%'; // [KO] 루트 요소 높이 설정 [EN] Set root element height
            document.body.appendChild(this.domRoot);

            this.root = ReactDOM.createRoot(this.domRoot);
            this.root.render(
                <React.StrictMode>
                    <ExamplesApp />
                </React.StrictMode>
            );
        }
    }
}

export default RedGPUExamples;
