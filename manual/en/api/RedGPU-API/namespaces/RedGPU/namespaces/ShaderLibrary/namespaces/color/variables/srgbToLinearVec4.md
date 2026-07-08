[**RedGPU API v4.1.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [ShaderLibrary](../../../README.md) / [color](../README.md) / srgbToLinearVec4

# Variable: srgbToLinearVec4

> `const` **srgbToLinearVec4**: `string` = `srgbToLinearVec4_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:1136](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/systemCodeManager/ShaderLibrary.ts#L1136)

Converts vec4 color from sRGB color space to Linear color space. (Preserves Alpha)

//

## Param

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
