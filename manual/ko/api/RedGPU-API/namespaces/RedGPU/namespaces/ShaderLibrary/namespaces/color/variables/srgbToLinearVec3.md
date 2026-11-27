[**RedGPU API v4.6.0**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [ShaderLibrary](../../../README.md) / [color](../README.md) / srgbToLinearVec3

# Variable: srgbToLinearVec3

> `const` **srgbToLinearVec3**: `string` = `srgbToLinearVec3_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:1747](https://github.com/redcamel/RedGPU/blob/a7aa3608e4bb06382354064aa5b75e4f3525d77e/src/systemCodeManager/ShaderLibrary.ts#L1747)

sRGB 색 공간의 vec3 색상을 Linear 색 공간으로 변환합니다.

//

## Param

**srgbColor**

입력 sRGB 색상
//

## Returns

변환된 Linear 색상

```wgsl
fn srgbToLinearVec3(srgbColor: vec3<f32>) -> vec3<f32> {
    return select(
        srgbColor / 12.92,
        pow((srgbColor + 0.055) / 1.055, vec3<f32>(2.4)),
        srgbColor > vec3<f32>(0.04045)
    );
}
```
