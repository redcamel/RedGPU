#redgpu_include SYSTEM_UNIFORM;
struct MatrixList{
    modelMatrix: mat4x4<f32>,
    prevModelMatrix: mat4x4<f32>,
    normalModelMatrix: mat4x4<f32>,
}
struct VertexUniforms {
    matrixList:MatrixList,
    pickingId: u32,
};

@group(1) @binding(0) var<uniform> vertexUniforms: VertexUniforms;

struct InputData {
    @location(0) position: vec3<f32>,
    @location(1) vertexColor: vec4<f32>,
};

struct OutputData {
    @builtin(position) position: vec4<f32>,
    @location(0) vertexPosition: vec3<f32>,
    @location(1) vertexColor: vec4<f32>,

    @location(7) currentClipPos: vec4<f32>,
    @location(8) prevClipPos: vec4<f32>,

    @location(15) @interpolate(flat) pickingId: vec4<f32>,
};

#redgpu_include systemStruct.OutputShadowData;

@vertex
fn main(inputData: InputData) -> OutputData {
    var output: OutputData;
    let u_projectionCameraMatrix = systemUniforms.projectionCameraMatrix;
    let u_noneJitterProjectionCameraMatrix = systemUniforms.noneJitterProjectionCameraMatrix;
    let u_prevNoneJitterProjectionCameraMatrix = systemUniforms.prevNoneJitterProjectionCameraMatrix;

    let u_matrixList = vertexUniforms.matrixList;
    let u_modelMatrix = u_matrixList.modelMatrix;
    let u_prevModelMatrix = u_matrixList.prevModelMatrix;

    let input_position = inputData.position;
    let input_vertexColor = inputData.vertexColor;
    let input_position_vec4 = vec4<f32>(input_position, 1.0);

    var position: vec4<f32>;
    position = u_modelMatrix * input_position_vec4;
    output.position = u_projectionCameraMatrix * position;
    output.vertexPosition = position.xyz;
    output.vertexColor = input_vertexColor;

    // Motion vector calculation
    {
      output.currentClipPos = u_noneJitterProjectionCameraMatrix * position;
      output.prevClipPos = u_prevNoneJitterProjectionCameraMatrix * u_prevModelMatrix * input_position_vec4;
    }

    return output;
}

#redgpu_include entryPoint.picking.empty.entryPointPickingVertex;
