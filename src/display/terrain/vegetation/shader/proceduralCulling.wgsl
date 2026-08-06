// ProceduralInstancingMesh GPU Culling & Splatmap Masking Compute Shader
// RedGPU System Uniforms + Distance Culling (Max Draw Distance) 개편

#redgpu_include SYSTEM_UNIFORM;

struct ProceduralInstance {
    x: f32,
    z: f32,
    rotY: f32,
    scaleXZ: f32,
    scaleY: f32,
    windOffset: f32,
    _pad0: f32,
    _pad1: f32,
};

struct ProceduralCullingUniforms {
    instanceCount: u32,
    boundingRadiusScale: f32,
    globalFragmentSlotIndex: u32,
    maxDistanceSq: f32,         // 식생 최대 가시거리 제곱 (Distance Culling!)
    groupModelMatrix: mat4x4<f32>,
    // 지형 매핑용 정보
    worldSize: vec2<f32>,
    worldOffset: vec2<f32>,
    maxHeight: f32,
    minHeight: f32,
    // Splatmap 마스킹 정보
    maskChannel: u32,       // 0=R, 1=G(Grass), 2=B, 3=A
    maskThreshold: f32,     // 생장 최저 농도 (기본 0.15)
    padding1: vec2<f32>,
};

struct VisibilityData {
    instanceIdx: u32,
    globalFragmentSlotIndex: u32,
};

struct IndirectDrawArgs {
    vertexCount: u32,
    instanceCount: atomic<u32>,
    firstVertex: u32,
    baseVertex: u32,
    firstInstance: u32,
};

// Group 1: Procedural Instancing Culling 전용 바인딩
@group(1) @binding(0) var<storage, read> instances: array<ProceduralInstance>;
@group(1) @binding(1) var<storage, read> cullingUniforms: ProceduralCullingUniforms;
@group(1) @binding(2) var<storage, read_write> visibilityBuffer: array<VisibilityData>;
@group(1) @binding(3) var<storage, read_write> indirectDrawBuffer: IndirectDrawArgs;
@group(1) @binding(4) var heightmapSampler: sampler;
@group(1) @binding(5) var heightAtlasTexture: texture_2d<f32>;
@group(1) @binding(6) var splatTexture: texture_2d<f32>;

// RedGPU systemUniforms.projection.projectionViewMatrix 중심 Clip-space Frustum Culling 판정!
fn isInsideFrustum(worldPos: vec3<f32>, radius: f32) -> bool {
    let m = systemUniforms.projection.projectionViewMatrix;
    let clipPos = m * vec4<f32>(worldPos, 1.0);
    
    let w = clipPos.w;
    let margin = radius * 2.0; 
    let wMargin = w + margin;

    if (clipPos.x < -wMargin || clipPos.x > wMargin) {
        return false;
    }
    if (clipPos.y < -wMargin || clipPos.y > wMargin) {
        return false;
    }
    if (clipPos.z < -margin || clipPos.z > wMargin) {
        return false;
    }

    return true;
}

@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) globalId: vec3<u32>) {
    let idx = globalId.x;
    if (idx >= cullingUniforms.instanceCount) {
        return;
    }

    let inst = instances[idx];

    // [성능 1순위 최적화] Distance Culling (Max Draw Distance Early Exit):
    // 식생 가시거리(예: 1500m) 바깥에 있는 수십만 개의 인스턴스는 0.000001ms 만에 초고속 탈락!
    let dx = inst.x - systemUniforms.camera.cameraPosition.x;
    let dz = inst.z - systemUniforms.camera.cameraPosition.z;
    let distSq = dx * dx + dz * dz;

    if (distSq > cullingUniforms.maxDistanceSq) {
        return; // 가시거리 밖 식생 즉시 탈락!
    }

    // 1. Terrain UV 계산 (0.0 ~ 1.0)
    let terrainUV = clamp(
        vec2<f32>(
            (inst.x - cullingUniforms.worldOffset.x) / cullingUniforms.worldSize.x,
            1.0 - (inst.z - cullingUniforms.worldOffset.y) / cullingUniforms.worldSize.y
        ),
        vec2<f32>(0.0),
        vec2<f32>(1.0)
    );

    // 2. Heightmap을 먼저 샘플링하여 실제 인스턴스의 정확한 Y 높이 복원
    let sampledRatio = textureSampleLevel(heightAtlasTexture, heightmapSampler, terrainUV, 0.0).r;
    let terrainY = cullingUniforms.minHeight + sampledRatio * (cullingUniforms.maxHeight - cullingUniforms.minHeight);

    let localPos = vec4<f32>(inst.x, terrainY, inst.z, 1.0);
    let worldPosVec4 = cullingUniforms.groupModelMatrix * localPos;
    let worldPos = worldPosVec4.xyz;

    // 3. RedGPU systemUniforms.projection.projectionViewMatrix 행렬로 Frustum Culling 판정!
    let scaleX = length(cullingUniforms.groupModelMatrix[0].xyz);
    let radius = inst.scaleXZ * cullingUniforms.boundingRadiusScale * scaleX;

    if (!isInsideFrustum(worldPos, radius)) {
        return; // 시야 밖 인스턴스 탈락
    }

    // 4. GPU Splatmap Texture 직접 샘플링 마스킹
    let splatColor = textureSampleLevel(splatTexture, heightmapSampler, terrainUV, 0.0);
    var density: f32 = splatColor.g;
    if (cullingUniforms.maskChannel == 0u) {
        density = splatColor.r;
    } else if (cullingUniforms.maskChannel == 2u) {
        density = splatColor.b;
    } else if (cullingUniforms.maskChannel == 3u) {
        density = splatColor.a;
    }

    // splatTexture 예외 안전 가드
    let isSplatValid = (splatColor.r + splatColor.g + splatColor.b + splatColor.a) > 0.001;
    if (isSplatValid && density < cullingUniforms.maskThreshold) {
        return;
    }

    // 5. 통과 인스턴스 기록
    let aliveIndex = atomicAdd(&indirectDrawBuffer.instanceCount, 1u);
    visibilityBuffer[aliveIndex].instanceIdx = idx;
    visibilityBuffer[aliveIndex].globalFragmentSlotIndex = cullingUniforms.globalFragmentSlotIndex;
}
