#redgpu_include SYSTEM_UNIFORM
#redgpu_include entryPoint.mesh.entryPointPickingFragment
#redgpu_include color.getTintBlendMode
#redgpu_include systemStruct.OutputFragment
#redgpu_include math.getMotionVector

// Input structure for model data
struct InputData {
  // Built-in attributes
  @builtin(position) position : vec4<f32>,
  @location(0) vertexPosition: vec3<f32>,

  @location(7) currentClipPos: vec4<f32>,
  @location(8) prevClipPos: vec4<f32>,
  @location(9) @interpolate(flat) globalFragmentBufferSlotIndex: u32,
  @location(11) combinedOpacity: f32,
  //
  @location(12) motionVector: vec3<f32>,
  @location(15) @interpolate(flat) pickingId: vec4<f32>,
}

@fragment
fn main(inputData: InputData) -> OutputFragment {
    var output: OutputFragment;
    let uniforms = globalFragmentBuiltInUniformBuffer[inputData.globalFragmentBufferSlotIndex];

    var finalColor = vec4<f32>( uniforms.color.r , uniforms.color.g , uniforms.color.b , uniforms.opacity * inputData.combinedOpacity);
    #redgpu_if useTint
        finalColor = getTintBlendMode(finalColor, uniforms.tintBlendMode, uniforms.tint);
    #redgpu_endIf

    if (finalColor.a == 0.0) {
        discard;
    }
    output.color = vec4<f32>(finalColor.rgb , finalColor.a);
    output.gBufferMotionVector = vec4<f32>(getMotionVector(inputData.currentClipPos, inputData.prevClipPos),0.0, 1.0 );
    return output;
}


