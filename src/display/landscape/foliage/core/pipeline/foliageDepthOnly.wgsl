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
        let bayerMatrix = array<f32, 16>(
             0.0/16.0,  8.0/16.0,  2.0/16.0, 10.0/16.0,
            12.0/16.0,  4.0/16.0, 14.0/16.0,  6.0/16.0,
             3.0/16.0, 11.0/16.0,  1.0/16.0,  9.0/16.0,
            15.0/16.0,  7.0/16.0, 13.0/16.0,  5.0/16.0
        );
        let px = u32(inputData.position.x) % 4u;
        let py = u32(inputData.position.y) % 4u;
        let threshold = bayerMatrix[py * 4u + px];
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
