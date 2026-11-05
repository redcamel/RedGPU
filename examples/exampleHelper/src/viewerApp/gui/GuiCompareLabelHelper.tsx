import React, {useCallback, useEffect, useLayoutEffect, useRef, useState} from 'react';
import {useExampleHelperStore} from '../../store';
import View3D from "@redgpu/src/display/view/View3D";

/**
 * [KO] 뷰 비교를 위한 레이블을 표시하는 컴포넌트입니다.
 * [EN] Component that displays labels for view comparison.
 */
const GuiCompareLabelHelper: React.FC = () => {
    const guiConfig = useExampleHelperStore((state) => state.guiConfig);
    const redGPUContext = useExampleHelperStore((state) => state.redGPUContext);
    const showCompareLabel = useExampleHelperStore((state) => state.showCompareLabel);
    const [rect, setRect] = useState<DOMRect | null>(null);
    const compareViewsRef = useRef<{ viewNormal: View3D; viewEffect: View3D } | null>(null);

    useEffect(() => {
        if (redGPUContext && guiConfig?.compareLabel && redGPUContext.viewList.length >= 2) {
            compareViewsRef.current = {
                viewNormal: redGPUContext.viewList[0],
                viewEffect: redGPUContext.viewList[1]
            };
        } else if (!redGPUContext || !guiConfig?.compareLabel) {
            compareViewsRef.current = null;
        }
    }, [redGPUContext, guiConfig?.compareLabel]);

    const syncCompareViewLayout = useCallback(() => {
        if (!redGPUContext || !guiConfig?.compareLabel || !compareViewsRef.current) return;
        const {viewNormal, viewEffect} = compareViewsRef.current;

        if (!showCompareLabel) {
            if (redGPUContext.viewList.includes(viewNormal)) {
                redGPUContext.removeView(viewNormal);
            }
            viewEffect.setSize('100%', '100%');
            viewEffect.setPosition(0, 0);
        } else {
            if (!redGPUContext.viewList.includes(viewNormal)) {
                redGPUContext.removeView(viewEffect);
                redGPUContext.addView(viewNormal);
                redGPUContext.addView(viewEffect);
            }
            const isPortrait = window.innerWidth < window.innerHeight;
            if (isPortrait) {
                viewEffect.setSize('100%', '50%');
                viewEffect.setPosition(0, 0);
                viewNormal.setSize('100%', '50%');
                viewNormal.setPosition(0, '50%');
            } else {
                viewNormal.setSize('50%', '100%');
                viewNormal.setPosition(0, 0);
                viewEffect.setSize('50%', '100%');
                viewEffect.setPosition('50%', 0);
            }
        }
    }, [redGPUContext, guiConfig?.compareLabel, showCompareLabel]);

    useEffect(() => {
        syncCompareViewLayout();
    }, [syncCompareViewLayout]);

    const updateContainerStyle = useCallback(() => {
        const container = guiConfig?.compareLabel?.targetContainer;
        if (container) {
            // [KO] 플로팅 레이아웃에서는 전체 화면(0~100%)을 온전히 사용
            // [EN] Use full screen (0~100%) in floating layout
            Object.assign(container.style, {
                position: 'fixed',
                top: '0',
                left: '0',
                width: '100%',
                bottom: '0'
            });

            setRect(container.getBoundingClientRect());
        } else {
            setRect(null);
        }
        syncCompareViewLayout();
    }, [guiConfig?.compareLabel?.targetContainer, syncCompareViewLayout]);

    useLayoutEffect(() => {
        updateContainerStyle();
    }, [updateContainerStyle]);

    useEffect(() => {
        const container = guiConfig?.compareLabel?.targetContainer;
        if (!container) return;

        const resizeObserver = new ResizeObserver(() => {
            updateContainerStyle();
        });

        resizeObserver.observe(container);
        window.addEventListener('resize', updateContainerStyle);

        return () => {
            resizeObserver.disconnect();
            window.removeEventListener('resize', updateContainerStyle);

            Object.assign(container.style, {
                position: '',
                top: '',
                left: '',
                width: '',
                bottom: ''
            });
        };
    }, [updateContainerStyle, guiConfig?.compareLabel?.targetContainer]);

    if (!guiConfig?.compareLabel || !redGPUContext || !showCompareLabel) return null;

    const {title, normalTitle = 'Normal'} = guiConfig.compareLabel;

    const baseStyle: React.CSSProperties = {
        position: 'fixed',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: '84px',
        boxSizing: 'border-box',
        padding: '7px 12px',
        backgroundColor: 'rgba(91, 82, 170, 0.85)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.35)',
        color: '#fff',
        fontSize: '11px',
        fontWeight: 600,
        pointerEvents: 'none',
        lineHeight: 1,
        zIndex: 10002,
    };

    const getStyle = (isNormal: boolean): React.CSSProperties => {
        const top = rect ? rect.top : 0;
        const left = rect ? rect.left : 0;
        const width = rect ? rect.width : window.innerWidth;
        const height = rect ? rect.height : window.innerHeight;
        const isPortrait = width < height;

        if (isPortrait) {
            return {
                ...baseStyle,
                left: left + 12,
                [isNormal ? 'top' : 'bottom']: isNormal
                    ? (top + height / 2 + 6)
                    : (window.innerHeight - (top + height / 2) + 6)
            };
        }
        return {
            ...baseStyle,
            bottom: '30px',
            left: left + width / 2,
            ...(isNormal ? {transform: 'translateX(calc(-100% - 6px))'} : {transform: 'translateX(6px)'})
        };
    };

    return (
        <>
            <div style={getStyle(true)}>{normalTitle}</div>
            <div style={getStyle(false)}>{title}</div>
        </>
    );
};

export default GuiCompareLabelHelper;
