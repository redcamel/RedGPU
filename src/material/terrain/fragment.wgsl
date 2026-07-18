#redgpu_include SYSTEM_UNIFORM
#redgpu_include color.getTintBlendMode
#redgpu_include entryPoint.mesh.entryPointPickingFragment
#redgpu_include systemStruct.OutputFragment
#redgpu_include math.getMotionVector

@group(2) @binding(1) var heightTextureSampler: sampler;
@group(2) @binding(2) var heightTexture: texture_2d<f32>;

struct InputData {
    @builtin(position) position: vec4<f32>,
    @location(0) vertexPosition: vec3<f32>,
    @location(1) vertexNormal: vec3<f32>,
    @location(2) uv: vec2<f32>,

    @location(7) currentClipPos: vec4<f32>,
    @location(8) prevClipPos: vec4<f32>,
    @location(9) @interpolate(flat) globalFragmentSlotIndex: u32,

    @location(11) combinedOpacity: f32,
    @location(12) motionVector: vec3<f32>,
    @location(13) shadowCoord: vec3<f32>,
    @location(15) @interpolate(flat) pickingId: vec4<f32>,
};

@fragment
fn main(inputData: InputData) -> OutputFragment {
  var output: OutputFragment;
  let globalFragmentData = globalFragmentSSBO_BuiltIn[inputData.globalFragmentSlotIndex];
  
  var finalColor: vec4<f32> = vec4<f32>(0.5, 0.5, 0.5, 1.0); // 기본 회색

  #redgpu_if heightTexture
  // 높이맵 리소스가 주입된 경우, fragment 단계에서 R채널 값을 회색조로 시각화 테스트합니다.
  let h = textureSample(heightTexture, heightTextureSampler, inputData.uv).r;
  finalColor = vec4<f32>(h, h, h, 1.0);
  #redgpu_endIf

  let alpha2D = select(finalColor.a, 1.0, systemUniforms.isView3D == 1u);
  finalColor = vec4<f32>(finalColor.rgb * alpha2D, finalColor.a * globalFragmentData.opacity * inputData.combinedOpacity);

  #redgpu_if useTint
    finalColor = getTintBlendMode(finalColor, globalFragmentData.tintBlendMode, globalFragmentData.tint);
  #redgpu_endIf

  if (systemUniforms.isView3D == 1 && finalColor.a == 0.0) {
      discard;
  }

  output.color = vec4<f32>(finalColor.rgb, finalColor.a);
  output.gBufferMotionVector = vec4<f32>(getMotionVector(inputData.currentClipPos, inputData.prevClipPos), 0.0, 1.0);
  return output;
}
