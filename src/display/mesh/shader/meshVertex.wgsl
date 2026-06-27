#redgpu_include SYSTEM_UNIFORM;
#redgpu_include shadow.getShadowCoord;
#redgpu_include entryPoint.mesh.entryPointShadowVertex;
#redgpu_include entryPoint.mesh.entryPointPickingVertex;
#redgpu_include displacement.getDisplacementPosition;

#redgpu_include systemStruct.globalVertexStruct;

const maxDistance: f32 = 1000.0;

@group(1) @binding(1) var displacementTextureSampler: sampler;
@group(1) @binding(2) var displacementTexture: texture_2d<f32>;


@vertex
fn main(inputData: InputData) -> VertexOutput {
    var output: VertexOutput;

    let globalVertexData = globalVertexSSBO[inputData.globalVertexSlotIndex];

    // System uniforms
    let su_projection = systemUniforms.projection;
    let su_projectionViewMatrix = su_projection.projectionViewMatrix;
    #redgpu_if disableJitter
    {
        let su_projectionMatrix = su_projection.noneJitterProjectionViewMatrix;
    }
    #redgpu_else
    {
        let su_projectionMatrix = su_projection.projectionMatrix;
    }
    #redgpu_endIf

    let su_cameraPosition = systemUniforms.camera.cameraPosition;

    // Vertex uniforms
    let gu_matrixList = globalVertexData.matrixList;
    let gu_displacementScale = globalVertexData.displacementScale;
    let gu_combinedOpacity = globalVertexData.combinedOpacity;
    let gu_uvTransform = globalVertexData.uvTransform;

    let gu_modelMatrix = gu_matrixList.modelMatrix;
    let gu_prevModelMatrix = gu_matrixList.prevModelMatrix;
    let gu_normalModelMatrix = gu_matrixList.normalModelMatrix;

    // Input data
    let input_position = inputData.position;
    let input_position_vec4 = vec4<f32>(input_position, 1.0);
    let input_vertexNormal = inputData.vertexNormal;
    let input_uv = inputData.uv;

    // [KO] 트랜스폼이 적용된 UV 계산
    let transformedUV = input_uv * gu_uvTransform.zw + gu_uvTransform.xy;

    // Position and normal calculation
    var position: vec4<f32>;


    #redgpu_if useDisplacementTexture
        // [KO] 실제 텍스처의 최대 밉레벨을 가져와서 거리에 비례한 샘플링 레벨을 결정합니다.
        // [EN] Get the actual maximum mip level of the texture and determine the sampling level proportional to the distance.
        let tempPosition = gu_modelMatrix * input_position_vec4;
        let distance = distance(tempPosition.xyz, su_cameraPosition);
        let maxMipLevel = f32(textureNumLevels(displacementTexture)) - 1.0;

        // [KO] 거리에 따른 밉레벨 계산 (바이어스 제거)
        // [EN] Mip level calculation based on distance (remove bias)
        let targetMipLevel = clamp((distance / maxDistance) * maxMipLevel, 0.0, maxMipLevel);

        // [KO] 트랜스폼된 UV를 사용하여 위치 이동 계산
        let displacedPosition = getDisplacementPosition(
            input_position,
            input_vertexNormal,
            displacementTexture,
            displacementTextureSampler,
            gu_displacementScale,
            transformedUV,
            targetMipLevel
        );

        position = gu_modelMatrix * vec4<f32>(displacedPosition, 1.0);
    #redgpu_else
        position = gu_modelMatrix * input_position_vec4;
    #redgpu_endIf

    // [KO] 방향 벡터 변환이므로 W=0.0 사용 및 정규화
    let worldNormal = normalize((gu_normalModelMatrix * vec4<f32>(input_vertexNormal, 0.0)).xyz);
    let normalPosition = vec4<f32>(worldNormal, 0.0);

    // Basic output assignments
    output.position = su_projectionViewMatrix * position;
    output.vertexPosition = position.xyz;
    output.vertexNormal = normalPosition.xyz;
    output.uv = transformedUV;
    output.globalFragmentSlotIndex = globalVertexData.globalFragmentSlotIndex;

    let transformedTangentXYZ = (gu_normalModelMatrix * vec4<f32>(inputData.vertexTangent.xyz, 0.0)).xyz;
    output.vertexTangent = vec4<f32>(normalize(transformedTangentXYZ), inputData.vertexTangent.w);

    output.combinedOpacity = gu_combinedOpacity;

    // Shadow calculation
    #redgpu_if receiveShadow
    {
        output.shadowCoord = getShadowCoord(position.xyz, systemUniforms.directionalLightProjectionViewMatrix);
        output.receiveShadow = globalVertexData.receiveShadow;
    }
    #redgpu_endIf

    // Motion vector calculation
    {
      output.currentClipPos = su_projection.noneJitterProjectionViewMatrix * position;
      output.prevClipPos = su_projection.prevNoneJitterProjectionViewMatrix * gu_prevModelMatrix * input_position_vec4;
    }

    return output;
}

