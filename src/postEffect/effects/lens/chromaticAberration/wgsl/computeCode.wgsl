let dimensions = textureDimensions(sourceTexture);
let dimW = f32(dimensions.x);
let dimH = f32(dimensions.y);

let uv = vec2<f32>(f32(global_id.x), f32(global_id.y)) / vec2<f32>(dimW, dimH);
let center = vec2<f32>(uniforms.centerX, uniforms.centerY);

let offset = uv - center;
let distance = length(offset);
let distortion = uniforms.strength * pow(distance, uniforms.falloff);

let redOffset = uv + offset * distortion * vec2<f32>(-1.0, -1.0);
let greenOffset = uv;
let blueOffset = uv + offset * distortion * vec2<f32>(1.0, 1.0);

var finalColor = vec3<f32>(0.0);

if (redOffset.x >= 0.0 && redOffset.x <= 1.0 &&
    redOffset.y >= 0.0 && redOffset.y <= 1.0) {
    let redCoord = vec2<i32>(
        i32(clamp(redOffset.x * dimW, 0.0, dimW - 1.0)),
        i32(clamp(redOffset.y * dimH, 0.0, dimH - 1.0))
    );
    finalColor.r = textureLoad(sourceTexture, redCoord).r;
}

let greenCoord = vec2<i32>(
    i32(clamp(greenOffset.x * dimW, 0.0, dimW - 1.0)),
    i32(clamp(greenOffset.y * dimH, 0.0, dimH - 1.0))
);
finalColor.g = textureLoad(sourceTexture, greenCoord).g;

if (blueOffset.x >= 0.0 && blueOffset.x <= 1.0 &&
    blueOffset.y >= 0.0 && blueOffset.y <= 1.0) {
    let blueCoord = vec2<i32>(
        i32(clamp(blueOffset.x * dimW, 0.0, dimW - 1.0)),
        i32(clamp(blueOffset.y * dimH, 0.0, dimH - 1.0))
    );
    finalColor.b = textureLoad(sourceTexture, blueCoord).b;
}

let originalAlpha = textureLoad(sourceTexture, vec2<i32>(global_id.xy)).a;
textureStore(outputTexture, vec2<i32>(global_id.xy), vec4<f32>(finalColor, originalAlpha));
