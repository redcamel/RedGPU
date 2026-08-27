#redgpu_include SYSTEM_UNIFORM;
#redgpu_include color.getTintBlendMode;
#redgpu_include entryPoint.mesh.entryPointPickingFragment;
#redgpu_include systemStruct.OutputFragment;
#redgpu_include math.getMotionVector;
#redgpu_include math.INV_PI;
#redgpu_include skyAtmosphere.skyAtmosphereFn;
#redgpu_include shadow.getDirectionalShadowVisibility;

@group(2) @binding(1) var diffuseTextureSampler: sampler;
@group(2) @binding(2) var diffuseTexture: texture_2d<f32>;
@group(2) @binding(3) var normalTextureSampler: sampler;
@group(2) @binding(4) var normalTexture: texture_2d<f32>;

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

// Convert 3D view direction to Hemi-Octahedral (0..1) UV
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

@fragment
fn main(inputData: InputData) -> OutputFragment {
    var output: OutputFragment;
    let globalFragmentData = globalFragmentSSBO_BuiltIn[inputData.globalFragmentSlotIndex];

    let camPos = systemUniforms.camera.cameraPosition.xyz;
    var viewDir = inputData.vertexTangent.xyz;
    if (inputData.vertexTangent.w > -500.0) {
        viewDir = normalize(camPos - inputData.vertexPosition);
    }

    let n = 8.0;
    let octUV = dirToHemiOctahedralUV(viewDir);

    let gridPos = octUV * n;
    let baseGrid = floor(gridPos);
    let frac = gridPos - baseGrid;

    // 1. MRT Dual Atlas 4-Tap Bilinear Sampling (BaseColor & True 3D World Normal)
    let s00 = sampleOctahedralAtlas(diffuseTexture, diffuseTextureSampler, baseGrid, inputData.uv, n);
    let s10 = sampleOctahedralAtlas(diffuseTexture, diffuseTextureSampler, baseGrid + vec2<f32>(1.0, 0.0), inputData.uv, n);
    let s01 = sampleOctahedralAtlas(diffuseTexture, diffuseTextureSampler, baseGrid + vec2<f32>(0.0, 1.0), inputData.uv, n);
    let s11 = sampleOctahedralAtlas(diffuseTexture, diffuseTextureSampler, baseGrid + vec2<f32>(1.0, 1.0), inputData.uv, n);

    let n00 = sampleOctahedralAtlas(normalTexture, normalTextureSampler, baseGrid, inputData.uv, n);
    let n10 = sampleOctahedralAtlas(normalTexture, normalTextureSampler, baseGrid + vec2<f32>(1.0, 0.0), inputData.uv, n);
    let n01 = sampleOctahedralAtlas(normalTexture, normalTextureSampler, baseGrid + vec2<f32>(0.0, 1.0), inputData.uv, n);
    let n11 = sampleOctahedralAtlas(normalTexture, normalTextureSampler, baseGrid + vec2<f32>(1.0, 1.0), inputData.uv, n);

    let w00 = (1.0 - frac.x) * (1.0 - frac.y) * s00.a;
    let w10 = frac.x * (1.0 - frac.y) * s10.a;
    let w01 = (1.0 - frac.x) * frac.y * s01.a;
    let w11 = frac.x * frac.y * s11.a;
    let totalWeight = w00 + w10 + w01 + w11;

    var albedo = s00.rgb;
    var rawNorm = n00.rgb;
    if (totalWeight > 0.0001) {
        albedo = (s00.rgb * w00 + s10.rgb * w10 + s01.rgb * w01 + s11.rgb * w11) / totalWeight;
        rawNorm = (n00.rgb * w00 + n10.rgb * w10 + n01.rgb * w01 + n11.rgb * w11) / totalWeight;
    }

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

    // 2. Unpack True 3D Baked Leaf Normal (No magic numbers / No spherical guessing)
    var N = normalize(rawNorm * 2.0 - 1.0);
    if (length(N) < 0.1) {
        N = vec3<f32>(0.0, 1.0, 0.0);
    }

    let toCamVec = camPos - inputData.vertexPosition;
    let V = normalize(select(viewDir, toCamVec, length(viewDir) < 0.01));
    let NdotV = max(abs(dot(N, V)), 0.04);
    let preExposure = systemUniforms.preExposure;

    // 3. Directional Shadow calculation
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

    // 4. Direct Directional Light (Exact RedGPU PBR Disney Diffuse Matching)
    var directDiffuse = vec3<f32>(0.0);
    let roughness = 0.85;
    let energyBias = mix(0.0, 0.5, roughness);
    let energyFactor = mix(1.0, 1.0 / 1.51, roughness);

    let u_directionalLightCount = systemUniforms.directionalLightCount;
    let u_directionalLights = systemUniforms.directionalLights;

    for (var i = 0u; i < u_directionalLightCount; i = i + 1u) {
        let light = u_directionalLights[i];
        let L = -normalize(light.direction);

        let NdotL_raw = dot(N, L);
        let H = normalize(L + V);
        let LdotH = max(dot(L, H), 0.0);
        let fd90 = energyBias + 2.0 * LdotH * LdotH * roughness;
        let lightScatter = 1.0 + (fd90 - 1.0) * pow(1.0 - max(NdotL_raw, 0.0), 5.0);
        let viewScatter = 1.0 + (fd90 - 1.0) * pow(1.0 - NdotV, 5.0);
        var diffuseBRDF = max(NdotL_raw, 0.0) * lightScatter * viewScatter * energyFactor;

        let viewSunPhase = max(dot(L, V), 0.0);
        let forwardScatter = pow(viewSunPhase, 4.0) * 0.3;
        let NdotL_back = max(-NdotL_raw, 0.0);
        diffuseBRDF += (NdotL_back * lightScatter * viewScatter * energyFactor) * forwardScatter;

        if (diffuseBRDF > 0.0) {
            var lightColor = light.color * light.intensity * preExposure * shadowVis;

            if (systemUniforms.useSkyAtmosphere == 1u && i == 0u) {
                let u_atmo = systemUniforms.skyAtmosphere;
                let surfaceHeightKm = max(0.0, inputData.vertexPosition.y / 1000.0);
                let atmosphereTransmittance = getTransmittance(transmittanceTexture, atmosphereSampler, surfaceHeightKm, L.y, u_atmo.atmosphereHeight);
                lightColor *= atmosphereTransmittance;
            }

            directDiffuse += lightColor * diffuseBRDF;
        }
    }

    // 5. Indirect Ambient & Sky Atmosphere (Exact RedGPU PBR Indirect Matching with INV_PI)
    var indirectDiffuse = vec3<f32>(0.0);
    let u_usePrefilterTexture = systemUniforms.usePrefilterTexture == 1u;
    let u_useSkyAtmosphere = systemUniforms.useSkyAtmosphere == 1u;

    if (u_usePrefilterTexture || u_useSkyAtmosphere) {
        if (u_usePrefilterTexture) {
            indirectDiffuse += textureSampleLevel(ibl_irradianceTexture, prefilterTextureSampler, N, 0).rgb * preExposure * systemUniforms.iblIntensity * INV_PI;
        }

        if (u_useSkyAtmosphere) {
            let u_atmo = systemUniforms.skyAtmosphere;
            let camH = u_atmo.cameraHeight;
            let atmH = u_atmo.atmosphereHeight;
            let skyIntensity = u_atmo.sunIntensity;
            let diffTrans = getTransmittance(transmittanceTexture, atmosphereSampler, camH, N.y, atmH);
            let skyIrradiance = textureSampleLevel(atmosphereIrradianceLUT, atmosphereSampler, N, 0.0).rgb * skyIntensity * preExposure;
            indirectDiffuse = (indirectDiffuse * diffTrans) + skyIrradiance;
        }
    } else {
        indirectDiffuse = systemUniforms.ambientLight.color * systemUniforms.ambientLight.intensity * preExposure;
    }

    // 6. Final Combined Shading (Exact 1:1 PBR Tone Matching)
    var finalRgb = albedo * (directDiffuse + indirectDiffuse);

    let tinted = getTintBlendMode(vec4<f32>(finalRgb, 1.0), globalFragmentData.tintBlendMode, globalFragmentData.tint);
    finalRgb = tinted.rgb;

    output.color = vec4<f32>(finalRgb, 1.0);
    output.gBufferNormal = vec4<f32>(N * 0.5 + 0.5, 1.0);
    output.gBufferMotionVector = vec4<f32>(getMotionVector(inputData.currentClipPos, inputData.prevClipPos), 0.0, 1.0);

    return output;
}
