[**RedGPU API v4.5.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [ShaderLibrary](../../../README.md) / [color](../README.md) / srgbToLinearVec4

# Variable: srgbToLinearVec4

> `const` **srgbToLinearVec4**: `string` = `srgbToLinearVec4_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:1764](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/systemCodeManager/ShaderLibrary.ts#L1764)

sRGB 색 공간의 vec4 색상을 Linear 색 공간으로 변환합니다. (Alpha 보존)

//

## Param

**srgbColor**

입력 sRGB 색상
//

## Returns

변환된 Linear 색상

```wgsl
#redgpu_include color.srgbToLinearVec3

fn srgbToLinearVec4(srgbColor: vec4<f32>) -> vec4<f32> {
    return vec4<f32>(srgbToLinearVec3(srgbColor.rgb), srgbColor.a);
}
```
