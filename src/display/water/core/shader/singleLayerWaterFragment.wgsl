#redgpu_include SYSTEM_UNIFORM;
#redgpu_include systemStruct.OutputFragment;
#redgpu_include math.tnb.getTBNFromVertexTangent;

#redgpu_include math.INV_PI;
#redgpu_include math.EPSILON;
#redgpu_include math.getInterleavedGradientNoise;
#redgpu_include math.reconstruct.getWorldPositionFromDepth;
#redgpu_include math.getMotionVector;

fn getSpecularNDF(NdotH: f32, roughness: f32) -> f32 {
    let alpha = max(0.002, roughness * roughness);
    let alpha2 = alpha * alpha;
    let NdotH2 = NdotH * NdotH;
    let denom = (NdotH2 * (alpha2 - 1.0) + 1.0);
    return (alpha2 * INV_PI) / max(EPSILON, denom * denom);
}

fn getSpecularVisibility(NdotV: f32, NdotL: f32, roughness: f32) -> f32 {
    let alpha = max(0.002, roughness * roughness);
    let alpha2 = alpha * alpha;
    let safeNdotV = max(NdotV, 1e-4);
    let safeNdotL = max(NdotL, 1e-4);
    let oneMinusAlpha2 = 1.0 - alpha2;
    let GGXV = safeNdotL * sqrt(safeNdotV * safeNdotV * oneMinusAlpha2 + alpha2);
    let GGXL = safeNdotV * sqrt(safeNdotL * safeNdotL * oneMinusAlpha2 + alpha2);
    return 0.5 / max(GGXV + GGXL, EPSILON);
}

fn getSpecularFresnel(VdotH: f32, F0: f32) -> f32 {
    let f = clamp(1.0 - VdotH, 0.0, 1.0);
    let f2 = f * f;
    return F0 + (1.0 - F0) * (f2 * f2 * f);
}

fn blendRNM(n1: vec3<f32>, n2: vec3<f32>) -> vec3<f32> {
    let t = n1 + vec3<f32>(0.0, 0.0, 1.0);
    let u = n2 * vec3<f32>(-1.0, -1.0, 1.0);
    return normalize(t * dot(t, u) - u * t.z);
}

const WATER_F0: f32 = 0.02;

struct WaterUniforms {
    baseColor: vec3<f32>,
    opacity: f32,

    deepColor: vec3<f32>,
    refractionStrength: f32,

    windDirection: vec2<f32>,
    normalScale: f32,
    normalTiling: f32,

    windSpeed: f32,
    extinctionFactor: f32,
    depthFadeDistance: f32,
    debugMaxDepth: f32,

    debugMode: u32,
    normalDetailScale: f32,
    normalDetailTiling: f32,
    normalDetailWindSpeed: f32,

    normalDetailWindDirection: vec2<f32>,
    roughness: f32,
    specularFactor: f32,

    invertNormalY: u32,
    invertNormalDetailY: u32,
    causticsStrength: f32,
    causticsScale: f32,

    causticsSpeed: f32,
    enableSSR: u32,
    ssrMaxDistance: f32,
    ssrStepCount: u32,

    ssrThickness: f32,
    turbidity: f32,
    rippleDomainSize: f32,
    rippleNormalStrength: f32,

    rippleDomainCenter: vec2<f32>,
    padding01: f32,
    padding02: f32,
};

fn worldToScreen(worldPos: vec3<f32>) -> vec2<f32> {
    let clipPos = systemUniforms.projection.projectionViewMatrix * vec4<f32>(worldPos, 1.0);
    if (clipPos.w <= 0.001) {
        return vec2<f32>(-1.0);
    }
    let ndc = clipPos.xyz / clipPos.w;
    return vec2<f32>(ndc.x * 0.5 + 0.5, -ndc.y * 0.5 + 0.5);
}

fn calculateWaterSSR(
    startWorldPos: vec3<f32>,
    worldNormal: vec3<f32>,
    R: vec3<f32>,
    pixelCoord: vec2<i32>
) -> vec4<f32> {
    if (uniforms.enableSSR == 0u || R.y <= 0.001) {
        return vec4<f32>(0.0);
    }

    let maxSteps = uniforms.ssrStepCount;
    if (maxSteps == 0u) {
        return vec4<f32>(0.0);
    }

    let maxDist = max(1.0, uniforms.ssrMaxDistance);
    let baseStepSize = maxDist / f32(maxSteps);
    let thickness = max(0.05, uniforms.ssrThickness);
    let cameraWorldPos = systemUniforms.camera.cameraPosition;

    let jitter = getInterleavedGradientNoise(vec2<f32>(pixelCoord));

    var currentWorldPos = startWorldPos + worldNormal * 0.008 + R * (baseStepSize * jitter);
    var currentStepSize = baseStepSize;
    var hitUV = vec2<f32>(0.0);
    var hitFound = false;
    var hitStep = 0u;
    var refinementLevel = 0u;
    let maxRefinementLevels = 4u;

    for (var i = 0u; i < maxSteps; i = i + 1u) {
        currentWorldPos = currentWorldPos + R * currentStepSize;

        let travelVec = currentWorldPos - startWorldPos;
        let travelDist = length(travelVec);
        if (travelDist > maxDist) {
            break;
        }

        let currentScreenUV = worldToScreen(currentWorldPos);
        if (currentScreenUV.x < 0.0 || currentScreenUV.x > 1.0 || currentScreenUV.y < 0.0 || currentScreenUV.y > 1.0) {
            break;
        }

        let coord = vec2<i32>(currentScreenUV * systemUniforms.resolution);
        let rawSceneDepth = textureLoad(renderPath1DepthTexture, coord, 0);

        if (rawSceneDepth >= 0.9999) {
            continue;
        }

        let sampledWorldPos = getWorldPositionFromDepth(currentScreenUV, rawSceneDepth, systemUniforms.projection.inverseProjectionViewMatrix);

        if (sampledWorldPos.y <= startWorldPos.y) {
            continue;
        }

        let rayDistanceFromCamera = length(currentWorldPos - cameraWorldPos);
        let surfaceDistanceFromCamera = length(sampledWorldPos - cameraWorldPos);
        let distanceDiff = rayDistanceFromCamera - surfaceDistanceFromCamera;

        let effectiveThickness = max(thickness, currentStepSize * 2.2);

        if (distanceDiff > 0.0 && distanceDiff < effectiveThickness) {
            if (refinementLevel < maxRefinementLevels) {
                currentWorldPos = currentWorldPos - R * currentStepSize;
                currentStepSize = currentStepSize * 0.5;
                refinementLevel = refinementLevel + 1u;
                continue;
            }

            hitUV = currentScreenUV;
            hitFound = true;
            hitStep = i;
            break;
        }
    }

    if (!hitFound) {
        return vec4<f32>(0.0);
    }

    let edge = min(hitUV, vec2<f32>(1.0) - hitUV);
    let edgeFade = smoothstep(0.0, 0.08, min(edge.x, edge.y));

    let finalTravelDist = length(currentWorldPos - startWorldPos);
    let distFade = 1.0 - smoothstep(maxDist * 0.35, maxDist * 0.90, finalTravelDist);

    let stepFade = smoothstep(0.0, 0.12, 1.0 - f32(hitStep) / f32(maxSteps));

    let rayFade = clamp(R.y * 12.0, 0.0, 1.0);

    let totalWeight = edgeFade * distFade * stepFade * rayFade;
    if (totalWeight <= 0.001) {
        return vec4<f32>(0.0);
    }

    let maxMip = f32(textureNumLevels(renderPath1ResultTexture) - 1);
    let blurMip = clamp((uniforms.roughness * 1.5 + 0.04) * maxMip, 0.0, maxMip);
    let hitColor = textureSampleLevel(renderPath1ResultTexture, renderPath1ResultTextureSampler, hitUV, blurMip).rgb;

    return vec4<f32>(hitColor, totalWeight);
}

@group(2) @binding(0) var<uniform> uniforms: WaterUniforms;
@group(2) @binding(1) var normalTextureSampler: sampler;
@group(2) @binding(2) var normalTexture: texture_2d<f32>;
#redgpu_if normalDetailTexture
@group(2) @binding(3) var normalDetailTexture: texture_2d<f32>;
#redgpu_endIf
#redgpu_if rippleTexture
@group(2) @binding(4) var rippleTexture: texture_2d<f32>;
#redgpu_endIf

struct InputData {
    @builtin(position) position: vec4<f32>,
    @location(0) vertexPosition: vec3<f32>,
    @location(1) vertexNormal: vec3<f32>,
    @location(2) uv: vec2<f32>,
    @location(3) vertexTangent: vec4<f32>,
};

@fragment
fn main(inputData: InputData) -> OutputFragment {
    var output: OutputFragment;
    let preExposure = systemUniforms.preExposure;

    let screenUV = inputData.position.xy / systemUniforms.resolution;
    let pixelCoord = vec2<i32>(inputData.position.xy);
    let cameraNear = systemUniforms.camera.nearClipping;
    let cameraFar = systemUniforms.camera.farClipping;
    let worldPos = inputData.vertexPosition;

    let rawSceneDepth = textureLoad(renderPath1DepthTexture, pixelCoord, 0);
    let linearSceneDepth = getLinearizeDepth(rawSceneDepth, cameraNear, cameraFar);
    let linearWaterDepth = getLinearizeDepth(inputData.position.z, cameraNear, cameraFar);

    let initialGroundWorldPos = getWorldPositionFromDepth(screenUV, rawSceneDepth, systemUniforms.projection.inverseProjectionViewMatrix);
    let initialOpticalDistance = length(initialGroundWorldPos - worldPos);
    let originalSceneColor = textureSampleLevel(renderPath1ResultTexture, renderPath1ResultTextureSampler, screenUV, 0.0).rgb;



    let timeSec = systemUniforms.time.time;
    let V = normalize(systemUniforms.camera.cameraPosition - worldPos);

    let windDirLen1 = length(uniforms.windDirection);
    let baseWindDir1 = select(vec2<f32>(1.0, 0.0), uniforms.windDirection / windDirLen1, windDirLen1 > 0.001);
    let windDirLen2 = length(uniforms.normalDetailWindDirection);
    let baseWindDir2 = select(vec2<f32>(-0.6, 0.8), uniforms.normalDetailWindDirection / windDirLen2, windDirLen2 > 0.001);
    let waveUV1 = inputData.uv * uniforms.normalTiling + baseWindDir1 * (timeSec * uniforms.windSpeed);

    let rawSample1 = textureSample(normalTexture, normalTextureSampler, waveUV1).rgb;
    var rawXY1 = rawSample1.xy * 2.0 - 1.0;
    rawXY1.y = -rawXY1.y;
    if (uniforms.invertNormalY == 1u) {
        rawXY1.y = -rawXY1.y;
    }
    var n1 = rawXY1 * uniforms.normalScale;
    let z1 = sqrt(max(0.0, 1.0 - dot(n1, n1)));
    var combinedTangentNormal = normalize(vec3<f32>(n1, z1));

    #redgpu_if normalDetailTexture
    {
        let waveUV2 = inputData.uv * uniforms.normalDetailTiling + baseWindDir2 * (timeSec * uniforms.normalDetailWindSpeed);

        let rawSample2 = textureSample(normalDetailTexture, normalTextureSampler, waveUV2).rgb;
        var rawXY2 = rawSample2.xy * 2.0 - 1.0;
        rawXY2.y = -rawXY2.y;
        if (uniforms.invertNormalDetailY == 1u) {
            rawXY2.y = -rawXY2.y;
        }
        var n2 = rawXY2 * uniforms.normalDetailScale;
        let z2 = sqrt(max(0.0, 1.0 - dot(n2, n2)));
        let tangentNormal2 = normalize(vec3<f32>(n2, z2));

        combinedTangentNormal = blendRNM(combinedTangentNormal, tangentNormal2);
    }
    #redgpu_endIf

    #redgpu_if rippleTexture
    {
        let simDomainSize = max(1.0, uniforms.rippleDomainSize);
        let simUV = (worldPos.xz - uniforms.rippleDomainCenter) / simDomainSize + 0.5;
        if (all(simUV >= vec2<f32>(0.0)) && all(simUV <= vec2<f32>(1.0))) {
            let simSample = textureSampleLevel(rippleTexture, normalTextureSampler, simUV, 0.0);
            let edgeDist = min(simUV, vec2<f32>(1.0) - simUV);
            let edgeFade = smoothstep(0.0, 0.08, min(edgeDist.x, edgeDist.y));

            let rawRippleNormal = vec3<f32>(simSample.x * uniforms.rippleNormalStrength, simSample.y * uniforms.rippleNormalStrength, 1.0);
            let normalizedRippleNormal = normalize(rawRippleNormal);
            let finalRippleNormal = normalize(mix(vec3<f32>(0.0, 0.0, 1.0), normalizedRippleNormal, edgeFade));

            combinedTangentNormal = blendRNM(combinedTangentNormal, finalRippleNormal);
        }
    }
    #redgpu_endIf

    let camDist = length(systemUniforms.camera.cameraPosition - inputData.vertexPosition);
    let distNormalFade = clamp((camDist - 35.0) / 45.0, 0.0, 0.85);
    combinedTangentNormal = normalize(mix(combinedTangentNormal, vec3<f32>(0.0, 0.0, 1.0), distNormalFade));

    let baseNormal = normalize(inputData.vertexNormal);
    let tbn = getTBNFromVertexTangent(baseNormal, inputData.vertexTangent);
    let worldNormal = normalize(tbn * combinedTangentNormal);

    let NdotV = clamp(dot(worldNormal, V), 0.001, 1.0);
    let viewFactor = 1.0 / max(0.12, NdotV);
    let pixelFootprint = camDist * 0.0035;
    let adaptiveFadeDist = max(0.001, max(uniforms.depthFadeDistance, pixelFootprint * viewFactor * 3.0));
    let depthFade = smoothstep(0.0, 1.0, clamp(initialOpticalDistance / adaptiveFadeDist, 0.0, 1.0));

    let meshEdge = min(inputData.uv, vec2<f32>(1.0) - inputData.uv);
    let meshEdgeFade = smoothstep(0.0, 0.015, min(meshEdge.x, meshEdge.y));

    // 1) 순수 파도 및 잔물결의 법선 편차(Wave Perturbation) 산출
    let deltaN = worldNormal - baseNormal;
    let viewSpaceDeltaN = (systemUniforms.camera.viewMatrix * vec4<f32>(deltaN, 0.0)).xy;

    // 2) 얕은 수변(Shoreline) 경계에서의 부드러운 굴절 페이드 (0cm ~ 35cm 얕은 물가 튀김 방지)
    let shorelineRefractFade = smoothstep(0.01, 0.35, initialOpticalDistance);

    // 3) 원근감 및 수심에 비례한 자연스러운 굴절 스케일 (화면 가장자리 과도 왜곡 방지)
    let opticalDepth = clamp(initialOpticalDistance, 0.0, 2.5);
    let depthFactor = opticalDepth / max(2.0, camDist);
    let snellScale = 0.15 * uniforms.refractionStrength;

    // 4) 화면 가장자리(Screen Edge) 부드러운 페이드 (외곽 샘플링 스트레칭 원천 차단)
    let edgeDist = min(screenUV, vec2<f32>(1.0) - screenUV);
    let screenEdgeFade = smoothstep(0.0, 0.06, min(edgeDist.x, edgeDist.y));

    // 5) 정밀 파도 굴절 오프셋 (평면 왜곡 flatDelta 제거로 좌우/하단 가장자리 찌그러짐 완전 해결)
    var rawRefractionOffset = vec2<f32>(viewSpaceDeltaN.x, -viewSpaceDeltaN.y) * (depthFactor * snellScale * shorelineRefractFade * screenEdgeFade);
    let maxOffsetLen = 0.015;
    let offsetLen = length(rawRefractionOffset);
    if (offsetLen > maxOffsetLen) {
        rawRefractionOffset = rawRefractionOffset * (maxOffsetLen / offsetLen);
    }

    let testUV = clamp(screenUV + rawRefractionOffset, vec2<f32>(0.001), vec2<f32>(0.999));
    let rawDistortedDepth = textureLoad(renderPath1DepthTexture, vec2<i32>(testUV * systemUniforms.resolution), 0);
    let linearDistortedDepth = getLinearizeDepth(rawDistortedDepth, cameraNear, cameraFar);
    let bleedWeight = smoothstep(0.0, 0.15, linearDistortedDepth - linearWaterDepth);
    let finalRefractUV = clamp(screenUV + rawRefractionOffset * bleedWeight, vec2<f32>(0.001), vec2<f32>(0.999));

    let rawFinalDepth = textureLoad(renderPath1DepthTexture, vec2<i32>(finalRefractUV * systemUniforms.resolution), 0);
    let refractedGroundWorldPos = getWorldPositionFromDepth(finalRefractUV, rawFinalDepth, systemUniforms.projection.inverseProjectionViewMatrix);
    let effectiveVerticalDepth = max(0.0, worldPos.y - refractedGroundWorldPos.y);
    let effectiveOpticalDistance = length(refractedGroundWorldPos - worldPos);

    let maxSceneMip = f32(textureNumLevels(renderPath1ResultTexture) - 1);
    let maxSafeBlurMip = min(3.0, maxSceneMip);
    let scatterBlur = clamp(effectiveOpticalDistance * 0.02 + uniforms.turbidity * 1.5, 0.0, maxSafeBlurMip);
    let sceneColor = textureSampleLevel(renderPath1ResultTexture, renderPath1ResultTextureSampler, finalRefractUV, scatterBlur).rgb;

    let baseExt = max(0.001, uniforms.extinctionFactor);
    let turbidityCoeff = clamp(uniforms.turbidity, 0.0, 1.0);
    let wavelengthExt = vec3<f32>(
        baseExt * 2.4,
        baseExt * 0.7,
        baseExt * (1.1 + turbidityCoeff * 0.9)
    );
    let extinctionRGB = exp(-effectiveOpticalDistance * wavelengthExt);
    let meanExtinction = dot(extinctionRGB, vec3<f32>(0.299, 0.587, 0.114));

    let depthProgress = clamp(1.0 - meanExtinction, 0.0, 1.0);
    var waterAlbedo = mix(uniforms.baseColor, uniforms.deepColor, depthProgress);

    let fogDensity = turbidityCoeff * 0.85;
    let waterFogFactor = (vec3<f32>(1.0) - extinctionRGB) * fogDensity;
    let waterFogColor = mix(uniforms.baseColor * 0.6, uniforms.deepColor, depthProgress);

    let directGroundTransmittance = extinctionRGB;
    var transmittedSceneColor = sceneColor * directGroundTransmittance + waterFogColor * (waterFogFactor * 0.15);

    var causticIntensity = 0.0;
    if (uniforms.causticsStrength > 0.001) {
        let primarySun = systemUniforms.directionalLights[0];
        let sunDir = -normalize(primarySun.direction);

        // 1) 수중 지표면의 실제 경사각(법선) 산출을 통한 수직 벽면(박스 옆면, 절벽, 기둥) 코스틱스 마스킹
        // 실제 태양광은 위에서 아래로 내리쬐므로 수평 바닥에만 맺히고 수직 벽면에는 닿지 않아야 함.
        // 수직 벽면(groundNormal.y ≈ 0)을 부드럽게 페이드아웃하여 폭포수처럼 세로로 늘어지는 아티팩트를 원천 박멸.
        let groundDX = dpdx(initialGroundWorldPos);
        let groundDY = dpdy(initialGroundWorldPos);
        let groundNormal = normalize(cross(groundDX, groundDY));
        let groundUpFactor = clamp(abs(groundNormal.y), 0.0, 1.0);
        let wallMask = smoothstep(0.30, 0.70, groundUpFactor);

        // 2) 수심에 따른 부드러운 시차 오프셋 (수면 그리드 기준)
        let viewParallaxDir = -V.xz;
        let parallaxDist = min(effectiveVerticalDepth * 0.45 / max(0.35, V.y), effectiveVerticalDepth * 1.2);
        let viewParallaxOffset = viewParallaxDir * parallaxDist;
        let lightRayOffset = sunDir.xz * (effectiveVerticalDepth * 0.25);
        let groundSurfacePos = worldPos.xz + viewParallaxOffset + lightRayOffset;

        let invCScale = 1.0 / max(0.01, uniforms.causticsScale);
        let cWorldScale = 0.35 * invCScale;
        let cSpeed = uniforms.causticsSpeed;
        let cUV1 = groundSurfacePos * cWorldScale + baseWindDir1 * (timeSec * uniforms.windSpeed * cSpeed);

        let causticMip = clamp((camDist - 30.0) / 40.0, 0.0, 1.2);
        let rawN1 = (textureSampleLevel(normalTexture, normalTextureSampler, cUV1, causticMip).rgb * 2.0 - 1.0).xy;

        var s1: vec2<f32>;
        var s2: vec2<f32>;
        #redgpu_if normalDetailTexture
        {
            let cUV2 = groundSurfacePos * (cWorldScale * 1.8) + baseWindDir2 * (timeSec * uniforms.normalDetailWindSpeed * cSpeed);
            let rawN2 = (textureSampleLevel(normalDetailTexture, normalTextureSampler, cUV2, causticMip).rgb * 2.0 - 1.0).xy;

            let distortUV1 = cUV1 + rawN2 * 0.18;
            let distortUV2 = cUV2 + rawN1 * 0.18;

            s1 = (textureSampleLevel(normalTexture, normalTextureSampler, distortUV1, causticMip).rgb * 2.0 - 1.0).xy;
            s2 = (textureSampleLevel(normalDetailTexture, normalTextureSampler, distortUV2, causticMip).rgb * 2.0 - 1.0).xy;
        }
        #redgpu_else
        {
            let distortUV1 = cUV1 + rawN1.yx * 0.18;
            let distortUV2 = cUV1 * 1.8 - rawN1 * 0.18;

            s1 = (textureSampleLevel(normalTexture, normalTextureSampler, distortUV1, causticMip).rgb * 2.0 - 1.0).xy;
            s2 = (textureSampleLevel(normalTexture, normalTextureSampler, distortUV2, causticMip).rgb * 2.0 - 1.0).xy;
        }
        #redgpu_endIf

        let waveA1 = (s1.x + s1.y) * 5.0;
        let waveA2 = (s2.x - s2.y) * 5.0;
        let waveB1 = (s1.x - s1.y) * 5.0;
        let waveB2 = (s2.x + s2.y) * 5.0;

        let dWave1 = clamp(abs(waveA1 - waveA2), 0.0, 1.0);
        let dWave2 = clamp(abs(waveB1 - waveB2), 0.0, 1.0);
        let crest1 = smoothstep(0.85, 0.0, dWave1);
        let crest2 = smoothstep(0.85, 0.0, dWave2);
        let causticCrest = (crest1 * crest1 + crest2 * crest2) * 0.9;

        let causticsDepthFade = exp(-effectiveVerticalDepth * 0.85) * smoothstep(0.02, 0.25, effectiveVerticalDepth);
        causticIntensity = causticCrest * uniforms.causticsStrength * causticsDepthFade * wallMask;

        let sunFactor = clamp(sunDir.y * 1.5, 0.35, 1.0);
        let causticsColor = primarySun.color * (causticIntensity * sunFactor);

        transmittedSceneColor = transmittedSceneColor + sceneColor * causticsColor;
    }

    let NdotV_pure = clamp(dot(baseNormal, V), 0.001, 1.0);
    let NdotV_wave = clamp(dot(worldNormal, V), 0.001, 1.0);
    let NdotV_effective = clamp(mix(NdotV_pure, NdotV_wave, 0.35), 0.001, 1.0);
    let oneMinusNdotV = 1.0 - NdotV_effective;
    let f90 = max(1.0 - uniforms.roughness, WATER_F0);
    let fresnel = WATER_F0 + (f90 - WATER_F0) * (oneMinusNdotV * oneMinusNdotV * oneMinusNdotV * oneMinusNdotV * oneMinusNdotV);

    let grazingFactor = 1.0 - NdotV_pure;
    let horizonAngleFactor = smoothstep(0.65, 0.90, grazingFactor);
    let distFactor = smoothstep(20.0, 100.0, camDist);
    let taaFactor = horizonAngleFactor * distFactor;

    let effectiveRoughnessIBL = clamp(uniforms.roughness + taaFactor * 0.10, 0.0, 0.25);

    let reflectionNormal = normalize(mix(worldNormal, baseNormal, taaFactor * 0.20));
    let flatR = reflect(-V, baseNormal);
    let rawR = reflect(-V, reflectionNormal);

    // 파도 사면에서 반사 벡터가 지평선 아래로 떨어질 때 발생하는 인위적인 황금색 수평선 띠(Horizon Clamping Artifact) 완전 제거
    // 하드 클램프(R.y = max(R.y, 0.005)) 대신 항상 안전한 상공을 향하는 flatR로 부드럽게 보간(Horizon Pull-up)하여 매끄러운 연속성 보장
    let horizonPull = 1.0 - smoothstep(-0.02, 0.18, rawR.y);
    var R = normalize(mix(rawR, flatR, horizonPull));
    R.y = max(R.y, 0.002);

    let u_usePrefilterTexture = systemUniforms.usePrefilterTexture == 1u;
    let u_useSkyAtmosphere = systemUniforms.useSkyAtmosphere == 1u;
    var rawSkyReflection = vec3<f32>(0.0);
    var skyDiffuseIrradiance = vec3<f32>(0.0);

    if (u_usePrefilterTexture) {
        let maxIblMip = f32(textureNumLevels(ibl_prefilterTexture) - 1);
        let maxAllowedIblMip = min(maxIblMip * 0.25, 2.0);
        let iblMipLevel = clamp(effectiveRoughnessIBL * maxIblMip, 0.0, maxAllowedIblMip);
        rawSkyReflection = textureSampleLevel(ibl_prefilterTexture, prefilterTextureSampler, R, iblMipLevel).rgb * preExposure * systemUniforms.iblIntensity;

        skyDiffuseIrradiance = textureSample(ibl_irradianceTexture, prefilterTextureSampler, worldNormal).rgb * preExposure * systemUniforms.iblIntensity;
    }
    if (u_useSkyAtmosphere) {
        let u_atmo = systemUniforms.skyAtmosphere;
        let atmoMipCount = f32(textureNumLevels(skyAtmosphere_prefilteredTexture) - 1);
        let maxAllowedAtmoMip = min(atmoMipCount * 0.25, 2.0);
        let atmoMipLevel = clamp(effectiveRoughnessIBL * atmoMipCount, 0.0, maxAllowedAtmoMip);
        let atmoColor = textureSampleLevel(skyAtmosphere_prefilteredTexture, atmosphereSampler, R, atmoMipLevel).rgb * u_atmo.sunIntensity * preExposure;
        rawSkyReflection = rawSkyReflection + atmoColor;

        let atmoIrradiance = textureSample(atmosphereIrradianceLUT, atmosphereSampler, worldNormal).rgb * u_atmo.sunIntensity * preExposure;
        skyDiffuseIrradiance = skyDiffuseIrradiance + atmoIrradiance;
    }

    let ssrWaveNormal = normalize(mix(baseNormal, worldNormal, 0.60));
    let rawSsrR = reflect(-V, ssrWaveNormal);
    let ssrHorizonPull = 1.0 - smoothstep(-0.02, 0.18, rawSsrR.y);
    var ssrR = normalize(mix(rawSsrR, flatR, ssrHorizonPull));
    ssrR.y = max(ssrR.y, 0.002);

    let ssrResult = calculateWaterSSR(worldPos, ssrWaveNormal, ssrR, pixelCoord);
    let blendedSkyReflection = mix(rawSkyReflection, ssrResult.rgb, ssrResult.a);
    let skyReflectionColor = blendedSkyReflection * uniforms.specularFactor;

    var directSpecularColor = vec3<f32>(0.0);
    var directWaterScattering = vec3<f32>(0.0);
    let u_directionalLightCount = systemUniforms.directionalLightCount;
    let u_directionalLights = systemUniforms.directionalLights;

    let N = worldNormal;
    let effectiveRoughness = clamp(sqrt(uniforms.roughness * uniforms.roughness + 0.003), 0.06, 1.0);
    let pbrRoughness = clamp(uniforms.roughness + 0.08, 0.05, 0.60);
    let waveRoughness = clamp(uniforms.roughness + 0.18, 0.12, 0.40);
    let depthScatterWeight = pow(1.0 - meanExtinction, 2.0);
    let scatteringAlbedo = 0.26 + turbidityCoeff * 0.20;

    for (var i = 0u; i < u_directionalLightCount; i = i + 1u) {
        let light = u_directionalLights[i];
        let L = -normalize(light.direction);
        let NdotL = max(dot(N, L), 0.0);
        let finalLightColor = light.color * light.intensity * preExposure;

        if (NdotL > 0.0) {
            let H = normalize(L + V);
            let NdotH = max(dot(N, H), 0.0);
            let VdotH = max(dot(V, H), 0.0);
            let F = getSpecularFresnel(VdotH, WATER_F0);

            let glitterSpecular = getSpecularNDF(NdotH, effectiveRoughness) * getSpecularVisibility(NdotV_effective, NdotL, effectiveRoughness);
            let pbrSpecular = getSpecularNDF(NdotH, pbrRoughness) * getSpecularVisibility(NdotV_effective, NdotL, pbrRoughness);
            let waveSpecular = getSpecularNDF(NdotH, waveRoughness) * getSpecularVisibility(NdotV_effective, NdotL, waveRoughness);

            let combinedSpec = (glitterSpecular * 0.58 + pbrSpecular * 0.34 + waveSpecular * 0.08) * F * uniforms.specularFactor;
            directSpecularColor = directSpecularColor + finalLightColor * (combinedSpec * NdotL);
        }

        let cosThetaI = max(L.y, 0.0);
        let sin2ThetaT = (1.0 - cosThetaI * cosThetaI) * (1.0 / (1.333 * 1.333));
        let cosThetaT = sqrt(max(0.001, 1.0 - sin2ThetaT));
        let sunTransmittance = max(0.0, 1.0 - getSpecularFresnel(NdotL, WATER_F0));

        let volumeInScattering = finalLightColor * (sunTransmittance * cosThetaT * depthScatterWeight * scatteringAlbedo);

        let VdotL = dot(V, L);
        let lowSunFactor = clamp(1.0 - max(L.y, 0.0), 0.0, 1.0);
        let forwardScatter = max(0.0, -VdotL);
        let waveTranslucency = pow(forwardScatter, 3.0) * (1.0 - NdotL * 0.5) * depthScatterWeight;
        let subsurfaceScattering = finalLightColor * (waveTranslucency * lowSunFactor * sunTransmittance * (scatteringAlbedo * 0.8));

        directWaterScattering = directWaterScattering + (volumeInScattering + subsurfaceScattering) * waterAlbedo;
    }

    let diffuseFresnel = WATER_F0 + (1.0 - WATER_F0) * 0.06;
    let skyTransmittance = max(0.0, 1.0 - diffuseFresnel);
    let skyVolumeScatter = skyDiffuseIrradiance * skyTransmittance * waterAlbedo * (depthScatterWeight * scatteringAlbedo * 0.15);

    let safeAmbientIntensity = min(100.0, systemUniforms.ambientLight.intensity);
    let baseAmbient = systemUniforms.ambientLight.color * (safeAmbientIntensity * preExposure);
    let ambientInScattering = baseAmbient * waterAlbedo * (depthScatterWeight * scatteringAlbedo * 0.03);
    let waterScattering = directWaterScattering * 0.5 + ambientInScattering + skyVolumeScatter;

    let totalTransmittedLight = (transmittedSceneColor + waterScattering) * (1.0 - fresnel);

    let reflectionShorelineFade = smoothstep(0.0, 1.0, clamp(initialOpticalDistance / (adaptiveFadeDist * 1.5), 0.0, 1.0));
    let totalReflectedLight = (skyReflectionColor * fresnel + directSpecularColor) * reflectionShorelineFade;

    let fullWaterColor = totalTransmittedLight + totalReflectedLight;

    let softDepthFade = depthFade * meshEdgeFade * uniforms.opacity;
    let finalRgb = mix(originalSceneColor, fullWaterColor, softDepthFade);

    let maxDepth = max(0.001, uniforms.debugMaxDepth);

    switch (uniforms.debugMode) {
        case 15u: {
            output.color = vec4<f32>(ssrResult.rgb * ssrResult.a, 1.0);
        }
        case 14u: {
            output.color = vec4<f32>(vec3<f32>(causticIntensity), 1.0);
        }
        case 13u: {
            output.color = vec4<f32>(directSpecularColor, 1.0);
        }
        case 12u: {
            output.color = vec4<f32>(skyReflectionColor, 1.0);
        }
        case 11u: {
            output.color = vec4<f32>(vec3<f32>(fresnel), 1.0);
        }
        case 10u: {
            let actualOffset = finalRefractUV - screenUV;
            output.color = vec4<f32>(actualOffset * 50.0 + 0.5, 0.0, 1.0);
        }
        case 9u: {
            output.color = vec4<f32>(worldNormal * 0.5 + 0.5, 1.0);
        }
        case 8u: {
            output.color = vec4<f32>(waterAlbedo, 1.0);
        }
        case 7u: {
            output.color = vec4<f32>(vec3<f32>(1.0) - extinctionRGB, 1.0);
        }
        case 6u: {
            output.color = vec4<f32>(originalSceneColor, 1.0);
        }
        case 5u: {
            output.color = vec4<f32>(vec3<f32>(depthFade), 1.0);
        }
        case 4u: {
            let mask = clamp(effectiveVerticalDepth / maxDepth, 0.0, 1.0);
            output.color = vec4<f32>(vec3<f32>(mask), 1.0);
        }
        case 3u: {
            let waterZ = clamp(linearWaterDepth / maxDepth, 0.0, 1.0);
            output.color = vec4<f32>(vec3<f32>(waterZ), 1.0);
        }
        case 2u: {
            let sceneZ = clamp(linearSceneDepth / maxDepth, 0.0, 1.0);
            output.color = vec4<f32>(vec3<f32>(sceneZ), 1.0);
        }
        case 1u: {
            output.color = vec4<f32>(vec3<f32>(rawSceneDepth), 1.0);
        }
        default: {
            output.color = vec4<f32>(finalRgb, 1.0);
        }
    }

    output.gBufferNormal = vec4<f32>(worldNormal, 1.0);

    // 시선 각도(N·V 스침각) + 거리 기반 하이브리드 TAA & 카메라 모션 벡터
    // 내려다볼 때(N·V 높음) 및 근거리: TAA 바이패스(z = 1.0)로 쨍한 스펙큘러/카우스틱스 선명도 극대화
    // 수평선을 바라볼 때(N·V 스침각) + 원거리: 카메라 모션 벡터를 출력하고 TAA 활성화(z = 0.0)하여 수평선 앨리어싱 및 지터 완벽 억제
    let currClip = systemUniforms.projection.projectionViewMatrix * vec4<f32>(worldPos, 1.0);
    let prevClip = systemUniforms.projection.prevNoneJitterProjectionViewMatrix * vec4<f32>(worldPos, 1.0);
    let cameraMotion = getMotionVector(currClip, prevClip);

    let finalMotion = cameraMotion * taaFactor;
    let jitterDisableFlag = select(1.0, 0.0, taaFactor > 0.2);
    output.gBufferMotionVector = vec4<f32>(finalMotion, jitterDisableFlag, 1.0);

    return output;
}
