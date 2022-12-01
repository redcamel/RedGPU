@group(0) @binding(0) var _Sampler: sampler;
@group(0) @binding(1) var _Texture: texture_2d<f32>;
@fragment
fn main(@location(0) uv: vec2<f32>) -> @location(0) vec4<f32> {
  let diffuseColor:vec4<f32> = textureSample(_Texture,_Sampler, uv);
  let gray:f32 = (diffuseColor.r  + diffuseColor.g + diffuseColor.b)/3.0;
  return vec4<f32>(gray,gray,gray, diffuseColor.a);
}
