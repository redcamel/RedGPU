[**RedGPU API v4.5.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [ShaderLibrary](../../../README.md) / [color](../README.md) / srgbToLinearVec3

# Variable: srgbToLinearVec3

> `const` **srgbToLinearVec3**: `string` = `srgbToLinearVec3_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:1747](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/systemCodeManager/ShaderLibrary.ts#L1747)

Converts vec3 color from sRGB color space to Linear color space.

//

## Param

**srgbColor**

Input sRGB color
//

## Returns

Converted Linear color

```wgsl
fn srgbToLinearVec3(srgbColor: vec3<f32>) -> vec3<f32> {
    return select(
        srgbColor / 12.92,
        pow((srgbColor + 0.055) / 1.055, vec3<f32>(2.4)),
        srgbColor > vec3<f32>(0.04045)
    );
}
```
