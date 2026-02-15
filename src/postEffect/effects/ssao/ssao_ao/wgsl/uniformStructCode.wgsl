#redgpu_include math.getInterleavedGradientNoise
#redgpu_include math.PI2
#redgpu_include depth.linearizeDepth

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

fn reconstructViewPosition(screenCoord: vec2<i32>, depth: f32) -> vec3<f32> {
    let texSize = getTextureSize();
    let uv = (vec2<f32>(screenCoord) + 0.5) / texSize;
    
    // [KO] NDC 좌표 구성 (depth 0 ~ 1 범위 기준)
    let ndc = vec3<f32>(
        uv.x * 2.0 - 1.0, 
        (1.0 - uv.y) * 2.0 - 1.0, 
        depth
    );

    let viewPos4 = systemUniforms.inverseProjectionMatrix * vec4<f32>(ndc, 1.0);
    return viewPos4.xyz / viewPos4.w;
}

fn reconstructViewNormal(gBufferNormalData: vec4<f32>) -> vec3<f32> {
    let worldNormal = normalize(gBufferNormalData.rgb * 2.0 - 1.0);
    let viewNormal = (systemUniforms.camera.cameraMatrix * vec4<f32>(worldNormal, 0.0)).xyz;
    return normalize(viewNormal);
}

fn getNoiseVec(p: vec2<f32>) -> vec3<f32> {
    // [KO] 표준 math.getInterleavedGradientNoise를 사용하여 회전 노이즈를 생성합니다.
    // [EN] Generate rotation noise using standard math.getInterleavedGradientNoise.
    let noise = getInterleavedGradientNoise(p);
    let angle = noise * PI2;
    return vec3<f32>(cos(angle), sin(angle), 0.0);
}
