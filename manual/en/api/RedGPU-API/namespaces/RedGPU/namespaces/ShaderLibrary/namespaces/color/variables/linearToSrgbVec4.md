[**RedGPU API v4.5.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [ShaderLibrary](../../../README.md) / [color](../README.md) / linearToSrgbVec4

# Variable: linearToSrgbVec4

> `const` **linearToSrgbVec4**: `string` = `linearToSrgbVec4_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:1728](https://github.com/redcamel/RedGPU/blob/02c1984aa4d4459730423af2aefb6e6d17516878/src/systemCodeManager/ShaderLibrary.ts#L1728)

Converts vec4 color from Linear color space to sRGB color space. (Preserves Alpha)

//

## Param

**linearColor**

Input Linear color
//

## Returns

Converted sRGB color

```wgsl
#redgpu_include color.linearToSrgbVec3

fn linearToSrgbVec4(linearColor: vec4<f32>) -> vec4<f32> {
    return vec4<f32>(linearToSrgbVec3(linearColor.rgb), linearColor.a);
}
```
