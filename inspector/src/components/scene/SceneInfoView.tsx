import React from 'react';
import Section from "../common/Section";
import StatItem from "../common/StatItem";
import StatBoolItem from "../common/StatBoolItem";
import StatRGBAItem from "../common/StatRGBAItem";
import Scene from "@redgpu/src/display/scene/Scene";

/**
 * [KO] Scene의 기본 정보 및 설정을 표시하는 컴포넌트입니다.
 * [EN] Component that displays basic information and settings of a Scene.
 */
const SceneInfoView = ({scene}: { scene: Scene }) => {
    const {name, useBackgroundColor, backgroundColor} = scene;

    return (
        <Section title={'Scene'}>
            <StatItem label="name" value={name}/>
            <StatBoolItem label="useBackgroundColor" value={useBackgroundColor}/>
            <StatRGBAItem label="backgroundColor" value={backgroundColor.rgba}/>
        </Section>
    );
};

export default SceneInfoView;
