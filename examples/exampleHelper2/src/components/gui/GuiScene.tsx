import React, {useEffect} from 'react';
import {addColorAlphaInputs} from "../../utils/guiUtils";

/**
 * [KO] Scene 설정을 tweakpane에 추가하는 헬퍼 함수입니다.
 * [EN] A helper function that adds Scene settings to tweakpane.
 */
export const addSceneControls = (scene: any, container: any) => {
    container.addBinding(scene, 'useBackgroundColor');

    if (scene.backgroundColor) {
        addColorAlphaInputs(container, scene.backgroundColor);
    }
};

/**
 * [KO] 단일 Scene 설정을 tweakpane에 추가하는 컴포넌트입니다.
 * [EN] A component that adds a single Scene settings to tweakpane.
 */
interface GuiSceneProps {
    gui: any;
    scene: any;
}

const GuiScene: React.FC<GuiSceneProps> = ({gui, scene}) => {
    useEffect(() => {
        if (!scene) return;

        const title = scene.name || 'Scene';
        const sceneFolder = gui.addFolder({title});
        addSceneControls(scene, sceneFolder);

        return () => {
            sceneFolder.dispose();
        };
    }, [gui, scene]);

    return null;
};

export default GuiScene;
