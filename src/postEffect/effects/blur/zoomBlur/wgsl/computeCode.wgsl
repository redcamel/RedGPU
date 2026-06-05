let index = vec2<u32>(global_id.xy);
let dimensions = vec2<f32>(textureDimensions(sourceTexture));
if (f32(index.x) >= dimensions.x || f32(index.y) >= dimensions.y) { return; }

let invSize = 1.0 / dimensions;
let centerUV = (vec2<f32>(index) + 0.5) * invSize;
let center = vec2<f32>(0.5) + vec2<f32>(uniforms.centerX, uniforms.centerY) * 0.5;

let dir = (center - centerUV) * (uniforms.amount * 0.01);

var sum = vec4<f32>(0.0);
var totalWeight = 0.0;
const steps = 30.0;

for (var i = -steps; i <= steps; i += 1.0) {
    let t = i / steps;
    let weight = 1.0 - abs(t);
    let sampleUV = centerUV + dir * t;
    sum += textureSampleLevel(sourceTexture, basicSampler, sampleUV, 0.0) * weight;
    totalWeight += weight;
}

textureStore(outputTexture, index, sum / totalWeight);
