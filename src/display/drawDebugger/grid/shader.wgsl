#redgpu_include SYSTEM_UNIFORM;
#redgpu_include FragmentOutput;

struct VertexIn {
  @location(0) pos: vec4<f32>,
  @location(1) uv: vec2<f32>,
}

struct VertexOut {
  @builtin(position) pos: vec4<f32>,
  @location(0) uv: vec2<f32>,
}

@vertex
fn vertexMain(in: VertexIn) -> VertexOut {
    var out: VertexOut;
    let u_noneJitterProjectionCameraMatrix = systemUniforms.noneJitterProjectionCameraMatrix;
    out.pos = u_noneJitterProjectionCameraMatrix * in.pos;
    out.uv = in.uv;
    return out;
}

struct GridArgs {
  lineColor: vec4<f32>,
  baseColor: vec4<f32>,
  lineWidth: vec2<f32>,
  size: f32,
  distance: f32,
}

@group(1) @binding(0) var<uniform> gridArgs: GridArgs;

fn PristineGrid(uv: vec2<f32>, lineWidth: vec2<f32>) -> f32 {
    let uvDDXY = vec4<f32>(dpdx(uv), dpdy(uv));
    let uvDeriv = vec2<f32>(length(uvDDXY.xz), length(uvDDXY.yw));
    let invertLine: vec2<bool> = lineWidth > vec2f(0.5);
    let targetWidth: vec2<f32> = select(lineWidth, 1.0 - lineWidth, invertLine);
    let drawWidth: vec2<f32> = clamp(targetWidth, uvDeriv, vec2f(0.5));
    let lineAA: vec2<f32> = uvDeriv * 1.5;
    var gridUV: vec2<f32> = abs(fract(uv) * 2.0 - 1.0);
    gridUV = select(1.0 - gridUV, gridUV, invertLine);
    var grid2: vec2<f32> = smoothstep(drawWidth + lineAA, drawWidth - lineAA, gridUV);
    grid2 *= saturate(targetWidth / drawWidth);
    grid2 = mix(grid2, targetWidth, saturate(uvDeriv * 2.0 - 1.0));
    grid2 = select(grid2, 1.0 - grid2, invertLine);
    return mix(grid2.x, 1.0, grid2.y);
}
@fragment
fn fragmentMain(in: VertexOut) -> FragmentOutput {
    var output: FragmentOutput;
    var lineWidthWeight: f32 = 1.0;
    var color: vec4<f32> = gridArgs.lineColor;

    let DIVISION_SIZE: f32 = gridArgs.size;
    let AXIS_SIZE: f32 = max(DIVISION_SIZE * gridArgs.lineWidth.x, DIVISION_SIZE / 20.0);

    let HALF_DIVISION_SIZE: f32 = DIVISION_SIZE * 0.5;
    let PER_SIZE: f32 = 1.0 / DIVISION_SIZE * AXIS_SIZE;
    let MIN_RANGE = HALF_DIVISION_SIZE - PER_SIZE;
    let MAX_RANGE = HALF_DIVISION_SIZE + PER_SIZE;

    var isAxisLine = false;

    // X축 (파란색) 체크
    if (MIN_RANGE <= in.uv.x && in.uv.x <= MAX_RANGE) {
        color = vec4<f32>(0.0, 0.0, 1.0, 1.0);
        lineWidthWeight = AXIS_SIZE;
        isAxisLine = true;
    }
    // Y축 (빨간색) 체크
    else if (MIN_RANGE <= in.uv.y && in.uv.y <= MAX_RANGE) {
        color = vec4<f32>(1.0, 0.0, 0.0, 1.0);
        lineWidthWeight = AXIS_SIZE;
        isAxisLine = true;
    }

    // 모든 픽셀에서 그리드를 계산 (uniform control flow)
    let grid = PristineGrid(in.uv, gridArgs.lineWidth * lineWidthWeight);

    // 축 라인이 아닌 경우에만 그리드 임계값 검사
//    if (!isAxisLine) {
//        let gridThreshold = 0.1;
//        if (grid < gridThreshold) {
//            discard;
//        }
//    }

    // 축 라인인 경우 grid 값을 1.0으로 오버라이드
    let finalGrid = select(grid, 1.0, isAxisLine);

    // 최종 색상 계산
    let alpha = finalGrid * gridArgs.lineColor.a;
    var finalColor = mix(gridArgs.baseColor, color, alpha);
    // 투명도가 너무 낮아도 폐기 (축 라인이 아닌 경우만)
    if (!isAxisLine && finalColor.a == 0.0) {
        // finalColor = vec4<f32>(1.0, 0.0, 0.0, 1.0);
        discard;
    }

    output.color = finalColor;
    output.gBufferMotionVector = vec4<f32>(0.0, 0.0, 1.0, 1.0);
    return output;
}
