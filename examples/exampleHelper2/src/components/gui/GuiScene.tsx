import React, {useEffect} from 'react';
import RedGPUContext from "@redgpu/src/context/RedGPUContext";
import {addColorAlphaInputs} from "../../utils/guiUtils";

/**
 * [KO] RedGPUContext의 viewList에 포함된 Scene 설정을 tweakpane에 추가하는 컴포넌트입니다.
 * [EN] A component that adds Scene settings from RedGPUContext's viewList to tweakpane.
 */
interface GuiSceneProps {
    gui: any;
    redGPUContext: RedGPUContext;
}

const GuiScene: React.FC<GuiSceneProps> = ({gui, redGPUContext}) => {
    useEffect(() => {
        const views = redGPUContext.viewList;
        const scenes = views.map((v: any) => v.scene).filter((s: any, i: number, arr: any[]) => s && arr.indexOf(s) === i);
        
        if (scenes.length === 0) return;

        const sceneFolders: any[] = [];

        const addSceneControls = (scene: any, container: any) => {
            container.addInput(scene, 'useBackgroundColor');
            
            if (scene.backgroundColor) {
                addColorAlphaInputs(container, scene.backgroundColor);
            }
        };

        scenes.forEach((scene: any, index: number) => {
            const title = scene.name || (scenes.length === 1 ? 'Scene' : `Scene ${index}`);
            const sceneFolder = gui.addFolder({title});
            addSceneControls(scene, sceneFolder);
            sceneFolders.push(sceneFolder);
        });

        return () => {
            sceneFolders.forEach(folder => folder.dispose());
        };
    }, [gui, redGPUContext]);

    return null;
};

export default GuiScene;
