#redgpu_include SYSTEM_UNIFORM;

struct TileInstance {
    worldX: f32,
    worldZ: f32,
    prevWorldX: f32,
    prevWorldZ: f32,
    lodLevel: u32,
    pad0: f32,
    pad1: f32,
    pad2: f32,
    color: vec4<f32>,
};

@group(2) @binding(0) var<storage, read> tileInstances: array<TileInstance>;

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
};

@vertex
fn main(input: InputData) -> OutputData {
    var output: OutputData;
    
    let instanceData = tileInstances[input.instanceIdx];

    let worldPos4 = vec4<f32>(
        input.position.x + instanceData.worldX,
        input.position.z,
        input.position.y + instanceData.worldZ,
        1.0
    );

    let prevWorldPos4 = vec4<f32>(
        input.position.x + instanceData.prevWorldX,
        input.position.z,
        input.position.y + instanceData.prevWorldZ,
        1.0
    );

    // 1. 화면 렌더링용 정점 (Mesh 표준)
    let clipPos = systemUniforms.projection.projectionViewMatrix * worldPos4;

    output.position = clipPos;
    output.vertexPosition = worldPos4.xyz;
    output.vertexNormal = vec3<f32>(0.0, 1.0, 0.0);
    output.uv = input.uv;
    output.uv1 = input.uv;
    output.vertexColor_0 = vec4<f32>(1.0, 1.0, 1.0, 1.0);
    output.vertexTangent = vec4<f32>(1.0, 0.0, 0.0, 1.0);
    output.vertexHeight = input.position.z;

    // 2. TAA & Motion Vector (Mesh 표준 noneJitter 연산)
    output.currentClipPos = systemUniforms.projection.noneJitterProjectionViewMatrix * worldPos4;
    output.prevClipPos = systemUniforms.projection.prevNoneJitterProjectionViewMatrix * prevWorldPos4;

    output.instanceColor = instanceData.color;

    return output;
}
