#redgpu_include SYSTEM_UNIFORM;
#redgpu_include FragmentOutput;

struct VertexIn {
  @location(0) pos: vec4<f32>,
  @location(1) color: vec4<f32>,
}

struct VertexOut {
  @builtin(position) pos: vec4<f32>,
  @location(0) color: vec4<f32>,
  @location(1) worldPos: vec3<f32>,
}

@vertex
fn vertexMain(in: VertexIn) -> VertexOut {
    var out: VertexOut;
    let u_noneJitterProjectionCameraMatrix = systemUniforms.noneJitterProjectionCameraMatrix;
    out.pos = u_noneJitterProjectionCameraMatrix * in.pos;
    out.color = in.color;
    out.worldPos = in.pos.xyz;
    return out;
}

struct GridArgs {
  lineColor: vec4<f32>,
}

@group(1) @binding(0) var<uniform> gridArgs: GridArgs;

@fragment
fn fragmentMain(in: VertexOut) -> FragmentOutput {
    var output: FragmentOutput;

    // 카메라 위치 (시스템 유니폼에서 가져오기)
    let cameraPos = systemUniforms.camera.cameraPosition;

    // 현재 픽셀까지의 거리 계산
    let distance = length(in.worldPos - cameraPos);

    // 거리 기반 알파 계산 (20 단위에서 시작하여 100 단위에서 완전히 투명)
    let fadeStart = 20.0;
    let fadeEnd = 80.0;
    let distanceFade = 1.0 - saturate((distance - fadeStart) / (fadeEnd - fadeStart));

    var finalColor: vec4<f32>;
    var baseAlpha: f32;

    // 축 라인인지 확인 (빨강 또는 파랑)
    if (in.color.r > 0.8 && in.color.g < 0.2 && in.color.b < 0.2) {
        // X축 (빨강) - 축은 좀 더 진하게
        finalColor = vec4<f32>(1.0, 0.0, 0.0, 1.0);
        baseAlpha = 0.8;
    } else if (in.color.b > 0.8 && in.color.r < 0.2 && in.color.g < 0.2) {
        // Z축 (파랑) - 축은 좀 더 진하게
        finalColor = vec4<f32>(0.0, 0.0, 1.0, 1.0);
        baseAlpha = 0.8;
    } else {
        // 일반 그리드 라인
        finalColor = vec4<f32>(gridArgs.lineColor.rgb, 1.0);
        baseAlpha = gridArgs.lineColor.a;
    }

    // 최종 알파 = 기본 알파 * 거리 페이드
    finalColor.a = baseAlpha * distanceFade;


    output.color = finalColor;
    output.gBufferMotionVector = vec4<f32>(0.0, 0.0, 1.0, 1.0);
    return output;
}
