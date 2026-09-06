#redgpu_include color.getLuminance

struct Uniforms {
    sharpness: f32
};

// 🚀 [무손실 LDS 공유 메모리 선언: 8x8 워크그룹 + 1픽셀 외곽 패딩 = 10x10 타일 (총 1.6 KB 온칩 SRAM)]
var<workgroup> s_sharpenColor: array<array<vec4<f32>, 10>, 10>;
