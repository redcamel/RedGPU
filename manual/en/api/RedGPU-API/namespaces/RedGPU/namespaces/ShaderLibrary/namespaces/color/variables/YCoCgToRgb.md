[**RedGPU API v4.3.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [ShaderLibrary](../../../README.md) / [color](../README.md) / YCoCgToRgb

# Variable: YCoCgToRgb

> `const` **YCoCgToRgb**: `string` = `YCoCgToRgb_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:1064](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/systemCodeManager/ShaderLibrary.ts#L1064)

Restores YCoCg color back to RGB color space.

//

## Param

Input YCoCg color
//

## Returns

Restored RGB color

```wgsl
fn YCoCgToRgb(ycocg: vec3<f32>) -> vec3<f32> {
    let y = ycocg.x;
    let co = ycocg.y;
    let cg = ycocg.z;
    return vec3<f32>(y + co - cg, y + cg, y - co - cg);
}
```
