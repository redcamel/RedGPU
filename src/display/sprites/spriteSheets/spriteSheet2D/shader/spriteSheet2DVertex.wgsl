#redgpu_include SYSTEM_UNIFORM;

/**
 * [KO] 스프라이트 시트 2D를 위한 버텍스 유니폼 구조체입니다.
 * [EN] Vertex uniform structure for SpriteSheet 2D.
 */
struct SpriteSheet2DVertexUniforms {
    segmentW: f32,
    segmentH: f32,
    totalFrame: f32,
    currentIndex: f32,
};

@group(1) @binding(0) var<uniform> vertexUniforms: SpriteSheet2DVertexUniforms;

/**
 * [KO] 버텍스 입력 데이터 구조체입니다.
 * [EN] Vertex input data structure.
 */
struct InputData {
    @builtin(instance_index) globalBufferSlotIndex: u32,
    @location(0) position: vec3<f32>,
    @location(1) vertexNormal: vec3<f32>,
    @location(2) uv: vec2<f32>,
};

/**
 * [KO] 버텍스 출력 데이터 구조체입니다.
 * [EN] Vertex output data structure.
 */
struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) vertexPosition: vec3<f32>,
    @location(1) vertexNormal: vec3<f32>,
    @location(2) uv: vec2<f32>,

    @location(7) currentClipPos: vec4<f32>,
    @location(8) prevClipPos: vec4<f32>,
    @location(11) combinedOpacity: f32,

    @location(12) motionVector: vec3<f32>,
    @location(13) shadowCoord: vec3<f32>,
    @location(15) @interpolate(flat) pickingId: vec4<f32>,
};

/**
 * [KO] 스프라이트 시트 2D 메인 버텍스 셰이더 엔트리 포인트입니다.
 * [EN] Main vertex shader entry point for SpriteSheet 2D.
 */
@vertex
fn main(inputData: InputData) -> VertexOutput {
    var output: VertexOutput;
    let globalVertexUniforms = globalSSAOVertexBuffer[inputData.globalBufferSlotIndex];
    // [KO] 시스템 유니폼 변수 가져오기
    // [EN] Get system uniform variables
    let u_projectionMatrix = systemUniforms.projection.projectionMatrix;
    let u_camera = systemUniforms.camera;
    let u_viewMatrix = u_camera.viewMatrix;

    // [KO] 버텍스 유니폼 변수 가져오기
    // [EN] Get vertex uniform variables
    let u_modelMatrix = globalVertexUniforms.matrixList.modelMatrix;
    let u_normalModelMatrix = globalVertexUniforms.matrixList.normalModelMatrix;

    // [KO] 입력 데이터 처리
    // [EN] Process input data
    let input_position = inputData.position;
    let input_vertexNormal = inputData.vertexNormal;
    let input_uv = inputData.uv;

    // [KO] 위치 및 노말 변환
    // [EN] Position and normal transformation
    let viewPos = u_viewMatrix * u_modelMatrix * vec4<f32>(input_position, 1.0);
    let viewNormal = u_viewMatrix * u_normalModelMatrix * vec4<f32>(input_vertexNormal, 0.0);

    // [KO] 최종 클립 공간 위치 계산
    // [EN] Calculate final clip space position
    output.position = u_projectionMatrix * viewPos;

    // [KO] 출력 데이터 설정
    // [EN] Set output data
    output.vertexPosition = viewPos.xyz;
    output.vertexNormal = viewNormal.xyz;
    output.combinedOpacity = globalVertexUniforms.combinedOpacity;

    // [KO] UV 좌표 계산 (스프라이트 시트 애니메이션 적용)
    // [EN] Calculate UV coordinates (apply sprite sheet animation)
    let uv = vec2<f32>(
        input_uv.x * (1.0 / vertexUniforms.segmentW) + ((vertexUniforms.currentIndex % vertexUniforms.segmentW) / vertexUniforms.segmentW),
        input_uv.y * (1.0 / vertexUniforms.segmentH) - (floor(vertexUniforms.currentIndex / vertexUniforms.segmentH) / vertexUniforms.segmentH)
    );

    output.uv = uv;
    return output;
}

/**
 * [KO] 스프라이트 시트 2D 피킹 처리를 위한 버텍스 셰이더입니다.
 * [EN] Vertex shader for SpriteSheet 2D picking.
 */
@vertex
fn entryPointPickingVertex(inputData: InputData) -> VertexOutput {
    var output: VertexOutput;

    let globalVertexUniforms = globalSSAOVertexBuffer[inputData.globalBufferSlotIndex];
    let u_projectionMatrix = systemUniforms.projection.projectionMatrix;
    let u_viewMatrix = systemUniforms.camera.viewMatrix;
    let u_modelMatrix = globalVertexUniforms.matrixList.modelMatrix;

    let viewPos = u_viewMatrix * u_modelMatrix * vec4<f32>(inputData.position, 1.0);
    output.position = u_projectionMatrix * viewPos;

    // [KO] 피킹 ID 할당
    // [EN] Assign picking ID
    output.pickingId = unpack4x8unorm(globalVertexUniforms.pickingId);

    return output;
}
