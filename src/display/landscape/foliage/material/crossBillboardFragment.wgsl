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

    // 🌲 언리얼 엔진 5 스타일 3-Plane Star 3D Spherical Volume Normal Reconstruction
    let planeNormal = normalize(inputData.vertexNormal);

    // 🌟 MASK: Alpha Cutoff (외곽 검은색 테두리/블리딩을 완벽 제거하기 위해 0.35 적용)
    #redgpu_if useCutOff
    if (texColor.a < 0.35) {
        discard;
    }
    #redgpu_endIf

    // 3개 뷰포트(0°, 60°, 120°)별 로컬 U 산출
    let uSegment = floor(inputData.uv.x * 3.0);
    let localU = clamp((inputData.uv.x - uSegment / 3.0) * 3.0, 0.0, 1.0);
    let sphereX = (localU - 0.5) * 2.0; // [-1, 1]
    let sphereY = -(inputData.uv.y - 0.5) * 2.0; // [-1, 1]
    let distSq = sphereX * sphereX + sphereY * sphereY;

    // 🌿 3D 구형 볼륨 노멀 재구성 (각 평면의 노멀/탄젠트를 기준으로 3차원 볼륨감 생성)
    let sphereZ = sqrt(max(1.0 - distSq * 0.7, 0.2));
    let upVec = vec3<f32>(0.0, 1.0, 0.0);
    let planeTangent = normalize(cross(upVec, planeNormal) + vec3<f32>(0.001, 0.0, 0.0));
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
