#redgpu_include SYSTEM_UNIFORM
#redgpu_include drawPicking
#redgpu_include color.getTintBlendMode
#redgpu_include FragmentOutput
#redgpu_include math.getMotionVector
#redgpu_include math.PI
#redgpu_include math.PI2
#redgpu_include math.INV_PI

struct Uniforms {
    color:vec3<f32>,
    //
    opacity:f32,
    useTint:u32,
    tint:vec4<f32>,
    tintBlendMode:u32,
};
// Input structure for model data
struct InputData {
  // Built-in attributes
  @builtin(position) position : vec4<f32>,
  @location(0) vertexPosition: vec3<f32>,

  @location(7) currentClipPos: vec4<f32>,
  @location(8) prevClipPos: vec4<f32>,
  @location(11) combinedOpacity: f32,
  //
  @location(12) motionVector: vec3<f32>,
  @location(15) @interpolate(flat) pickingId: vec4<f32>,
}

@group(2) @binding(0) var<uniform> uniforms: Uniforms;
@fragment
fn main(inputData: InputData) -> FragmentOutput {
    var output: FragmentOutput;
    var finalColor = vec4<f32>( uniforms.color.r , uniforms.color.g , uniforms.color.b , uniforms.opacity * inputData.combinedOpacity);
    #redgpu_if useTint
        finalColor = getTintBlendMode(finalColor, uniforms.tintBlendMode, uniforms.tint);
    #redgpu_endIf

    // [Atmosphere] 시스템 플래그가 활성화된 경우 Aerial Perspective 합성
    if (systemUniforms.useSkyAtmosphere == 1u) {
        let viewVec = inputData.vertexPosition - systemUniforms.camera.cameraPosition;
        let viewDir = normalize(viewVec);
        let distKm = length(viewVec) / 1000.0;

        let u = atan2(viewDir.z, viewDir.x) / PI2 + 0.5;
        let v = asin(clamp(viewDir.y, -1.0, 1.0)) * INV_PI + 0.5;
        let w = sqrt(clamp(distKm / 100.0, 0.0, 1.0));

        let apSample = textureSampleLevel(cameraVolumeTexture, tSampler, vec3<f32>(u, v, w), 0.0);
        
        // [수정] 태양 강도와 노출을 적용하여 하늘 밝기와 동기화
        let atmosphereColor = apSample.rgb * systemUniforms.skyAtmosphereSunIntensity;
        let atmosphereTransmittance = apSample.a;
        
        finalColor = vec4<f32>((finalColor.rgb * atmosphereTransmittance) + atmosphereColor, finalColor.a);
        finalColor = vec4<f32>(finalColor.rgb * systemUniforms.skyAtmosphereExposure, finalColor.a);
    }

    if (finalColor.a == 0.0) {
        discard;
    }
    output.color = finalColor;
    output.gBufferMotionVector = vec4<f32>(getMotionVector(inputData.currentClipPos, inputData.prevClipPos),0.0, 1.0 );
    return output;
}


