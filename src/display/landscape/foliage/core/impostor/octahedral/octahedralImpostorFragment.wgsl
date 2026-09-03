#redgpu_include SYSTEM_UNIFORM;
#redgpu_include color.getTintBlendMode;
#redgpu_include entryPoint.mesh.entryPointPickingFragment;
#redgpu_include systemStruct.OutputFragment;
#redgpu_include math.getMotionVector;
#redgpu_include math.INV_PI;
#redgpu_include math.PI;
#redgpu_include skyAtmosphere.skyAtmosphereFn;
#redgpu_include shadow.getDirectionalShadowVisibility;

@group(2) @binding(1) var baseColorTextureSampler: sampler;
@group(2) @binding(2) var baseColorTexture: texture_2d<f32>;
@group(2) @binding(3) var normalTextureSampler: sampler;
@group(2) @binding(4) var normalTexture: texture_2d<f32>;
@group(2) @binding(5) var packedORMTexture: texture_2d<f32>;

struct InputData {
    @builtin(position) position: vec4<f32>,
    @location(0) vertexPosition: vec3<f32>,
    @location(1) vertexNormal: vec3<f32>,
    @location(2) uv: vec2<f32>,
    @location(3) uv1: vec2<f32>,
    @location(4) vertexColor_0: vec4<f32>,
    @location(5) vertexTangent: vec4<f32>,
    @location(6) instanceRotQuat: vec4<f32>,

    @location(7) currentClipPos: vec4<f32>,
    @location(8) prevClipPos: vec4<f32>,

    @location(9) @interpolate(flat) globalFragmentSlotIndex: u32,
    @location(10) localNodeScale_volumeScale: vec2<f32>,
    @location(11) combinedOpacity: f32,

    @location(12) motionVector: vec3<f32>,
    @location(14) @interpolate(flat) receiveShadow: f32,
    @location(15) @interpolate(flat) pickingId: vec4<f32>,
};

fn dirToHemiOctahedralUV(dir: vec3<f32>) -> vec2<f32> {
    let d = normalize(vec3<f32>(dir.x, max(dir.y, 0.0), dir.z));
    let l1 = abs(d.x) + d.y + abs(d.z);
    let invL1 = select(1.0 / l1, 1.0, l1 < 0.0001);
    let u = (d.x + d.z) * 0.5 * invL1 + 0.5;
    let v = (d.z - d.x) * 0.5 * invL1 + 0.5;
    return clamp(vec2<f32>(u, v), vec2<f32>(0.0), vec2<f32>(1.0));
}

fn hemiOctahedralUVToDir(uv: vec2<f32>) -> vec3<f32> {
    let uPrime = 2.0 * uv.x - 1.0;
    let vPrime = 2.0 * uv.y - 1.0;
    let dirX = (uPrime - vPrime) * 0.5;
    let dirZ = (uPrime + vPrime) * 0.5;
    let dirY = max(1.0 - (abs(dirX) + abs(dirZ)), 0.0);
    return normalize(vec3<f32>(dirX, dirY, dirZ));
}

fn getSubTileRotatedUVFast(p: vec2<f32>, lenVH: f32, angleV: f32, gridDir: vec3<f32>) -> vec2<f32> {
    let gridH = vec2<f32>(gridDir.x, gridDir.z);
    let lenGH = length(gridH);

    var rotAngle = 0.0;
    if (lenVH > 0.01 && lenGH > 0.01) {
        let angleG = atan2(gridDir.z, gridDir.x);
        var diff = angleV - angleG;
        
        diff = diff - floor((diff + 3.14159265) / 6.2831853) * 6.2831853;

        let poleFade = clamp(min(lenVH, lenGH) * 5.0, 0.0, 1.0);
        rotAngle = diff * poleFade;
    }

    let c = cos(rotAngle);
    let s = sin(rotAngle);
    let rotatedP = vec2<f32>(p.x * c - p.y * s, p.x * s + p.y * c);
    return rotatedP + vec2<f32>(0.5);
}

fn getSubTileRotatedUV(quadUV: vec2<f32>, viewDir: vec3<f32>, gridDir: vec3<f32>) -> vec2<f32> {
    let viewH = vec2<f32>(viewDir.x, viewDir.z);
    let gridH = vec2<f32>(gridDir.x, gridDir.z);
    let lenVH = length(viewH);
    let lenGH = length(gridH);

    var rotAngle = 0.0;
    if (lenVH > 0.01 && lenGH > 0.01) {
        let angleV = atan2(viewDir.z, viewDir.x);
        let angleG = atan2(gridDir.z, gridDir.x);
        var diff = angleV - angleG;
        
        diff = diff - floor((diff + 3.14159265) / 6.2831853) * 6.2831853;

        let poleFade = clamp(min(lenVH, lenGH) * 5.0, 0.0, 1.0);
        rotAngle = diff * poleFade;
    }

    let c = cos(rotAngle);
    let s = sin(rotAngle);
    let p = quadUV - vec2<f32>(0.5);
    let rotatedP = vec2<f32>(p.x * c - p.y * s, p.x * s + p.y * c);
    return rotatedP + vec2<f32>(0.5);
}

fn sampleOctahedralAtlas(
    tex: texture_2d<f32>,
    smp: sampler,
    gridCoords: vec2<f32>,
    subUV: vec2<f32>,
    n: f32,
    ddxAtlas: vec2<f32>,
    ddyAtlas: vec2<f32>
) -> vec4<f32> {
    let isInside = (subUV.x >= 0.0 && subUV.x <= 1.0 && subUV.y >= 0.0 && subUV.y <= 1.0);
    let clampedGrid = clamp(gridCoords, vec2<f32>(0.0), vec2<f32>(n - 1.0));
    let borderPadding = 1.0 / 256.0;
    let safeSubUV = clamp(subUV, vec2<f32>(borderPadding), vec2<f32>(1.0 - borderPadding));
    let atlasUV = (clampedGrid + safeSubUV) / n;

    let sampled = textureSampleGrad(tex, smp, atlasUV, ddxAtlas, ddyAtlas);
    return select(vec4<f32>(0.0), sampled, isInside);
}

fn rotateVectorByQuaternion(v: vec3<f32>, q: vec4<f32>) -> vec3<f32> {
    return v + 2.0 * cross(q.xyz, cross(q.xyz, v) + q.w * v);
}

fn getSpecularNDF(NdotH: f32, roughness: f32) -> f32 {
    let alpha = roughness * roughness;
    let alpha2 = alpha * alpha;
    let NdotH2 = NdotH * NdotH;
    let nom = alpha2;
    let denom = (NdotH2 * (alpha2 - 1.0) + 1.0);
    let denomSquared = denom * denom;
    return nom / max(0.0001, denomSquared * PI);
}

fn getSpecularVisibility(NdotV: f32, NdotL: f32, roughness: f32) -> f32 {
    let alpha = roughness * roughness;
    let alpha2 = alpha * alpha;
    let safeNdotV = max(NdotV, 1e-4);
    let safeNdotL = max(NdotL, 1e-4);
    let GGXV = safeNdotL * sqrt(safeNdotV * safeNdotV * (1.0 - alpha2) + alpha2);
    let GGXL = safeNdotV * sqrt(safeNdotL * safeNdotL * (1.0 - alpha2) + alpha2);
    return 0.5 / max(GGXV + GGXL, 0.0001);
}

fn getFresnel(cosTheta: f32, F0: vec3<f32>) -> vec3<f32> {
    return F0 + (vec3<f32>(1.0) - F0) * pow(clamp(1.0 - cosTheta, 0.0, 1.0), 5.0);
}

fn getIndirectFresnel(cosTheta: f32, F0: vec3<f32>, roughness: f32, fresnelTerm: f32) -> vec3<f32> {
    let F90 = max(vec3<f32>(1.0 - roughness * 0.8), F0);
    return F0 + (F90 - F0) * fresnelTerm;
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

fn getDirectDiffuseBRDF(NdotL: f32, NdotV: f32, LdotH: f32, roughness: f32, albedo: vec3<f32>) -> vec3<f32> {
    if (NdotL <= 0.0) { return vec3<f32>(0.0); }
    let energyBias = mix(0.0, 0.5, roughness);
    let energyFactor = mix(1.0, 1.0 / 1.51, roughness);
    let fd90 = energyBias + 2.0 * LdotH * LdotH * roughness;
    let f0 = 1.0;
    let lightScatter = f0 + (fd90 - f0) * pow(1.0 - NdotL, 5.0);
    let viewScatter = f0 + (fd90 - f0) * pow(1.0 - NdotV, 5.0);
    return albedo * NdotL * lightScatter * viewScatter * energyFactor;
}

@fragment
fn main(inputData: InputData) -> OutputFragment {
    var output: OutputFragment;
    let globalFragmentData = globalFragmentSSBO_BuiltIn[inputData.globalFragmentSlotIndex];

    let camPos = systemUniforms.camera.cameraPosition.xyz;
    var localView = inputData.vertexTangent.xyz;
    if (inputData.vertexTangent.w > -500.0) {
        localView = normalize(camPos - inputData.vertexPosition);
    }

    let n = 8.0;
    let octUV = dirToHemiOctahedralUV(localView);

    let gridPos = octUV * n - 0.5;
    let baseGrid = floor(gridPos);
    let frac = gridPos - baseGrid;

    let g00 = clamp(baseGrid + vec2<f32>(0.0, 0.0), vec2<f32>(0.0), vec2<f32>(n - 1.0));
    let g10 = clamp(baseGrid + vec2<f32>(1.0, 0.0), vec2<f32>(0.0), vec2<f32>(n - 1.0));
    let g01 = clamp(baseGrid + vec2<f32>(0.0, 1.0), vec2<f32>(0.0), vec2<f32>(n - 1.0));
    let g11 = clamp(baseGrid + vec2<f32>(1.0, 1.0), vec2<f32>(0.0), vec2<f32>(n - 1.0));

    let dir00 = hemiOctahedralUVToDir((g00 + vec2<f32>(0.5)) / n);
    let dir10 = hemiOctahedralUVToDir((g10 + vec2<f32>(0.5)) / n);
    let dir01 = hemiOctahedralUVToDir((g01 + vec2<f32>(0.5)) / n);
    let dir11 = hemiOctahedralUVToDir((g11 + vec2<f32>(0.5)) / n);

    // 🚀 [최적화 P0 / Step 11] localView의 atan2 및 length를 1회만 계산하여 4개 서브타일에서 재사용 (초월함수 연산 75% 절감!)
    let pQuad = inputData.uv - vec2<f32>(0.5);
    let viewH = vec2<f32>(localView.x, localView.z);
    let lenVH = length(viewH);
    var angleV = 0.0;
    if (lenVH > 0.01) {
        angleV = atan2(localView.z, localView.x);
    }

    let uv00 = getSubTileRotatedUVFast(pQuad, lenVH, angleV, dir00);
    let uv10 = getSubTileRotatedUVFast(pQuad, lenVH, angleV, dir10);
    let uv01 = getSubTileRotatedUVFast(pQuad, lenVH, angleV, dir01);
    let uv11 = getSubTileRotatedUVFast(pQuad, lenVH, angleV, dir11);

    let ddxUV = dpdx(inputData.uv);
    let ddyUV = dpdy(inputData.uv);
    let ddxAtlas = ddxUV / n;
    let ddyAtlas = ddyUV / n;

    let s00 = sampleOctahedralAtlas(baseColorTexture, baseColorTextureSampler, g00, uv00, n, ddxAtlas, ddyAtlas);
    let s10 = sampleOctahedralAtlas(baseColorTexture, baseColorTextureSampler, g10, uv10, n, ddxAtlas, ddyAtlas);
    let s01 = sampleOctahedralAtlas(baseColorTexture, baseColorTextureSampler, g01, uv01, n, ddxAtlas, ddyAtlas);
    let s11 = sampleOctahedralAtlas(baseColorTexture, baseColorTextureSampler, g11, uv11, n, ddxAtlas, ddyAtlas);

    let w00 = (1.0 - frac.x) * (1.0 - frac.y);
    let w10 = frac.x * (1.0 - frac.y);
    let w01 = (1.0 - frac.x) * frac.y;
    let w11 = frac.x * frac.y;

    let cov00 = w00 * s00.a;
    let cov10 = w10 * s10.a;
    let cov01 = w01 * s01.a;
    let cov11 = w11 * s11.a;
    let totalCoverage = cov00 + cov10 + cov01 + cov11;

    // 🚀 [최적화 P0 / Step 1 - 조기 탈락 1차] 완전 투명 픽셀(공기) 즉시 탈출 (Normal/ORM 8탭 100% 생략)
    if (totalCoverage < 0.001) {
        discard;
    }

    // 🚀 [최적화 P0 / Step 1 - 조기 탈락 2차] 거리 페이드 디더링 조기 탈락
    let fadeOpacity = inputData.combinedOpacity;
    if (fadeOpacity < 0.999) {
        let px = u32(inputData.position.x) & 3u;
        let py = u32(inputData.position.y) & 3u;
        let idx = (py << 2u) | px;
        let packed = select(0x6E4C2A80u, 0x5D7F91B3u, idx >= 8u);
        let threshold = f32((packed >> ((idx & 7u) * 4u)) & 0xFu) * 0.0625;
        if (fadeOpacity < threshold) {
            discard;
        }
    }

    // 🚀 [최적화 P0 / Step 1 - 조기 탈락 3차] 동적 알파 디더 컷오프 조기 탈락
    let linearAlpha = totalCoverage;
    let maxAlpha = max(max(s00.a, s10.a), max(s01.a, s11.a));
    let maxCornerWeight = max(max(w00, w10), max(w01, w11));
    let sharpnessFactor = clamp((maxCornerWeight - 0.25) / 0.75, 0.0, 1.0);
    let reconstructedAlpha = mix(linearAlpha, maxAlpha, mix(0.70, 0.95, sharpnessFactor));

    let ditherPx = u32(inputData.position.x) & 3u;
    let ditherPy = u32(inputData.position.y) & 3u;
    let frameIdx = systemUniforms.time.frameIndex & 3u;
    let ditherIdx = (((ditherPy ^ frameIdx) << 2u) | (ditherPx ^ frameIdx)) & 15u;
    let bayerPacked = select(0x6E4C2A80u, 0x5D7F91B3u, ditherIdx >= 8u);
    let ditherThreshold = f32((bayerPacked >> ((ditherIdx & 7u) * 4u)) & 0xFu) * 0.0625;

    let dynamicCutOff = mix(0.20, 0.55, ditherThreshold);
    if (reconstructedAlpha <= dynamicCutOff) {
        discard;
    }

    // 🌟 [검증 통과된 유효 픽셀에서만 Normal 4장 + ORM 4장 샘플링 실행 (투명 픽셀 50~60% 완전 절감)]
    let invSafeCoverage = 1.0 / max(totalCoverage, 0.0001);

    var albedo = (s00.rgb * cov00 + s10.rgb * cov10 + s01.rgb * cov01 + s11.rgb * cov11) * invSafeCoverage;
    albedo = clamp(albedo, vec3<f32>(0.0), vec3<f32>(1.0));

    let toCamVec = camPos - inputData.vertexPosition;
    let distSq = dot(toCamVec, toCamVec);

    var rawNormalDepth: vec4<f32>;
    var rawORM: vec4<f32>;

    // 🌟 [최적화 P2 / Step 3 - 원경 500m+ Dominant Sub-Tile 1-Tap 다이어트]
    // 500m 밖에서는 1그루의 화면 크기가 15~30px에 불과하므로 대표 서브타일 1탭만 샘플링 (Normal/ORM 8탭 ➔ 2탭 75% 즉각 절감!)
    if (distSq > 250000.0) {
        var domG = g00;
        var domUV = uv00;
        var maxCov = cov00;
        if (cov10 > maxCov) { maxCov = cov10; domG = g10; domUV = uv10; }
        if (cov01 > maxCov) { maxCov = cov01; domG = g01; domUV = uv01; }
        if (cov11 > maxCov) { maxCov = cov11; domG = g11; domUV = uv11; }

        rawNormalDepth = sampleOctahedralAtlas(normalTexture, normalTextureSampler, domG, domUV, n, ddxAtlas, ddyAtlas);
        rawORM = sampleOctahedralAtlas(packedORMTexture, baseColorTextureSampler, domG, domUV, n, ddxAtlas, ddyAtlas);
    } else {
        let n00 = sampleOctahedralAtlas(normalTexture, normalTextureSampler, g00, uv00, n, ddxAtlas, ddyAtlas);
        let n10 = sampleOctahedralAtlas(normalTexture, normalTextureSampler, g10, uv10, n, ddxAtlas, ddyAtlas);
        let n01 = sampleOctahedralAtlas(normalTexture, normalTextureSampler, g01, uv01, n, ddxAtlas, ddyAtlas);
        let n11 = sampleOctahedralAtlas(normalTexture, normalTextureSampler, g11, uv11, n, ddxAtlas, ddyAtlas);

        let orm00 = sampleOctahedralAtlas(packedORMTexture, baseColorTextureSampler, g00, uv00, n, ddxAtlas, ddyAtlas);
        let orm10 = sampleOctahedralAtlas(packedORMTexture, baseColorTextureSampler, g10, uv10, n, ddxAtlas, ddyAtlas);
        let orm01 = sampleOctahedralAtlas(packedORMTexture, baseColorTextureSampler, g01, uv01, n, ddxAtlas, ddyAtlas);
        let orm11 = sampleOctahedralAtlas(packedORMTexture, baseColorTextureSampler, g11, uv11, n, ddxAtlas, ddyAtlas);

        rawNormalDepth = (n00 * cov00 + n10 * cov10 + n01 * cov01 + n11 * cov11) * invSafeCoverage;
        rawORM = (orm00 * cov00 + orm10 * cov10 + orm01 * cov01 + orm11 * cov11) * invSafeCoverage;
    }
    let V = normalize(toCamVec);

    var bakedN = normalize(rawNormalDepth.rgb * 2.0 - 1.0);
    if (length(bakedN) < 0.1) {
        bakedN = vec3<f32>(0.0, 1.0, 0.0);
    }
    var N = bakedN;
    let quat = inputData.instanceRotQuat;
    if (abs(dot(quat, quat) - 1.0) < 0.2) {
        N = normalize(rotateVectorByQuaternion(bakedN, quat));
    }

    let NdotV = max(dot(N, V), 0.04);
    let preExposure = systemUniforms.preExposure;

    let receiveShadowYn = inputData.receiveShadow != 0.0 && systemUniforms.directionalLightCount > 0u;
    var shadowVis: f32 = 1.0;
    var L0 = vec3<f32>(0.0, 1.0, 0.0);
    if (systemUniforms.directionalLightCount > 0u) {
        L0 = -normalize(systemUniforms.directionalLights[0].direction);
    }
    let NdotL0 = dot(N, L0);

    // 🚀 [최적화] 원경 임포스터: 그림자 수신 켜짐 + 빛을 향할 때 + CSM 유효 거리 이내일 때만 섀도우 연산 실행
    if (receiveShadowYn && NdotL0 > 0.001) {
        let cascadeCount = min(4u, max(1u, systemUniforms.shadow.cascadeCount));
        let maxCSMDist = systemUniforms.shadow.cascadeSplitDepths[cascadeCount - 1u];
        // 🚀 [최적화 P2 / Step 9] 거리 제곱 비교로 매 픽셀 제곱근(length) 연산 100% 제거
        if (distSq < maxCSMDist * maxCSMDist) {
            let rawVis = getDirectionalShadowVisibility(
                directionalShadowMap,
                directionalShadowMapSampler,
                inputData.vertexPosition,
                N,
                L0
            );
            shadowVis = mix(1.0 - systemUniforms.shadow.directionalShadowStrength, 1.0, rawVis);
        }
    }

    let ao = clamp(rawORM.r, 0.0, 1.0);
    let roughness = clamp(rawORM.g, 0.04, 1.0);
    let metallic = clamp(rawORM.b, 0.0, 1.0);
    let F0_dielectric = vec3<f32>(0.04);
    let F0_metal = albedo;
    let F0 = mix(F0_dielectric, F0_metal, metallic);

    var totalDirectLighting = vec3<f32>(0.0);
    let u_directionalLightCount = systemUniforms.directionalLightCount;
    let u_directionalLights = systemUniforms.directionalLights;

    for (var i = 0u; i < u_directionalLightCount; i = i + 1u) {
        let light = u_directionalLights[i];
        let L = -normalize(light.direction);

        let NdotL = max(dot(N, L), 0.0);
        let H = normalize(L + V);
        let NdotH = max(dot(N, H), 0.0);
        let LdotH = max(dot(L, H), 0.0);
        let VdotH = max(dot(V, H), 0.0);

        var dLight = light.color * light.intensity * preExposure * shadowVis;
        if (systemUniforms.useSkyAtmosphere == 1u && i == 0u) {
            let u_atmo = systemUniforms.skyAtmosphere;
            let surfaceHeightKm = max(0.0, inputData.vertexPosition.y / 1000.0);
            let atmosphereTransmittance = getTransmittance(transmittanceTexture, atmosphereSampler, surfaceHeightKm, L.y, u_atmo.atmosphereHeight);
            dLight *= atmosphereTransmittance;
        }

        let F = getFresnel(VdotH, F0);
        let specBRDF = getDirectSpecularBRDF(F, roughness, NdotH, NdotV, NdotL);
        let diffuseReflection = getDirectDiffuseBRDF(NdotL, NdotV, LdotH, roughness, albedo);
        let diffuseTransmission = albedo * max(-dot(N, L), 0.0);
        let totalDiffuse = diffuseReflection + diffuseTransmission * 0.65;

        let dielectricPart = (specBRDF * NdotL) + (vec3<f32>(1.0) - F) * totalDiffuse;
        let metallicPart = specBRDF * NdotL;
        let directResult = mix(dielectricPart, metallicPart, metallic);

        totalDirectLighting += directResult * dLight;
    }

    var indirectLighting = vec3<f32>(0.0);
    let u_usePrefilterTexture = systemUniforms.usePrefilterTexture == 1u;
    let u_useSkyAtmosphere = systemUniforms.useSkyAtmosphere == 1u;

    if (u_usePrefilterTexture || u_useSkyAtmosphere) {
        let R = reflect(-V, N);
        let NdotV_IBL = NdotV;
        var reflectedColor = vec3<f32>(0.0);
        var iblDiffuseColor = vec3<f32>(0.0);

        // 🚀 [최적화 P3 / Step 10] IBL 밉 레벨 1회 계산 및 호이스팅
        var iblMipLevel: f32 = 0.0;
        if (u_usePrefilterTexture) {
            let iblMipmapCount = f32(textureNumLevels(ibl_prefilterTexture) - 1);
            iblMipLevel = roughness * iblMipmapCount;
            reflectedColor = textureSampleLevel(ibl_prefilterTexture, prefilterTextureSampler, R, iblMipLevel).rgb * preExposure * systemUniforms.iblIntensity;
            iblDiffuseColor = textureSampleLevel(ibl_irradianceTexture, prefilterTextureSampler, N, 0).rgb * preExposure * systemUniforms.iblIntensity;
        }

        if (u_useSkyAtmosphere) {
            let u_atmo = systemUniforms.skyAtmosphere;
            let camH = u_atmo.cameraHeight;
            let atmH = u_atmo.atmosphereHeight;
            let skyIntensity = u_atmo.sunIntensity;
            let specTrans = getTransmittance(transmittanceTexture, atmosphereSampler, camH, R.y, atmH);
            let atmoMipCount = f32(textureNumLevels(skyAtmosphere_prefilteredTexture) - 1);
            let atmoMipLevel = roughness * atmoMipCount;
            let specSkyScat = textureSampleLevel(skyAtmosphere_prefilteredTexture, atmosphereSampler, R, atmoMipLevel).rgb * skyIntensity * preExposure;
            reflectedColor = (reflectedColor * specTrans) + specSkyScat;

            let diffTrans = getTransmittance(transmittanceTexture, atmosphereSampler, camH, N.y, atmH);
            let skyIrradiance = textureSampleLevel(atmosphereIrradianceLUT, atmosphereSampler, N, 0.0).rgb * skyIntensity * preExposure;
            iblDiffuseColor = (iblDiffuseColor * diffTrans) + skyIrradiance;
        }

        let envBRDF = textureSampleLevel(ibl_brdfLUTTexture, prefilterTextureSampler, clamp(vec2<f32>(NdotV_IBL, roughness), vec2<f32>(0.005), vec2<f32>(0.995)), 0.0).rg;
        let energyCompensation = 1.0 + F0 * (1.0 / max(envBRDF.x + envBRDF.y, 1e-4) - 1.0);
        reflectedColor *= energyCompensation;

        let horizonOcclusion = saturate(1.0 + 1.1 * dot(R, N));
        reflectedColor *= horizonOcclusion * horizonOcclusion;

        let fresnelPower = 5.0 - 2.0 * roughness;
        let fresnelTerm = pow(saturate(1.0 - NdotV_IBL), fresnelPower);
        let FR_dielectric = getIndirectFresnel(NdotV_IBL, F0_dielectric, roughness, fresnelTerm);
        let FR_metal = getIndirectFresnel(NdotV_IBL, F0_metal, roughness, fresnelTerm);

        let F_IBL_dielectric = FR_dielectric * envBRDF.x + envBRDF.y;
        let F_IBL_metal = FR_metal * envBRDF.x + envBRDF.y;

        let specularOcclusion = saturate(pow(NdotV_IBL + ao, exp2(-16.0 * roughness - 1.0)) - 1.0 + ao);
        let specularAlbedo_IBL = saturate(F0_dielectric * envBRDF.x + envBRDF.y);
        let diffuseWeight_IBL = (vec3<f32>(1.0) - specularAlbedo_IBL);

        var envIBL_DIFFUSE = albedo * iblDiffuseColor * diffuseWeight_IBL * ao;

        var backScatteringColor = vec3<f32>(0.0);
        if (u_usePrefilterTexture) {
            backScatteringColor = textureSampleLevel(ibl_prefilterTexture, prefilterTextureSampler, -N, iblMipLevel).rgb * preExposure * systemUniforms.iblIntensity;
        }
        if (u_useSkyAtmosphere) {
            let u_atmo = systemUniforms.skyAtmosphere;
            let skyIntensity = u_atmo.sunIntensity;
            let backTrans = getTransmittance(transmittanceTexture, atmosphereSampler, u_atmo.cameraHeight, -N.y, u_atmo.atmosphereHeight);
            let backSkyScat = textureSampleLevel(skyAtmosphere_prefilteredTexture, prefilterTextureSampler, -N, 0.0).rgb * skyIntensity * preExposure;
            backScatteringColor = (backScatteringColor * backTrans) + backSkyScat;
        }
        let transmittedIBL = backScatteringColor * albedo * (vec3<f32>(1.0) - F_IBL_dielectric);
        envIBL_DIFFUSE += transmittedIBL * (0.65 * 0.35);

        let ibl_specular_dielectric = reflectedColor * F_IBL_dielectric * specularOcclusion;
        let dielectricPart_IBL = ibl_specular_dielectric + envIBL_DIFFUSE;
        let metallicPart_IBL = reflectedColor * F_IBL_metal * specularOcclusion;

        indirectLighting = mix(dielectricPart_IBL, metallicPart_IBL, metallic);
    } else {
        indirectLighting = albedo * systemUniforms.ambientLight.color * systemUniforms.ambientLight.intensity * ao * preExposure;
    }

    var finalRgb = totalDirectLighting + indirectLighting;
    let tinted = getTintBlendMode(vec4<f32>(finalRgb, 1.0), globalFragmentData.tintBlendMode, globalFragmentData.tint);
    finalRgb = tinted.rgb;

    let smoothness = 1.0 - roughness;
    let smoothnessCurved = smoothness * smoothness * (3.0 - 2.0 * smoothness);
    let baseReflectionStrength = smoothnessCurved * (0.04 + 0.96 * metallic * metallic);

    output.color = vec4<f32>(finalRgb, globalFragmentData.opacity);
    output.gBufferNormal = vec4<f32>(N * 0.5 + 0.5, baseReflectionStrength);
    output.gBufferMotionVector = vec4<f32>(getMotionVector(inputData.currentClipPos, inputData.prevClipPos), 0.0, 1.0);

    return output;
}

