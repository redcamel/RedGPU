#redgpu_include SYSTEM_UNIFORM;
#redgpu_include entryPoint.mesh.entryPointPickingFragment;
#redgpu_include systemStruct.OutputFragment;
#redgpu_include math.getMotionVector;

struct Uniforms {
  	opacity:f32,
};
struct InputData {
    @builtin(position) position : vec4<f32>,
    @location(0) vertexPosition: vec3<f32>,
    @location(1) vertexColor: vec4<f32>,

    @location(7) currentClipPos: vec4<f32>,
    @location(8) prevClipPos: vec4<f32>,

    @location(15) @interpolate(flat) pickingId: vec4<f32>,
}

@group(2) @binding(0) var<uniform> uniforms: Uniforms;
@fragment
fn main(inputData:InputData) -> OutputFragment {
    var output:OutputFragment;
    
    var finalColor = inputData.vertexColor;
    finalColor.a = finalColor.a * uniforms.opacity;

    output.color = vec4<f32>(finalColor.rgb, finalColor.a);
    output.gBufferNormal = vec4<f32>(0.0, 0.0, 0.0, 0.0);
    output.gBufferMotionVector = vec4<f32>(getMotionVector(inputData.currentClipPos, inputData.prevClipPos),0.0, 1.0 );

    return output;
}


