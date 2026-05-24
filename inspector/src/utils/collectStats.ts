import RedGPUContext from "@redgpu/src/context/RedGPUContext";
import {HierarchyNode, InspectorState} from "../store";
import {CommandBatchStats} from "@redgpu/src/renderer/commandEncoder/CommandEncoderManager";
import View3D from "@redgpu/src/display/view/View3D";
import RenderViewStateData from "@redgpu/src/display/view/core/RenderViewStateData";
import {Object3DContainer} from "@redgpu/src/display/mesh/core";

/**
 * [KO] Object3DContainer의 계층 구조를 재귀적으로 탐색하여 HierarchyNode로 변환합니다.
 */
const getHierarchy = (container: Object3DContainer): HierarchyNode => {
    const children = (container as any).children || [];
    return {
        id: (container as any).uuid || (container as any).instanceId || Math.random().toString(),
        name: (container as any).name || container.constructor.name,
        type: container.constructor.name,
        children: children.map((child: any) => getHierarchy(child))
    };
};

/**
 * [KO] 엔진의 실시간 통계를 수집하여 반환합니다.
 */
export const collectStats = (redGPUContext: RedGPUContext, time: number): Partial<InspectorState> => {
    let totalNum3DGroups = 0;
    let totalNum3DObjects = 0;
    let totalNumInstances = 0;
    let totalNumDrawCalls = 0;
    let totalNumTriangles = 0;
    let totalNumPoints = 0;
    let totalUsedVideoMemory = 0;
    let totalDeferredDestroyCount = 0;
    const aggregatedBatchStats: CommandBatchStats = {
        phases: {},
        deferredDestroyCount: 0
    };
    const hierarchy: Record<string, HierarchyNode> = {};

    const viewList = redGPUContext.viewList as View3D[];
    const viewListLen = viewList.length;

    // [KO] 모든 뷰의 통계 합산 (for 루프 최적화)
    for (let i = 0; i < viewListLen; i++) {
        const view = viewList[i];
        const state: RenderViewStateData = view.renderViewStateData;
        const {renderResults} = state;
        totalNum3DGroups += renderResults.num3DGroups;
        totalNum3DObjects += renderResults.num3DObjects;
        totalNumInstances += renderResults.numInstances;
        totalNumDrawCalls += renderResults.numDrawCalls;
        totalNumTriangles += renderResults.numTriangles;
        totalNumPoints += renderResults.numPoints;
        totalUsedVideoMemory += state.usedVideoMemory;

        // 계층 구조 수집
        if (view.scene) {
            hierarchy[view.name || `View ${i}`] = getHierarchy(view.scene);
        }

        if (state.commandBatchStats) {
            totalDeferredDestroyCount += state.commandBatchStats.deferredDestroyCount;
            for (const phase in state.commandBatchStats.phases) {
                const phaseStats = state.commandBatchStats.phases[phase];
                if (!aggregatedBatchStats.phases[phase]) {
                    aggregatedBatchStats.phases[phase] = {
                        'Command Buffers': 0,
                        'Render Passes': {count: 0, list: []},
                        'Compute Passes': {count: 0, list: []},
                        'Raw Usages': 0
                    };
                }
                const agg = aggregatedBatchStats.phases[phase];
                agg['Command Buffers'] += phaseStats['Command Buffers'];
                agg['Render Passes'].count += phaseStats['Render Passes'].count;

                // List merging optimization: avoid unnecessary Set objects and spreads
                const renderList = phaseStats['Render Passes'].list;
                const aggRenderList = agg['Render Passes'].list;
                for (let j = 0; j < renderList.length; j++) {
                    if (aggRenderList.indexOf(renderList[j]) === -1) aggRenderList.push(renderList[j]);
                }

                agg['Compute Passes'].count += phaseStats['Compute Passes'].count;
                const computeList = phaseStats['Compute Passes'].list;
                const aggComputeList = agg['Compute Passes'].list;
                for (let j = 0; j < computeList.length; j++) {
                    if (aggComputeList.indexOf(computeList[j]) === -1) aggComputeList.push(computeList[j]);
                }

                agg['Raw Usages'] += phaseStats['Raw Usages'];
            }
        }
    }
    aggregatedBatchStats.deferredDestroyCount = totalDeferredDestroyCount;

    const rm = redGPUContext.resourceManager;
    const resourceStats = {
        bitmapTexture: {
            count: rm.managedBitmapTextureState.table.size,
            videoMemory: rm.managedBitmapTextureState.videoMemory
        },
        cubeTexture: {
            count: rm.managedCubeTextureState.table.size,
            videoMemory: rm.managedCubeTextureState.videoMemory
        },
        hdrTexture: {count: rm.managedHDRTextureState.table.size, videoMemory: rm.managedHDRTextureState.videoMemory},
        uniformBuffer: {
            count: rm.managedUniformBufferState.table.size,
            videoMemory: rm.managedUniformBufferState.videoMemory
        },
        vertexBuffer: {
            count: rm.managedVertexBufferState.table.size,
            videoMemory: rm.managedVertexBufferState.videoMemory
        },
        indexBuffer: {
            count: rm.managedIndexBufferState.table.size,
            videoMemory: rm.managedIndexBufferState.videoMemory
        },
        storageBuffer: {
            count: rm.managedStorageBufferState.table.size,
            videoMemory: rm.managedStorageBufferState.videoMemory
        },
        gpuBuffer: {count: 0, videoMemory: 0}
    };

    totalUsedVideoMemory += resourceStats.bitmapTexture.videoMemory;
    totalUsedVideoMemory += resourceStats.cubeTexture.videoMemory;
    totalUsedVideoMemory += resourceStats.hdrTexture.videoMemory;
    totalUsedVideoMemory += resourceStats.uniformBuffer.videoMemory;
    totalUsedVideoMemory += resourceStats.vertexBuffer.videoMemory;
    totalUsedVideoMemory += resourceStats.indexBuffer.videoMemory;
    totalUsedVideoMemory += resourceStats.storageBuffer.videoMemory;

    const gpuBufferMap = rm.resources.get('GPUBuffer') as any;
    if (gpuBufferMap) {
        resourceStats.gpuBuffer.count = gpuBufferMap.size;
        resourceStats.gpuBuffer.videoMemory = gpuBufferMap.videoMemory || 0;
        totalUsedVideoMemory += resourceStats.gpuBuffer.videoMemory;
    }

    return {
        lastUpdateTime: time,
        totalNum3DGroups,
        totalNum3DObjects,
        totalNumInstances,
        totalNumDrawCalls,
        totalNumTriangles,
        totalNumPoints,
        totalUsedVideoMemory,
        pixelRectArray: redGPUContext.sizeManager.pixelRectArray, // Use reference if possible
        commandBatchStats: aggregatedBatchStats,
        hierarchy,
        resourceStats
    };
};
