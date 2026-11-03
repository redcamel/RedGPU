let lowMipTexelSize = 1.0 / vec2<f32>(textureDimensions(lowMipTexture));
let lowMipUpsampled = sampleTent9Tap(lowMipTexture, uv, lowMipTexelSize);

return vec4<f32>(lowMipUpsampled, saturate(uniforms.radius));
