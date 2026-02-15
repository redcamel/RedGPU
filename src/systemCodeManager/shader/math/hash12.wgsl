// [KO] 2D 입력 좌표를 기반으로 1D 해시 값을 생성합니다.
// [EN] Generates a 1D hash value based on 2D input coordinates.
fn hash12(p: vec2<f32>) -> f32 {
    var p3 = fract(vec3<f32>(p.xyx) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
}
