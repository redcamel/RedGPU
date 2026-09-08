#redgpu_include SYSTEM_UNIFORM;
#redgpu_include systemStruct.OutputFragment;
#redgpu_include math.getMotionVector;
#redgpu_include math.PI;
#redgpu_include math.PI2;
#redgpu_include math.INV_PI;
#redgpu_include math.EPSILON;
#redgpu_include math.direction.getViewDirection;
#redgpu_include math.direction.getReflectionVectorFromViewDirection;
#redgpu_include skyAtmosphere.skyAtmosphereFn;
#redgpu_include shadow.getDirectionalShadowVisibility;

struct InputData {
    @builtin(position) position: vec4<f32>,
    @location(0) vertexPosition: vec3<f32>,
    @location(1) uv: vec2<f32>,
    @location(2) uv1: vec2<f32>,
    @location(3) currentClipPos: vec4<f32>,
    @location(4) prevClipPos: vec4<f32>,
    @location(5) instanceColor: vec4<f32>,
    @location(6) @interpolate(flat) lodLevel: f32,
    @location(7) @interpolate(flat) receiveShadow: f32,
};

struct LandscapeLayerParams {
    uvOffset: vec2<f32>,
    uvScale: vec2<f32>,
    tintColor: vec4<f32>,
    roughness: f32,
    metallic: f32,
    normalIntensity: f32,
    enabled: f32,
    aoIntensity: f32,
    weightChannelIndex: f32,
    pad0: f32,
    pad1: f32,
};

struct MaterialUniforms {
    activeLayerCount: u32,
    pad0: u32,
    pad1: u32,
    pad2: u32,
    color: vec4<f32>,
    layerParams: array<LandscapeLayerParams, 8>,
};

struct LandscapeUniforms {
    heightScale: f32,
    worldSizeX: f32,
    worldSizeZ: f32,
    lodColoration: f32,
    maxComponentCount: u32,
    tileSizeX: f32,
    tileSizeZ: f32,
    baseQuads: f32,
    vhtTextureSize: vec2<f32>,
    lodFadeStartRatio: f32,
    lodGeomorphStartRatio: f32,
    lodColors: array<vec4<f32>, 8>,
    lodDistancesSq: array<vec4<f32>, 2>,
    tanHalfFOV: f32,
    lodMetric: f32,
    lod0Quads: f32,
    receiveShadow: f32,
    heightmapShadow: f32,
    heightmapShadowSteps: f32,
    heightmapShadowDistance: f32,
    heightmapShadowSoftness: f32,
    foliageSubCellColoration: f32,
    foliageSubCellSize: f32,
    foliageStreamingRadius: f32,
    foliageDebugPad: f32,
};

@group(1) @binding(3) var heightMapTexture: texture_2d<f32>;
@group(1) @binding(4) var vntNormalTexture: texture_2d<f32>;
@group(1) @binding(5) var<uniform> landscapeInstanceUniforms: LandscapeUniforms;
@group(1) @binding(6) var vbtBaseColorAtlasTexture: texture_2d<f32>;
@group(1) @binding(7) var vbtNormalAtlasTexture: texture_2d<f32>;
@group(1) @binding(8) var vbtORMAtlasTexture: texture_2d<f32>;

@group(2) @binding(0) var<uniform> uniforms: MaterialUniforms;
@group(2) @binding(1) var baseColorTextureSampler: sampler;
@group(2) @binding(2) var layerBaseColorArray: texture_2d_array<f32>;
@group(2) @binding(3) var layerNormalArray: texture_2d_array<f32>;
@group(2) @binding(4) var layerORMArray: texture_2d_array<f32>;
@group(2) @binding(5) var layerWeightMapArray: texture_2d_array<f32>;

fn getBaseNormal(globalUV: vec2<f32>) -> vec3<f32> {
    let vntSample = textureSampleLevel(vntNormalTexture, baseColorTextureSampler, globalUV, 0.0).rgb;
    return normalize(select(vntSample * 2.0 - vec3<f32>(1.0), vec3<f32>(0.0, 1.0, 0.0), dot(vntSample, vntSample) <= 1e-6));
}

fn computeLandscapeLayersAlbedo(
    globalUV: vec2<f32>,
    worldTileUV: vec2<f32>,
    ddxGlobalUV: vec2<f32>,
    ddyGlobalUV: vec2<f32>,
    ddxWorldTileUV: vec2<f32>,
    ddyWorldTileUV: vec2<f32>
) -> vec3<f32> {
    let activeLayerCount = uniforms.activeLayerCount;
    if (activeLayerCount == 0u) {
        return uniforms.color.rgb;
    }

    let weightMapSample = textureSampleGrad(layerWeightMapArray, baseColorTextureSampler, globalUV, 0, ddxGlobalUV, ddyGlobalUV);

    var totalLayerWeight = 0.0;
    var blendedAlbedo = vec3<f32>(0.0);

    for (var i = 0u; i < activeLayerCount; i = i + 1u) {
        let layerParams = uniforms.layerParams[i];
        if (layerParams.enabled <= 0.5) { continue; }

        let chIdx = u32(layerParams.weightChannelIndex + 0.5);
        var weightVal = weightMapSample.r;
        if (chIdx == 1u) { weightVal = weightMapSample.g; }
        else if (chIdx == 2u) { weightVal = weightMapSample.b; }
        else if (chIdx == 3u) {
            let isAlphaFull = weightMapSample.a >= 0.99;
            let remainingWeight = clamp(1.0 - (weightMapSample.r + weightMapSample.g + weightMapSample.b), 0.0, 1.0);
            weightVal = select(weightMapSample.a, remainingWeight, isAlphaFull);
        }
        let layerW = clamp(weightVal, 0.0, 1.0);

        if (layerW <= 0.01) { continue; }

        let layerIdx = i32(i);
        let layerUV = worldTileUV * layerParams.uvScale + layerParams.uvOffset;
        let ddxLayerUV = ddxWorldTileUV * layerParams.uvScale;
        let ddyLayerUV = ddyWorldTileUV * layerParams.uvScale;

        let layerAlbedoSample = textureSampleGrad(layerBaseColorArray, baseColorTextureSampler, layerUV, layerIdx, ddxLayerUV, ddyLayerUV);
        let layerAlbedo = layerAlbedoSample.rgb * layerParams.tintColor.rgb;

        blendedAlbedo += layerAlbedo * layerW;
        totalLayerWeight += layerW;
    }

    if (totalLayerWeight > 0.001) {
        let invW = 1.0 / totalLayerWeight;
        let layerBlendAlbedo = blendedAlbedo * invW;
        let alpha = clamp(totalLayerWeight, 0.0, 1.0);
        return mix(uniforms.color.rgb, layerBlendAlbedo, alpha);
    }

    return uniforms.color.rgb;
}

fn getSpecularNDF(NdotH: f32, roughness: f32) -> f32 {
    let alpha = roughness * roughness;
    let alpha2 = alpha * alpha;
    let NdotH2 = NdotH * NdotH;
    let denom = (NdotH2 * (alpha2 - 1.0) + 1.0);
    return (alpha2 * INV_PI) / max(EPSILON, denom * denom);
}

fn getSpecularVisibility(NdotV: f32, NdotL: f32, roughness: f32) -> f32 {
    let alpha = roughness * roughness;
    let alpha2 = alpha * alpha;
    let safeNdotV = max(NdotV, 1e-4);
    let safeNdotL = max(NdotL, 1e-4);
    let oneMinusAlpha2 = 1.0 - alpha2;
    let GGXV = safeNdotL * sqrt(safeNdotV * safeNdotV * oneMinusAlpha2 + alpha2);
    let GGXL = safeNdotV * sqrt(safeNdotL * safeNdotL * oneMinusAlpha2 + alpha2);
    return 0.5 / max(GGXV + GGXL, EPSILON);
}

fn getRoughnessFresnel(cosTheta: f32, F0: vec3<f32>, roughness: f32) -> vec3<f32> {
    let maxF = max(vec3<f32>(1.0 - roughness), F0);
    let f = clamp(1.0 - cosTheta, 0.0, 1.0);
    let f2 = f * f;
    let f5 = f2 * f2 * f;
    return F0 + (maxF - F0) * f5;
}

fn getDirectSpecularBRDF(
    F: vec3<f32>,
    roughness: f32,
    NdotH: f32,
    NdotV: f32,
    NdotL: f32
) -> vec3<f32> {
    let D = getSpecularNDF(NdotH, roughness);
    let V = getSpecularVisibility(NdotV, NdotL, roughness);
    return D * V * F;
}

fn getDirectDiffuseBRDF(
    NdotL: f32,
    NdotV: f32,
    LdotH: f32,
    roughness: f32,
    albedo: vec3<f32>
) -> vec3<f32> {
    if (NdotL <= 0.0) { return vec3<f32>(0.0); }
    let energyFactor = mix(1.0, 1.0 / 1.51, roughness);
    let fd90Minus1 = (0.5 + 2.0 * (LdotH * LdotH)) * roughness - 1.0;
    let fl = clamp(1.0 - NdotL, 0.0, 1.0);
    let fl2 = fl * fl;
    let fl5 = fl2 * fl2 * fl;
    let fv = clamp(1.0 - NdotV, 0.0, 1.0);
    let fv2 = fv * fv;
    let fv5 = fv2 * fv2 * fv;
    let lightScatter = 1.0 + fd90Minus1 * fl5;
    let viewScatter = 1.0 + fd90Minus1 * fv5;
    let factor = (NdotL * energyFactor) * (lightScatter * viewScatter);
    return albedo * factor;
}

fn getDirectPbrLight(
    lightColor: vec3<f32>,
    N: vec3<f32>,
    V: vec3<f32>,
    L: vec3<f32>,
    NdotV: f32,
    roughnessParameter: f32,
    albedo: vec3<f32>
) -> vec3<f32> {
    let NdotL = max(dot(N, L), 0.0);
    if (NdotL <= 0.0) {
        return vec3<f32>(0.0);
    }
    let H = normalize(L + V);
    let NdotH = max(dot(N, H), 0.0);
    let LdotH = max(dot(L, H), 0.0);
    let VdotH = max(dot(V, H), 0.0);

    let F0 = vec3<f32>(0.04);
    let F = getRoughnessFresnel(VdotH, F0, roughnessParameter);
    let SPEC_BRDF = getDirectSpecularBRDF(F, roughnessParameter, NdotH, NdotV, NdotL);
    let diffuse_reflection = getDirectDiffuseBRDF(NdotL, NdotV, LdotH, roughnessParameter, albedo);

    let directLight = (SPEC_BRDF * NdotL) + (vec3<f32>(1.0) - F) * diffuse_reflection;
    return directLight * lightColor;
}

fn getDirectPbrLighting(
    input_vertexPosition: vec3<f32>,
    N: vec3<f32>,
    V: vec3<f32>,
    NdotV: f32,
    roughnessParameter: f32,
    albedo: vec3<f32>,
    visibility: f32
) -> vec3<f32> {
    var totalDirectLighting = vec3<f32>(0.0);
    let u_directionalLightCount = systemUniforms.directionalLightCount;
    let u_directionalLights = systemUniforms.directionalLights;

    for (var i = 0u; i < u_directionalLightCount; i = i + 1u) {
        let lightIntensity = u_directionalLights[i].intensity;
        let L = -normalize(u_directionalLights[i].direction);
        let shadowFactor = select(1.0, visibility, i == 0u);
        var finalLightColor = u_directionalLights[i].color * lightIntensity * systemUniforms.preExposure * shadowFactor;

        if (systemUniforms.useSkyAtmosphere == 1u && i == 0u) {
            let u_atmo = systemUniforms.skyAtmosphere;
            let surfaceHeightKm = max(0.0, input_vertexPosition.y / 1000.0);
            let atmosphereTransmittance = getTransmittance(transmittanceTexture, atmosphereSampler, surfaceHeightKm, L.y, u_atmo.atmosphereHeight);
            finalLightColor *= atmosphereTransmittance;
        }

        totalDirectLighting += getDirectPbrLight(
            finalLightColor,
            N, V, L, NdotV,
            roughnessParameter, albedo
        );
    }

    return totalDirectLighting;
}

fn getLandscapeIndirectLighting(
    N: vec3<f32>,
    albedo: vec3<f32>,
    occlusionParameter: f32
) -> vec3<f32> {
    let u_usePrefilterTexture = systemUniforms.usePrefilterTexture == 1u;
    let u_useSkyAtmosphere = systemUniforms.useSkyAtmosphere == 1u;
    let preExposure = systemUniforms.preExposure;

    if (u_usePrefilterTexture || u_useSkyAtmosphere) {
        var iblDiffuseColor = vec3<f32>(0.0);

        if (u_usePrefilterTexture) {
            iblDiffuseColor = textureSampleLevel(ibl_irradianceTexture, prefilterTextureSampler, N, 0).rgb * preExposure * systemUniforms.iblIntensity;
        }

        if (u_useSkyAtmosphere) {
            let u_atmo = systemUniforms.skyAtmosphere;
            let camH = u_atmo.cameraHeight;
            let atmH = u_atmo.atmosphereHeight;
            let skyIntensity = u_atmo.sunIntensity;
            let diffTrans = getTransmittance(transmittanceTexture, atmosphereSampler, camH, N.y, atmH);
            let skyIrradiance = textureSampleLevel(atmosphereIrradianceLUT, atmosphereSampler, N, 0.0).rgb * skyIntensity * preExposure;
            iblDiffuseColor = (iblDiffuseColor * diffTrans) + skyIrradiance;
        }

        return albedo * (iblDiffuseColor * occlusionParameter);
    } else {
        let ambFactor = systemUniforms.ambientLight.intensity * (preExposure * occlusionParameter);
        return albedo * (systemUniforms.ambientLight.color * ambFactor);
    }
}

fn sampleBilinearHeight(uv: vec2<f32>, texSize: vec2<f32>) -> f32 {
    let coord = uv * texSize - vec2<f32>(0.5);
    let iCoord = floor(coord);
    let fCoord = fract(coord);

    let maxCoord = texSize - vec2<f32>(1.0);
    let c0 = vec2<i32>(clamp(iCoord, vec2<f32>(0.0), maxCoord));
    let c1 = vec2<i32>(clamp(iCoord + vec2<f32>(1.0, 0.0), vec2<f32>(0.0), maxCoord));
    let c2 = vec2<i32>(clamp(iCoord + vec2<f32>(0.0, 1.0), vec2<f32>(0.0), maxCoord));
    let c3 = vec2<i32>(clamp(iCoord + vec2<f32>(1.0, 1.0), vec2<f32>(0.0), maxCoord));

    let h0 = textureLoad(heightMapTexture, c0, 0).r;
    let h1 = textureLoad(heightMapTexture, c1, 0).r;
    let h2 = textureLoad(heightMapTexture, c2, 0).r;
    let h3 = textureLoad(heightMapTexture, c3, 0).r;

    let top = mix(h0, h1, fCoord.x);
    let bot = mix(h2, h3, fCoord.x);
    return mix(top, bot, fCoord.y);
}

fn computeLandscapeHeightmapShadow(
    worldPos: vec3<f32>,
    N: vec3<f32>,
    L: vec3<f32>,
    worldSizeX: f32,
    worldSizeZ: f32,
    vhtTexSize: vec2<f32>,
    heightScale: f32,
    maxDistance: f32,
    stepsF: f32,
    softness: f32
) -> f32 {
    let stepCount = u32(clamp(stepsF, 4.0, 48.0));
    let invStepCount = 1.0 / f32(stepCount);
    let minDistance = 25.0;
    let distRange = max(1.0, maxDistance - minDistance);

    var shadowFactor: f32 = 1.0;

    let invWorldSize = vec2<f32>(1.0 / worldSizeX, 1.0 / worldSizeZ);
    // 자가 차폐(Self-Occlusion Acne) 방지를 위한 표면 법선 오프셋
    let biasedPos = worldPos + N * 2.0;
    let baseUV = (biasedPos.xz + vec2<f32>(worldSizeX, worldSizeZ) * 0.5) * invWorldSize;
    let uvDir = L.xz * invWorldSize;

    for (var i = 0u; i < stepCount; i = i + 1u) {
        let u = (f32(i) + 0.5) * invStepCount;
        let t = minDistance + distRange * (u * u);
        let samplePosY = biasedPos.y + L.y * t;

        if (samplePosY > heightScale) {
            break;
        }

        let uv = baseUV + uvDir * t;

        if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
            break;
        }

        let terrainHeight = sampleBilinearHeight(uv, vhtTexSize) * heightScale;
        // 거리 비례 적응형 바이어스로 자기 자신 폴리곤에 광선이 걸리는 여드름 현상 차단
        let bias = max(2.5, t * 0.006);
        let diff = samplePosY - terrainHeight + bias;

        if (diff < 0.0) {
            let hardPenumbra = clamp(1.0 + diff / max(1.0, bias * 2.0), 0.0, 1.0);
            shadowFactor = min(shadowFactor, hardPenumbra);
        } else {
            let penumbra = clamp(diff * softness / max(1.0, t), 0.0, 1.0);
            shadowFactor = min(shadowFactor, penumbra);
        }

        if (shadowFactor <= 0.001) {
            return 0.0;
        }
    }

    return shadowFactor;
}

fn getFoliageSubCellDebugColor(
    worldPosXZ: vec2<f32>,
    cameraPosXZ: vec2<f32>,
    cellSize: f32,
    streamingRadius: f32,
    worldSizeX: f32,
    worldSizeZ: f32
) -> vec4<f32> {
    if (landscapeInstanceUniforms.foliageSubCellColoration < 0.5) {
        return vec4<f32>(0.0);
    }

    let safeCellSize = max(10.0, cellSize);
    let halfSize = vec2<f32>(worldSizeX * 0.5, worldSizeZ * 0.5);
    let shifted = clamp(worldPosXZ + halfSize, vec2<f32>(0.0), vec2<f32>(worldSizeX, worldSizeZ));
    let cellCoord = floor(shifted / safeCellSize);
    let cellFract = fract(shifted / safeCellSize);

    // 1. 그리드 와이어프레임 경계선 (안티앨리어싱 fwidth 활용)
    let gridDist = abs(cellFract - vec2<f32>(0.5));
    let gridEdge = vec2<f32>(0.5) - gridDist;
    let fw = fwidth(shifted / safeCellSize);
    let line = smoothstep(fw * 1.5, vec2<f32>(0.0), gridEdge);
    let isWireframe = max(line.x, line.y);

    // 2. 절차적 셀 고유 해시 컬러 (Hue 변환)
    let hash1 = fract(sin(dot(cellCoord, vec2<f32>(12.9898, 78.233))) * 43758.5453);
    let hash2 = fract(sin(dot(cellCoord, vec2<f32>(93.9898, 67.345))) * 24634.6345);
    let hash3 = fract(sin(dot(cellCoord, vec2<f32>(45.1234, 19.876))) * 58392.1234);
    let baseCellColor = vec3<f32>(0.2 + 0.6 * hash1, 0.2 + 0.6 * hash2, 0.2 + 0.6 * hash3);

    // 3. 카메라와의 수평 거리 판정 (원형 링)
    let distToCam = distance(worldPosXZ, cameraPosXZ);
    let isInRadius = distToCam <= streamingRadius;

    // 4. 스트리밍 반경 경계 링 (폭 약 4m)
    let ringDist = abs(distToCam - streamingRadius);
    let ringIntensity = smoothstep(4.0, 0.0, ringDist);

    var finalColor = vec3<f32>(0.0);
    var alpha = 0.0;

    if (isInRadius) {
        // 활성 서브셀: 셀 고유 색상(알파 0.5) + 밝은 황백색 그리드 라인
        finalColor = mix(baseCellColor, vec3<f32>(1.0, 1.0, 0.9), isWireframe * 0.85);
        alpha = mix(0.5, 0.9, isWireframe);
    } else {
        // 비활성 서브셀: 어둡게 딤드된 회색 그리드만 은은하게 표시
        finalColor = vec3<f32>(0.1, 0.1, 0.15);
        alpha = isWireframe * 0.35;
    }

    // 스트리밍 경계 네온 사이언(Cyan) 링 합성
    if (ringIntensity > 0.01) {
        finalColor = mix(finalColor, vec3<f32>(0.0, 1.0, 1.0), ringIntensity * 0.95);
        alpha = max(alpha, ringIntensity * 0.9);
    }

    return vec4<f32>(finalColor, alpha);
}

@fragment
fn main(inputData: InputData) -> OutputFragment {
    var output: OutputFragment;

    let input_vertexPosition = inputData.vertexPosition;
    let u_cameraPosition = systemUniforms.camera.cameraPosition;
    let globalUV = inputData.uv1;
    let worldTileUV = inputData.uv;

    let ddxGlobalUV = dpdx(globalUV);
    let ddyGlobalUV = dpdy(globalUV);
    let ddxWorldTileUV = dpdx(worldTileUV);
    let ddyWorldTileUV = dpdy(worldTileUV);

    var albedo = computeLandscapeLayersAlbedo(globalUV, worldTileUV, ddxGlobalUV, ddyGlobalUV, ddxWorldTileUV, ddyWorldTileUV);
    let N = getBaseNormal(globalUV);
    let V: vec3<f32> = getViewDirection(input_vertexPosition, u_cameraPosition);
    let rawViewDist = distance(u_cameraPosition, input_vertexPosition);

    let roughnessFactor = 0.85;
    let ambientOcclusion = 1.0;

    if (inputData.instanceColor.a > 0.0) {
        albedo = mix(albedo, inputData.instanceColor.rgb, 0.6);
    }

    if (landscapeInstanceUniforms.foliageSubCellColoration > 0.5) {
        let debugSubCell = getFoliageSubCellDebugColor(
            input_vertexPosition.xz,
            u_cameraPosition.xz,
            landscapeInstanceUniforms.foliageSubCellSize,
            landscapeInstanceUniforms.foliageStreamingRadius,
            landscapeInstanceUniforms.worldSizeX,
            landscapeInstanceUniforms.worldSizeZ
        );
        if (debugSubCell.a > 0.0) {
            albedo = mix(albedo, debugSubCell.rgb, debugSubCell.a);
        }
    }

    let NdotV = max(abs(dot(N, V)), 0.04);
    let roughnessParameter = max(roughnessFactor, 0.04);

    let receiveShadowYn = inputData.receiveShadow != 0.0 && systemUniforms.directionalLightCount > 0u;
    var L = vec3<f32>(0.0, 1.0, 0.0);
    if (systemUniforms.directionalLightCount > 0u) {
        L = -normalize(systemUniforms.directionalLights[0].direction);
    }
    let NdotL = dot(N, L);

    var visibility = 1.0;

    if (receiveShadowYn && NdotL > 0.001) {
        var terrainShadowVis = 1.0;
        var isDeepTerrainShadow = false;
        if (landscapeInstanceUniforms.heightmapShadow > 0.5 && L.y > 0.01) {
            let terrainSelfShadow = computeLandscapeHeightmapShadow(
                input_vertexPosition,
                N,
                L,
                landscapeInstanceUniforms.worldSizeX,
                landscapeInstanceUniforms.worldSizeZ,
                landscapeInstanceUniforms.vhtTextureSize,
                landscapeInstanceUniforms.heightScale,
                landscapeInstanceUniforms.heightmapShadowDistance,
                landscapeInstanceUniforms.heightmapShadowSteps,
                landscapeInstanceUniforms.heightmapShadowSoftness
            );
            terrainShadowVis = mix(1.0 - systemUniforms.shadow.directionalShadowStrength, 1.0, terrainSelfShadow);
            isDeepTerrainShadow = terrainSelfShadow <= 0.001;
        }

        let cascadeCount = min(4u, max(1u, systemUniforms.shadow.cascadeCount));
        let maxCSMDist = systemUniforms.shadow.cascadeSplitDepths[cascadeCount - 1u];

        if (rawViewDist < maxCSMDist && !isDeepTerrainShadow) {
            let rawVisibility: f32 = getDirectionalShadowVisibility(
                directionalShadowMap,
                directionalShadowMapSampler,
                input_vertexPosition,
                N,
                L
            );
            let csmVisibility = mix(1.0 - systemUniforms.shadow.directionalShadowStrength, 1.0, rawVisibility);
            visibility = min(csmVisibility, terrainShadowVis);
        } else {
            visibility = terrainShadowVis;
        }
    }

    let directLighting = getDirectPbrLighting(
        input_vertexPosition,
        N, V, NdotV,
        roughnessParameter, albedo,
        visibility
    );

    let indirectLighting = getLandscapeIndirectLighting(
        N,
        albedo,
        ambientOcclusion
    );

    let finalColor = vec4<f32>(directLighting + indirectLighting, 1.0);

    output.color = finalColor;
    output.gBufferNormal = vec4<f32>(N * 0.5 + 0.5, 1.0);
    output.gBufferMotionVector = vec4<f32>(getMotionVector(inputData.currentClipPos, inputData.prevClipPos), 0.0, 1.0);
    return output;
}
