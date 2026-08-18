#redgpu_include SYSTEM_UNIFORM;
#redgpu_include systemStruct.OutputFragment;

@group(2) @binding(1) var baseColorTextureSampler: sampler;
@group(2) @binding(2) var baseColorTexture: texture_2d<f32>;

struct InputData {
    @builtin(position) position: vec4<f32>,
    @location(0) vertexPosition: vec3<f32>,
    @location(1) vertexNormal: vec3<f32>,
    @location(2) uv: vec2<f32>,
    @location(3) uv1: vec2<f32>,
    @location(4) vertexColor_0: vec4<f32>,
    @location(5) vertexTangent: vec4<f32>,

    @location(7) currentClipPos: vec4<f32>,
    @location(8) prevClipPos: vec4<f32>,

    @location(9) @interpolate(flat) globalFragmentSlotIndex: u32,
    @location(10) localNodeScale_volumeScale: vec2<f32>,
    @location(11) combinedOpacity: f32,

    @location(12) motionVector: vec3<f32>,
    @location(13) shadowCoord: vec3<f32>,
    @location(14) @interpolate(flat) receiveShadow: f32,
    @location(15) @interpolate(flat) pickingId: vec4<f32>,
};

@fragment
fn main(inputData: InputData) -> OutputFragment {
    var output: OutputFragment;
    let globalFragmentData = globalFragmentSSBO_PBR[inputData.globalFragmentSlotIndex];

    let texColor = textureSample(baseColorTexture, baseColorTextureSampler, inputData.uv);

    // 🌟 MASK: Alpha Cutoff (cutOff 미만 폐기)
    var cutOff = globalFragmentData.cutOff;
    if (cutOff <= 0.0) {
        cutOff = 0.5;
    }
    if (texColor.a < cutOff) {
        discard;
    }

    // 🌟 언리얼 엔진 5 스타일 4x4 Bayer Matrix LOD Dithered Crossfade
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

    // writeMask: 0이므로 실제 컬러 메모리에는 쓰여지지 않음 (순수 깊이 버퍼 선점용)
    return output;
}
