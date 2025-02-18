import Mesh from "../../../display/mesh/Mesh";
import MorphInfo_GLTF from "../cls/MorphInfo_GLTF";
import MorphInfoData_GLTF from "../cls/MorphInfoData_GLTF";

const gltfAnimationLooper_weight = (
    meshArray: Mesh[],
    animationDataList: number[],
    interpolationValue: number,
    prevTimeDataIndex: number,
    nextTimeDataIndex: number
) => {
    let animationTargetIndex;
    let targetMesh: Mesh;
    let targetData;
    let originData;
    let stride;
    let vertexIndex;
    let loopCount;
    let prevWeight, nextWeight;
    let prevWeight1, nextWeight1;
    let prevWeight2, nextWeight2;
    let baseVertexIndex;
    let morphLength;
    let targetMorphInfo: MorphInfo_GLTF;
    let targetMorphDataList: MorphInfoData_GLTF[];
    let morphIndex;
    let prevAnimationData;
    let nextAnimationData;
    let morphInterleaveData;
    let cacheKey;
    const PRIME_NUMBER = 9999991;
    animationTargetIndex = meshArray.length;
    while (animationTargetIndex--) {
        targetMesh = meshArray[animationTargetIndex];
        targetData = targetMesh.geometry.vertexBuffer.data;
        stride = targetMesh.geometry.vertexBuffer.stride;
        loopCount = targetData.length / stride;
        targetMorphInfo = targetMesh.animationInfo.morphInfo;
        originData = targetMorphInfo.origin;
        targetMorphDataList = targetMorphInfo.morphInfoDataList;
        morphLength = targetMorphDataList.length;
        let tempWeight;
        vertexIndex = 0;
        for (vertexIndex; vertexIndex < loopCount; vertexIndex++) {
            baseVertexIndex = vertexIndex * stride;
            let compositeKey = baseVertexIndex * PRIME_NUMBER + prevTimeDataIndex * PRIME_NUMBER + nextTimeDataIndex;
            cacheKey = targetMorphInfo.cacheData[compositeKey];
            if (cacheKey) {
                [prevWeight, nextWeight, prevWeight1, nextWeight1, prevWeight2, nextWeight2] = cacheKey;
            } else {
                prevWeight = originData[baseVertexIndex];
                nextWeight = originData[baseVertexIndex];
                prevWeight1 = originData[baseVertexIndex + 1];
                nextWeight1 = originData[baseVertexIndex + 1];
                prevWeight2 = originData[baseVertexIndex + 2];
                nextWeight2 = originData[baseVertexIndex + 2];
                morphIndex = morphLength;
                while (morphIndex--) {
                    prevAnimationData = animationDataList[prevTimeDataIndex * morphLength + morphIndex];
                    nextAnimationData = animationDataList[nextTimeDataIndex * morphLength + morphIndex];
                    morphInterleaveData = targetMorphDataList[morphIndex].interleaveData;
                    tempWeight = morphInterleaveData[baseVertexIndex];
                    prevWeight += prevAnimationData * tempWeight;
                    nextWeight += nextAnimationData * tempWeight;
                    tempWeight = morphInterleaveData[baseVertexIndex + 1];
                    prevWeight1 += prevAnimationData * tempWeight;
                    nextWeight1 += nextAnimationData * tempWeight;
                    tempWeight = morphInterleaveData[baseVertexIndex + 2];
                    prevWeight2 += prevAnimationData * tempWeight;
                    nextWeight2 += nextAnimationData * tempWeight;
                }
                targetMorphInfo.cacheData[compositeKey] = [prevWeight, nextWeight, prevWeight1, nextWeight1, prevWeight2, nextWeight2];
            }
            targetData[baseVertexIndex] = prevWeight + interpolationValue * (nextWeight - prevWeight);
            targetData[baseVertexIndex + 1] = prevWeight1 + interpolationValue * (nextWeight1 - prevWeight1);
            targetData[baseVertexIndex + 2] = prevWeight2 + interpolationValue * (nextWeight2 - prevWeight2);
        }
        targetMesh.geometry.vertexBuffer.updateAllData(targetData);
    }
}
export default gltfAnimationLooper_weight
