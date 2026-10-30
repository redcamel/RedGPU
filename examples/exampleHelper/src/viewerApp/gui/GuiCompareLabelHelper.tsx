import React, {useCallback, useEffect, useLayoutEffect, useState} from 'react';
import {useExampleHelperStore} from '../../store';

/**
 * [KO] 뷰 비교를 위한 레이블을 표시하는 컴포넌트입니다.
 * [EN] Component that displays labels for view comparison.
 */
const GuiCompareLabelHelper: React.FC = () => {
    const guiConfig = useExampleHelperStore((state) => state.guiConfig);
    const redGPUContext = useExampleHelperStore((state) => state.redGPUContext);
    const isNarrow = useExampleHelperStore((state) => state.isNarrow);
    const [rect, setRect] = useState<DOMRect | null>(null);

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
    }, [guiConfig?.compareLabel?.targetContainer, isNarrow]);

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

    if (!guiConfig?.compareLabel || !redGPUContext) return null;

    const {title, normalTitle = 'Normal'} = guiConfig.compareLabel;

    const baseStyle: React.CSSProperties = {
        position: 'fixed',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
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
        zIndex: 10,
    };

    const getStyle = (isNormal: boolean): React.CSSProperties => {
        const top = rect ? rect.top : 0;
        const left = rect ? rect.left : 0;
        const width = rect ? rect.width : window.innerWidth;
        const height = rect ? rect.height : window.innerHeight;

        if (isNarrow) {
            return {
                ...baseStyle,
                left: left + 12,
                [isNormal ? 'bottom' : 'top']: isNormal
                    ? (window.innerHeight - (top + height / 2) + 6)
                    : (top + height / 2 + 6)
            };
        }
        return {
            ...baseStyle,
            bottom: '16px',
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
