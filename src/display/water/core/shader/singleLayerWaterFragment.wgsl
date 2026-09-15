#redgpu_include SYSTEM_UNIFORM;
#redgpu_include systemStruct.OutputFragment;
#redgpu_include math.getMotionVector;
#redgpu_include math.tnb.getTBNFromVertexTangent;
#redgpu_include math.INV_PI;
#redgpu_include math.EPSILON;

struct WaterUniforms {
    baseColor: vec3<f32>,
    opacity: f32,

    deepColor: vec3<f32>,
    refractionStrength: f32,

    windDirection: vec2<f32>,
    normalScale: f32,
    normalTiling: f32,

    windSpeed: f32,
    roughness: f32,
    specularFactor: f32,
    depthFadeDistance: f32,

    extinctionFactor: f32,
    useNormalTexture2: f32,
    normalScale2: f32,
    normalTiling2: f32,
};

@group(2) @binding(0) var<uniform> uniforms: WaterUniforms;
@group(2) @binding(1) var normalTextureSampler: sampler;
@group(2) @binding(2) var normalTexture: texture_2d<f32>;
@group(2) @binding(3) var normalTexture2: texture_2d<f32>;

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

fn blendRNM(n1: vec3<f32>, n2: vec3<f32>) -> vec3<f32> {
    let t = n1 + vec3<f32>(0.0, 0.0, 1.0);
    let u = vec3<f32>(-n2.x, -n2.y, n2.z);
    return normalize(t * dot(t, u) - u * t.z);
}

@fragment
fn main(inputData: InputData) -> OutputFragment {
    var output: OutputFragment;

    let timeSec = systemUniforms.time.time;
    let windDirLen = length(uniforms.windDirection);
    let baseWindDir = select(vec2<f32>(1.0, 0.0), uniforms.windDirection / windDirLen, windDirLen > 0.001);

    let uv1 = inputData.uv * (uniforms.normalTiling * 0.45) + baseWindDir * (timeSec * uniforms.windSpeed * 0.6);
    let rawN1 = textureSample(normalTexture, normalTextureSampler, uv1).rgb;
    let n1 = unpackTangentNormal(rawN1);

    let warpOffset = n1.xy * 0.035;

    let dir2 = vec2<f32>(baseWindDir.x * 0.7990425 - baseWindDir.y * 0.6012759, baseWindDir.x * 0.6012759 + baseWindDir.y * 0.7990425);
    let dir3 = vec2<f32>(baseWindDir.x * 0.6562413 + baseWindDir.y * 0.7545517, -baseWindDir.x * 0.7545517 + baseWindDir.y * 0.6562413);

    var blendedTangent: vec3<f32>;

    if (uniforms.useNormalTexture2 > 0.5) {
        let baseTiling2 = uniforms.normalTiling * uniforms.normalTiling2;
        let uv2 = inputData.uv * baseTiling2 + warpOffset * 0.35 + dir2 * (timeSec * uniforms.windSpeed * 1.35);
        let uv3 = inputData.uv * (baseTiling2 * 1.75) - warpOffset * 0.25 + dir3 * (timeSec * uniforms.windSpeed * 1.85);

        let rawN2 = textureSample(normalTexture2, normalTextureSampler, uv2).rgb;
        let rawN3 = textureSample(normalTexture2, normalTextureSampler, uv3).rgb;

        let n2 = unpackTangentNormal(rawN2);
        let n3 = unpackTangentNormal(rawN3);

        let microBlended = blendRNM(n2, n3 * vec3<f32>(0.65, 0.65, 1.0));

        let scaledN1 = vec3<f32>(n1.xy * uniforms.normalScale, n1.z);
        let scaledMicro = vec3<f32>(microBlended.xy * uniforms.normalScale2, microBlended.z);
        blendedTangent = blendRNM(scaledN1, scaledMicro);
    } else {
        let uv2 = inputData.uv * uniforms.normalTiling + warpOffset * 0.35 + dir2 * (timeSec * uniforms.windSpeed * 1.15);
        let uv3 = inputData.uv * (uniforms.normalTiling * 2.25) - warpOffset * 0.25 + dir3 * (timeSec * uniforms.windSpeed * 1.75);

        let rawN2 = textureSample(normalTexture, normalTextureSampler, uv2).rgb;
        let rawN3 = textureSample(normalTexture, normalTextureSampler, uv3).rgb;

        let n2 = unpackTangentNormal(rawN2);
        let n3 = unpackTangentNormal(rawN3);

        let n12 = blendRNM(n1, n2);
        let combined = blendRNM(n12, n3);
        blendedTangent = vec3<f32>(combined.xy * uniforms.normalScale, combined.z);
    }

    let camDistance = distance(systemUniforms.camera.cameraPosition, inputData.vertexPosition);
    let distanceFade = clamp(1.0 - smoothstep(300.0, 5000.0, camDistance), 0.0, 1.0);

    let baseNormal = normalize(inputData.vertexNormal);
    let tbn = getTBNFromVertexTangent(baseNormal, inputData.vertexTangent);

    let viewDir = normalize(systemUniforms.camera.cameraPosition - inputData.vertexPosition);
    let isUnderwater = systemUniforms.camera.cameraPosition.y < inputData.vertexPosition.y;

    var finalXY = blendedTangent.xy * distanceFade;
    let finalZ = sqrt(max(0.001, 1.0 - dot(finalXY, finalXY)));
    var worldNormal = normalize(tbn * vec3<f32>(finalXY, finalZ));
    worldNormal = select(worldNormal, -worldNormal, isUnderwater);

    let NdotV = max(dot(worldNormal, viewDir), 0.001);

    let F0 = vec3<f32>(0.02037);

    var specularLighting = vec3<f32>(0.0);
    var waterDiffuseLighting = vec3<f32>(0.0);
    var totalDirectReflectance = vec3<f32>(0.0);
    var maxSunRadiance = 0.0;
    let u_directionalLightCount = systemUniforms.directionalLightCount;
    let u_directionalLights = systemUniforms.directionalLights;

    let baseRoughness = clamp(uniforms.roughness, 0.015, 1.0);
    let alpha = baseRoughness * baseRoughness;
    let alpha2 = max(0.0001, alpha * alpha);
    let oneMinusAlpha2 = 1.0 - alpha2;

    for (var i = 0u; i < u_directionalLightCount; i++) {
        let dirLight = u_directionalLights[i];
        let lightDir = -normalize(dirLight.direction);
        let NdotL = max(abs(dot(worldNormal, lightDir)), 0.0);

        if (NdotL > 0.0) {
            var lightRadiance = dirLight.color.rgb * (dirLight.intensity * systemUniforms.preExposure);
            maxSunRadiance = max(maxSunRadiance, max(lightRadiance.r, max(lightRadiance.g, lightRadiance.b)));

            let sunF1 = clamp(1.0 - max(dot(worldNormal, lightDir), 0.0), 0.0, 1.0);
            let sunF2 = sunF1 * sunF1;
            let sunF5 = sunF2 * sunF2 * sunF1;
            let sunFresnel = F0 + (vec3<f32>(1.0) - F0) * sunF5;
            let sunTransmittance = vec3<f32>(1.0) - sunFresnel;
            let sunGeoNdotL = clamp(dot(baseNormal, lightDir) * 0.7 + 0.3, 0.0, 1.0);
            let viewSunDot = dot(viewDir, -lightDir);
            let viewSunFactor = clamp(viewSunDot * 0.5 + 0.5, 0.0, 1.0);
            let forwardScatter = (viewSunFactor * viewSunFactor) * 0.5 + 0.5;
            // [물리적 난반사 정규화 (INV_PI)]: 10만 룩스 거대 광량이 수치 폭주를 일으키지 않도록 표준 1/PI 정규화 적용
            let waterScatterContribution = lightRadiance * sunTransmittance * sunGeoNdotL * forwardScatter * (INV_PI * 0.5);
            waterDiffuseLighting += waterScatterContribution;

            // 1. Brian Karis 태양 디스크 대표점 (각반경 약 0.53도 = 0.0092 라디안)
            let sunAngularRadius = 0.0092;
            let R_view = reflect(-viewDir, worldNormal);
            let RdotL = dot(R_view, lightDir);
            let safeRdotL = max(0.0, RdotL);
            let l_proj = lightDir * safeRdotL;
            let l_diff = R_view - l_proj;
            let l_diff_len = length(l_diff);
            let L_rep = select(lightDir, normalize(l_proj + l_diff * min(1.0, sunAngularRadius / max(0.0001, l_diff_len))), l_diff_len > 0.0001 && RdotL > 0.0);

            let halfDir = normalize(L_rep + viewDir);
            let NdotH = clamp(dot(worldNormal, halfDir), 0.0, 0.9999);
            let VdotH = clamp(dot(viewDir, halfDir), 0.0, 1.0);
            let NdotH2 = NdotH * NdotH;
            let safeNdotL = max(NdotL, 0.0001);
            let safeNdotV = max(NdotV, 0.0001);

            // 2. Schlick Fresnel (물 기본 반사율 F0 = 0.02037, 스침각 1.0)
            let F = F0 + (vec3<f32>(1.0) - F0) * pow(1.0 - VdotH, 5.0);

            // 3. 언리얼 엔진(UE5) 스타일 듀얼 로브 GGX (Dual-Lobe Cook-Torrance)
            // Lobe 1: 베이스 스펙큘러 로브 (부드러운 햇살 길목, r ~ 0.16)
            let rBase = clamp(uniforms.roughness * 1.5 + 0.12, 0.08, 0.45);
            let aBase = rBase * rBase;
            let aBase2 = aBase * aBase;
            let denomBase = NdotH2 * (aBase2 - 1.0) + 1.0;
            let dBase = aBase2 * INV_PI / max(0.0001, denomBase * denomBase);
            let vBase = 0.5 / max(0.0001, safeNdotL * sqrt(safeNdotV * safeNdotV * (1.0 - aBase2) + aBase2) + safeNdotV * sqrt(safeNdotL * safeNdotL * (1.0 - aBase2) + aBase2));
            let specBase = dBase * vBase;

            // Lobe 2: 샤프 글린트 로브 (파도 능선 초고해상도 다이아몬드 반짝임, r ~ 0.038)
            let rGlint = 0.038 + (1.0 - clamp(length(finalXY) * 2.5, 0.0, 1.0)) * 0.025;
            let aGlint = rGlint * rGlint;
            let aGlint2 = aGlint * aGlint;
            let denomGlint = NdotH2 * (aGlint2 - 1.0) + 1.0;
            let dGlint = aGlint2 * INV_PI / max(0.0001, denomGlint * denomGlint);
            let vGlint = 0.5 / max(0.0001, safeNdotL * sqrt(safeNdotV * safeNdotV * (1.0 - aGlint2) + aGlint2) + safeNdotV * sqrt(safeNdotL * safeNdotL * (1.0 - aGlint2) + aGlint2));
            let specGlint = dGlint * vGlint;

            // 4. 물리적 듀얼 로브 결합 및 태양 고휘도 게인 (물 반사율 2% 감쇄 극복)
            let dualLobe = specBase * 0.45 + specGlint * 0.55;
            var rawSpecBRDF = dualLobe * F * 18.0;

            // [안전 가드] 부동소수점 오버플로 및 정오 특이점(Infinity/NaN) 원천 차단
            rawSpecBRDF = min(rawSpecBRDF, vec3<f32>(300.0));

            // 언리얼 스타일 필름 소프트 롤오프 (모니터 화이트아웃 100% 방지)
            let totalSpecBRDF = rawSpecBRDF / (vec3<f32>(1.0) + rawSpecBRDF * 0.15);

            let directLightSpec = lightRadiance * totalSpecBRDF * uniforms.specularFactor * NdotL;
            specularLighting += directLightSpec;

            let directReflectance = clamp(totalSpecBRDF * uniforms.specularFactor * NdotL, vec3<f32>(0.0), vec3<f32>(1.0));
            totalDirectReflectance += directReflectance;
        }
    }

    // [순수 직사광 PBR 수체 광학: IBL / SkyAtmosphere 전면 제거]:
    // 외부 큐브맵이나 대기 LUT 샘플링 의존성을 완전히 제거하고,
    // 오직 직사광(태양)과 기본 앰비언트 라이트만으로 물리적으로 가장 정직하고 투명한 수면 광학을 계산합니다.
    let ambientRadiance = systemUniforms.ambientLight.color.rgb * (systemUniforms.ambientLight.intensity * systemUniforms.preExposure);
    waterDiffuseLighting += ambientRadiance * (INV_PI * 0.25);

    // 표면 Schlick Fresnel 반사율 계산 (물 기본 반사율 F0 = 0.02037)
    let viewDotGeo = max(dot(baseNormal, viewDir), 0.001);
    let viewDotWave = dot(worldNormal, viewDir);
    let safeNdotV = clamp(mix(viewDotGeo, max(viewDotWave, 0.0), 0.7), 0.06, 1.0);

    let fresnelFactor = pow(1.0 - safeNdotV, 5.0);
    let surfaceFresnel = F0 + (vec3<f32>(1.0) - F0) * fresnelFactor;

    // 앰비언트 라이트의 물리적 표면 반사광 (수중 시 차단)
    let surfaceAmbientReflection = select(ambientRadiance * surfaceFresnel * (INV_PI * 0.5) * uniforms.specularFactor, vec3<f32>(0.0), isUnderwater);

    let screenCoord = vec2<i32>(inputData.position.xy);
    let rawSceneDepth = textureLoad(renderPath1DepthTexture, screenCoord, 0);
    let cameraNear = systemUniforms.camera.nearClipping;
    let cameraFar = systemUniforms.camera.farClipping;
    let linearSceneDepth = getLinearizeDepth(rawSceneDepth, cameraNear, cameraFar);
    let linearWaterDepth = getLinearizeDepth(inputData.position.z, cameraNear, cameraFar);

    var effectiveWaterDepthDelta = max(linearSceneDepth - linearWaterDepth, 0.0);
    var depthFade = 1.0;
    if (isUnderwater) {
        effectiveWaterDepthDelta = distance(systemUniforms.camera.cameraPosition, inputData.vertexPosition);
        depthFade = 1.0;
    } else {
        if (uniforms.depthFadeDistance > 0.0) {
            depthFade = smoothstep(0.0, uniforms.depthFadeDistance, effectiveWaterDepthDelta);
        }
    }
    let screenUV = inputData.position.xy / systemUniforms.resolution;

    // ④ [순수 파도 섭동에 의한 굴절 왜곡 (Pure Perturbation Refraction)]:
    // 기하 기본 법선(baseNormal)을 제외한 순수 파도 요철 섭동(deltaNormal)만 뷰 공간으로 변환합니다.
    // 이를 통해 파도가 없는 평평한 수면에서는 왜곡이 정확히 0이 되어 물밑 지형이 한쪽으로 밀리지 않으며,
    // 파도가 칠 때만 파도의 능선과 골에 의해 자연스러운 일렁임이 발생합니다.
    let deltaWorldNormal = worldNormal - baseNormal;
    let viewDeltaNormal = (systemUniforms.camera.viewMatrix * vec4<f32>(deltaWorldNormal, 0.0)).xyz;

    // ⑥ [해안선 감쇄 단일화]: 중복된 shorelineFade를 제거하고 depthFade 하나로 통합 제어
    let effectiveRefractionStrength = uniforms.refractionStrength * depthFade;
    let refractionOffset = viewDeltaNormal.xy * effectiveRefractionStrength;

    var finalRefractUV = clamp(screenUV + refractionOffset, vec2<f32>(0.001), vec2<f32>(0.999));

    if (!isUnderwater) {
        let distortedScreenCoord = vec2<i32>(finalRefractUV * systemUniforms.resolution);
        let rawDistortedDepth = textureLoad(renderPath1DepthTexture, distortedScreenCoord, 0);
        let linearDistortedSceneDepth = getLinearizeDepth(rawDistortedDepth, cameraNear, cameraFar);

        // 하드 컷 대신 약간의 안전 여유 마진(Safety Depth Bias)을 두어 경계면 번쩍임 방지
        let depthSafetyThreshold = linearWaterDepth - 0.05;
        if (linearDistortedSceneDepth < depthSafetyThreshold) {
            finalRefractUV = screenUV;
        }
    }

    let backgroundRefractedColor = textureSampleLevel(renderPath1ResultTexture, renderPath1ResultTextureSampler, finalRefractUV, 0.0).rgb;

    // ② [정통 PBR 비어-람베르트(Beer-Lambert) 수중 흡수 및 산란 광학]:
    // 임의의 청록색 매직넘버 및 5중 믹스를 완전히 제거하고,
    // 빛이 물을 통과하며 거리에 따라 지수적으로 감쇄하는 비어-람베르트 법칙(exp(-d * sigma))을 적용합니다.
    let extinction = exp(-effectiveWaterDepthDelta * uniforms.extinctionFactor);
    let effectiveOpacity = uniforms.opacity * inputData.combinedOpacity;
    let maxAbsorption = select(1.0, 0.45, isUnderwater);
    let absorptionStrength = clamp((1.0 - extinction) * effectiveOpacity, 0.0, maxAbsorption);

    // 수심에 따른 물의 고유 흡수 반사율 (Water Optical Albedo)
    let waterAlbedo = mix(uniforms.baseColor, uniforms.deepColor, 1.0 - extinction);

    // [체적 산란광 물리 결합 (Physical In-scattering)]:
    // 1) 비물리적 자체 발광(+ waterTargetColor)을 완전히 제거하여 빛이 없으면 산란광도 0이 되도록 교정
    // 2) 10만 룩스 거대 광량에서도 우유빛 백화 현상이 발생하지 않도록 필믹 소프트 롤오프(Soft saturation) 적용
    let rawInscatter = waterDiffuseLighting * waterAlbedo;
    let softInscatter = rawInscatter / (vec3<f32>(1.0) + rawInscatter * 0.12);

    // ⑤ [정통 PBR 수체 체적 방출 및 바닥 투과광 에너지 분할 (Subsurface Water-Leaving Radiance)]:
    // 1) 바닥 지형 투과광(backgroundRefractedColor)은 표면 프레넬 반사율(totalSurfaceReflectance)에 의해 (1.0 - R)로 엄격히 차폐됩니다.
    // 2) 반면 물 자체의 체적 산란광은 물속에서 표면 밖으로 뿜어져 나오는 내부 방출광(Water-Leaving Radiance)이므로,
    //    파도 경사면이라 할지라도 최소 방출 마진(Subsurface Escape)을 유지하여 칠흑의 흑색 띠(Black Hole)가 발생하는 결함을 원천 차단합니다.
    let safeRoughnessParam = clamp(uniforms.roughness, 0.0, 1.0);
    let totalSurfaceReflectance = clamp(totalDirectReflectance + surfaceFresnel * uniforms.specularFactor, vec3<f32>(0.0), vec3<f32>(1.0));
    let seabedTransmission = clamp(vec3<f32>(1.0) - totalSurfaceReflectance, vec3<f32>(0.0), vec3<f32>(1.0));
    let transmittedBackground = backgroundRefractedColor * select(seabedTransmission, vec3<f32>(0.85), isUnderwater);

    // 파도 3D 입체 굴곡에 의한 체적광 방출 마진 보장
    let subsurfaceEscapeMargin = 0.28 * (1.0 - safeRoughnessParam * 0.3);
    let waterBodyTransmission = select(max(seabedTransmission, vec3<f32>(subsurfaceEscapeMargin)), vec3<f32>(0.85), isUnderwater);
    let waterBodyLight = softInscatter * waterBodyTransmission;

    // [정통 비어-람베르트 복사 전달 (RTE)]:
    // 수심이 얕은 곳에서는 바닥이 100% 맑게 투과되고, 깊어질수록 물속 체적 산란광(softInscatter)이 자연스럽게 차오름
    let waterCompositeColor = mix(transmittedBackground, waterBodyLight, absorptionStrength);
    let transmittedUnderwater = mix(transmittedBackground, waterCompositeColor, depthFade);

    let totalSpecular = specularLighting + surfaceAmbientReflection;
    let finalRgb = transmittedUnderwater + totalSpecular;

    output.color = vec4<f32>(finalRgb, 1.0);

    let safeRoughness = clamp(uniforms.roughness, 0.0, 1.0);
    let smoothness = 1.0 - safeRoughness;
    let smoothnessCurved = smoothness * smoothness * (3.0 - 2.0 * smoothness);
    let baseReflectionStrength = smoothnessCurved * 0.02037 * uniforms.specularFactor;
    output.gBufferNormal = vec4<f32>(worldNormal * 0.5 + 0.5, baseReflectionStrength);
    output.gBufferMotionVector = vec4<f32>(getMotionVector(inputData.currentClipPos, inputData.prevClipPos), 0.0, 1.0);

    return output;
}
