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
    modelMatrix: mat4x4<f32>,
};

@group(1) @binding(0) var<uniform> vertexUniforms: VertexUniforms;

@vertex
fn main(inputData: InputData) -> VertexOutput {
    var output : VertexOutput;
    let u_camera = systemUniforms.camera;
    let u_viewMatrix = u_camera.viewMatrix;
    let u_projectionMatrix = systemUniforms.projection.projectionMatrix;

    var viewRotation = u_viewMatrix;
    viewRotation[3] = vec4<f32>(0.0, 0.0, 0.0, 1.0);

    let clipPos = u_projectionMatrix * viewRotation * vertexUniforms.modelMatrix * vec4<f32>(inputData.position, 1.0);
    output.position = clipPos.xyww;
    
    output.vertexPosition = vec4<f32>(inputData.position, 1.0);
    return output;
}