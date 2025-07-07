let dimensions = textureDimensions(sourceTexture);
let dimW = f32(dimensions.x);
let dimH = f32(dimensions.y);

let index = vec2<u32>(global_id.xy);
let uv = vec2<f32>(f32(index.x) / dimW, f32(index.y) / dimH);

let smoothness = uniforms.smoothness;
let size = uniforms.size;

var color : vec4<f32> = textureLoad(sourceTexture, index);
var diff = size - distance(uv, vec2<f32>(0.5));

let vignette = smoothstep(-smoothness, smoothness, diff);

color.r *= vignette;
color.g *= vignette;
color.b *= vignette;

textureStore(outputTexture, index, color);
