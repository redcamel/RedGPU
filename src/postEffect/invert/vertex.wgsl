// define Struct
struct Uniforms {
  resolution : vec2<f32>,
};
// define Struct OutData
struct OutData {
  @builtin(position) position : vec4<f32>,
  @location(0) uv: vec2<f32>,
};
// define Struct InputData
struct InputData {
    @location(0) position : vec3<f32>,
    @location(1) uv : vec2<f32>,
};
// define Uniform binding
@binding(0) @group(0) var<uniform> uniforms : Uniforms;
@vertex

fn main(inputData : InputData) -> OutData {
  var outData : OutData;
  outData.position = vec4<f32>(inputData.position,1.0);
  outData.uv = inputData.uv;
  return outData;
}
