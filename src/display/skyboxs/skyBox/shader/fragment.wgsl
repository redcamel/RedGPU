
struct Uniforms {
    opacity : f32,
    useSkyboxTexture:u32
};
@group(2) @binding(0) var<uniform> uniforms : Uniforms;
@group(2) @binding(1) var skyboxTextureSampler: sampler;
@group(2) @binding(2) var skyboxTexture: texture_cube<f32>;

struct InputData {
    @location(0) vertexPosition : vec4<f32>,
};
@fragment
fn main(inputData:InputData) -> @location(0) vec4<f32> {
  var cubemapVec = inputData.vertexPosition.xyz - vec3<f32>(0.5);
  var sampleColor:vec4<f32> = textureSample(skyboxTexture,skyboxTextureSampler, cubemapVec);
  var outColor = vec4<f32>(sampleColor.rgb, sampleColor.a * uniforms.opacity);
  if(outColor.a == 0.0) {
    discard;
  }
  return outColor;
}
