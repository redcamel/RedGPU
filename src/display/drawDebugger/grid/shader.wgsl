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
    //
    let u_projectionMatrix = systemUniforms.projectionMatrix;
    let u_camera = systemUniforms.camera;
    let u_cameraMatrix = u_camera.cameraMatrix;
    //
    out.pos = u_projectionMatrix * u_cameraMatrix * in.pos;
    out.uv = in.uv;
    return out;
}

fn PristineGrid(uv: vec2<f32>, lineWidth: vec2<f32>) -> f32 {
    let uvDDXY = vec4<f32>(dpdx(uv), dpdy(uv));
    let uvDeriv = vec2<f32>(length(uvDDXY.xz), length(uvDDXY.yw));
    let invertLine: vec2<bool> = lineWidth > vec2f(0.5);
    let targetWidth: vec2<f32> = select(lineWidth, 1 - lineWidth, invertLine) ;
    let drawWidth: vec2<f32> = clamp(targetWidth, uvDeriv, vec2f(0.5));
    let lineAA: vec2<f32> = uvDeriv * 1.5 ;
    var gridUV: vec2<f32> = abs(fract(uv) * 2.0 - 1.0);
    gridUV = select(1 - gridUV, gridUV, invertLine);
    var grid2: vec2<f32> = smoothstep(drawWidth + lineAA, drawWidth - lineAA, gridUV);
    grid2 *= saturate(targetWidth / drawWidth);
    grid2 = mix(grid2, targetWidth, saturate(uvDeriv * 2.0 - 1.0));
    grid2 = select(grid2, 1.0 - grid2, invertLine);
    return mix(grid2.x, 1.0, grid2.y);
}


struct GridArgs {
  lineColor: vec4<f32>,
  baseColor: vec4<f32>,
  lineWidth: vec2<f32>,
  size: f32,
  distance: f32,
}
@group(1) @binding(0) var<uniform> gridArgs: GridArgs;

@fragment
fn fragmentMain(in: VertexOut) -> FragmentOutput {
  var output:FragmentOutput;
  var lineWidthWeight:f32 = 1;
  var color:vec4<f32> = gridArgs.lineColor;
  let DIVISION_SIZE:f32= gridArgs.size ;
  let ASIX_SIZE:f32 = max(DIVISION_SIZE * gridArgs.lineWidth.x , DIVISION_SIZE / 20);

  let HALF_DIVISION_SIZE:f32 = DIVISION_SIZE * 0.5;
  let PER_SIZE:f32 = 1 / DIVISION_SIZE * ASIX_SIZE ;
  let MIN_RANGE = HALF_DIVISION_SIZE - PER_SIZE ;
  let MAX_RANGE = HALF_DIVISION_SIZE + PER_SIZE ;
  if( MIN_RANGE  <= in.uv.x  && in.uv.x <= MAX_RANGE) {
    color = vec4<f32>(0,0,1,1);
    lineWidthWeight = ASIX_SIZE;
  }else if( MIN_RANGE <= in.uv.y  && in.uv.y <= MAX_RANGE) {
    color = vec4<f32>(1,0,0,1);
    lineWidthWeight = ASIX_SIZE;
  }
  var grid = PristineGrid(in.uv, gridArgs.lineWidth * lineWidthWeight) ;


  output.color = mix(gridArgs.baseColor, color, grid * gridArgs.lineColor.a);
  return output;
;
}
