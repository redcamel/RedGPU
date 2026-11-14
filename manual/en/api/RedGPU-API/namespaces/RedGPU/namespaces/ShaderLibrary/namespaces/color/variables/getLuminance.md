[**RedGPU API v4.5.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [ShaderLibrary](../../../README.md) / [color](../README.md) / getLuminance

# Variable: getLuminance

> `const` **getLuminance**: `string` = `getLuminance_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:1779](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/systemCodeManager/ShaderLibrary.ts#L1779)

Calculates the luminance of an RGB color. (Applying Rec. 709 standard weights)

//

## Param

**rgb**

Input RGB color
//

## Returns

Calculated luminance value

```wgsl
fn getLuminance(rgb: vec3<f32>) -> f32 {
    return dot(rgb, vec3<f32>(0.2126, 0.7152, 0.0722));
}
```
