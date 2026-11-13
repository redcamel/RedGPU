import React, {useEffect, useRef, useState} from 'react';
import {ExampleHelperState, useExampleHelperStore} from '../../store';
import {usePrismLoader} from '../hooks/usePrismLoader';
import {useMediaQuery} from '../../utils/useMediaQuery';

/**
 * [KO] 예제 소스 코드를 보여주는 컴포넌트입니다.
 * - PC 및 와이드 화면(>= 1280px)에서는 우측 사이드 패널로 표시하여 3D 뷰포트와 실시간으로 함께 볼 수 있습니다.
 * - 태블릿, 모바일, 또는 좁은 화면에서는 기존 전체화면 중앙 모달로 표시됩니다.
 * - 전체화면 및 우측 도킹 전환을 지원하며, Prism.js를 사용하여 신택스 하이라이팅을 적용합니다.
 *
 * [EN] Component that shows the example source code.
 * - Displayed as a right side panel on PC & wide screens (>= 1280px) to view simultaneously with the 3D viewport.
 * - Displayed as a full-screen center modal on mobile, tablet, or narrow screens.
 * - Supports toggling between full-screen and right dock, and applies syntax highlighting using Prism.js.
 */
const SourceModal = () => {
    const showSourceModal = useExampleHelperStore((state: ExampleHelperState) => state.showSourceModal);
    const setShowSourceModal = useExampleHelperStore((state: ExampleHelperState) => state.setShowSourceModal);
    const isSourceModalMaximized = useExampleHelperStore((state: ExampleHelperState) => state.isSourceModalMaximized);
    const setIsSourceModalMaximized = useExampleHelperStore((state: ExampleHelperState) => state.setIsSourceModalMaximized);
    const currentExample = useExampleHelperStore((state: ExampleHelperState) => state.currentExample);
    const redGPUContext = useExampleHelperStore((state: ExampleHelperState) => state.redGPUContext);
    const isNarrow = useExampleHelperStore((state: ExampleHelperState) => state.isNarrow);

    const isBelowWide = useMediaQuery(1280);
    const isWide = !isBelowWide && !isNarrow;

    // [KO] RedGPUContextDetector 또는 UA 폴백을 통한 순수 PC(비모바일) 판별
    // [EN] Pure PC (non-mobile) detection via RedGPUContextDetector or UA fallback
    const isPC = redGPUContext
        ? !redGPUContext.detector.isMobile
        : (typeof navigator !== 'undefined' && !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));

    const isSideMode = isPC && isWide && !isSourceModalMaximized;

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

    const overlayDynamicStyle: React.CSSProperties = isSideMode
        ? sideOverlayStyle
        : modalOverlayStyle;

    const panelDynamicStyle: React.CSSProperties = isSideMode
        ? sidePanelStyle
        : fullModalStyle;

    return (
        <div
            style={overlayDynamicStyle}
            onClick={() => {
                if (!isSideMode) setShowSourceModal(false);
            }}
        >
            <div style={panelDynamicStyle} onClick={e => e.stopPropagation()}>
                <div style={headerStyle}>
                    <div style={titleStyle}>
                        SOURCE CODE : {currentExample?.name || 'Example'}
                    </div>
                    <div style={headerActionsStyle}>
                        {isPC && isWide && (
                            <button
                                style={actionButtonStyle}
                                onClick={() => setIsSourceModalMaximized(!isSourceModalMaximized)}
                                title={isSourceModalMaximized ? '우측 패널로 도킹' : '전체화면으로 확대'}
                            >
                                {isSourceModalMaximized ? 'DOCK RIGHT' : 'FULL SCREEN'}
                            </button>
                        )}
                        <button style={closeButtonStyle} onClick={() => setShowSourceModal(false)}>
                            CLOSE
                        </button>
                    </div>
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
const modalOverlayStyle: React.CSSProperties = {
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
    WebkitBackdropFilter: 'blur(12px)',
    pointerEvents: 'auto'
};

const sideOverlayStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    zIndex: 10001,
    pointerEvents: 'none',
    padding: 0
};

const fullModalStyle: React.CSSProperties = {
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
    boxShadow: '0 24px 60px rgba(0, 0, 0, 0.6)',
    pointerEvents: 'auto'
};

const sidePanelStyle: React.CSSProperties = {
    position: 'fixed',
    top: '80px',
    right: '20px',
    width: 'min(640px, 45vw)',
    height: 'calc(100dvh - 158px)',
    maxHeight: 'calc(100dvh - 158px)',
    backgroundColor: 'rgba(18, 18, 20, 0.88)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    borderRadius: '18px',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    boxShadow: '0 16px 40px rgba(0, 0, 0, 0.5)',
    pointerEvents: 'auto',
    transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
};

const headerStyle: React.CSSProperties = {
    padding: '12px 18px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    gap: '12px',
    flexShrink: 0
};

const headerActionsStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
};

const titleStyle: React.CSSProperties = {
    fontSize: '12px',
    fontWeight: 'bold',
    color: '#fdb48d',
    letterSpacing: '0.05em',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
};

const actionButtonStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 'auto',
    height: '30px',
    padding: '0 12px',
    backgroundColor: 'rgba(253, 180, 141, 0.12)',
    color: '#fdb48d',
    border: '1px solid rgba(253, 180, 141, 0.3)',
    fontSize: '11px',
    fontWeight: 'bold',
    cursor: 'pointer',
    borderRadius: '8px',
    transition: 'all 0.2s',
    letterSpacing: '0.03em'
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
