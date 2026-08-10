// Vegetation Vertex Shader
// InstancingMesh 방식 참고: per-instance mat4x4를 storage buffer에서 읽어서 바로 적용
// CPU에서 미리 T × baseModelMatrix × S 계산 → 셰이더에서 heightmap Y만 translation에 추가

#redgpu_include SYSTEM_UNIFORM;

struct InputData {
    @builtin(instance_index) instanceIdx: u32,
    @location(0) position: vec3<f32>,
    @location(1) vertexNormal: vec3<f32>,
    @location(2) uv: vec2<f32>,
    @location(3) vertexTangent: vec4<f32>,
};

struct ProceduralVertexUniforms {
    globalFragmentSlotIndex: u32,
    maxDistanceSq: f32,
    startFadeDistanceSq: f32,
    _padWindMaxDistSq: f32,
    _p0: u32, _p1: u32, _p2: u32, _p3: u32,
};

struct VegetationUniforms {
    worldSize: vec2<f32>,
    worldOffset: vec2<f32>,
    maxHeight: f32,
    minHeight: f32,
    time: f32,
    _padWind: f32,
    baseModelMatrix: mat4x4<f32>,
};

struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) vertexPosition: vec3<f32>,
    @location(1) vertexNormal: vec3<f32>,
    @location(2) uv: vec2<f32>,
    @location(3) uv1: vec2<f32>,
    @location(4) vertexTangent: vec4<f32>,
    @location(5) vertexColor_0: vec4<f32>,
    @location(6) localNodeScale_volumeScale: vec2<f32>,
    @location(7) currentClipPos: vec4<f32>,
    @location(8) prevClipPos: vec4<f32>,
    @location(9) @interpolate(flat) globalFragmentSlotIndex: u32,
    @location(10) localNodeScale: vec2<f32>,
    @location(11) instanceOpacity: f32,
    @location(12) motionVector: vec3<f32>,
    @location(13) shadowCoord: vec3<f32>,
    @location(14) @interpolate(flat) receiveShadow: f32,
    @location(15) @interpolate(flat) pickingId: vec4<f32>,
};

// group(1): instanceMatrix 배열 + culledInstanceIndices + culledInstanceHeights + vertex uniforms
@group(1) @binding(0) var<storage, read> instanceMatrices: array<mat4x4<f32>>;
@group(1) @binding(1) var<storage, read> culledInstanceIndices: array<u32>;
@group(1) @binding(2) var<storage, read> culledInstanceHeights: array<f32>;
@group(1) @binding(3) var<storage, read> proceduralUniforms: ProceduralVertexUniforms;

@group(3) @binding(0) var<storage, read> vegetationUniforms: VegetationUniforms;

@vertex
fn main(inputData: InputData) -> VertexOutput {
    var output: VertexOutput;
    output.globalFragmentSlotIndex = proceduralUniforms.globalFragmentSlotIndex;

    // 인디렉션을 통해 실제 원본 인스턴스 인덱스 획득
    let rawInstanceIdx = culledInstanceIndices[inputData.instanceIdx];
    var instanceMatrix = instanceMatrices[rawInstanceIdx];

    // Compute Shader에서 미리 계산된 terrainY를 직접 참조 (텍스처 샘플링 제거)
    let terrainY = culledInstanceHeights[inputData.instanceIdx];

    // translation column의 Y에 terrainY 추가 적용
    instanceMatrix[3][1] += terrainY;

    // 최종 월드 위치: InstancingMesh와 동일하게 instanceMatrix * vertex
    let worldPos4 = instanceMatrix * vec4<f32>(inputData.position, 1.0);
    let worldPos = worldPos4.xyz;

    output.position = systemUniforms.projection.noneJitterProjectionViewMatrix * worldPos4;
    output.currentClipPos = systemUniforms.projection.noneJitterProjectionViewMatrix * worldPos4;
    output.prevClipPos = systemUniforms.projection.prevNoneJitterProjectionViewMatrix * worldPos4;
    output.vertexPosition = worldPos;

    // 노말 변환 (스케일에 의한 노말 왜곡 및 조명 어두워짐 방지)
    let normalMatrix = mat3x3<f32>(
        normalize(instanceMatrix[0].xyz),
        normalize(instanceMatrix[1].xyz),
        normalize(instanceMatrix[2].xyz)
    );
    output.vertexNormal = normalize(normalMatrix * inputData.vertexNormal);
    output.uv = inputData.uv;
    output.uv1 = inputData.uv;
    output.vertexTangent = inputData.vertexTangent;
    output.vertexColor_0 = vec4<f32>(1.0);

    output.localNodeScale = vec2<f32>(1.0);
    output.localNodeScale_volumeScale = vec2<f32>(1.0);
    output.instanceOpacity = 1.0;
    output.motionVector = vec3<f32>(0.0, 0.0, 1.0); // TAA 인스턴싱 지터링 떨림 방지 가드 (z = 1.0)
    output.shadowCoord = vec3<f32>(0.0);
    output.receiveShadow = 0.0;
    output.pickingId = vec4<f32>(0.0);

    return output;
}
