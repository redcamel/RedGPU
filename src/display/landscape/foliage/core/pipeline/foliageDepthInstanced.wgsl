#redgpu_include SYSTEM_UNIFORM;

struct SubMeshUniforms {
    relativeModelMatrix: mat4x4<f32>,
    relativeNormalMatrix: mat4x4<f32>,
    globalFragmentSlotIndex: u32,
    hasHierarchyTransform: u32,
    pad1: u32,
    pad2: u32,
};

@group(1) @binding(0) var<uniform> subMeshUniforms: SubMeshUniforms;

struct VertexInput {
    @location(0) position : vec3<f32>,
    @location(1) vertexNormal : vec3<f32>,
    @location(2) uv : vec2<f32>,
    @location(3) uv1 : vec2<f32>,
    @location(4) vertexColor_0 : vec4<f32>,
    @location(5) vertexTangent : vec4<f32>,

    @location(6) instancePos : vec3<f32>,
    @location(7) instanceRotQuat : vec4<f32>,
    @location(8) instanceScale : vec3<f32>,
    @location(9) instanceExtra : vec2<f32>,
};

struct DepthOutputData {
    @builtin(position) position: vec4<f32>,
    @location(0) uv: vec2<f32>,
    @location(1) @interpolate(flat) globalFragmentSlotIndex: u32,
    @location(2) combinedOpacity: f32,
};

fn rotateVectorByQuaternion(v: vec3<f32>, q: vec4<f32>) -> vec3<f32> {
    return v + 2.0 * cross(q.xyz, cross(q.xyz, v) + q.w * v);
}

@vertex
fn mainInput(input : VertexInput) -> DepthOutputData {
    var output : DepthOutputData;

    let fadeFactor = input.instanceExtra.x;
    let lodFadeFactor = input.instanceExtra.y;

    var hierarchyPos = input.position;
    if (subMeshUniforms.hasHierarchyTransform != 0u) {
        hierarchyPos = (subMeshUniforms.relativeModelMatrix * vec4<f32>(input.position, 1.0)).xyz;
    }

    let scaledPos = hierarchyPos * input.instanceScale;
    let rotatedPos = rotateVectorByQuaternion(scaledPos, input.instanceRotQuat);

    let worldPos = rotatedPos + input.instancePos;

    output.position = systemUniforms.projection.projectionViewMatrix * vec4<f32>(worldPos, 1.0);

    output.uv = input.uv;
    output.globalFragmentSlotIndex = subMeshUniforms.globalFragmentSlotIndex;
    output.combinedOpacity = fadeFactor * lodFadeFactor;

    return output;
}
