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
    let texColor = textureSample(baseColorTexture, baseColorTextureSampler, inputData.uv);
    let uvDeriv = length(vec2<f32>(dpdx(inputData.uv.x), dpdy(inputData.uv.y)));
    let baseCutOff = 0.35;
    let adaptiveCutOff = clamp(baseCutOff - uvDeriv * 15.0, 0.15, baseCutOff);

    if (texColor.a <= adaptiveCutOff) {
        discard;
    }

    return output;
}
