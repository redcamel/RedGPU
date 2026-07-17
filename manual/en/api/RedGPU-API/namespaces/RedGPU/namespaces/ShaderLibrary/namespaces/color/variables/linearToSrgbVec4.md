[**RedGPU API v4.3.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [ShaderLibrary](../../../README.md) / [color](../README.md) / linearToSrgbVec4

# Variable: linearToSrgbVec4

> `const` **linearToSrgbVec4**: `string` = `linearToSrgbVec4_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:1100](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/systemCodeManager/ShaderLibrary.ts#L1100)

Converts vec4 color from Linear color space to sRGB color space. (Preserves Alpha)

//

## Param

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
