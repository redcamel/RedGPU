[**RedGPU API v4.6.0**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [ShaderLibrary](../../../README.md) / [color](../README.md) / linearToSrgbVec3

# Variable: linearToSrgbVec3

> `const` **linearToSrgbVec3**: `string` = `linearToSrgbVec3_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:1711](https://github.com/redcamel/RedGPU/blob/a7aa3608e4bb06382354064aa5b75e4f3525d77e/src/systemCodeManager/ShaderLibrary.ts#L1711)

Converts vec3 color from Linear color space to sRGB color space.

//

## Param

**linearColor**

Input Linear color
//

## Returns

Converted sRGB color

```wgsl
fn linearToSrgbVec3(linearColor: vec3<f32>) -> vec3<f32> {
    return select(
        12.92 * linearColor,
        1.055 * pow(max(linearColor, vec3<f32>(0.0031308)), vec3<f32>(1.0 / 2.4)) - 0.055,
        linearColor > vec3<f32>(0.0031308)
    );
}
```
