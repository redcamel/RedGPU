import React from 'react';
import ReactDOM from 'react-dom/client';
import Footer from "../common/components/Footer";

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
            this.domRoot.className = 'RedGPUExamples';
            document.body.appendChild(this.domRoot);

            this.root = ReactDOM.createRoot(this.domRoot);
            this.root.render(
                <React.StrictMode>
                    <div style={{color: 'white', padding: '20px'}}>
                        <h1>RedGPU Examples List</h1>
                        <p>This is a placeholder for the new examples list application.</p>
                    </div>
                    <Footer useSourceModal={false}/>
                </React.StrictMode>
            );
        }
    }
}

export default RedGPUExamples;
