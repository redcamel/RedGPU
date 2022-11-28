#REDGPU_DEFINE_SYSTEM_UNIFORMS
#REDGPU_DEFINE_MODEL_UNIFORMS_STRUCT
struct InputData {
    @location(0) position : vec3<f32>,
    @location(1) vertexColor : vec4<f32>,
};
struct OutData {
  @builtin(position) position : vec4<f32>,
  @location(0) vVertexColor: vec4<f32>,
};

@vertex
fn main(inputData : InputData) -> OutData {
    var outData : OutData;
    outData.position = systemUniforms.projectionMatrix * systemUniforms.cameraMatrix * modelUniforms.modelMatrix * vec4<f32>(inputData.position, 1.0);
    outData.vVertexColor = inputData.vertexColor;
    return outData;
}
