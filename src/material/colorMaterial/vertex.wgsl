#REDGPU_DEFINE_SYSTEM_UNIFORMS
#REDGPU_DEFINE_MODEL_UNIFORMS_STRUCT

// define Struct InputData
struct InputData {
    @location(0) position : vec3<f32>
};
// define Struct OutData
struct OutData {
  @builtin(position) position : vec4<f32>,
};



@vertex
fn main(inputData:InputData) -> OutData {
  var outData : OutData;
  outData.position = systemUniforms.projectionMatrix * systemUniforms.cameraMatrix * modelUniforms.modelMatrix * vec4<f32>(inputData.position, 1.0);
  return outData;
}
