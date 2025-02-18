#redgpu_include drawPicking;
struct Uniforms {
  	opacity:f32
};
// Input structure for model data
struct InputData {
  // Built-in attributes
  @builtin(position) position : vec4<f32>,
  @location(0) vertexPosition: vec3<f32>,
  @location(1) vertexColor: vec4<f32>,
  @location(15) pickingId: vec4<f32>,
}

@group(2) @binding(0) var<uniform> uniforms: Uniforms;
@fragment
fn main(inputData:InputData) -> @location(0) vec4<f32> {
    return inputData.vertexColor;
}


