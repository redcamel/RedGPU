[**RedGPU API v4.1.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [ShaderLibrary](../../../README.md) / [color](../README.md) / YCoCgToRgb

# Variable: YCoCgToRgb

> `const` **YCoCgToRgb**: `string` = `YCoCgToRgb_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:1034](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/systemCodeManager/ShaderLibrary.ts#L1034)

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
