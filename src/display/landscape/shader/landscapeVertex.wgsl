#redgpu_include SYSTEM_UNIFORM;
#redgpu_include shadow.getShadowClipPosition;
#redgpu_include systemStruct.OutputShadowData;

struct TileInstance {
    color: vec4<f32>,
    worldX: f32,
    worldZ: f32,
};

struct LandscapeUniforms {
    heightScale: f32,
    worldSizeX: f32,
    worldSizeZ: f32,
    lodColoration: f32,
    maxComponentCount: u32,
    tileSizeX: f32,
    tileSizeZ: f32,
    baseQuads: f32,
    vhtTextureSize: vec2<f32>,
    lodFadeStartRatio: f32,
    lodGeomorphStartRatio: f32,
    lodColors: array<vec4<f32>, 8>,
    lodDistancesSq: array<vec4<f32>, 2>,
    tanHalfFOV: f32,
    lodMetric: f32,
    lod0Quads: f32,
    receiveShadow: f32,
    heightmapShadow: f32,
    heightmapShadowSteps: f32,
    heightmapShadowDistance: f32,
    heightmapShadowSoftness: f32,
};

@group(1) @binding(0) var<storage, read> allInputTiles: array<TileInstance>;
@group(1) @binding(1) var<storage, read> visibleTileIndices: array<u32>;
@group(1) @binding(2) var heightMapSampler: sampler;
@group(1) @binding(3) var heightMapTexture: texture_2d<f32>;
@group(1) @binding(5) var<uniform> landscapeUniforms: LandscapeUniforms;

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
};

struct ComputedTerrainVertex {
    worldPos: vec4<f32>,
    globalUV: vec2<f32>,
    worldTileUV: vec2<f32>,
    lodLevel: u32,
    instanceColor: vec4<f32>,
};

fn computeTerrainVertex(input: InputData) -> ComputedTerrainVertex {
    var res: ComputedTerrainVertex;
    let realTileIdx = visibleTileIndices[input.instanceIdx];
    let instanceData = allInputTiles[realTileIdx];

    let maxCompCount = max(1u, landscapeUniforms.maxComponentCount);
    let lodLevel = input.instanceIdx / maxCompCount;

    let worldX = input.position.x + instanceData.worldX;
    let worldZ = input.position.y + instanceData.worldZ;

    let globalUV = vec2<f32>(
        (worldX + landscapeUniforms.worldSizeX * 0.5) / landscapeUniforms.worldSizeX,
        (worldZ + landscapeUniforms.worldSizeZ * 0.5) / landscapeUniforms.worldSizeZ
    );

    let texSize = landscapeUniforms.vhtTextureSize;
    let texCoord = vec2<i32>(clamp(globalUV * texSize, vec2<f32>(0.0), texSize - vec2<f32>(1.0)));

    let currentHeight = textureLoad(heightMapTexture, texCoord, 0).r;
    var finalHeight = currentHeight;
    // 🚀 [최적화] 근거리(LOD 0~1) 정점에서만 지오모핑 4중 텍스처 로드를 수행하고, 원경(LOD 2~7)은 즉각 단일 로드로 바이패스
    if (lodLevel < 2u) {
        let camPos = systemUniforms.camera.cameraPosition.xyz;
        let dx = worldX - camPos.x;
        let dz = worldZ - camPos.z;
        let dy = camPos.y;
        let distSq = dx * dx + dz * dz + dy * dy;

        let currentPacked = landscapeUniforms.lodDistancesSq[0];
        let currentThresholdSq = select(currentPacked.x, currentPacked.y, lodLevel == 1u);

        if (currentThresholdSq < 1e14) {
            let nextDist = sqrt(currentThresholdSq);
            let prevDist = select(0.0, sqrt(currentPacked.x), lodLevel == 1u);

            let maxTileDim = max(landscapeUniforms.tileSizeX, landscapeUniforms.tileSizeZ);
            let tileRadius = maxTileDim * 0.7071;

            let morphEndDist = max(prevDist + 1.0, nextDist - tileRadius);
            let morphRange = max(1.0, morphEndDist - prevDist);

            let morphRatio = clamp(landscapeUniforms.lodGeomorphStartRatio, 0.01, 0.99);
            let morphStartDist = prevDist + morphRange * morphRatio;

            let isScreenSize = landscapeUniforms.lodMetric >= 0.5;
            let effMorphStart = select(morphStartDist, morphStartDist / max(1e-4, landscapeUniforms.tanHalfFOV), isScreenSize);

            // 🚀 [최적화 VS-2] 모핑 범위에 도달하지 않은 대다수 정점(70%+)은 sqrt 및 모핑 로직 0회 즉시 스킵!
            if (distSq >= effMorphStart * effMorphStart) {
                let rawDist = sqrt(distSq);
                let dist = select(rawDist, rawDist * landscapeUniforms.tanHalfFOV, isScreenSize);

                let morphFactor = clamp((dist - morphStartDist) / max(0.001, morphEndDist - morphStartDist), 0.0, 1.0);
                let smoothMorph = smoothstep(0.0, 1.0, morphFactor);

                if (smoothMorph > 0.0001) {
                    let lod0Quads = max(1.0, landscapeUniforms.lod0Quads);
                    let baseQuads = max(1.0, landscapeUniforms.baseQuads);

                    var currentSegments: f32;
                    var subStep: u32;

                    if (lodLevel == 0u) {
                        currentSegments = lod0Quads;
                        subStep = max(1u, u32(round(lod0Quads / baseQuads)));
                    } else {
                        // 🚀 [최적화 VS-1] lodLevel < 2u 가드 내 else는 무조건 lodLevel == 1u (step = 1.0 확정)이므로 pow SFU 완전 박멸!
                        currentSegments = max(1.0, floor(baseQuads));
                        subStep = 2u;
                    }

                    let halfTileX = landscapeUniforms.tileSizeX * 0.5;
                    let halfTileZ = landscapeUniforms.tileSizeZ * 0.5;

                    let gridStepX = landscapeUniforms.tileSizeX / currentSegments;
                    let gridStepZ = landscapeUniforms.tileSizeZ / currentSegments;

                    let gridIdxX = u32(round((input.position.x + halfTileX) / gridStepX) + 0.1);
                    let gridIdxZ = u32(round((input.position.y + halfTileZ) / gridStepZ) + 0.1);

                    let isMorphX = (gridIdxX % subStep) != 0u;
                    let isMorphZ = (gridIdxZ % subStep) != 0u;

                    if (isMorphX || isMorphZ) {
                        let fracX = f32(gridIdxX % subStep) / f32(subStep);
                        let fracZ = f32(gridIdxZ % subStep) / f32(subStep);
                        let uvBaseX = f32(gridIdxX - (gridIdxX % subStep)) * (landscapeUniforms.tileSizeX / (landscapeUniforms.worldSizeX * currentSegments));
                        let uvBaseZ = f32(gridIdxZ - (gridIdxZ % subStep)) * (landscapeUniforms.tileSizeZ / (landscapeUniforms.worldSizeZ * currentSegments));
                        let uvSpanX = f32(subStep) * (landscapeUniforms.tileSizeX / (landscapeUniforms.worldSizeX * currentSegments));
                        let uvSpanZ = f32(subStep) * (landscapeUniforms.tileSizeZ / (landscapeUniforms.worldSizeZ * currentSegments));

                        let tileOriginUV = vec2<f32>(
                            (instanceData.worldX - halfTileX + landscapeUniforms.worldSizeX * 0.5) / landscapeUniforms.worldSizeX,
                            (instanceData.worldZ - halfTileZ + landscapeUniforms.worldSizeZ * 0.5) / landscapeUniforms.worldSizeZ
                        );

                        let c00 = vec2<i32>(clamp((tileOriginUV + vec2<f32>(uvBaseX, uvBaseZ)) * texSize, vec2<f32>(0.0), texSize - vec2<f32>(1.0)));
                        let c10 = vec2<i32>(clamp((tileOriginUV + vec2<f32>(uvBaseX + uvSpanX, uvBaseZ)) * texSize, vec2<f32>(0.0), texSize - vec2<f32>(1.0)));
                        let c01 = vec2<i32>(clamp((tileOriginUV + vec2<f32>(uvBaseX, uvBaseZ + uvSpanZ)) * texSize, vec2<f32>(0.0), texSize - vec2<f32>(1.0)));
                        let c11 = vec2<i32>(clamp((tileOriginUV + vec2<f32>(uvBaseX + uvSpanX, uvBaseZ + uvSpanZ)) * texSize, vec2<f32>(0.0), texSize - vec2<f32>(1.0)));

                        let h00 = textureLoad(heightMapTexture, c00, 0).r;
                        let h10 = textureLoad(heightMapTexture, c10, 0).r;
                        let h01 = textureLoad(heightMapTexture, c01, 0).r;
                        let h11 = textureLoad(heightMapTexture, c11, 0).r;

                        let targetHeight = mix(mix(h00, h10, fracX), mix(h01, h11, fracX), fracZ);
                        finalHeight = mix(currentHeight, targetHeight, smoothMorph);
                    }
                }
            }
        }
    }

    let isSkirt = input.position.z < -0.5;
    let lodMultiplier = 1.0 + f32(lodLevel) * 0.5;
    let dynamicSkirtDepth = -max(30.0, landscapeUniforms.heightScale * 0.15 * lodMultiplier);

    let worldY = finalHeight * landscapeUniforms.heightScale + select(0.0, dynamicSkirtDepth, isSkirt);

    res.worldPos = vec4<f32>(worldX, worldY, worldZ, 1.0);
    res.globalUV = globalUV;
    let halfTileX = landscapeUniforms.tileSizeX * 0.5;
    let halfTileZ = landscapeUniforms.tileSizeZ * 0.5;
    res.worldTileUV = vec2<f32>(
        (input.position.x + halfTileX) / landscapeUniforms.tileSizeX,
        (input.position.y + halfTileZ) / landscapeUniforms.tileSizeZ
    );
    res.lodLevel = lodLevel;
    if (landscapeUniforms.lodColoration > 0.5) {
        res.instanceColor = landscapeUniforms.lodColors[min(lodLevel, 7u)];
    } else {
        res.instanceColor = instanceData.color;
    }
    return res;
}

@vertex
fn main(input: InputData) -> OutputData {
    var output: OutputData;
    let computed = computeTerrainVertex(input);
    let worldPos4 = computed.worldPos;

    let clipPos = systemUniforms.projection.projectionViewMatrix * worldPos4;

    output.position = clipPos;
    output.vertexPosition = worldPos4.xyz;
    output.uv = computed.worldTileUV;
    output.uv1 = computed.globalUV;

    output.currentClipPos = systemUniforms.projection.noneJitterProjectionViewMatrix * worldPos4;
    output.prevClipPos = systemUniforms.projection.prevNoneJitterProjectionViewMatrix * worldPos4;
    output.instanceColor = computed.instanceColor;
    output.lodLevel = f32(computed.lodLevel);
    output.receiveShadow = landscapeUniforms.receiveShadow;

    return output;
}

@vertex
fn entryPointShadowVertex(input: InputData) -> OutputShadowData {
    var output: OutputShadowData;
    let computed = computeTerrainVertex(input);
    output.position = getShadowClipPosition(computed.worldPos.xyz, systemUniforms.directionalLightProjectionViewMatrix);
    return output;
}
