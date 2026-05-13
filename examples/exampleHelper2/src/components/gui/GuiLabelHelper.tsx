import React from 'react';
import {useExampleHelperStore} from "../../store";

/**
 * [KO] 뷰 비교를 위한 레이블을 표시하는 컴포넌트입니다.
 * [EN] Component that displays labels for view comparison.
 */
const GuiLabelHelper: React.FC = () => {
    const guiConfig = useExampleHelperStore((state) => state.guiConfig);
    const redGPUContext = useExampleHelperStore((state) => state.redGPUContext);
    const isNarrow = useExampleHelperStore((state) => state.isNarrow);

    if (!guiConfig?.label || !redGPUContext) return null;

    const {title, normalTitle = 'Normal'} = guiConfig.label;

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

    // [KO] isNarrow(세로형 레이아웃)인 경우 상단/하단 영역에 각각 배치
    // [EN] In case of isNarrow (vertical layout), place in the top/bottom areas respectively
    const normalLabelStyle: React.CSSProperties = isNarrow ? {
        ...baseStyle,
        bottom: '50%',
        left: 0,
    } : {
        ...baseStyle,
        bottom: '50px', // Footer height
        left: '50%',
        transform: 'translateX(calc(-100% - 1px))',
    };

    const effectLabelStyle: React.CSSProperties = isNarrow ? {
        ...baseStyle,
        top: 'calc(50% + 1px)', // Footer height
        left: 0,
    } : {
        ...baseStyle,
        bottom: '50px', // Footer height
        left: '50%',
    };

    return (
        <>
            <div style={normalLabelStyle}>{normalTitle}</div>
            <div style={effectLabelStyle}>{title}</div>
        </>
    );
};

export default GuiLabelHelper;
