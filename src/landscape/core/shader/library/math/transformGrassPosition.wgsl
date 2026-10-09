#redgpu_include landscape.math.rotateVectorByQuat;

struct GrassPositionResult {
    worldPos: vec3<f32>,
    heightRatio: f32,
};

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
