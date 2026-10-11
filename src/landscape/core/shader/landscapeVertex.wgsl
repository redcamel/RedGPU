#redgpu_include SYSTEM_UNIFORM;
#redgpu_include shadow.getShadowClipPosition;
#redgpu_include systemStruct.OutputShadowData;
#redgpu_include landscape.struct.LandscapeUniforms;
#redgpu_include landscape.struct.LandscapeTile;

@group(1) @binding(0) var<storage, read> visibleTiles: array<LandscapeTile>;
@group(1) @binding(2) var heightMapTexture: texture_2d<f32>;
@group(1) @binding(4) var<uniform> landscapeUniforms: LandscapeUniforms;

fn getLodMorphStartDist(lod: u32) -> f32 {
    let packedVec = landscapeUniforms.lodMorphStartDistances[lod / 4u];
    return packedVec[lod % 4u];
}

fn getLodInvMorphRange(lod: u32) -> f32 {
    let packedVec = landscapeUniforms.lodInvMorphRanges[lod / 4u];
    return packedVec[lod % 4u];
}

fn sampleHeightBilinear(uv: vec2<f32>, texSize: vec2<f32>) -> f32 {
    let p = clamp(uv * texSize - vec2<f32>(0.5), vec2<f32>(0.0), texSize - vec2<f32>(1.0));
    let base = vec2<i32>(floor(p));
    let f = fract(p);

    let maxCoord = vec2<i32>(texSize - vec2<f32>(1.0));
    let c00 = base;
    let c10 = min(base + vec2<i32>(1, 0), maxCoord);
    let c01 = min(base + vec2<i32>(0, 1), maxCoord);
    let c11 = min(base + vec2<i32>(1, 1), maxCoord);

    let h00 = textureLoad(heightMapTexture, c00, 0).r;
    let h10 = textureLoad(heightMapTexture, c10, 0).r;
    let h01 = textureLoad(heightMapTexture, c01, 0).r;
    let h11 = textureLoad(heightMapTexture, c11, 0).r;

    return mix(mix(h00, h10, f.x), mix(h01, h11, f.x), f.y);
}

struct InputData {
    @location(0) position: vec3<f32>,
    @location(1) uv: vec2<f32>,
    @builtin(instance_index) instanceIdx: u32,
};

struct OutputData {
    @builtin(position) position: vec4<f32>,
    @location(0) vertexPosition: vec3<f32>,
    @location(1) uv: vec2<f32>,
    @location(2) uv1: vec2<f32>,
    @location(3) currentClipPos: vec4<f32>,
    @location(4) prevClipPos: vec4<f32>,
    @location(5) instanceColor: vec4<f32>,
    @location(6) @interpolate(flat) lodLevel: f32,
    @location(7) @interpolate(flat) receiveShadow: f32,
    @location(8) viewDepth: f32,
};

struct ComputedTerrainVertex {
    worldPos: vec4<f32>,
    instanceColor: vec4<f32>,
    globalUV: vec2<f32>,
    worldTileUV: vec2<f32>,
    lodLevel: u32,
};

fn computeTerrainVertex(input: InputData) -> ComputedTerrainVertex {
    var res: ComputedTerrainVertex;
    let instanceData = visibleTiles[input.instanceIdx];

    let maxCompCount = max(1u, landscapeUniforms.maxComponentCount);
    let lodLevel = input.instanceIdx / maxCompCount;

    let halfTileX = landscapeUniforms.tileSizeX * 0.5;
    let halfTileZ = landscapeUniforms.tileSizeZ * 0.5;

    let initialWorldX = input.position.x + instanceData.centerWorldX;
    let initialWorldZ = input.position.y + instanceData.centerWorldZ;

    let initialGlobalUV = vec2<f32>(
        (initialWorldX + landscapeUniforms.worldSizeX * 0.5) / landscapeUniforms.worldSizeX,
        (initialWorldZ + landscapeUniforms.worldSizeZ * 0.5) / landscapeUniforms.worldSizeZ
    );

    let texSize = landscapeUniforms.vhtTextureSize;
    let initialTexCoord = vec2<i32>(clamp(initialGlobalUV * texSize, vec2<f32>(0.0), texSize - vec2<f32>(1.0)));
    let initialHeight = textureLoad(heightMapTexture, initialTexCoord, 0).r;

    let camPos = systemUniforms.camera.cameraPosition.xyz;
    let dx = initialWorldX - camPos.x;
    let dz = initialWorldZ - camPos.z;
    let dy = initialHeight * landscapeUniforms.heightScale - camPos.y;
    let distSq = dx * dx + dz * dz + dy * dy;

    let isScreenSize = landscapeUniforms.lodMetric >= 0.5;
    let metricFactor = select(1.0, landscapeUniforms.tanHalfFOV, isScreenSize);
    let effectiveDist = sqrt(distSq) * metricFactor;

    let morphStartDist = getLodMorphStartDist(lodLevel);
    var smoothMorph = 0.0;

    if (effectiveDist >= morphStartDist) {
        let invMorphRange = getLodInvMorphRange(lodLevel);
        let morphFactor = saturate((effectiveDist - morphStartDist) * invMorphRange);
        smoothMorph = smoothstep(0.0, 1.0, morphFactor);
    }

    var currentSegments: f32;
    var subStep: u32;

    if (lodLevel == 0u) {
        let lod0Q = max(1.0, landscapeUniforms.lod0Quads);
        let baseQ = max(1.0, landscapeUniforms.baseQuads);
        currentSegments = lod0Q;
        subStep = max(1u, u32(round(lod0Q / baseQ)));
    } else {
        let stepShift = min(31u, lodLevel - 1u);
        let step = f32(1u << stepShift);
        currentSegments = max(1.0, floor(landscapeUniforms.baseQuads / step));
        subStep = 2u;
    }

    var morphedWorldX = initialWorldX;
    var morphedWorldZ = initialWorldZ;
    var morphedUV = input.uv;
    var morphedGlobalUV = initialGlobalUV;
    var finalHeight = initialHeight;

    if (smoothMorph > 0.0001 && subStep > 1u) {
        let parentSegments = max(1.0, currentSegments / f32(subStep));
        let targetUV = round(input.uv * parentSegments) / parentSegments;

        morphedUV = mix(input.uv, targetUV, smoothMorph);

        let morphedLocalX = morphedUV.x * landscapeUniforms.tileSizeX - halfTileX;
        let morphedLocalZ = morphedUV.y * landscapeUniforms.tileSizeZ - halfTileZ;

        morphedWorldX = morphedLocalX + instanceData.centerWorldX;
        morphedWorldZ = morphedLocalZ + instanceData.centerWorldZ;

        morphedGlobalUV = vec2<f32>(
            (morphedWorldX + landscapeUniforms.worldSizeX * 0.5) / landscapeUniforms.worldSizeX,
            (morphedWorldZ + landscapeUniforms.worldSizeZ * 0.5) / landscapeUniforms.worldSizeZ
        );

        finalHeight = sampleHeightBilinear(morphedGlobalUV, texSize);
    }

    let isSkirt = input.position.z < -0.5;
    var worldY = finalHeight * landscapeUniforms.heightScale;
    if (isSkirt) {
        let lodMultiplier = 1.0 + f32(lodLevel) * 0.5;
        let dynamicSkirtDepth = -max(30.0, landscapeUniforms.heightScale * (0.15 * lodMultiplier));
        worldY += dynamicSkirtDepth;
    }

    res.worldPos = vec4<f32>(morphedWorldX, worldY, morphedWorldZ, 1.0);
    res.globalUV = morphedGlobalUV;
    res.worldTileUV = morphedUV;
    res.lodLevel = lodLevel;
    if (landscapeUniforms.lodColoration > 0.5) {
        res.instanceColor = landscapeUniforms.lodColors[min(lodLevel, 7u)];
    } else {
        res.instanceColor = vec4<f32>(0.0);
    }
    return res;
}

@vertex
fn main(input: InputData) -> OutputData {
    var output: OutputData;
    let computed = computeTerrainVertex(input);
    let worldPos4 = computed.worldPos;

    let relPos = worldPos4.xyz - systemUniforms.camera.cameraPosition;
    let viewPos = mat3x3<f32>(
        systemUniforms.camera.viewMatrix[0].xyz,
        systemUniforms.camera.viewMatrix[1].xyz,
        systemUniforms.camera.viewMatrix[2].xyz
    ) * relPos;

    output.position = systemUniforms.projection.projectionMatrix * vec4<f32>(viewPos, 1.0);
    output.vertexPosition = worldPos4.xyz;
    output.uv = computed.worldTileUV;
    output.uv1 = computed.globalUV;

    output.currentClipPos = systemUniforms.projection.noneJitterProjectionMatrix * vec4<f32>(viewPos, 1.0);
    output.prevClipPos = systemUniforms.projection.prevNoneJitterProjectionViewMatrix * worldPos4;
    output.instanceColor = computed.instanceColor;
    output.lodLevel = f32(computed.lodLevel);

    // 🚀 [조기 탈락 1단계] CSM 최대 유효 거리 + 타일 반경 마진을 초과한 원경 버텍스는 그림자 수신을 0.0으로 사전 차단
    let viewDepth = -viewPos.z;
    var receiveShadow = 0.0;
    if (landscapeUniforms.receiveShadow > 0.5) {
        let cascadeCount = min(4u, max(1u, systemUniforms.shadow.cascadeCount));
        let maxCSMDist = systemUniforms.shadow.cascadeSplitDepths[cascadeCount - 1u];
        let tileRadius = max(landscapeUniforms.tileSizeX, landscapeUniforms.tileSizeZ) * 0.75;
        if (viewDepth < (maxCSMDist + tileRadius)) {
            receiveShadow = landscapeUniforms.receiveShadow;
        }
    }
    output.receiveShadow = receiveShadow;
    output.viewDepth = viewDepth;

    return output;
}
