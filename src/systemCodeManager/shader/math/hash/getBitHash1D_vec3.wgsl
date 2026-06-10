/**
 * [KO] 3D 벡터의 비트 구조를 보존하여 1D 난수(0.0 ~ 1.0)를 생성합니다. (초정밀)
 * [EN] Generates a 1D random number (0.0 ~ 1.0) by preserving the bit structure of a 3D vector. (Ultra-precise)
 *
 * @param v [KO] 입력 3D 벡터 [EN] Input 3D vector
 * @returns [KO] 생성된 난수 [EN] Generated random number
 */
fn getBitHash1D_vec3(v: vec3<f32>) -> f32 {
    var q = bitcast<vec3<u32>>(v);
    // [KO] 소수 곱셈을 이용한 정밀 비트 혼합
    var x = (q.x * 73856093u) ^ (q.y * 19349663u) ^ (q.z * 83492791u);
    x = ((x >> 16u) ^ x) * 0x45d9f3bu;
    x = ((x >> 16u) ^ x) * 0x45d9f3bu;
    x = (x >> 16u) ^ x;
    return f32(x) / 4294967296.0;
}
