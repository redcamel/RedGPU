import { glMatrix } from "gl-matrix";

// 사전 계산된 상수들
const EPSILON = glMatrix.EPSILON;
const PI_180 = 180 / Math.PI;

// 재사용 가능한 임시 변수들 (모듈 레벨에서 한 번만 생성)
let tempX, tempY, tempZ, tempW, tempLen, tempInvLen;
let prevX, prevY, prevZ, prevW, nextX, nextY, nextZ, nextW;
let cosom, omega, sinom, scale0, scale1;
let x2, y2, z2, xx, xy, xz, yy, yz, zz, wx, wy, wz;
let m11, m12, m13, m22, m23, m32, m33;

const gltfAnimationLooper_rotation = (
    interpolation,
    animationTargetMesh,
    targetAnimationDataList,
    targetTimeDataListLength,
    interpolationValue,
    previousTimeDataIDX,
    nextTimeDataIDX,
    s0, s1, s2, s3
) => {
    // 경계 조건 체크 (조기 종료)
    if (previousTimeDataIDX === targetTimeDataListLength - 1) return;

    if (interpolation === 'CUBICSPLINE') {
        let prevIdx = previousTimeDataIDX * 12;
        let nextIdx = nextTimeDataIDX * 12;

        // 이전 키프레임 quaternion 정규화
        tempX = targetAnimationDataList[prevIdx + 4];
        tempY = targetAnimationDataList[prevIdx + 5];
        tempZ = targetAnimationDataList[prevIdx + 6];
        tempW = targetAnimationDataList[prevIdx + 7];
        tempLen = tempX * tempX + tempY * tempY + tempZ * tempZ + tempW * tempW;
        if (tempLen > 0) {
            tempInvLen = 1 / Math.sqrt(tempLen);
            prevX = tempX * tempInvLen;
            prevY = tempY * tempInvLen;
            prevZ = tempZ * tempInvLen;
            prevW = tempW * tempInvLen;
        } else {
            prevX = prevY = prevZ = 0;
            prevW = 1;
        }

        // 이전 아웃 탄젠트 정규화
        tempX = targetAnimationDataList[prevIdx + 8];
        tempY = targetAnimationDataList[prevIdx + 9];
        tempZ = targetAnimationDataList[prevIdx + 10];
        tempW = targetAnimationDataList[prevIdx + 11];
        tempLen = tempX * tempX + tempY * tempY + tempZ * tempZ + tempW * tempW;
        let prevOutX, prevOutY, prevOutZ, prevOutW;
        if (tempLen > 0) {
            tempInvLen = 1 / Math.sqrt(tempLen);
            prevOutX = tempX * tempInvLen;
            prevOutY = tempY * tempInvLen;
            prevOutZ = tempZ * tempInvLen;
            prevOutW = tempW * tempInvLen;
        } else {
            prevOutX = prevOutY = prevOutZ = 0;
            prevOutW = 1;
        }

        // 다음 인 탄젠트 정규화
        tempX = targetAnimationDataList[nextIdx];
        tempY = targetAnimationDataList[nextIdx + 1];
        tempZ = targetAnimationDataList[nextIdx + 2];
        tempW = targetAnimationDataList[nextIdx + 3];
        tempLen = tempX * tempX + tempY * tempY + tempZ * tempZ + tempW * tempW;
        let nextInX, nextInY, nextInZ, nextInW;
        if (tempLen > 0) {
            tempInvLen = 1 / Math.sqrt(tempLen);
            nextInX = tempX * tempInvLen;
            nextInY = tempY * tempInvLen;
            nextInZ = tempZ * tempInvLen;
            nextInW = tempW * tempInvLen;
        } else {
            nextInX = nextInY = nextInZ = 0;
            nextInW = 1;
        }

        // 다음 키프레임 quaternion 정규화
        tempX = targetAnimationDataList[nextIdx + 4];
        tempY = targetAnimationDataList[nextIdx + 5];
        tempZ = targetAnimationDataList[nextIdx + 6];
        tempW = targetAnimationDataList[nextIdx + 7];
        tempLen = tempX * tempX + tempY * tempY + tempZ * tempZ + tempW * tempW;
        if (tempLen > 0) {
            tempInvLen = 1 / Math.sqrt(tempLen);
            nextX = tempX * tempInvLen;
            nextY = tempY * tempInvLen;
            nextZ = tempZ * tempInvLen;
            nextW = tempW * tempInvLen;
        } else {
            nextX = nextY = nextZ = 0;
            nextW = 1;
        }

        // Cubic spline 보간
        tempX = s0 * prevX + s1 * prevOutX * interpolationValue + s2 * nextX + s3 * nextInX * interpolationValue;
        tempY = s0 * prevY + s1 * prevOutY * interpolationValue + s2 * nextY + s3 * nextInY * interpolationValue;
        tempZ = s0 * prevZ + s1 * prevOutZ * interpolationValue + s2 * nextZ + s3 * nextInZ * interpolationValue;
        tempW = s0 * prevW + s1 * prevOutW * interpolationValue + s2 * nextW + s3 * nextInW * interpolationValue;

    } else {
        // Linear/Step 보간
        let prevIdx = previousTimeDataIDX * 4;
        let nextIdx = nextTimeDataIDX * 4;

        // 이전 키프레임 quaternion 정규화
        tempX = targetAnimationDataList[prevIdx];
        tempY = targetAnimationDataList[prevIdx + 1];
        tempZ = targetAnimationDataList[prevIdx + 2];
        tempW = targetAnimationDataList[prevIdx + 3];
        tempLen = tempX * tempX + tempY * tempY + tempZ * tempZ + tempW * tempW;
        if (tempLen > 0) {
            tempInvLen = 1 / Math.sqrt(tempLen);
            prevX = tempX * tempInvLen;
            prevY = tempY * tempInvLen;
            prevZ = tempZ * tempInvLen;
            prevW = tempW * tempInvLen;
        } else {
            prevX = prevY = prevZ = 0;
            prevW = 1;
        }

        // 다음 키프레임 quaternion 정규화
        tempX = targetAnimationDataList[nextIdx];
        tempY = targetAnimationDataList[nextIdx + 1];
        tempZ = targetAnimationDataList[nextIdx + 2];
        tempW = targetAnimationDataList[nextIdx + 3];
        tempLen = tempX * tempX + tempY * tempY + tempZ * tempZ + tempW * tempW;
        if (tempLen > 0) {
            tempInvLen = 1 / Math.sqrt(tempLen);
            nextX = tempX * tempInvLen;
            nextY = tempY * tempInvLen;
            nextZ = tempZ * tempInvLen;
            nextW = tempW * tempInvLen;
        } else {
            nextX = nextY = nextZ = 0;
            nextW = 1;
        }

        // SLERP 보간
        cosom = prevX * nextX + prevY * nextY + prevZ * nextZ + prevW * nextW;

        // 최단 경로 선택
        if (cosom < 0) {
            cosom = -cosom;
            nextX = -nextX;
            nextY = -nextY;
            nextZ = -nextZ;
            nextW = -nextW;
        }

        if ((1 - cosom) > EPSILON) {
            omega = Math.acos(cosom);
            sinom = Math.sin(omega);
            scale0 = Math.sin((1 - interpolationValue) * omega) / sinom;
            scale1 = Math.sin(interpolationValue * omega) / sinom;
        } else {
            scale0 = 1 - interpolationValue;
            scale1 = interpolationValue;
        }

        tempX = scale0 * prevX + scale1 * nextX;
        tempY = scale0 * prevY + scale1 * nextY;
        tempZ = scale0 * prevZ + scale1 * nextZ;
        tempW = scale0 * prevW + scale1 * nextW;
    }

    // Quaternion to Euler 변환
    x2 = tempX + tempX;
    y2 = tempY + tempY;
    z2 = tempZ + tempZ;
    xx = tempX * x2;
    xy = tempX * y2;
    xz = tempX * z2;
    yy = tempY * y2;
    yz = tempY * z2;
    zz = tempZ * z2;
    wx = tempW * x2;
    wy = tempW * y2;
    wz = tempW * z2;

    // 직접 오일러 각도 계산
    m13 = xz + wy;
    m11 = 1 - (yy + zz);
    m12 = xy - wz;
    m23 = yz - wx;
    m33 = 1 - (xx + yy);
    m32 = yz + wx;
    m22 = 1 - (xx + zz);

    tempY = Math.asin(Math.max(-1, Math.min(1, m13)));

    if (Math.abs(m13) < 0.99999) {
        tempX = Math.atan2(-m23, m33);
        tempZ = Math.atan2(-m12, m11);
    } else {
        tempX = Math.atan2(m32, m22);
        tempZ = 0;
    }

    // 라디안을 도로 변환하고 결과 적용 (한 번에)
    animationTargetMesh.rotationX = -(tempX * PI_180);
    animationTargetMesh.rotationY = -(tempY * PI_180);
    animationTargetMesh.rotationZ = -(tempZ * PI_180);
};

export default gltfAnimationLooper_rotation;