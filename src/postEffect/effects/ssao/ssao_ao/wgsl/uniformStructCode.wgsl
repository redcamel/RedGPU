#redgpu_include math.getInterleavedGradientNoise
#redgpu_include math.PI2
#redgpu_include depth.linearizeDepth
#redgpu_include math.getViewPositionFromDepth
#redgpu_include math.getViewNormalFromGNormalBuffer

struct Uniforms {
    radius: f32,
    intensity: f32,
    bias: f32,
    biasDistanceScale: f32,
    fadeDistanceStart: f32,
    fadeDistanceRange: f32,
    contrast: f32,
    useBlur: f32,
}

  fn getTextureSize() -> vec2<f32> {

     return vec2<f32>(textureDimensions(sourceTexture));

 }

 

 fn getNoiseVec(p: vec2<f32>) -> vec3<f32> {

 
    // [KO] 표준 math.getInterleavedGradientNoise를 사용하여 회전 노이즈를 생성합니다.
    // [EN] Generate rotation noise using standard math.getInterleavedGradientNoise.
    let noise = getInterleavedGradientNoise(p);
    let angle = noise * PI2;
    return vec3<f32>(cos(angle), sin(angle), 0.0);
}
