#REDGPU_DEFINE_SYSTEM_UNIFORMS
struct MaterialUniforms {
  color : vec4<f32>,
  alpha : f32,
};
@group(2) @binding(0) var<uniform> materialUniforms : MaterialUniforms;
@fragment
fn main() -> @location(0) vec4<f32> {
  return materialUniforms.color;
}