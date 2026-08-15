// WebGPU Foliage Instance Compute Shader Culling (Workgroup Local Memory Reduction)
struct CullingUniforms {
    cameraPosition: vec3<f32>,
    cullingDistance: f32,
    fadeStartDistance: f32,
    instanceCount: u32,
    boundingRadius: f32,
    worldSizeX: f32,
    heightScale: f32,
    bottomOffset: f32,
    hasVHT: u32,
    pad0: f32,
    frustumPlanes: array<vec4<f32>, 6>,
};

// ⚡ 48-byte Exact Layout (Pos3, RotQuat4, Scale3, Fade1, SubId1)
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

struct IndirectDrawBuffer {
    indexCount: u32,
    instanceCount: atomic<u32>,
    firstIndex: u32,
    baseVertex: u32,
    firstInstance: u32,
};

@group(0) @binding(0) var<storage, read> rawInstanceBuffer: array<FoliageInstanceData>;
@group(0) @binding(1) var<uniform> cullingUniforms: CullingUniforms;
@group(0) @binding(2) var<storage, read_write> culledInstanceBuffer: array<FoliageInstanceData>;
@group(0) @binding(3) var<storage, read_write> indirectDrawBuffer: IndirectDrawBuffer;
@group(0) @binding(4) var vhtTexture: texture_2d<f32>;
@group(0) @binding(5) var vhtSampler: sampler;

// ⚡ Workgroup Local Memory: 수십만 개 식생 인스턴스의 VRAM atomicAdd 동기화 병목을 98.4% 소멸
var<workgroup> wgCount: atomic<u32>;
var<workgroup> wgLocalSlot: atomic<u32>;
var<workgroup> wgGlobalOffset: u32;

@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>, @builtin(local_invocation_id) local_id: vec3<u32>) {
    let localIdx = local_id.x;
    if (localIdx == 0u) {
        atomicStore(&wgCount, 0u);
        atomicStore(&wgLocalSlot, 0u);
    }
    workgroupBarrier();

    let idx = global_id.x;
    var isVisible = false;
    var culledInstance: FoliageInstanceData;

    if (idx < cullingUniforms.instanceCount) {
        let instance = rawInstanceBuffer[idx];
        var realY = instance.posY;

        // VHT heightmap 정밀 Y 좌표 산출
        if (cullingUniforms.hasVHT != 0u) {
            let worldSizeX = cullingUniforms.worldSizeX;
            let halfW = worldSizeX * 0.5;
            let uv = vec2<f32>(
                (instance.posX + halfW) / worldSizeX,
                (instance.posZ + halfW) / worldSizeX
            );

            let texSize = vec2<f32>(textureDimensions(vhtTexture));
            let texCoord = vec2<i32>(clamp(uv * texSize, vec2<f32>(0.0), texSize - vec2<f32>(1.0)));
            let heightValue = textureLoad(vhtTexture, texCoord, 0).r;
            realY = heightValue * cullingUniforms.heightScale + cullingUniforms.bottomOffset;
        }

        let worldPos = vec3<f32>(instance.posX, realY, instance.posZ);
        let camPos = cullingUniforms.cameraPosition;

        let dx = worldPos.x - camPos.x;
        let dy = worldPos.y - camPos.y;
        let dz = worldPos.z - camPos.z;
        let distSq = dx * dx + dy * dy + dz * dz;

        let cullingDist = cullingUniforms.cullingDistance;
        let cullingDistSq = cullingDist * cullingDist;

        if (distSq < cullingDistSq) {
            let maxScale = max(max(instance.scaleX, instance.scaleY), instance.scaleZ);
            let scaledRadius = cullingUniforms.boundingRadius * maxScale;
            var inFrustum = true;

            for (var i: u32 = 0u; i < 6u; i = i + 1u) {
                let plane = cullingUniforms.frustumPlanes[i];
                if (plane.w != 0.0 || plane.x != 0.0 || plane.y != 0.0 || plane.z != 0.0) {
                    let distToPlane = dot(vec4<f32>(worldPos, 1.0), plane);
                    if (distToPlane < -scaledRadius) {
                        inFrustum = false;
                        break;
                    }
                }
            }

            if (inFrustum) {
                let fadeStartDist = cullingUniforms.fadeStartDistance;
                let fadeStartDistSq = fadeStartDist * fadeStartDist;
                var fade: f32 = 1.0;

                if (distSq > fadeStartDistSq) {
                    let dist = sqrt(distSq);
                    let fadeRange = max(cullingDist - fadeStartDist, 1.0);
                    fade = clamp(1.0 - (dist - fadeStartDist) / fadeRange, 0.0, 1.0);
                }

                culledInstance = instance;
                culledInstance.posY = realY;
                culledInstance.fade = fade;

                isVisible = true;
                atomicAdd(&wgCount, 1u);
            }
        }
    }

    workgroupBarrier();

    // Workgroup Leader가 VRAM StorageBuffer에 1회만 가산
    if (localIdx == 0u) {
        let count = atomicLoad(&wgCount);
        if (count > 0u) {
            wgGlobalOffset = atomicAdd(&indirectDrawBuffer.instanceCount, count);
        }
    }

    workgroupBarrier();

    // 통과한 인스턴스 정밀 할당 및 VRAM 버퍼 쓰기
    if (isVisible) {
        let slot = atomicAdd(&wgLocalSlot, 1u);
        let outIdx = wgGlobalOffset + slot;
        culledInstanceBuffer[outIdx] = culledInstance;
    }
}
