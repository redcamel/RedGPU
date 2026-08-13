#redgpu_include SYSTEM_UNIFORM;

struct TileUniform {
    tileX: f32,
    tileZ: f32,
};

@group(2) @binding(0) var<uniform> tileUniform: TileUniform;

struct InputData {
    @location(0) position: vec3<f32>,
    @location(1) normal: vec3<f32>,
    @location(2) uv: vec2<f32>,
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
};

@vertex
fn main(input: InputData) -> OutputData {
    var output: OutputData;
    
    // XY 세워진 평면을 XZ 바닥 대지로 눕히고 타일 오프셋 반영
    let worldPos = vec3<f32>(
        input.position.x + tileUniform.tileX,
        input.position.z,
        input.position.y + tileUniform.tileZ
    );

    let clipPos = systemUniforms.projection.projectionViewMatrix * vec4<f32>(worldPos, 1.0);

    output.position = clipPos;
    output.vertexPosition = worldPos;
    output.vertexNormal = vec3<f32>(0.0, 1.0, 0.0); // 바닥 윗방향 수직 법선
    output.uv = input.uv;
    output.uv1 = input.uv;
    output.vertexColor_0 = vec4<f32>(1.0, 1.0, 1.0, 1.0);
    output.vertexTangent = vec4<f32>(1.0, 0.0, 0.0, 1.0);
    output.vertexHeight = input.position.z;
    output.currentClipPos = clipPos;
    output.prevClipPos = clipPos;

    return output;
}
