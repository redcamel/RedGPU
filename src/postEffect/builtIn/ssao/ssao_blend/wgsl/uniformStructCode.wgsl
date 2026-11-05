struct Uniforms {
    useMultiBounce: u32,
    pad0: u32,
    pad1: u32,
    pad2: u32,
}

/**
 * [KO] Jimenez의 GTAO Multi-Bounce(다중 반사 색번짐 근사) 다항식을 계산합니다.
 * [EN] Computes Jimenez's GTAO Multi-Bounce polynomial approximation.
 */
fn gtaoMultiBounce(visibility: f32, albedo: vec3<f32>) -> vec3<f32> {
    let a =  2.0404 * albedo - 0.3324;
    let b = -4.7951 * albedo + 0.6417;
    let c =  2.7552 * albedo + 0.6903;
    return max(vec3<f32>(visibility), ((visibility * a + b) * visibility + c) * visibility);
}
