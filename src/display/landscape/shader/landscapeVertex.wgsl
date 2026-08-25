#redgpu_include SYSTEM_UNIFORM;

struct TileInstance {
    worldX: f32,
    worldZ: f32,
    prevWorldX: f32,
    prevWorldZ: f32,
    color: vec4<f32>,
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
    pad0: f32,
    pad1: f32,
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
    @location(1) vertexNormal: vec3<f32>,
    @location(2) uv: vec2<f32>,
    @location(3) uv1: vec2<f32>,
    @location(4) vertexColor_0: vec4<f32>,
    @location(5) vertexTangent: vec4<f32>,
    @location(6) vertexHeight: f32,
    @location(7) currentClipPos: vec4<f32>,
    @location(8) prevClipPos: vec4<f32>,
    @location(9) instanceColor: vec4<f32>,
    @location(10) @interpolate(flat) lodLevel: f32,
};

@vertex
fn main(input: InputData) -> OutputData {
    var output: OutputData;

    let realTileIdx = visibleTileIndices[input.instanceIdx];
    let instanceData = allInputTiles[realTileIdx];

    let maxCompCount = max(1u, landscapeUniforms.maxComponentCount);
    let lodLevel = input.instanceIdx / maxCompCount;

    let worldX = input.position.x + instanceData.worldX;
    let worldZ = input.position.y + instanceData.worldZ;
    let prevWorldX = input.position.x + instanceData.prevWorldX;
    let prevWorldZ = input.position.y + instanceData.prevWorldZ;

    let globalUV = vec2<f32>(
        (worldX + landscapeUniforms.worldSizeX * 0.5) / landscapeUniforms.worldSizeX,
        (worldZ + landscapeUniforms.worldSizeZ * 0.5) / landscapeUniforms.worldSizeZ
    );
    let prevGlobalUV = vec2<f32>(
        (prevWorldX + landscapeUniforms.worldSizeX * 0.5) / landscapeUniforms.worldSizeX,
        (prevWorldZ + landscapeUniforms.worldSizeZ * 0.5) / landscapeUniforms.worldSizeZ
    );

    let texSize = landscapeUniforms.vhtTextureSize;
    let texCoord = vec2<i32>(clamp(globalUV * texSize, vec2<f32>(0.0), texSize - vec2<f32>(1.0)));

    let currentHeight = textureLoad(heightMapTexture, texCoord, 0).r;
    var finalHeight = currentHeight;

    if (lodLevel < 7u) {
        let camPos = systemUniforms.camera.cameraPosition.xyz;
        let dx = worldX - camPos.x;
        let dz = worldZ - camPos.z;
        let dy = camPos.y;
        let rawDist = sqrt(dx * dx + dz * dz + dy * dy);
        let isScreenSize = landscapeUniforms.lodMetric >= 0.5;
        let dist = select(rawDist, rawDist * landscapeUniforms.tanHalfFOV, isScreenSize);

        let currentPacked = landscapeUniforms.lodDistancesSq[lodLevel / 4u];
        let currentThresholdSq = currentPacked[lodLevel % 4u];

        if (currentThresholdSq < 1e14) {
            let nextDist = sqrt(currentThresholdSq);
            var prevDist = 0.0;
            if (lodLevel > 0u) {
                let prevPacked = landscapeUniforms.lodDistancesSq[(lodLevel - 1u) / 4u];
                prevDist = sqrt(prevPacked[(lodLevel - 1u) % 4u]);
            }

            let maxTileDim = max(landscapeUniforms.tileSizeX, landscapeUniforms.tileSizeZ);
            let tileRadius = maxTileDim * 0.7071;

            let morphEndDist = max(prevDist + 1.0, nextDist - tileRadius);
            let morphRange = max(1.0, morphEndDist - prevDist);

            let morphRatio = clamp(landscapeUniforms.lodGeomorphStartRatio, 0.01, 0.99);
            let morphStartDist = prevDist + morphRange * morphRatio;

            let morphFactor = clamp((dist - morphStartDist) / max(0.001, morphEndDist - morphStartDist), 0.0, 1.0);
            let smoothMorph = smoothstep(0.0, 1.0, morphFactor);

            if (smoothMorph > 0.0001) {
                let baseQuads = max(1.0, landscapeUniforms.baseQuads);
                let currentSegments = max(1.0, floor(baseQuads / pow(2.0, f32(lodLevel))));

                let halfTileX = landscapeUniforms.tileSizeX * 0.5;
                let halfTileZ = landscapeUniforms.tileSizeZ * 0.5;

                let gridStepX = landscapeUniforms.tileSizeX / currentSegments;
                let gridStepZ = landscapeUniforms.tileSizeZ / currentSegments;

                let gridIdxX = u32(round((input.position.x + halfTileX) / gridStepX) + 0.1);
                let gridIdxZ = u32(round((input.position.y + halfTileZ) / gridStepZ) + 0.1);

                let isOddX = (gridIdxX % 2u) != 0u;
                let isOddZ = (gridIdxZ % 2u) != 0u;

                if (isOddX || isOddZ) {
                    let uvStepX = landscapeUniforms.tileSizeX / (landscapeUniforms.worldSizeX * currentSegments);
                    let uvStepZ = landscapeUniforms.tileSizeZ / (landscapeUniforms.worldSizeZ * currentSegments);

                    var targetHeight = currentHeight;

                    if (isOddX && !isOddZ) {
                        let cLeft = vec2<i32>(clamp((globalUV - vec2<f32>(uvStepX, 0.0)) * texSize, vec2<f32>(0.0), texSize - vec2<f32>(1.0)));
                        let cRight = vec2<i32>(clamp((globalUV + vec2<f32>(uvStepX, 0.0)) * texSize, vec2<f32>(0.0), texSize - vec2<f32>(1.0)));
                        targetHeight = (textureLoad(heightMapTexture, cLeft, 0).r + textureLoad(heightMapTexture, cRight, 0).r) * 0.5;
                    } else if (!isOddX && isOddZ) {
                        let cTop = vec2<i32>(clamp((globalUV - vec2<f32>(0.0, uvStepZ)) * texSize, vec2<f32>(0.0), texSize - vec2<f32>(1.0)));
                        let cBottom = vec2<i32>(clamp((globalUV + vec2<f32>(0.0, uvStepZ)) * texSize, vec2<f32>(0.0), texSize - vec2<f32>(1.0)));
                        targetHeight = (textureLoad(heightMapTexture, cTop, 0).r + textureLoad(heightMapTexture, cBottom, 0).r) * 0.5;
                    } else {
                        let c00 = vec2<i32>(clamp((globalUV + vec2<f32>(-uvStepX, -uvStepZ)) * texSize, vec2<f32>(0.0), texSize - vec2<f32>(1.0)));
                        let c10 = vec2<i32>(clamp((globalUV + vec2<f32>(uvStepX, -uvStepZ)) * texSize, vec2<f32>(0.0), texSize - vec2<f32>(1.0)));
                        let c01 = vec2<i32>(clamp((globalUV + vec2<f32>(-uvStepX, uvStepZ)) * texSize, vec2<f32>(0.0), texSize - vec2<f32>(1.0)));
                        let c11 = vec2<i32>(clamp((globalUV + vec2<f32>(uvStepX, uvStepZ)) * texSize, vec2<f32>(0.0), texSize - vec2<f32>(1.0)));
                        targetHeight = (
                            textureLoad(heightMapTexture, c00, 0).r +
                            textureLoad(heightMapTexture, c10, 0).r +
                            textureLoad(heightMapTexture, c01, 0).r +
                            textureLoad(heightMapTexture, c11, 0).r
                        ) * 0.25;
                    }

                    finalHeight = mix(currentHeight, targetHeight, smoothMorph);
                }
            }
        }
    }

    var prevHeightValue = finalHeight;
    if (prevWorldX != worldX || prevWorldZ != worldZ) {
        let prevTexCoord = vec2<i32>(clamp(prevGlobalUV * texSize, vec2<f32>(0.0), texSize - vec2<f32>(1.0)));
        prevHeightValue = textureLoad(heightMapTexture, prevTexCoord, 0).r;
    }

    let isSkirt = input.position.z < -0.5;
    let lodMultiplier = 1.0 + f32(lodLevel) * 0.5;
    let dynamicSkirtDepth = -max(30.0, landscapeUniforms.heightScale * 0.15 * lodMultiplier);

    let worldY = finalHeight * landscapeUniforms.heightScale + select(0.0, dynamicSkirtDepth, isSkirt);
    let prevWorldY = prevHeightValue * landscapeUniforms.heightScale + select(0.0, dynamicSkirtDepth, isSkirt);

    let worldPos4 = vec4<f32>(worldX, worldY, worldZ, 1.0);
    let prevWorldPos4 = vec4<f32>(prevWorldX, prevWorldY, prevWorldZ, 1.0);

    let clipPos = systemUniforms.projection.projectionViewMatrix * worldPos4;

    output.position = clipPos;
    output.vertexPosition = worldPos4.xyz;
    output.vertexNormal = vec3<f32>(0.0, 1.0, 0.0);

    let halfTileX = landscapeUniforms.tileSizeX * 0.5;
    let halfTileZ = landscapeUniforms.tileSizeZ * 0.5;
    output.uv = vec2<f32>(
        (input.position.x + halfTileX) / landscapeUniforms.tileSizeX,
        (input.position.y + halfTileZ) / landscapeUniforms.tileSizeZ
    );
    output.uv1 = globalUV;
    output.vertexColor_0 = vec4<f32>(1.0, 1.0, 1.0, 1.0);
    output.vertexTangent = vec4<f32>(1.0, 0.0, 0.0, 1.0);
    output.vertexHeight = worldY;

    output.currentClipPos = systemUniforms.projection.noneJitterProjectionViewMatrix * worldPos4;
    output.prevClipPos = systemUniforms.projection.prevNoneJitterProjectionViewMatrix * prevWorldPos4;

    if (landscapeUniforms.lodColoration > 0.5) {
        output.instanceColor = landscapeUniforms.lodColors[min(lodLevel, 7u)];
    } else {
        output.instanceColor = instanceData.color;
    }

    output.lodLevel = f32(lodLevel);

    return output;
}
