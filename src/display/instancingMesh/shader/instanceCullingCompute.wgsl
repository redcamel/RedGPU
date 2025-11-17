struct InstanceUniforms {
    useDisplacementTexture: u32,
    displacementScale: f32,
    instanceGroupModelMatrix: mat4x4<f32>,
    instanceModelMatrixs: array<mat4x4<f32>, __INSTANCE_COUNT__>,
    instanceNormalModelMatrix: array<mat4x4<f32>, __INSTANCE_COUNT__>,
    instanceOpacity: array<f32, __INSTANCE_COUNT__>,
};

struct CullingUniforms {
    instanceCount: u32,
    stride: u32,
    lodNum: u32,
    padding: f32,
    cameraPosition: vec3<f32>,
    frustumPlanes: array<vec4<f32>, 6>,
    lodDistanceList: array<f32, 7>,

};

struct IndirectDrawArgs {
    vertexCount: u32,
    instanceCount: atomic<u32>,
    firstVertex: u32,
    baseVertex: u32,
    firstInstance: u32,
};

@group(0) @binding(0) var<storage, read> instanceUniforms: InstanceUniforms;
@group(0) @binding(1) var<storage, read> cullingUniforms: CullingUniforms;
@group(0) @binding(2) var<storage, read_write> visibilityBuffer: array<u32>;
@group(0) @binding(3) var<storage, read_write> indirectDrawBuffer: array<IndirectDrawArgs>;

const BOUNDING_RADIUS: f32 = 1.0;

fn distanceToPlane(position: vec3<f32>, plane: vec4<f32>) -> f32 {
    return dot(vec4<f32>(position, 1.0), plane);
}

fn isInsideFrustum(position: vec3<f32>, radius: f32) -> bool {
    for (var i: u32 = 0u; i < 6u; i = i + 1u) {
        let plane = cullingUniforms.frustumPlanes[i];
        let distance = distanceToPlane(position, plane);
        if (distance < -radius) {
            return false;
        }
    }
    return true;
}

fn calculateLODLevel(distanceToCamera: f32) -> u32 {
    if (cullingUniforms.lodNum == 0u) {
        return 0u;
    }

    for (var i: u32 = 0u; i < cullingUniforms.lodNum; i = i + 1u) {
        if (distanceToCamera < cullingUniforms.lodDistanceList[i]) {
            return i;
        }
    }

    return cullingUniforms.lodNum;
}

@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) globalId: vec3<u32>) {
    let instanceIdx = globalId.x;
    if (instanceIdx >= (cullingUniforms.instanceCount)) {
        return;
    }

    let u_instanceGroupModelMatrix = instanceUniforms.instanceGroupModelMatrix;
    let modelMatrix = u_instanceGroupModelMatrix * instanceUniforms.instanceModelMatrixs[instanceIdx];
    let worldPosition = vec3<f32>(
        modelMatrix[3][0],
        modelMatrix[3][1],
        modelMatrix[3][2]
    );

    let scaleX = length(vec3<f32>(modelMatrix[0][0], modelMatrix[0][1], modelMatrix[0][2]));
    let scaleY = length(vec3<f32>(modelMatrix[1][0], modelMatrix[1][1], modelMatrix[1][2]));
    let scaleZ = length(vec3<f32>(modelMatrix[2][0], modelMatrix[2][1], modelMatrix[2][2]));
    let maxScale = max(max(scaleX, scaleY), scaleZ);
    let scaledRadius = BOUNDING_RADIUS * maxScale;

    let isVisible = isInsideFrustum(worldPosition, scaledRadius);

    if (isVisible) {
        let distanceToCamera = distance(worldPosition, cullingUniforms.cameraPosition);
        let lodLevel = calculateLODLevel(distanceToCamera);
        let visibilityStride = cullingUniforms.stride;

        let aliveIndex = atomicAdd(&indirectDrawBuffer[lodLevel].instanceCount, 1u);
        visibilityBuffer[visibilityStride * lodLevel + aliveIndex] = instanceIdx;
    }
}