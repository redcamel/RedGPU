let index = vec2<u32>(global_id.xy);
let dimensions = vec2<f32>(textureDimensions(sourceTexture));
if (f32(index.x) >= dimensions.x || f32(index.y) >= dimensions.y) { return; }

let invSize = 1.0 / dimensions;
let centerUV = (vec2<f32>(index) + 0.5) * invSize;
let center = vec2<f32>(0.5) + vec2<f32>(uniforms.centerX, uniforms.centerY) * 0.5;

let toPixel = centerUV - center;
let distance = length(toPixel);
let angle = atan2(toPixel.y, toPixel.x);

let rotationAngle = uniforms.amount * distance * 0.005;
let sampleCount = i32(uniforms.sampleCount);

var sum = vec4<f32>(0.0);
var totalWeight = 0.0;

for (var i = 0; i < sampleCount; i = i + 1) {
    let t = f32(i) / f32(sampleCount - 1);
    let sampleAngle = angle + (t - 0.5) * rotationAngle;

    let sampleUV = center + vec2<f32>(
        cos(sampleAngle) * distance,
        sin(sampleAngle) * distance
    );

    let weight = 1.0 - abs(t - 0.5) * 1.5;
    sum += textureSampleLevel(sourceTexture, basicSampler, sampleUV, 0.0) * max(weight, 0.1);
    totalWeight += weight;
}

let centerFalloff = smoothstep(0.0, 0.1, distance);
let originalColor = textureSampleLevel(sourceTexture, basicSampler, centerUV, 0.0);
let blurredColor = sum / totalWeight;

textureStore(outputTexture, index, mix(originalColor, blurredColor, centerFalloff));
