#redgpu_include SYSTEM_UNIFORM;
#redgpu_include entryPoint.mesh.entryPointShadowVertex;
#redgpu_include entryPoint.mesh.entryPointPickingVertex;
#redgpu_include systemStruct.globalVertexStruct;

@group(1) @binding(1) var displacementTextureSampler: sampler;
@group(1) @binding(2) var displacementTexture: texture_2d<f32>;


@vertex
fn main(inputData: InputData) -> VertexOutput {
    var output: VertexOutput;

    let globalVertexData = globalVertexSSBO[inputData.globalVertexSlotIndex];
    let su_projection = systemUniforms.projection;

    // Input data
    let input_position_vec4 = vec4<f32>(inputData.position, 1.0);
    let input_vertexNormal = inputData.vertexNormal;

    // System uniforms
    let su_projectionViewMatrix = su_projection.projectionViewMatrix;

    // Vertex uniforms
    let gu_matrixList = globalVertexData.matrixList;

    let gu_localMatrix = gu_matrixList.localMatrix;
    let gu_modelMatrix = gu_matrixList.modelMatrix;
    let gu_prevModelMatrix = gu_matrixList.prevModelMatrix;
    let gu_normalModelMatrix = gu_matrixList.normalModelMatrix;



    // Position and normal calculation
    var position: vec4<f32>;
    var normalPosition: vec4<f32>;

    position = gu_modelMatrix * input_position_vec4;
    normalPosition = gu_normalModelMatrix * vec4<f32>(input_vertexNormal, 0.0);

    // Basic output assignments (카메라 상대적 고정밀 투영 변환)
    let relPos = position.xyz - systemUniforms.camera.cameraPosition;
    let viewPos = (systemUniforms.camera.viewMatrix * vec4<f32>(relPos, 0.0)).xyz;
    output.position = su_projection.projectionMatrix * vec4<f32>(viewPos, 1.0);
    output.vertexPosition = position.xyz;
    output.vertexNormal = normalize(normalPosition.xyz);
    output.uv = inputData.uv;
    output.uv1 = inputData.uv1;
    output.vertexColor_0 = inputData.vertexColor_0;
    output.globalFragmentSlotIndex = globalVertexData.globalFragmentSlotIndex;

    let transformedTangentXYZ = (gu_normalModelMatrix * vec4<f32>(inputData.vertexTangent.xyz, 0.0)).xyz;
    output.vertexTangent = vec4<f32>( normalize(transformedTangentXYZ), inputData.vertexTangent.w );



    // Shadow calculation
    output.receiveShadow = globalVertexData.receiveShadow;

    // Motion vector calculation
    {
        output.currentClipPos = su_projection.noneJitterProjectionMatrix * vec4<f32>(viewPos, 1.0);
        output.prevClipPos = su_projection.prevNoneJitterProjectionViewMatrix * gu_prevModelMatrix * input_position_vec4;
    }

    // Scale calculations
    let nodeScaleX = length(gu_localMatrix[0].xyz);
    let nodeScaleY = length(gu_localMatrix[1].xyz);
    let nodeScaleZ = length(gu_localMatrix[2].xyz);


    let volumeScaleX = length(gu_modelMatrix[0].xyz);
    let volumeScaleY = length(gu_modelMatrix[1].xyz);
    let volumeScaleZ = length(gu_modelMatrix[2].xyz);
    output.localNodeScale_volumeScale = vec2<f32>(
        pow(nodeScaleX * nodeScaleY * nodeScaleZ, 1.0 / 3.0),
        pow(volumeScaleX * volumeScaleY * volumeScaleZ, 1.0 / 3.0)
    );

    return output;
}

