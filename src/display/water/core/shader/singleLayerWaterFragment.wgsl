#redgpu_include SYSTEM_UNIFORM;
#redgpu_include systemStruct.OutputFragment;
#redgpu_include math.tnb.getTBNFromVertexTangent;

#redgpu_include math.PI;
#redgpu_include math.INV_PI;
#redgpu_include math.EPSILON;
#redgpu_include color.linearToSrgbVec3;

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
    let f5 = f2 * f2 * f;
    return F0 + (1.0 - F0) * f5;
}

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
    normalScale2: f32,
    normalTiling2: f32,
    windSpeed2: f32,

    windDirection2: vec2<f32>,
    useNormalTexture2: u32,
    roughness: f32,

    specularFactor: f32,
    fresnelF0: f32,
    invertNormalY1: u32,
    invertNormalY2: u32,
};

@group(2) @binding(0) var<uniform> uniforms: WaterUniforms;
@group(2) @binding(1) var normalTextureSampler: sampler;
@group(2) @binding(2) var normalTexture: texture_2d<f32>;
@group(2) @binding(3) var normalTexture2: texture_2d<f32>;

// Colin Barré-Brisebois & Stephen Hill (2012) Reoriented Normal Mapping
fn blendRNM(n1: vec3<f32>, n2: vec3<f32>) -> vec3<f32> {
    let t = n1 + vec3<f32>(0.0, 0.0, 1.0);
    let u = n2 * vec3<f32>(-1.0, -1.0, 1.0);
    return normalize(t * dot(t, u) - u * t.z);
}

struct InputData {
    @builtin(position) position: vec4<f32>,
    @location(0) vertexPosition: vec3<f32>,
    @location(1) vertexNormal: vec3<f32>,
    @location(2) uv: vec2<f32>,
    @location(3) vertexTangent: vec4<f32>,
    @location(7) currentClipPos: vec4<f32>,
    @location(8) prevClipPos: vec4<f32>,
    @location(11) combinedOpacity: f32,
    @location(14) @interpolate(flat) receiveShadow: f32,
};

fn unpackTangentNormal(color: vec3<f32>) -> vec3<f32> {
    let xy = color.xy * 2.0 - 1.0;
    let z = sqrt(max(0.001, 1.0 - dot(xy, xy)));
    return vec3<f32>(xy, z);
}

@fragment
fn main(inputData: InputData) -> OutputFragment {
    var output: OutputFragment;

    let pixelCoord = vec2<i32>(inputData.position.xy);
    let cameraNear = systemUniforms.camera.nearClipping;
    let cameraFar = systemUniforms.camera.farClipping;

    // 1. 2Path 바닥 씬 원시 깊이 버퍼 [0, 1] 샘플링
    let rawSceneDepth = textureLoad(renderPath1DepthTexture, pixelCoord, 0);

    // 2. 바닥 씬의 카메라 뷰공간 선형 거리 (Linear View-Z, 단위: m)
    let linearSceneDepth = getLinearizeDepth(rawSceneDepth, cameraNear, cameraFar);

    // 3. 물 표면 프래그먼트의 카메라 뷰공간 선형 거리 (Linear View-Z, 단위: m)
    let rawWaterDepth = inputData.position.z;
    let linearWaterDepth = getLinearizeDepth(rawWaterDepth, cameraNear, cameraFar);

    // 4. 수면과 물밑 지형 간의 물리적 수심 차이 (Delta Depth = Scene Z - Water Z)
    let deltaDepth = max(0.0, linearSceneDepth - linearWaterDepth);

    // 5. Phase 4: 언리얼 표준 Depth Fade 가중치 계산 (0.0: 물가 경계면 -> 1.0: 깊은 물)
    let fadeDist = max(0.001, uniforms.depthFadeDistance);
    let depthFade = clamp(deltaDepth / fadeDist, 0.0, 1.0);

    // 6. Phase 7 & 9: 듀얼 노멀 교차 스크롤링 & RNM(Reoriented Normal Mapping) 블렌딩
    let timeSec = systemUniforms.time.time;

    // [Layer 1: 주 너울 파도]
    let windDirLen1 = length(uniforms.windDirection);
    let baseWindDir1 = select(vec2<f32>(1.0, 0.0), uniforms.windDirection / windDirLen1, windDirLen1 > 0.001);
    let waveUV1 = inputData.uv * uniforms.normalTiling + baseWindDir1 * (timeSec * uniforms.windSpeed);

    let rawSample1 = textureSample(normalTexture, normalTextureSampler, waveUV1).rgb;
    // [sRGB 텍스처 하드웨어 디코딩 완벽 보정]:
    // RedGPU BitmapTexture는 기본적으로 *-srgb 포맷으로 생성되어 GPU가 샘플링 시 sRGBToLinear(C^2.2) 변환을 수행함.
    // 선형 벡터 데이터를 100% 무결하게 복원하기 위해 정밀 sRGB 역변환(linearToSrgbVec3)을 거쳐 0.5 원점을 완벽 복원
    let rawNormal1 = linearToSrgbVec3(rawSample1);
    // [Layer 1: 주 너울 파도]
    var tangentXY1 = (rawNormal1.xy * 2.0 - 1.0) * uniforms.normalScale;
    if (uniforms.invertNormalY1 == 1u) {
        tangentXY1.y = -tangentXY1.y;
    }
    let tangentZ1 = sqrt(max(0.001, 1.0 - dot(tangentXY1, tangentXY1)));
    var combinedTangentNormal = normalize(vec3<f32>(tangentXY1, tangentZ1));

    // [Layer 2: 마이크로 잔물결 교차 파도 & RNM 블렌딩]
    if (uniforms.useNormalTexture2 > 0u) {
        let windDirLen2 = length(uniforms.windDirection2);
        let baseWindDir2 = select(vec2<f32>(-0.6, 0.8), uniforms.windDirection2 / windDirLen2, windDirLen2 > 0.001);
        let waveUV2 = inputData.uv * uniforms.normalTiling2 + baseWindDir2 * (timeSec * uniforms.windSpeed2);

        let rawSample2 = textureSample(normalTexture2, normalTextureSampler, waveUV2).rgb;
        let rawNormal2 = linearToSrgbVec3(rawSample2);
        var tangentXY2 = (rawNormal2.xy * 2.0 - 1.0) * uniforms.normalScale2;
        if (uniforms.invertNormalY2 == 1u) {
            tangentXY2.y = -tangentXY2.y;
        }
        let tangentZ2 = sqrt(max(0.001, 1.0 - dot(tangentXY2, tangentXY2)));
        let tangentNormal2 = normalize(vec3<f32>(tangentXY2, tangentZ2));

        // 주 파도 기저 위에 제2 파도를 회전 얹는 RNM 합성
        combinedTangentNormal = blendRNM(combinedTangentNormal, tangentNormal2);
    }

    // [원거리 노멀 페이드 (Distance Normal Fade)]:
    // 원경으로 갈수록 고주파 파도 노멀을 부드럽게 평면으로 페이드아웃하여 수평선 부근의 은박지 노이즈를 완천 차단
    let camDist = length(systemUniforms.camera.cameraPosition - inputData.vertexPosition);
    let distNormalFade = clamp((camDist - 20.0) / 70.0, 0.0, 0.85);
    combinedTangentNormal = normalize(mix(combinedTangentNormal, vec3<f32>(0.0, 0.0, 1.0), distNormalFade));

    let baseNormal = normalize(inputData.vertexNormal);
    let tbn = getTBNFromVertexTangent(baseNormal, inputData.vertexTangent);
    let worldNormal = normalize(tbn * combinedTangentNormal);

    // 7. Phase 7 & 8: 순수 파도 섭동에 의한 스넬의 굴절 왜곡 (Pure Perturbation Refraction)
    let screenUV = inputData.position.xy / systemUniforms.resolution;
    let deltaWorldNormal = worldNormal - baseNormal;
    let viewDeltaNormal = (systemUniforms.camera.viewMatrix * vec4<f32>(deltaWorldNormal, 0.0)).xyz;

    // [화면 테두리 가드 (Screen Edge Guard)]:
    // 화면 테두리(4% 마진)로 갈수록 굴절 왜곡을 0으로 부드럽게 감쇄하여 스미어링 방지
    let edgeDist = min(screenUV, vec2<f32>(1.0) - screenUV);
    let screenEdgeFade = clamp(min(edgeDist.x, edgeDist.y) / 0.04, 0.0, 1.0);

    // [카메라 뷰 공간 -> 스크린 UV 공간 투영]:
    // WebGPU 화면 UV는 상단이 0, 하단이 1(+Y가 아래)이므로 뷰 공간의 상향(+Y) 벡터와 부호 반전 필요 (-viewDeltaNormal.y)
    let viewScreenPerturb = vec2<f32>(viewDeltaNormal.x, -viewDeltaNormal.y);

    // 화면 테두리 가드를 결합한 유효 굴절 강도 (인위적인 등고선 단차를 유발하던 depthFade 곱셈 배제)
    let effectiveRefractionStrength = uniforms.refractionStrength * screenEdgeFade;
    let rawRefractionOffset = viewScreenPerturb * effectiveRefractionStrength;

    // [Phase 8: UE5 표준 소프트 뎁스 블리딩 방지 상시 가동 (Always-On Soft Refraction Bleeding Prevention)]:
    // 굴절 대상 지점의 깊이를 사전 검사하여, 물 밖의 물체이거나 수면보다 얕은 곳은
    // 하드 스냅이 아닌 점진적 소프트 페이드(0.05m 안전 마진)로 굴절 오프셋을 자연스럽게 0으로 수렴시켜 물 밖 번짐 100% 원천 차단
    let testUV = clamp(screenUV + rawRefractionOffset, vec2<f32>(0.001), vec2<f32>(0.999));
    let testCoord = vec2<i32>(testUV * systemUniforms.resolution);
    let rawDistortedDepth = textureLoad(renderPath1DepthTexture, testCoord, 0);
    let linearDistortedDepth = getLinearizeDepth(rawDistortedDepth, cameraNear, cameraFar);
    let distortedDeltaDepth = linearDistortedDepth - linearWaterDepth;

    // 물 표면보다 앞쪽에 있는 물체는 굴절을 부드럽게 감쇄 (0.05m 안전 마진 소프트 블렌딩)
    let bleedWeight = clamp(distortedDeltaDepth / 0.05, 0.0, 1.0);
    let finalRefractUV = clamp(screenUV + rawRefractionOffset * bleedWeight, vec2<f32>(0.001), vec2<f32>(0.999));

    // 굴절되어 도달한 실제 바닥 지형의 수심 동기화 (Beer-Lambert 및 물 알베도와 1:1 일치)
    let finalCoord = vec2<i32>(finalRefractUV * systemUniforms.resolution);
    let rawFinalDepth = textureLoad(renderPath1DepthTexture, finalCoord, 0);
    let linearFinalDepth = getLinearizeDepth(rawFinalDepth, cameraNear, cameraFar);
    let effectiveDeltaDepth = max(0.0, linearFinalDepth - linearWaterDepth);

    // 굴절 왜곡된 2Path 바닥 씬 컬러 샘플링
    let sceneColor = textureSampleLevel(renderPath1ResultTexture, renderPath1ResultTextureSampler, finalRefractUV, 0.0).rgb;

    // 8. Phase 6: 비어-람베르트(Beer-Lambert) 수심 광학 및 이중 알베도 계산
    // 굴절되어 도달한 실제 바닥 지형까지의 물리적 광로(effectiveDeltaDepth)를 기준으로 흡수율과 알베도를 계산하여 지형과 완벽히 동기화
    let extinction = exp(-effectiveDeltaDepth * uniforms.extinctionFactor);

    // 수심에 따른 물 고유의 광학 알베도 (Water Optical Albedo)
    let waterAlbedo = mix(uniforms.baseColor, uniforms.deepColor, 1.0 - extinction);

    // 수체 유효 흡수 강도 (Absorption Strength)
    // 수심이 0m일 때 extinction=1.0 -> absorptionStrength=0.0이 되어 바닥 지형과 완벽한 물리적 소프트 융합 실현
    let absorptionStrength = clamp((1.0 - extinction) * uniforms.opacity, 0.0, 1.0);

    // 10. Phase 10: Schlick Fresnel & Skybox/IBL 환경 거울 반사 (Mirror Reflection)
    let worldPos = inputData.vertexPosition;
    let V = normalize(systemUniforms.camera.cameraPosition - worldPos);
    let baseN = normalize(inputData.vertexNormal);
    let N = worldNormal;

    // [에너지 보존 프레넬 (Pure Planar Normal)]:
    // 프레넬 반사율 F에 파도 노멀을 섞으면 반사율 얼룩이 생겨 기름막(유막)처럼 보임.
    // 프레넬(반사율 곡선)은 순수 평면 법선(baseN)을 100% 기준으로 삼아 매끄러운 그라데이션 유지
    let NdotV_planar = clamp(dot(baseN, V), 0.001, 1.0);
    let NdotV = clamp(dot(N, V), 0.001, 1.0);

    // 반사 벡터 R은 실제 파도의 입체적인 출렁임(worldNormal)을 100% 반영하여 물결 왜곡 형성
    let rawR = reflect(-V, N);

    // [수면 지평선 반사 정규화 (Smooth Horizon Reflection)]:
    var R = rawR;
    R.y = max(abs(R.y), 0.02);
    R = normalize(R);

    // Schlick 근사 Fresnel 계산 (물 물리 상수 F0 ≈ 0.02)
    let oneMinusNdotV = 1.0 - NdotV_planar;
    let fresnelTerm = uniforms.fresnelF0 + (1.0 - uniforms.fresnelF0) * (oneMinusNdotV * oneMinusNdotV * oneMinusNdotV * oneMinusNdotV * oneMinusNdotV);
    // [UE5/Smith 미세면 차폐 물리 기반]: 거칠기에 따른 반사광 기하 차폐 (Roughness Shadowing)
    let maxFresnel = 1.0 / (1.0 + 2.0 * uniforms.roughness);
    let fresnel = clamp(fresnelTerm * uniforms.specularFactor, 0.0, maxFresnel);

    // Skybox / IBL 큐브맵 반사광 샘플링 (거칠기 밉맵 블러 포함)
    // 수면의 자연스러운 액체 질감을 위해 기본 거칠기에 미세 분산(0.08)을 가미하여 유막처럼 칼같이 맺히는 현상 방지
    let preExposure = systemUniforms.preExposure;
    let u_usePrefilterTexture = systemUniforms.usePrefilterTexture == 1u;
    let u_useSkyAtmosphere = systemUniforms.useSkyAtmosphere == 1u;
    var skyReflectionColor = vec3<f32>(0.0);

    if (u_usePrefilterTexture) {
        let iblMipmapCount = f32(textureNumLevels(ibl_prefilterTexture) - 1);
        let effectiveRoughnessIBL = clamp(uniforms.roughness + 0.06, 0.0, 1.0);
        let mipLevel = clamp(effectiveRoughnessIBL * iblMipmapCount, 0.0, iblMipmapCount);
        let sampledIBL = textureSampleLevel(ibl_prefilterTexture, prefilterTextureSampler, R, mipLevel).rgb * preExposure * systemUniforms.iblIntensity;
        skyReflectionColor = sampledIBL;
    }
    if (u_useSkyAtmosphere) {
        let u_atmo = systemUniforms.skyAtmosphere;
        let skyIntensity = u_atmo.sunIntensity;
        let atmoMipCount = f32(textureNumLevels(skyAtmosphere_prefilteredTexture) - 1);
        let atmoMipLevel = uniforms.roughness * atmoMipCount;
        let atmoColor = textureSampleLevel(skyAtmosphere_prefilteredTexture, atmosphereSampler, R, atmoMipLevel).rgb * skyIntensity * preExposure;
        skyReflectionColor = skyReflectionColor + atmoColor;
    }

    // 11. Phase 11: 태양광 Cook-Torrance GGX 다이아몬드 윤슬 & 물리 기반 수체 체적 직사 산란광
    var directSpecularColor = vec3<f32>(0.0);
    var directWaterScattering = vec3<f32>(0.0);
    let u_directionalLightCount = systemUniforms.directionalLightCount;
    let u_directionalLights = systemUniforms.directionalLights;

    // [Karis 2013 / UE5 Area Light]: 태양 각직경(약 0.54도)에 의한 면적 광원 유효 거칠기 물리 보정
    let effectiveRoughness = clamp(sqrt(uniforms.roughness * uniforms.roughness + 0.005), 0.04, 1.0);

    for (var i = 0u; i < u_directionalLightCount; i = i + 1u) {
        let light = u_directionalLights[i];
        let lightIntensity = light.intensity;
        let L = -normalize(light.direction);
        let NdotL = max(dot(N, L), 0.0);
        let finalLightColor = light.color * lightIntensity * preExposure;

        // [A] 직사광 스펙큘러: 일반 표준 PBR 스펙큘러 + 태양광 다이아몬드 윤슬 + 파도 분산 광택 삼중 융합
        if (NdotL > 0.0) {
            let H = normalize(L + V);
            let NdotH = max(dot(N, H), 0.0);
            let VdotH = max(dot(V, H), 0.0);

            let F = getSpecularFresnel(VdotH, uniforms.fresnelF0);

            // 1) 일반 표준 PBR 스펙큘러 (Standard PBR Specular Highlight)
            // 일반 물체처럼 파도 곡면을 따라 자연스럽고 부드럽게 맺히는 PBR 스펙큘러 하이라이트
            let pbrRoughness = clamp(uniforms.roughness + 0.16, 0.10, 0.85);
            let D_pbr = getSpecularNDF(NdotH, pbrRoughness);
            let Vis_pbr = getSpecularVisibility(NdotV, NdotL, pbrRoughness);
            let pbrSpecular = D_pbr * Vis_pbr;

            // 2) 샤프한 다이아몬드 코어 윤슬 (Sharp Core Glint)
            // 파도 능선과 미세 잔물결에서 강렬하게 번쩍이는 다이아몬드 코어 반짝임
            let D_glitter = getSpecularNDF(NdotH, effectiveRoughness);
            let Vis_glitter = getSpecularVisibility(NdotV, NdotL, effectiveRoughness);
            let glitterSpecular = D_glitter * Vis_glitter;

            // 3) 파도 사면 통계 분산 광역 스펙큘러 (Cox-Munk Broad Wave Specular)
            // 파도 경사면들의 분산에 의해 넓은 각도에서도 수면 전체가 화사하게 빛나는 파도 광택
            let waveRoughness = clamp(uniforms.roughness + 0.40, 0.28, 0.75);
            let D_wave = getSpecularNDF(NdotH, waveRoughness);
            let Vis_wave = getSpecularVisibility(NdotV, NdotL, waveRoughness);
            let waveSpecular = D_wave * Vis_wave;

            // 파도 능선 미세 반짝임 (Micro Facet Crest Shimmer: 에너지 보존을 위해 0.9 ~ 1.2 범위로 완화)
            let deltaN = N - baseNormal;
            let crestFacet = clamp(dot(deltaN, H) * 1.2, -0.1, 0.2);
            let facetMultiplier = 1.0 + crestFacet;

            // [에너지 보존 1]: 다중 스펙큘러 로브 가중합 정규화 (합계: 0.50 + 0.35 + 0.15 = 1.00)
            let combinedSpec = (pbrSpecular * 0.50 + glitterSpecular * 0.35 + waveSpecular * 0.15) * F * uniforms.specularFactor * facetMultiplier;
            directSpecularColor = directSpecularColor + finalLightColor * (combinedSpec * NdotL);
        }

        // [B] UE5 SingleLayerWater 표준: 수중 복사 전달 및 체적 단일 산란 (Volume In-Scattering)
        // 수직 입사 굴절각 (스넬의 법칙)
        let cosThetaI = max(L.y, 0.0);
        let sin2ThetaT = (1.0 - cosThetaI * cosThetaI) * (1.0 / (1.333 * 1.333));
        let cosThetaT = sqrt(max(0.001, 1.0 - sin2ThetaT));

        let lightFresnel = getSpecularFresnel(NdotL, uniforms.fresnelF0);
        let sunTransmittance = max(0.0, 1.0 - lightFresnel);

        // [체적 산란의 물리적 수심 비례]:
        // 얕은 물가(effectiveDeltaDepth -> 0, extinction -> 1.0)에서는 산란광이 0이 되어 바닥이 100% 맑고 투명하게 유지됨.
        // 수심이 깊어질수록((1.0 - extinction) 증가) 비로소 물 고유의 알베도 색상으로 화사하게 산란 발현
        let volumeInScatteringFactor = (1.0 - extinction) * 0.20;
        let volumeInScattering = finalLightColor * (sunTransmittance * cosThetaT * volumeInScatteringFactor);

        // [C] 저고도 역광 파도 능선 투과 산란 (Subsurface Wave Translucency)
        let VdotL = dot(V, L);
        let lowSunFactor = clamp(1.0 - max(L.y, 0.0), 0.0, 1.0);
        let forwardScatter = max(0.0, -VdotL);
        let waveTranslucency = pow(forwardScatter, 3.0) * (1.0 - NdotL * 0.5) * (1.0 - extinction);
        let subsurfaceScattering = finalLightColor * (waveTranslucency * lowSunFactor * sunTransmittance * 0.35);

        directWaterScattering = directWaterScattering + (volumeInScattering + subsurfaceScattering) * waterAlbedo;
    }

    // [에너지 보존 2]: 태양 직사광 스펙큘러와의 이중 계산 방지 (IBL/SkyAtmosphere가 있을 때만 해당 실제 환경광 반사)
    let finalSkyReflection = skyReflectionColor;

    // [에너지 보존 3]: 바닥 씬 투과광(Transmitted Scene)의 비어-람베르트 광학 수심 틴트
    let waterTransmissionTint = mix(waterAlbedo, vec3<f32>(1.0), extinction);
    let transmittedSceneColor = sceneColor * extinction * waterTransmissionTint;

    // [UE5 체적 환경 산란]: 수심이 깊어질수록 물 고유의 알베도(에메랄드/사파이어)가 앰비언트광을 머금고 화사하게 발색
    let baseAmbient = systemUniforms.ambientLight.color * systemUniforms.ambientLight.intensity * preExposure;
    let ambientInScattering = baseAmbient * 2.0 * waterAlbedo * (1.0 - extinction);
    let waterScattering = directWaterScattering + ambientInScattering;

    // [UE5 SingleLayerWater 표준 에너지 분리 합성]:
    // 바닥에서 올라오는 투과광만 수면을 통과할 때 (1 - F)로 감쇄되고,
    // 물 자체의 체적 산란광(waterScattering)은 수면 아래를 묵직하게 받쳐주어 하늘 반사가 기름막처럼 뜨지 않고 자연스럽게 융합됨
    let reflectedWater = transmittedSceneColor * (1.0 - fresnel) + waterScattering + finalSkyReflection * fresnel;

    // [에너지 보존 5]: 직사광 스펙큘러 하이라이트 가산 합성
    let finalRgb = reflectedWater + directSpecularColor;

    let maxDepth = max(0.001, uniforms.debugMaxDepth);

    switch (uniforms.debugMode) {
        case 13u: {
            // Step 11.4: 태양광 직사 스펙큘러 윤슬(Sun Glitter) 단독 뷰
            output.color = vec4<f32>(directSpecularColor, 1.0);
        }
        case 12u: {
            // Step 10.3: Skybox/IBL 환경 반사광 단독 뷰
            output.color = vec4<f32>(finalSkyReflection, 1.0);
        }
        case 11u: {
            // Step 10.2: Schlick Fresnel 반사율 마스크 (0.02 검정 -> 1.0 흰색)
            output.color = vec4<f32>(vec3<f32>(fresnel), 1.0);
        }
        case 10u: {
            // Step 7.5: 굴절 왜곡 오프셋 벡터 시각화 (중앙값 0.5 회색 기준)
            let actualOffset = finalRefractUV - screenUV;
            output.color = vec4<f32>(actualOffset * 50.0 + 0.5, 0.0, 1.0);
        }
        case 9u: {
            // Step 7.4: 월드 파도 법선 벡터 시각화
            output.color = vec4<f32>(worldNormal * 0.5 + 0.5, 1.0);
        }
        case 8u: {
            // Step 6.6: 수심별 물 고유 알베도 (Water Optical Albedo 단독 뷰)
            output.color = vec4<f32>(waterAlbedo, 1.0);
        }
        case 7u: {
            // Step 6.4: 비어-람베르트 광학 흡수 마스크 (0.0: 얕은 물가 투과 -> 1.0: 깊은 물 완전 흡수)
            output.color = vec4<f32>(vec3<f32>(1.0 - extinction), 1.0);
        }
        case 6u: {
            // Step 5.2: Scene Color Passthrough (투명 유리처럼 순수 바닥 씬 컬러 100% 무왜곡 투과)
            output.color = vec4<f32>(sceneColor, 1.0);
        }
        case 5u: {
            // Step 4.2: Depth Fade 가중치 마스크 (0.0 검은색 -> 1.0 흰색)
            output.color = vec4<f32>(vec3<f32>(depthFade), 1.0);
        }
        case 4u: {
            // Step 3.4: Delta Depth 수심 마스크
            let mask = clamp(deltaDepth / maxDepth, 0.0, 1.0);
            output.color = vec4<f32>(vec3<f32>(mask), 1.0);
        }
        case 3u: {
            // Step 3.2: 물 표면 선형 거리
            let waterZ = clamp(linearWaterDepth / maxDepth, 0.0, 1.0);
            output.color = vec4<f32>(vec3<f32>(waterZ), 1.0);
        }
        case 2u: {
            // Step 3.3: 바닥 지형 선형 거리
            let sceneZ = clamp(linearSceneDepth / maxDepth, 0.0, 1.0);
            output.color = vec4<f32>(vec3<f32>(sceneZ), 1.0);
        }
        case 1u: {
            // Step 2: 비선형 원시 깊이 (Raw Depth)
            output.color = vec4<f32>(vec3<f32>(rawSceneDepth), 1.0);
        }
        default: {
            // Step 7.5: 굴절과 비어-람베르트 광학이 결합된 PBR 수체 물리 렌더링
            output.color = vec4<f32>(finalRgb, 1.0);
        }
    }

    return output;
}
