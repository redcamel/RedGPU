import React, {useEffect, useRef, useState} from 'react';
import {ExampleHelperState, useExampleHelperStore} from '../../store';
import {usePrismLoader} from '../hooks/usePrismLoader';
import {useMediaQuery} from '../../utils/useMediaQuery';

/**
 * [KO] 예제 소스 코드를 보여주는 컴포넌트입니다.
 * - PC 및 와이드 화면(>= 1280px)에서는 좌측 사이드 패널로 표시하여 3D 뷰포트와 실시간으로 함께 볼 수 있습니다.
 * - 태블릿, 모바일, 또는 좁은 화면에서는 기존 전체화면 중앙 모달로 표시됩니다.
 * - 사이드 패널과 전체화면 모달 간 전환 시 기하학적 수치가 연속적으로 보간되는 모핑(Morphing) 애니메이션을 제공합니다.
 *
 * [EN] Component that shows the example source code.
 * - Displayed as a left side panel on PC & wide screens (>= 1280px) to view simultaneously with the 3D viewport.
 * - Displayed as a full-screen center modal on mobile, tablet, or narrow screens.
 * - Provides morphing animation where geometric values are smoothly interpolated when toggling between side panel and full screen.
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
    }, [showSourceModal, currentExample, loadPrism]);

    useEffect(() => {
        if (showSourceModal && !loading && sourceCode && (window as any).Prism && codeRef.current) {
            (window as any).Prism.highlightElement(codeRef.current);
        }
    }, [sourceCode, loading, showSourceModal]);

    // [KO] 풀스크린 모드에서만 활성화되는 배경 딤 오버레이 (사이드 모드 시에는 렌더링되지 않아 불필요한 전체 점유 제거)
    const backdropOverlayStyle: React.CSSProperties = {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 19999,
        backgroundColor: showSourceModal ? 'rgba(0, 0, 0, 0.75)' : 'rgba(0, 0, 0, 0)',
        backdropFilter: showSourceModal ? 'blur(12px)' : 'blur(0px)',
        WebkitBackdropFilter: showSourceModal ? 'blur(12px)' : 'blur(0px)',
        pointerEvents: showSourceModal ? 'auto' : 'none',
        visibility: showSourceModal ? 'visible' : 'hidden',
        transition: 'background-color 0.35s ease, backdrop-filter 0.35s ease, -webkit-backdrop-filter 0.35s ease, visibility 0.35s ease'
    };

    // [KO] 단일 Fixed 좌표계 기반 패널 스타일 (사이드 ↔ 풀스크린 기하학적 모핑 애니메이션)
    const panelDynamicStyle: React.CSSProperties = {
        position: 'fixed',
        zIndex: isSideMode ? 10001 : 20000,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        boxSizing: 'border-box',
        backgroundColor: 'rgba(18, 18, 20, 0.88)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.12)',

        // 기하학적 좌표 보간
        top: isSideMode ? '80px' : (isNarrow ? '16px' : '34px'),
        bottom: isSideMode ? '20px' : (isNarrow ? '16px' : '34px'),
        left: isSideMode
            ? '20px'
            : (isNarrow ? '16px' : 'max(34px, calc(50% - 600px))'),
        width: isSideMode
            ? 'min(640px, 45vw)'
            : (isNarrow ? 'calc(100vw - 32px)' : 'min(1200px, calc(100vw - 68px))'),
        borderRadius: isSideMode ? '18px' : '14px',
        boxShadow: isSideMode
            ? '0 16px 40px rgba(0, 0, 0, 0.5)'
            : '0 24px 60px rgba(0, 0, 0, 0.6)',

        // 열림/닫힘 및 모드별 트랜스폼/투명도
        transform: showSourceModal
            ? 'translateX(0) scale(1)'
            : (isSideMode ? 'translateX(calc(-100% - 28px)) scale(1)' : 'translateX(0) scale(0.96) translateY(12px)'),
        opacity: showSourceModal ? 1 : 0,
        pointerEvents: showSourceModal ? 'auto' : 'none',

        // 연속적인 모핑 트랜지션
        transition: 'left 0.35s cubic-bezier(0.16, 1, 0.3, 1), top 0.35s cubic-bezier(0.16, 1, 0.3, 1), bottom 0.35s cubic-bezier(0.16, 1, 0.3, 1), width 0.35s cubic-bezier(0.16, 1, 0.3, 1), transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1), border-radius 0.35s ease, box-shadow 0.35s ease'
    };

    return (
        <>
            {!isSideMode && (
                <div
                    style={backdropOverlayStyle}
                    onClick={() => setShowSourceModal(false)}
                />
            )}
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
                                title={isSourceModalMaximized ? '좌측 패널로 도킹' : '전체화면으로 확대'}
                            >
                                {isSourceModalMaximized ? 'DOCK LEFT' : 'FULL SCREEN'}
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
        </>
    );
};

// Styles
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
