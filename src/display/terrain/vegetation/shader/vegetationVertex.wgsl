// VegetationMesh Vertex Shader
// group(0): SYSTEM_UNIFORM (RedGPU 자동)
// group(1): ProceduralInstancingMesh 전용
//   binding 0: array<ProceduralInstance>
//   binding 1: array<VisibilityData>
//   binding 2: ProceduralVertexUniforms
// group(3): VegetationMesh 전용
//   binding 0: VegetationUniforms
//   binding 1: heightmapSampler
//   binding 2: heightAtlasTexture

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

struct VisibilityData {
    instanceIdx: u32,
    globalFragmentSlotIndex: u32,
};

struct ProceduralVertexUniforms {
    globalFragmentSlotIndex: u32,
    maxDistanceSq: f32,
    startFadeDistanceSq: f32,
    windMaxDistanceSq: f32,
    _pad0: u32,
    _pad1: u32,
    _pad2: u32,
    _pad3: u32,
};

struct VegetationUniforms {
    worldSize: vec2<f32>,
    worldOffset: vec2<f32>,
    maxHeight: f32,
    minHeight: f32,
    time: f32,
    windStrength: f32,
};

// group(1): ProceduralInstancingMesh
@group(1) @binding(0) var<storage, read> instances: array<ProceduralInstance>;
@group(1) @binding(1) var<storage, read> visibilityBuffer: array<VisibilityData>;
@group(1) @binding(2) var<storage, read> proceduralUniforms: ProceduralVertexUniforms;

// group(3): VegetationMesh 전용
@group(3) @binding(0) var<storage, read> vegetationUniforms: VegetationUniforms;
@group(3) @binding(1) var heightmapSampler: sampler;
@group(3) @binding(2) var heightAtlasTexture: texture_2d<f32>;

struct InputData {
    @builtin(instance_index) instanceIdx: u32,
    @location(0) position: vec3<f32>,
    @location(1) vertexNormal: vec3<f32>,
    @location(2) uv: vec2<f32>,
    @location(3) vertexTangent: vec4<f32>,
};

struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) vertexPosition: vec3<f32>,
    @location(1) vertexNormal: vec3<f32>,
    @location(2) uv: vec2<f32>,
    @location(3) uv1: vec2<f32>,
    @location(4) vertexColor_0: vec4<f32>,
    @location(5) vertexTangent: vec4<f32>,
    @location(7) currentClipPos: vec4<f32>,
    @location(8) prevClipPos: vec4<f32>,
    @location(9) @interpolate(flat) globalFragmentSlotIndex: u32,
    @location(10) localNodeScale_volumeScale: vec2<f32>,
    @location(11) instanceOpacity: f32,
    @location(12) motionVector: vec3<f32>,
    @location(13) shadowCoord: vec3<f32>,
    @location(14) @interpolate(flat) receiveShadow: f32,
    @location(15) @interpolate(flat) pickingId: vec4<f32>,
};

@vertex
fn main(inputData: InputData) -> VertexOutput {
    var output: VertexOutput;

    // 1. visibility buffer에서 GPU Culling을 통과한 실제 인스턴스 인덱스 읽기
    let visData = visibilityBuffer[inputData.instanceIdx];
    let actualIdx = visData.instanceIdx;
    output.globalFragmentSlotIndex = visData.globalFragmentSlotIndex;

    let inst = instances[actualIdx];

    // 카메라 2D 거리 제곱 계산 (바람 조건 & Dither Fade 공용)
    let dx = inst.x - systemUniforms.camera.cameraPosition.x;
    let dz = inst.z - systemUniforms.camera.cameraPosition.z;
    let distSq = dx * dx + dz * dz;

    // 2. Y축 회전 행렬 적용 (rotY)
    let cosR = cos(inst.rotY);
    let sinR = sin(inst.rotY);

    // 3. 로컬 정점 위치에 scale 적용
    let localPos = vec3<f32>(
        inputData.position.x * inst.scaleXZ,
        inputData.position.y * inst.scaleY,
        inputData.position.z * inst.scaleXZ
    );

    // 4. Y축 회전 적용
    let rotatedPos = vec3<f32>(
        localPos.x * cosR - localPos.z * sinR,
        localPos.y,
        localPos.x * sinR + localPos.z * cosR
    );

    // 5. 인스턴스 월드 위치 적용 (y는 GPU가 heightmap에서 결정)
    var worldPos = vec3<f32>(
        inst.x + rotatedPos.x,
        rotatedPos.y,
        inst.z + rotatedPos.z
    );

    // 6. Heightmap Atlas UV 계산 (0.0 ~ 1.0 클램프)
    let terrainUV = clamp(
        vec2<f32>(
            (inst.x - vegetationUniforms.worldOffset.x) / vegetationUniforms.worldSize.x,
            1.0 - (inst.z - vegetationUniforms.worldOffset.y) / vegetationUniforms.worldSize.y
        ),
        vec2<f32>(0.0),
        vec2<f32>(1.0)
    );

    // 7. GPU Heightmap 샘ล링 → 지형 Y 계산
    let sampledRatio = textureSampleLevel(heightAtlasTexture, heightmapSampler, terrainUV, 0.0).r;
    let terrainY = vegetationUniforms.minHeight + sampledRatio * (vegetationUniforms.maxHeight - vegetationUniforms.minHeight);
    worldPos.y = terrainY + rotatedPos.y;

    // 8. 바람 애니메이션 — 근거리 식생(300m 이내) 및 상단 정점(local Y > 0)에만 적용
    if (distSq <= proceduralUniforms.windMaxDistanceSq && inputData.position.y > 0.0) {
        let windPhase = vegetationUniforms.time * 2.5
            + inst.x * 0.07
            + inst.z * 0.05
            + inst.windOffset;
        let windFactor = vegetationUniforms.windStrength * inst.scaleY * inputData.position.y;
        worldPos.x += sin(windPhase) * windFactor;
        worldPos.z += cos(windPhase * 0.7) * windFactor * 0.4;
    }

    // 9. 클립 좌표 변환
    let su_projectionViewMatrix = systemUniforms.projection.projectionViewMatrix;
    let finalClip = su_projectionViewMatrix * vec4<f32>(worldPos, 1.0);
    output.position = finalClip;
    output.currentClipPos = finalClip;
    output.prevClipPos = finalClip;
    output.vertexPosition = worldPos;

    // 10. 노말 — Y축 회전만 적용 (scale 없이)
    let rotatedNormal = vec3<f32>(
        inputData.vertexNormal.x * cosR - inputData.vertexNormal.z * sinR,
        inputData.vertexNormal.y,
        inputData.vertexNormal.x * sinR + inputData.vertexNormal.z * cosR
    );
    output.vertexNormal = normalize(rotatedNormal);
    output.vertexTangent = inputData.vertexTangent;
    output.uv = inputData.uv;
    output.uv1 = inputData.uv;
    output.vertexColor_0 = vec4<f32>(1.0);
    output.localNodeScale_volumeScale = vec2<f32>(1.0);

    var fade: f32 = 1.0;
    if (proceduralUniforms.maxDistanceSq > proceduralUniforms.startFadeDistanceSq) {
        let fadeFactor = (distSq - proceduralUniforms.startFadeDistanceSq) / (proceduralUniforms.maxDistanceSq - proceduralUniforms.startFadeDistanceSq);
        fade = 1.0 - clamp(fadeFactor, 0.0, 1.0);
    }

    output.instanceOpacity = fade;
    output.motionVector = vec3<f32>(0.0);
    output.shadowCoord = vec3<f32>(0.0);
    output.receiveShadow = 0.0;
    output.pickingId = vec4<f32>(0.0);

    return output;
}
