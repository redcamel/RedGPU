#redgpu_include drawPicking;
#redgpu_include calcTintBlendMode;
#redgpu_include FragmentOutput;
struct Uniforms {
    color:vec3<f32>,
    //
    opacity:f32,
    useTint:u32,
    tint:vec4<f32>,
    tintBlendMode:u32,
};
// Input structure for model data
struct InputData {
  // Built-in attributes
  @builtin(position) position : vec4<f32>,
  @location(3) combinedOpacity: f32,
  //
  @location(12) motionVector: vec3<f32>,
  @location(15) pickingId: vec4<f32>,
}

@group(2) @binding(0) var<uniform> uniforms: Uniforms;
@fragment
fn main(inputData: InputData) -> FragmentOutput {
    var output: FragmentOutput;
    var finalColor = vec4<f32>( uniforms.color.r , uniforms.color.g , uniforms.color.b , uniforms.opacity * inputData.combinedOpacity);
    #redgpu_if useTint
        finalColor = calcTintBlendMode(finalColor, uniforms.tintBlendMode, uniforms.tint);
    #redgpu_endIf
    output.color = finalColor;
    output.gBufferMotionVector = vec4<f32>( inputData.motionVector, 1.0 );
    return output;
}


