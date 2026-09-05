@group(2) @binding(1) var baseColorTextureSampler: sampler;
@group(2) @binding(2) var baseColorTexture: texture_2d<f32>;

struct InputData {
    @builtin(position) position: vec4<f32>,
    @location(2) uv: vec2<f32>,
};

/**
 * [KO] 광원 섀도우 맵 (Shadow Depth Pass) 전용 프래그먼트 셰이더.
 * 밉맵 축소(Thinning) 방지를 위해 Mip 0 레벨을 직격 샘플링하며, dpdx/dpdy 및 log2 초월함수 0개로 초고속 잎사귀 실루엣을 깊이 맵에 기록합니다.
 * [EN] Fragment shader dedicated to Light Source Shadow Depth Pass.
 * Direct samples Mip 0 level to prevent mipmap thinning, recording leaf silhouettes into depth map at ultra-high speed with zero transcendent functions.
 */
@fragment
fn shadowMain(inputData: InputData) {
    let texColor = textureSampleLevel(baseColorTexture, baseColorTextureSampler, inputData.uv, 0.0);

    if (texColor.a <= 0.25) {
        discard;
    }
}
