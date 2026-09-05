#redgpu_include systemStruct.Camera
#redgpu_include systemStruct.Projection
#redgpu_include systemStruct.Time
#redgpu_include systemStruct.SkyAtmosphere

/**
 * [KO] 포스트 이펙트 시스템 유니폼 구조체입니다. (MSAA)
 * [EN] Post effect system uniform structure. (MSAA)
 */
struct SystemUniform {
    projection: Projection,
    time: Time,
    camera: Camera,
    useSkyAtmosphere: u32,
    preExposure: f32,
    devicePixelRatio: f32,
    skyAtmosphere: SkyAtmosphere,
};

@group(2) @binding(0) var depthTexture : texture_depth_multisampled_2d;
@group(2) @binding(1) var gBufferNormalTexture : texture_2d<f32>;
@group(2) @binding(2) var gBufferMotionVector : texture_2d<f32>;
@group(2) @binding(3) var prevDepthTexture : texture_depth_multisampled_2d;
@group(2) @binding(4) var<uniform> systemUniforms: SystemUniform;
@group(2) @binding(5) var basicSampler : sampler;
