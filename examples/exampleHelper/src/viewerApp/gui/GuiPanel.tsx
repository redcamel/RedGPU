import React, {useEffect, useRef, useState} from 'react';
import {ExampleHelperState, useExampleHelperStore} from '../../store';
import {Pane} from 'tweakpane';
import * as EssentialsPlugin from '@tweakpane/plugin-essentials';
import GuiRedGPUContext from './GuiRedGPUContext';
import GuiViewList from './GuiViewList';
import GuiScene from './GuiScene';
import GuiIBLHelper from "./GuiIBLHelper";
import GuiSkyBoxHelper from "./GuiSkyBoxHelper";
import GuiDirectionalShadowHelper from "./GuiDirectionalShadowHelper";
import GuiGlobalWindHelper from "./GuiGlobalWindHelper";

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

    const firstView = redGPUContext?.viewList[0];

    return (
        <>
            <div ref={guiContainerRef} style={guiContainerStyle}/>
            {guiInstance && redGPUContext && (
                <>
                    {guiConfig.redGPUContext && <GuiRedGPUContext gui={guiInstance} redGPUContext={redGPUContext}/>}
                    {guiConfig.viewList && <GuiViewList gui={guiInstance} redGPUContext={redGPUContext}/>}
                    {guiConfig.scene && <GuiScene gui={guiInstance} scene={firstView?.scene}/>}
                    {guiConfig.directionalShadow && firstView?.scene?.shadowManager?.directionalShadowManager && (
                        <GuiDirectionalShadowHelper gui={guiInstance}
                                                    directionalShadowManager={firstView.scene.shadowManager.directionalShadowManager}/>
                    )}
                    {guiConfig.globalWind && firstView?.scene?.windManager && (
                        <GuiGlobalWindHelper gui={guiInstance}
                                             windManager={firstView.scene.windManager}
                                             expanded={typeof guiConfig.globalWind === 'object' ? guiConfig.globalWind.expanded : false}/>
                    )}
                    {guiConfig.ibl && firstView && <GuiIBLHelper gui={guiInstance} view={firstView}/>}
                    {guiConfig.skybox && firstView && <GuiSkyBoxHelper gui={guiInstance} view={firstView}/>}
                </>
            )}
        </>
    );
};

const guiContainerStyle: React.CSSProperties = {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
};

export default GuiPanel;
