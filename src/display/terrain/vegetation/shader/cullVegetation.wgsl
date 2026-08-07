struct DrawIndexedIndirectArgs {
    indexCount: u32,
    instanceCount: atomic<u32>,
    firstIndex: u32,
    baseVertex: u32,
    firstInstance: u32,
};

struct CullUniforms {
    maxInstanceCount: u32,
    maxDistanceSq: f32,
    boundingRadius: f32,
    minHeight: f32,
    maxHeight: f32,
    cameraPosX: f32,
    cameraPosY: f32,
    cameraPosZ: f32,
};

struct FrustumPlanes {
    planes: array<vec4<f32>, 6>,
};

@group(0) @binding(0) var<storage, read> rawInstanceMatrices: array<mat4x4<f32>>;
@group(0) @binding(1) var<storage, read_write> culledInstanceMatrices: array<mat4x4<f32>>;
@group(0) @binding(2) var<storage, read_write> indirectArgs: DrawIndexedIndirectArgs;
@group(0) @binding(3) var<storage, read> cullUniforms: CullUniforms;
@group(0) @binding(4) var<storage, read> frustumPlanes: FrustumPlanes;

@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let index = global_id.x;
    if (index >= cullUniforms.maxInstanceCount) {
        return;
    }

    let instanceMatrix = rawInstanceMatrices[index];
    let instX = instanceMatrix[3][0];
    let instZ = instanceMatrix[3][2];

    // 1. Distance Culling 판정
    let dx = instX - cullUniforms.cameraPosX;
    let dz = instZ - cullUniforms.cameraPosZ;
    let distSq = dx * dx + dz * dz;
    if (distSq > cullUniforms.maxDistanceSq) {
        return;
    }

    // 2. Frustum Culling 판정 (카메라 반경 30m 안전지대는 절두체 검사 무조건 통과하여 팝인 방지)
    let NEAR_SAFE_DISTANCE_SQ: f32 = 1800.0; // 30m 반경 (30^2 = 900)
    if (distSq > NEAR_SAFE_DISTANCE_SQ) {
        let midY = (cullUniforms.minHeight + cullUniforms.maxHeight) * 0.5;
        let centerPos = vec3<f32>(instX, midY, instZ);
        let radius = cullUniforms.boundingRadius;

        for (var i = 0u; i < 6u; i++) {
            let plane = frustumPlanes.planes[i];
            let dist = dot(plane.xyz, centerPos) + plane.w;
            if (dist < -radius) {
                return; // 절두체 외부
            }
        }
    }

    // 3. 컬링 통과 인스턴스 저장 및 indirect count 증가
    let slot = atomicAdd(&indirectArgs.instanceCount, 1u);
    culledInstanceMatrices[slot] = instanceMatrix;
}