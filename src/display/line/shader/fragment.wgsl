#redgpu_include SYSTEM_UNIFORM;
#redgpu_include entryPoint.mesh.entryPointPickingFragment;
#redgpu_include systemStruct.OutputFragment;
#redgpu_include math.getMotionVector;
#redgpu_include skyAtmosphere.getAerialPerspective;

struct Uniforms {
  	opacity:f32
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

    // [KO] 공중 투시 효과 적용
    // [EN] Apply Aerial Perspective effect
    if (systemUniforms.skyAtmosphere.useSkyAtmosphere == 1u) {
        finalColor = getAerialPerspective(finalColor, inputData.vertexPosition);
    }

    output.color = finalColor;
    output.gBufferNormal = vec4<f32>(0.0, 0.0, 0.0, 0.0);
    output.gBufferMotionVector = vec4<f32>(getMotionVector(inputData.currentClipPos, inputData.prevClipPos),0.0, 1.0 );

    return output;
}


