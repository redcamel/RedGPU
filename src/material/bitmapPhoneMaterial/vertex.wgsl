#REDGPU_DEFINE_VERTEX_BASE
#REDGPU_DEFINE_MODEL_UNIFORMS_STRUCT

// define Struct InputData
struct InputData {
    @location(0) position : vec3<f32>,
    @location(1) vertexNormal : vec3<f32>,
    @location(2) uv : vec2<f32>,
};
// define Struct OutData
struct OutData {
  @builtin(position) position : vec4<f32>,
  @location(0) vertexPosition: vec3<f32>,
  @location(1) vertexNormal: vec3<f32>,
  @location(2) uv: vec2<f32>,
};
@vertex
fn main(inputData:InputData) -> OutData {
  var outData : OutData;
  var position:vec4<f32> = modelUniforms.modelMatrix * vec4<f32>(inputData.position, 1.0);
  outData.position = systemUniforms.projectionMatrix * systemUniforms.cameraMatrix * position;
  outData.vertexPosition = position.xyz;
  outData.vertexNormal = (modelUniforms.normalMatrix * vec4<f32>(inputData.vertexNormal, 1.0)).xyz;
  outData.uv = inputData.uv;
  return outData;
}
