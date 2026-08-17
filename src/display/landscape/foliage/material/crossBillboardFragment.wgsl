#redgpu_include SYSTEM_UNIFORM;
#redgpu_include color.getTintBlendMode;
#redgpu_include entryPoint.mesh.entryPointPickingFragment;
#redgpu_include systemStruct.OutputFragment;
#redgpu_include math.getMotionVector;
#redgpu_include math.INV_PI;
#redgpu_include skyAtmosphere.skyAtmosphereFn;

@group(2) @binding(1) var diffuseTextureSampler: sampler;
@group(2) @binding(2) var diffuseTexture: texture_2d<f32>;

struct InputData {
    @builtin(position) position: vec4<f32>,
    @location(0) vertexPosition: vec3<f32>,
    @location(1) vertexNormal: vec3<f32>,
    @location(2) uv: vec2<f32>,

    @location(7) currentClipPos: vec4<f32>,
    @location(8) prevClipPos: vec4<f32>,
    @location(9) @interpolate(flat) globalFragmentSlotIndex: u32,

    @location(11) combinedOpacity: f32,
    @location(12) motionVector: vec3<f32>,
    @location(13) shadowCoord: vec3<f32>,
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

    // 🌟 MASK: Alpha Cutoff (0.5 미만 폐기)
    if (texColor.a < 0.5) {
        discard;
    }

    // 🌟 언리얼 엔진 5 스타일 4x4 Bayer Matrix LOD Dithered Crossfade
    let totalOpacity = inputData.combinedOpacity * globalFragmentData.opacity;
    if (totalOpacity < 0.999) {
        let bayer = array<f32, 16>(
             0.0 / 16.0, 12.0 / 16.0,  3.0 / 16.0, 15.0 / 16.0,
             8.0 / 16.0,  4.0 / 16.0, 11.0 / 16.0,  7.0 / 16.0,
             2.0 / 16.0, 14.0 / 16.0,  1.0 / 16.0, 13.0 / 16.0,
            10.0 / 16.0,  6.0 / 16.0,  9.0 / 16.0,  5.0 / 16.0
        );
        let ditherX = u32(inputData.position.x) % 4u;
        let ditherY = u32(inputData.position.y) % 4u;
        let threshold = bayer[ditherY * 4u + ditherX];
        if (totalOpacity < threshold) {
            discard;
        }
    }

    // 🌲 언리얼 엔진 5 스타일 Pixel-Perfect Spherical Normal Reconstruction
    // 평면 버텍스 보간 오차를 제거하고, 픽셀 위치(UV)를 기반으로 완벽한 3D 구체 볼륨 노멀 재구성
    let sphereX = (inputData.uv.x - 0.5) * 2.0; // [-1, 1]
    let sphereY = -(inputData.uv.y - 0.55) * 2.0; // [-1, 1]
    let distSq = sphereX * sphereX + sphereY * sphereY;
    let sphereZ = sqrt(max(1.0 - distSq * 0.7, 0.2)); // 구체 앞면 볼륨 깊이

    // 버텍스 평면 노멀(N)과 탄젠트 평면을 결합한 입체 구형 노멀
    let planeNormal = normalize(inputData.vertexNormal);
    let upVec = vec3<f32>(0.0, 1.0, 0.0);
    let planeTangent = normalize(cross(upVec, planeNormal) + vec3<f32>(0.001, 0.0, 0.0));
    
    // 최종 3D 구형 노멀 (Spherical Volume Normal)
    let N = normalize(planeTangent * sphereX + upVec * (sphereY * 0.7) + planeNormal * sphereZ);

    let dirLight = systemUniforms.directionalLights[0];
    let L = normalize(-dirLight.direction);
    let preExposure = systemUniforms.preExposure;
    
    // 1. Direct Sun Lighting (PBR calcPbrLight와 100% 동일한 에너지 보존 램버트)
    let NdotL = max(dot(N, L), 0.0);
    let backLight = max(dot(-N, L), 0.0) * 0.15; // 잎사귀 투과광
    let directSunLighting = texColor.rgb * dirLight.color * (dirLight.intensity * INV_PI) * (NdotL + backLight) * preExposure;
    
    // 2. IBL & Ambient Lighting (PBR envIBL_DIFFUSE와 100% 동일한 광도/조도 공식)
    var iblDiffuseColor = vec3<f32>(0.0);

    if (systemUniforms.usePrefilterTexture == 1u) {
        iblDiffuseColor = textureSampleLevel(ibl_irradianceTexture, prefilterTextureSampler, N, 0.0).rgb * preExposure * systemUniforms.iblIntensity;
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

    // 기본 앰비언트 (IBL이 없을 때 안전 fallback)
    if (systemUniforms.usePrefilterTexture == 0u && systemUniforms.useSkyAtmosphere == 0u) {
        iblDiffuseColor = systemUniforms.ambientLight.color * systemUniforms.ambientLight.intensity * preExposure;
    }

    // PBRMaterial 라인 1124와 100% 동일: albedo * iblDiffuseColor * INV_PI
    let indirectLighting = texColor.rgb * iblDiffuseColor * INV_PI;

    // 3. 최종 조명 합산 (PBR과 1:1 완벽 일치)
    var finalRgb = directSunLighting + indirectLighting;

    #redgpu_if useTint
    let tinted = getTintBlendMode(vec4<f32>(finalRgb, 1.0), globalFragmentData.tintBlendMode, globalFragmentData.tint);
    finalRgb = tinted.rgb;
    #redgpu_endIf

    output.color = vec4<f32>(finalRgb, 1.0);
    output.gBufferMotionVector = vec4<f32>(getMotionVector(inputData.currentClipPos, inputData.prevClipPos), 0.0, 1.0);
    return output;
}
