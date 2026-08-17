struct SubMeshUniforms {
    relativeModelMatrix: mat4x4<f32>,
    relativeNormalMatrix: mat4x4<f32>,
    globalFragmentSlotIndex: u32,
    pad0: u32,
    pad1: u32,
    pad2: u32,
};

struct SystemUniforms {
    resolution: vec2<f32>,
    pixelRatio: f32,
    time: f32,
};

struct SystemUniformsRoot {
    systemUniforms: SystemUniforms,
};

struct SystemUniforms_fragment {
    systemUniforms: SystemUniforms,
};

struct MaterialUniforms {
    baseColorFactor: vec4<f32>,
    roughnessFactor: f32,
    metallicFactor: f32,
    normalScale: f32,
    occlusionStrength: f32,
    emissiveFactor: vec3<f32>,
    alphaCutoff: f32,
    useCutOff: u32,
};

struct OutputData {
    @builtin(position) position: vec4<f32>,
    @location(0) vertexPosition: vec3<f32>,
    @location(1) vertexNormal: vec3<f32>,
    @location(2) uv: vec2<f32>,
    @location(3) uv1: vec2<f32>,
    @location(4) vertexColor_0: vec4<f32>,
    @location(5) vertexTangent: vec4<f32>,

    @location(7) currentClipPos: vec4<f32>,
    @location(8) prevClipPos: vec4<f32>,

    @location(9) @interpolate(flat) globalFragmentSlotIndex: u32,
    @location(10) localNodeScale_volumeScale: vec2<f32>,
    @location(11) combinedOpacity: f32,

    @location(12) motionVector: vec3<f32>,
    @location(13) shadowCoord: vec3<f32>,
    @location(14) @interpolate(flat) receiveShadow: f32,
    @location(15) @interpolate(flat) pickingId: vec4<f32>,
};

@group(2) @binding(0) var<storage, read> materials: array<MaterialUniforms>;
@group(2) @binding(1) var diffuseTexture: texture_2d<f32>;
@group(2) @binding(2) var diffuseSampler: sampler;

struct FragmentOutput {
    @location(0) gBuffer0: vec4<f32>,
    @location(1) gBuffer1: vec4<f32>,
    @location(2) gBuffer2: vec4<f32>,
};

@fragment
fn mainDepthOnly(input: OutputData) -> FragmentOutput {
    let slot = input.globalFragmentSlotIndex;
    let mat = materials[slot];
    
    let baseColor = textureSample(diffuseTexture, diffuseSampler, input.uv);
    let alpha = baseColor.a * mat.baseColorFactor.a * input.combinedOpacity;
    
    // Masked 머티리얼 알파 컷오프 판정 (0.5 미만이면 깊이 버퍼 쓰기 스킵)
    if (mat.useCutOff != 0u && alpha < mat.alphaCutoff) {
        discard;
    }
    
    var output: FragmentOutput;
    output.gBuffer0 = vec4<f32>(0.0);
    output.gBuffer1 = vec4<f32>(0.0);
    output.gBuffer2 = vec4<f32>(0.0);
    return output;
}
