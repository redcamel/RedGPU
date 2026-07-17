[**RedGPU API v4.3.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [ShaderLibrary](../../../../../README.md) / [math](../../../README.md) / [hash](../README.md) / getBitHash2D\_vec2

# Variable: getBitHash2D\_vec2

> `const` **getBitHash2D\_vec2**: `string` = `getBitHash2D_vec2_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:319](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/systemCodeManager/ShaderLibrary.ts#L319)

Generates a 2D random vector by preserving the bit structure of a 2D vector. (Ultra-precise)

//

## Param

Input 2D coordinates
//

## Returns

Generated 2D random vector

```wgsl
fn getBitHash2D_vec2(coord: vec2<f32>) -> vec2<f32> {
    var q = bitcast<vec2<u32>>(coord);
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
