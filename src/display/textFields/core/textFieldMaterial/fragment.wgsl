#redgpu_include SYSTEM_UNIFORM;
#redgpu_include color.getTintBlendMode;
#redgpu_include entryPoint.mesh.entryPointPickingFragment;
#redgpu_include systemStruct.OutputFragment;

@group(2) @binding(1) var diffuseTextureSampler: sampler;
@group(2) @binding(2) var diffuseTexture: texture_2d<f32>;

/**
 * [KO] 텍스트 필드 프래그먼트 입력 데이터 구조체입니다.
 * [EN] Input data structure for text field fragment shader.
 */
struct InputData {
  @builtin(position) position: vec4<f32>,
  @location(0) vertexPosition: vec3<f32>,
  @location(1) vertexNormal: vec3<f32>,
  @location(2) uv: vec2<f32>,
  @location(9) @interpolate(flat) globalFragmentSlotIndex: u32,
  @location(11) combinedOpacity: f32,
  @location(13) shadowCoord: vec3<f32>,
  @location(15) @interpolate(flat) pickingId: vec4<f32>,
};

/**
 * [KO] 텍스트 필드 메인 프래그먼트 셰이더 엔트리 포인트입니다.
 * [EN] Main fragment shader entry point for text field.
 */
@fragment
fn main(inputData: InputData) -> OutputFragment {
    var output: OutputFragment;
    let globalFragmentData = globalFragmentSSBO_BuiltIn[inputData.globalFragmentSlotIndex];
    // [KO] 텍스트 및 글리프 텍스처 샘플링 [EN] Sample text and glyph texture
    var finalColor: vec4<f32> = textureSample(diffuseTexture, diffuseTextureSampler, inputData.uv);

    // [KO] 투명도 보정 및 컴바인드 오퍼시티 적용 [EN] Correct alpha and apply combined opacity
    finalColor = vec4<f32>(finalColor.rgb / finalColor.a, finalColor.a * globalFragmentData.opacity * inputData.combinedOpacity);

    // [KO] 틴트 색상 및 블렌딩 모드 적용 [EN] Apply tint color and blend mode
    #redgpu_if useTint
        finalColor = getTintBlendMode(finalColor, globalFragmentData.tintBlendMode, globalFragmentData.tint);
    #redgpu_endIf

    // [KO] 알파 값이 0인 픽셀은 렌더링에서 제외 [EN] Discard pixels with zero alpha
    if (finalColor.a == 0.0) {
      discard;
    }

    output.color = vec4<f32>(finalColor.rgb , finalColor.a);
    output.gBufferMotionVector = vec4<f32>( 0.0, 0.0, 1.0, 1.0 );
    return output;
};
