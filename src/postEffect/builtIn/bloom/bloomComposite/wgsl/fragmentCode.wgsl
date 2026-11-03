let bloomTexelSize = 1.0 / vec2<f32>(textureDimensions(bloomTexture));
let bloomRGB = sampleTent9Tap(bloomTexture, uv, bloomTexelSize) * (uniforms.tint * uniforms.intensity);

return vec4<f32>(bloomRGB, 0.0);
