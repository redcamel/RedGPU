import React, {useEffect, useRef, useState} from 'react';
import {ExampleHelperState, useExampleHelperStore} from '../store';

/**
 * [KO] 예제 소스 코드를 보여주는 모달 컴포넌트입니다. Prism.js를 사용하여 하이라이팅을 적용합니다.
 * [EN] Modal component that shows the example source code. Applies highlighting using Prism.js.
 */
const SourceModal = () => {
    // [KO] 상태 선택 시 Selector 패턴 사용 (TS2339 오류 방지)
    const showSourceModal = useExampleHelperStore((state: ExampleHelperState) => state.showSourceModal);
    const setShowSourceModal = useExampleHelperStore((state: ExampleHelperState) => state.setShowSourceModal);
    const currentExample = useExampleHelperStore((state: ExampleHelperState) => state.currentExample);

    const [sourceCode, setSourceCode] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const codeRef = useRef<HTMLElement>(null);

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

    useEffect(() => {
        if (showSourceModal) {
            setLoading(true);

            // [KO] 현재 예제 헬퍼는 예제 페이지(index.html)에서 실행되므로 
            // 현재 경로의 index.js를 직접 불러오면 됩니다.
            // [EN] Since the example helper runs in the example page (index.html),
            // we can directly fetch index.js in the current path.
            fetch('./index.js')
                .then(response => {
                    if (!response.ok) throw new Error('Failed to load source code');
                    return response.text();
                })
                .then(async (text) => {
                    setSourceCode(text);
                    setLoading(false);

                    await loadPrism();
                    if (codeRef.current) {
                        (window as any).Prism.highlightElement(codeRef.current);
                    }
                })
                .catch(err => {
                    console.error(err);
                    setSourceCode('// Failed to load source code.');
                    setLoading(false);
                });
        }
    }, [showSourceModal]);

    // [KO] 모달이 열린 상태에서 코드가 준비되면 하이라이팅 적용
    useEffect(() => {
        if (showSourceModal && !loading && sourceCode && (window as any).Prism && codeRef.current) {
            (window as any).Prism.highlightElement(codeRef.current);
        }
    }, [sourceCode, loading, showSourceModal]);

    if (!showSourceModal) return null;

    return (
        <div style={overlayStyle} onClick={() => setShowSourceModal(false)}>
            <div style={modalStyle} onClick={e => e.stopPropagation()}>
                <div style={headerStyle}>
                    <div style={titleStyle}>SOURCE CODE : {currentExample?.name}</div>
                    <button style={closeButtonStyle} onClick={() => setShowSourceModal(false)}>CLOSE</button>
                </div>
                <div style={contentStyle}>
                    {loading ? (
                        <div style={loadingStyle}>Loading source code...</div>
                    ) : (
                        <pre style={preStyle}>
                            <code ref={codeRef} className="language-javascript" style={codeStyle}>
                                {sourceCode}
                            </code>
                        </pre>
                    )}
                </div>
            </div>
        </div>
    );
};

// Styles
const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    zIndex: 20000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px',
    backdropFilter: 'blur(10px)'
};

const modalStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: '1200px',
    height: '100%',
    backgroundColor: '#111112',
    border: '1px solid #333',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
};

const headerStyle: React.CSSProperties = {
    padding: '16px 24px',
    borderBottom: '1px solid #333',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1a1a1b'
};

const titleStyle: React.CSSProperties = {
    fontSize: '13px',
    fontWeight: 'bold',
    color: '#fdb48d',
    letterSpacing: '0.05em'
};

const closeButtonStyle: React.CSSProperties = {
    backgroundColor: '#333',
    color: '#ccc',
    border: 'none',
    padding: '6px 16px',
    fontSize: '11px',
    fontWeight: 'bold',
    cursor: 'pointer',
    borderRadius: '4px',
    transition: 'all 0.2s'
};

const contentStyle: React.CSSProperties = {
    flex: 1,
    overflow: 'auto',
    backgroundColor: '#000'
};

const loadingStyle: React.CSSProperties = {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#666',
    fontSize: '13px'
};

const preStyle: React.CSSProperties = {
    margin: 0,
    padding: '20px',
    backgroundColor: 'transparent'
};

const codeStyle: React.CSSProperties = {
    fontSize: '13px',
    lineHeight: '1.6',
    fontFamily: 'Consolas, "Courier New", monospace',
    textShadow: 'none',
    color: '#ccc'
};

export default SourceModal;
