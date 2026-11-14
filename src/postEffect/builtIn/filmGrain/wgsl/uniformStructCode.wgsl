#redgpu_include color.getLuminance

struct Uniforms {
    filmGrainIntensity: f32,
    filmGrainResponse: f32,
    filmGrainScale: f32,
    coloredGrain: f32,
    grainSaturation: f32,
    pad0: f32,
    pad1: f32,
    pad2: f32,
};

/**
 * [KO] 삼각함수(`sin`) 없이 32비트 정수 비트 연산만으로 3채널 독립 난수(0.0 ~ 1.0)를 생성하는 PCG3D 해시 함수입니다.
 * [EN] PCG3D hash function that generates 3-channel independent random numbers (0.0 ~ 1.0) using 32-bit integer bitwise operations without trigonometric functions (`sin`).
 */
fn pcg3dHash(p: vec3<u32>) -> vec3<f32> {
    var v = p * 1664525u + 1013904223u;
    v.x += v.y * v.z;
    v.y += v.z * v.x;
    v.z += v.x * v.y;
    v ^= v >> vec3<u32>(16u);
    v.x += v.y * v.z;
    v.y += v.z * v.x;
    v.z += v.x * v.y;
    return vec3<f32>(v) * (1.0 / 4294967295.0);
}

/**
 * [KO] 단일 격자점에서 삼각 분포(Triangular PDF, -1.0 ~ 1.0) 기반의 은염 그레인 샘플을 생성합니다.
 * [EN] Generates a silver-halide grain sample based on a triangular distribution (Triangular PDF, -1.0 ~ 1.0) at a single lattice point.
 */
fn sampleLatticeGrain(cell: vec2<u32>, frameSeed: u32, coloredGrain: f32) -> vec3<f32> {
    let h0 = pcg3dHash(vec3<u32>(cell, frameSeed));
    let h1 = pcg3dHash(vec3<u32>(cell ^ vec2<u32>(0x68bc21ebu, 0x02e5be93u), frameSeed + 1u));
    let triRgb = h0 - h1;
    return mix(vec3<f32>(triRgb.x), triRgb, coloredGrain);
}

/**
 * [KO] 분산 보존 에르미트(Variance-Preserving Hermite) 2D 연속 보간을 통해 격자 아티팩트 없는 유기적 필름 그레인을 생성합니다.
 * [EN] Generates organic film grain without grid artifacts via Variance-Preserving Hermite 2D continuous interpolation.
 *
 * @param pixelCoord - [KO] 물리 픽셀 좌표 [EN] Physical pixel coordinates
 * @param baseScale - [KO] 입자 스케일 [EN] Particle scale
 * @param frameIndex - [KO] 시간 변화를 위한 프레임 인덱스 [EN] Frame index for temporal variance
 * @param coloredGrain - [KO] 유색 그레인 강도 [EN] Colored grain intensity
 * @returns [KO] -1.0 ~ 1.0 범위의 그레인 벡터 [EN] Grain vector in range -1.0 ~ 1.0
 */
fn getFilmicGrain(pixelCoord: vec2<f32>, baseScale: f32, frameIndex: u32, coloredGrain: f32) -> vec3<f32> {
    let frameSeed = (frameIndex % 4096u) * 747796405u + 2891336453u;
    let scaledCoord = pixelCoord / baseScale;
    let i0 = floor(scaledCoord);
    let f = fract(scaledCoord);

    let c00 = vec2<u32>(vec2<i32>(i0) + vec2<i32>(32768));
    let c10 = c00 + vec2<u32>(1u, 0u);
    let c01 = c00 + vec2<u32>(0u, 1u);
    let c11 = c00 + vec2<u32>(1u, 1u);

    let g00 = sampleLatticeGrain(c00, frameSeed, coloredGrain);
    let g10 = sampleLatticeGrain(c10, frameSeed, coloredGrain);
    let g01 = sampleLatticeGrain(c01, frameSeed, coloredGrain);
    let g11 = sampleLatticeGrain(c11, frameSeed, coloredGrain);

    let w = f * f * (3.0 - 2.0 * f);
    let gx0 = mix(g00, g10, w.x);
    let gx1 = mix(g01, g11, w.x);
    let blended = mix(gx0, gx1, w.y);

    // [KO] 보간 시 격자 중간점(w=0.5)에서 분산이 감소하는 현상을 정확히 역보정하여 전 영역 균일 대비 유지
    // [EN] Exact inverse normalization of variance reduction at lattice midpoints (w=0.5) to maintain uniform contrast
    let varX = 1.0 - 2.0 * w.x * (1.0 - w.x);
    let varY = 1.0 - 2.0 * w.y * (1.0 - w.y);
    return blended * inverseSqrt(varX * varY);
}
