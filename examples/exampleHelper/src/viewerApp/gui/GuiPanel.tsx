import React, {useEffect, useRef, useState} from 'react';
import {ExampleHelperState, useExampleHelperStore} from '../../store';
import {Pane} from 'tweakpane';
import * as EssentialsPlugin from '@tweakpane/plugin-essentials';
import GuiRedGPUContext from './GuiRedGPUContext';
import GuiViewList from './GuiViewList';
import GuiScene from './GuiScene';
import GuiIBLHelper from "./GuiIBLHelper";
import GuiSkyBoxHelper from "./GuiSkyBoxHelper";

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
            if (guiConfig.gui) {
                try {
                    guiConfig.gui(pane);
                }catch (e) {
                    console.error('Error in custom GUI callback:', e);
                }

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
            {guiInstance && guiConfig.skybox && redGPUContext && redGPUContext.viewList[0] && (
                <GuiSkyBoxHelper gui={guiInstance} view={redGPUContext.viewList[0]}/>
            )}
            {/*{guiInstance && redGPUContext && (*/}
            {/*    <GuiDestroyTest gui={guiInstance} redGPUContext={redGPUContext}/>*/}
            {/*)}*/}
        </>
    );
};

interface GuiDestroyTestProps {
    gui: any;
    redGPUContext: any;
}

const GuiDestroyTest: React.FC<GuiDestroyTestProps> = ({gui, redGPUContext}) => {
    useEffect(() => {
        const btn = gui.addButton({
            title: 'destroy test',
        });
        btn.on('click', () => {
            console.log('💥 Calling redGPUContext.destroy() via tweakpane destroy test button');
            redGPUContext.destroy();
        });
        return () => {
            btn.dispose();
        };
    }, [gui, redGPUContext]);

    return null;
};

const guiContainerStyle: React.CSSProperties = {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
};

export default GuiPanel;
