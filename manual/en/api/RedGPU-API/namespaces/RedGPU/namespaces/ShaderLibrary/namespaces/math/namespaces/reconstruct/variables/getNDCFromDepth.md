[**RedGPU API v4.1.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [ShaderLibrary](../../../../../README.md) / [math](../../../README.md) / [reconstruct](../README.md) / getNDCFromDepth

# Variable: getNDCFromDepth

> `const` **getNDCFromDepth**: `string` = `getNDCFromDepth_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:681](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/systemCodeManager/ShaderLibrary.ts#L681)

Converts screen UV and depth values to standard WebGPU NDC (Normalized Device Coordinates).

//

## Param

Screen UV (0~1)
//

## Param

Depth value (0~1)
//

## Returns

NDC coordinates

```wgsl
fn getNDCFromDepth(uv: vec2<f32>, depth: f32) -> vec3<f32> {
    return vec3<f32>(
        uv.x * 2.0 - 1.0,
        (1.0 - uv.y) * 2.0 - 1.0, // WGSL 스크린 Y-Down을 NDC Y-Up으로 보정
        depth
    );
}
```
