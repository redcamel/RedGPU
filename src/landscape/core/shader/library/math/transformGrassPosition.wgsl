/**
 * [KO] 잔디 인스턴스 정점 변환 및 거리 페이드 모듈
 * [EN] Grass instance vertex transformation and distance fade module
 */

#redgpu_include landscape.math.rotateVectorByQuat;

struct GrassDistanceFadeResult {
    scaleXZ: f32,
    scaleY: f32,
    alphaFade: f32,
};

/**
 * [KO] 카메라 거리에 따른 잔디 스케일 축소 및 알파 페이드를 계산합니다.
 * [EN] Computes grass scale shrinking and alpha fade based on camera distance.
 */
fn computeGrassDistanceFade(
    distToCam: f32,
    cullDist: f32,
    fadeStart: f32,
    baseScaleXZ: f32,
    baseScaleY: f32
) -> GrassDistanceFadeResult {
    var res: GrassDistanceFadeResult;
    res.scaleXZ = baseScaleXZ;
    res.scaleY = baseScaleY;
    res.alphaFade = 1.0;

    if (distToCam > fadeStart) {
        let fadeRatio = clamp((cullDist - distToCam) / max(0.001, cullDist - fadeStart), 0.0, 1.0);
        res.scaleXZ = baseScaleXZ * fadeRatio;
        res.scaleY = baseScaleY * fadeRatio;
        res.alphaFade = smoothstep(0.0, 1.0, fadeRatio);
    }
    return res;
}

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

/**
 * [KO] 정규화된 쿼터니언으로 잔디 모델 정점 노멀을 회전합니다. (단위 벡터 강체 회전이므로 추가 normalize 불필요)
 * [EN] Rotates grass model vertex normal by normalized quaternion. (Isometry preserves unit length, no extra normalize needed)
 */
fn rotateGrassNormal(normal: vec3<f32>, q: vec4<f32>) -> vec3<f32> {
    return rotateVectorByQuat(normal, q);
}
