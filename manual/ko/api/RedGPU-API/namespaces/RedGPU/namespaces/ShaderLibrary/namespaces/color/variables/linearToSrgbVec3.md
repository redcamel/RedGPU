[**RedGPU API v4.1.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [ShaderLibrary](../../../README.md) / [color](../README.md) / linearToSrgbVec3

# Variable: linearToSrgbVec3

> `const` **linearToSrgbVec3**: `string` = `linearToSrgbVec3_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:1053](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/systemCodeManager/ShaderLibrary.ts#L1053)

Linear 색 공간의 vec3 색상을 sRGB 색 공간으로 변환합니다.

//

## Param

입력 Linear 색상
//

## Returns

변환된 sRGB 색상

```wgsl
fn linearToSrgbVec3(linearColor: vec3<f32>) -> vec3<f32> {
    return select(
        12.92 * linearColor,
        1.055 * pow(linearColor, vec3<f32>(1.0 / 2.4)) - 0.055,
        linearColor > vec3<f32>(0.0031308)
    );
}
```
