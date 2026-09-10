struct GrassInstance {
    posX: f32,
    posY: f32,
    posZ: f32,
    rotationY: f32,
    scaleXZ: f32,
    scaleY: f32,
    packedNormal: u32,
    packedGroundColor: u32,
};

struct GrassTypeParam {
    cullingDistance: f32,
    fadeStartDistance: f32,
    shrinkStartDistance: f32,
    bottomOffset: f32,
    groundBlendStrength: f32,
    meshHeight: f32,
    rawBaseOffset: u32,
    activeCount: u32,
    culledBaseOffset: u32,
    indirectBaseOffset: u32,
    lodCount: u32,
    maxInstancesPerLod: u32,
    lodDistance0: f32,
    lodDistance1: f32,
    lodDistance2: f32,
    lodDistance3: f32,
    minSlopeTan2: f32,
    maxSlopeTan2: f32,
    hasSlopeFilter: u32,
    _pad0: f32,
};

struct BakeUniforms {
    invWorldSizeX: f32,
    invWorldSizeZ: f32,
    heightScale: f32,
    totalTasks: u32,
    hasVBT: u32,
    _pad0: u32,
    _pad1: u32,
    _pad2: u32,
};

struct BakeTask {
    instanceIndex: u32,
    typeId: u32,
};

@group(0) @binding(0) var<storage, read_write> rawInstances: array<GrassInstance>;
@group(0) @binding(1) var<uniform> bakeUniforms: BakeUniforms;
@group(0) @binding(2) var<storage, read> typeParams: array<GrassTypeParam>;
@group(0) @binding(3) var<storage, read> bakeTasks: array<BakeTask>;
@group(0) @binding(4) var vhtTexture: texture_2d<f32>;
@group(0) @binding(5) var vhtSampler: sampler;
@group(0) @binding(6) var vbtTexture: texture_2d<f32>;
@group(0) @binding(7) var vbtSampler: sampler;

@compute @workgroup_size(64, 1, 1)
fn main(@builtin(global_invocation_id) globalId: vec3<u32>) {
    let taskIdx = globalId.x;
    if (taskIdx >= bakeUniforms.totalTasks) {
        return;
    }

    let task = bakeTasks[taskIdx];
    let instIdx = task.instanceIndex;
    let typeInfo = typeParams[task.typeId];
    let inst = rawInstances[instIdx];

    // 영구 기각된 슬롯(스플랫맵 필터 탈락 등)은 즉시 탈출
    if (inst.posY < -900000.0) {
        return;
    }

    let u = inst.posX * bakeUniforms.invWorldSizeX + 0.5;
    let v = inst.posZ * bakeUniforms.invWorldSizeZ + 0.5;
    if (u < 0.0 || u > 1.0 || v < 0.0 || v > 1.0) {
        rawInstances[instIdx].posY = -999999.0;
        return;
    }

    let stepWorld = 2.0;
    let du = stepWorld * bakeUniforms.invWorldSizeX;
    let dv = stepWorld * bakeUniforms.invWorldSizeZ;

    let sampledHeight = textureSampleLevel(vhtTexture, vhtSampler, vec2<f32>(u, v), 0.0).r;
    let terrainHeight = sampledHeight * bakeUniforms.heightScale;

    let hR = textureSampleLevel(vhtTexture, vhtSampler, vec2<f32>(u + du, v), 0.0).r * bakeUniforms.heightScale;
    let hU = textureSampleLevel(vhtTexture, vhtSampler, vec2<f32>(u, v + dv), 0.0).r * bakeUniforms.heightScale;
    let hL = textureSampleLevel(vhtTexture, vhtSampler, vec2<f32>(u - du, v), 0.0).r * bakeUniforms.heightScale;
    let hD = textureSampleLevel(vhtTexture, vhtSampler, vec2<f32>(u, v - dv), 0.0).r * bakeUniforms.heightScale;

    // 경사도 필터 검사 (스폰 시 1회만 판정 후 영구 저장)
    let rawNx = (hL - hR) / (stepWorld * 2.0);
    let rawNz = (hD - hU) / (stepWorld * 2.0);
    let slopeTan2 = rawNx * rawNx + rawNz * rawNz;
    if (typeInfo.hasSlopeFilter != 0u && (slopeTan2 < typeInfo.minSlopeTan2 || slopeTan2 > typeInfo.maxSlopeTan2)) {
        rawInstances[instIdx].posY = -999999.0; // 경사도 불만족 시 영구 기각 마킹
        return;
    }

    // 언리얼 표준 지형 법선 계산 (75% 노멀 블렌드)
    let terrainN = normalize(vec3<f32>(rawNx, 1.0, rawNz));
    let blendedN = normalize(mix(vec3<f32>(0.0, 1.0, 0.0), terrainN, 0.75));

    let bakedY = terrainHeight + typeInfo.bottomOffset;
    rawInstances[instIdx].posY = bakedY;

    // 🌿 법선 X, Z 성분을 16비트 정규화 패킹 (정밀도 1/32767 완벽 보존)
    rawInstances[instIdx].packedNormal = pack2x16snorm(vec2<f32>(blendedN.x, blendedN.z));

    // 🌿 밑동 지형 소프트 블렌딩용 지면 컬러 1회성 베이크 (8비트 RGBA 패킹)
    var groundColor = vec3<f32>(0.0);
    if (bakeUniforms.hasVBT != 0u) {
        let groundTex = textureSampleLevel(vbtTexture, vbtSampler, vec2<f32>(u, v), 0.0);
        if (groundTex.a > 0.1) {
            groundColor = groundTex.rgb;
        }
    }
    rawInstances[instIdx].packedGroundColor = pack4x8unorm(vec4<f32>(groundColor, 1.0));
}
