#REDGPU_DEFINE_SYSTEM_UNIFORMS
struct MaterialUniforms {
    opacity : f32
};
@group(2) @binding(0) var<uniform> materialUniforms : MaterialUniforms;
@group(2) @binding(1) var _sampler: sampler;
@group(2) @binding(2) var _texture: texture_cube<f32>;

struct InputData {
    @location(0) vertexNormal : vec3<f32>,
    @location(1) uv : vec2<f32>,
    @location(2) vPosition : vec4<f32>,
};
@fragment
fn main(inputData:InputData) -> @location(0) vec4<f32> {
  var cubemapVec = inputData.vPosition.xyz - vec3<f32>(0.5, 0.5, 0.5);
  var outColor:vec4<f32> = textureSample(_texture,_sampler, cubemapVec);
  if(outColor.a == 0.0) {
    discard;
  }
  return outColor;
}