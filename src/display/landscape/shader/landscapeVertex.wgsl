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
    lod0Distance: f32,
    pad0: f32,
    pad1: f32,
    lodColors: array<vec4<f32>, 8>,
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

    let worldX = input.position.x + instanceData.worldX;
    let worldZ = input.position.y + instanceData.worldZ;
    let prevWorldX = input.position.x + instanceData.prevWorldX;
    let prevWorldZ = input.position.y + instanceData.prevWorldZ;

    // VHT 오픈월드 Global UV 계산 (0.0 ~ 1.0)
    let globalUV = vec2<f32>(
        (worldX + landscapeUniforms.worldSizeX * 0.5) / landscapeUniforms.worldSizeX,
        (worldZ + landscapeUniforms.worldSizeZ * 0.5) / landscapeUniforms.worldSizeZ
    );
    let prevGlobalUV = vec2<f32>(
        (prevWorldX + landscapeUniforms.worldSizeX * 0.5) / landscapeUniforms.worldSizeX,
        (prevWorldZ + landscapeUniforms.worldSizeZ * 0.5) / landscapeUniforms.worldSizeZ
    );

    // VHT Atlas Texture (@group(1)) 16비트 고도 샘플링 (textureLoad: UnfilterableFloat 대응)
    let texSize = vec2<f32>(textureDimensions(heightMapTexture));
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
    output.uv = input.uv;
    output.uv1 = globalUV;
    output.vertexColor_0 = vec4<f32>(1.0, 1.0, 1.0, 1.0);
    output.vertexTangent = vec4<f32>(1.0, 0.0, 0.0, 1.0);
    output.vertexHeight = worldY;

    // 2. TAA & Motion Vector (Mesh 표준 noneJitter 연산)
    output.currentClipPos = systemUniforms.projection.noneJitterProjectionViewMatrix * worldPos4;
    output.prevClipPos = systemUniforms.projection.prevNoneJitterProjectionViewMatrix * prevWorldPos4;

    // 3. LOD Coloration: firstInstance 오프셋 기반 LOD 레벨 복원 및 색상 매핑
    let maxCompCount = max(1u, landscapeUniforms.maxComponentCount);
    let lodLevel = input.instanceIdx / maxCompCount;
    if (landscapeUniforms.lodColoration > 0.5) {
        output.instanceColor = landscapeUniforms.lodColors[min(lodLevel, 7u)];
    } else {
        output.instanceColor = instanceData.color;
    }

    output.lodLevel = f32(lodLevel);

    return output;
}
