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

/**
 * [KO] 카메라 뷰 뎁스 프리패스 (Depth Prepass) 전용 프래그먼트 셰이더.
 * 화면에 직접 보이는 메인 뷰이므로 편미분(dpdx/dpdy)과 log2 기반 밉맵 알파 복원(Mip Alpha Rescaling) 및 거리 디더 페이드를 적용합니다.
 * [EN] Fragment shader dedicated to Camera View Depth Prepass.
 * Applies derivative (dpdx/dpdy) and log2-based Mip Alpha Rescaling and distance dither fading for primary visual fidelity.
 */
@fragment
fn main(inputData: InputData) -> OutputFragment {
    var output: OutputFragment;
    let ddxUV = dpdx(inputData.uv);
    let ddyUV = dpdy(inputData.uv);
    let texColor = textureSample(baseColorTexture, baseColorTextureSampler, inputData.uv);

    // 🚀 [최적화 P3 / Step 4 - 완전 투명 픽셀 즉시 탈출 (연산 0ms)]
    if (texColor.a <= 0.001) {
        discard;
    }

    // 🚀 [거리 페이드 디더링 조기 탈락]
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

    // 🚀 [최적화 P3 / Step 4 - 완전 불투명 픽셀 lenSq/log2 생략 바이패스]
    // texColor.a >= baseCutOff인 본체 픽셀(95% 이상)은 mipAlphaScale(>= 1.0)을 곱해도 무조건 통과하므로
    // 무거운 lenSq, log2 연산을 100% 생략! (경계선 5% 픽셀에서만 원경 보존 연산 가동)
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
