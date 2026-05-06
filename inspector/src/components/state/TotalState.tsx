import React from 'react';
import {useInspectorStore} from '../../store';
import formatBytes from '@redgpu/src/utils/formatBytes';
import Section from "../common/Section";
import StatItem from "../common/StatItem";

/**
 * [KO] 엔진의 전반적인 상태 통계를 표시하는 컴포넌트입니다.
 * [EN] Component that displays overall engine state statistics.
 */
const TotalState = () => {
    const {
        totalNum3DGroups,
        totalNum3DObjects,
        totalNumInstances,
        totalNumDrawCalls,
        totalNumTriangles,
        totalNumPoints,
        totalUsedVideoMemory,
    } = useInspectorStore();

    return (
        <Section title="Total State">
            <StatItem label="Groups" value={totalNum3DGroups}/>
            <StatItem label="Objects" value={totalNum3DObjects}/>
            <StatItem label="Instances" value={totalNumInstances}/>
            <StatItem label="Draw Calls" value={totalNumDrawCalls} color="#fdb48d" isBold/>
            <StatItem label="Triangles" value={totalNumTriangles.toLocaleString()}/>
            <StatItem label="Points" value={totalNumPoints.toLocaleString()}/>
            <StatItem label="Video Memory" value={formatBytes(totalUsedVideoMemory)} color="#fdb48d" isBold/>
        </Section>
    );
};

export default TotalState;
