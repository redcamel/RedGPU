#redgpu_include SYSTEM_UNIFORM;
#redgpu_include shadow.getDirectionalShadowVisibility;
#redgpu_include systemStruct.OutputFragment;
#redgpu_include math.getMotionVector;

struct InputData {
    @builtin(position) position: vec4<f32>,
    @location(0) vertexPosition: vec3<f32>,
    @location(1) vertexNormal: vec3<f32>,
    @location(2) uv: vec2<f32>,
    @location(3) uv1: vec2<f32>,
    @location(4) vertexColor_0: vec4<f32>,
    @location(5) vertexTangent: vec4<f32>,
    @location(6) vertexHeight: f32,
    @location(7) currentClipPos: vec4<f32>,
    @location(8) prevClipPos: vec4<f32>,
    @location(9) instanceColor: vec4<f32>,
};

struct MaterialUniforms {
    color: vec4<f32>,
    textureOffset: vec2<f32>,
    textureScale: vec2<f32>,
};

@group(2) @binding(0) var<uniform> uniforms: MaterialUniforms;
@group(2) @binding(1) var baseColorTextureSampler: sampler;

#redgpu_if baseColorTexture
@group(2) @binding(2) var baseColorTexture: texture_2d<f32>;
#redgpu_endIf

@fragment
fn main(inputData: InputData) -> OutputFragment {
    var output: OutputFragment;
    
    var finalColor: vec4<f32> = uniforms.color;

    #redgpu_if baseColorTexture
    let transformedUV = inputData.uv * uniforms.textureScale + uniforms.textureOffset;
    let texColor = textureSample(baseColorTexture, baseColorTextureSampler, transformedUV);
    finalColor = texColor * uniforms.color;
    #redgpu_endIf

    if (inputData.instanceColor.a > 0.0) {
        finalColor = mix(finalColor, inputData.instanceColor, 0.5);
    }

    output.color = finalColor;
    output.gBufferMotionVector = vec4<f32>(getMotionVector(inputData.currentClipPos, inputData.prevClipPos), 0.0, 1.0);
    return output;
}
