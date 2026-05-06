import React from 'react';
import Section from "../common/Section";
import StatItem from "../common/StatItem";
import StatBoolItem from "../common/StatBoolItem";
import StatRGBAItem from "../common/StatRGBAItem";
import Divider from "../common/Divider";
import formatBytes from "@redgpu/src/utils/formatBytes";
import View3D from "@redgpu/src/display/view/View3D";
import AController from "@redgpu/src/camera/core/AController";
import {formatNumber} from "../../utils/format";

/**
 * [KO] 뷰의 렌더링 상태 및 기본 설정을 표시하는 탭 컴포넌트입니다.
 */
const ViewStateTab = ({view, lastUpdateTime}: { view: View3D, lastUpdateTime: number }) => {
    const {
        renderViewStateData,
        rawCamera,
        scene,
        useFrustumCulling,
        useDistanceCulling,
        camera
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
        <>
            <Section title="Rendering Statistics">
                <StatItem label="usedVideoMemory" value={formatBytes(usedVideoMemory)} color="#fdb48d" isBold={true}/>
                <StatItem label="viewRenderCPURecordingTime" value={`${viewRenderCPURecordingTime.toFixed(2)}ms`}/>
                <StatItem label="num3DGroups" value={num3DGroups}/>
                <StatItem label="num3DObjects" value={num3DObjects}/>
                <StatItem label="numInstances" value={numInstances}/>
                <StatItem label="numDrawCalls" value={numDrawCalls}/>
                <StatItem label="numTriangles" value={numTriangles}/>
                <StatItem label="numPoints" value={numPoints}/>
            </Section>

            <Section title="Culling Settings">
                <StatBoolItem label="useFrustumCulling" value={useFrustumCulling}/>
                <StatBoolItem label="useDistanceCulling" value={useDistanceCulling}/>
            </Section>

            <Section title="Viewport">
                <StatItem label="x, y" value={`${formatNumber(x)}, ${formatNumber(y)}`}/>
                <StatItem label="width, height" value={`${width}, ${height}`}/>
                <StatItem label="pixelRectArray" value={`[${pixelRectArray.join(', ')}]`}/>
            </Section>

            <Section title={'Scene'}>
                <StatItem label="name" value={scene.name}/>
                <StatBoolItem label="useBackgroundColor" value={useBackgroundColor}/>
                <StatRGBAItem label="backgroundColor" value={backgroundColor.rgba}/>
            </Section>


            {camera && (camera instanceof AController || camera.constructor.name.includes('Controller') || ('camera' in camera && (camera as any).camera !== camera)) && (
                <Section title={'Controller'}>
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
            )}

            <Section title={'Raw Camera'}>
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
                <Divider/>
                <StatBoolItem label="useAutoExposure" value={rawCamera.useAutoExposure}/>
                <StatItem label="ev100" value={formatNumber(rawCamera.ev100)}/>

                {!rawCamera.useAutoExposure && (
                    <>
                        <StatItem label="aperture" value={`f/${formatNumber(rawCamera.aperture)}`}/>
                        <StatItem label="shutterSpeed"
                                  value={rawCamera.shutterSpeed >= 1 ? `${formatNumber(rawCamera.shutterSpeed)}s` : `1/${Math.round(1 / rawCamera.shutterSpeed)}s`}/>
                        <StatItem label="iso" value={rawCamera.iso}/>
                    </>
                )}
            </Section>
        </>
    );
};

export default ViewStateTab;
