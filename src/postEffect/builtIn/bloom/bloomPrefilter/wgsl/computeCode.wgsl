let index = global_id.xy;
let uv = (vec2<f32>(index) + 0.5) / vec2<f32>(postEffectOutputDimensions);
let texelSize = 1.0 / vec2<f32>(textureDimensions(sourceTexture));

let dx = texelSize.x;
let dy = texelSize.y;
let dx2 = dx * 2.0;
let dy2 = dy * 2.0;

// 13-Tap Dual-Grid Bilinear Sampling
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

let threshold = uniforms.threshold;
let softKnee = uniforms.softKnee;
let maxBrightness = uniforms.maxBrightness;

// 5 Overlapping 2x2 Sub-Boxes with Soft-Knee HDR Threshold
let box0 = applySoftThreshold((d + e + i + j) * 0.25, threshold, softKnee, maxBrightness);
let box1 = applySoftThreshold((a + b + f + g) * 0.25, threshold, softKnee, maxBrightness);
let box2 = applySoftThreshold((b + c + g + h) * 0.25, threshold, softKnee, maxBrightness);
let box3 = applySoftThreshold((f + g + k + l) * 0.25, threshold, softKnee, maxBrightness);
let box4 = applySoftThreshold((g + h + l + m) * 0.25, threshold, softKnee, maxBrightness);

// Partial Karis Average for Sub-pixel Specular Firefly Suppression
let w0 = karisWeight(box0) * 0.5;
let w1 = karisWeight(box1) * 0.125;
let w2 = karisWeight(box2) * 0.125;
let w3 = karisWeight(box3) * 0.125;
let w4 = karisWeight(box4) * 0.125;

let totalWeight = max(w0 + w1 + w2 + w3 + w4, 1e-5);
let outColor = (box0 * w0 + box1 * w1 + box2 * w2 + box3 * w3 + box4 * w4) / totalWeight;

textureStore(outputTexture, index, vec4<f32>(outColor, 1.0));
