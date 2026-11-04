#redgpu_include math.getInterleavedGradientNoise
#redgpu_include math.PI
#redgpu_include math.PI2
#redgpu_include math.reconstruct.getViewNormalFromGNormalBuffer

const GTAO_HALF_PI: f32 = PI * 0.5;

struct Uniforms {
    radius: f32,
    intensity: f32,
    bias: f32,
    biasDistanceScale: f32,
    fadeDistanceStart: f32,
    fadeDistanceRange: f32,
    contrast: f32,
    pad0: f32, // 16-byte tail alignment
}

/**
 * [KO] 역투영 행렬의 Z/W 성분을 이용해 4x4 행렬 곱 없이 양수 선형 깊이(-viewPos.z)를 복원합니다.
 * [EN] Reconstructs positive linear depth (-viewPos.z) without 4x4 matrix multiplication using Z/W components of inverseProjectionMatrix.
 */
fn depthToLinearZ(depth: f32, zParams: vec4<f32>) -> f32 {
    let z = zParams.x * depth + zParams.y;
    let w = zParams.z * depth + zParams.w;
    return -z / w;
}

/**
 * [KO] 화면 UV와 선형 깊이로부터 4x4 행렬 곱 없이 뷰 공간 3D 좌표를 복원합니다 (TAA 지터 완벽 지원).
 * [EN] Reconstructs 3D view-space position from screen UV and linear depth without 4x4 matrix multiplication (full TAA jitter support).
 */
fn reconstructViewPos(uv: vec2<f32>, linearZ: f32, invFocalLen: vec2<f32>, invJitter: vec2<f32>) -> vec3<f32> {
    let ndc = vec2<f32>(uv.x * 2.0 - 1.0, (1.0 - uv.y) * 2.0 - 1.0);
    return vec3<f32>((ndc * invFocalLen + invJitter) * linearZ, -linearZ);
}

/**
 * [KO] 3D 단위 법선 벡터를 2채널([-1, 1]^2) 옥타헤드럴 좌표로 압축합니다.
 * [EN] Encodes a 3D unit normal vector into 2-channel ([-1, 1]^2) octahedral coordinates.
 */
fn octEncode(n: vec3<f32>) -> vec2<f32> {
    let invL1 = 1.0 / (abs(n.x) + abs(n.y) + abs(n.z));
    let p = n.xy * invL1;
    let wrapped = (1.0 - abs(p.yx)) * select(vec2<f32>(-1.0), vec2<f32>(1.0), p >= vec2<f32>(0.0));
    return select(p, wrapped, n.z < 0.0);
}

/**
 * [KO] GTAO 슬라이스 평면상의 양방향 지평선 각도(h1, h2)와 투영 법선 각도(n)에 대한 해석적 코사인 가중 적분을 계산합니다.
 * [EN] Computes the analytic cosine-weighted integral for bidirectional horizon angles (h1, h2) and projected normal angle (n) on the GTAO slice plane.
 */
fn integrateArcCosWeight(h1: f32, h2: f32, n: f32, cosN: f32, sinN: f32) -> f32 {
    let term1 = -cos(2.0 * h1 - n) + cosN + 2.0 * h1 * sinN;
    let term2 = -cos(2.0 * h2 - n) + cosN + 2.0 * h2 * sinN;
    return 0.25 * (term1 + term2);
}
