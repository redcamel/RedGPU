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
        // [KO] 최고의 디테일을 위해 밉맵을 사용하지 않고 원본 해상도(0.0)로 샘플링합니다.
        // [EN] Sample at original resolution (0.0) without using mipmaps for maximum detail.
        let targetMipLevel = 0.0;

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

        // [KO] 로컬 공간 기저(TBN) 구축 - 수치 안정성을 위해 재정규화 수행
        let localNormal = normalize(input_vertexNormal);
        let localTangent = normalize(inputData.vertexTangent.xyz);
        let localBitangent = normalize(cross(localNormal, localTangent) * inputData.vertexTangent.w);
        let tbn = mat3x3<f32>(localTangent, localBitangent, localNormal);

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

