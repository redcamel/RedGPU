let tempIDX;
let nX, nY, nZ, pX, pY, pZ;
let nXOut, nYOut, nZOut, pXOut, pYOut, pZOut;
let startV, startOut, endV, endIn;

const gltfAnimationLooper_transition = (
    interpolation,
    animationTargetMesh,
    targetAnimationDataList,
    targetTimeDataListLength,
    interpolationValue,
    previousTimeDataIDX,
    nextTimeDataIDX,
    s0, s1, s2, s3
) => {
    if (interpolation === 'CUBICSPLINE') {
        // 경계 조건 체크 (조기 종료)
        if (previousTimeDataIDX === targetTimeDataListLength - 1) return;

        // 이전 키프레임 데이터
        tempIDX = previousTimeDataIDX * 9;
        nX = targetAnimationDataList[tempIDX + 3];
        nY = targetAnimationDataList[tempIDX + 4];
        nZ = targetAnimationDataList[tempIDX + 5];
        pXOut = targetAnimationDataList[tempIDX + 6];
        pYOut = targetAnimationDataList[tempIDX + 7];
        pZOut = targetAnimationDataList[tempIDX + 8];

        // 다음 키프레임 데이터
        tempIDX = nextTimeDataIDX * 9;
        nXOut = targetAnimationDataList[tempIDX];
        nYOut = targetAnimationDataList[tempIDX + 1];
        nZOut = targetAnimationDataList[tempIDX + 2];
        pX = targetAnimationDataList[tempIDX + 3];
        pY = targetAnimationDataList[tempIDX + 4];
        pZ = targetAnimationDataList[tempIDX + 5];

        // Cubic spline 보간 및 직접 할당 (X, Y, Z 동시 처리)
        startOut = pXOut * interpolationValue;
        endIn = nXOut * interpolationValue;
        animationTargetMesh.x = s0 * pX + s1 * startOut + s2 * nX + s3 * endIn;

        startOut = pYOut * interpolationValue;
        endIn = nYOut * interpolationValue;
        animationTargetMesh.y = s0 * pY + s1 * startOut + s2 * nY + s3 * endIn;

        startOut = pZOut * interpolationValue;
        endIn = nZOut * interpolationValue;
        animationTargetMesh.z = s0 * pZ + s1 * startOut + s2 * nZ + s3 * endIn;

    } else {
        // Linear 보간
        // 다음 키프레임 스케일
        tempIDX = nextTimeDataIDX * 3;
        nX = targetAnimationDataList[tempIDX];
        nY = targetAnimationDataList[tempIDX + 1];
        nZ = targetAnimationDataList[tempIDX + 2];

        // 이전 키프레임 스케일
        tempIDX = previousTimeDataIDX * 3;
        pX = targetAnimationDataList[tempIDX];
        pY = targetAnimationDataList[tempIDX + 1];
        pZ = targetAnimationDataList[tempIDX + 2];

        // Linear 보간 및 직접 할당 (한 번에)
        animationTargetMesh.x = pX + interpolationValue * (nX - pX);
        animationTargetMesh.y = pY + interpolationValue * (nY - pY);
        animationTargetMesh.z = pZ + interpolationValue * (nZ - pZ);
    }
};

export default gltfAnimationLooper_transition;