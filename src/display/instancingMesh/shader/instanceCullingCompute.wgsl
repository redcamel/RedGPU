struct InstanceUniforms {
    useDisplacementTexture: u32,
    displacementScale: f32,
    instanceGroupModelMatrix: mat4x4<f32>,
    instanceModelMatrixs: array<mat4x4<f32>, __INSTANCE_COUNT__>,
    instanceNormalModelMatrix: array<mat4x4<f32>, __INSTANCE_COUNT__>,
    instanceOpacity: array<f32, __INSTANCE_COUNT__>,
};

struct CullingUniforms {
    instanceNum: f32,
    stride: u32,  // 추가: visibility buffer의 stride (바이트 단위를 u32 인덱스로)
    padding: vec2<f32>,
    cameraPosition:vec3<f32>,
    frustumPlanes: array<vec4<f32>, 6>,

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
@group(0) @binding(3) var<storage, read_write> indirectDrawArgs: IndirectDrawArgs;
@group(0) @binding(4) var<storage, read_write> indirectDrawArgs1: IndirectDrawArgs;

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
    if (distanceToCamera < 20.0) {
        return 0u;
    } else {
        return 1u;
    }
}

@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) globalId: vec3<u32>) {
    let instanceIdx = globalId.x;
    if (instanceIdx >= u32(cullingUniforms.instanceNum)) {
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

        if (lodLevel == 0u) {
            // LOD 0: 첫 번째 stride 영역에 저장
            let aliveIndex = atomicAdd(&indirectDrawArgs.instanceCount, 1u);
            visibilityBuffer[aliveIndex] = instanceIdx;
        } else {
            // LOD 1: stride 오프셋을 적용하여 두 번째 영역에 저장
            let aliveIndex = atomicAdd(&indirectDrawArgs1.instanceCount, 1u);
            let strideOffset = cullingUniforms.stride;
            visibilityBuffer[strideOffset + aliveIndex] = instanceIdx;
        }
    }
}
