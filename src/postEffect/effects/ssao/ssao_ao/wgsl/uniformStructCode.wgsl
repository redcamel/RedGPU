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
    let ndc = vec3<f32>(uv.x * 2.0 - 1.0, (1.0 - uv.y) * 2.0 - 1.0, depth);

    let clipPos = vec4<f32>(ndc, 1.0);
    let viewPos4 = systemUniforms.inverseProjectionMatrix * clipPos;
    return viewPos4.xyz / viewPos4.w;
}

fn reconstructViewNormal(gBufferNormalData: vec4<f32>) -> vec3<f32> {
    let worldNormal = normalize(gBufferNormalData.rgb * 2.0 - 1.0);
    let viewNormal = (systemUniforms.camera.cameraMatrix * vec4<f32>(worldNormal, 0.0)).xyz;
    return normalize(viewNormal);
}

fn getNoiseVec(p: vec2<f32>) -> vec3<f32> {
    let noise = fract(52.9829189 * fract(dot(p, vec2<f32>(0.06711056, 0.00583715))));
    let angle = noise * 6.28318530718;
    return vec3<f32>(cos(angle), sin(angle), 0.0);
}
