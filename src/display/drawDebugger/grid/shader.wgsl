#redgpu_include SYSTEM_UNIFORM;
#redgpu_include FragmentOutput;
#redgpu_include calculateMotionVector;

// --- 데이터 구조 정의 ---
struct VertexIn {
    @location(0) position: vec4<f32>,
    @location(1) color: vec4<f32>,
}

struct VertexOut {
    @builtin(position) position: vec4<f32>,
    @location(0) color: vec4<f32>,
    @location(1) worldPos: vec3<f32>,
    @location(2) currentClipPos: vec4<f32>,
    @location(3) prevClipPos: vec4<f32>,
}

struct GridArgs {
    lineColor: vec4<f32>,
}

@group(1) @binding(0) var<uniform> gridArgs: GridArgs;

// --- 상수 정의 (가독성 및 유지보수용) ---
const FADE_START: f32 = 20.0;
const FADE_END: f32 = 80.0;
const AXIS_THRESHOLD: f32 = 0.8;
const AXIS_ALPHA: f32 = 0.8;

// --- 버텍스 셰이더 ---
@vertex
fn vertexMain(inputData: VertexIn) -> VertexOut {
    var output: VertexOut;

    let modelPos = inputData.position;
    let viewProj = systemUniforms.noneJitterProjectionCameraMatrix;
    let prevViewProj = systemUniforms.prevNoneJitterProjectionCameraMatrix;

    // 기본 위치 계산
    output.position = viewProj * modelPos;
    output.worldPos = modelPos.xyz;
    output.color = inputData.color;

    // 모션 벡터용 데이터 저장
    output.currentClipPos = output.position;
    output.prevClipPos = prevViewProj * modelPos;

    return output;
}

// --- 프래그먼트 셰이더 ---
@fragment
fn fragmentMain(inputData: VertexOut) -> FragmentOutput {
    var output: FragmentOutput;

    // 1. 거리 기반 투명도(Fade) 계산
    let distanceToCamera = length(inputData.worldPos - systemUniforms.camera.cameraPosition);
    let distanceFade = clamp(1.0 - saturate((distanceToCamera - FADE_START) / (FADE_END - FADE_START)),0.5,1.0);

    // 2. 색상 및 기본 알파 결정 (X/Z축 강조 로직)
    var finalColor: vec3<f32>;
    var baseAlpha: f32;

    let isXAxis = inputData.color.r > AXIS_THRESHOLD;
    let isZAxis = inputData.color.b > AXIS_THRESHOLD;

    if (isXAxis) {
        finalColor = vec3<f32>(1.0, 0.0, 0.0); // X축: 빨강
        baseAlpha = AXIS_ALPHA;
    } else if (isZAxis) {
        finalColor = vec3<f32>(0.0, 0.0, 1.0); // Z축: 파랑
        baseAlpha = AXIS_ALPHA;
    } else {
        finalColor = gridArgs.lineColor.rgb;   // 일반 그리드
        baseAlpha = gridArgs.lineColor.a;
    }

    // 3. 최종 출력값 설정
    output.color = vec4<f32>(finalColor, baseAlpha * distanceFade);
//    output.color = vec4<f32>(finalColor, baseAlpha);

    // 4. 모션 벡터 계산 및 저장
    let motion = calculateMotionVector(inputData.currentClipPos, inputData.prevClipPos);
    output.gBufferMotionVector = vec4<f32>(motion, 0.0, 1.0);

    return output;
}
