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
    windMaxDistanceSq: f32,
    _p0: u32, _p1: u32, _p2: u32, _p3: u32,
};

struct VegetationUniforms {
    worldSize: vec2<f32>,
    worldOffset: vec2<f32>,
    maxHeight: f32,
    minHeight: f32,
    time: f32,
    windStrength: f32,
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

// group(1): instanceMatrix 배열 + vertex uniforms
@group(1) @binding(0) var<storage, read> instanceMatrices: array<mat4x4<f32>>;
@group(1) @binding(1) var<storage, read> proceduralUniforms: ProceduralVertexUniforms;

@group(3) @binding(0) var<storage, read> vegetationUniforms: VegetationUniforms;
@group(3) @binding(1) var heightmapSampler: sampler;
@group(3) @binding(2) var heightAtlasTexture: texture_2d<f32>;

@vertex
fn main(inputData: InputData) -> VertexOutput {
    var output: VertexOutput;
    output.globalFragmentSlotIndex = proceduralUniforms.globalFragmentSlotIndex;

    // CPU에서 미리 계산된 T(x,0,z) × baseModelMatrix × S 행렬
    var instanceMatrix = instanceMatrices[inputData.instanceIdx];

    // 인스턴스 월드 XZ 위치 (translation column에서 추출)
    let instX = instanceMatrix[3][0];
    let instZ = instanceMatrix[3][2];

    // Heightmap UV 및 Y 샘플링
    let terrainUV = clamp(
        vec2<f32>(
            (instX - vegetationUniforms.worldOffset.x) / vegetationUniforms.worldSize.x,
            1.0 - (instZ - vegetationUniforms.worldOffset.y) / vegetationUniforms.worldSize.y
        ),
        vec2<f32>(0.0), vec2<f32>(1.0)
    );
    let sampledRatio = textureSampleLevel(heightAtlasTexture, heightmapSampler, terrainUV, 0.0).r;
    let terrainY = vegetationUniforms.minHeight + sampledRatio * (vegetationUniforms.maxHeight - vegetationUniforms.minHeight);

    // translation column의 Y에 terrainY 적용
    instanceMatrix[3][1] = terrainY;

    // 최종 월드 위치: InstancingMesh와 동일하게 instanceMatrix * vertex
    let worldPos4 = instanceMatrix * vec4<f32>(inputData.position, 1.0);
    var worldPos = worldPos4.xyz;

    // 카메라 거리 (바람/fade용)
    let dx = instX - systemUniforms.camera.cameraPosition.x;
    let dz = instZ - systemUniforms.camera.cameraPosition.z;
    let distSq = dx * dx + dz * dz;

    // 바람 애니메이션 (근거리만)
    if (distSq <= proceduralUniforms.windMaxDistanceSq && inputData.position.y > 0.0) {
        let windPhase = vegetationUniforms.time * 2.5 + instX * 0.07 + instZ * 0.05;
        let windFactor = vegetationUniforms.windStrength * inputData.position.y;
        worldPos.x += sin(windPhase) * windFactor;
        worldPos.z += cos(windPhase * 0.7) * windFactor * 0.4;
    }

    let projView = systemUniforms.projection.projectionViewMatrix;
    let finalClip = projView * vec4<f32>(worldPos, 1.0);

    output.position = finalClip;
    output.currentClipPos = finalClip;
    output.prevClipPos = finalClip;
    output.vertexPosition = worldPos;

    // 노말 변환
    let rawNormal = instanceMatrix * vec4<f32>(inputData.vertexNormal, 0.0);
    output.vertexNormal = normalize(rawNormal.xyz);
    output.uv = inputData.uv;
    output.uv1 = inputData.uv;
    output.vertexTangent = inputData.vertexTangent;
    output.vertexColor_0 = vec4<f32>(1.0);

    // Distance Fade Out
    var fade: f32 = 1.0;
    if (proceduralUniforms.maxDistanceSq > proceduralUniforms.startFadeDistanceSq) {
        let t = (distSq - proceduralUniforms.startFadeDistanceSq)
              / (proceduralUniforms.maxDistanceSq - proceduralUniforms.startFadeDistanceSq);
        fade = 1.0 - clamp(t, 0.0, 1.0);
    }

    output.localNodeScale = vec2<f32>(1.0);
    output.localNodeScale_volumeScale = vec2<f32>(1.0);
    output.instanceOpacity = fade;
    output.motionVector = vec3<f32>(0.0);
    output.shadowCoord = vec3<f32>(0.0);
    output.receiveShadow = 0.0;
    output.pickingId = vec4<f32>(0.0);

    return output;
}
