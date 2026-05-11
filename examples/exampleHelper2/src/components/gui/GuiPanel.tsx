import React, {useEffect, useRef, useState} from 'react';
import {ExampleHelperState, useExampleHelperStore} from '../../store';
import GUI from 'lil-gui';
import GuiRedGPUContext from './GuiRedGPUContext';

/**
 * [KO] lil-gui를 렌더링하고 관리하는 컴포넌트입니다.
 */
const GuiPanel: React.FC = () => {
    const guiConfig = useExampleHelperStore((state: ExampleHelperState) => state.guiConfig);
    const redGPUContext = useExampleHelperStore((state: ExampleHelperState) => state.redGPUContext);
    const guiContainerRef = useRef<HTMLDivElement>(null);
    const [guiInstance, setGuiInstance] = useState<GUI | null>(null);

    // lil-gui Initialization
    useEffect(() => {
        if (guiContainerRef.current && guiConfig) {
            const gui = new GUI({
                container: guiContainerRef.current,
            });
            setGuiInstance(gui);

            // [KO] 외부에서 정의한 커스텀 GUI 추가
            if (guiConfig.guiCallback) {
                guiConfig.guiCallback(gui);
            }

            return () => {
                gui.destroy();
                setGuiInstance(null);
            };
        }
    }, [guiConfig]);

    if (!guiConfig) return null;

    return (
        <>
            <div ref={guiContainerRef} style={guiContainerStyle} />
            {guiInstance && guiConfig.redGPUContext && redGPUContext && (
                <GuiRedGPUContext gui={guiInstance} redGPUContext={redGPUContext} />
            )}
            <style dangerouslySetInnerHTML={{ __html: lilGuiCustomStyle }} />
        </>
    );
};

const guiContainerStyle: React.CSSProperties = {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
};

const lilGuiCustomStyle = `
   
`;

export default GuiPanel;
