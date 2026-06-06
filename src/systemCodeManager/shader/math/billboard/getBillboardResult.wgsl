/**
 * [KO] 빌보드 계산 결과 구조체입니다.
 * [EN] Billboard calculation result structure.
 */
struct BillboardResult {
    position: vec4<f32>,       // [KO] 클립 공간 좌표 [EN] Clip space position
    vertexPosition: vec3<f32>, // [KO] 뷰 공간 좌표 [EN] View space position
    vertexNormal: vec3<f32>,   // [KO] 뷰 공간 법선 [EN] View space normal
}

/**
 * [KO] 빌보드 및 픽셀 크기 모드를 지원하는 공통 정점 변환 결과 데이터를 리턴합니다.
 * [EN] Returns common vertex transformation result data supporting billboard and pixel size modes.
 *
 * @param input_position [KO] 입력 정점 위치 [EN] Input vertex position
 * @param input_normal [KO] 입력 정점 법선 [EN] Input vertex normal
 * @param modelMatrix [KO] 모델 행렬 [EN] Model matrix
 * @param viewMatrix [KO] 뷰 행렬 [EN] View matrix
 * @param projectionMatrix [KO] 투영 행렬 [EN] Projection matrix
 * @param resolution [KO] 화면 해상도 [EN] Screen resolution
 * @param useBillboard [KO] 빌보드 사용 여부 (1u: 사용) [EN] Whether to use billboard (1u: yes)
 * @param usePixelSize [KO] 픽셀 크기 모드 사용 여부 (1u: 사용) [EN] Whether to use pixel size mode (1u: yes)
 * @param pixelSize [KO] 픽셀 크기 [EN] Pixel size
 * @param renderRatioX [KO] 렌더링 가로 비율 [EN] Rendering horizontal ratio
 * @param renderRatioY [KO] 렌더링 세로 비율 [EN] Rendering vertical ratio
 * @returns [KO] 빌보드 계산 결과 데이터 [EN] Billboard calculation result data
 */
fn getBillboardResult(
    input_position: vec3<f32>,
    input_normal: vec3<f32>,
    modelMatrix: mat4x4<f32>,
    viewMatrix: mat4x4<f32>,
    projectionMatrix: mat4x4<f32>,
    resolution: vec2<f32>,
    useBillboard: u32,
    usePixelSize: u32,
    pixelSize: f32,
    renderRatioX: f32,
    renderRatioY: f32
) -> BillboardResult {
    var result: BillboardResult;
    
    let ratioScaleMatrix = mat4x4<f32>(
        renderRatioX, 0, 0, 0,
        0, renderRatioY, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    );

    var viewPos: vec4<f32>;
    var viewNormal: vec4<f32>;

    if (useBillboard == 1u) {
        let billboardMatrix = getBillboardMatrix(viewMatrix, modelMatrix, 1u);
        
        if (usePixelSize == 1u) {
            // [Pixel Size 모드] - 피벗 기반 확장 및 W-보정 적용
            let viewCenter = billboardMatrix * vec4<f32>(0.0, 0.0, 0.0, 1.0);
            let clipCenter = projectionMatrix * viewCenter;

            let scaleX = (pixelSize / resolution.x) * 2.0 * renderRatioX;
            let scaleY = (pixelSize / resolution.y) * 2.0 * renderRatioY;

            result.position = vec4<f32>(
                clipCenter.xy + input_position.xy * vec2<f32>(scaleX, scaleY) * clipCenter.w,
                clipCenter.zw
            );
            viewPos = viewCenter;
            viewNormal = vec4<f32>(0.0, 0.0, 1.0, 0.0);
        } else {
            // [월드 모드] - 일반 빌보드 변환
            viewPos = billboardMatrix * ratioScaleMatrix * vec4<f32>(input_position, 1.0);
            viewNormal = vec4<f32>(0.0, 0.0, 1.0, 0.0); 
            result.position = projectionMatrix * viewPos;
        }
    } else {
        // [일반 모드] - 빌보드 없는 평면 변환
        viewPos = viewMatrix * modelMatrix * ratioScaleMatrix * vec4<f32>(input_position, 1.0);
        viewNormal = viewMatrix * modelMatrix * ratioScaleMatrix * vec4<f32>(input_normal, 0.0);
        result.position = projectionMatrix * viewPos;
    }

    result.vertexPosition = viewPos.xyz;
    result.vertexNormal = normalize(viewNormal.xyz);
    
    return result;
}
