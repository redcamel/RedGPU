#redgpu_include SYSTEM_UNIFORM

struct InputData {
    @builtin(position) position: vec4<f32>,
    @location(0) vertexPosition: vec3<f32>,
    @location(9) @interpolate(flat) globalFragmentSlotIndex: u32,
    @location(11) combinedOpacity: f32,
}

@fragment
fn main(inputData: InputData) -> @location(0) vec4<f32> {
    let globalFragmentData = globalFragmentSSBO_BuiltIn[inputData.globalFragmentSlotIndex];
    let finalColor = vec4<f32>(
        globalFragmentData.color.r,
        globalFragmentData.color.g,
        globalFragmentData.color.b,
        globalFragmentData.opacity * inputData.combinedOpacity
    );
    if (finalColor.a == 0.0) {
        discard;
    }
    return finalColor;
}
