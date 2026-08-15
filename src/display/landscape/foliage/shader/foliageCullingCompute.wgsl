struct FoliageInstanceData {
    posX: f32,
    posY: f32,
    posZ: f32,
    rotX: f32,
    rotY: f32,
    rotZ: f32,
    rotW: f32,
    scaleX: f32,
    scaleY: f32,
    scaleZ: f32,
    fade: f32,
    subId: f32,
};

struct CullingUniforms {
    cameraPosition: vec3<f32>,
    cullingDistance: f32,
    fadeStartDistance: f32,
    activeInstanceCount: u32,
    boundingRadius: f32,
    worldSizeX: f32,
    heightScale: f32,
    bottomOffset: f32,
    hasVHT: u32,
    padding: f32,
    frustumPlanes: array<vec4<f32>, 6>,
};

struct IndirectDrawArgs {
    vertexOrIndexCount: u32,
    instanceCount: atomic<u32>,
    firstVertexOrIndex: u32,
    baseVertex: u32,
    firstInstance: u32,
};

@group(0) @binding(0) var<storage, read> rawInstanceBuffer: array<FoliageInstanceData>;
@group(0) @binding(1) var<uniform> cullingUniforms: CullingUniforms;
@group(0) @binding(2) var<storage, read_write> culledInstanceBuffer: array<FoliageInstanceData>;
@group(0) @binding(3) var<storage, read_write> indirectDrawBuffer: IndirectDrawArgs;
@group(0) @binding(4) var vhtTexture: texture_2d<f32>;
@group(0) @binding(5) var vhtSampler: sampler;

@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) globalId: vec3<u32>) {
    let instanceIdx = globalId.x;
    if (instanceIdx >= cullingUniforms.activeInstanceCount) {
        return;
    }

    let instance = rawInstanceBuffer[instanceIdx];

    // 0. GPU VHT Atlas Direct Height Sampling (Zero CPU Overhead & World Bounds Culling)
    var realY = instance.posY;
    if (cullingUniforms.hasVHT == 1u && cullingUniforms.worldSizeX > 0.0) {
        let normU = (instance.posX + cullingUniforms.worldSizeX * 0.5) / cullingUniforms.worldSizeX;
        let normV = (instance.posZ + cullingUniforms.worldSizeX * 0.5) / cullingUniforms.worldSizeX;

        // 🍃 지형 월드 경계 외부 식생 즉시 GPU 컬링 조기 탈출
        if (normU < 0.0 || normU > 1.0 || normV < 0.0 || normV > 1.0) {
            return;
        }

        let sampleVal = textureSampleLevel(vhtTexture, vhtSampler, vec2<f32>(normU, normV), 0.0).r;
        let terrainY = sampleVal * cullingUniforms.heightScale;
        realY = terrainY + cullingUniforms.bottomOffset * instance.scaleY;
    }

    let worldPos = vec3<f32>(instance.posX, realY, instance.posZ);
    let camPos = cullingUniforms.cameraPosition;

    let dx = worldPos.x - camPos.x;
    let dy = worldPos.y - camPos.y;
    let dz = worldPos.z - camPos.z;
    let distSq = dx * dx + dy * dy + dz * dz;

    let cullingDist = cullingUniforms.cullingDistance;
    let cullingDistSq = cullingDist * cullingDist;

    // 1. 거리 기반 빠른 조기 반환 (Distance Early Exit)
    if (distSq >= cullingDistSq) {
        return;
    }

    // 2. 절두체 평면(Frustum Planes) 컬링 검사
    let maxScale = max(max(instance.scaleX, instance.scaleY), instance.scaleZ);
    let scaledRadius = cullingUniforms.boundingRadius * maxScale;

    for (var i: u32 = 0u; i < 6u; i = i + 1u) {
        let plane = cullingUniforms.frustumPlanes[i];
        if (plane.w != 0.0 || plane.x != 0.0 || plane.y != 0.0 || plane.z != 0.0) {
            let distToPlane = dot(vec4<f32>(worldPos, 1.0), plane);
            if (distToPlane < -scaledRadius) {
                return;
            }
        }
    }

    // 3. 거리 페이드 계수(Fade Factor 1.0~0.0) 산출
    let fadeStartDist = cullingUniforms.fadeStartDistance;
    let fadeStartDistSq = fadeStartDist * fadeStartDist;
    var fade: f32 = 1.0;

    if (distSq > fadeStartDistSq) {
        let dist = sqrt(distSq);
        let fadeRange = max(cullingDist - fadeStartDist, 1.0);
        fade = clamp(1.0 - (dist - fadeStartDist) / fadeRange, 0.0, 1.0);
    }

    // 4. 원자적 카운팅 및 출력 버퍼 복사 (정밀 Y 고도 반영)
    let outIdx = atomicAdd(&indirectDrawBuffer.instanceCount, 1u);

    var culledInstance = instance;
    culledInstance.posY = realY;
    culledInstance.fade = fade;
    culledInstanceBuffer[outIdx] = culledInstance;
}
