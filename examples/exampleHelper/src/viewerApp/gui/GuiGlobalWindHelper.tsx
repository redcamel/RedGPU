import React, {useEffect} from 'react';

/**
 * [KO] 전역 바람(WindManager) 설정을 위한 Tweakpane GUI 헬퍼 컴포넌트입니다.
 * [EN] Tweakpane GUI helper component for Global Wind (WindManager) settings.
 */
interface GuiGlobalWindHelperProps {
    gui: any;
    windManager: any;
}

const GuiGlobalWindHelper: React.FC<GuiGlobalWindHelperProps> = ({gui, windManager}) => {
    useEffect(() => {
        if (!windManager) return;

        const windFolder = gui.addFolder({title: 'Global Wind', expanded: true});

        windFolder.addBinding(windManager, 'enabled');

        windFolder.addBinding(windManager, 'directionAngle', {
            min: 0,
            max: 360,
            step: 0.1
        });

        windFolder.addBinding(windManager, 'speed', {
            min: 0,
            max: 5,
            step: 0.01
        });

        windFolder.addBinding(windManager, 'strength', {
            min: 0,
            max: 2,
            step: 0.01
        });

        return () => {
            windFolder.dispose();
        };
    }, [gui, windManager]);

    return null;
};

export default GuiGlobalWindHelper;
