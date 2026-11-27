[**RedGPU API v4.6.0**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [ShaderLibrary](../../../README.md) / [color](../README.md) / getLuminance

# Variable: getLuminance

> `const` **getLuminance**: `string` = `getLuminance_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:1779](https://github.com/redcamel/RedGPU/blob/a7aa3608e4bb06382354064aa5b75e4f3525d77e/src/systemCodeManager/ShaderLibrary.ts#L1779)

RGB 색상의 휘도(Luminance)를 계산합니다. (Rec. 709 표준 가중치 적용)

//

## Param

**rgb**

입력 RGB 색상
//

## Returns

계산된 휘도 값

```wgsl
fn getLuminance(rgb: vec3<f32>) -> f32 {
    return dot(rgb, vec3<f32>(0.2126, 0.7152, 0.0722));
}
```
