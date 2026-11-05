let index = vec2<u32>(global_id.xy);
let dimensions = vec2<f32>(textureDimensions(sourceTexture));

let invSize = 1.0 / dimensions;
let centerUV = (vec2<f32>(index) + 0.5) * invSize;

let direction = vec2<f32>(uniforms.directionX, uniforms.directionY);
// [KO] DPR을 반영하여 물리적 해상도에 맞는 블러 거리 계산
// [EN] Scale blur amount by DPR to match physical resolution
let dir = direction * (uniforms.amount * systemUniforms.devicePixelRatio) * invSize;

var sum = vec4<f32>(0.0);
var totalWeight = 0.0;
let steps = uniforms.sampleCount;

for (var i = -steps; i <= steps; i += 1.0) {
    let t = i / steps;
    let t2 = t * 2.0;
    let weight = exp(-0.5 * (t2 * t2));
    let sampleUV = centerUV + dir * t;
    sum += textureSampleLevel(sourceTexture, basicSampler, sampleUV, 0.0) * weight;
    totalWeight += weight;
}

textureStore(outputTexture, index, sum / totalWeight);
