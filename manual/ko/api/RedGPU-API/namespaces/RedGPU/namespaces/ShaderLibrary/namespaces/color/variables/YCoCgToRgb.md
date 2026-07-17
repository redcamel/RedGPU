[**RedGPU API v4.1.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [ShaderLibrary](../../../README.md) / [color](../README.md) / YCoCgToRgb

# Variable: YCoCgToRgb

> `const` **YCoCgToRgb**: `string` = `YCoCgToRgb_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:1064](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/systemCodeManager/ShaderLibrary.ts#L1064)

YCoCg 색상을 RGB 색 공간으로 복원합니다.

//

## Param

입력 YCoCg 색상
//

## Returns

복원된 RGB 색상

```wgsl
fn YCoCgToRgb(ycocg: vec3<f32>) -> vec3<f32> {
    let y = ycocg.x;
    let co = ycocg.y;
    let cg = ycocg.z;
    return vec3<f32>(y + co - cg, y + cg, y - co - cg);
}
```
