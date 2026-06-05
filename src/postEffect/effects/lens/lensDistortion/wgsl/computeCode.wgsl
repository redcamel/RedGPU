let index = global_id.xy;
let dimensions = textureDimensions(sourceTexture);
let dimW = f32(dimensions.x);
let dimH = f32(dimensions.y);

let uvCenter = vec2<f32>(uniforms.centerX, uniforms.centerY);
let center = uvCenter * vec2<f32>(dimW, dimH);
let uv = vec2<f32>(index) / vec2<f32>(dimW, dimH);

let offset = uv - uvCenter;
let distance = length(offset);

let distortionFactor = 1.0 + uniforms.distortion * distance * distance;
let distortedUV = uvCenter + offset * distortionFactor;

if (distortedUV.x < 0.0 || distortedUV.x > 1.0 ||
    distortedUV.y < 0.0 || distortedUV.y > 1.0) {
    textureStore(outputTexture, index, vec4<f32>(0.0, 0.0, 0.0, 1.0));
} else {
    let sampledColor = textureSampleLevel(sourceTexture, basicSampler, distortedUV, 0.0);
    textureStore(outputTexture, index, sampledColor);
}
