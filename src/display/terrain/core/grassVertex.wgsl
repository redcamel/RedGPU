// Terrain Grass Vertex Shader Source
struct Uniforms {
    modelMatrix: mat4x4<f32>,
};

struct TerrainUniforms {
    worldSize: vec2<f32>,
    maxHeight: f32,
    time: f32,
};

struct VertexInput {
    @location(0) position: vec3<f32>,
    @location(1) uv: vec2<f32>,
    @location(2) normal: vec3<f32>,
};

struct InstanceInput {
    @location(3) instancePosition: vec3<f32>,
    @location(4) rotation: f32,
    @location(5) scale: vec2<f32>,
    @location(6) windOffset: f32,
};

struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) uv: vec2<f32>,
    @location(1) normal: vec3<f32>,
    @location(2) worldPosition: vec3<f32>,
};

@group(0) @binding(0) var<uniform> uniforms: Uniforms;
// Mesh & Camera Uniforms provided by RedGPU Pipeline System

@group(2) @binding(0) var<uniform> terrainUniforms: TerrainUniforms;
@group(2) @binding(1) var heightmapSampler: sampler;
@group(2) @binding(2) var heightAtlasTexture: texture_2d<f32>;

@vertex
fn main(
    vertex: VertexInput,
    instance: InstanceInput
) -> VertexOutput {
    var output: VertexOutput;

    // 1. 인스턴스 로컬 스케일 및 회전 적용
    let cosR = cos(instance.rotation);
    let sinR = sin(instance.rotation);
    
    // Y축 회전 행렬 적용 (X, Z 좌표 변환)
    let scaledLocalPos = vec3<f32>(
        vertex.position.x * instance.scale.x,
        vertex.position.y * instance.scale.y,
        vertex.position.z * instance.scale.x
    );

    let rotatedPos = vec3<f32>(
        scaledLocalPos.x * cosR - scaledLocalPos.z * sinR,
        scaledLocalPos.y,
        scaledLocalPos.x * sinR + scaledLocalPos.z * cosR
    );

    // 2. 인스턴스 월드 (X, Z) 위치 지정
    var worldPos = instance.instancePosition + rotatedPos;

    // 3. 지형 Heightmap Atlas UV 계산 (worldPos -> UV 0.0 ~ 1.0)
    let terrainUV = vec2<f32>(
        (worldPos.x / terrainUniforms.worldSize.x) + 0.5,
        (worldPos.z / terrainUniforms.worldSize.y) + 0.5
    );

    // 4. Heightmap 샘플링을 통한 Y 높이 계산
    let sampledHeight = textureSampleLevel(heightAtlasTexture, heightmapSampler, terrainUV, 0.0).r;
    let terrainY = sampledHeight * terrainUniforms.maxHeight;
    worldPos.y = worldPos.y + terrainY;

    // 5. 바람 흔들림 (Wind Wave) 효과 (상단 정점에 한해 적용)
    if (vertex.position.y > 0.0) {
        let wave = sin(terrainUniforms.time * 2.5 + instance.windOffset + worldPos.x * 0.1) * 0.25 * instance.scale.y;
        worldPos.x += wave;
        worldPos.z += wave * 0.5;
    }

    output.uv = vertex.uv;
    output.normal = vertex.normal;
    output.worldPosition = worldPos;
    
    // RedGPU System Mesh Matrix & Camera VP 변환
    output.position = uniforms.modelMatrix * vec4<f32>(worldPos, 1.0);

    return output;
}
