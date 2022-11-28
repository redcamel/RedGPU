@group(0) @binding(1) var _Sampler: sampler;
@group(0) @binding(2) var _Texture: texture_2d<f32>;
@fragment
fn main(@location(0) uv: vec2<f32>) -> @location(0) vec4<f32> {
  return textureSample(_Texture,_Sampler, uv);
}
