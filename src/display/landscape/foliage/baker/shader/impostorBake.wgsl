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
    
    // 🌟 MASK: Alpha Cutoff (알파 0.5 미만 폐기)
    if (texColor.a < 0.5) {
        discard;
    }
    
    // 🌟 베이킹 시에는 순수 알베도(BaseColor)만 기록 (라이팅은 렌더링 시 실시간 적용)
    return vec4<f32>(texColor.rgb, 1.0);
}


