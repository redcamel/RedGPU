#redgpu_include SYSTEM_UNIFORM;
#redgpu_include systemStruct.OutputFragment;

struct WaterUniforms {
    dummy: f32,
};

@group(2) @binding(0) var<uniform> uniforms: WaterUniforms;

struct InputData {
    @builtin(position) position: vec4<f32>,
    @location(0) vertexPosition: vec3<f32>,
    @location(1) vertexNormal: vec3<f32>,
    @location(2) uv: vec2<f32>,
};

@fragment
fn main(inputData: InputData) -> OutputFragment {
    var output: OutputFragment;
    // Step 1.1: 파이프라인 무결성 검증을 위한 선명한 마젠타 핑크 단색 출력
    output.color = vec4<f32>(1.0, 0.0, 1.0, 1.0);
    return output;
}
