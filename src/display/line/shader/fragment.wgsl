#redgpu_include drawPicking;
#redgpu_include FragmentOutput;
struct Uniforms {
  	opacity:f32
};
struct InputData {
  @builtin(position) position : vec4<f32>,
  @location(0) vertexPosition: vec3<f32>,
  @location(1) vertexColor: vec4<f32>,
  @location(15) @interpolate(flat) pickingId: vec4<f32>,
}

@group(2) @binding(0) var<uniform> uniforms: Uniforms;
@fragment
fn main(inputData:InputData) -> FragmentOutput {
    var output:FragmentOutput;
    output.color = inputData.vertexColor;
    output.gBufferMotionVector = vec4<f32>( 0.0, 0.0, 1.0, 1.0 );
    return output;
}


