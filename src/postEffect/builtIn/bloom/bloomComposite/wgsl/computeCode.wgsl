let index = global_id.xy;
let uv = (vec2<f32>(index) + 0.5) / vec2<f32>(postEffectOutputDimensions);
let bloomTexelSize = 1.0 / vec2<f32>(textureDimensions(bloomTexture));

let baseColor = textureLoad(sourceTexture, index, 0);
let bloomRGB = sampleTent9Tap(bloomTexture, uv, bloomTexelSize) * (uniforms.tint * uniforms.intensity);

textureStore(outputTexture, index, vec4<f32>(baseColor.rgb + bloomRGB, baseColor.a));
