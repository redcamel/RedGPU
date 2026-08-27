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
    let globalFragmentData = globalFragmentSSBO_PBR[inputData.globalFragmentSlotIndex];
    let cutOff = select(0.3333, globalFragmentData.cutOff, globalFragmentData.cutOff > 0.0);

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

    // 🌿 원거리 컷오프 극적 감쇄 (원거리 수목 밀도 극대화, 0.06 가드)
    let uvDeriv = length(vec2<f32>(dpdx(inputData.uv.x), dpdy(inputData.uv.y)));
    let decay = clamp(uvDeriv * 70.0, 0.0, 1.0);
    let adaptiveCutOff = mix(cutOff, 0.06, decay);

    if (texColor.a <= adaptiveCutOff) {
        discard;
    }

    return output;
}
