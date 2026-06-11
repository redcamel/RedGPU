[**RedGPU API v4.1.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [ShaderLibrary](../../../README.md) / [color](../README.md) / linearToSrgbVec3

# Variable: linearToSrgbVec3

> `const` **linearToSrgbVec3**: `string` = `linearToSrgbVec3_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:1053](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/systemCodeManager/ShaderLibrary.ts#L1053)

Converts vec3 color from Linear color space to sRGB color space.

//

## Param

Input Linear color
//

## Returns

Converted sRGB color

```wgsl
fn linearToSrgbVec3(linearColor: vec3<f32>) -> vec3<f32> {
    return select(
        12.92 * linearColor,
        1.055 * pow(linearColor, vec3<f32>(1.0 / 2.4)) - 0.055,
        linearColor > vec3<f32>(0.0031308)
    );
}
```
