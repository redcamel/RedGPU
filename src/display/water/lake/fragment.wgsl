#redgpu_include SYSTEM_UNIFORM;
#redgpu_include color.getTintBlendMode;
#redgpu_include systemStruct.OutputFragment;
#redgpu_include math.getMotionVector;
#redgpu_include math.direction.getReflectionVectorFromViewDirection;
#redgpu_include math.tnb.getTBNFromVertexTangent;
#redgpu_include math.tnb.getNormalFromNormalMap;
#redgpu_include math.INV_PI;
#redgpu_include math.EPSILON;
#redgpu_include skyAtmosphere.skyAtmosphereFn;

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
    @location(9) @interpolate(flat) globalFragmentSlotIndex: u32,
    @location(11) combinedOpacity: f32,

    @location(12) motionVector: vec3<f32>,
    @location(14) @interpolate(flat) receiveShadow: f32,
    @location(15) @interpolate(flat) pickingId: vec4<f32>,
};

fn rotateVec2(v: vec2<f32>, angleRad: f32) -> vec2<f32> {
    let s = sin(angleRad);
    let c = cos(angleRad);
    return vec2<f32>(v.x * c - v.y * s, v.x * s + v.y * c);
}

fn unpackTangentNormal(color: vec3<f32>) -> vec3<f32> {
    var xy = color.xy * 2.0 - 1.0;
    xy.y = -xy.y;
    let z = sqrt(max(0.0, 1.0 - dot(xy, xy)));
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

    let dir2 = rotateVec2(baseWindDir, 0.645);
    let dir3 = rotateVec2(baseWindDir, -0.855);

    var blendedTangent: vec3<f32>;

    if (uniforms.useNormalTexture2 > 0.5) {
        let uv2 = (inputData.uv + warpOffset) * (uniforms.normalTiling * uniforms.normalTiling2) + dir2 * (timeSec * uniforms.windSpeed * 1.35);
        let uv3 = (inputData.uv - warpOffset * 0.65) * (uniforms.normalTiling * uniforms.normalTiling2 * 1.75) + dir3 * (timeSec * uniforms.windSpeed * 1.85);

        let rawN2 = textureSample(normalTexture2, normalTextureSampler, uv2).rgb;
        let rawN3 = textureSample(normalTexture2, normalTextureSampler, uv3).rgb;

        let n2 = unpackTangentNormal(rawN2);
        let n3 = unpackTangentNormal(rawN3);

        let microBlended = blendRNM(n2, n3 * vec3<f32>(0.65, 0.65, 1.0));

        let scaledN1 = vec3<f32>(n1.xy * uniforms.normalScale, n1.z);
        let scaledMicro = vec3<f32>(microBlended.xy * uniforms.normalScale2, microBlended.z);
        blendedTangent = blendRNM(scaledN1, scaledMicro);
    } else {
        let uv2 = (inputData.uv + warpOffset) * uniforms.normalTiling + dir2 * (timeSec * uniforms.windSpeed * 1.15);
        let uv3 = (inputData.uv - warpOffset * 0.5) * (uniforms.normalTiling * 2.25) + dir3 * (timeSec * uniforms.windSpeed * 1.75);

        let rawN2 = textureSample(normalTexture, normalTextureSampler, uv2).rgb;
        let rawN3 = textureSample(normalTexture, normalTextureSampler, uv3).rgb;

        let n2 = unpackTangentNormal(rawN2);
        let n3 = unpackTangentNormal(rawN3);

        let n12 = blendRNM(n1, n2);
        let combined = blendRNM(n12, n3);
        blendedTangent = vec3<f32>(combined.xy * uniforms.normalScale, combined.z);
    }

    let camDistance = distance(systemUniforms.camera.cameraPosition, inputData.vertexPosition);
    let distanceFade = clamp(1.0 - smoothstep(600.0, 6000.0, camDistance) * 0.75, 0.25, 1.0);

    let baseNormal = normalize(inputData.vertexNormal);
    let tbn = getTBNFromVertexTangent(baseNormal, inputData.vertexTangent);

    let viewDir = normalize(systemUniforms.camera.cameraPosition - inputData.vertexPosition);
    let isUnderwater = systemUniforms.camera.cameraPosition.y < inputData.vertexPosition.y;

    var finalXY = blendedTangent.xy * distanceFade;
    let finalZ = sqrt(max(0.001, 1.0 - dot(finalXY, finalXY)));
    var worldNormal = normalize(tbn * vec3<f32>(finalXY, finalZ));
    worldNormal = select(worldNormal, -worldNormal, isUnderwater);

    let NdotV_raw = dot(worldNormal, viewDir);
    if (NdotV_raw < 0.05) {
        worldNormal = normalize(worldNormal + (0.05 - NdotV_raw) * viewDir);
    }
    let NdotV = max(dot(worldNormal, viewDir), 0.001);

    let F0 = vec3<f32>(0.02037);

    var specularLighting = vec3<f32>(0.0);
    var waterDiffuseLighting = vec3<f32>(0.0);
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

            if (systemUniforms.useSkyAtmosphere == 1u && i == 0u) {
                let u_atmo = systemUniforms.skyAtmosphere;
                let surfaceHeightKm = max(0.0, inputData.vertexPosition.y / 1000.0);
                let atmosphereTransmittance = getTransmittance(transmittanceTexture, atmosphereSampler, surfaceHeightKm, lightDir.y, u_atmo.atmosphereHeight);
                lightRadiance *= atmosphereTransmittance;
            }

            let sunFresnel = F0 + (vec3<f32>(1.0) - F0) * pow(clamp(1.0 - max(dot(worldNormal, lightDir), 0.0), 0.0, 1.0), 5.0);
            let sunTransmittance = vec3<f32>(1.0) - sunFresnel;
            let sunGeoNdotL = clamp(dot(baseNormal, lightDir) * 0.7 + 0.3, 0.0, 1.0);
            let viewSunDot = dot(viewDir, -lightDir);
            let forwardScatter = pow(clamp(viewSunDot * 0.5 + 0.5, 0.0, 1.0), 2.0) * 0.5 + 0.5;
            let waterScatterContribution = lightRadiance * sunTransmittance * sunGeoNdotL * forwardScatter * 0.35;
            waterDiffuseLighting += waterScatterContribution;

            let halfDir = normalize(lightDir + viewDir);
            let NdotH = max(dot(worldNormal, halfDir), 0.0);
            let VdotH = max(dot(viewDir, halfDir), 0.0);
            let NdotH2 = NdotH * NdotH;
            let safeNdotL = max(NdotL, 0.0001);

            let F = F0 + (vec3<f32>(1.0) - F0) * pow(clamp(1.0 - VdotH, 0.0, 1.0), 5.0);

            let denom = NdotH2 * (alpha2 - 1.0) + 1.0;
            let D = alpha2 * INV_PI / max(EPSILON, denom * denom);
            let GGXV = safeNdotL * sqrt(NdotV * NdotV * oneMinusAlpha2 + alpha2);
            let GGXL = NdotV * sqrt(safeNdotL * safeNdotL * oneMinusAlpha2 + alpha2);
            let V = 0.5 / max(GGXV + GGXL, EPSILON);
            let specClean = D * V;

            let sunBaseReflect = reflect(-lightDir, baseNormal);
            let sunPathAlignment = clamp(dot(viewDir, sunBaseReflect), 0.0, 1.0);
            let sunColumnWeight = pow(sunPathAlignment, 2.0);

            let glintHigh = pow(NdotH, 256.0) * 120.0;
            let glintMid = pow(NdotH, 64.0) * 30.0;
            let glintColumn = pow(NdotH, 16.0) * 8.0 * sunColumnWeight;

            let waveSlopeFactor = 0.5 + 0.8 * clamp(length(finalXY) * 3.0, 0.0, 1.0);
            let diamondGlitter = (glintHigh + glintMid) * waveSlopeFactor + glintColumn;

            let totalSpecBRDF = (specClean + diamondGlitter) * F;
            specularLighting += lightRadiance * totalSpecBRDF * uniforms.specularFactor * NdotL;
        }
    }

    let ambientRadiance = systemUniforms.ambientLight.color.rgb * (systemUniforms.ambientLight.intensity * systemUniforms.preExposure);
    waterDiffuseLighting += ambientRadiance * 0.2;

    let u_usePrefilterTexture = systemUniforms.usePrefilterTexture == 1u;
    let u_useSkyAtmosphere = systemUniforms.useSkyAtmosphere == 1u;
    let preExposure = systemUniforms.preExposure;

    let R = getReflectionVectorFromViewDirection(viewDir, worldNormal);
    let NdotV_IBL = max(dot(worldNormal, viewDir), 0.04);
    let iblRoughness = clamp(uniforms.roughness, 0.02, 1.0);

    var reflectedSky = vec3<f32>(0.0);
    var hasReflection = false;

    if (u_usePrefilterTexture) {
        let iblMipmapCount = f32(textureNumLevels(ibl_prefilterTexture) - 1);
        let mipLevel = iblRoughness * iblMipmapCount;
        reflectedSky = textureSampleLevel(ibl_prefilterTexture, prefilterTextureSampler, R, mipLevel).rgb * preExposure * systemUniforms.iblIntensity;
        hasReflection = true;
    }

    if (u_useSkyAtmosphere) {
        let u_atmo = systemUniforms.skyAtmosphere;
        let camH = u_atmo.cameraHeight;
        let atmH = u_atmo.atmosphereHeight;
        let skyIntensity = u_atmo.sunIntensity;

        let specTrans = getTransmittance(transmittanceTexture, atmosphereSampler, camH, R.y, atmH);
        let atmoMipCount = f32(textureNumLevels(skyAtmosphere_prefilteredTexture) - 1);
        let atmoMipLevel = iblRoughness * atmoMipCount;
        let specSkyScat = textureSampleLevel(skyAtmosphere_prefilteredTexture, atmosphereSampler, R, atmoMipLevel).rgb * skyIntensity * preExposure;
        reflectedSky = (reflectedSky * specTrans) + specSkyScat;
        hasReflection = true;
    }

    if (!hasReflection) {
        let skyGradient = mix(vec3<f32>(0.35, 0.55, 0.8), vec3<f32>(0.6, 0.8, 1.0), clamp(R.y * 0.5 + 0.5, 0.0, 1.0));
        let sunSkyLuminance = maxSunRadiance * 0.35;
        let ambientSkyLuminance = max(ambientRadiance.r, max(ambientRadiance.g, ambientRadiance.b));
        let skyIntensity = max(max(sunSkyLuminance, ambientSkyLuminance), 1.0);
        reflectedSky = skyGradient * skyIntensity;
    }

    let envBRDF = textureSampleLevel(ibl_brdfLUTTexture, prefilterTextureSampler, clamp(vec2<f32>(NdotV_IBL, iblRoughness), vec2<f32>(0.005), vec2<f32>(0.995)), 0.0).rg;
    let energyCompensation = 1.0 + F0 * (1.0 / max(envBRDF.x + envBRDF.y, 1e-4) - 1.0);
    reflectedSky *= energyCompensation;

    if (!isUnderwater) {
        let horizonDot = dot(R, baseNormal);
        let horizonOcclusion = clamp(horizonDot * 1.5 + 0.7, 0.4, 1.0);
        reflectedSky *= horizonOcclusion;
    }

    let fresnelFactor = pow(clamp(1.0 - NdotV_IBL, 0.0, 1.0), 5.0);
    let F_dielectric = F0 + (vec3<f32>(1.0) - F0) * fresnelFactor;
    let F_IBL = F_dielectric * envBRDF.x + envBRDF.y;

    let iblSpecular = reflectedSky * F_IBL * uniforms.specularFactor;

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
    let viewNormal = (systemUniforms.camera.viewMatrix * vec4<f32>(worldNormal, 0.0)).xyz;
    let effectiveRefractionStrength = uniforms.refractionStrength * select(min(effectiveWaterDepthDelta * 2.0, 1.0), 0.7, isUnderwater);
    let refractionOffset = viewNormal.xy * effectiveRefractionStrength;

    var finalRefractUV = clamp(screenUV + refractionOffset, vec2<f32>(0.001), vec2<f32>(0.999));

    if (!isUnderwater) {
        let distortedScreenCoord = vec2<i32>(finalRefractUV * systemUniforms.resolution);
        let rawDistortedDepth = textureLoad(renderPath1DepthTexture, distortedScreenCoord, 0);
        let linearDistortedSceneDepth = getLinearizeDepth(rawDistortedDepth, cameraNear, cameraFar);

        if (linearDistortedSceneDepth < linearWaterDepth) {
            finalRefractUV = screenUV;
        }
    }

    let backgroundRefractedColor = textureSampleLevel(renderPath1ResultTexture, renderPath1ResultTextureSampler, finalRefractUV, 0.0).rgb;

    let depthScale = max(uniforms.depthFadeDistance * 2.5, 6.0);
    let depthGradient = smoothstep(0.0, depthScale, effectiveWaterDepthDelta);
    let waterTargetColor = mix(uniforms.baseColor, uniforms.deepColor, depthGradient);

    let effectiveOpacity = uniforms.opacity * inputData.combinedOpacity;
    let extinction = exp(-effectiveWaterDepthDelta * uniforms.extinctionFactor);
    let maxAbsorption = select(1.0, 0.45, isUnderwater);
    let absorptionStrength = clamp((1.0 - extinction) * effectiveOpacity, 0.0, maxAbsorption);
    let waterScatterTint = mix(waterTargetColor, vec3<f32>(0.08, 0.55, 0.65), 0.45);
    let scatterDepthMask = smoothstep(0.0, max(uniforms.depthFadeDistance * 0.5, 1.0), effectiveWaterDepthDelta);
    let maskedScatterLighting = waterDiffuseLighting * waterScatterTint * scatterDepthMask;
    let waterBodyScattering = mix(backgroundRefractedColor, waterTargetColor, absorptionStrength) + maskedScatterLighting;

    let transmissionWeight = select(clamp(vec3<f32>(1.0) - F_IBL, vec3<f32>(0.2), vec3<f32>(1.0)), vec3<f32>(0.85), isUnderwater);
    let transmittedUnderwater = waterBodyScattering * transmissionWeight;

    let totalSpecular = specularLighting + iblSpecular;
    let blendedWater = mix(backgroundRefractedColor, transmittedUnderwater, depthFade);
    let finalRgb = blendedWater + totalSpecular;

    output.color = vec4<f32>(finalRgb, 1.0);

    let safeRoughness = clamp(uniforms.roughness, 0.0, 1.0);
    let smoothness = 1.0 - safeRoughness;
    let smoothnessCurved = smoothness * smoothness * (3.0 - 2.0 * smoothness);
    let baseReflectionStrength = smoothnessCurved * 0.02037 * uniforms.specularFactor;
    output.gBufferNormal = vec4<f32>(worldNormal * 0.5 + 0.5, baseReflectionStrength);
    output.gBufferMotionVector = vec4<f32>(getMotionVector(inputData.currentClipPos, inputData.prevClipPos), 0.0, 1.0);

    return output;
}
