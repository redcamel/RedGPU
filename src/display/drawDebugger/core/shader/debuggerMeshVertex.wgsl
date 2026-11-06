#redgpu_include SYSTEM_UNIFORM;
#redgpu_include systemStruct.globalVertexStruct;

struct InputData {
    @builtin(instance_index) globalVertexSlotIndex: u32,
    @location(0) position: vec3<f32>,
};

struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) vertexPosition: vec3<f32>,
    @location(9) @interpolate(flat) globalFragmentSlotIndex: u32,
    @location(11) combinedOpacity: f32,
};

@vertex
fn main(inputData: InputData) -> VertexOutput {
    var output: VertexOutput;
    let globalVertexData = globalVertexSSBO[inputData.globalVertexSlotIndex];
    let position = globalVertexData.matrixList.modelMatrix * vec4<f32>(inputData.position, 1.0);
    let relPos = position.xyz - systemUniforms.camera.cameraPosition;
    let viewPos = (systemUniforms.camera.viewMatrix * vec4<f32>(relPos, 0.0)).xyz;

    output.position = systemUniforms.projection.noneJitterProjectionMatrix * vec4<f32>(viewPos, 1.0);
    output.vertexPosition = position.xyz;
    output.globalFragmentSlotIndex = globalVertexData.globalFragmentSlotIndex;
    output.combinedOpacity = globalVertexData.combinedOpacity;

    return output;
}
