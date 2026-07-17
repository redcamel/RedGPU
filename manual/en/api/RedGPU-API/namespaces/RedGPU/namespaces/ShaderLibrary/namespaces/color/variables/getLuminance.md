[**RedGPU API v4.3.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [ShaderLibrary](../../../README.md) / [color](../README.md) / getLuminance

# Variable: getLuminance

> `const` **getLuminance**: `string` = `getLuminance_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:1151](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/systemCodeManager/ShaderLibrary.ts#L1151)

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
