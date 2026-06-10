[**RedGPU API v4.1.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [ShaderLibrary](../../../README.md) / [color](../README.md) / rgbToYCoCg

# Variable: rgbToYCoCg

> `const` **rgbToYCoCg**: `string` = `rgbToYCoCg_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:1016](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/systemCodeManager/ShaderLibrary.ts#L1016)

RGB 색상을 YCoCg 색 공간으로 변환합니다. (TAA 및 압축 효율 최적화)

//

## Param

입력 RGB 색상
//

## Returns

변환된 YCoCg 색상

```wgsl
fn rgbToYCoCg(rgb: vec3<f32>) -> vec3<f32> {
    let y = dot(rgb, vec3<f32>(0.25, 0.5, 0.25));
    let co = dot(rgb, vec3<f32>(0.5, 0.0, -0.5));
    let cg = dot(rgb, vec3<f32>(-0.25, 0.5, -0.25));
    return vec3<f32>(y, co, cg);
}
```
