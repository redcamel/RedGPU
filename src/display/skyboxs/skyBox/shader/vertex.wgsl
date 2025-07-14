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
    let u_projectionMatrix = systemUniforms.projectionMatrix;
    let u_camera = systemUniforms.camera;
    let u_cameraMatrix = u_camera.cameraMatrix;
    outData.position = u_projectionMatrix * u_cameraMatrix * vertexUniforms.modelMatrix * vec4<f32>(inputData.position, 1.0);
    outData.vertexPosition = 0.5 * (vec4<f32>(inputData.position, 1.0) + vec4<f32>(1.0, 1.0, 1.0, 1.0));
    return outData;
}
