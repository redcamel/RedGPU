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

fn sampleOctahedralAtlas(tex: texture_2d<f32>, smp: sampler, gridCoords: vec2<f32>, quadUV: vec2<f32>, n: f32) -> vec4<f32> {
    let clampedGrid = clamp(gridCoords, vec2<f32>(0.0), vec2<f32>(n - 1.0));
    let safeSubUV = clamp(quadUV, vec2<f32>(0.002), vec2<f32>(0.998));
    let atlasUV = (clampedGrid + safeSubUV) / n;
    return textureSample(tex, smp, atlasUV);
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

    let gridPos = octUV * n;
    let baseGrid = floor(gridPos);
    let frac = gridPos - baseGrid;

    // 1. 3-Atlas 4-Tap Bilinear Sampling (BaseColor, Normal+Depth, ORM+Subsurface)
    let s00 = sampleOctahedralAtlas(baseColorTexture, baseColorTextureSampler, baseGrid, inputData.uv, n);
    let s10 = sampleOctahedralAtlas(baseColorTexture, baseColorTextureSampler, baseGrid + vec2<f32>(1.0, 0.0), inputData.uv, n);
    let s01 = sampleOctahedralAtlas(baseColorTexture, baseColorTextureSampler, baseGrid + vec2<f32>(0.0, 1.0), inputData.uv, n);
    let s11 = sampleOctahedralAtlas(baseColorTexture, baseColorTextureSampler, baseGrid + vec2<f32>(1.0, 1.0), inputData.uv, n);

    let n00 = sampleOctahedralAtlas(normalTexture, normalTextureSampler, baseGrid, inputData.uv, n);
    let n10 = sampleOctahedralAtlas(normalTexture, normalTextureSampler, baseGrid + vec2<f32>(1.0, 0.0), inputData.uv, n);
    let n01 = sampleOctahedralAtlas(normalTexture, normalTextureSampler, baseGrid + vec2<f32>(0.0, 1.0), inputData.uv, n);
    let n11 = sampleOctahedralAtlas(normalTexture, normalTextureSampler, baseGrid + vec2<f32>(1.0, 1.0), inputData.uv, n);

    let orm00 = sampleOctahedralAtlas(packedORMTexture, packedTextureSampler, baseGrid, inputData.uv, n);
    let orm10 = sampleOctahedralAtlas(packedORMTexture, packedTextureSampler, baseGrid + vec2<f32>(1.0, 0.0), inputData.uv, n);
    let orm01 = sampleOctahedralAtlas(packedORMTexture, packedTextureSampler, baseGrid + vec2<f32>(0.0, 1.0), inputData.uv, n);
    let orm11 = sampleOctahedralAtlas(packedORMTexture, packedTextureSampler, baseGrid + vec2<f32>(1.0, 1.0), inputData.uv, n);


    let w00 = (1.0 - frac.x) * (1.0 - frac.y) * s00.a;
    let w10 = frac.x * (1.0 - frac.y) * s10.a;
    let w01 = (1.0 - frac.x) * frac.y * s01.a;
    let w11 = frac.x * frac.y * s11.a;
    let totalWeight = w00 + w10 + w01 + w11;

    var albedo = s00.rgb;
    var rawNormalDepth = n00;
    var rawORM = orm00;
    if (totalWeight > 0.0001) {
        albedo = (s00.rgb * w00 + s10.rgb * w10 + s01.rgb * w01 + s11.rgb * w11) / totalWeight;
        rawNormalDepth = (n00 * w00 + n10 * w10 + n01 * w01 + n11 * w11) / totalWeight;
        rawORM = (orm00 * w00 + orm10 * w10 + orm01 * w01 + orm11 * w11) / totalWeight;
    }

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

    let finalAlpha = mix(
        mix(s00.a, s10.a, frac.x),
        mix(s01.a, s11.a, frac.x),
        frac.y
    );

    if (finalAlpha < 0.33) {
        discard;
    }

    // 3. Unpack True 3D Baked Leaf Normal and transform to World Space via Instance Rotation
    var bakedN = normalize(rawNormalDepth.rgb * 2.0 - 1.0);
    if (length(bakedN) < 0.1) {
        bakedN = vec3<f32>(0.0, 1.0, 0.0);
    }
    let instanceQuat = inputData.vertexColor_0;
    var N = bakedN;
    if (abs(dot(instanceQuat, instanceQuat) - 1.0) < 0.2) {
        N = normalize(rotateVectorByQuaternion(bakedN, instanceQuat));
    }

    let toCamVec = camPos - inputData.vertexPosition;
    let V = normalize(toCamVec);
    let NdotV = max(abs(dot(N, V)), 0.04);
    let preExposure = systemUniforms.preExposure;

    // 4. Directional Shadow calculation
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

    // 5. Material Properties from Baked ORM Atlas (Exact PBR matching)
    let ao = clamp(rawORM.r, 0.0, 1.0);
    let roughness = clamp(rawORM.g, 0.04, 1.0);
    let metallic = clamp(rawORM.b, 0.0, 1.0);
    let subsurfaceAmount = clamp(rawORM.a, 0.0, 1.0);
    let F0_dielectric = vec3<f32>(0.04);
    let F0_metal = albedo;
    let F0 = mix(F0_dielectric, F0_metal, metallic);

    // 6. Direct Directional Light (Exact RedGPU PBR Two-Sided Foliage + Specular)
    var totalDirectLighting = vec3<f32>(0.0);
    let u_directionalLightCount = systemUniforms.directionalLightCount;
    let u_directionalLights = systemUniforms.directionalLights;

    for (var i = 0u; i < u_directionalLightCount; i = i + 1u) {
        let light = u_directionalLights[i];
        let L = -normalize(light.direction);

        let NdotL_raw = dot(N, L);
        let NdotL = max(NdotL_raw, 0.0);
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

        // Two-Sided Foliage Subsurface Transmission (Backlight Glow + Forward Scatter)
        let backLight = max(0.0, -NdotL_raw);
        let viewSunPhase = max(dot(L, V), 0.0);
        let forwardScatter = pow(viewSunPhase, 3.0) * 0.6 + 0.4;
        let subsurfaceColor = albedo * vec3<f32>(1.15, 1.25, 0.75);
        let diffuseTransmission = subsurfaceColor * (backLight * forwardScatter * 0.45);

        let totalDiffuse = diffuseReflection + diffuseTransmission * subsurfaceAmount;
        let dielectricPart = (specBRDF * NdotL) + (vec3<f32>(1.0) - F) * totalDiffuse;
        let metallicPart = specBRDF * NdotL;
        let directResult = mix(dielectricPart, metallicPart, metallic);

        totalDirectLighting += directResult * dLight;
    }

    // 7. Indirect Lighting (IBL Specular + IBL Diffuse + Sky Atmosphere, Exact PBR Match)
    var indirectLighting = vec3<f32>(0.0);
    let u_usePrefilterTexture = systemUniforms.usePrefilterTexture == 1u;
    let u_useSkyAtmosphere = systemUniforms.useSkyAtmosphere == 1u;

    if (u_usePrefilterTexture || u_useSkyAtmosphere) {
        let R = reflect(-V, N);
        let NdotV_IBL = max(abs(dot(N, V)), 0.04);
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

        let specularOcclusion = saturate(pow(NdotV_IBL + ao, exp2(-16.0 * roughness - 1.0)) - 1.0 + ao);
        let specularAlbedo_IBL = saturate(F0_dielectric * envBRDF.x + envBRDF.y);
        let diffuseWeight_IBL = (vec3<f32>(1.0) - specularAlbedo_IBL);

        let envIBL_DIFFUSE = albedo * iblDiffuseColor * diffuseWeight_IBL * ao;
        let ibl_specular_dielectric = reflectedColor * F_IBL_dielectric * specularOcclusion;
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

    output.color = vec4<f32>(finalRgb, 1.0);
    output.gBufferNormal = vec4<f32>(N * 0.5 + 0.5, 1.0);
    output.gBufferMotionVector = vec4<f32>(getMotionVector(inputData.currentClipPos, inputData.prevClipPos), 0.0, 1.0);

    return output;
}


