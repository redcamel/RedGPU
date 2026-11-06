#redgpu_include SYSTEM_UNIFORM;

@group(2) @binding(1) var diffuseTextureSampler: sampler;
@group(2) @binding(2) var diffuseTexture: texture_2d<f32>;

struct InputData {
    @builtin(position) position: vec4<f32>,
    @location(0) vertexPosition: vec3<f32>,
    @location(1) vertexNormal: vec3<f32>,
    @location(2) uv: vec2<f32>,
    @location(9) @interpolate(flat) globalFragmentSlotIndex: u32,
    @location(11) combinedOpacity: f32,
};

@fragment
fn main(inputData: InputData) -> @location(0) vec4<f32> {
    let globalFragmentData = globalFragmentSSBO_BuiltIn[inputData.globalFragmentSlotIndex];
    var finalColor: vec4<f32> = textureSample(diffuseTexture, diffuseTextureSampler, inputData.uv);
    finalColor = vec4<f32>(finalColor.rgb / finalColor.a, finalColor.a * globalFragmentData.opacity * inputData.combinedOpacity);
    if (finalColor.a == 0.0) {
        discard;
    }
    return finalColor;
}
