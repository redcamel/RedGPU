import React, {useEffect, useState} from 'react';
import {ExampleHelperState, useExampleHelperStore} from '../store';
import SelectBox from './basic/SelectBox';
import TONE_MAPPING_MODE from "@redgpu/src/toneMapping/TONE_MAPPING_MODE";

/**
 * [KO] 톤 매핑 및 안티앨리어싱 설정을 포함하는 공통 선택 박스 그룹 컴포넌트입니다.
 */
const RenderingSettingsGroup: React.FC = () => {
    const redGPUContext = useExampleHelperStore((state: ExampleHelperState) => state.redGPUContext);

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
        { value: 'NONE', label: 'NONE' },
        { value: 'useMSAA', label: 'MSAA' },
        { value: 'useFXAA', label: 'FXAA' },
        { value: 'useTAA', label: 'TAA' },
    ];

    const tmOptions = Object.entries(TONE_MAPPING_MODE).map(([key, value]) => ({
        value,
        label: key.replace(/_/g, ' ')
    }));

    return (
        <>
            <SelectBox
                label="TONE MAPPING"
                value={toneMapping}
                options={tmOptions}
                onChange={handleToneMappingChange}
            />

            <SelectBox
                label="ANTIALIASING"
                value={antialiasing}
                options={aaOptions}
                onChange={handleAntialiasingChange}
            />
        </>
    );
};

export default RenderingSettingsGroup;
