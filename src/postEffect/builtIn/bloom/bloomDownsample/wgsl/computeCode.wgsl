let index = global_id.xy;
let uv = (vec2<f32>(index) + 0.5) / vec2<f32>(postEffectOutputDimensions);
let texelSize = 1.0 / vec2<f32>(textureDimensions(sourceTexture));

let dx = texelSize.x;
let dy = texelSize.y;
let dx2 = dx * 2.0;
let dy2 = dy * 2.0;

// 13-Tap Dual-Grid Isotropic Downsample
let a = textureSampleLevel(sourceTexture, basicSampler, uv + vec2<f32>(-dx2, -dy2), 0.0).rgb;
let b = textureSampleLevel(sourceTexture, basicSampler, uv + vec2<f32>( 0.0, -dy2), 0.0).rgb;
let c = textureSampleLevel(sourceTexture, basicSampler, uv + vec2<f32>( dx2, -dy2), 0.0).rgb;

let d = textureSampleLevel(sourceTexture, basicSampler, uv + vec2<f32>(-dx,  -dy),  0.0).rgb;
let e = textureSampleLevel(sourceTexture, basicSampler, uv + vec2<f32>( dx,  -dy),  0.0).rgb;

let f = textureSampleLevel(sourceTexture, basicSampler, uv + vec2<f32>(-dx2,  0.0), 0.0).rgb;
let g = textureSampleLevel(sourceTexture, basicSampler, uv,                         0.0).rgb;
let h = textureSampleLevel(sourceTexture, basicSampler, uv + vec2<f32>( dx2,  0.0), 0.0).rgb;

let i = textureSampleLevel(sourceTexture, basicSampler, uv + vec2<f32>(-dx,   dy),  0.0).rgb;
let j = textureSampleLevel(sourceTexture, basicSampler, uv + vec2<f32>( dx,   dy),  0.0).rgb;

let k = textureSampleLevel(sourceTexture, basicSampler, uv + vec2<f32>(-dx2,  dy2), 0.0).rgb;
let l = textureSampleLevel(sourceTexture, basicSampler, uv + vec2<f32>( 0.0,  dy2), 0.0).rgb;
let m = textureSampleLevel(sourceTexture, basicSampler, uv + vec2<f32>( dx2,  dy2), 0.0).rgb;

let outColor = (d + e + i + j + g) * 0.125
             + (b + f + h + l) * 0.0625
             + (a + c + k + m) * 0.03125;

textureStore(outputTexture, index, vec4<f32>(outColor, 1.0));
