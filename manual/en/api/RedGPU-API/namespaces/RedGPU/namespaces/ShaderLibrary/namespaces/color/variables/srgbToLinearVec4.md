[**RedGPU API v4.4.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [ShaderLibrary](../../../README.md) / [color](../README.md) / srgbToLinearVec4

# Variable: srgbToLinearVec4

> `const` **srgbToLinearVec4**: `string` = `srgbToLinearVec4_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:1765](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/systemCodeManager/ShaderLibrary.ts#L1765)

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
