#redgpu_include SYSTEM_UNIFORM;
struct InputData {
    @location(0) position : vec3<f32>,
    @location(1) vertexNormal : vec3<f32>,
    @location(2) uv : vec2<f32>,
};
struct VertexOutput {
  @builtin(position) position : vec4<f32>,
  @location(0) vertexPosition: vec4<f32>,
};
struct VertexUniforms {
	  modelMatrix:mat4x4<f32>,
};
@group(1) @binding(0) var<uniform> vertexUniforms: VertexUniforms;
@vertex
fn main(inputData:InputData) -> VertexOutput {
    var output : VertexOutput;
    let u_projectionMatrix = systemUniforms.projection.projectionMatrix;
    let u_projectionViewMatrix = systemUniforms.projection.projectionViewMatrix;
    let u_camera = systemUniforms.camera;
    let u_viewMatrix = u_camera.viewMatrix;
    output.position = u_projectionViewMatrix * vertexUniforms.modelMatrix * vec4<f32>(inputData.position, 1.0);
    output.vertexPosition = vec4<f32>(inputData.position, 1.0);
    return output;
}

