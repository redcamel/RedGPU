#redgpu_include SYSTEM_UNIFORM;
#redgpu_include shadow.getShadowCoord;

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

struct OutputData {
    @builtin(position) position: vec4<f32>,
    @location(0) vertexPosition: vec3<f32>,
    @location(1) vertexNormal: vec3<f32>,
    @location(2) uv: vec2<f32>,
    @location(3) uv1: vec2<f32>,
    @location(4) vertexColor_0: vec4<f32>,
    @location(5) vertexTangent: vec4<f32>,

    @location(7) currentClipPos: vec4<f32>,
    @location(8) prevClipPos: vec4<f32>,

    @location(9) @interpolate(flat) globalFragmentSlotIndex: u32,
    @location(10) localNodeScale_volumeScale: vec2<f32>,
    @location(11) combinedOpacity: f32,

    @location(12) motionVector: vec3<f32>,
    @location(13) shadowCoord: vec3<f32>,
    @location(14) @interpolate(flat) receiveShadow: f32,
    @location(15) @interpolate(flat) pickingId: vec4<f32>,
};

fn rotateVectorByQuaternion(v: vec3<f32>, q: vec4<f32>) -> vec3<f32> {
    return v + 2.0 * cross(q.xyz, cross(q.xyz, v) + q.w * v);
}

@vertex
fn mainInput(input : VertexInput) -> OutputData {
    var output : OutputData;

    let fadeFactor = input.instanceExtra.x;
    let lodFadeFactor = input.instanceExtra.y;

    var hierarchyPos = input.position;
    var hierarchyNormal = input.vertexNormal;
    var hierarchyTangent = input.vertexTangent.xyz;
    if (subMeshUniforms.hasHierarchyTransform != 0u) {
        hierarchyPos = (subMeshUniforms.relativeModelMatrix * vec4<f32>(input.position, 1.0)).xyz;
        hierarchyNormal = (subMeshUniforms.relativeNormalMatrix * vec4<f32>(input.vertexNormal, 0.0)).xyz;
        hierarchyTangent = (subMeshUniforms.relativeNormalMatrix * vec4<f32>(input.vertexTangent.xyz, 0.0)).xyz;
    }

    let safeScale = max(input.instanceScale, vec3<f32>(0.0001));
    let scaledPos = hierarchyPos * safeScale;
    let rotatedPos = rotateVectorByQuaternion(scaledPos, input.instanceRotQuat);

    var smoothedNormal = hierarchyNormal;
    let canopyDir = normalize(vec3<f32>(hierarchyPos.x, max(hierarchyPos.y * 0.6, 0.2), hierarchyPos.z));
    if (length(hierarchyNormal) > 0.001) {
        smoothedNormal = normalize(hierarchyNormal * 0.55 + canopyDir * 0.3 + vec3<f32>(0.0, 0.15, 0.0));
    } else {
        smoothedNormal = canopyDir;
    }

    let scaledNormal = smoothedNormal / safeScale;
    let worldNormal = normalize(rotateVectorByQuaternion(scaledNormal, input.instanceRotQuat));

    var inTan = hierarchyTangent;
    if (length(inTan) < 0.001) {
        var rawT = vec3<f32>(1.0, 0.0, 0.0);
        if (abs(hierarchyNormal.x) > 0.9) { rawT = vec3<f32>(0.0, 1.0, 0.0); }
        inTan = normalize(cross(hierarchyNormal, rawT));
    }
    let worldTangent = normalize(rotateVectorByQuaternion(inTan, input.instanceRotQuat));
    let tanW = select(1.0, input.vertexTangent.w, input.vertexTangent.w != 0.0);
    output.vertexTangent = vec4<f32>(worldTangent, tanW);

    let worldPos = rotatedPos + input.instancePos;

    let clipPos = systemUniforms.projection.projectionViewMatrix * vec4<f32>(worldPos, 1.0);

    output.position = clipPos;
    output.vertexPosition = worldPos;
    output.vertexNormal = worldNormal;
    output.uv = input.uv;
    output.uv1 = input.uv1;
    output.vertexColor_0 = input.vertexColor_0;

    output.currentClipPos = systemUniforms.projection.noneJitterProjectionViewMatrix * vec4<f32>(worldPos, 1.0);
    output.prevClipPos = systemUniforms.projection.prevNoneJitterProjectionViewMatrix * vec4<f32>(worldPos, 1.0);

    output.globalFragmentSlotIndex = subMeshUniforms.globalFragmentSlotIndex;
    output.localNodeScale_volumeScale = vec2<f32>(1.0, 1.0);

    output.combinedOpacity = fadeFactor * lodFadeFactor;

    output.shadowCoord = getShadowCoord(worldPos, systemUniforms.directionalLightProjectionViewMatrix);
    output.receiveShadow = 1.0;

    output.motionVector = vec3<f32>(0.0);
    output.pickingId = vec4<f32>(0.0);

    return output;
}
