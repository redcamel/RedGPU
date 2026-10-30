import React, {useEffect, useState} from 'react';
import {ExampleHelperState, useExampleHelperStore} from '../../store';
import SelectBox from '../../common/components/basic/SelectBox';
import TONE_MAPPING_MODE from "@redgpu/src/toneMapping/TONE_MAPPING_MODE";

/**
 * [KO] 톤 매핑 및 안티앨리어싱 설정을 포함하는 공통 선택 박스 그룹 컴포넌트입니다.
 */
const RenderingSettingsGroup: React.FC = () => {
    const redGPUContext = useExampleHelperStore((state: ExampleHelperState) => state.redGPUContext);
    const isNarrow = useExampleHelperStore((state: ExampleHelperState) => state.isNarrow);

    const [antialiasing, setAntialiasing] = useState<string>('useMSAA');
    const [toneMapping, setToneMapping] = useState<string>(TONE_MAPPING_MODE.KHRONOS_PBR_NEUTRAL);

    useEffect(() => {
        if (redGPUContext) {
            const aaManager = redGPUContext.antialiasingManager;
            if (aaManager.useMSAA) setAntialiasing('useMSAA');
            else if (aaManager.useFXAA) setAntialiasing('useFXAA');
            else if (aaManager.useTAA) setAntialiasing('useTAA');
            else setAntialiasing('NONE');

            if (redGPUContext.viewList.length > 0) {
                const firstView = redGPUContext.viewList[0];
                if (firstView.toneMappingManager) {
                    setToneMapping(firstView.toneMappingManager.mode);
                }
            }
        }
    }, [redGPUContext]);

    const handleAntialiasingChange = (value: string) => {
        setAntialiasing(value);
        if (redGPUContext) {
            const manager = redGPUContext.antialiasingManager;
            manager.useMSAA = false;
            manager.useFXAA = false;
            manager.useTAA = false;
            if (value === 'useMSAA') manager.useMSAA = true;
            else if (value === 'useFXAA') manager.useFXAA = true;
            else if (value === 'useTAA') manager.useTAA = true;
        }
    };

    const handleToneMappingChange = (value: string) => {
        setToneMapping(value);
        if (redGPUContext) {
            redGPUContext.viewList.forEach((view: any) => {
                if (view.toneMappingManager) {
                    view.toneMappingManager.mode = value as TONE_MAPPING_MODE;
                }
            });
        }
    };

    const aaOptions = [
        {value: 'NONE', label: 'None'},
        {value: 'useMSAA', label: 'MSAA'},
        {value: 'useFXAA', label: 'FXAA'},
        {value: 'useTAA', label: 'TAA'},
    ];

    const formatToneMappingLabel = (key: string) => {
        switch (key) {
            case 'KHRONOS_PBR_NEUTRAL':
                return 'Khronos PBR';
            case 'ACES_FILMIC_HILL':
                return 'ACES Hill';
            case 'ACES_FILMIC_NARKOWICZ':
                return 'ACES Narkowicz';
            case 'LINEAR':
                return 'Linear';
            default:
                return key.replace(/_/g, ' ');
        }
    };

    const tmOptions = Object.entries(TONE_MAPPING_MODE).map(([key, value]) => ({
        value,
        label: formatToneMappingLabel(key)
    }));

    return (
        <>
            <SelectBox
                label="Tone"
                value={toneMapping}
                options={tmOptions}
                style={isNarrow ? {flex: 1.4, minWidth: 0} : undefined}
                onChange={handleToneMappingChange}
            />

            <div style={dividerStyle}/>

            <SelectBox
                label="AA"
                value={antialiasing}
                options={aaOptions}
                style={isNarrow ? {flex: 1, minWidth: 0} : undefined}
                onChange={handleAntialiasingChange}
            />
        </>
    );
};

const dividerStyle: React.CSSProperties = {
    width: '1px',
    height: '16px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    margin: '0 2px',
    flexShrink: 0,
    alignSelf: 'center'
};

export default RenderingSettingsGroup;
