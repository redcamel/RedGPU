#redgpu_include SYSTEM_UNIFORM;
#redgpu_include shadow.getShadowCoord;
#redgpu_include shadow.getShadowClipPosition;

#redgpu_include systemStruct.globalVertexUniform;

@group(1) @binding(1) var displacementTextureSampler: sampler;
@group(1) @binding(2) var displacementTexture: texture_2d<f32>;
@group(1) @binding(3) var<storage, read> vertexStorages: array<mat4x4<f32>>;
@group(1) @binding(4) var<storage, read> prevVertexStorages: array<mat4x4<f32>>;

/**
 * [KO] 스키닝이 적용된 메시의 버텍스 입력 구조체입니다.
 * [EN] Vertex input structure for skinned meshes.
 */
struct InputDataSkin {
    @builtin(instance_index) globalVertexBufferSlotIndex: u32,
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
    @location(9) @interpolate(flat) globalFragmentBufferSlotIndex: u32,

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
    let globalVertexUniforms = globalVertexUniformBuffer[inputData.globalVertexBufferSlotIndex];
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
    let gu_matrixList = globalVertexUniforms.matrixList;
    let gu_localMatrix = gu_matrixList.localMatrix;
    let gu_modelMatrix = gu_matrixList.modelMatrix;
    let gu_prevModelMatrix = gu_matrixList.prevModelMatrix;
    let gu_normalModelMatrix = gu_matrixList.normalModelMatrix;


    // [KO] 조명 데이터 캐싱
    // [EN] Cache lighting data
    let su_directionalLightProjectionViewMatrix = systemUniforms.directionalLightProjectionViewMatrix;

    // [KO] 스키닝 행렬 획득
    // [EN] Get skinning matrices
    let skinMat = vertexStorages[inputData.idx];
    let prevSkinMat = prevVertexStorages[inputData.idx];

    // [KO] 스킨드 포지션 및 월드 포지션 계산
    // [EN] Calculate skinned position and world position
    let skinnedPosition = (skinMat * vec4<f32>(inputData.position, 1.0));
    let position = gu_modelMatrix * skinnedPosition;

    // [KO] 스킨드 노말 및 최종 노말 변환
    // [EN] Calculate skinned normal and final normal transformation
    let skinnedNormal = (skinMat * vec4<f32>(input_vertexNormal, 0.0)).xyz;
    let transformedNormal = normalize((gu_normalModelMatrix * vec4<f32>(skinnedNormal, 0.0)).xyz);
    output.vertexNormal = transformedNormal;

    // [KO] 탄젠트 변환 (노말과 동일하게 처리)
    // [EN] Tangent transformation (processed same as normal)
    let skinnedTangent = (skinMat * vec4<f32>(inputData.vertexTangent.xyz, 0.0)).xyz;
    let transformedTangentXYZ = (gu_normalModelMatrix * vec4<f32>(skinnedTangent, 0.0)).xyz;
    output.vertexTangent = vec4<f32>(normalize(transformedTangentXYZ), inputData.vertexTangent.w);

    // [KO] 출력 데이터 할당
    // [EN] Assign output data
    output.position = su_projectionViewMatrix * position;
    output.vertexPosition = position.xyz;
    output.uv = inputData.uv;
    output.uv1 = inputData.uv1;
    output.vertexColor_0 = inputData.vertexColor_0;
    output.globalFragmentBufferSlotIndex = globalVertexUniforms.globalFragmentBufferSlotIndex;

    // [KO] 그림자 좌표 계산
    // [EN] Calculate shadow coordinates
    #redgpu_if receiveShadow
    {
        output.shadowCoord = getShadowCoord(position.xyz, su_directionalLightProjectionViewMatrix);
        output.receiveShadow = globalVertexUniforms.receiveShadow;
    }
    #redgpu_endIf

    // [KO] 모션 벡터 계산을 위한 클립 좌표 저장
    // [EN] Store clip coordinates for motion vector calculation
    {
        output.currentClipPos = su_projection.noneJitterProjectionViewMatrix * position;
        output.prevClipPos = su_projection.prevNoneJitterProjectionViewMatrix * gu_prevModelMatrix  * (prevSkinMat * input_position_vec4);
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

    let globalVertexUniforms = globalVertexUniformBuffer[inputData.globalVertexBufferSlotIndex];
    let su_directionalLightProjectionViewMatrix = systemUniforms.directionalLightProjectionViewMatrix;
    let gu_modelMatrix = globalVertexUniforms.matrixList.modelMatrix;
    let input_position = inputData.position;

    // [KO] 스키닝이 적용된 그림자 위치 계산
    // [EN] Calculate skinned shadow position
    let skinMat = vertexStorages[inputData.idx];
    let position = gu_modelMatrix * skinMat * vec4<f32>(input_position, 1.0);
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

    let globalVertexUniforms = globalVertexUniformBuffer[inputData.globalVertexBufferSlotIndex];

    // [KO] 스키닝이 적용된 피킹 위치 계산
    // [EN] Calculate skinned picking position
    let skinMat = vertexStorages[inputData.idx];
    let position = globalVertexUniforms.matrixList.modelMatrix * skinMat * vec4<f32>(inputData.position, 1.0);
    output.position = systemUniforms.projection.projectionViewMatrix * position;
    output.pickingId = unpack4x8unorm(globalVertexUniforms.pickingId);

    return output;
}
