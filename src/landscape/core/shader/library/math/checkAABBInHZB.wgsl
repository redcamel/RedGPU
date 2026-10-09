fn checkAABBInHZB(
    minPos: vec3<f32>,
    maxPos: vec3<f32>,
    viewProjectionMatrix: mat4x4<f32>,
    hzbTexture: texture_2d<f32>,
    hzbSampler: sampler,
    depthBias: f32
) -> bool {

    let col0 = viewProjectionMatrix[0];
    let col1 = viewProjectionMatrix[1];
    let col2 = viewProjectionMatrix[2];
    let col3 = viewProjectionMatrix[3];

    let xMin0 = minPos.x * col0;
    let xMax0 = maxPos.x * col0;
    let yMin1 = minPos.y * col1;
    let yMax1 = maxPos.y * col1;
    let zMin2 = minPos.z * col2;
    let zMax2 = maxPos.z * col2;

    let baseZ0 = zMin2 + col3;
    let baseZ1 = zMax2 + col3;

    let xy00 = xMin0 + yMin1;
    let xy10 = xMax0 + yMin1;
    let xy01 = xMin0 + yMax1;
    let xy11 = xMax0 + yMax1;

    let c0 = xy00 + baseZ0;
    let c1 = xy10 + baseZ0;
    let c2 = xy01 + baseZ0;
    let c3 = xy11 + baseZ0;
    let c4 = xy00 + baseZ1;
    let c5 = xy10 + baseZ1;
    let c6 = xy01 + baseZ1;
    let c7 = xy11 + baseZ1;

    if (c0.w <= 0.01 || c1.w <= 0.01 || c2.w <= 0.01 || c3.w <= 0.01 ||
        c4.w <= 0.01 || c5.w <= 0.01 || c6.w <= 0.01 || c7.w <= 0.01) {
        return true;
    }

    let invW0 = 1.0 / c0.w;
    var minNDC = c0.xy * invW0;
    var maxNDC = minNDC;
    var minDepth = c0.z * invW0;

    let invW1 = 1.0 / c1.w;
    let ndc1 = c1.xy * invW1;
    minNDC = min(minNDC, ndc1);
    maxNDC = max(maxNDC, ndc1);
    minDepth = min(minDepth, c1.z * invW1);

    let invW2 = 1.0 / c2.w;
    let ndc2 = c2.xy * invW2;
    minNDC = min(minNDC, ndc2);
    maxNDC = max(maxNDC, ndc2);
    minDepth = min(minDepth, c2.z * invW2);

    let invW3 = 1.0 / c3.w;
    let ndc3 = c3.xy * invW3;
    minNDC = min(minNDC, ndc3);
    maxNDC = max(maxNDC, ndc3);
    minDepth = min(minDepth, c3.z * invW3);

    let invW4 = 1.0 / c4.w;
    let ndc4 = c4.xy * invW4;
    minNDC = min(minNDC, ndc4);
    maxNDC = max(maxNDC, ndc4);
    minDepth = min(minDepth, c4.z * invW4);

    let invW5 = 1.0 / c5.w;
    let ndc5 = c5.xy * invW5;
    minNDC = min(minNDC, ndc5);
    maxNDC = max(maxNDC, ndc5);
    minDepth = min(minDepth, c5.z * invW5);

    let invW6 = 1.0 / c6.w;
    let ndc6 = c6.xy * invW6;
    minNDC = min(minNDC, ndc6);
    maxNDC = max(maxNDC, ndc6);
    minDepth = min(minDepth, c6.z * invW6);

    let invW7 = 1.0 / c7.w;
    let ndc7 = c7.xy * invW7;
    minNDC = min(minNDC, ndc7);
    maxNDC = max(maxNDC, ndc7);
    minDepth = min(minDepth, c7.z * invW7);

    if (minDepth <= 0.001) {
        return true;
    }

    let minUV = clamp(vec2<f32>(minNDC.x * 0.5 + 0.5, 1.0 - (maxNDC.y * 0.5 + 0.5)), vec2<f32>(0.0), vec2<f32>(1.0));
    let maxUV = clamp(vec2<f32>(maxNDC.x * 0.5 + 0.5, 1.0 - (minNDC.y * 0.5 + 0.5)), vec2<f32>(0.0), vec2<f32>(1.0));

    let hzbDims = vec2<f32>(textureDimensions(hzbTexture, 0));
    let aabbPixelSize = max((maxUV - minUV) * hzbDims, vec2<f32>(1.0));
    let maxDim = max(aabbPixelSize.x, aabbPixelSize.y);

    if (maxDim < 4.0 || maxDim > hzbDims.x * 0.4) {
        return true;
    }

    let mipLevel = clamp(floor(log2(maxDim)), 0.0, 7.0);

    let adaptiveBias = max(depthBias, 0.003 + minDepth * 0.004);
    let threshold = minDepth - adaptiveBias;

    let hzb00 = textureSampleLevel(hzbTexture, hzbSampler, minUV, mipLevel).r;
    if (hzb00 >= threshold) {
        return true;
    }

    let hzb10 = textureSampleLevel(hzbTexture, hzbSampler, vec2<f32>(maxUV.x, minUV.y), mipLevel).r;
    if (hzb10 >= threshold) {
        return true;
    }

    let hzb01 = textureSampleLevel(hzbTexture, hzbSampler, vec2<f32>(minUV.x, maxUV.y), mipLevel).r;
    if (hzb01 >= threshold) {
        return true;
    }

    let hzb11 = textureSampleLevel(hzbTexture, hzbSampler, maxUV, mipLevel).r;
    if (hzb11 >= threshold) {
        return true;
    }

    return false;
}
