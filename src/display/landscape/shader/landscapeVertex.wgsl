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
    pad0: f32,
    pad1: f32,
    lodColors: array<vec4<f32>, 8>,
    lodDistancesSq: array<vec4<f32>, 2>,
};

@group(1) @binding(0) var<storage, read> allInputTiles: array<TileInstance>;
@group(1) @binding(1) var<storage, read> visibleTileIndices: array<u32>;
@group(1) @binding(2) var heightMapSampler: sampler;
@group(1) @binding(3) var heightMapTexture: texture_2d<f32>;
@group(1) @binding(5) var<uniform> landscapeUniforms: LandscapeUniforms;

struct InputData {
    @location(0) position: vec3<f32>,
    @location(1) normal: vec3<f32>,
    @location(2) uv: vec2<f32>,
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
    
    // ⚡ GPU Index Redirection: 간접 인스턴스 오프셋으로부터 실제 원본 타일 번호 u32 복원
    let realTileIdx = visibleTileIndices[input.instanceIdx];
    let instanceData = allInputTiles[realTileIdx];

    let maxCompCount = max(1u, landscapeUniforms.maxComponentCount);
    let lodLevel = input.instanceIdx / maxCompCount;

    // 🌊 버텍스 LOD 지오모핑 (Continuous CDLOD Geomorphing)
    var localX = input.position.x;
    var localZ = input.position.y;
    var prevLocalX = input.position.x;
    var prevLocalZ = input.position.y;

    if (lodLevel < 7u) {
        let rawWorldX = input.position.x + instanceData.worldX;
        let rawWorldZ = input.position.y + instanceData.worldZ;
        let camPos = systemUniforms.camera.cameraPosition.xyz;
        let dx = rawWorldX - camPos.x;
        let dz = rawWorldZ - camPos.z;
        let distSq = dx * dx + dz * dz;

        let packedVec = landscapeUniforms.lodDistancesSq[lodLevel / 4u];
        let thresholdSq = packedVec[lodLevel % 4u];

        // LOD 전환 거리의 70% ~ 100% 구간에서 다음 LOD 단계 그리드로 점진적 모핑 (Geomorphing)
        let morphStartSq = thresholdSq * 0.49; // (0.7)^2 = 0.49
        let morphFactor = smoothstep(morphStartSq, thresholdSq, distSq);

        if (morphFactor > 0.0001) {
            let baseQuads = max(1.0, landscapeUniforms.baseQuads);
            let nextSegments = max(1.0, floor(baseQuads / pow(2.0, f32(lodLevel + 1u))));
            let nextStepX = landscapeUniforms.tileSizeX / nextSegments;
            let nextStepZ = landscapeUniforms.tileSizeZ / nextSegments;

            let halfTileX = landscapeUniforms.tileSizeX * 0.5;
            let halfTileZ = landscapeUniforms.tileSizeZ * 0.5;

            let localOffsetX = input.position.x + halfTileX;
            let localOffsetZ = input.position.y + halfTileZ;

            let targetOffsetX = round(localOffsetX / nextStepX) * nextStepX;
            let targetOffsetZ = round(localOffsetZ / nextStepZ) * nextStepZ;

            let targetPosX = targetOffsetX - halfTileX;
            let targetPosZ = targetOffsetZ - halfTileZ;

            localX = mix(input.position.x, targetPosX, morphFactor);
            localZ = mix(input.position.y, targetPosZ, morphFactor);
            prevLocalX = localX;
            prevLocalZ = localZ;
        }
    }

    let worldX = localX + instanceData.worldX;
    let worldZ = localZ + instanceData.worldZ;
    let prevWorldX = prevLocalX + instanceData.prevWorldX;
    let prevWorldZ = prevLocalZ + instanceData.prevWorldZ;

    // VHT 오픈월드 Global UV 계산 (0.0 ~ 1.0)
    let globalUV = vec2<f32>(
        (worldX + landscapeUniforms.worldSizeX * 0.5) / landscapeUniforms.worldSizeX,
        (worldZ + landscapeUniforms.worldSizeZ * 0.5) / landscapeUniforms.worldSizeZ
    );
    let prevGlobalUV = vec2<f32>(
        (prevWorldX + landscapeUniforms.worldSizeX * 0.5) / landscapeUniforms.worldSizeX,
        (prevWorldZ + landscapeUniforms.worldSizeZ * 0.5) / landscapeUniforms.worldSizeZ
    );

    // VHT Atlas Texture (@group(1)) 16비트 고도 샘플링 (Uniform 직독: 0사이클 헤더 질의/나눗셈 100% 소멸)
    let texSize = landscapeUniforms.vhtTextureSize;
    let texCoord = vec2<i32>(clamp(globalUV * texSize, vec2<f32>(0.0), texSize - vec2<f32>(1.0)));

    let heightValue = textureLoad(heightMapTexture, texCoord, 0).r;

    var prevHeightValue = heightValue;
    if (prevWorldX != worldX || prevWorldZ != worldZ) {
        let prevTexCoord = vec2<i32>(clamp(prevGlobalUV * texSize, vec2<f32>(0.0), texSize - vec2<f32>(1.0)));
        prevHeightValue = textureLoad(heightMapTexture, prevTexCoord, 0).r;
    }

    let worldY = heightValue * landscapeUniforms.heightScale + input.position.z;
    let prevWorldY = prevHeightValue * landscapeUniforms.heightScale + input.position.z;

    let worldPos4 = vec4<f32>(worldX, worldY, worldZ, 1.0);
    let prevWorldPos4 = vec4<f32>(prevWorldX, prevWorldY, prevWorldZ, 1.0);

    // 1. 화면 렌더링용 정점 (Mesh 표준)
    let clipPos = systemUniforms.projection.projectionViewMatrix * worldPos4;

    output.position = clipPos;
    output.vertexPosition = worldPos4.xyz;
    output.vertexNormal = vec3<f32>(0.0, 1.0, 0.0);
    
    // 모핑된 타일 로컬 UV 계산
    let halfTileX = landscapeUniforms.tileSizeX * 0.5;
    let halfTileZ = landscapeUniforms.tileSizeZ * 0.5;
    output.uv = vec2<f32>(
        (localX + halfTileX) / landscapeUniforms.tileSizeX,
        (localZ + halfTileZ) / landscapeUniforms.tileSizeZ
    );
    output.uv1 = globalUV;
    output.vertexColor_0 = vec4<f32>(1.0, 1.0, 1.0, 1.0);
    output.vertexTangent = vec4<f32>(1.0, 0.0, 0.0, 1.0);
    output.vertexHeight = worldY;

    // 2. TAA & Motion Vector (Mesh 표준 noneJitter 연산)
    output.currentClipPos = systemUniforms.projection.noneJitterProjectionViewMatrix * worldPos4;
    output.prevClipPos = systemUniforms.projection.prevNoneJitterProjectionViewMatrix * prevWorldPos4;

    // 3. LOD Coloration: firstInstance 오프셋 기반 LOD 레벨 복원 및 색상 매핑
    if (landscapeUniforms.lodColoration > 0.5) {
        output.instanceColor = landscapeUniforms.lodColors[min(lodLevel, 7u)];
    } else {
        output.instanceColor = instanceData.color;
    }

    output.lodLevel = f32(lodLevel);

    return output;
}
