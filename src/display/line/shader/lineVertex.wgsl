#redgpu_include SYSTEM_UNIFORM;


struct InputData {
    @builtin(instance_index) globalVertexSlotIndex: u32,
    @location(0) position: vec3<f32>,
    @location(1) vertexColor: vec4<f32>,
};

struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) vertexPosition: vec3<f32>,
    @location(1) vertexColor: vec4<f32>,

    @location(7) currentClipPos: vec4<f32>,
    @location(8) prevClipPos: vec4<f32>,

    @location(15) @interpolate(flat) pickingId: vec4<f32>,
};

@vertex
fn main(inputData: InputData) -> VertexOutput {
    var output: VertexOutput;
    let u_projectionViewMatrix = systemUniforms.projection.projectionViewMatrix;
    let u_noneJitterProjectionViewMatrix = systemUniforms.projection.noneJitterProjectionViewMatrix;
    let u_prevNoneJitterProjectionViewMatrix = systemUniforms.projection.prevNoneJitterProjectionViewMatrix;

    let globalVertexData = globalVertexSSBO[inputData.globalVertexSlotIndex];
    let u_matrixList = globalVertexData.matrixList;
    let u_modelMatrix = u_matrixList.modelMatrix;
    let u_prevModelMatrix = u_matrixList.prevModelMatrix;

    let input_position = inputData.position;
    let input_vertexColor = inputData.vertexColor;
    let input_position_vec4 = vec4<f32>(input_position, 1.0);

    var position: vec4<f32>;
    position = u_modelMatrix * input_position_vec4;
    output.position = u_projectionViewMatrix * position;
    output.vertexPosition = position.xyz;
    output.vertexColor = input_vertexColor;

    // Motion vector calculation
    {
      output.currentClipPos = u_noneJitterProjectionViewMatrix * position;
      output.prevClipPos = u_prevNoneJitterProjectionViewMatrix * u_prevModelMatrix * input_position_vec4;
    }

    return output;
}

#redgpu_include entryPoint.empty.entryPointPickingVertex;
#redgpu_include entryPoint.empty.entryPointShadowVertex;

