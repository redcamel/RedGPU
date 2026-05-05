import React from 'react';
import {useInspectorStore} from '../store';
import Section from "./commonUI/Section";
import StatItem from "./commonUI/StatItem";
import StatRGBAItem from "./commonUI/StatRGBAItem";
import StatBoolItem from "./commonUI/StatBoolItem";
import formatBytes from "@redgpu/src/utils/formatBytes";
import View3D from "@redgpu/src/display/view/View3D";

/**
 * [KO] 엔진의 모든 뷰(View3D)의 상태를 표시하는 컴포넌트입니다.
 * [EN] Component that displays the state of all views (View3D) in the engine.
 */
const ViewListView = () => {
    const {redGPUContext, lastUpdateTime} = useInspectorStore();

    if (!redGPUContext) {
        return <div style={placeholderStyle}>RedGPUContext not initialized</div>;
    }

    const {viewList} = redGPUContext;

    return (
        <div style={containerStyle}>
            {viewList.map((view: View3D, index: number) => (
                <ViewSection key={index} view={view} lastUpdateTime={lastUpdateTime}/>
            ))}
        </div>
    );
};

const ViewSection = ({view, lastUpdateTime}: { view: View3D, lastUpdateTime: number }) => {
    const {name, renderViewStateData, rawCamera, scene, useFrustumCulling, useDistanceCulling} = view;
    const {
        usedVideoMemory,
        viewRenderCPURecordingTime,
        num3DGroups,
        num3DObjects,
        numInstances,
        numDrawCalls,
        numTriangles,
        numPoints,
        viewportSize
    } = renderViewStateData;

    const {x, y, width, height, pixelRectArray} = viewportSize;
    const {backgroundColor, useBackgroundColor} = scene;

    return (
        <Section title={name}>
            <StatItem label="usedVideoMemory" value={formatBytes(usedVideoMemory)} color="#fdb48d" isBold={true}/>
            <StatItem label="viewRenderCPURecordingTime" value={`${viewRenderCPURecordingTime.toFixed(2)}ms`}/>
            <StatItem label="num3DGroups" value={num3DGroups}/>
            <StatItem label="num3DObjects" value={num3DObjects}/>
            <StatItem label="numInstances" value={numInstances}/>
            <StatItem label="numDrawCalls" value={numDrawCalls}/>
            <StatItem label="numTriangles" value={numTriangles}/>
            <StatItem label="numPoints" value={numPoints}/>

            <div style={dividerStyle}/>

            <StatBoolItem label="useFrustumCulling" value={useFrustumCulling}/>
            <StatBoolItem label="useDistanceCulling" value={useDistanceCulling}/>
            <div style={dividerStyle}/>

            <StatItem label="x, y" value={`${formatNumber(x)}, ${formatNumber(y)}`}/>
            <StatItem label="width, height" value={`${width}, ${height}`}/>
            <StatItem label="pixelRectArray" value={`[${pixelRectArray.join(', ')}]`}/>
            <div style={dividerStyle}/>
            <Section title={'rawCamera'}>
                <StatItem label="rawCamera.name" value={rawCamera.name}/>
                <StatItem label="rawCamera.position"
                          value={`${formatNumber(rawCamera.x)}, ${formatNumber(rawCamera.y)}, ${formatNumber(rawCamera.z || 0)}`}/>
                {rawCamera['rotationX'] !== undefined && (
                    <StatItem label="rawCamera.rotation"
                              value={`${formatNumber(rawCamera['rotationX'])}, ${formatNumber(rawCamera['rotationY'])}, ${formatNumber(rawCamera['rotationZ'])}`}/>
                )}
                {rawCamera['fieldOfView'] !== undefined &&
                    <StatItem label="rawCamera.fieldOfView" value={formatNumber(rawCamera['fieldOfView'])}/>}
                {rawCamera['zoom'] !== undefined &&
                    <StatItem label="rawCamera.zoom" value={formatNumber(rawCamera['zoom'])}/>}
                {rawCamera['nearClipping'] !== undefined &&
                    <StatItem label="rawCamera.nearClipping" value={formatNumber(rawCamera['nearClipping'])}/>}
                {rawCamera['farClipping'] !== undefined &&
                    <StatItem label="rawCamera.farClipping" value={formatNumber(rawCamera['farClipping'])}/>}
            </Section>
            <Section title={'scene'}>
                <StatItem label="scene.name" value={scene.name}/>
                <StatBoolItem label="scene.useBackgroundColor" value={useBackgroundColor}/>
                <StatRGBAItem label="scene.backgroundColor" value={backgroundColor.rgba}/>
            </Section>
        </Section>
    );
};

const formatNumber = (val: any) => {
    const str = String(val);
    if (str.includes('%')) {
        const num = parseFloat(str);
        return isNaN(num) ? str : `${num.toFixed(2)}%`;
    }
    if (str.includes('px')) {
        const num = parseFloat(str);
        return isNaN(num) ? str : `${num.toFixed(2)}px`;
    }
    const num = parseFloat(str);
    return isNaN(num) ? str : num.toFixed(2);
};

// Styles
const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column'
};

const dividerStyle: React.CSSProperties = {
    height: '1px',
    background: 'rgba(255, 255, 255, 0.1)',
    margin: '8px 0'
};

const placeholderStyle: React.CSSProperties = {
    padding: '20px',
    textAlign: 'center',
    color: '#666',
    fontSize: '12px',
    fontStyle: 'italic'
};

export default ViewListView;
