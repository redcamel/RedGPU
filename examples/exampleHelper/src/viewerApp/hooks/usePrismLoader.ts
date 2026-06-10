/**
 * [KO] Prism.js 에셋 및 기능을 동적으로 로드하는 훅입니다.
 * [EN] Hook that dynamically loads Prism.js assets and functionality.
 */
export const usePrismLoader = () => {
    // [KO] Prism.js 에셋 경로
    const PRISM_JS = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js';
    const PRISM_CSS = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css';

    /**
     * [KO] Prism.js와 CSS를 동적으로 로드합니다.
     */
    const loadPrism = () => {
        return new Promise<void>((resolve) => {
            const prismWindow = window as any;
            if (prismWindow.Prism) {
                resolve();
                return;
            }

            // CSS 로드
            if (!document.querySelector(`link[href="${PRISM_CSS}"]`)) {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = PRISM_CSS;
                document.head.appendChild(link);
            }

            // JS 로드
            if (!document.querySelector(`script[src="${PRISM_JS}"]`)) {
                const script = document.createElement('script');
                script.src = PRISM_JS;
                script.onload = () => resolve();
                document.head.appendChild(script);
            } else {
                const checkPrism = setInterval(() => {
                    if (prismWindow.Prism) {
                        clearInterval(checkPrism);
                        resolve();
                    }
                }, 100);
            }
        });
    };

    return {loadPrism};
};
