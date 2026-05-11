import React, {useEffect, useRef} from 'react';
import {ExampleHelperState, useExampleHelperStore} from '../store';
import GUI from 'lil-gui';

/**
 * [KO] lil-gui를 렌더링하고 관리하는 컴포넌트입니다.
 */
const GuiPanel: React.FC = () => {
    const guiCallback = useExampleHelperStore((state: ExampleHelperState) => state.guiCallback);
    const guiContainerRef = useRef<HTMLDivElement>(null);

    // lil-gui Initialization
    useEffect(() => {
        if (guiContainerRef.current && guiCallback) {
            const gui = new GUI({
                container: guiContainerRef.current,
                title: 'Parameters'
            });
            guiCallback(gui);
            return () => {
                gui.destroy();
            };
        }
    }, [guiCallback]);

    if (!guiCallback) return null;

    return (
        <>
            <div ref={guiContainerRef} style={guiContainerStyle} />
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
    .lil-gui {
        --background-color: transparent;
        --text-color: #eee;
        --title-background-color: rgba(255, 255, 255, 0.05);
        --title-text-color: #fdb48d;
        --widget-color: rgba(255, 255, 255, 0.1);
        --hover-color: rgba(255, 255, 255, 0.15);
        --focus-color: rgba(255, 255, 255, 0.2);
        --number-color: #00e5ff;
        --string-color: #89ff00;
        --font-size: 11px;
        --input-font-size: 11px;
        --font-family: 'monospace';
        --padding: 4px;
        --spacing: 4px;
        --widget-height: 24px;
        --name-width: 40%;
        --slider-knob-width: 2px;
        --checkbox-size: 14px;
        
        width: 100% !important;
        box-shadow: none !important;
        border: none !important;
    }
    .lil-gui.root {
        width: 100% !important;
    }
    .lil-gui .title {
        font-weight: bold;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        padding: 8px 12px !important;
    }
    .lil-gui .controller {
        padding: 4px 0 !important;
        margin-left: 0 !important;
        border-left: none !important;
    }
    .lil-gui .controller .name {
        color: #888 !important;
    }
    .lil-gui .controller input {
        background: rgba(0,0,0,0.3) !important;
        border: 1px solid rgba(255,255,255,0.1) !important;
        border-radius: 2px !important;
    }
`;

export default GuiPanel;
