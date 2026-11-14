let bloomTexelSize = 1.0 / vec2<f32>(textureDimensions(bloomTexture));
let bloomRGB = sampleTent9Tap(bloomTexture, uv, bloomTexelSize) * (uniforms.tint * uniforms.intensity);
if (all(bloomRGB <= vec3<f32>(1e-5))) {
    discard;
    return vec4<f32>(0.0);
}

return vec4<f32>(bloomRGB, 0.0);
