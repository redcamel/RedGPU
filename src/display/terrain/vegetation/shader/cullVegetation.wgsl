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
    cameraPosX: f32,
    cameraPosY: f32,
    cameraPosZ: f32,
    maskThreshold: f32,
    maskChannel: u32,
};

struct FrustumPlanes {
    planes: array<vec4<f32>, 6>,
};

struct VegetationUniforms {
    worldSize: vec2<f32>,
    worldOffset: vec2<f32>,
    maxHeight: f32,
    minHeight: f32,
    time: f32,
    windStrength: f32,
    baseModelMatrix: mat4x4<f32>,
};

@group(0) @binding(0) var<storage, read> rawInstanceMatrices: array<mat4x4<f32>>;
@group(0) @binding(1) var<storage, read_write> culledInstanceIndices: array<u32>;
@group(0) @binding(2) var<storage, read_write> indirectArgs: DrawIndexedIndirectArgs;
@group(0) @binding(3) var<storage, read> cullUniforms: CullUniforms;
@group(0) @binding(4) var<storage, read> frustumPlanes: FrustumPlanes;
@group(0) @binding(5) var<storage, read_write> culledInstanceHeights: array<f32>;
@group(0) @binding(6) var<storage, read> vegetationUniforms: VegetationUniforms;
@group(0) @binding(7) var heightmapSampler: sampler;
@group(0) @binding(8) var heightAtlasTexture: texture_2d<f32>;
@group(0) @binding(9) var splatSampler: sampler;
@group(0) @binding(10) var splatTexture: texture_2d<f32>;

@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let index = global_id.x;
    if (index >= cullUniforms.maxInstanceCount) {
        return;
    }

    let instanceMatrix = rawInstanceMatrices[index];
    let instX = instanceMatrix[3][0];
    let instY = instanceMatrix[3][1];
    let instZ = instanceMatrix[3][2];

    // 0. Splatmap 토질 마스크 검사 (GPU Culling)
    let splatUV = clamp(
        vec2<f32>(
            (instX - vegetationUniforms.worldOffset.x) / vegetationUniforms.worldSize.x,
            1.0 - (instZ - vegetationUniforms.worldOffset.y) / vegetationUniforms.worldSize.y
        ),
        vec2<f32>(0.0), vec2<f32>(1.0)
    );
    let splatColor = textureSampleLevel(splatTexture, splatSampler, splatUV, 0.0);
    var maskVal: f32 = 0.0;
    if (cullUniforms.maskChannel == 0u) {
        maskVal = splatColor.r;
    } else if (cullUniforms.maskChannel == 1u) {
        maskVal = splatColor.g;
    } else if (cullUniforms.maskChannel == 2u) {
        maskVal = splatColor.b;
    } else {
        maskVal = splatColor.a;
    }

    if (maskVal < cullUniforms.maskThreshold) {
        return;
    }

    // 1. Distance Culling 판정
    let dx = instX - cullUniforms.cameraPosX;
    let dz = instZ - cullUniforms.cameraPosZ;
    let distSq = dx * dx + dz * dz;
    if (distSq > cullUniforms.maxDistanceSq) {
        return;
    }

    // 1-1. 거리 기반 식생 밀도 솎아내기 (Distance-based Density Thinning)
    // 원거리(최대 가시거리의 70% 이상): 75% 솎아내기 (4개 중 1개만 통과)
    let farThresholdSq = cullUniforms.maxDistanceSq * 0.49;
    if (distSq > farThresholdSq) {
        if ((index & 3u) != 0u) {
            return;
        }
    } else {
        // 중거리(최대 가시거리의 45% 이상): 50% 솎아내기 (2개 중 1개만 통과)
        let midThresholdSq = cullUniforms.maxDistanceSq * 0.2025;
        if (distSq > midThresholdSq) {
            if ((index & 1u) != 0u) {
                return;
            }
        }
    }

    // 2. Frustum Culling 판정 (카메라 반경 30m 안전지대는 절두체 검사 무조건 통과하여 팝인 방지)
    let NEAR_SAFE_DISTANCE_SQ: f32 = 900.0; // 30m 반경 (30^2 = 900)
    if (distSq > NEAR_SAFE_DISTANCE_SQ) {
        let centerPos = vec3<f32>(instX, instY, instZ);
        let radius = cullUniforms.boundingRadius;

        for (var i = 0u; i < 6u; i++) {
            let plane = frustumPlanes.planes[i];
            let dist = dot(plane.xyz, centerPos) + plane.w;
            if (dist < -radius) {
                return; // 절두체 외부
            }
        }
    }

    // Heightmap UV 및 Y 샘플링
    let terrainUV = clamp(
        vec2<f32>(
            (instX - vegetationUniforms.worldOffset.x) / vegetationUniforms.worldSize.x,
            1.0 - (instZ - vegetationUniforms.worldOffset.y) / vegetationUniforms.worldSize.y
        ),
        vec2<f32>(0.0), vec2<f32>(1.0)
    );
    let sampledRatio = textureSampleLevel(heightAtlasTexture, heightmapSampler, terrainUV, 0.0).r;
    let terrainY = vegetationUniforms.minHeight + sampledRatio * (vegetationUniforms.maxHeight - vegetationUniforms.minHeight);

    // 3. 컬링 통과 인스턴스 저장, Y 높이 저장 및 indirect count 증가
    let slot = atomicAdd(&indirectArgs.instanceCount, 1u);
    culledInstanceIndices[slot] = index;
    culledInstanceHeights[slot] = terrainY;
}