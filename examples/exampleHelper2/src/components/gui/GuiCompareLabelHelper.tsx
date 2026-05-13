import React from 'react';
import {useExampleHelperStore} from "../../store";

/**
 * [KO] 뷰 비교를 위한 레이블을 표시하는 컴포넌트입니다.
 * [EN] Component that displays labels for view comparison.
 */
const GuiCompareLabelHelper: React.FC = () => {
    const guiConfig = useExampleHelperStore((state) => state.guiConfig);
    const redGPUContext = useExampleHelperStore((state) => state.redGPUContext);
    const isNarrow = useExampleHelperStore((state) => state.isNarrow);

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
        if (isNarrow) {
            return {
                ...baseStyle,
                left: 0,
                [isNormal ? 'bottom' : 'top']: isNormal ? '50%' : 'calc(50% + 1px)'
            };
        }
        return {
            ...baseStyle,
            bottom: '50px',
            left: '50%',
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
