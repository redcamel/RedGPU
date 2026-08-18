struct BakeUniforms {
    projectionViewMatrix: mat4x4<f32>,
    modelMatrix: mat4x4<f32>,
    lightDirection: vec3<f32>,
    pad0: f32,
};

@group(0) @binding(0) var<uniform> uniforms: BakeUniforms;
@group(1) @binding(0) var diffuseTextureSampler: sampler;
@group(1) @binding(1) var diffuseTexture: texture_2d<f32>;

struct VertexInput {
    @location(0) position: vec3<f32>,
    @location(1) normal: vec3<f32>,
    @location(2) uv: vec2<f32>,
};

struct VertexOutput {
    @builtin(position) clipPosition: vec4<f32>,
    @location(0) worldNormal: vec3<f32>,
    @location(1) uv: vec2<f32>,
};

@vertex
fn vs_main(input: VertexInput) -> VertexOutput {
    var output: VertexOutput;
    let worldPos = uniforms.modelMatrix * vec4<f32>(input.position, 1.0);
    output.clipPosition = uniforms.projectionViewMatrix * worldPos;
    
    // Normal transform
    let normMat = mat3x3<f32>(
        uniforms.modelMatrix[0].xyz,
        uniforms.modelMatrix[1].xyz,
        uniforms.modelMatrix[2].xyz
    );
    output.worldNormal = normalize(normMat * input.normal);
    output.uv = input.uv;
    return output;
}

@fragment
fn fs_main(input: VertexOutput) -> @location(0) vec4<f32> {
    let texColor = textureSample(diffuseTexture, diffuseTextureSampler, input.uv);
    
    // 🌟 MASK: 미세 잎사귀와 나뭇잎 전체를 풍성하고 빽빽하게 100% 보존
    if (texColor.a < 0.1) {
        discard;
    }
    
    // 🌟 베이킹 시 원본 알베도와 부드러운 알파 경계를 그대로 기록
    return vec4<f32>(texColor.rgb, texColor.a);
}
