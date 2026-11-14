/**
 * [KO] GTAO (Ground Truth Ambient Occlusion) 지평선 코사인 적분 및 데이터 패킹 컴퓨트 셰이더 (Full-Res 1:1)
 * [EN] GTAO (Ground Truth Ambient Occlusion) horizon cosine integration and data packing compute shader (Full-Res 1:1)
 */
let screenCoord  = vec2<i32>(global_id.xy);
let texSize      = vec2<i32>(postEffectOutputDimensions);
let dimsF        = vec2<f32>(texSize);
let invDims      = 1.0 / dimsF;
let uv           = (vec2<f32>(screenCoord) + 0.5) * invDims;
let maxFullCoord = texSize - vec2<i32>(1);

let depth = textureLoad(depthTexture, screenCoord, 0);

// [KO] 1. 배경 하늘(Standard-Z depth == 1.0) 조기 종료
// [EN] 1. Early exit for background sky (Standard-Z depth == 1.0)
if (depth >= 1.0) {
    textureStore(outputTexture, screenCoord, vec4<f32>(1.0, 0.0, 0.0, 0.0));
    return;
}

// [KO] 2. 역투영 행렬 성분을 이용한 무행렬 고속 선형 깊이 및 뷰 좌표 복원
// [EN] 2. Matrix-free fast linear depth and view position reconstruction using inverseProjectionMatrix components
let invP          = systemUniforms.projection.inverseProjectionMatrix;
let invFocalLen   = vec2<f32>(invP[0][0], invP[1][1]);
let invJitter     = vec2<f32>(invP[3][0], invP[3][1]);
let zParams       = vec4<f32>(invP[2][2], invP[3][2], invP[2][3], invP[3][3]);
let centerLinearZ = depthToLinearZ(depth, zParams);

let normalData  = textureLoad(gBufferNormalTexture, screenCoord, 0);
let maxFadeDist = uniforms.fadeDistanceStart + uniforms.fadeDistanceRange;

if (dot(normalData.rgb, normalData.rgb) == 0.0 || centerLinearZ >= maxFadeDist) {
    textureStore(outputTexture, screenCoord, vec4<f32>(1.0, 0.0, 0.0, 0.0));
    return;
}

let viewPos    = reconstructViewPos(uv, centerLinearZ, invFocalLen, invJitter);
let viewNormal = getViewNormalFromGNormalBuffer(normalData.rgb, systemUniforms.camera.viewMatrix);
let viewDir    = normalize(-viewPos);
let octNormal  = octEncode(viewNormal);

// [KO] 평면 자기 차폐(Self-Occlusion) 방지를 위한 지평선 코사인 바이어스
// [EN] Horizon cosine bias to prevent flat surface self-occlusion
let horizonBias = uniforms.bias * (1.0 + centerLinearZ * uniforms.biasDistanceScale);

// [KO] 3. 투영 행렬 기반 정확한 월드 반경 -> 화면 픽셀 반경 변환
// [EN] 3. Exact world radius to screen pixel radius projection based on projection matrix
let proj        = systemUniforms.projection.noneJitterProjectionMatrix;
let focalLenY   = abs(proj[1][1]) * 0.5 * dimsF.y;
let worldRadius = uniforms.radius;
let invRadiusSq = 1.0 / (worldRadius * worldRadius);
let radiusPx    = (worldRadius * focalLenY) / centerLinearZ;

// [KO] 4. Jimenez (2016) Section 3.3의 정확한 4x4 직교 층화 순열 (Stratified Spatial Noise)
// [EN] 4. Exact 4x4 orthogonal stratified permutation from Jimenez (2016) Section 3.3
let ux         = u32(screenCoord.x);
let uy         = u32(screenCoord.y);
let noiseDir   = f32((((ux + uy) & 3u) << 2u) | (ux & 3u)) * (1.0 / 16.0);
let stepJitter = (f32((uy - ux) & 3u) + 0.5) * 0.25;

let numSlices = 2u;
let numSteps  = 4u;
var visibilitySum = 0.0;

// [KO] 5. 2D 화면 공간 지평선 탐색 및 코사인 가중 반구 적분 (GTAO, Jimenez et al. 2016)
// [EN] 5. 2D screen-space horizon search and cosine-weighted hemisphere integration (GTAO, Jimenez et al. 2016)
for (var s = 0u; s < numSlices; s++) {
    let phi    = ((f32(s) + noiseDir) / f32(numSlices)) * PI;
    let cosPhi = cos(phi);
    let sinPhi = sin(phi);

    // 뷰 공간(Y-Up) 슬라이스 벡터와 화면 픽셀(Y-Down) 스텝 방향 부호 일치
    let sliceDirView = vec3<f32>(cosPhi, sinPhi, 0.0);
    let sliceDirPx   = vec2<f32>(cosPhi, -sinPhi);

    let planeNormal     = normalize(cross(sliceDirView, viewDir));
    let orthoTangent    = cross(viewDir, planeNormal);
    let projNormal      = viewNormal - planeNormal * dot(viewNormal, planeNormal);
    let projNormalLenSq = dot(projNormal, projNormal);

    if (projNormalLenSq > 0.0) {
        let projNormalLen = sqrt(projNormalLenSq);
        let cosN          = clamp(dot(projNormal, viewDir) / projNormalLen, -1.0, 1.0);
        let signN         = select(-1.0, 1.0, dot(projNormal, orthoTangent) >= 0.0);
        let n             = signN * acos(cosN);
        let sinN          = sin(n);

        // 슬라이스 탄젠트 평면의 양측 초기 지평선 코사인 하한 (n ∈ [-π/2, π/2] 이므로 n + π/2 ≥ 0, π/2 - n ≥ 0 보장)
        let minHorizCos1 = cos(min(n + GTAO_HALF_PI, PI));
        let minHorizCos2 = cos(min(GTAO_HALF_PI - n, PI));
        var maxCos1      = minHorizCos1;
        var maxCos2      = minHorizCos2;

        for (var step = 0u; step < numSteps; step++) {
            let stepRatio  = (f32(step) + stepJitter) / f32(numSteps);
            let stepPx     = max(f32(step + 1u), stepRatio * stepRatio * radiusPx);
            let pixelDelta = vec2<i32>(round(sliceDirPx * stepPx));

            // + 방향 지평선 탐색 (h1)
            let coord1 = screenCoord + pixelDelta;
            if (coord1.x >= 0 && coord1.x <= maxFullCoord.x && coord1.y >= 0 && coord1.y <= maxFullCoord.y) {
                let d1 = textureLoad(depthTexture, coord1, 0);
                if (d1 < 1.0) {
                    let linZ1   = depthToLinearZ(d1, zParams);
                    let uv1     = (vec2<f32>(coord1) + 0.5) * invDims;
                    let pos1    = reconstructViewPos(uv1, linZ1, invFocalLen, invJitter);
                    let delta1  = pos1 - viewPos;
                    let distSq1 = dot(delta1, delta1);
                    if (distSq1 > 0.0) {
                        let cosH1    = dot(delta1, viewDir) * inverseSqrt(distSq1) - horizonBias;
                        let falloff1 = saturate(1.0 - distSq1 * invRadiusSq);
                        maxCos1      = max(maxCos1, mix(minHorizCos1, cosH1, falloff1));
                    }
                }
            }

            // - 방향 지평선 탐색 (h2)
            let coord2 = screenCoord - pixelDelta;
            if (coord2.x >= 0 && coord2.x <= maxFullCoord.x && coord2.y >= 0 && coord2.y <= maxFullCoord.y) {
                let d2 = textureLoad(depthTexture, coord2, 0);
                if (d2 < 1.0) {
                    let linZ2   = depthToLinearZ(d2, zParams);
                    let uv2     = (vec2<f32>(coord2) + 0.5) * invDims;
                    let pos2    = reconstructViewPos(uv2, linZ2, invFocalLen, invJitter);
                    let delta2  = pos2 - viewPos;
                    let distSq2 = dot(delta2, delta2);
                    if (distSq2 > 0.0) {
                        let cosH2    = dot(delta2, viewDir) * inverseSqrt(distSq2) - horizonBias;
                        let falloff2 = saturate(1.0 - distSq2 * invRadiusSq);
                        maxCos2      = max(maxCos2, mix(minHorizCos2, cosH2, falloff2));
                    }
                }
            }
        }

        let h1 = n + clamp(acos(clamp(maxCos1, -1.0, 1.0)) - n, -GTAO_HALF_PI, GTAO_HALF_PI);
        let h2 = n + clamp(-acos(clamp(maxCos2, -1.0, 1.0)) - n, -GTAO_HALF_PI, GTAO_HALF_PI);

        visibilitySum += projNormalLen * integrateArcCosWeight(h1, h2, n, cosN, sinN);
    }
}

// [KO] 6. 슬라이스 평균 반구 가시성 산출 후 원거리 페이드, 강도(Intensity), 대비(Contrast) 적용
// [EN] 6. Compute slice-averaged hemisphere visibility, then apply distance fade, intensity, and contrast
let rawVisibility = saturate(visibilitySum / f32(numSlices));
let occlusion     = (1.0 - rawVisibility) * uniforms.intensity;
let distanceFade  = smoothstep(maxFadeDist, uniforms.fadeDistanceStart, centerLinearZ);
var finalAO       = saturate(1.0 - occlusion * distanceFade);
finalAO           = pow(finalAO, uniforms.contrast);

// [KO] 7. (Visibility, LinearDepth, OctNormal.xy) 4채널 패킹 출력
// [EN] 7. Output packed 4-channel (Visibility, LinearDepth, OctNormal.xy)
textureStore(outputTexture, screenCoord, vec4<f32>(finalAO, centerLinearZ, octNormal.x, octNormal.y));
