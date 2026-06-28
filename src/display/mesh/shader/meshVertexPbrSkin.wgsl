#redgpu_include SYSTEM_UNIFORM;
#redgpu_include shadow.getShadowCoord;
#redgpu_include shadow.getShadowClipPosition;

#redgpu_include systemStruct.globalVertexStruct;

@group(1) @binding(1) var displacementTextureSampler: sampler;
@group(1) @binding(2) var displacementTexture: texture_2d<f32>;

struct SkinnedVertex {
  position: vec3<f32>,
  normal:   vec3<f32>,
  tangent:  vec4<f32>,
};

@group(1) @binding(3) var<storage, read> skinnedVertices: array<SkinnedVertex>;
@group(1) @binding(4) var<storage, read> prevSkinnedVertices: array<SkinnedVertex>;

/**
 * [KO] 스키닝이 적용된 메시의 버텍스 입력 구조체입니다.
 * [EN] Vertex input structure for skinned meshes.
 */
struct InputDataSkin {
    @builtin(instance_index) globalVertexSlotIndex: u32,
    @builtin(vertex_index) idx: u32,
    @location(0) position: vec3<f32>,
    @location(1) vertexNormal: vec3<f32>,
    @location(2) uv: vec2<f32>,
    @location(3) uv1: vec2<f32>,
    @location(4) vertexColor_0: vec4<f32>,
    @location(5) vertexTangent: vec4<f32>,
};

/**
 * [KO] 스키닝이 적용된 메시의 버텍스 출력 구조체입니다.
 * [EN] Vertex output structure for skinned meshes.
 */
struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) vertexPosition: vec3<f32>,
    @location(1) vertexNormal: vec3<f32>,
    @location(2) uv: vec2<f32>,
    @location(3) uv1: vec2<f32>,
    @location(4) vertexColor_0: vec4<f32>,
    @location(5) vertexTangent: vec4<f32>,

    @location(7) currentClipPos: vec4<f32>,
    @location(8) prevClipPos: vec4<f32>,
    @location(9) @interpolate(flat) globalFragmentSlotIndex: u32,

    @location(10) localNodeScale_volumeScale: vec2<f32>,
    @location(11) combinedOpacity: f32,

    @location(12) motionVector: vec3<f32>,
    @location(13) shadowCoord: vec3<f32>,
    @location(14) @interpolate(flat) receiveShadow: f32,
    @location(15) @interpolate(flat) pickingId: vec4<f32>,
};

#redgpu_include systemStruct.OutputShadowData;

/**
 * [KO] 스킨드 메시의 메인 버텍스 셰이더 엔트리 포인트입니다.
 * [EN] Main vertex shader entry point for skinned meshes.
 */
@vertex
fn main(inputData: InputDataSkin) -> VertexOutput {
    var output: VertexOutput;
    let globalVertexData = globalVertexSSBO[inputData.globalVertexSlotIndex];
    // [KO] 입력 데이터 처리
    // [EN] Process input data
    let input_position = inputData.position;
    let input_position_vec4 = vec4<f32>(input_position, 1.0);
    let input_vertexNormal = inputData.vertexNormal;

    // [KO] 시스템 유니폼 캐싱
    // [EN] Cache system uniforms
    let su_projection = systemUniforms.projection;
    let su_projectionViewMatrix = su_projection.projectionViewMatrix;

    // [KO] 버텍스 유니폼 캐싱
    // [EN] Cache vertex uniforms
    let gu_matrixList = globalVertexData.matrixList;
    let gu_localMatrix = gu_matrixList.localMatrix;
    let gu_modelMatrix = gu_matrixList.modelMatrix;
    let gu_prevModelMatrix = gu_matrixList.prevModelMatrix;
    let gu_normalModelMatrix = gu_matrixList.normalModelMatrix;

    // [KO] 조명 데이터 캐싱
    // [EN] Cache lighting data
    let su_directionalLightProjectionViewMatrix = systemUniforms.directionalLightProjectionViewMatrix;

    // [KO] 컴퓨트 셰이더에서 구워진 스키닝된 데이터 로드
    // [EN] Load skinned data baked in Compute Shader
    let skinnedPosData = skinnedVertices[inputData.idx];
    let prevSkinnedPosData = prevSkinnedVertices[inputData.idx];

    // [KO] 스킨드 월드 포지션 계산
    // [EN] Calculate skinned world position
    let skinnedPosition = vec4<f32>(skinnedPosData.position, 1.0);
    let position = gu_modelMatrix * skinnedPosition;

    // [KO] 스킨드 최종 노말 변환
    // [EN] Calculate skinned final normal transformation
    let skinnedNormal = skinnedPosData.normal;
    let transformedNormal = normalize((gu_normalModelMatrix * vec4<f32>(skinnedNormal, 0.0)).xyz);
    output.vertexNormal = transformedNormal;

    // [KO] 탄젠트 변환
    // [EN] Tangent transformation
    let skinnedTangent = skinnedPosData.tangent.xyz;
    let transformedTangentXYZ = (gu_normalModelMatrix * vec4<f32>(skinnedTangent, 0.0)).xyz;
    output.vertexTangent = vec4<f32>(normalize(transformedTangentXYZ), skinnedPosData.tangent.w);

    // [KO] 출력 데이터 할당
    // [EN] Assign output data
    output.position = su_projectionViewMatrix * position;
    output.vertexPosition = position.xyz;
    output.uv = inputData.uv;
    output.uv1 = inputData.uv1;
    output.vertexColor_0 = inputData.vertexColor_0;
    output.globalFragmentSlotIndex = globalVertexData.globalFragmentSlotIndex;

    // [KO] 그림자 좌표 계산
    // [EN] Calculate shadow coordinates
    #redgpu_if receiveShadow
    {
        output.shadowCoord = getShadowCoord(position.xyz, su_directionalLightProjectionViewMatrix);
        output.receiveShadow = globalVertexData.receiveShadow;
    }
    #redgpu_endIf

    // [KO] 모션 벡터 계산을 위한 클립 좌표 저장
    // [EN] Store clip coordinates for motion vector calculation
    {
        output.currentClipPos = su_projection.noneJitterProjectionViewMatrix * position;
        let prevSkinnedPosition = vec4<f32>(prevSkinnedPosData.position, 1.0);
        output.prevClipPos = su_projection.prevNoneJitterProjectionViewMatrix * gu_prevModelMatrix  * prevSkinnedPosition;
    }

    // [KO] 노드 및 볼륨 스케일 계산
    // [EN] Calculate node and volume scales
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

/**
 * [KO] 스킨드 메시의 섀도우 맵 렌더링을 위한 버텍스 셰이더입니다.
 * [EN] Vertex shader for skinned mesh shadow map rendering.
 */
@vertex
fn entryPointShadowVertex(inputData: InputDataSkin) -> OutputShadowData {
    var output: OutputShadowData;

    let globalVertexData = globalVertexSSBO[inputData.globalVertexSlotIndex];
    let su_directionalLightProjectionViewMatrix = systemUniforms.directionalLightProjectionViewMatrix;
    let gu_modelMatrix = globalVertexData.matrixList.modelMatrix;

    // [KO] 스키닝이 적용된 그림자 위치 계산
    // [EN] Calculate skinned shadow position
    let skinnedPosData = skinnedVertices[inputData.idx];
    let position = gu_modelMatrix * vec4<f32>(skinnedPosData.position, 1.0);
    output.position = getShadowClipPosition(position.xyz, su_directionalLightProjectionViewMatrix);

    return output;
}

/**
 * [KO] 스킨드 메시의 피킹 처리를 위한 버텍스 셰이더입니다.
 * [EN] Vertex shader for skinned mesh picking.
 */
@vertex
fn entryPointPickingVertex(inputData: InputDataSkin) -> VertexOutput {
    var output: VertexOutput;

    let globalVertexData = globalVertexSSBO[inputData.globalVertexSlotIndex];

    // [KO] 스키닝이 적용된 피킹 위치 계산
    // [EN] Calculate skinned picking position
    let skinnedPosData = skinnedVertices[inputData.idx];
    let position = globalVertexData.matrixList.modelMatrix * vec4<f32>(skinnedPosData.position, 1.0);
    output.position = systemUniforms.projection.projectionViewMatrix * position;
    output.pickingId = unpack4x8unorm(globalVertexData.pickingId);

    return output;
}
