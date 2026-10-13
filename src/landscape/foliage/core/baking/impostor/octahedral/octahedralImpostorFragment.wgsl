#redgpu_include SYSTEM_UNIFORM;
#redgpu_include color.getTintBlendMode;
#redgpu_include entryPoint.mesh.entryPointPickingFragment;
#redgpu_include systemStruct.OutputFragment;
#redgpu_include math.getMotionVector;
#redgpu_include math.PI;
#redgpu_include skyAtmosphere.skyAtmosphereFn;
#redgpu_include shadow.getDirectionalShadowVisibilityFoliage;
#redgpu_include landscape.rotateVectorByQuat;

fn ditherFadeDiscard(fragCoordXY: vec2<f32>, fadeValue: f32, frameIndex: u32) {
    if (fadeValue < 0.999) {
        let px = u32(fragCoordXY.x) & 3u;
        let py = u32(fragCoordXY.y) & 3u;
        let frameIdx = frameIndex & 3u;
        let idx = (((py ^ frameIdx) << 2u) | (px ^ frameIdx)) & 15u;
        let packed = select(0x6E4C2A80u, 0x5D7F91B3u, idx >= 8u);
        let threshold = f32(extractBits(packed, (idx & 7u) * 4u, 4u)) * 0.0625;
        if (fadeValue < threshold) {
            discard;
        }
    }
}

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
    let halfInvL1 = 0.5 * invL1;
    let u = (d.x + d.z) * halfInvL1 + 0.5;
    let v = (d.z - d.x) * halfInvL1 + 0.5;
    return saturate(vec2<f32>(u, v));
}

const INV_OCT_N: f32 = 0.125;
const BORDER_PADDING: f32 = 0.00390625;

fn sampleOctahedralAtlas(
    tex: texture_2d<f32>,
    smp: sampler,
    gridCoords: vec2<f32>,
    subUV: vec2<f32>,
    n: f32,
    ddxAtlas: vec2<f32>,
    ddyAtlas: vec2<f32>
) -> vec4<f32> {
    let isInside = all(subUV >= vec2<f32>(0.0)) && all(subUV <= vec2<f32>(1.0));
    let clampedGrid = clamp(gridCoords, vec2<f32>(0.0), vec2<f32>(n - 1.0));
    let safeSubUV = clamp(subUV, vec2<f32>(BORDER_PADDING), vec2<f32>(1.0 - BORDER_PADDING));
    let atlasUV = (clampedGrid + safeSubUV) * INV_OCT_N;

    let sampled = textureSampleGrad(tex, smp, atlasUV, ddxAtlas, ddyAtlas);
    return select(vec4<f32>(0.0), sampled, isInside);
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

    let f = saturate(1.0 - cosTheta);
    let f2 = f * f;
    let f5 = f2 * f2 * f;
    return F0 + (vec3<f32>(1.0) - F0) * f5;
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

const INV_151: f32 = 0.66225166;

fn getDirectDiffuseBRDF(NdotL: f32, NdotV: f32, LdotH: f32, roughness: f32, albedo: vec3<f32>) -> vec3<f32> {
    if (NdotL <= 0.0) { return vec3<f32>(0.0); }
    let energyBias = mix(0.0, 0.5, roughness);
    let energyFactor = mix(1.0, INV_151, roughness);
    let fd90 = energyBias + 2.0 * LdotH * LdotH * roughness;
    let f0 = 1.0;

    let fL = saturate(1.0 - NdotL);
    let fL2 = fL * fL;
    let fL5 = fL2 * fL2 * fL;
    let lightScatter = f0 + (fd90 - f0) * fL5;

    let fV = saturate(1.0 - NdotV);
    let fV2 = fV * fV;
    let fV5 = fV2 * fV2 * fV;
    let viewScatter = f0 + (fd90 - f0) * fV5;

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

    var g0 = baseGrid;
    var g1 = baseGrid;
    var g2 = baseGrid;
    var w0: f32;
    var w1: f32;
    var w2: f32;

    if (frac.x + frac.y < 1.0) {
        g0 += vec2<f32>(0.0, 0.0);
        g1 += vec2<f32>(1.0, 0.0);
        g2 += vec2<f32>(0.0, 1.0);
        w0 = 1.0 - frac.x - frac.y;
        w1 = frac.x;
        w2 = frac.y;
    } else {
        g0 += vec2<f32>(1.0, 1.0);
        g1 += vec2<f32>(1.0, 0.0);
        g2 += vec2<f32>(0.0, 1.0);
        w0 = frac.x + frac.y - 1.0;
        w1 = 1.0 - frac.y;
        w2 = 1.0 - frac.x;
    }

    g0 = clamp(g0, vec2<f32>(0.0), vec2<f32>(n - 1.0));
    g1 = clamp(g1, vec2<f32>(0.0), vec2<f32>(n - 1.0));
    g2 = clamp(g2, vec2<f32>(0.0), vec2<f32>(n - 1.0));

    let subUV = inputData.uv;

    let ddxUV = dpdx(inputData.uv);
    let ddyUV = dpdy(inputData.uv);
    let ddxAtlas = ddxUV * INV_OCT_N;
    let ddyAtlas = ddyUV * INV_OCT_N;

    let s0 = sampleOctahedralAtlas(baseColorTexture, baseColorTextureSampler, g0, subUV, n, ddxAtlas, ddyAtlas);
    let s1 = sampleOctahedralAtlas(baseColorTexture, baseColorTextureSampler, g1, subUV, n, ddxAtlas, ddyAtlas);
    let s2 = sampleOctahedralAtlas(baseColorTexture, baseColorTextureSampler, g2, subUV, n, ddxAtlas, ddyAtlas);

    let cov0 = w0 * s0.a;
    let cov1 = w1 * s1.a;
    let cov2 = w2 * s2.a;
    let totalCoverage = cov0 + cov1 + cov2;

    if (totalCoverage < 0.001) {
        discard;
    }

    ditherFadeDiscard(inputData.position.xy, inputData.combinedOpacity, systemUniforms.time.frameIndex);

    let linearAlpha = totalCoverage;
    let maxAlpha = max(max(s0.a, s1.a), s2.a);
    let maxCornerWeight = max(max(w0, w1), w2);
    let sharpnessFactor = saturate((maxCornerWeight - 0.333333) * 1.5);
    let reconstructedAlpha = mix(linearAlpha, maxAlpha, mix(0.70, 0.95, sharpnessFactor));

    let texDim = vec2<f32>(textureDimensions(baseColorTexture));
    let maxDim = max(texDim.x, texDim.y);
    let lenSq = max(dot(ddxAtlas, ddxAtlas), dot(ddyAtlas, ddyAtlas));
    let mipLevel = max(0.0, 0.5 * log2(max(lenSq * (maxDim * maxDim), 1.0)));
    let effectiveAlpha = reconstructedAlpha * (1.0 + mipLevel * 0.28);

    let ditherPx = u32(inputData.position.x) & 3u;
    let ditherPy = u32(inputData.position.y) & 3u;
    let frameIdx = systemUniforms.time.frameIndex & 3u;
    let ditherIdx = (((ditherPy ^ frameIdx) << 2u) | (ditherPx ^ frameIdx)) & 15u;
    let bayerPacked = select(0x6E4C2A80u, 0x5D7F91B3u, ditherIdx >= 8u);
    let ditherThreshold = f32(extractBits(bayerPacked, (ditherIdx & 7u) * 4u, 4u)) * 0.0625;

    let dynamicCutOff = mix(0.20, 0.55, ditherThreshold);
    if (effectiveAlpha <= dynamicCutOff) {
        discard;
    }

    let invSafeCoverage = 1.0 / max(totalCoverage, 0.0001);

    var albedo = (s0.rgb * cov0 + s1.rgb * cov1 + s2.rgb * cov2) * invSafeCoverage;
    albedo = saturate(albedo);

    let toCamVec = camPos - inputData.vertexPosition;
    let distSq = dot(toCamVec, toCamVec);

    var rawNormalDepth: vec4<f32>;
    var rawORM: vec4<f32>;

    if (distSq > 250000.0) {
        var domG = g0;
        var maxCov = cov0;
        if (cov1 > maxCov) { maxCov = cov1; domG = g1; }
        if (cov2 > maxCov) { maxCov = cov2; domG = g2; }

        rawNormalDepth = sampleOctahedralAtlas(normalTexture, normalTextureSampler, domG, subUV, n, ddxAtlas, ddyAtlas);
        rawORM = sampleOctahedralAtlas(packedORMTexture, baseColorTextureSampler, domG, subUV, n, ddxAtlas, ddyAtlas);
    } else {
        let n0 = sampleOctahedralAtlas(normalTexture, normalTextureSampler, g0, subUV, n, ddxAtlas, ddyAtlas);
        let n1 = sampleOctahedralAtlas(normalTexture, normalTextureSampler, g1, subUV, n, ddxAtlas, ddyAtlas);
        let n2 = sampleOctahedralAtlas(normalTexture, normalTextureSampler, g2, subUV, n, ddxAtlas, ddyAtlas);

        let orm0 = sampleOctahedralAtlas(packedORMTexture, baseColorTextureSampler, g0, subUV, n, ddxAtlas, ddyAtlas);
        let orm1 = sampleOctahedralAtlas(packedORMTexture, baseColorTextureSampler, g1, subUV, n, ddxAtlas, ddyAtlas);
        let orm2 = sampleOctahedralAtlas(packedORMTexture, baseColorTextureSampler, g2, subUV, n, ddxAtlas, ddyAtlas);

        rawNormalDepth = (n0 * cov0 + n1 * cov1 + n2 * cov2) * invSafeCoverage;
        rawORM = (orm0 * cov0 + orm1 * cov1 + orm2 * cov2) * invSafeCoverage;
    }
    let V = normalize(toCamVec);

    let sphereRadius = max(inputData.localNodeScale_volumeScale.y * 3.5, 2.0);
    let depthOffsetMeters = (rawNormalDepth.w - 0.5) * 2.0 * sphereRadius;
    let virtualWorldPos = inputData.vertexPosition - V * depthOffsetMeters;

    var bakedN = normalize(rawNormalDepth.rgb * 2.0 - 1.0);
    if (dot(bakedN, bakedN) < 0.01) {
        bakedN = vec3<f32>(0.0, 1.0, 0.0);
    }
    var N = bakedN;
    let quat = inputData.instanceRotQuat;
    if (abs(dot(quat, quat) - 1.0) < 0.2) {
        N = normalize(rotateVectorByQuat(bakedN, quat));
    }

    let viewDist = sqrt(distSq);

    let quadOffset = (subUV - vec2<f32>(0.5, 0.5)) * 2.0;
    let offsetLenSq = dot(quadOffset, quadOffset);
    let sphereZ = sqrt(max(0.0, 1.0 - saturate(offsetLenSq) * 0.75));
    let rightXZ = vec2<f32>(systemUniforms.camera.viewMatrix[0][0], systemUniforms.camera.viewMatrix[2][0]);
    let rightLenSq = dot(rightXZ, rightXZ);
    let billboardRight = select(vec3<f32>(1.0, 0.0, 0.0), vec3<f32>(rightXZ.x, 0.0, rightXZ.y) * inverseSqrt(rightLenSq), rightLenSq > 0.0001);
    let billboardUp = vec3<f32>(0.0, 1.0, 0.0);
    let canopySphereNormal = normalize(billboardRight * (quadOffset.x * 0.85) + billboardUp * ((-quadOffset.y) * 0.65) + V * sphereZ);

    let canopyBlend = saturate((viewDist - 40.0) * 0.0125);
    N = normalize(mix(N, canopySphereNormal, mix(0.40, 0.85, canopyBlend)));

    let NdotV = max(dot(N, V), 0.04);
    let preExposure = systemUniforms.preExposure;

    let receiveShadowYn = inputData.receiveShadow != 0.0 && systemUniforms.shadow.directionalShadowStrength > 0.0 && systemUniforms.directionalLightCount > 0u;
    var shadowVis: f32 = 1.0;
    var L0 = vec3<f32>(0.0, 1.0, 0.0);
    if (systemUniforms.directionalLightCount > 0u) {
        L0 = -normalize(systemUniforms.directionalLights[0].direction);
    }

    if (receiveShadowYn) {
        let cascadeCount = min(4u, max(1u, systemUniforms.shadow.cascadeCount));
        let maxCSMDist = systemUniforms.shadow.cascadeSplitDepths[cascadeCount - 1u];

        let distantCanopyVis = mix(1.0 - systemUniforms.shadow.directionalShadowStrength * 0.7, 1.0, rawORM.r);

        if (distSq < maxCSMDist * maxCSMDist) {
            let rawVis = getDirectionalShadowVisibilityFoliage(
                directionalShadowMap,
                directionalShadowMapSampler,
                virtualWorldPos,
                N,
                L0
            );
            let localCSMVis = mix(1.0 - systemUniforms.shadow.directionalShadowStrength, 1.0, rawVis);

            let csmFadeStart = maxCSMDist * 0.7;
            let csmBlend = saturate((viewDist - csmFadeStart) / max(maxCSMDist * 0.3, 1.0));
            shadowVis = mix(localCSMVis, distantCanopyVis, csmBlend);
        } else {
            shadowVis = distantCanopyVis;
        }
    }

    let ao = saturate(rawORM.r);
    let roughness = clamp(rawORM.g, 0.04, 1.0);
    let metallic = saturate(rawORM.b);
    let F0_dielectric = vec3<f32>(0.04);
    let F0_metal = albedo;
    let F0 = mix(F0_dielectric, F0_metal, metallic);

    var totalDirectLighting = vec3<f32>(0.0);
    let u_directionalLightCount = systemUniforms.directionalLightCount;
    let u_directionalLights = systemUniforms.directionalLights;

    let NORM_225: f32 = 0.44444445;
    let sssDistortion: f32 = 0.25;
    let sssDistFade = 1.0 - saturate((viewDist - 60.0) * 0.005555556);
    let sssTransmissionFactor: f32 = 0.20 * sssDistFade;

    for (var i = 0u; i < u_directionalLightCount; i = i + 1u) {
        let light = u_directionalLights[i];
        var L: vec3<f32>;
        if (i == 0u) {
            L = L0;
        } else {
            L = -normalize(light.direction);
        }

        let rawNdotL = dot(N, L);
        let NdotL = max(rawNdotL, 0.0);
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
        let backWrap = saturate((-rawNdotL + 0.5) * NORM_225);
        let lightOpposite = -(L + N * sssDistortion);
        let vDotL = max(dot(V, lightOpposite), 0.0);
        let inScatter = vDotL * vDotL;
        let diffuseTransmission = albedo * (backWrap * 0.5 + inScatter * 0.5);
        let directAO = mix(ao, 1.0, saturate(NdotL * 0.5) * 0.5);
        let canopyNdotL = dot(canopySphereNormal, L);
        let shadowSideFade = saturate(canopyNdotL * 1.5 + 0.3);
        let totalDiffuse = mix(diffuseReflection, diffuseTransmission * shadowSideFade, sssTransmissionFactor) * directAO;

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
        envIBL_DIFFUSE = envIBL_DIFFUSE * 0.55 + transmittedIBL * (0.1575 * sssDistFade);

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
    let smoothnessCurved = smoothstep(0.0, 1.0, smoothness);
    let baseReflectionStrength = smoothnessCurved * (0.04 + 0.96 * metallic * metallic);

    output.color = vec4<f32>(finalRgb, globalFragmentData.opacity);
    output.gBufferNormal = vec4<f32>(N * 0.5 + 0.5, baseReflectionStrength);
    output.gBufferMotionVector = vec4<f32>(getMotionVector(inputData.currentClipPos, inputData.prevClipPos), 0.0, 1.0);

    return output;
}

