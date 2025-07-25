let dimensions = textureDimensions(sourceTexture);
let dimW = f32(dimensions.x);
let dimH = f32(dimensions.y);

let center = vec2<f32>(dimW * 0.5 + uniforms.centerX, dimH * 0.5 + uniforms.centerY);
let global_id_vec = vec2<f32>(f32(global_id.x), f32(global_id.y));

let toPixel = global_id_vec - center;
let distance = length(toPixel);
let angle = atan2(toPixel.y, toPixel.x);

let maxDist = min(dimW, dimH) * 0.5;
let normalizedDistance = distance / maxDist;
let rotationAngle = uniforms.amount * normalizedDistance * 0.001;

let sampleCount = i32(uniforms.sampleCount);
var sum = vec4<f32>(0.0, 0.0, 0.0, 0.0);
var totalWeight = 0.0;

for (var i = 0; i < sampleCount; i = i + 1) {
    let t = f32(i) / f32(sampleCount - 1);
    let sampleAngle = angle + (t - 0.5) * rotationAngle;

    let samplePos = center + vec2<f32>(
        cos(sampleAngle) * distance,
        sin(sampleAngle) * distance
    );

    var weight = 1.0 - abs(t - 0.5) * 1.5;
    weight = max(weight, 0.1);

    let sampleCoord = vec2<i32>(
        i32(clamp(samplePos.x, 0.0, dimW - 1.0)),
        i32(clamp(samplePos.y, 0.0, dimH - 1.0))
    );

    sum += textureLoad(sourceTexture, sampleCoord).xyzw * weight;
    totalWeight += weight;
}

let centerFalloff = smoothstep(0.0, maxDist * 0.2, distance);
let originalColor = textureLoad(sourceTexture, vec2<i32>(global_id.xy)).xyzw;
let blurredColor = sum / totalWeight;

let finalColor = mix(originalColor, blurredColor, centerFalloff);
textureStore(outputTexture, vec2<i32>(global_id.xy), finalColor);
