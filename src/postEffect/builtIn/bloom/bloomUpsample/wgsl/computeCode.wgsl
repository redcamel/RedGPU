let index = global_id.xy;
let uv = (vec2<f32>(index) + 0.5) / vec2<f32>(postEffectOutputDimensions);
let lowMipTexelSize = 1.0 / vec2<f32>(textureDimensions(lowMipTexture));

let highMipColor = textureLoad(highMipTexture, index, 0).rgb;
let lowMipUpsampled = sampleTent9Tap(lowMipTexture, uv, lowMipTexelSize);
let combinedBloom = mix(highMipColor, highMipColor + lowMipUpsampled, uniforms.radius);

textureStore(outputTexture, index, vec4<f32>(combinedBloom, 1.0));
