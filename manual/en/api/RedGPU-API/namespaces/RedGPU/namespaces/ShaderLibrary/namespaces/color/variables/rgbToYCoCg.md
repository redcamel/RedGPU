[**RedGPU API v4.1.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [ShaderLibrary](../../../README.md) / [color](../README.md) / rgbToYCoCg

# Variable: rgbToYCoCg

> `const` **rgbToYCoCg**: `string` = `rgbToYCoCg_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:1046](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/systemCodeManager/ShaderLibrary.ts#L1046)

Converts RGB color to YCoCg color space. (Optimized for TAA and compression efficiency)

//

## Param

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
