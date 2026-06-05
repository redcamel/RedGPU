let index = vec2<u32>(global_id.xy);
let dimensions = vec2<f32>(textureDimensions(sourceTexture));
if (f32(index.x) >= dimensions.x || f32(index.y) >= dimensions.y) { return; }

let invSize = 1.0 / dimensions;
let centerUV = (vec2<f32>(index) + 0.5) * invSize;
let blurSize = uniforms.size;

var sum: vec4<f32> = vec4<f32>(0.0);
var totalWeight: f32 = 0.0;

// [KO] 가우시안 블러 최적화 (선형 샘플링 활용)
// [EN] Optimized Gaussian Blur (Using linear sampling)
let steps = 10.0; 
for (var i = -steps; i <= steps; i += 1.0) {
    let offsetPixels = (i / steps) * blurSize;
    let weight = exp(-0.5 * pow(i / (steps * 0.6), 2.0)); // Gaussian curve
    
    let sampleUV = centerUV + vec2<f32>(0.0, offsetPixels * invSize.y);
    sum += textureSampleLevel(sourceTexture, basicSampler, sampleUV, 0.0) * weight;
    totalWeight += weight;
}

textureStore(outputTexture, index, sum / totalWeight);
