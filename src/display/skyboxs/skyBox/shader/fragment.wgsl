
struct Uniforms {
    opacity : f32,
    useSkyboxTexture:u32,
    blur:f32,
    transitionDuration:f32,
    transitionElapsed:f32,
};
@group(2) @binding(0) var<uniform> uniforms : Uniforms;
@group(2) @binding(1) var skyboxTextureSampler: sampler;
@group(2) @binding(2) var skyboxTexture: texture_cube<f32>;
@group(2) @binding(3) var transitionTexture: texture_cube<f32>;

struct InputData {
    @location(0) vertexPosition : vec4<f32>,
};
@fragment
fn main(inputData:InputData) -> @location(0) vec4<f32> {
  var cubemapVec = inputData.vertexPosition.xyz - vec3<f32>(0.5);
  let mipmapCount:f32 = f32(textureNumLevels(skyboxTexture) - 1);
  let blurCurve = uniforms.blur * uniforms.blur; // 제곱 곡선
  var sampleColor:vec4<f32>;
  if(uniforms.transitionDuration > uniforms.transitionElapsed){
    let transitionRatio = clamp(uniforms.transitionElapsed / uniforms.transitionDuration, 0.0, 1.0);
    sampleColor = mix(
         textureSampleLevel(skyboxTexture,skyboxTextureSampler, cubemapVec, mipmapCount * blurCurve),
         textureSampleLevel(transitionTexture,skyboxTextureSampler, cubemapVec, mipmapCount * blurCurve),
         transitionRatio
     );
  }else {
     sampleColor = textureSampleLevel(skyboxTexture,skyboxTextureSampler, cubemapVec, mipmapCount * blurCurve);
  }

  var outColor = vec4<f32>(sampleColor.rgb, sampleColor.a * uniforms.opacity);
  if(outColor.a == 0.0) {
    discard;
  }
  return outColor;
}
