import React from 'react';
import {useInspectorStore} from '../store';
import Section from "./commonUI/Section";
import StatItem from "./commonUI/StatItem";
import StatRGBAItem from "./commonUI/StatRGBAItem";
import StatBoolItem from "./commonUI/StatBoolItem";
import formatBytes from "@redgpu/src/utils/formatBytes";
import View3D from "@redgpu/src/display/view/View3D";
import AController from "@redgpu/src/camera/core/AController";

import Divider from "./commonUI/Divider";

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
    const {
        name,
        renderViewStateData,
        rawCamera,
        scene,
        useFrustumCulling,
        useDistanceCulling,
        camera,
        postEffectManager
    } = view;
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

            <Divider />

            <StatBoolItem label="useFrustumCulling" value={useFrustumCulling}/>
            <StatBoolItem label="useDistanceCulling" value={useDistanceCulling}/>
            <Divider />


            <StatItem label="x, y" value={`${formatNumber(x)}, ${formatNumber(y)}`}/>
            <StatItem label="width, height" value={`${width}, ${height}`}/>
            <StatItem label="pixelRectArray" value={`[${pixelRectArray.join(', ')}]`}/>
            <Divider />
            <Section title={'scene'}>
                <StatItem label="name" value={scene.name}/>
                <StatBoolItem label="useBackgroundColor" value={useBackgroundColor}/>
                <StatRGBAItem label="backgroundColor" value={backgroundColor.rgba}/>
            </Section>


            {camera && (camera instanceof AController || camera.constructor.name.includes('Controller') || ('camera' in camera && (camera as any).camera !== camera)) && (
                <>
                    <Divider />
                    <Section title={'controller'}>
                        <StatItem label="name" value={camera.name}/>
                        {camera['distance'] !== undefined &&
                            <StatItem label="distance" value={formatNumber(camera['distance'])}/>}
                        {camera['pan'] !== undefined && <StatItem label="pan" value={formatNumber(camera['pan'])}/>}
                        {camera['tilt'] !== undefined && <StatItem label="tilt" value={formatNumber(camera['tilt'])}/>}
                        {camera['zoom'] !== undefined && <StatItem label="zoom" value={formatNumber(camera['zoom'])}/>}
                        {camera['centerX'] !== undefined && (
                            <StatItem label="center"
                                      value={`${formatNumber(camera['centerX'])}, ${formatNumber(camera['centerY'])}, ${formatNumber(camera['centerZ'])}`}/>
                        )}
                        {camera['targetX'] !== undefined && (
                            <StatItem label="target"
                                      value={`${formatNumber(camera['targetX'])}, ${formatNumber(camera['targetY'] || 0)}, ${formatNumber(camera['targetZ'])}`}/>
                        )}
                    </Section>
                </>
            )}

            <Section title={'rawCamera'}>
                <StatItem label="name" value={rawCamera.name}/>
                <StatItem label="position"
                          value={`${formatNumber(rawCamera.x)}, ${formatNumber(rawCamera.y)}, ${formatNumber(rawCamera.z || 0)}`}/>
                {rawCamera['rotationX'] !== undefined && (
                    <StatItem label="rotation"
                              value={`${formatNumber(rawCamera['rotationX'])}, ${formatNumber(rawCamera['rotationY'])}, ${formatNumber(rawCamera['rotationZ'])}`}/>
                )}
                {rawCamera['fieldOfView'] !== undefined &&
                    <StatItem label="fieldOfView" value={formatNumber(rawCamera['fieldOfView'])}/>}
                {rawCamera['zoom'] !== undefined &&
                    <StatItem label="zoom" value={formatNumber(rawCamera['zoom'])}/>}
                {rawCamera['nearClipping'] !== undefined &&
                    <StatItem label="nearClipping" value={formatNumber(rawCamera['nearClipping'])}/>}
                {rawCamera['farClipping'] !== undefined &&
                    <StatItem label="farClipping" value={formatNumber(rawCamera['farClipping'])}/>}
                {rawCamera['top'] !== undefined && (
                    <StatItem label="top/bottom"
                              value={`${formatNumber(rawCamera['top'])}, ${formatNumber(rawCamera['bottom'])}`}/>
                )}
                {rawCamera['left'] !== undefined && (
                    <StatItem label="left/right"
                              value={`${formatNumber(rawCamera['left'])}, ${formatNumber(rawCamera['right'])}`}/>
                )}
                <Divider />
                <StatBoolItem label="useAutoExposure" value={rawCamera.useAutoExposure}/>
                <StatItem label="ev100" value={formatNumber(rawCamera.ev100)}/>

                {rawCamera.useAutoExposure && postEffectManager && (
                    <>
                        <Divider />
                        <Section title={'autoExposure'}>
                            <StatItem label="minEV100" value={formatNumber(postEffectManager.autoExposure.minEV100)}/>
                            <StatItem label="maxEV100" value={formatNumber(postEffectManager.autoExposure.maxEV100)}/>
                            <StatItem label="speedUp"
                                      value={formatNumber(postEffectManager.autoExposure.adaptationSpeedUp)}/>
                            <StatItem label="speedDown"
                                      value={formatNumber(postEffectManager.autoExposure.adaptationSpeedDown)}/>
                            <StatItem label="lowPercentile"
                                      value={formatNumber(postEffectManager.autoExposure.lowPercentile)}/>
                            <StatItem label="highPercentile"
                                      value={formatNumber(postEffectManager.autoExposure.highPercentile)}/>
                            <StatItem label="maxMultiplier"
                                      value={formatNumber(postEffectManager.autoExposure.maxExposureMultiplier)}/>
                            <StatItem label="meteringMode"
                                      value={['AVERAGE', 'CENTER_WEIGHTED', 'SPOT'][postEffectManager.autoExposure.meteringMode] || postEffectManager.autoExposure.meteringMode}/>
                            <StatItem label="targetLuminance"
                                      value={formatNumber(postEffectManager.autoExposure.targetLuminance)}/>
                            <StatItem label="compensation"
                                      value={formatNumber(postEffectManager.autoExposure.exposureCompensation)}/>
                        </Section>
                    </>
                )}
                {!rawCamera.useAutoExposure && (
                    <>
                        <StatItem label="aperture" value={`f/${formatNumber(rawCamera.aperture)}`}/>
                        <StatItem label="shutterSpeed"
                                  value={rawCamera.shutterSpeed >= 1 ? `${formatNumber(rawCamera.shutterSpeed)}s` : `1/${Math.round(1 / rawCamera.shutterSpeed)}s`}/>
                        <StatItem label="iso" value={rawCamera.iso}/>
                    </>
                )}
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

const placeholderStyle: React.CSSProperties = {
    padding: '20px',
    textAlign: 'center',
    color: '#666',
    fontSize: '12px',
    fontStyle: 'italic'
};

export default ViewListView;
