[**RedGPU API v4.1.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [ShaderLibrary](../../../../../README.md) / [math](../../../README.md) / [hash](../README.md) / getHash2D\_vec2

# Variable: getHash2D\_vec2

> `const` **getHash2D\_vec2**: `string` = `getHash2D_vec2_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:181](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/systemCodeManager/ShaderLibrary.ts#L181)

Generates a 2D random vector by converting 2D coordinates to integers. (Stable Grid-based)

//

## Param

Input 2D coordinates
//

## Returns

Generated 2D random vector

```wgsl
fn getHash2D_vec2(coord: vec2<f32>) -> vec2<f32> {
    var q = vec2<u32>(abs(coord));
    var x = (q.x * 1597334677u) ^ (q.y * 3812015801u);
    x = ((x >> 16u) ^ x) * 0x45d9f3bu;
    x = ((x >> 16u) ^ x) * 0x45d9f3bu;
    x = (x >> 16u) ^ x;

    let r = f32(x) / 4294967296.0;
    x = (x * 1103515245u + 12345u);
    let g = f32(x) / 4294967296.0;

    return vec2<f32>(r, g);
}
```
