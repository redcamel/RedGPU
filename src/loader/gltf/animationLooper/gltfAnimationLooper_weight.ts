import Mesh from "../../../display/mesh/Mesh";
import MorphInfo_GLTF from "../cls/MorphInfo_GLTF";
import MorphInfoData_GLTF from "../cls/MorphInfoData_GLTF";

const PRIME_NUMBER = 9999991;

let animationTargetIndex: number;
let targetMesh: Mesh;
let targetData: Float32Array;
let originData: Float32Array;
let stride: number;
let vertexIndex: number;
let loopCount: number;
let prevWeight: number, nextWeight: number;
let prevWeight1: number, nextWeight1: number;
let prevWeight2: number, nextWeight2: number;
let baseVertexIndex: number;
let morphLength: number;
let targetMorphInfo: MorphInfo_GLTF;
let targetMorphDataList: MorphInfoData_GLTF[];
let morphIndex: number;
let prevAnimationData: number;
let nextAnimationData: number;
let morphInterleaveData: Float32Array;
let cacheKey: number[] | undefined;
let arrayStride: number;
let compositeKey: number;
let tempWeight: number;


const tempUpdateData = new Float32Array(3);
const interpolationDiff = new Float32Array(3);

const gltfAnimationLooper_weight = (
    meshArray: Mesh[],
    animationDataList: number[],
    interpolationValue: number,
    prevTimeDataIndex: number,
    nextTimeDataIndex: number
) => {
    animationTargetIndex = meshArray.length;

    while (animationTargetIndex--) {
        targetMesh = meshArray[animationTargetIndex];
        targetData = targetMesh.geometry.vertexBuffer.data;
        stride = targetMesh.geometry.vertexBuffer.stride;
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
            } else {
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
                    tempWeight = morphInterleaveData[baseVertexIndex];
                    prevWeight += prevAnimationData * tempWeight;
                    nextWeight += nextAnimationData * tempWeight;

                    // Y 컴포넌트
                    tempWeight = morphInterleaveData[baseVertexIndex + 1];
                    prevWeight1 += prevAnimationData * tempWeight;
                    nextWeight1 += nextAnimationData * tempWeight;

                    // Z 컴포넌트
                    tempWeight = morphInterleaveData[baseVertexIndex + 2];
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
    }
};

export default gltfAnimationLooper_weight;