[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [ShaderLibrary](../README.md) / POST\_EFFECT\_SYSTEM\_UNIFORM\_MSAA

# Variable: POST\_EFFECT\_SYSTEM\_UNIFORM\_MSAA

> `const` **POST\_EFFECT\_SYSTEM\_UNIFORM\_MSAA**: `string` = `POST_EFFECT_SYSTEM_UNIFORM_MSAA_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:3128](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/systemCodeManager/ShaderLibrary.ts#L3128)

Post effect system uniform structure. (MSAA)

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

@group(2) @binding(0) var depthTexture : texture_depth_multisampled_2d;
@group(2) @binding(1) var gBufferNormalTexture : texture_2d<f32>;
@group(2) @binding(2) var gBufferMotionVector : texture_2d<f32>;
@group(2) @binding(3) var prevDepthTexture : texture_depth_multisampled_2d;
@group(2) @binding(4) var<uniform> systemUniforms: SystemUniform;
@group(2) @binding(5) var basicSampler : sampler;
```
