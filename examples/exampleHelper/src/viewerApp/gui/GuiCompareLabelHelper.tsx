import React, {useCallback, useEffect, useLayoutEffect, useState} from 'react';
import {useExampleHelperStore} from '../../store';

// [KO] 레이아웃 상수 정의
// [EN] Define layout constants
const HEADER_HEIGHT = 51;
const FOOTER_HEIGHT_NORMAL = 50;
const FOOTER_HEIGHT_NARROW = 148;

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
            const bottomOffset = isNarrow ? FOOTER_HEIGHT_NARROW : FOOTER_HEIGHT_NORMAL;

            // [KO] 컨테이너 스타일 직접 설정 (고정 위치 및 영역 확보)
            // [EN] Set container styles directly (fixed position and area allocation)
            Object.assign(container.style, {
                position: 'fixed',
                top: `${HEADER_HEIGHT}px`,
                left: '0',
                width: '100%',
                bottom: `${bottomOffset}px`
            });

            setRect(container.getBoundingClientRect());
        } else {
            setRect(null);
        }
    }, [guiConfig?.compareLabel?.targetContainer, isNarrow]);

    // [KO] 브라우저가 그리기 전에 스타일을 즉시 적용하여 레이아웃 어긋남 방지
    // [EN] Apply styles immediately before the browser paints to prevent layout mismatch
    useLayoutEffect(() => {
        updateContainerStyle();
    }, [updateContainerStyle]);

    useEffect(() => {
        const container = guiConfig?.compareLabel?.targetContainer;
        if (!container) return;

        // [KO] ResizeObserver를 사용하여 컨테이너 크기 변화 정밀 감지
        // [EN] Use ResizeObserver for precise detection of container size changes
        const resizeObserver = new ResizeObserver(() => {
            updateContainerStyle();
        });

        resizeObserver.observe(container);
        window.addEventListener('resize', updateContainerStyle);

        return () => {
            resizeObserver.disconnect();
            window.removeEventListener('resize', updateContainerStyle);

            // [KO] 컴포넌트 언마운트 시 스타일 초기화
            // [EN] Reset styles when component unmounts
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
        padding: '8px 10px',
        backgroundColor: '#5b52aa',
        color: '#fff',
        fontSize: '12px',
        fontWeight: 600,
        pointerEvents: 'none',
        lineHeight: 1,
        zIndex: 10,
    };

    const getStyle = (isNormal: boolean): React.CSSProperties => {
        // [KO] rect가 아직 계산되지 않았을 경우를 위한 기본값 설정
        // [EN] Set default values for when rect is not yet calculated
        const top = rect ? rect.top : HEADER_HEIGHT;
        const left = rect ? rect.left : 0;
        const width = rect ? rect.width : window.innerWidth;
        const footerHeight = isNarrow ? FOOTER_HEIGHT_NARROW : FOOTER_HEIGHT_NORMAL;
        const height = rect ? rect.height : (window.innerHeight - (HEADER_HEIGHT + footerHeight));

        if (isNarrow) {
            return {
                ...baseStyle,
                left: left,
                [isNormal ? 'bottom' : 'top']: isNormal
                    ? (window.innerHeight - (top + height / 2))
                    : (top + height / 2 + 1)
            };
        }
        return {
            ...baseStyle,
            bottom: window.innerHeight - (top + height),
            left: left + width / 2,
            ...(isNormal ? {transform: 'translateX(calc(-100% - 1px))'} : {})
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
