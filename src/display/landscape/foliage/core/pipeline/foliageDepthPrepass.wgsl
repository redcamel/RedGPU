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
    let ddxUV = dpdx(inputData.uv);
    let ddyUV = dpdy(inputData.uv);
    let texColor = textureSample(baseColorTexture, baseColorTextureSampler, inputData.uv);

    
    if (texColor.a <= 0.001) {
        discard;
    }

    
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

    let globalFragmentData = globalFragmentSSBO_PBR[inputData.globalFragmentSlotIndex];
    let baseCutOff = select(0.3333, globalFragmentData.cutOff, globalFragmentData.cutOff > 0.0);

    
    
    
    if (texColor.a < baseCutOff) {
        let lenSq = max(dot(ddxUV, ddxUV), dot(ddyUV, ddyUV));
        let mipLevel = max(0.0, 0.5 * log2(max(lenSq * 1048576.0, 1.0)));
        let mipAlphaScale = 1.0 + mipLevel * 0.70;
        let effectiveAlpha = texColor.a * mipAlphaScale;
        if (effectiveAlpha <= baseCutOff) {
            discard;
        }
    }

    return output;
}
