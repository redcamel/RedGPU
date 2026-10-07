#redgpu_include landscape.math.rotateVectorByQuat;

struct FoliageVertexTransformResult {
    hierarchyPos: vec3<f32>,
    worldPos: vec3<f32>,
    safeScale: vec3<f32>,
};

fn transformFoliagePosition(
    position: vec3<f32>,
    instancePos: vec3<f32>,
    instanceScale: vec3<f32>,
    instanceRotQuat: vec4<f32>
) -> FoliageVertexTransformResult {
    let hierarchyPos = position;
    let safeScale = max(instanceScale, vec3<f32>(0.0001));
    let scaledPos = hierarchyPos * safeScale;
    let rotatedPos = rotateVectorByQuat(scaledPos, instanceRotQuat);
    let worldPos = rotatedPos + instancePos;
    return FoliageVertexTransformResult(hierarchyPos, worldPos, safeScale);
}
