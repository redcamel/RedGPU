#redgpu_include SYSTEM_UNIFORM;
#redgpu_include systemStruct.OutputFragment;
#redgpu_include math.getMotionVector;

// --- ?�이??구조 ?�의 ---
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

// --- ?�수 ?�의 (가?�성 �??��?보수?? ---
const FADE_START: f32 = 20.0;
const FADE_END: f32 = 80.0;
const AXIS_THRESHOLD: f32 = 0.8;
const AXIS_ALPHA: f32 = 0.8;

// --- 버텍???�이??---
@vertex
fn vertexMain(inputData: VertexIn) -> VertexOut {
    var output: VertexOut;

    let modelPos = inputData.position;
    let viewProj = systemUniforms.projection.noneJitterProjectionViewMatrix;
    let prevViewProj = systemUniforms.projection.prevNoneJitterProjectionViewMatrix;

    // 기본 ?�치 계산
    output.position = viewProj * modelPos;
    output.worldPos = modelPos.xyz;
    output.color = inputData.color;

    // 모션 벡터???�이???�??
    output.currentClipPos = output.position;
    output.prevClipPos = prevViewProj * modelPos;

    return output;
}

// --- ?�래그먼???�이??---
@fragment
fn fragmentMain(inputData: VertexOut) -> OutputFragment {
    var output: OutputFragment;

    // 1. 거리 기반 ?�명??Fade) 계산
    let distanceToCamera = length(inputData.worldPos - systemUniforms.camera.cameraPosition);
    let distanceFade = clamp(1.0 - saturate((distanceToCamera - FADE_START) / (FADE_END - FADE_START)),0.5,1.0);

    // 2. ?�상 �?기본 ?�파 결정 (X/Z�?강조 로직)
    var finalColor: vec3<f32>;
    var baseAlpha: f32;

    let isXAxis = inputData.color.r > AXIS_THRESHOLD;
    let isZAxis = inputData.color.b > AXIS_THRESHOLD;

    if (isXAxis) {
        finalColor = vec3<f32>(1.0, 0.0, 0.0); // X�? 빨강
        baseAlpha = AXIS_ALPHA;
    } else if (isZAxis) {
        finalColor = vec3<f32>(0.0, 0.0, 1.0); // Z�? ?�랑
        baseAlpha = AXIS_ALPHA;
    } else {
        finalColor = gridArgs.lineColor.rgb;   // ?�반 그리??
        baseAlpha = gridArgs.lineColor.a;
    }

    // 3. 최종 출력�??�정
    output.color = vec4<f32>(finalColor, baseAlpha * distanceFade);
//    output.color = vec4<f32>(finalColor, baseAlpha);

    // 4. 모션 벡터 계산 �??�??
    let motion = getMotionVector(inputData.currentClipPos, inputData.prevClipPos);
    output.gBufferMotionVector = vec4<f32>(motion, 0.0, 1.0);

    return output;
}

