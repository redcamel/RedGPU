import React from 'react';
import { useInspectorStore } from '../store';
import Section from "./commonUI/Section";
import StatItem from "./commonUI/StatItem";
import View3D from "@redgpu/src/display/view/View3D";

/**
 * [KO] 각 뷰의 톤 매핑 설정을 표시하는 컴포넌트입니다.
 * [EN] Component that displays tone mapping settings for each view.
 */
const ToneMappingView = () => {
    const { redGPUContext } = useInspectorStore();

    if (!redGPUContext) return null;

    const { viewList } = redGPUContext;

    return (
        <>
            {viewList.map((view: View3D, index: number) => (
                <Section key={index} title={`ToneMapping`}>
                    <StatItem label="Mode" value={view.toneMappingManager.mode} />
                    <StatItem label="Contrast" value={view.toneMappingManager.contrast.toFixed(2)} />
                    <StatItem label="Brightness" value={view.toneMappingManager.brightness.toFixed(2)} />
                </Section>
            ))}
        </>
    );
};

export default ToneMappingView;
