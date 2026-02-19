/**
 * [Stage: Common (Vertex, Fragment, Compute)]
 * [KO] 단일 스칼라 값이 유한(Finite)한지 체크합니다. (NaN과 Inf 체크)
 * [EN] Checks if a single scalar value is finite. (Checks for NaN and Inf)
 *
 * @param x - [KO] 입력 스칼라 값 [EN] Input scalar value
 * @returns [KO] 유한 여부 [EN] Whether it is finite
 */
fn getIsFiniteScalar(x: f32) -> bool {
    // NaN은 자기 자신과 같지 않고, Inf는 매우 큰 값
    return x == x && abs(x) < 1e30;
}

/**
 * [Stage: Common (Vertex, Fragment, Compute)]
 * [KO] vec3 벡터의 모든 채널이 유한(Finite)한지 체크합니다.
 * [EN] Checks if all channels of a vec3 vector are finite.
 *
 * @param v - [KO] 입력 vec3 벡터 [EN] Input vec3 vector
 * @returns [KO] 채널별 유한 여부 (vec3<bool>) [EN] Whether each channel is finite (vec3<bool>)
 */
fn getIsFiniteVec3(v: vec3<f32>) -> vec3<bool> {
    return vec3<bool>(
        v.x == v.x && abs(v.x) < 1e30,
        v.y == v.y && abs(v.y) < 1e30,
        v.z == v.z && abs(v.z) < 1e30
    );
}
