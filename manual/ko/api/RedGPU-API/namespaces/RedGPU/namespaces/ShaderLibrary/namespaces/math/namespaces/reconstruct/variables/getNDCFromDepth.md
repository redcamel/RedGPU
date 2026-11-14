[**RedGPU API v4.5.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [ShaderLibrary](../../../../../README.md) / [math](../../../README.md) / [reconstruct](../README.md) / getNDCFromDepth

# Variable: getNDCFromDepth

> `const` **getNDCFromDepth**: `string` = `getNDCFromDepth_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:701](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/systemCodeManager/ShaderLibrary.ts#L701)

스크린 UV와 깊이 값을 WebGPU 표준 NDC(Normalized Device Coordinates) 좌표로 변환합니다.

//

## Param

**uv**

스크린 UV (0~1)
//

## Param

**depth**

깊이 값 (0~1)
//

## Returns

NDC 좌표 (-1~1 range for XY, 0~1 for Z)

```wgsl
fn getNDCFromDepth(uv: vec2<f32>, depth: f32) -> vec3<f32> {
    return vec3<f32>(
        uv.x * 2.0 - 1.0,
        (1.0 - uv.y) * 2.0 - 1.0, // WGSL 스크린 Y-Down을 NDC Y-Up으로 보정
        depth
    );
}
```
