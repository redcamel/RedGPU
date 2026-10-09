/**
 * [KO] 잔디 인스턴스 정점 변환 모듈
 * [EN] Grass instance vertex transformation module
 */

#redgpu_include landscape.math.rotateVectorByQuat;

struct GrassPositionResult {
    worldPos: vec3<f32>,
    heightRatio: f32,
};

/**
 * [KO] 잔디 로컬 정점 좌표를 스케일링, 쿼터니언 회전 및 지면 침하 보정하여 월드 좌표로 변환합니다.
 * [EN] Transforms local grass vertex to world coordinates with scaling, quaternion rotation, and ground sink compensation.
 */
fn transformGrassPosition(
    position: vec3<f32>,
    instPos: vec3<f32>,
    scaleXZ: f32,
    scaleY: f32,
    q: vec4<f32>,
    minY: f32,
    invMeshHeight: f32
) -> GrassPositionResult {
    let heightRatio = clamp((position.y - minY) * invMeshHeight, 0.0, 1.0);

    let scaledPos = vec3<f32>(
        position.x * scaleXZ,
        (position.y - minY) * scaleY,
        position.z * scaleXZ
    );

    var localPos = rotateVectorByQuat(scaledPos, q);

    let sinkDepth = max(0.0, -localPos.y);
    localPos.y += sinkDepth * (1.0 - heightRatio * 0.7);

    var res: GrassPositionResult;
    res.worldPos = localPos + instPos;
    res.heightRatio = heightRatio;
    return res;
}

