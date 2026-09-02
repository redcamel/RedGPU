#redgpu_include SYSTEM_UNIFORM;
#redgpu_include systemStruct.OutputFragment;

@group(2) @binding(1) var baseColorTextureSampler: sampler;
@group(2) @binding(2) var baseColorTexture: texture_2d<f32>;

struct InputData {
    @builtin(position) position: vec4<f32>,
    @location(2) uv: vec2<f32>,
    @location(9) @interpolate(flat) globalFragmentSlotIndex: u32,
    @location(11) combinedOpacity: f32,
};

@fragment
fn main(inputData: InputData) -> OutputFragment {
    var output: OutputFragment;
    let texColor = textureSample(baseColorTexture, baseColorTextureSampler, inputData.uv);
    let globalFragmentData = globalFragmentSSBO_PBR[inputData.globalFragmentSlotIndex];

    let fadeOpacity = inputData.combinedOpacity;
    if (fadeOpacity < 0.999) {
        let px = u32(inputData.position.x) & 3u;
        let py = u32(inputData.position.y) & 3u;
        let idx = (py << 2u) | px;
        let packed = select(0x6E4C2A80u, 0x5D7F91B3u, idx >= 8u);
        let threshold = f32((packed >> ((idx & 7u) * 4u)) & 0xFu) * 0.0625;
        if (fadeOpacity < threshold) {
            discard;
        }
    }

    // 🌿 UE5 Foliage Mipmap Alpha Boost (원거리 밉맵 희석 보정으로 잎사귀 완벽 보존)
    let ddxUV = dpdx(inputData.uv);
    let ddyUV = dpdy(inputData.uv);
    let maxDeriv = max(length(ddxUV), length(ddyUV));
    let mipLevel = max(0.0, log2(max(maxDeriv * 1024.0, 1.0)));
    let mipAlphaScale = 1.0 + mipLevel * 0.70;
    let baseCutOff = select(0.3333, globalFragmentData.cutOff, globalFragmentData.cutOff > 0.0);
    let effectiveAlpha = texColor.a * mipAlphaScale;
    if (effectiveAlpha <= baseCutOff) {
        discard;
    }

    return output;
}

@fragment
fn shadowMain(inputData: InputData) {
    let texColor = textureSample(baseColorTexture, baseColorTextureSampler, inputData.uv);
    let globalFragmentData = globalFragmentSSBO_PBR[inputData.globalFragmentSlotIndex];

    let ddxUV = dpdx(inputData.uv);
    let ddyUV = dpdy(inputData.uv);
    let maxDeriv = max(length(ddxUV), length(ddyUV));
    let mipLevel = max(0.0, log2(max(maxDeriv * 1024.0, 1.0)));
    let mipAlphaScale = 1.0 + mipLevel * 0.70;
    let baseCutOff = select(0.3333, globalFragmentData.cutOff, globalFragmentData.cutOff > 0.0);
    let effectiveAlpha = texColor.a * mipAlphaScale;
    if (effectiveAlpha <= baseCutOff) {
        discard;
    }
}
