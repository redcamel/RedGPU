[**RedGPU API v4.1.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [ShaderLibrary](../../../../../README.md) / [math](../../../README.md) / [hash](../README.md) / getBitHash1D\_vec2

# Variable: getBitHash1D\_vec2

> `const` **getBitHash1D\_vec2**: `string` = `getBitHash1D_vec2_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:249](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/systemCodeManager/ShaderLibrary.ts#L249)

Generates a 1D random number (0.0 ~ 1.0) by preserving the bit structure of a 2D vector. (Ultra-precise)

//

## Param

Input 2D coordinates
//

## Returns

Generated random number

```wgsl
fn getBitHash1D_vec2(coord: vec2<f32>) -> f32 {
    let q = bitcast<vec2<u32>>(coord);
    var x = (q.x * 73856093u) ^ (q.y * 19349663u);
    x = ((x >> 16u) ^ x) * 0x45d9f3bu;
    x = ((x >> 16u) ^ x) * 0x45d9f3bu;
    x = (x >> 16u) ^ x;
    return f32(x) / 4294967296.0;
}
```
