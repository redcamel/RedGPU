#redgpu_include drawPicking;
#redgpu_include calcTintBlendMode;
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
  @location(12) combinedOpacity: f32,
  @location(15) pickingId: vec4<f32>,
}

@group(2) @binding(0) var<uniform> uniforms: Uniforms;
@fragment
fn main(inputData: InputData) -> @location(0) vec4<f32> {
    var finalColor = vec4<f32>( uniforms.color.r , uniforms.color.g , uniforms.color.b , uniforms.opacity * inputData.combinedOpacity);
    if(uniforms.useTint == 1u){
        finalColor = calcTintBlendMode(finalColor, uniforms.tintBlendMode, uniforms.tint);
    }
    return finalColor;
}


