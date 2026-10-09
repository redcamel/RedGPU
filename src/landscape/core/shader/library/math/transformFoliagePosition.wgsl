#redgpu_include landscape.math.rotateVectorByQuat;

struct FoliageVertexTransformResult {
    worldPos: vec3<f32>,
    safeScale: vec3<f32>,
};

fn transformFoliagePosition(
    position: vec3<f32>,
    instancePos: vec3<f32>,
    instanceScale: vec3<f32>,
    instanceRotQuat: vec4<f32>
) -> FoliageVertexTransformResult {
    let safeScale = max(instanceScale, vec3<f32>(0.0001));
    let scaledPos = position * safeScale;
    let rotatedPos = rotateVectorByQuat(scaledPos, instanceRotQuat);
    let worldPos = rotatedPos + instancePos;
    return FoliageVertexTransformResult(worldPos, safeScale);
}
