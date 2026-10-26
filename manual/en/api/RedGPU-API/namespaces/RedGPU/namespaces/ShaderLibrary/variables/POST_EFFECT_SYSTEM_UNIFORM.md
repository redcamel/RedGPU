[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [ShaderLibrary](../README.md) / POST\_EFFECT\_SYSTEM\_UNIFORM

# Variable: POST\_EFFECT\_SYSTEM\_UNIFORM

> `const` **POST\_EFFECT\_SYSTEM\_UNIFORM**: `string` = `POST_EFFECT_SYSTEM_UNIFORM_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:3098](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/systemCodeManager/ShaderLibrary.ts#L3098)

Post effect system uniform structure. (Non-MSAA)

```wgsl
#redgpu_include systemStruct.Camera
#redgpu_include systemStruct.Projection
#redgpu_include systemStruct.Time
#redgpu_include systemStruct.SkyAtmosphere

struct SystemUniform {
    projection: Projection,
    time: Time,
    camera: Camera,
    useSkyAtmosphere: u32,
    preExposure: f32,
    devicePixelRatio: f32,
    skyAtmosphere: SkyAtmosphere,
};

@group(2) @binding(0) var depthTexture : texture_depth_2d;
@group(2) @binding(1) var gBufferNormalTexture : texture_2d<f32>;
@group(2) @binding(2) var gBufferMotionVector : texture_2d<f32>;
@group(2) @binding(3) var prevDepthTexture : texture_depth_2d;
@group(2) @binding(4) var<uniform> systemUniforms: SystemUniform;
@group(2) @binding(5) var basicSampler : sampler;
```
