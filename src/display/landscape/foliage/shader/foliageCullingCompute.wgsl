// WebGPU Foliage Instance Compute Shader Culling (Multi-LOD & Submesh Workgroup Reduction)
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
    subMeshCount: u32,
    lodDistance: f32,          // ★ LOD 전환 중심 거리 (예: 90.0)
    lod0SubMeshCount: u32,     // ★ LOD 0 서브메시 개수
    hasBillboard: u32,         // ★ 빌보드 활성화 여부
    maxInstances: u32,         // ★ 최대 인스턴스 수
    lodFadeRange: f32,         // ★ LOD 크로스페이드 구간 범위 (예: 30.0)
    invWorldSizeX: f32,        // ⚡ 1.0 / worldSizeX (FDIV 나눗셈 제거 및 FMA 1사이클 곱셈)
    pad2: f32,
    pad3: f32,
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

struct DrawIndexedIndirectArgs {
    indexCount: u32,
    instanceCount: atomic<u32>,
    firstIndex: u32,
    baseVertex: u32,
    firstInstance: u32,
};

@group(0) @binding(0) var<storage, read> rawInstanceBuffer: array<FoliageInstanceData>;
@group(0) @binding(1) var<uniform> cullingUniforms: CullingUniforms;
@group(0) @binding(2) var<storage, read_write> culledInstanceBuffer: array<FoliageInstanceData>;
@group(0) @binding(3) var<storage, read_write> indirectDrawCommands: array<DrawIndexedIndirectArgs>;
@group(0) @binding(4) var vhtTexture: texture_2d<f32>;
@group(0) @binding(5) var vhtSampler: sampler;

// ⚡ Workgroup Local Memory: LOD0과 LOD1을 각각 독립적으로 초고속 로컬 축약
var<workgroup> wgCountLOD0: atomic<u32>;
var<workgroup> wgCountLOD1: atomic<u32>;
var<workgroup> wgLocalSlotLOD0: atomic<u32>;
var<workgroup> wgLocalSlotLOD1: atomic<u32>;
var<workgroup> wgGlobalOffsetLOD0: u32;
var<workgroup> wgGlobalOffsetLOD1: u32;

@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>, @builtin(local_invocation_id) local_id: vec3<u32>) {
    let localIdx = local_id.x;
    if (localIdx == 0u) {
        atomicStore(&wgCountLOD0, 0u);
        atomicStore(&wgCountLOD1, 0u);
        atomicStore(&wgLocalSlotLOD0, 0u);
        atomicStore(&wgLocalSlotLOD1, 0u);
    }

    workgroupBarrier();

    let idx = global_id.x;
    var isLOD0 = false;
    var isLOD1 = false;
    var culledInstance0: FoliageInstanceData;
    var culledInstance1: FoliageInstanceData;

    if (idx < cullingUniforms.instanceCount) {
        let instance = rawInstanceBuffer[idx];
        let camPos = cullingUniforms.cameraPosition;

        // 🌟 1단계: 2D 수평 거리(dx*dx + dz*dz) 초고속 산술 사전 검사
        // 가시거리 밖 80% 인스턴스는 무거운 VHT 텍스처 VRAM 메모리 샘플링 100% 스킵!
        let dx = instance.posX - camPos.x;
        let dz = instance.posZ - camPos.z;
        let horizontalDistSq = dx * dx + dz * dz;

        let cullingDist = cullingUniforms.cullingDistance;
        let cullingDistSq = cullingDist * cullingDist;

        if (horizontalDistSq < cullingDistSq) {
            // 🌟 2단계: 가시거리 내 유효 인스턴스에 대해서만 GPU VHT 지형 고도 텍스처 샘플링 실행!
            var realY = instance.posY;
            if (cullingUniforms.hasVHT != 0u && cullingUniforms.invWorldSizeX > 0.0) {
                // ⚡ FMA (Fused Multiply-Add): 나눗셈(/) 제거로 1사이클 초고속 UV 변환
                let u = instance.posX * cullingUniforms.invWorldSizeX + 0.5;
                let v = instance.posZ * cullingUniforms.invWorldSizeX + 0.5;
                if (u >= 0.0 && u <= 1.0 && v >= 0.0 && v <= 1.0) {
                    let sampledHeightNorm = textureSampleLevel(vhtTexture, vhtSampler, vec2<f32>(u, v), 0.0).r;
                    realY = (sampledHeightNorm * cullingUniforms.heightScale) - cullingUniforms.bottomOffset;
                }
            }

            let worldPos = vec3<f32>(instance.posX, realY, instance.posZ);
            let dy = realY - camPos.y;
            let distSq = horizontalDistSq + dy * dy;

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
                let dist = sqrt(distSq);
                let fadeStartDist = cullingUniforms.fadeStartDistance;
                var fade: f32 = 1.0;

                if (dist > fadeStartDist) {
                    let fadeRange = max(cullingDist - fadeStartDist, 1.0);
                    fade = clamp(1.0 - (dist - fadeStartDist) / fadeRange, 0.0, 1.0);
                }

                // 🌟 UE5 스타일 LOD Dithered Crossfade 계산
                let lodDist = cullingUniforms.lodDistance;
                let halfFadeRange = max(cullingUniforms.lodFadeRange * 0.5, 1.0);
                let crossFadeStart = lodDist - halfFadeRange;
                let crossFadeEnd = lodDist + halfFadeRange;

                if (cullingUniforms.hasBillboard == 0u) {
                    // 빌보드 미사용 시: 항상 LOD 0 (3D 풀 모델)
                    isLOD0 = true;
                    culledInstance0 = instance;
                    culledInstance0.posY = realY;
                    culledInstance0.fade = fade;
                    culledInstance0.subId = 1.0; // lodFade = 1.0 (디더 없음)
                    atomicAdd(&wgCountLOD0, 1u);
                } else {
                    // 빌보드 활성 시: 전환 구간([crossFadeStart, crossFadeEnd]) 동안 LOD0과 LOD1 동시 디스패치!
                    if (dist < crossFadeEnd) {
                        // LOD 0 (3D 풀 모델)
                        isLOD0 = true;
                        var lodFade0: f32 = 1.0;
                        if (dist >= crossFadeStart) {
                            // crossFadeStart -> crossFadeEnd 로 갈수록 1.0 -> 0.0 페이드아웃
                            lodFade0 = clamp((crossFadeEnd - dist) / (crossFadeEnd - crossFadeStart), 0.0, 1.0);
                        }
                        culledInstance0 = instance;
                        culledInstance0.posY = realY;
                        culledInstance0.fade = fade;
                        culledInstance0.subId = lodFade0; // subId에 lodFade 비율 전달!
                        atomicAdd(&wgCountLOD0, 1u);
                    }

                    if (dist >= crossFadeStart) {
                        // LOD 1 (십자 빌보드)
                        isLOD1 = true;
                        var lodFade1: f32 = 1.0;
                        if (dist < crossFadeEnd) {
                            // crossFadeStart -> crossFadeEnd 로 갈수록 0.0 -> 1.0 페이드인
                            lodFade1 = clamp((dist - crossFadeStart) / (crossFadeEnd - crossFadeStart), 0.0, 1.0);
                        }
                        culledInstance1 = instance;
                        culledInstance1.posY = realY;
                        culledInstance1.fade = fade;
                        culledInstance1.subId = lodFade1; // subId에 lodFade 비율 전달!
                        atomicAdd(&wgCountLOD1, 1u);
                    }
                }
            }
        }
    }
    }

    workgroupBarrier();

    // Workgroup Leader가 Multi-Indirect Buffer 슬롯에 원자적 가산
    if (localIdx == 0u) {
        let countLOD0 = atomicLoad(&wgCountLOD0);
        if (countLOD0 > 0u) {
            wgGlobalOffsetLOD0 = atomicAdd(&indirectDrawCommands[0].instanceCount, countLOD0);
            let numLOD0 = cullingUniforms.lod0SubMeshCount;
            for (var s: u32 = 1u; s < numLOD0; s = s + 1u) {
                atomicAdd(&indirectDrawCommands[s].instanceCount, countLOD0);
            }
        }

        let countLOD1 = atomicLoad(&wgCountLOD1);
        if (countLOD1 > 0u && cullingUniforms.hasBillboard != 0u) {
            let billboardSlot = cullingUniforms.lod0SubMeshCount;
            wgGlobalOffsetLOD1 = atomicAdd(&indirectDrawCommands[billboardSlot].instanceCount, countLOD1);
        }
    }

    workgroupBarrier();

    // 통과한 인스턴스 정밀 할당 및 VRAM 버퍼 쓰기
    if (isLOD0) {
        let slot0 = atomicAdd(&wgLocalSlotLOD0, 1u);
        let outIdx0 = wgGlobalOffsetLOD0 + slot0;
        culledInstanceBuffer[outIdx0] = culledInstance0;
    }
    if (isLOD1) {
        let slot1 = atomicAdd(&wgLocalSlotLOD1, 1u);
        let maxInstances = cullingUniforms.maxInstances;
        let outIdx1 = maxInstances + wgGlobalOffsetLOD1 + slot1;
        culledInstanceBuffer[outIdx1] = culledInstance1;
    }
}
