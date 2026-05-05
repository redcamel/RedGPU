import RedGPUContext from "../../../src/context/RedGPUContext";
import { InspectorState } from "../store";

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

    // [KO] 모든 뷰의 통계 합산
    // [EN] Sum up statistics of all views
    for (const view of redGPUContext.viewList) {
        const state = view.renderViewStateData;
        totalNum3DGroups += state.num3DGroups;
        totalNum3DObjects += state.num3DObjects;
        totalNumInstances += state.numInstances;
        totalNumDrawCalls += state.numDrawCalls;
        totalNumTriangles += state.numTriangles;
        totalNumPoints += state.numPoints;
        totalUsedVideoMemory += state.usedVideoMemory;
    }

    // [KO] 리소스 매니저의 공유 리소스 메모리 합산
    // [EN] Sum up shared resource memory of the resource manager
    const rm = redGPUContext.resourceManager;
    totalUsedVideoMemory += rm.managedBitmapTextureState.videoMemory;
    totalUsedVideoMemory += rm.managedCubeTextureState.videoMemory;
    totalUsedVideoMemory += rm.managedHDRTextureState.videoMemory;
    totalUsedVideoMemory += rm.managedUniformBufferState.videoMemory;
    totalUsedVideoMemory += rm.managedVertexBufferState.videoMemory;
    totalUsedVideoMemory += rm.managedIndexBufferState.videoMemory;
    totalUsedVideoMemory += rm.managedStorageBufferState.videoMemory;

    // [KO] GPUBuffer 전용 메모리 트래킹 맵 합산
    // [EN] Sum up memory tracking map dedicated to GPUBuffer
    const gpuBufferMap = rm.resources.get('GPUBuffer') as any;
    if (gpuBufferMap && gpuBufferMap.videoMemory) {
        totalUsedVideoMemory += gpuBufferMap.videoMemory;
    }

    return {
        lastUpdateTime: time,
        totalNum3DGroups,
        totalNum3DObjects,
        totalNumInstances,
        totalNumDrawCalls,
        totalNumTriangles,
        totalNumPoints,
        totalUsedVideoMemory
    };
};
