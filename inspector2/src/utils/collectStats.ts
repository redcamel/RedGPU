import RedGPUContext from "../../../src/context/RedGPUContext";
import { InspectorState } from "../store";
import { CommandBatchStats } from "../../../src/renderer/commandEncoder/CommandEncoderManager";
import View3D from "../../../src/display/view/View3D";
import RenderViewStateData from "../../../src/display/view/core/RenderViewStateData";

/**
 * [KO] 엔진의 실시간 통계를 수집하여 반환합니다.
 * [EN] Collects and returns real-time engine statistics.
 */
export const collectStats = (redGPUContext: RedGPUContext, time: number): Partial<InspectorState> => {
    let totalNum3DGroups = 0;
    let totalNum3DObjects = 0;
    let totalNumInstances = 0;
    let totalNumDrawCalls = 0;
    let totalNumTriangles = 0;
    let totalNumPoints = 0;
    let totalUsedVideoMemory = 0;
    const aggregatedBatchStats: CommandBatchStats = {};

    // [KO] 모든 뷰의 통계 합산
    // [EN] Sum up statistics of all views
    for (const view of redGPUContext.viewList as View3D[]) {
        const state: RenderViewStateData = view.renderViewStateData;
        totalNum3DGroups += state.num3DGroups;
        totalNum3DObjects += state.num3DObjects;
        totalNumInstances += state.numInstances;
        totalNumDrawCalls += state.numDrawCalls;
        totalNumTriangles += state.numTriangles;
        totalNumPoints += state.numPoints;
        totalUsedVideoMemory += state.usedVideoMemory;

        // [KO] 커맨드 배치 통계 합산
        // [EN] Aggregate command batch statistics
        if (state.commandBatchStats) {
            for (const phase in state.commandBatchStats) {
                const phaseStats = state.commandBatchStats[phase];
                if (!aggregatedBatchStats[phase]) {
                    aggregatedBatchStats[phase] = {
                        'Command Buffers': 0,
                        'Render Passes': { count: 0, list: [] },
                        'Compute Passes': { count: 0, list: [] },
                        'Raw Usages': 0
                    };
                }
                const agg = aggregatedBatchStats[phase];
                agg['Command Buffers'] += phaseStats['Command Buffers'];
                agg['Render Passes'].count += phaseStats['Render Passes'].count;
                agg['Render Passes'].list = [...new Set([...agg['Render Passes'].list, ...phaseStats['Render Passes'].list])];
                agg['Compute Passes'].count += phaseStats['Compute Passes'].count;
                agg['Compute Passes'].list = [...new Set([...agg['Compute Passes'].list, ...phaseStats['Compute Passes'].list])];
                agg['Raw Usages'] += phaseStats['Raw Usages'];
            }
        }
    }

    // [KO] 리소스 매니저의 공유 리소스 메모리 합산
    // [EN] Sum up shared resource memory of the resource manager
    const rm = redGPUContext.resourceManager;
    
    const resourceStats = {
        bitmapTexture: { count: rm.managedBitmapTextureState.table.size, videoMemory: rm.managedBitmapTextureState.videoMemory },
        cubeTexture: { count: rm.managedCubeTextureState.table.size, videoMemory: rm.managedCubeTextureState.videoMemory },
        hdrTexture: { count: rm.managedHDRTextureState.table.size, videoMemory: rm.managedHDRTextureState.videoMemory },
        uniformBuffer: { count: rm.managedUniformBufferState.table.size, videoMemory: rm.managedUniformBufferState.videoMemory },
        vertexBuffer: { count: rm.managedVertexBufferState.table.size, videoMemory: rm.managedVertexBufferState.videoMemory },
        indexBuffer: { count: rm.managedIndexBufferState.table.size, videoMemory: rm.managedIndexBufferState.videoMemory },
        storageBuffer: { count: rm.managedStorageBufferState.table.size, videoMemory: rm.managedStorageBufferState.videoMemory },
        gpuBuffer: { count: 0, videoMemory: 0 }
    };

    totalUsedVideoMemory += resourceStats.bitmapTexture.videoMemory;
    totalUsedVideoMemory += resourceStats.cubeTexture.videoMemory;
    totalUsedVideoMemory += resourceStats.hdrTexture.videoMemory;
    totalUsedVideoMemory += resourceStats.uniformBuffer.videoMemory;
    totalUsedVideoMemory += resourceStats.vertexBuffer.videoMemory;
    totalUsedVideoMemory += resourceStats.indexBuffer.videoMemory;
    totalUsedVideoMemory += resourceStats.storageBuffer.videoMemory;

    // [KO] GPUBuffer 전용 메모리 트래킹 맵 합산
    // [EN] Sum up memory tracking map dedicated to GPUBuffer
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
        pixelRectArray: [...redGPUContext.sizeManager.pixelRectArray],
        commandBatchStats: aggregatedBatchStats,
        resourceStats
    };
};
