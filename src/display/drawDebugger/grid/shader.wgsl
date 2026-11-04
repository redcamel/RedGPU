#redgpu_include systemStruct.Projection;

const GRID_Y_OFFSET: f32 = 0.001;
const GRID_CELL_CENTER_OFFSET: f32 = 0.5;
const AA_FILTER_HALF_WIDTH: f32 = 0.5;

const LOD_FADE_START_FW: f32 = 0.12;
const LOD_FADE_END_FW: f32 = 0.40;
const LOD_FADE_RANGE: f32 = LOD_FADE_END_FW - LOD_FADE_START_FW;
const LOD_FADE_EPSILON: f32 = 0.001;
const ALPHA_DISCARD_THRESHOLD: f32 = 0.005;

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
    @location(0) worldXZ: vec2<f32>,
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
    gridSize: f32,              // 68: 기본 보조 그리드 간격 (m, CPU에서 >= 0.001 클램핑 완료)
    majorStep: f32,             // 72: 주 그리드 간격 (m, CPU에서 >= 0.001 클램핑 완료)
    halfLineWidth: f32,         // 76: 보조선 화면 픽셀 절반 두께 (lineWidth * 0.5)
    halfMajorLineWidth: f32,    // 80: 주선 화면 픽셀 절반 두께 (majorLineWidth * 0.5)
    axisLineWidth: f32,         // 84: X/Z 축 화면 픽셀 두께
    pad0: f32,                  // 88: 16-byte tail alignment (legacy fadeStart)
    pad1: f32,                  // 92: 16-byte tail alignment (legacy fadeEnd)
}

@group(0) @binding(0) var<uniform> systemProjection: Projection;
@group(0) @binding(1) var<uniform> gridArgs: GridArgs;

/**
 * [KO] 모아레(Moiré) 간섭 파동을 원천 차단하는 절차적 안티앨리어싱 라인 함수
 * [EN] Procedural anti-aliased line function that completely eliminates moiré interference waves
 */
fn computeGridLine(coord: vec2<f32>, halfLineWidthPixels: f32) -> f32 {
    let fw = fwidth(coord);
    let maxFw = max(fw.x, fw.y);

    // 1. 나이퀴스트 한계(0.5) 접근 시 모아레(파동) 원천 차단
    // fw가 0.12를 넘어가면(1픽셀 내 격자 밀도가 너무 높아지면) 부드럽게 감쇠되어 주선(Major)으로 자연스럽게 전환
    let lodFade = 1.0 - saturate((maxFw - LOD_FADE_START_FW) / LOD_FADE_RANGE);
    if (lodFade <= LOD_FADE_EPSILON) {
        return 0.0;
    }

    // 2. 격자선 중심(0.0)과의 거리 및 안티앨리어싱 외곽 경계 판정 (빈 셀 92~95% 구간 smoothstep 조기 생략)
    let gridFract = abs(fract(coord - GRID_CELL_CENTER_OFFSET) - GRID_CELL_CENTER_OFFSET);
    let halfWidth = fw * halfLineWidthPixels;
    let halfFw = fw * AA_FILTER_HALF_WIDTH;
    let outerEdge = halfWidth + halfFw;
    if (all(gridFract >= outerEdge)) {
        return 0.0;
    }

    // 3. 픽셀 단위 두께에 맞춘 안티앨리어싱 필터링
    let line = smoothstep(outerEdge, halfWidth - halfFw, gridFract);
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
    let worldXZ = inputData.position.xz * gridArgs.size;
    let modelPos = vec4<f32>(
        worldXZ.x,
        inputData.position.y + GRID_Y_OFFSET,
        worldXZ.y,
        1.0
    );

    output.position = systemProjection.noneJitterProjectionViewMatrix * modelPos;
    output.worldXZ = worldXZ;

    return output;
}

/**
 * [KO] 그리드 프래그먼트 셰이더 엔트리 포인트입니다.
 * [EN] Grid fragment shader entry point.
 */
@fragment
fn fragmentMain(inputData: VertexOutput) -> @location(0) vec4<f32> {
    let worldXZ = inputData.worldXZ;

    // 1. 보조 그리드 (Minor Grid, 예: 1m 간격) - 해상도 기반 LOD 안티앨리어싱
    let minorCoord = worldXZ / gridArgs.gridSize;
    let isMinor = computeGridLine(minorCoord, gridArgs.halfLineWidth);

    // 2. 주 그리드 (Major Grid, 예: 10m 간격) - 해상도 기반 LOD 안티앨리어싱
    let majorCoord = worldXZ / gridArgs.majorStep;
    let isMajor = computeGridLine(majorCoord, gridArgs.halfMajorLineWidth);

    // 3. 좌표축 경계 판정 및 빈 공간(92~95% 픽셀) 조기 discard (균일 제어 흐름 내 fwidth 호출 보장)
    let axisFw = fwidth(worldXZ);
    let absWorldXZ = abs(worldXZ);
    let axisOuterEdge = axisFw * gridArgs.axisLineWidth;
    let hasAxis = any(absWorldXZ < axisOuterEdge);

    if (isMinor == 0.0 && isMajor == 0.0 && !hasAxis) {
        discard;
    }

    // 4. 계층적 색상 및 알파 합성 (거리 페이드 없이 항상 선명한 고유 알파 유지)
    var finalColor = gridArgs.lineColor.rgb;
    var finalAlpha = isMinor * gridArgs.lineColor.a;

    // 주 그리드 합성 (보조선 위에 주선이 선명하게 오버레이)
    if (isMajor > 0.0) {
        finalColor = mix(finalColor, gridArgs.majorLineColor.rgb, isMajor);
        finalAlpha = max(finalAlpha, isMajor * gridArgs.majorLineColor.a);
    }

    // X축(빨강) 및 Z축(파랑) 합성 (축 인접 ~0.6% 픽셀에서만 SIMD smoothstep 실행)
    if (hasAxis) {
        let axisMask = smoothstep(axisOuterEdge, vec2<f32>(0.0), absWorldXZ);
        let isZAxis = axisMask.x;
        let isXAxis = axisMask.y;

        if (isXAxis > 0.0) {
            finalColor = mix(finalColor, gridArgs.xAxisColor.rgb, isXAxis);
            finalAlpha = max(finalAlpha, isXAxis * gridArgs.xAxisColor.a);
        }
        if (isZAxis > 0.0) {
            finalColor = mix(finalColor, gridArgs.zAxisColor.rgb, isZAxis);
            finalAlpha = max(finalAlpha, isZAxis * gridArgs.zAxisColor.a);
        }
    }

    // 선 외곽 미세 알파 꼬리 구간 조기 discard
    if (finalAlpha < ALPHA_DISCARD_THRESHOLD) {
        discard;
    }

    return vec4<f32>(finalColor, finalAlpha);
}
