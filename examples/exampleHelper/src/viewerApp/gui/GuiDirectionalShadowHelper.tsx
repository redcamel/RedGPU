import React, {useEffect} from 'react';

/**
 * [KO] Directional Shadow (CSM + PCSS) 설정을 위한 Tweakpane GUI 헬퍼 컴포넌트입니다.
 * [EN] Tweakpane GUI helper component for Directional Shadow (CSM + PCSS) settings.
 */
interface GuiDirectionalShadowHelperProps {
    gui: any;
    directionalShadowManager: any;
}

const GuiDirectionalShadowHelper: React.FC<GuiDirectionalShadowHelperProps> = ({gui, directionalShadowManager}) => {
    useEffect(() => {
        if (!directionalShadowManager) return;

        const shadowFolder = gui.addFolder({title: 'Directional Shadow (CSM + PCSS)', expanded: true});

        shadowFolder.addBinding(directionalShadowManager, 'pcssLightSize', {
            label: 'PCSS Light Size',
            min: 0.1,
            max: 10,
            step: 0.1
        });

        shadowFolder.addBinding(directionalShadowManager, 'cascadeCount', {
            label: 'Cascade Count',
            min: 1,
            max: 4,
            step: 1
        });

        shadowFolder.addBinding(directionalShadowManager, 'maxShadowDistance', {
            label: 'Max Distance (m)',
            min: 10,
            max: 1000,
            step: 10
        });

        shadowFolder.addBinding(directionalShadowManager, 'bias', {
            label: 'Depth Bias',
            min: 0,
            max: 0.01,
            step: 0.00001
        });

        shadowFolder.addBinding(directionalShadowManager, 'strength', {
            label: 'Strength',
            min: 0,
            max: 1,
            step: 0.01
        });

        shadowFolder.addBinding(directionalShadowManager, 'shadowDepthTextureSize', {
            label: 'Texture Size',
            options: {
                '1024': 1024,
                '2048': 2048,
                '4096': 4096,
            }
        });

        return () => {
            shadowFolder.dispose();
        };
    }, [gui, directionalShadowManager]);

    return null;
};

export default GuiDirectionalShadowHelper;
