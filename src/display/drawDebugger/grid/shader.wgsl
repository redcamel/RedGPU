#redgpu_include SYSTEM_UNIFORM;
#redgpu_include systemStruct.OutputFragment;
#redgpu_include math.getMotionVector;

/**
 * [KO] 그리드 디버거를 위한 셰이더 구조체 정의입니다.
 * [EN] Shader structure definitions for the grid debugger.
 */
struct InputData {
    @location(0) position: vec4<f32>,
    @location(1) color: vec4<f32>,
}

/**
 * [KO] 버텍스 셰이더 출력 및 프래그먼트 셰이더 입력 구조체입니다.
 * [EN] Vertex shader output and fragment shader input structure.
 */
struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) color: vec4<f32>,
    @location(1) worldPos: vec3<f32>,
    @location(2) currentClipPos: vec4<f32>,
    @location(3) prevClipPos: vec4<f32>,
}

/**
 * [KO] 그리드 설정을 위한 유니폼 구조체입니다.
 * [EN] Uniform structure for grid settings.
 */
struct GridArgs {
    lineColor: vec4<f32>,
}

@group(1) @binding(0) var<uniform> gridArgs: GridArgs;

/**
 * [KO] 그리드 렌더링에 사용되는 상수 정의입니다.
 * [EN] Constants used for grid rendering.
 */
const FADE_START: f32 = 20.0;
const FADE_END: f32 = 80.0;
const AXIS_THRESHOLD: f32 = 0.8;
const AXIS_ALPHA: f32 = 0.8;

/**
 * [KO] 그리드 버텍스 셰이더 엔트리 포인트입니다.
 * [EN] Grid vertex shader entry point.
 */
@vertex
fn vertexMain(inputData: InputData) -> VertexOutput {
    var output: VertexOutput;

    let modelPos = inputData.position;
    let viewProj = systemUniforms.projection.noneJitterProjectionViewMatrix;
    let prevViewProj = systemUniforms.projection.prevNoneJitterProjectionViewMatrix;

    // [KO] 월드 및 클립 공간 위치 계산
    // [EN] Calculate world and clip space positions
    output.position = viewProj * modelPos;
    output.worldPos = modelPos.xyz;
    output.color = inputData.color;

    // [KO] TAA 및 모션 블러를 위한 이전/현재 클립 좌표 저장
    // [EN] Store current and previous clip coordinates for TAA and motion blur
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

    // [KO] 1. 거리 기반 페이드(Fade) 효과 계산 (가독성 향상)
    // [EN] 1. Calculate distance-based fade effect (improve readability)
    let distanceToCamera = length(inputData.worldPos - systemUniforms.camera.cameraPosition);
    let distanceFade = clamp(1.0 - saturate((distanceToCamera - FADE_START) / (FADE_END - FADE_START)), 0.5, 1.0);

    // [KO] 2. 축 강조(X: 빨강, Z: 파랑) 및 기본 투명도 결정
    // [EN] 2. Determine axis emphasis (X: Red, Z: Blue) and base alpha
    var finalColor: vec3<f32>;
    var baseAlpha: f32;

    let isXAxis = inputData.color.r > AXIS_THRESHOLD;
    let isZAxis = inputData.color.b > AXIS_THRESHOLD;

    if (isXAxis) {
        finalColor = vec3<f32>(1.0, 0.0, 0.0); // [KO] X축 빨강 [EN] X-axis Red
        baseAlpha = AXIS_ALPHA;
    } else if (isZAxis) {
        finalColor = vec3<f32>(0.0, 0.0, 1.0); // [KO] Z축 파랑 [EN] Z-axis Blue
        baseAlpha = AXIS_ALPHA;
    } else {
        finalColor = gridArgs.lineColor.rgb;   // [KO] 일반 그리드 색상 [EN] General grid color
        baseAlpha = gridArgs.lineColor.a;
    }

    // [KO] 3. 최종 색상 및 투명도 설정
    // [EN] 3. Set final color and alpha
    output.color = vec4<f32>(finalColor, baseAlpha * distanceFade);

    // [KO] 4. G-Buffer 모션 벡터 계산 및 출력
    // [EN] 4. Calculate and output G-Buffer motion vector
    let motion = getMotionVector(inputData.currentClipPos, inputData.prevClipPos);
    output.gBufferMotionVector = vec4<f32>(motion, 0.0, 1.0);

    return output;
}
