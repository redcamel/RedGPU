import {glMatrix} from "gl-matrix";

const gltfAnimationLooper_rotation = (
    interpolation,
    animationTargetMesh,
    targetAnimationDataList,
    targetTimeDataListLength,
    interpolationValue,
    previousTimeDataIDX,
    nextTimeDataIDX,
    s0?: number, s1?: number, s2?: number, s3?: number
) => {
    let nX, nY, nZ, nW, nXIn, nYIn, nZIn, nWIn;
    let pX, pY, pZ, pW, pXOut, pYOut, pZOut, pWOut;
    let startV, startOut, endV, endIn;
    let x, y, z, w, len;
    let tempIDX
    let needCalc = true
    if (interpolation == 'CUBICSPLINE') {
        if (previousTimeDataIDX != targetTimeDataListLength - 1) {
            // prevRotation
            tempIDX = previousTimeDataIDX * 12
            x = targetAnimationDataList[tempIDX + 4];
            y = targetAnimationDataList[tempIDX + 5];
            z = targetAnimationDataList[tempIDX + 6];
            w = targetAnimationDataList[tempIDX + 7];
            len = x * x + y * y + z * z + w * w;
            if (len > 0) len = 1 / Math.sqrt(len);
            pX = x * len;
            pY = y * len;
            pZ = z * len;
            pW = w * len;
            // prevRotationOut
            x = targetAnimationDataList[tempIDX + 8];
            y = targetAnimationDataList[tempIDX + 9];
            z = targetAnimationDataList[tempIDX + 10];
            w = targetAnimationDataList[tempIDX + 11];
            len = x * x + y * y + z * z + w * w;
            if (len > 0) len = 1 / Math.sqrt(len);
            pXOut = x * len;
            pYOut = y * len;
            pZOut = z * len;
            pWOut = w * len;
            // nexRotationIn
            x = targetAnimationDataList[tempIDX];
            y = targetAnimationDataList[tempIDX + 1];
            z = targetAnimationDataList[tempIDX + 2];
            w = targetAnimationDataList[tempIDX + 3];
            len = x * x + y * y + z * z + w * w;
            if (len > 0) len = 1 / Math.sqrt(len);
            nXIn = x * len;
            nYIn = y * len;
            nZIn = z * len;
            nWIn = w * len;
            // nextRotation
            tempIDX = nextTimeDataIDX * 12
            x = targetAnimationDataList[tempIDX + 4];
            y = targetAnimationDataList[tempIDX + 5];
            z = targetAnimationDataList[tempIDX + 6];
            w = targetAnimationDataList[tempIDX + 7];
            len = x * x + y * y + z * z + w * w;
            if (len > 0) len = 1 / Math.sqrt(len);
            nX = x * len;
            nY = y * len;
            nZ = z * len;
            nW = w * len;
            // tQuat
            startV = pX;
            startOut = pXOut * interpolationValue;
            endV = nX;
            endIn = nXIn * interpolationValue;
            x = s0 * startV + s1 * startOut + s2 * endV + s3 * endIn;
            //
            startV = pY;
            startOut = pYOut * interpolationValue;
            endV = nY;
            endIn = nYIn * interpolationValue;
            y = s0 * startV + s1 * startOut + s2 * endV + s3 * endIn;
            //
            startV = pZ;
            startOut = pZOut * interpolationValue;
            endV = nZ;
            endIn = nZIn * interpolationValue;
            z = s0 * startV + s1 * startOut + s2 * endV + s3 * endIn;
            //
            startV = pW;
            startOut = pWOut * interpolationValue;
            endV = nW;
            endIn = nWIn * interpolationValue;
            w = s0 * startV + s1 * startOut + s2 * endV + s3 * endIn;
        } else {
            needCalc = false
        }
    } else {
        /////////////////////////////////////////////
        // quat.normalize(prevRotation, prevRotation);
        // quat.normalize(nextRotation, nextRotation);
        // prevRotation
        tempIDX = previousTimeDataIDX * 4
        x = targetAnimationDataList[tempIDX];
        y = targetAnimationDataList[tempIDX + 1];
        z = targetAnimationDataList[tempIDX + 2];
        w = targetAnimationDataList[tempIDX + 3];
        len = x * x + y * y + z * z + w * w;
        if (len > 0) len = 1 / Math.sqrt(len);
        pX = x * len;
        pY = y * len;
        pZ = z * len;
        pW = w * len;
        // nextRotation
        tempIDX = nextTimeDataIDX * 4
        x = targetAnimationDataList[tempIDX];
        y = targetAnimationDataList[tempIDX + 1];
        z = targetAnimationDataList[tempIDX + 2];
        w = targetAnimationDataList[tempIDX + 3];
        len = x * x + y * y + z * z + w * w;
        if (len > 0) len = 1 / Math.sqrt(len);
        nX = x * len;
        nY = y * len;
        nZ = z * len;
        nW = w * len;
        /////////////////////////////////////////////
        let omega, cosom, sinom, scale0, scale1;
        // calc cosine
        cosom = pX * nX + pY * nY + pZ * nZ + pW * nW;
        // adjust signs (if necessary)
        if (cosom < 0.0) {
            cosom = -cosom;
            nX = -nX;
            nY = -nY;
            nZ = -nZ;
            nW = -nW;
        }
        // calculate coefficients
        if ((1.0 - cosom) > glMatrix.EPSILON) {
            // standard case (slerp)
            omega = Math.acos(cosom);
            sinom = Math.sin(omega);
            scale0 = Math.sin((1.0 - interpolationValue) * omega) / sinom;
            scale1 = Math.sin(interpolationValue * omega) / sinom;
        } else {
            // "from" and "to" quaternions are very close
            //  ... so we can do a linear interpolation
            scale0 = 1.0 - interpolationValue;
            scale1 = interpolationValue;
        }
        // calculate final values
        // tQuat
        x = scale0 * pX + scale1 * nX;
        y = scale0 * pY + scale1 * nY;
        z = scale0 * pZ + scale1 * nZ;
        w = scale0 * pW + scale1 * nW;
    }
    if (needCalc) {
        let rotationMTX = [];
        let tRotation = [0, 0, 0];
        // UTIL.quaternionToRotationMat4(tQuat, rotationMTX);
        // UTIL.mat4ToEuler(rotationMTX, tRotation);
        //////////////////////////////////////////////////////////
        let x2 = x + x, y2 = y + y, z2 = z + z;
        let xx = x * x2, xy = x * y2, xz = x * z2;
        let yy = y * y2, yz = y * z2, zz = z * z2;
        let wx = w * x2, wy = w * y2, wz = w * z2;
        rotationMTX[0] = 1 - (yy + zz);
        rotationMTX[4] = xy - wz;
        rotationMTX[8] = xz + wy;
        rotationMTX[1] = xy + wz;
        rotationMTX[5] = 1 - (xx + zz);
        rotationMTX[9] = yz - wx;
        rotationMTX[2] = xz - wy;
        rotationMTX[6] = yz + wx;
        rotationMTX[10] = 1 - (xx + yy);
        // last column
        rotationMTX[3] = 0;
        rotationMTX[7] = 0;
        rotationMTX[11] = 0;
        // bottom row
        rotationMTX[12] = 0;
        rotationMTX[13] = 0;
        rotationMTX[14] = 0;
        rotationMTX[15] = 1;
        // Assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)
        let m11 = rotationMTX[0], m12 = rotationMTX[4], m13 = rotationMTX[8];
        let m22 = rotationMTX[5], m23 = rotationMTX[9];
        let m32 = rotationMTX[6], m33 = rotationMTX[10];
        tRotation[1] = Math.asin(Math.max(-1, Math.min(1, m13)));
        if (Math.abs(m13) < 0.99999) {
            tRotation[0] = Math.atan2(-m23, m33);
            tRotation[2] = Math.atan2(-m12, m11);
        } else {
            tRotation[0] = Math.atan2(m32, m22);
            tRotation[2] = 0;
        }
        //////////////////////////////////////////////////////////
        tRotation[0] = -(tRotation[0] * 180 / Math.PI);
        tRotation[1] = -(tRotation[1] * 180 / Math.PI);
        tRotation[2] = -(tRotation[2] * 180 / Math.PI);
        animationTargetMesh.rotationX = tRotation[0];
        animationTargetMesh.rotationY = tRotation[1];
        animationTargetMesh.rotationZ = tRotation[2];
    }
}
export default gltfAnimationLooper_rotation
