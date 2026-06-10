import React, {memo} from 'react';
import {useInspectorStore} from '../../store';
import formatBytes from '@redgpu/src/utils/formatBytes';
import Section from "../common/Section";
import StatItem from "../common/StatItem";

/**
 * [KO] 엔진의 전반적인 상태 통계를 표시하는 컴포넌트입니다.
 */
const TotalState = memo(() => {
    const totalNum3DGroups = useInspectorStore(state => state.totalNum3DGroups);
    const totalNum3DObjects = useInspectorStore(state => state.totalNum3DObjects);
    const totalNumInstances = useInspectorStore(state => state.totalNumInstances);
    const totalNumDrawCalls = useInspectorStore(state => state.totalNumDrawCalls);
    const totalNumTriangles = useInspectorStore(state => state.totalNumTriangles);
    const totalNumPoints = useInspectorStore(state => state.totalNumPoints);
    const totalUsedVideoMemory = useInspectorStore(state => state.totalUsedVideoMemory);

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
});

export default TotalState;
