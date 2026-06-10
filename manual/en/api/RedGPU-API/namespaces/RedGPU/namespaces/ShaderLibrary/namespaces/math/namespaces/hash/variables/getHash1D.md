[**RedGPU API v4.1.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [ShaderLibrary](../../../../../README.md) / [math](../../../README.md) / [hash](../README.md) / getHash1D

# Variable: getHash1D

> `const` **getHash1D**: `string` = `getHash1D_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:92](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/systemCodeManager/ShaderLibrary.ts#L92)

Generates a 1D random number (0.0 ~ 1.0) by converting a single seed value to an integer. (Stable Grid-based)

//

## Param

Input seed value
//

## Returns

Generated random number

```wgsl
fn getHash1D(seed: f32) -> f32 {
    var x = u32(abs(seed));
    x = ((x >> 16u) ^ x) * 0x45d9f3bu;
    x = ((x >> 16u) ^ x) * 0x45d9f3bu;
    x = (x >> 16u) ^ x;
    return f32(x) / 4294967296.0;
}
```
