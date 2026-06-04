#redgpu_include SYSTEM_UNIFORM;
#redgpu_include shadow.getShadowCoord;
#redgpu_include entryPoint.mesh.entryPointShadowVertex;
#redgpu_include entryPoint.mesh.entryPointPickingVertex;
#redgpu_include displacement.getDisplacementPosition;
#redgpu_include displacement.getDisplacementNormal;

#redgpu_include systemStruct.meshVertexBasicUniform;

const maxDistance: f32 = 1000.0;
const maxMipLevel: f32 = 10.0;

@group(1) @binding(0) var<uniform> vertexUniforms: VertexUniforms;
@group(1) @binding(1) var displacementTextureSampler: sampler;
@group(1) @binding(2) var displacementTexture: texture_2d<f32>;


@vertex
fn main(inputData: InputData) -> VertexOutput {
    var output: VertexOutput;

    // System uniforms
    #redgpu_if disableJitter
    {
        let u_projectionMatrix = systemUniforms.projection.noneJitterProjectionViewMatrix;
    }
    #redgpu_else
    {
        let u_projectionMatrix = systemUniforms.projection.projectionMatrix;
    }
    #redgpu_endIf

    let u_projectionViewMatrix = systemUniforms.projection.projectionViewMatrix;
    let u_noneJitterProjectionViewMatrix = systemUniforms.projection.noneJitterProjectionViewMatrix;
    let u_prevNoneJitterProjectionViewMatrix = systemUniforms.projection.prevNoneJitterProjectionViewMatrix;
    let u_resolution = systemUniforms.resolution;
    let u_camera = systemUniforms.camera;
    let u_viewMatrix = u_camera.viewMatrix;
    let u_cameraPosition = u_camera.cameraPosition;

    // Vertex uniforms
    let u_matrixList = vertexUniforms.matrixList;
    let u_modelMatrix = u_matrixList.modelMatrix;
    let u_prevModelMatrix = u_matrixList.prevModelMatrix;
    let u_normalModelMatrix = u_matrixList.normalModelMatrix;
    let u_displacementScale = vertexUniforms.displacementScale;
    let u_useDisplacementTexture = vertexUniforms.useDisplacementTexture == 1u;
    let u_receiveShadow = vertexUniforms.receiveShadow;

    // Light uniforms
    let u_directionalLightCount = systemUniforms.directionalLightCount;
    let u_directionalLights = systemUniforms.directionalLights;
    let u_directionalLightProjectionViewMatrix = systemUniforms.directionalLightProjectionViewMatrix;

    // Input data
    let input_position = inputData.position;
    let input_position_vec4 = vec4<f32>(input_position, 1.0);
    let input_vertexNormal = inputData.vertexNormal;
    let input_uv = inputData.uv;

    // [KO] 트랜스폼이 적용된 UV 계산
    let transformedUV = input_uv * vertexUniforms.uvTransform.zw + vertexUniforms.uvTransform.xy;

    // Position and normal calculation
    var position: vec4<f32>;
    var normalPosition: vec4<f32>;


    #redgpu_if useDisplacementTexture
        // [KO] 실제 텍스처의 최대 밉레벨을 가져와서 거리에 비례한 샘플링 레벨을 결정합니다.
        // [EN] Get the actual maximum mip level of the texture and determine the sampling level proportional to the distance.
        let tempPosition = u_modelMatrix * input_position_vec4;
        let dist = distance(tempPosition.xyz, u_cameraPosition);
        let maxMip = f32(textureNumLevels(displacementTexture)) - 1.0;
        
        // [KO] 거리에 따른 밉레벨 계산 (+1.0 바이어스를 통해 8비트 격자 무늬를 부드럽게 완화합니다)
        // [EN] Mip level calculation based on distance (smoothing 8-bit grid patterns through +1.0 bias)
        let targetMipLevel = clamp((dist / maxDistance) * maxMip + 1.0, 0.0, maxMip);

        // [KO] 트랜스폼된 UV를 사용하여 위치 이동 계산
        let displacedPosition = getDisplacementPosition(
            input_position,
            input_vertexNormal,
            displacementTexture,
            displacementTextureSampler,
            u_displacementScale,
            transformedUV,
            targetMipLevel
        );

        position = u_modelMatrix * vec4<f32>(displacedPosition, 1.0);

        // [KO] 로컬 공간 기저(TBN) 구축 - Gram-Schmidt 과정을 통한 완벽한 직교화
        // [EN] Construct local space basis (TBN) - Perfect orthogonalization via Gram-Schmidt process
        let N = normalize(input_vertexNormal);
        let T = normalize(inputData.vertexTangent.xyz - N * dot(inputData.vertexTangent.xyz, N));
        let B = cross(N, T) * inputData.vertexTangent.w;
        let tbn = mat3x3<f32>(T, B, N);

        // [KO] 탄젠트 공간에서 계산된 노멀을 가져옴
        let tangentDisplacedNormal = getDisplacementNormal(
            displacementTexture,
            displacementTextureSampler,
            u_displacementScale,
            transformedUV,
            targetMipLevel
        );

        // [KO] TBN 행렬을 통해 탄젠트 공간 노멀 -> 로컬 공간 노멀로 변환
        let localDisplacedNormal = tbn * tangentDisplacedNormal;

        // [KO] 최종 로컬 노멀을 월드 공간으로 변환 (W=0.0 사용)
        let worldDisplacedNormal = normalize((u_normalModelMatrix * vec4<f32>(localDisplacedNormal, 0.0)).xyz);
        normalPosition = vec4<f32>(worldDisplacedNormal, 0.0);
    #redgpu_else
        position = u_modelMatrix * input_position_vec4;
        // [KO] 방향 벡터 변환이므로 W=0.0 사용 및 정규화
        let worldNormal = normalize((u_normalModelMatrix * vec4<f32>(input_vertexNormal, 0.0)).xyz);
        normalPosition = vec4<f32>(worldNormal, 0.0);
    #redgpu_endIf

    // Basic output assignments
    output.position = u_projectionViewMatrix * position;
    output.vertexPosition = position.xyz;
    output.vertexNormal = normalPosition.xyz;
    output.uv = transformedUV;

    let transformedTangentXYZ = (u_normalModelMatrix * vec4<f32>(inputData.vertexTangent.xyz, 0.0)).xyz;
    output.vertexTangent = vec4<f32>(normalize(transformedTangentXYZ), inputData.vertexTangent.w);

    output.combinedOpacity = vertexUniforms.combinedOpacity;

    // Shadow calculation
    #redgpu_if receiveShadow
    {
        output.shadowCoord = getShadowCoord(position.xyz, u_directionalLightProjectionViewMatrix);
        output.receiveShadow = vertexUniforms.receiveShadow;
    }
    #redgpu_endIf

    // Motion vector calculation
    {
      output.currentClipPos = u_noneJitterProjectionViewMatrix * position;
      output.prevClipPos = u_prevNoneJitterProjectionViewMatrix * u_prevModelMatrix * input_position_vec4;
    }

    return output;
}

