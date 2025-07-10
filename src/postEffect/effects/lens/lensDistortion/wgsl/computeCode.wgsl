let dimensions = textureDimensions(sourceTexture);
let dimW = f32(dimensions.x);
let dimH = f32(dimensions.y);

let center = vec2<f32>(dimW * 0.5 + uniforms.centerX, dimH * 0.5 + uniforms.centerY);
let global_id_vec = vec2<f32>(f32(global_id.x), f32(global_id.y));

let uv = global_id_vec / vec2<f32>(dimW, dimH);
let uvCenter = center / vec2<f32>(dimW, dimH);

let offset = uv - uvCenter;
let distance = length(offset);

let barrelFactor = 1.0 + uniforms.barrelStrength * distance * distance;
let pincushionFactor = 1.0 - uniforms.pincushionStrength * distance * distance;
let distortionFactor = barrelFactor * pincushionFactor;

let distortedUV = uvCenter + offset * distortionFactor;

if (distortedUV.x < 0.0 || distortedUV.x > 1.0 ||
    distortedUV.y < 0.0 || distortedUV.y > 1.0) {
    textureStore(outputTexture, vec2<i32>(global_id.xy), vec4<f32>(0.0, 0.0, 0.0, 1.0));
} else {
    let sampleCoord = vec2<i32>(
        i32(clamp(distortedUV.x * dimW, 0.0, dimW - 1.0)),
        i32(clamp(distortedUV.y * dimH, 0.0, dimH - 1.0))
    );

    let sampledColor = textureLoad(sourceTexture, sampleCoord).xyzw;
    textureStore(outputTexture, vec2<i32>(global_id.xy), sampledColor);
}
