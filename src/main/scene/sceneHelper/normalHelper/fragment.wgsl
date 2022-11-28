#REDGPU_DEFINE_SYSTEM_UNIFORMS
struct InputData {
    @location(0) vVertexColor : vec4<f32>,
};
@fragment
fn main(inputData:InputData) -> @location(0) vec4<f32> {
  return inputData.vVertexColor;
}