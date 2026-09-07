#redgpu_include SYSTEM_UNIFORM;
#redgpu_include systemStruct.OutputFragment;

@group(2) @binding(1) var baseColorTextureSampler: sampler;
@group(2) @binding(2) var baseColorTexture: texture_2d<f32>;

struct InputData {
    @builtin(position) position: vec4<f32>,
    @location(2) uv: vec2<f32>,
    @location(9) @interpolate(flat) globalFragmentSlotIndex: u32,
};


@fragment
fn main(inputData: InputData) -> OutputFragment {
    var output: OutputFragment;
    let ddxUV = dpdx(inputData.uv);
    let ddyUV = dpdy(inputData.uv);
    let alpha = textureSample(baseColorTexture, baseColorTextureSampler, inputData.uv).a;

    let globalFragmentData = globalFragmentSSBO_PBR[inputData.globalFragmentSlotIndex];
    let baseCutOff = select(0.3333, globalFragmentData.cutOff, globalFragmentData.cutOff > 0.0);

    if (alpha < baseCutOff) {
        let lenSq = max(dot(ddxUV, ddxUV), dot(ddyUV, ddyUV));
        let mipLevel = max(0.0, 0.5 * log2(max(lenSq * 1048576.0, 1.0)));
        let mipAlphaScale = 1.0 + mipLevel * 0.70;
        let effectiveAlpha = alpha * mipAlphaScale;
        if (effectiveAlpha <= baseCutOff) {
            discard;
        }
    }

    return output;
}
