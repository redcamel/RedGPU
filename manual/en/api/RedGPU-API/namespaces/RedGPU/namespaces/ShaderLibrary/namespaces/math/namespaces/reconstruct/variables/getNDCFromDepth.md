[**RedGPU API v4.3.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [ShaderLibrary](../../../../../README.md) / [math](../../../README.md) / [reconstruct](../README.md) / getNDCFromDepth

# Variable: getNDCFromDepth

> `const` **getNDCFromDepth**: `string` = `getNDCFromDepth_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:681](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/systemCodeManager/ShaderLibrary.ts#L681)

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
