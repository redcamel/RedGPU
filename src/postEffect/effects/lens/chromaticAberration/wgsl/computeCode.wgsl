let index = global_id.xy;
let dimensions = textureDimensions(sourceTexture);
let dimW = f32(dimensions.x);
let dimH = f32(dimensions.y);

let uv = vec2<f32>(index) / vec2<f32>(dimW, dimH);
let center = vec2<f32>(uniforms.centerX, uniforms.centerY);

let offset = uv - center;
let distance = length(offset);
let distortion = uniforms.strength * pow(distance, uniforms.falloff);

let redOffset = uv + offset * distortion * vec2<f32>(-1.0, -1.0);
let greenOffset = uv;
let blueOffset = uv + offset * distortion * vec2<f32>(1.0, 1.0);

var finalColor: vec3<f32>;
finalColor.r = textureSampleLevel(sourceTexture, basicSampler, redOffset, 0.0).r;
finalColor.g = textureSampleLevel(sourceTexture, basicSampler, greenOffset, 0.0).g;
finalColor.b = textureSampleLevel(sourceTexture, basicSampler, blueOffset, 0.0).b;

let originalAlpha = textureLoad(sourceTexture, index, 0).a;
textureStore(outputTexture, index, vec4<f32>(finalColor, originalAlpha));
