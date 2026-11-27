[**RedGPU API v4.6.0**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [ShaderLibrary](../../../README.md) / [color](../README.md) / srgbToLinearVec4

# Variable: srgbToLinearVec4

> `const` **srgbToLinearVec4**: `string` = `srgbToLinearVec4_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:1764](https://github.com/redcamel/RedGPU/blob/a7aa3608e4bb06382354064aa5b75e4f3525d77e/src/systemCodeManager/ShaderLibrary.ts#L1764)

Converts vec4 color from sRGB color space to Linear color space. (Preserves Alpha)

//

## Param

**srgbColor**

Input sRGB color
//

## Returns

Converted Linear color

```wgsl
#redgpu_include color.srgbToLinearVec3

fn srgbToLinearVec4(srgbColor: vec4<f32>) -> vec4<f32> {
    return vec4<f32>(srgbToLinearVec3(srgbColor.rgb), srgbColor.a);
}
```
