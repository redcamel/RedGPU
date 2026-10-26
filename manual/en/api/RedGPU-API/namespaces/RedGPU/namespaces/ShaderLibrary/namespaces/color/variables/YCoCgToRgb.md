[**RedGPU API v4.4.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [ShaderLibrary](../../../README.md) / [color](../README.md) / YCoCgToRgb

# Variable: YCoCgToRgb

> `const` **YCoCgToRgb**: `string` = `YCoCgToRgb_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:1693](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/systemCodeManager/ShaderLibrary.ts#L1693)

Restores YCoCg color back to RGB color space.

//

## Param

**ycocg**

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
