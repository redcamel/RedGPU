[**RedGPU API v4.5.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [ShaderLibrary](../../../README.md) / [color](../README.md) / rgbToYCoCg

# Variable: rgbToYCoCg

> `const` **rgbToYCoCg**: `string` = `rgbToYCoCg_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:1674](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/systemCodeManager/ShaderLibrary.ts#L1674)

Converts RGB color to YCoCg color space. (Optimized for TAA and compression efficiency)

//

## Param

**rgb**

Input RGB color
//

## Returns

Converted YCoCg color

```wgsl
fn rgbToYCoCg(rgb: vec3<f32>) -> vec3<f32> {
    let y = dot(rgb, vec3<f32>(0.25, 0.5, 0.25));
    let co = dot(rgb, vec3<f32>(0.5, 0.0, -0.5));
    let cg = dot(rgb, vec3<f32>(-0.25, 0.5, -0.25));
    return vec3<f32>(y, co, cg);
}
```
