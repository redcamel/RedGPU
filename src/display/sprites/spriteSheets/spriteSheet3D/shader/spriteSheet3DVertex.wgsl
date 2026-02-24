#redgpu_include SYSTEM_UNIFORM;
#redgpu_include getBillboardMatrix;
#redgpu_include getBillboardResult;
#redgpu_include entryPoint.billboard.entryPointPickingVertex;
#redgpu_include entryPoint.empty.entryPointShadowVertex;

/**
 * [KO] 행렬 목록 구조체 정의입니다.
 * [EN] Matrix list structure definition.
 */
struct MatrixList{
    modelMatrix: mat4x4<f32>,
    normalModelMatrix: mat4x4<f32>,
}

/**
 * [KO] 스프라이트 시트 3D를 위한 버텍스 유니폼 구조체입니다.
 * [EN] Vertex uniform structure for SpriteSheet 3D.
 */
struct VertexUniforms {
    matrixList: MatrixList,
    pickingId: u32,
    useSizeAttenuation: u32,
    useBillboard: u32,
    segmentW: f32,
    segmentH: f32,
    totalFrame: f32,
    currentIndex: f32,
    usePixelSize: u32,
    pixelSize: f32,
    _renderRatioX: f32,
    _renderRatioY: f32,
    combinedOpacity: f32,
};

@group(1) @binding(0) var<uniform> vertexUniforms: VertexUniforms;

/**
 * [KO] 버텍스 입력 데이터 구조체입니다.
 * [EN] Vertex input data structure.
 */
struct InputData {
    @location(0) position: vec3<f32>,
    @location(1) vertexNormal: vec3<f32>,
    @location(2) uv: vec2<f32>,
};

/**
 * [KO] 버텍스 출력 데이터 구조체입니다.
 * [EN] Vertex output data structure.
 */
struct OutputData {
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
 * [KO] 스프라이트 시트 3D 메인 버텍스 셰이더 엔트리 포인트입니다.
 * [EN] Main vertex shader entry point for SpriteSheet 3D.
 */
@vertex
fn main(inputData: InputData) -> OutputData {
    var output: OutputData;

    // [KO] 빌보드 및 사이즈 보정 계산 결과 획득
    // [EN] Get billboard and size attenuation calculation results
    let billboardResult = getBillboardResult(
        inputData.position,
        inputData.vertexNormal,
        vertexUniforms.matrixList.modelMatrix,
        systemUniforms.camera.viewMatrix,
        systemUniforms.projection.projectionMatrix,
        systemUniforms.resolution,
        vertexUniforms.useBillboard,
        vertexUniforms.usePixelSize,
        vertexUniforms.pixelSize,
        vertexUniforms._renderRatioX,
        vertexUniforms._renderRatioY
    );

    output.position = billboardResult.position;
    output.vertexPosition = billboardResult.vertexPosition;
    output.vertexNormal = billboardResult.vertexNormal;
    
    // [KO] UV 좌표 계산 (스프라이트 시트 애니메이션 적용)
    // [EN] Calculate UV coordinates (apply sprite sheet animation)
    output.uv = vec2<f32>(
        inputData.uv.x / vertexUniforms.segmentW + ((vertexUniforms.currentIndex % vertexUniforms.segmentW) / vertexUniforms.segmentW),
        inputData.uv.y / vertexUniforms.segmentH - (floor(vertexUniforms.currentIndex / vertexUniforms.segmentH) / vertexUniforms.segmentH)
    );
    
    output.combinedOpacity = vertexUniforms.combinedOpacity;

    return output;
}
