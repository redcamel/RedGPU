let index = vec2<u32>(global_id.xy);
let dimensions = vec2<f32>(textureDimensions(sourceTexture));
if (f32(index.x) >= dimensions.x || f32(index.y) >= dimensions.y) { return; }

let invSize = 1.0 / dimensions;
let centerUV = (vec2<f32>(index) + 0.5) * invSize;

let direction = vec2<f32>(uniforms.directionX, uniforms.directionY);
let dirLength = length(direction);
let normalizedDir = select(vec2<f32>(0.0), direction / dirLength, dirLength > 0.0);
// [KO] DPR을 반영하여 물리적 해상도에 맞는 블러 거리 계산
// [EN] Scale blur amount by DPR to match physical resolution
let dir = normalizedDir * (uniforms.amount * systemUniforms.devicePixelRatio) * invSize;

var sum = vec4<f32>(0.0);
var totalWeight = 0.0;
let steps = uniforms.sampleCount;

for (var i = -steps; i <= steps; i += 1.0) {
    let t = i / steps;
    let weight = exp(-0.5 * pow(t * 2.0, 2.0));
    let sampleUV = centerUV + dir * t;
    sum += textureSampleLevel(sourceTexture, basicSampler, sampleUV, 0.0) * weight;
    totalWeight += weight;
}

textureStore(outputTexture, index, sum / totalWeight);
