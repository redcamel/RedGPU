[**RedGPU API v4.6.0**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [ShaderLibrary](../../../../../README.md) / [math](../../../README.md) / [hash](../README.md) / getHash2D\_vec2

# Variable: getHash2D\_vec2

> `const` **getHash2D\_vec2**: `string` = `getHash2D_vec2_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:189](https://github.com/redcamel/RedGPU/blob/a7aa3608e4bb06382354064aa5b75e4f3525d77e/src/systemCodeManager/ShaderLibrary.ts#L189)

Generates a 2D random vector by converting 2D coordinates to integers. (Stable Grid-based)

//

## Param

**coord**

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
