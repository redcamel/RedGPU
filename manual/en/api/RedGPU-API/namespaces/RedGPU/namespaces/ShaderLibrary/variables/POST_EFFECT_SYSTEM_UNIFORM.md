[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [ShaderLibrary](../README.md) / POST\_EFFECT\_SYSTEM\_UNIFORM

# Variable: POST\_EFFECT\_SYSTEM\_UNIFORM

> `const` **POST\_EFFECT\_SYSTEM\_UNIFORM**: `string` = `POST_EFFECT_SYSTEM_UNIFORM_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:2988](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/systemCodeManager/ShaderLibrary.ts#L2988)

Post effect system uniform structure.

```wgsl
#redgpu_include systemStruct.Camera
#redgpu_include systemStruct.Projection
#redgpu_include systemStruct.Time
#redgpu_include systemStruct.SkyAtmosphere

struct SystemUniform {
    projection: Projection,
    time: Time,
    camera:Camera,
    useSkyAtmosphere: u32,
    preExposure: f32,
    devicePixelRatio: f32,
    skyAtmosphere:SkyAtmosphere,
};

@group(2) @binding(4) var<uniform> systemUniforms: SystemUniform;
```
