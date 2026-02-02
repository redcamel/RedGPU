struct BillboardResult {
    position: vec4<f32>,       // [KO] 클립 공간 좌표 [EN] Clip space position
    vertexPosition: vec3<f32>, // [KO] 뷰 공간 좌표 [EN] View space position
    vertexNormal: vec3<f32>,   // [KO] 뷰 공간 법선 [EN] View space normal
}

/**
 * [KO] 빌보드 및 픽셀 크기 모드를 지원하는 공통 정점 변환 함수입니다.
 * [EN] Common vertex transformation function supporting billboard and pixel size modes.
 */
fn calcBillboard(
    input_position: vec3<f32>,
    input_normal: vec3<f32>,
    modelMatrix: mat4x4<f32>,
    cameraMatrix: mat4x4<f32>,
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
        let billboardMatrix = getBillboardMatrix(cameraMatrix, modelMatrix);
        
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
        viewPos = cameraMatrix * modelMatrix * ratioScaleMatrix * vec4<f32>(input_position, 1.0);
        viewNormal = cameraMatrix * modelMatrix * ratioScaleMatrix * vec4<f32>(input_normal, 0.0);
        result.position = projectionMatrix * viewPos;
    }

    result.vertexPosition = viewPos.xyz;
    result.vertexNormal = normalize(viewNormal.xyz);
    
    return result;
}
