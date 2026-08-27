#redgpu_include SYSTEM_UNIFORM;
#redgpu_include systemStruct.OutputFragment;

@group(2) @binding(1) var baseColorTextureSampler: sampler;
@group(2) @binding(2) var baseColorTexture: texture_2d<f32>;

struct InputData {
    @builtin(position) position: vec4<f32>,
    @location(0) uv: vec2<f32>,
    @location(1) @interpolate(flat) globalFragmentSlotIndex: u32,
    @location(2) combinedOpacity: f32,
};

@fragment
fn main(inputData: InputData) -> OutputFragment {
    var output: OutputFragment;
    let foliageUvDeriv = length(vec2<f32>(dpdx(inputData.uv.x), dpdy(inputData.uv.y))) * 80.0;
    let globalFragmentData = globalFragmentSSBO_PBR[inputData.globalFragmentSlotIndex];

    let texColor = textureSample(baseColorTexture, baseColorTextureSampler, inputData.uv);

    var cutOff = 0.3333;
    if (texColor.a <= cutOff) {
        discard;
    }

    return output;
}
