#redgpu_include SYSTEM_UNIFORM;
#redgpu_include displacement.getDisplacementPosition;
#redgpu_include displacement.getDisplacementNormal;

struct InstanceUniforms {
    instanceGroupModelMatrix: mat4x4<f32>,
    instanceGroupNormalModelMatrix: mat4x4<f32>,
    useDisplacementTexture: u32,
    displacementScale: f32,
    padding: vec2<f32>,
    instanceModelMatrixs: array<mat4x4<f32>, __INSTANCE_COUNT__>,
    instanceNormalModelMatrix: array<mat4x4<f32>, __INSTANCE_COUNT__>,
    instanceOpacity: array<f32, __INSTANCE_COUNT__>,
};

@group(1) @binding(0) var<storage, read> instanceUniforms: InstanceUniforms;
@group(1) @binding(1) var displacementTextureSampler: sampler;
@group(1) @binding(2) var displacementTexture: texture_2d<f32>;
@group(1) @binding(3) var<storage, read> visibilityBuffer: array<u32>;


const maxDistance: f32 = 1000.0;
const maxMipLevel: f32 = 10.0;