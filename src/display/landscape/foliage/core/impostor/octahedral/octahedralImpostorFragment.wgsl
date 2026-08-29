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
    @location(13) shadowCoord: vec3<f32>,
    @location(14) @interpolate(flat) receiveShadow: f32,
    @location(15) @interpolate(flat) pickingId: vec4<f32>,
};

// Convert 3D local view direction to Hemi-Octahedral (0..1) UV
fn dirToHemiOctahedralUV(dir: vec3<f32>) -> vec2<f32> {
    let d = normalize(vec3<f32>(dir.x, max(dir.y, 0.0), dir.z));
    let l1 = abs(d.x) + d.y + abs(d.z);
    let invL1 = select(1.0 / l1, 1.0, l1 < 0.0001);
    let u = (d.x + d.z) * 0.5 * invL1 + 0.5;
    let v = (d.z - d.x) * 0.5 * invL1 + 0.5;
    return clamp(vec2<f32>(u, v), vec2<f32>(0.0), vec2<f32>(1.0));
}

// Convert Hemi-Octahedral (0..1) UV to 3D direction vector
fn hemiOctahedralUVToDir(uv: vec2<f32>) -> vec3<f32> {
    let uPrime = 2.0 * uv.x - 1.0;
    let vPrime = 2.0 * uv.y - 1.0;
    let dirX = (uPrime - vPrime) * 0.5;
    let dirZ = (uPrime + vPrime) * 0.5;
    let dirY = max(1.0 - (abs(dirX) + abs(dirZ)), 0.0);
    return normalize(vec3<f32>(dirX, dirY, dirZ));
}

// Computes 2D rotation of quad UV so that the baked tile aligns seamlessly with current camera view
// 🌿 UE5 Standard atan2 방위각 차이 기반 회전 + 상공(Top-down) 극점 특이점 스무딩(Pole Singularity Smoothing)
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
        // [-PI, PI] 범위로 랩핑
        diff = diff - floor((diff + 3.14159265) / 6.2831853) * 6.2831853;

        // Top-Down 극점 영역에서의 부드러운 감쇄
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
    n: f32
) -> vec4<f32> {
    let isInside = (subUV.x >= 0.0 && subUV.x <= 1.0 && subUV.y >= 0.0 && subUV.y <= 1.0);
    let clampedGrid = clamp(gridCoords, vec2<f32>(0.0), vec2<f32>(n - 1.0));
    let oneTexelInTile = 1.0 / 256.0;
    let safeSubUV = clamp(subUV, vec2<f32>(oneTexelInTile), vec2<f32>(1.0 - oneTexelInTile));
    let atlasUV = (clampedGrid + safeSubUV) / n;

    // 🌿 옥타헤드럴 아틀라스는 타일 간 침범(Bleeding) 및 고스팅(Ghosting) 방지를 위해 Mip 0으로 샘플링
    let sampled = textureSampleLevel(tex, smp, atlasUV, 0.0);
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

    // 🌿 타일 중심점 기준 정밀 Bilinear 보간 (-0.5 오프셋)
    let gridPos = octUV * n - 0.5;
    let baseGrid = floor(gridPos);
    let frac = gridPos - baseGrid;

    // 🌿 4개 타일별 중심 3D 방향 벡터 계산 및 서브 UV 정렬 (카메라 롤 및 90도 회전 보정)
    let g00 = clamp(baseGrid + vec2<f32>(0.0, 0.0), vec2<f32>(0.0), vec2<f32>(n - 1.0));
    let g10 = clamp(baseGrid + vec2<f32>(1.0, 0.0), vec2<f32>(0.0), vec2<f32>(n - 1.0));
    let g01 = clamp(baseGrid + vec2<f32>(0.0, 1.0), vec2<f32>(0.0), vec2<f32>(n - 1.0));
    let g11 = clamp(baseGrid + vec2<f32>(1.0, 1.0), vec2<f32>(0.0), vec2<f32>(n - 1.0));

    let dir00 = hemiOctahedralUVToDir((g00 + vec2<f32>(0.5)) / n);
    let dir10 = hemiOctahedralUVToDir((g10 + vec2<f32>(0.5)) / n);
    let dir01 = hemiOctahedralUVToDir((g01 + vec2<f32>(0.5)) / n);
    let dir11 = hemiOctahedralUVToDir((g11 + vec2<f32>(0.5)) / n);

    let uv00 = getSubTileRotatedUV(inputData.uv, localView, dir00);
    let uv10 = getSubTileRotatedUV(inputData.uv, localView, dir10);
    let uv01 = getSubTileRotatedUV(inputData.uv, localView, dir01);
    let uv11 = getSubTileRotatedUV(inputData.uv, localView, dir11);

    // 1. 3-Atlas 4-Tap Bilinear Sampling (Mip Level 0)
    let s00 = sampleOctahedralAtlas(baseColorTexture, baseColorTextureSampler, g00, uv00, n);
    let s10 = sampleOctahedralAtlas(baseColorTexture, baseColorTextureSampler, g10, uv10, n);
    let s01 = sampleOctahedralAtlas(baseColorTexture, baseColorTextureSampler, g01, uv01, n);
    let s11 = sampleOctahedralAtlas(baseColorTexture, baseColorTextureSampler, g11, uv11, n);

    let n00 = sampleOctahedralAtlas(normalTexture, normalTextureSampler, g00, uv00, n);
    let n10 = sampleOctahedralAtlas(normalTexture, normalTextureSampler, g10, uv10, n);
    let n01 = sampleOctahedralAtlas(normalTexture, normalTextureSampler, g01, uv01, n);
    let n11 = sampleOctahedralAtlas(normalTexture, normalTextureSampler, g11, uv11, n);

    let orm00 = sampleOctahedralAtlas(packedORMTexture, baseColorTextureSampler, g00, uv00, n);
    let orm10 = sampleOctahedralAtlas(packedORMTexture, baseColorTextureSampler, g10, uv10, n);
    let orm01 = sampleOctahedralAtlas(packedORMTexture, baseColorTextureSampler, g01, uv01, n);
    let orm11 = sampleOctahedralAtlas(packedORMTexture, baseColorTextureSampler, g11, uv11, n);

    // 🌿 4-코너 Bilinear 기본 가중치 (합 = 1.0)
    let w00 = (1.0 - frac.x) * (1.0 - frac.y);
    let w10 = frac.x * (1.0 - frac.y);
    let w01 = (1.0 - frac.x) * frac.y;
    let w11 = frac.x * frac.y;

    // 🌿 UE5 Ryan Brucks 표준: 4개 타일 유효 잎사귀 알파 가중치(Coverage) 및 정규화
    let cov00 = w00 * s00.a;
    let cov10 = w10 * s10.a;
    let cov01 = w01 * s01.a;
    let cov11 = w11 * s11.a;
    let totalCoverage = cov00 + cov10 + cov01 + cov11;
    let safeCoverage = max(totalCoverage, 0.0001);

    // 🌿 TrueRGB 및 머티리얼 속성 알파 가중 정규화 (빈 공간 암전 차단 및 100% True PBR 복원)
    var albedo = (s00.rgb * cov00 + s10.rgb * cov10 + s01.rgb * cov01 + s11.rgb * cov11) / safeCoverage;
    albedo = clamp(albedo, vec3<f32>(0.0), vec3<f32>(1.0));
    let rawNormalDepth = (n00 * cov00 + n10 * cov10 + n01 * cov01 + n11 * cov11) / safeCoverage;
    let rawORM = (orm00 * cov00 + orm10 * cov10 + orm01 * cov01 + orm11 * cov11) / safeCoverage;

    // 2. Dithered LOD Crossfade (4x4 Bayer Matrix)
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

    // 🌿 수학적 옥타헤드럴 알파 재구성 (Ryan Brucks Kernel - Alpha Erosion Prevention)
    let linearAlpha = totalCoverage;
    let maxAlpha = max(max(s00.a, s10.a), max(s01.a, s11.a));
    let maxCornerWeight = max(max(w00, w10), max(w01, w11));
    let sharpnessFactor = clamp((maxCornerWeight - 0.25) / 0.75, 0.0, 1.0);
    let reconstructedAlpha = mix(linearAlpha, maxAlpha, mix(0.70, 0.95, sharpnessFactor));

    // 🌿 UE5 DitherTemporalAA (TAA 시간축 융합 + MSAA 서브픽셀 융합 완벽 호환)
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

    let toCamVec = camPos - inputData.vertexPosition;
    let V = normalize(toCamVec);

    // 3. Unpack True 3D Baked Normal and rotate to World Space via Instance Rotation (Exact PBR matching)
    var bakedN = normalize(rawNormalDepth.rgb * 2.0 - 1.0);
    if (length(bakedN) < 0.1) {
        bakedN = vec3<f32>(0.0, 1.0, 0.0);
    }
    var N = bakedN;
    let quat = inputData.instanceRotQuat;
    if (abs(dot(quat, quat) - 1.0) < 0.2) {
        N = normalize(rotateVectorByQuaternion(bakedN, quat));
    }

    let NdotV = max(abs(dot(N, V)), 0.04);
    let preExposure = systemUniforms.preExposure;

    // 4. Directional Shadow calculation (Exact pbrMaterial match)
    var shadowVis: f32 = 1.0;
    shadowVis = getDirectionalShadowVisibility(
        directionalShadowMap,
        directionalShadowMapSampler,
        systemUniforms.shadow.directionalShadowDepthTextureSize,
        systemUniforms.shadow.directionalShadowBias,
        systemUniforms.shadow.directionalShadowFilterScale,
        inputData.shadowCoord
    );
    shadowVis = mix(1.0 - systemUniforms.shadow.directionalShadowStrength, 1.0, shadowVis);

    // 5. Material Properties from Baked ORM Atlas (Exact pbrMaterial match)
    let ao = clamp(rawORM.r, 0.0, 1.0);
    let roughness = clamp(rawORM.g, 0.04, 1.0);
    let metallic = clamp(rawORM.b, 0.0, 1.0);
    let F0_dielectric = vec3<f32>(0.04);
    let F0_metal = albedo;
    let F0 = mix(F0_dielectric, F0_metal, metallic);

    // 6. Direct Directional Light (Exact pbrMaterial getDirectPbrLight match)
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

        // 🌿 Foliage Subsurface Transmission (빛이 잎사귀를 뚫고 나오는 역광 투과광)
        let viewDotNegL = max(dot(V, -L), 0.0);
        let subSurfaceFactor = pow(viewDotNegL, 3.0) * (1.0 - metallic) * 0.45;
        let subSurfaceTransmission = albedo * subSurfaceFactor;

        let dielectricPart = (specBRDF * NdotL) + (vec3<f32>(1.0) - F) * diffuseReflection + subSurfaceTransmission;
        let metallicPart = specBRDF * NdotL;
        let directResult = mix(dielectricPart, metallicPart, metallic);

        totalDirectLighting += directResult * dLight;
    }

    // 7. Indirect Lighting (Exact pbrMaterial getIndirectPbrLighting match)
    var indirectLighting = vec3<f32>(0.0);
    let u_usePrefilterTexture = systemUniforms.usePrefilterTexture == 1u;
    let u_useSkyAtmosphere = systemUniforms.useSkyAtmosphere == 1u;

    if (u_usePrefilterTexture || u_useSkyAtmosphere) {
        let R = reflect(-V, N);
        let NdotV_IBL = NdotV;
        var reflectedColor = vec3<f32>(0.0);
        var iblDiffuseColor = vec3<f32>(0.0);

        if (u_usePrefilterTexture) {
            let iblMipmapCount = f32(textureNumLevels(ibl_prefilterTexture) - 1);
            let mipLevel = roughness * iblMipmapCount;
            reflectedColor = textureSampleLevel(ibl_prefilterTexture, prefilterTextureSampler, R, mipLevel).rgb * preExposure * systemUniforms.iblIntensity;
            iblDiffuseColor = textureSampleLevel(ibl_irradianceTexture, prefilterTextureSampler, N, 0).rgb * preExposure * systemUniforms.iblIntensity * INV_PI;
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

        // 🌿 Foliage(나뭇잎) 스펙큘러 과다 반사(고휘도 IBL 백화 현상) 억제 (UE5 Foliage Shading Model 기준 0.15)
        let foliageSpecWeight = 0.15;
        let F_IBL_dielectric_weight = F_IBL_dielectric * foliageSpecWeight;

        let specularOcclusion = saturate(pow(NdotV_IBL + ao, exp2(-16.0 * roughness - 1.0)) - 1.0 + ao);
        let specularAlbedo_IBL = saturate(F0_dielectric * envBRDF.x + envBRDF.y);
        let diffuseWeight_IBL = (vec3<f32>(1.0) - specularAlbedo_IBL * foliageSpecWeight);

        let envIBL_DIFFUSE = albedo * iblDiffuseColor * diffuseWeight_IBL * ao;
        let ibl_specular_dielectric = reflectedColor * F_IBL_dielectric_weight * specularOcclusion;
        let dielectricPart_IBL = ibl_specular_dielectric + envIBL_DIFFUSE;
        let metallicPart_IBL = reflectedColor * F_IBL_metal * specularOcclusion;

        indirectLighting = mix(dielectricPart_IBL, metallicPart_IBL, metallic);
    } else {
        indirectLighting = albedo * systemUniforms.ambientLight.color * systemUniforms.ambientLight.intensity * ao * preExposure;
    }

    // 8. Final Combined Shading & Tinting
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




