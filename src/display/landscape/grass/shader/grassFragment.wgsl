#redgpu_include SYSTEM_UNIFORM;
#redgpu_include systemStruct.OutputFragment;
#redgpu_include math.getMotionVector;
#redgpu_include math.PI;
#redgpu_include math.INV_PI;
#redgpu_include math.EPSILON;
#redgpu_include skyAtmosphere.skyAtmosphereFn;
#redgpu_include shadow.getDirectionalShadowVisibilityFoliage;

struct GrassMaterialUniforms {
    worldSizeX: f32,
    worldSizeZ: f32,
    groundBlendStrength: f32,
    alphaCutoff: f32,
    hasGroundTexture: u32,
    roughness: f32,
    subsurfaceStrength: f32,
    exposureBoost: f32,
    subsurfaceColor: vec3<f32>,
    subsurfaceDistortion: f32,
    aoIntensity: f32,
    receiveShadow: u32,
    shadowStrength: f32,
    _pad0: f32,
};

struct VertexOutput {
    @builtin(position) clipPos: vec4<f32>,
    @location(0) worldPos: vec3<f32>,
    @location(1) uv: vec2<f32>,
    @location(2) normal: vec3<f32>,
    @location(3) heightRatio: f32,
    @location(4) alphaFade: f32,
    @location(5) currentClipPos: vec4<f32>,
    @location(6) prevClipPos: vec4<f32>,
    @location(7) groundColor: vec3<f32>,
};

@group(2) @binding(0) var baseColorTexture: texture_2d<f32>;
@group(2) @binding(1) var baseColorSampler: sampler;
@group(2) @binding(2) var<uniform> materialUniforms: GrassMaterialUniforms;

@fragment
fn main(input: VertexOutput) -> OutputFragment {
    var output: OutputFragment;

    let baseTex = textureSample(baseColorTexture, baseColorSampler, input.uv);

    let rgbMax = max(baseTex.r, max(baseTex.g, baseTex.b));
    let sourceAlpha = select(baseTex.a, min(baseTex.a, smoothstep(0.02, 0.12, rgbMax)), baseTex.a > 0.98 && rgbMax < 0.12);

    let baseCutoff = clamp(materialUniforms.alphaCutoff, 0.0, 1.0);
    let alphaWidth = max(fwidth(sourceAlpha), 0.0001);
    let coverageAlpha = clamp((sourceAlpha - baseCutoff) / alphaWidth + 0.5, 0.0, 1.0);

    if (coverageAlpha < 0.5) {
        discard;
    }

    let safeAlpha = clamp(sourceAlpha, 0.20, 1.0);
    let pureLeafAlbedo = baseTex.rgb / safeAlpha;

    let exposureBoost = max(0.1, materialUniforms.exposureBoost);

    let vibrantAlbedo = pow(pureLeafAlbedo, vec3<f32>(0.86)) * exposureBoost;

    let edgeTint = mix(vec3<f32>(1.08, 1.15, 0.95), vec3<f32>(1.0), smoothstep(0.20, 0.60, baseTex.a));
    var albedo = vibrantAlbedo * edgeTint;

    if (materialUniforms.hasGroundTexture != 0u && materialUniforms.groundBlendStrength > 0.01) {
        let blendFactor = smoothstep(0.40, 0.0, input.heightRatio) * materialUniforms.groundBlendStrength;
        albedo = mix(albedo, input.groundColor, blendFactor);
    }

    let upVec = vec3<f32>(0.0, 1.0, 0.0);
    let upwardBlend = mix(0.55, 0.85, input.heightRatio);
    let N = normalize(mix(input.normal, upVec, upwardBlend));

    let V = normalize(systemUniforms.camera.cameraPosition.xyz - input.worldPos);
    let NdotV = max(abs(dot(N, V)), 0.001);

    let roughness = clamp(materialUniforms.roughness, 0.20, 1.0);
    let subsurfaceStrength = clamp(materialUniforms.subsurfaceStrength, 0.0, 3.0);
    let preExposure = systemUniforms.preExposure;

    let albedoLum = dot(albedo, vec3<f32>(0.2126, 0.7152, 0.0722));
    let sssColor = mix(albedo * 1.25, materialUniforms.subsurfaceColor * (albedoLum * 1.6), 0.70);

    let leafThickness = smoothstep(0.05, 0.85, input.heightRatio);

    var totalDirectLighting = vec3<f32>(0.0);
    let u_directionalLightCount = systemUniforms.directionalLightCount;
    let u_directionalLights = systemUniforms.directionalLights;

    var shadowFactor: f32 = 1.0;
    if (materialUniforms.receiveShadow != 0u && u_directionalLightCount > 0u) {
        let firstLightDir = -normalize(u_directionalLights[0].direction);
        let rawVisibility = getDirectionalShadowVisibilityFoliage(
            directionalShadowMap,
            directionalShadowMapSampler,
            input.worldPos,
            N,
            firstLightDir
        );
        let csmStrength = systemUniforms.shadow.directionalShadowStrength * materialUniforms.shadowStrength;
        shadowFactor = mix(1.0 - csmStrength, 1.0, rawVisibility);
    }

    for (var i = 0u; i < u_directionalLightCount; i = i + 1u) {
        let light = u_directionalLights[i];
        let L = -normalize(light.direction);
        let directNdotL = max(dot(N, L), 0.0);
        let currentShadow = select(1.0, shadowFactor, i == 0u);
        var dLight = light.color.rgb * light.intensity * preExposure * currentShadow;

        if (systemUniforms.useSkyAtmosphere == 1u && i == 0u) {
            let u_atmo = systemUniforms.skyAtmosphere;
            let surfaceHeightKm = max(0.0, input.worldPos.y / 1000.0);
            let atmosphereTransmittance = getTransmittance(transmittanceTexture, atmosphereSampler, surfaceHeightKm, L.y, u_atmo.atmosphereHeight);
            dLight *= atmosphereTransmittance;
        }

        let H = normalize(L + V);
        let NdotH = max(dot(N, H), 0.0);
        let specPower = mix(16.0, 64.0, 1.0 - roughness);
        let specFactor = pow(NdotH, specPower) * (1.0 - roughness) * 0.35;
        let directSpecular = vec3<f32>(specFactor);

        let diffuseReflection = albedo * directNdotL;

        let distortion = materialUniforms.subsurfaceDistortion;
        let L_scatter = normalize(L + N * distortion);
        let forwardScatterDot = max(dot(V, -L_scatter), 0.0);
        let forwardTransmission = pow(forwardScatterDot, 3.0) * 1.50;

        let backDot = max(0.0, -dot(N, L));
        let diffuseBackTransmission = backDot * 0.50;

        let transmission = (forwardTransmission + diffuseBackTransmission) * (subsurfaceStrength * leafThickness);
        let diffuseTransmission = sssColor * transmission;

        let wrapNdotL = max((dot(N, L) + 0.50) / 1.50, 0.0);
        let wrapScatter = albedo * wrapNdotL * 0.65;

        let totalDiffuse = diffuseReflection + diffuseTransmission + wrapScatter;
        totalDirectLighting += (totalDiffuse + directSpecular) * dLight;
    }

    let skyOcclusion = mix(0.65, 1.0, smoothstep(0.0, 0.70, input.heightRatio));
    var totalIndirectLighting = vec3<f32>(0.0);
    let u_usePrefilterTexture = systemUniforms.usePrefilterTexture == 1u;

    if (u_usePrefilterTexture) {

        let skyN = normalize(mix(N, vec3<f32>(0.0, 1.0, 0.0), 0.40));
        let iblSkyColor = textureSampleLevel(ibl_irradianceTexture, prefilterTextureSampler, skyN, 0.0).rgb * preExposure * systemUniforms.iblIntensity;

        let skyLum = dot(iblSkyColor, vec3<f32>(0.2126, 0.7152, 0.0722));
        let foliarSky = mix(iblSkyColor, vec3<f32>(skyLum * 0.90, skyLum * 1.15, skyLum * 0.70), 0.65);

        let iblGroundColor = foliarSky * 0.40;
        let envDiffuse = mix(iblGroundColor, foliarSky, skyOcclusion);

        let rimFresnel = pow(1.0 - NdotV, 3.0) * (1.0 - roughness) * 0.15;
        let foliarSpecular = foliarSky * rimFresnel * skyOcclusion;

        totalIndirectLighting = (albedo * envDiffuse) + foliarSpecular;
    } else {
        let ambLight = systemUniforms.ambientLight.color.rgb * (systemUniforms.ambientLight.intensity * preExposure);
        let ambSSS = ambLight * sssColor * (subsurfaceStrength * leafThickness * 0.25);
        totalIndirectLighting = (albedo * (ambLight * skyOcclusion)) + ambSSS;
    }

    let contactAO = mix(0.75, 1.0, smoothstep(0.0, 0.15, input.heightRatio));

    let finalColor = (totalDirectLighting + totalIndirectLighting) * contactAO;

    output.color = vec4<f32>(finalColor, 1.0);
    output.gBufferNormal = vec4<f32>(N * 0.5 + 0.5, 1.0);
    output.gBufferMotionVector = vec4<f32>(getMotionVector(input.currentClipPos, input.prevClipPos), 0.0, 1.0);

    return output;
}
