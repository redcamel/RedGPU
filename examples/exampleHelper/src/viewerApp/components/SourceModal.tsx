import React, {useEffect, useRef, useState} from 'react';
import {ExampleHelperState, useExampleHelperStore} from '../../store';
import {usePrismLoader} from '../hooks/usePrismLoader';

/**
 * [KO] 예제 소스 코드를 보여주는 모달 컴포넌트입니다. Prism.js를 사용하여 하이라이팅을 적용합니다.
 * [EN] Modal component that shows the example source code. Applies highlighting using Prism.js.
 */
const SourceModal = () => {
    const showSourceModal = useExampleHelperStore((state: ExampleHelperState) => state.showSourceModal);
    const setShowSourceModal = useExampleHelperStore((state: ExampleHelperState) => state.setShowSourceModal);
    const currentExample = useExampleHelperStore((state: ExampleHelperState) => state.currentExample);

    const [sourceCode, setSourceCode] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const codeRef = useRef<HTMLElement>(null);

    // [KO] Prism.js 로더 사용
    const {loadPrism} = usePrismLoader();

    useEffect(() => {
        if (showSourceModal) {
            setLoading(true);

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
    }, [showSourceModal, loadPrism]);

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
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    zIndex: 20000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '34px',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)'
};

const modalStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: '1200px',
    height: '100%',
    backgroundColor: 'rgba(17, 17, 18, 0.88)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    borderRadius: '12px',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    boxShadow: '0 24px 60px rgba(0,0,0,0.6)'
};

const headerStyle: React.CSSProperties = {
    padding: '12px 18px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.03)'
};

const titleStyle: React.CSSProperties = {
    fontSize: '12px',
    fontWeight: 'bold',
    color: '#fdb48d',
    letterSpacing: '0.05em'
};

const closeButtonStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 'auto',
    height: '30px',
    padding: '0 14px',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    color: '#eee',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    fontSize: '11px',
    fontWeight: 'bold',
    cursor: 'pointer',
    borderRadius: '8px',
    transition: 'all 0.2s'
};

const contentStyle: React.CSSProperties = {
    flex: 1,
    overflow: 'auto',
    backgroundColor: 'rgba(0, 0, 0, 0.4)'
};

const loadingStyle: React.CSSProperties = {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#888',
    fontSize: '13px'
};

const preStyle: React.CSSProperties = {
    margin: 0,
    padding: '20px',
    backgroundColor: 'transparent'
};

const codeStyle: React.CSSProperties = {
    fontSize: '13px',
    lineHeight: '1.618',
    fontFamily: 'Consolas, "Courier New", monospace',
    textShadow: 'none',
    color: '#ccc'
};

export default SourceModal;
