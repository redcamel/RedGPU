#redgpu_include SYSTEM_UNIFORM;
#redgpu_include calcTintBlendMode;
#redgpu_include entryPointPickingFragment;
#redgpu_include systemStruct.FragmentOutput;

struct Uniforms {
  useDiffuseTexture: u32,
  //
  opacity: f32,
  useTint:u32,
  tint:vec4<f32>,
  tintBlendMode:u32,
};

@group(2) @binding(0) var<uniform> uniforms: Uniforms;
@group(2) @binding(1) var diffuseTextureSampler: sampler;
@group(2) @binding(2) var diffuseTexture: texture_2d<f32>;

struct InputData {
  @builtin(position) position: vec4<f32>,
  @location(0) vertexPosition: vec3<f32>,
  @location(1) vertexNormal: vec3<f32>,
  @location(2) uv: vec2<f32>,
  @location(11) combinedOpacity: f32,
  //
  @location(13) shadowCoord: vec3<f32>,
  @location(15) @interpolate(flat) pickingId: vec4<f32>,
};

@fragment
fn main(inputData: InputData) -> FragmentOutput {
    var output:FragmentOutput;
    // 텍스처 색상 샘플링
    var finalColor: vec4<f32> = textureSample(diffuseTexture, diffuseTextureSampler, inputData.uv);

    finalColor = vec4<f32>(finalColor.rgb / finalColor.a, finalColor.a * uniforms.opacity * inputData.combinedOpacity);

    #redgpu_if useTint
        finalColor = calcTintBlendMode(finalColor, uniforms.tintBlendMode, uniforms.tint);
    #redgpu_endIf

    // alpha 값이 0일 경우 discard
    if (finalColor.a == 0.0) {
      discard;
    }

    output.color = finalColor;
    output.gBufferMotionVector = vec4<f32>( 0.0, 0.0, 1.0, 1.0 );
    return output;
};
