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

@fragment
fn main(inputData: InputData) -> OutputFragment {
    var output: OutputFragment;
    let globalFragmentData = globalFragmentSSBO_BuiltIn[inputData.globalFragmentSlotIndex];

    var texColor = vec4<f32>(1.0);
    #redgpu_if diffuseTexture
    texColor = textureSample(diffuseTexture, diffuseTextureSampler, inputData.uv);
    #redgpu_endIf

    #redgpu_if useCutOff
    if (texColor.a < 0.35) {
        discard;
    }
    #redgpu_endIf

    let planeNormal = normalize(inputData.vertexNormal);

    let localU = fract(inputData.uv.x * 3.0);
    let sphereX = (localU - 0.5) * 2.0;
    let sphereY = -(inputData.uv.y - 0.5) * 2.0;
    let distSq = sphereX * sphereX + sphereY * sphereY;

    let sphereZ = sqrt(max(1.0 - distSq * 0.7, 0.2));
    let planeTangent = vec3<f32>(planeNormal.z, 0.0, -planeNormal.x);
    let N = normalize(planeTangent * sphereX + vec3<f32>(0.0, sphereY * 0.7, 0.0) + planeNormal * sphereZ);

    let V = normalize(systemUniforms.camera.cameraPosition.xyz - inputData.vertexPosition);
    let preExposure = systemUniforms.preExposure;
    let roughness = 0.85;

    var visibility: f32 = 1.0;
    visibility = getDirectionalShadowVisibility(
        directionalShadowMap,
        directionalShadowMapSampler,
        systemUniforms.shadow.directionalShadowDepthTextureSize,
        systemUniforms.shadow.directionalShadowBias,
        systemUniforms.shadow.directionalShadowFilterScale,
        inputData.shadowCoord
    );
    visibility = mix(1.0 - systemUniforms.shadow.directionalShadowStrength, 1.0, visibility);

    var directSunLighting = vec3<f32>(0.0);
    if (systemUniforms.directionalLightCount > 0u) {
        for (var i = 0u; i < systemUniforms.directionalLightCount; i = i + 1u) {
            let dirLight = systemUniforms.directionalLights[i];
            let L = -normalize(dirLight.direction);
            let H = normalize(L + V);
            let NdotL = max(dot(N, L), 0.0);
            let NdotV = max(abs(dot(N, V)), 0.04);
            let LdotH = max(dot(L, H), 0.0);

            let energyFactor = mix(1.0, 1.0 / 1.51, roughness);
            let fd90 = 0.5 + 2.0 * roughness * LdotH * LdotH;
            let lightScatter = 1.0 + (fd90 - 1.0) * pow(1.0 - NdotL, 5.0);
            let viewScatter  = 1.0 + (fd90 - 1.0) * pow(1.0 - NdotV, 5.0);
            let diffuseBRDF  = NdotL * lightScatter * viewScatter * energyFactor;

            let finalLightColor = dirLight.color * dirLight.intensity * preExposure * visibility;
            directSunLighting += texColor.rgb * finalLightColor * diffuseBRDF;
        }
    }

    var iblDiffuseColor = vec3<f32>(0.0);

    if (systemUniforms.usePrefilterTexture == 1u) {
        iblDiffuseColor = textureSampleLevel(ibl_irradianceTexture, prefilterTextureSampler, N, 0.0).rgb * preExposure * systemUniforms.iblIntensity * INV_PI;
    }

    if (systemUniforms.useSkyAtmosphere == 1u) {
        let u_atmo = systemUniforms.skyAtmosphere;
        let camH = u_atmo.cameraHeight;
        let atmH = u_atmo.atmosphereHeight;
        let skyIntensity = u_atmo.sunIntensity;
        let diffTrans = getTransmittance(transmittanceTexture, atmosphereSampler, camH, N.y, atmH);
        let skyIrradiance = textureSampleLevel(atmosphereIrradianceLUT, atmosphereSampler, N, 0.0).rgb * skyIntensity * preExposure;
        iblDiffuseColor = (iblDiffuseColor * diffTrans) + skyIrradiance;
    }

    if (systemUniforms.usePrefilterTexture == 0u && systemUniforms.useSkyAtmosphere == 0u) {
        iblDiffuseColor = systemUniforms.ambientLight.color * systemUniforms.ambientLight.intensity * preExposure;
    }

    let indirectLighting = texColor.rgb * iblDiffuseColor;

    var finalRgb = directSunLighting + indirectLighting;

    #redgpu_if useTint
    let tinted = getTintBlendMode(vec4<f32>(finalRgb, 1.0), globalFragmentData.tintBlendMode, globalFragmentData.tint);
    finalRgb = tinted.rgb;
    #redgpu_endIf

    output.color = vec4<f32>(finalRgb, texColor.a);
    output.gBufferNormal = vec4<f32>(N * 0.5 + 0.5, 1.0);
    output.gBufferMotionVector = vec4<f32>(getMotionVector(inputData.currentClipPos, inputData.prevClipPos), 0.0, 1.0);

    return output;
}
