[**RedGPU API v4.4.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [ShaderLibrary](../../../README.md) / [color](../README.md) / srgbToLinearVec3

# Variable: srgbToLinearVec3

> `const` **srgbToLinearVec3**: `string` = `srgbToLinearVec3_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:1748](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/systemCodeManager/ShaderLibrary.ts#L1748)

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
