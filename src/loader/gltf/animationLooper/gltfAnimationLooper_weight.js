const PRIME_NUMBER = 9999991;
let animationTargetIndex;
let targetMesh;
let targetData;
let originData;
let stride;
let stride2;
let vertexIndex;
let loopCount;
let prevWeight, nextWeight;
let prevWeight1, nextWeight1;
let prevWeight2, nextWeight2;
let baseVertexIndex;
let baseVertexIndex2;
let morphLength;
let targetMorphInfo;
let targetMorphDataList;
let morphIndex;
let prevAnimationData;
let nextAnimationData;
let morphInterleaveData;
let cacheKey;
let arrayStride;
let compositeKey;
let tempWeight;
const tempUpdateData = new Float32Array(3);
const interpolationDiff = new Float32Array(3);
const gltfAnimationLooper_weight = (meshArray, animationDataList, interpolationValue, prevTimeDataIndex, nextTimeDataIndex) => {
    animationTargetIndex = meshArray.length;
    while (animationTargetIndex--) {
        targetMesh = meshArray[animationTargetIndex];
        targetData = targetMesh.geometry.vertexBuffer.data;
        stride = targetMesh.geometry.vertexBuffer.stride;
        stride2 = 3;
        arrayStride = targetMesh.geometry.vertexBuffer.interleavedStruct.arrayStride;
        loopCount = targetData.length / stride;
        targetMorphInfo = targetMesh.animationInfo.morphInfo;
        originData = targetMorphInfo.origin;
        targetMorphDataList = targetMorphInfo.morphInfoDataList;
        morphLength = targetMorphDataList.length;
        // 사전 계산된 인덱스 오프셋들
        const prevTimeOffset = prevTimeDataIndex * morphLength;
        const nextTimeOffset = nextTimeDataIndex * morphLength;
        vertexIndex = 0;
        for (vertexIndex; vertexIndex < loopCount; vertexIndex++) {
            baseVertexIndex = vertexIndex * stride;
            baseVertexIndex2 = vertexIndex * stride2;
            // 캐시 키 계산 (한 번에)
            compositeKey = baseVertexIndex * PRIME_NUMBER + prevTimeDataIndex * PRIME_NUMBER + nextTimeDataIndex;
            cacheKey = targetMorphInfo.cacheData[compositeKey];
            if (cacheKey) {
                // 캐시된 데이터 사용
                prevWeight = cacheKey[0];
                nextWeight = cacheKey[1];
                prevWeight1 = cacheKey[2];
                nextWeight1 = cacheKey[3];
                prevWeight2 = cacheKey[4];
                nextWeight2 = cacheKey[5];
            }
            else {
                // 원본 데이터로 초기화
                prevWeight = originData[baseVertexIndex];
                nextWeight = originData[baseVertexIndex];
                prevWeight1 = originData[baseVertexIndex + 1];
                nextWeight1 = originData[baseVertexIndex + 1];
                prevWeight2 = originData[baseVertexIndex + 2];
                nextWeight2 = originData[baseVertexIndex + 2];
                // Morph 데이터 적용
                morphIndex = morphLength;
                while (morphIndex--) {
                    // 애니메이션 데이터 미리 계산
                    prevAnimationData = animationDataList[prevTimeOffset + morphIndex];
                    nextAnimationData = animationDataList[nextTimeOffset + morphIndex];
                    morphInterleaveData = targetMorphDataList[morphIndex].interleaveData;
                    // X 컴포넌트
                    tempWeight = morphInterleaveData[baseVertexIndex2];
                    prevWeight += prevAnimationData * tempWeight;
                    nextWeight += nextAnimationData * tempWeight;
                    // Y 컴포넌트
                    tempWeight = morphInterleaveData[baseVertexIndex2 + 1];
                    prevWeight1 += prevAnimationData * tempWeight;
                    nextWeight1 += nextAnimationData * tempWeight;
                    // Z 컴포넌트
                    tempWeight = morphInterleaveData[baseVertexIndex2 + 2];
                    prevWeight2 += prevAnimationData * tempWeight;
                    nextWeight2 += nextAnimationData * tempWeight;
                }
                // 캐시에 저장 (배열 재사용하지 않고 새로 생성 - 원본 동작 유지)
                targetMorphInfo.cacheData[compositeKey] = [
                    prevWeight, nextWeight, prevWeight1,
                    nextWeight1, prevWeight2, nextWeight2
                ];
            }
            // 보간 계산 및 데이터 업데이트
            interpolationDiff[0] = nextWeight - prevWeight;
            interpolationDiff[1] = nextWeight1 - prevWeight1;
            interpolationDiff[2] = nextWeight2 - prevWeight2;
            targetData[baseVertexIndex] = prevWeight + interpolationValue * interpolationDiff[0];
            targetData[baseVertexIndex + 1] = prevWeight1 + interpolationValue * interpolationDiff[1];
            targetData[baseVertexIndex + 2] = prevWeight2 + interpolationValue * interpolationDiff[2];
            // 업데이트 데이터 준비
            tempUpdateData[0] = targetData[baseVertexIndex];
            tempUpdateData[1] = targetData[baseVertexIndex + 1];
            tempUpdateData[2] = targetData[baseVertexIndex + 2];
            // 버퍼 업데이트
            // targetMesh.geometry.vertexBuffer.updateData(
            //     tempUpdateData,
            //     arrayStride * vertexIndex
            // );
        }
        targetMesh.geometry.vertexBuffer.updateData(targetData, 0);
    }
};
export default gltfAnimationLooper_weight;
