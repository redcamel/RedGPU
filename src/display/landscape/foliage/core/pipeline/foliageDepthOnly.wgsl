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

    var cutOff = globalFragmentData.cutOff;
    if (cutOff <= 0.0) {
        cutOff = 0.5;
    }
    if (texColor.a <= cutOff) {
        discard;
    }

    let totalOpacity = inputData.combinedOpacity * globalFragmentData.opacity;
    if (totalOpacity < 0.999) {
        let bayer = array<f32, 16>(
             0.0 / 16.0, 12.0 / 16.0,  3.0 / 16.0, 15.0 / 16.0,
             8.0 / 16.0,  4.0 / 16.0, 11.0 / 16.0,  7.0 / 16.0,
             2.0 / 16.0, 14.0 / 16.0,  1.0 / 16.0, 13.0 / 16.0,
            10.0 / 16.0,  6.0 / 16.0,  9.0 / 16.0,  5.0 / 16.0
        );
        let ditherX = u32(inputData.position.x) % 4u;
        let ditherY = u32(inputData.position.y) % 4u;
        let threshold = bayer[ditherY * 4u + ditherX];
        if (totalOpacity < threshold) {
            discard;
        }
    }

    return output;
}
