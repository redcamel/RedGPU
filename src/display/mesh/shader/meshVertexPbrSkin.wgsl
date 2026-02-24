#redgpu_include SYSTEM_UNIFORM;
#redgpu_include shadow.getShadowCoord;
#redgpu_include shadow.getShadowClipPosition;

#redgpu_include meshVertexBasicUniform;
const maxDistance: f32 = 1000.0;
const maxMipLevel: f32 = 10.0;

@group(1) @binding(0) var<uniform> vertexUniforms: VertexUniforms;
@group(1) @binding(1) var displacementTextureSampler: sampler;
@group(1) @binding(2) var displacementTexture: texture_2d<f32>;
@group(1) @binding(3) var<storage, read> vertexStorages: array<mat4x4<f32>>;
@group(1) @binding(4) var<storage, read> prevVertexStorages: array<mat4x4<f32>>;

/**
 * [KO] 스키닝이 적용된 메시의 버텍스 입력 구조체입니다.
 * [EN] Vertex input structure for skinned meshes.
 */
struct InputDataSkin {
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

    // [KO] 입력 데이터 처리
    // [EN] Process input data
    let input_position = inputData.position;
    let input_position_vec4 = vec4<f32>(input_position, 1.0);
    let input_vertexNormal = inputData.vertexNormal;

    // [KO] 시스템 유니폼 캐싱
    // [EN] Cache system uniforms
    let u_projectionMatrix = systemUniforms.projection.projectionMatrix;
    let u_projectionViewMatrix = systemUniforms.projection.projectionViewMatrix;
    let u_noneJitterProjectionViewMatrix = systemUniforms.projection.noneJitterProjectionViewMatrix;
    let u_prevNoneJitterProjectionViewMatrix = systemUniforms.projection.prevNoneJitterProjectionViewMatrix;
    let u_resolution = systemUniforms.resolution;
    let u_camera = systemUniforms.camera;
    let u_viewMatrix = u_camera.viewMatrix;
    let u_cameraPosition = u_camera.cameraPosition;

    // [KO] 버텍스 유니폼 캐싱
    // [EN] Cache vertex uniforms
    let u_matrixList = vertexUniforms.matrixList;
    let u_localMatrix = u_matrixList.localMatrix;
    let u_modelMatrix = u_matrixList.modelMatrix;
    let u_prevModelMatrix = u_matrixList.prevModelMatrix;
    let u_normalModelMatrix = u_matrixList.normalModelMatrix;
    let u_receiveShadow = vertexUniforms.receiveShadow;

    // [KO] 조명 데이터 캐싱
    // [EN] Cache lighting data
    let u_directionalLightCount = systemUniforms.directionalLightCount;
    let u_directionalLights = systemUniforms.directionalLights;
    let u_directionalLightProjectionViewMatrix = systemUniforms.directionalLightProjectionViewMatrix;

    // [KO] 스키닝 행렬 획득
    // [EN] Get skinning matrices
    let skinMat = vertexStorages[inputData.idx];
    let prevSkinMat = prevVertexStorages[inputData.idx];

    // [KO] 스킨드 포지션 및 월드 포지션 계산
    // [EN] Calculate skinned position and world position
    let skinnedPosition = (skinMat * vec4<f32>(inputData.position, 1.0));
    let position = u_modelMatrix * skinnedPosition;

    // [KO] 스킨드 노말 및 최종 노말 변환
    // [EN] Calculate skinned normal and final normal transformation
    let skinnedNormal = (skinMat * vec4<f32>(input_vertexNormal, 0.0)).xyz;
    let transformedNormal = normalize((u_normalModelMatrix * vec4<f32>(skinnedNormal, 0.0)).xyz);
    output.vertexNormal = transformedNormal;

    // [KO] 탄젠트 변환 (노말과 동일하게 처리)
    // [EN] Tangent transformation (processed same as normal)
    let skinnedTangent = (skinMat * vec4<f32>(inputData.vertexTangent.xyz, 0.0)).xyz;
    let transformedTangentXYZ = (u_normalModelMatrix * vec4<f32>(skinnedTangent, 0.0)).xyz;
    output.vertexTangent = vec4<f32>(normalize(transformedTangentXYZ), inputData.vertexTangent.w);

    // [KO] 출력 데이터 할당
    // [EN] Assign output data
    output.position = u_projectionViewMatrix * position;
    output.vertexPosition = position.xyz;
    output.uv = inputData.uv;
    output.uv1 = inputData.uv1;
    output.vertexColor_0 = inputData.vertexColor_0;

    // [KO] 그림자 좌표 계산
    // [EN] Calculate shadow coordinates
    #redgpu_if receiveShadow
    {
        output.shadowCoord = getShadowCoord(position.xyz, u_directionalLightProjectionViewMatrix);
        output.receiveShadow = vertexUniforms.receiveShadow;
    }
    #redgpu_endIf

    // [KO] 모션 벡터 계산을 위한 클립 좌표 저장
    // [EN] Store clip coordinates for motion vector calculation
    {
        output.currentClipPos = u_noneJitterProjectionViewMatrix * position;
        output.prevClipPos = u_prevNoneJitterProjectionViewMatrix * u_prevModelMatrix  * (prevSkinMat * input_position_vec4);
    }

    // [KO] 노드 및 볼륨 스케일 계산
    // [EN] Calculate node and volume scales
    let nodeScaleX = length(u_localMatrix[0].xyz);
    let nodeScaleY = length(u_localMatrix[1].xyz);
    let nodeScaleZ = length(u_localMatrix[2].xyz);
    let volumeScaleX = length(u_modelMatrix[0].xyz);
    let volumeScaleY = length(u_modelMatrix[1].xyz);
    let volumeScaleZ = length(u_modelMatrix[2].xyz);

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

    let u_directionalLightProjectionViewMatrix = systemUniforms.directionalLightProjectionViewMatrix;
    let u_modelMatrix = vertexUniforms.matrixList.modelMatrix;
    let input_position = inputData.position;

    // [KO] 스키닝이 적용된 그림자 위치 계산
    // [EN] Calculate skinned shadow position
    let skinMat = vertexStorages[inputData.idx];
    let position = u_modelMatrix * skinMat * vec4<f32>(input_position, 1.0);
    output.position = getShadowClipPosition(position.xyz, u_directionalLightProjectionViewMatrix);

    return output;
}

/**
 * [KO] 스킨드 메시의 피킹 처리를 위한 버텍스 셰이더입니다.
 * [EN] Vertex shader for skinned mesh picking.
 */
@vertex
fn entryPointPickingVertex(inputData: InputDataSkin) -> VertexOutput {
    var output: VertexOutput;

    let u_projectionViewMatrix = systemUniforms.projection.projectionViewMatrix;
    let u_modelMatrix = vertexUniforms.matrixList.modelMatrix;

    // [KO] 스키닝이 적용된 피킹 위치 계산
    // [EN] Calculate skinned picking position
    let skinMat = vertexStorages[inputData.idx];
    let position = u_modelMatrix * skinMat * vec4<f32>(inputData.position, 1.0);
    output.position = u_projectionViewMatrix * position;
    output.pickingId = unpack4x8unorm(vertexUniforms.pickingId);

    return output;
}
