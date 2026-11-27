[**RedGPU API v4.6.0**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [ShaderLibrary](../../../../../README.md) / [math](../../../README.md) / [hash](../README.md) / getHash1D

# Variable: getHash1D

> `const` **getHash1D**: `string` = `getHash1D_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:100](https://github.com/redcamel/RedGPU/blob/a7aa3608e4bb06382354064aa5b75e4f3525d77e/src/systemCodeManager/ShaderLibrary.ts#L100)

Generates a 1D random number (0.0 ~ 1.0) by converting a single seed value to an integer. (Stable Grid-based)

//

## Param

**seed**

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
