#redgpu_include SYSTEM_UNIFORM;
#redgpu_include systemStruct.OutputFragment;
#redgpu_include math.getMotionVector;

/**
 * [KO] 그리드 디버거를 위한 버텍스 입력 구조체입니다.
 * [EN] Vertex input structure for the grid debugger.
 */
struct InputData {
    @location(0) position: vec3<f32>,
}

/**
 * [KO] 버텍스 셰이더 출력 및 프래그먼트 셰이더 입력 구조체입니다.
 * [EN] Vertex shader output and fragment shader input structure.
 */
struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) worldPos: vec3<f32>,
    @location(1) currentClipPos: vec4<f32>,
    @location(2) prevClipPos: vec4<f32>,
}

/**
 * [KO] 그리드 설정을 위한 유니폼 구조체입니다. (16바이트 정렬 준수)
 * [EN] Uniform structure for grid settings. (Complies with 16-byte alignment)
 */
struct GridArgs {
    lineColor: vec4<f32>,       // 0: 기본 보조선(Minor) 색상 및 투명도 (RGBA)
    majorLineColor: vec4<f32>,  // 16: 주선(Major) 색상 및 투명도 (RGBA)
    xAxisColor: vec4<f32>,      // 32: X축 중심선 색상 및 투명도 (RGBA, 빨강)
    zAxisColor: vec4<f32>,      // 48: Z축 중심선 색상 및 투명도 (RGBA, 파랑)
    size: f32,                  // 64: 그리드 평면 크기 (m)
    gridSize: f32,              // 68: 기본 보조 그리드 간격 (m, 예: 1.0)
    majorStep: f32,             // 72: 주 그리드 간격 (m, 예: 10.0)
    lineWidth: f32,             // 76: 보조선 화면 픽셀 두께
    majorLineWidth: f32,        // 80: 주선 화면 픽셀 두께
    axisLineWidth: f32,         // 84: X/Z 축 화면 픽셀 두께
    fadeStart: f32,             // 88: 미사용 (하위 호환 패딩)
    fadeEnd: f32,               // 92: 미사용 (하위 호환 패딩)
}

@group(1) @binding(0) var<uniform> gridArgs: GridArgs;

/**
 * [KO] 모아레(Moiré) 간섭 파동을 원천 차단하는 절차적 안티앨리어싱 라인 함수
 * [EN] Procedural anti-aliased line function that completely eliminates moiré interference waves
 */
fn computeGridLine(coord: vec2<f32>, lineWidthPixels: f32) -> f32 {
    let fw = fwidth(coord);
    let maxFw = max(fw.x, fw.y);

    // 1. 나이퀴스트 한계(0.5) 접근 시 모아레(파동) 원천 차단
    // fw가 0.12를 넘어가면(1픽셀 내 격자 밀도가 너무 높아지면) 부드럽게 감쇠되어 주선(Major)으로 자연스럽게 전환
    let lodFade = 1.0 - saturate((maxFw - 0.12) / 0.28);
    if (lodFade <= 0.001) {
        return 0.0;
    }

    // 2. 격자선 중심(0.0)과의 거리 계산
    let gridFract = abs(fract(coord - 0.5) - 0.5);

    // 3. 픽셀 단위 두께에 맞춘 안티앨리어싱 필터링
    let halfWidth = fw * (lineWidthPixels * 0.5);
    let line = smoothstep(halfWidth + fw * 0.5, halfWidth - fw * 0.5, gridFract);
    let lineMask = max(line.x, line.y);

    return lineMask * lodFade;
}

/**
 * [KO] 그리드 버텍스 셰이더 엔트리 포인트입니다.
 * [EN] Grid vertex shader entry point.
 */
@vertex
fn vertexMain(inputData: InputData) -> VertexOutput {
    var output: VertexOutput;

    // 월드 원점 기준 평면 메쉬 생성
    // 바닥 메쉬(y=0)와의 Z-Fighting을 방지하기 위해 y축에 미세한 오프셋(0.001) 부여
    let worldPos = vec3<f32>(
        inputData.position.x * gridArgs.size,
        inputData.position.y + 0.001,
        inputData.position.z * gridArgs.size
    );
    let modelPos = vec4<f32>(worldPos, 1.0);

    let viewProj = systemUniforms.projection.noneJitterProjectionViewMatrix;
    let prevViewProj = systemUniforms.projection.prevNoneJitterProjectionViewMatrix;

    output.position = viewProj * modelPos;
    output.worldPos = worldPos;
    output.currentClipPos = output.position;
    output.prevClipPos = prevViewProj * modelPos;

    return output;
}

/**
 * [KO] 그리드 프래그먼트 셰이더 엔트리 포인트입니다.
 * [EN] Grid fragment shader entry point.
 */
@fragment
fn fragmentMain(inputData: VertexOutput) -> OutputFragment {
    var output: OutputFragment;

    let worldXZ = inputData.worldPos.xz;

    // 1. 보조 그리드 (Minor Grid, 예: 1m 간격) - 해상도 기반 LOD 안티앨리어싱
    let minorCoord = worldXZ / max(0.001, gridArgs.gridSize);
    let isMinor = computeGridLine(minorCoord, gridArgs.lineWidth);

    // 2. 주 그리드 (Major Grid, 예: 10m 간격) - 해상도 기반 LOD 안티앨리어싱
    let majorCoord = worldXZ / max(0.001, gridArgs.majorStep);
    let isMajor = computeGridLine(majorCoord, gridArgs.majorLineWidth);

    // 3. 좌표축 강조 (X축 = Z가 0인 선, Z축 = X가 0인 선)
    let axisFw = fwidth(worldXZ);
    let isXAxis = smoothstep(axisFw.y * gridArgs.axisLineWidth, 0.0, abs(worldXZ.y));
    let isZAxis = smoothstep(axisFw.x * gridArgs.axisLineWidth, 0.0, abs(worldXZ.x));

    // 4. 계층적 색상 및 알파 합성 (거리 페이드 없이 항상 선명한 고유 알파 유지)
    var finalColor = gridArgs.lineColor.rgb;
    var finalAlpha = isMinor * gridArgs.lineColor.a;

    // 주 그리드 합성 (보조선 위에 주선이 선명하게 오버레이)
    if (isMajor > 0.0) {
        finalColor = mix(finalColor, gridArgs.majorLineColor.rgb, isMajor);
        finalAlpha = max(finalAlpha, isMajor * gridArgs.majorLineColor.a);
    }

    // X축(빨강) 합성
    if (isXAxis > 0.0) {
        finalColor = mix(finalColor, gridArgs.xAxisColor.rgb, isXAxis);
        finalAlpha = max(finalAlpha, isXAxis * gridArgs.xAxisColor.a);
    }

    // Z축(파랑) 합성
    if (isZAxis > 0.0) {
        finalColor = mix(finalColor, gridArgs.zAxisColor.rgb, isZAxis);
        finalAlpha = max(finalAlpha, isZAxis * gridArgs.zAxisColor.a);
    }

    // 선이 없는 빈 공간은 조기 discard (오버드로우 및 블렌딩 연산 제거)
    if (finalAlpha < 0.005) {
        discard;
    }

    output.color = vec4<f32>(finalColor, finalAlpha);

    // 5. G-Buffer 모션 벡터 연동
    let motion = getMotionVector(inputData.currentClipPos, inputData.prevClipPos);
    output.gBufferMotionVector = vec4<f32>(motion, 0.0, 1.0);

    return output;
}
