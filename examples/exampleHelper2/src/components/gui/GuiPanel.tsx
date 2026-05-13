import React, {useEffect, useRef, useState} from 'react';
import {ExampleHelperState, useExampleHelperStore} from '../../store';
import {Pane} from 'tweakpane';
import * as EssentialsPlugin from '@tweakpane/plugin-essentials';
import GuiRedGPUContext from './GuiRedGPUContext';
import GuiViewList from './GuiViewList';
import GuiScene from './GuiScene';
import GuiIBLHelper from "./GuiIBLHelper";

/**
 * [KO] Tweakpane을 렌더링하고 관리하는 컴포넌트입니다.
 */
const GuiPanel: React.FC = () => {
    const guiConfig = useExampleHelperStore((state: ExampleHelperState) => state.guiConfig);
    const redGPUContext = useExampleHelperStore((state: ExampleHelperState) => state.redGPUContext);
    const guiContainerRef = useRef<HTMLDivElement>(null);
    const [guiInstance, setGuiInstance] = useState<Pane | null>(null);

    // Tweakpane Initialization
    useEffect(() => {
        if (guiContainerRef.current && guiConfig) {
            const pane = new Pane({
                container: guiContainerRef.current,
            });
            pane.registerPlugin(EssentialsPlugin);
            setGuiInstance(pane);

            // [KO] 외부에서 정의한 커스텀 GUI 추가
            if (guiConfig.guiCallback) {
                guiConfig.guiCallback(pane);
            }

            return () => {
                pane.dispose();
                setGuiInstance(null);
            };
        }
    }, [guiConfig]);

    if (!guiConfig) return null;

    return (
        <>
            <div ref={guiContainerRef} style={guiContainerStyle}/>
            {guiInstance && guiConfig.redGPUContext && redGPUContext && (
                <GuiRedGPUContext gui={guiInstance} redGPUContext={redGPUContext}/>
            )}
            {guiInstance && guiConfig.viewList && redGPUContext && (
                <GuiViewList gui={guiInstance} redGPUContext={redGPUContext}/>
            )}
            {guiInstance && guiConfig.scene && redGPUContext && (
                <GuiScene gui={guiInstance} scene={redGPUContext.viewList[0]?.scene}/>
            )}
            {guiInstance && guiConfig.ibl && redGPUContext && redGPUContext.viewList[0] && (
                <GuiIBLHelper gui={guiInstance} view={redGPUContext.viewList[0]}/>
            )}

            <style dangerouslySetInnerHTML={{__html: tweakpaneCustomStyle}}/>
        </>
    );
};

const guiContainerStyle: React.CSSProperties = {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
};

const tweakpaneCustomStyle = `
    
    .tp-dfwv {
        width: 100% !important;
        position: static !important;
    }
    /* Label alignment across folders */
    .tp-lblv_l {
        width: 110px !important;
        min-width: 110px !important;
        padding-right: 4px !important;
    }
`;

export default GuiPanel;