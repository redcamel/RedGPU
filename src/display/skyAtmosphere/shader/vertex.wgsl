#redgpu_include SYSTEM_UNIFORM;
struct InputData {
    @location(0) position : vec3<f32>,
    @location(1) vertexNormal : vec3<f32>,
    @location(2) uv : vec2<f32>,
};
struct OutData {
  @builtin(position) position : vec4<f32>,
  @location(0) vertexPosition: vec4<f32>,
};
struct VertexUniforms {
	  modelMatrix:mat4x4<f32>,
};
@group(1) @binding(0) var<uniform> vertexUniforms: VertexUniforms;
@vertex
fn main(inputData:InputData) -> OutData {
    var outData : OutData;
    let u_projectionCameraMatrix = systemUniforms.projectionCameraMatrix;
    outData.position = u_projectionCameraMatrix * vertexUniforms.modelMatrix * vec4<f32>(inputData.position, 1.0);
    // 하늘은 항상 가장 뒤에 렌더링되도록 depth를 최대값으로 설정
    outData.position.z = outData.position.w;
    outData.vertexPosition = vec4<f32>(inputData.position, 1.0);
    return outData;
}
