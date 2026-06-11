[**RedGPU API v4.1.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [ShaderLibrary](../../../README.md) / [color](../README.md) / getLuminance

# Variable: getLuminance

> `const` **getLuminance**: `string` = `getLuminance_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:1121](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/systemCodeManager/ShaderLibrary.ts#L1121)

Calculates the luminance of an RGB color. (Applying Rec. 709 standard weights)

//

## Param

Input RGB color
//

## Returns

Calculated luminance value

```wgsl
fn getLuminance(rgb: vec3<f32>) -> f32 {
    return dot(rgb, vec3<f32>(0.2126, 0.7152, 0.0722));
}
```
