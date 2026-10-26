[**RedGPU API v4.4.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [ShaderLibrary](../../../../../README.md) / [math](../../../README.md) / [hash](../README.md) / getBitHash1D

# Variable: getBitHash1D

> `const` **getBitHash1D**: `string` = `getBitHash1D_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:237](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/systemCodeManager/ShaderLibrary.ts#L237)

Generates a 1D random number (0.0 ~ 1.0) by preserving the bit structure of a single seed value. (Ultra-precise)

//

## Param

**seed**

Input seed value
//

## Returns

Generated random number

```wgsl
fn getBitHash1D(seed: f32) -> f32 {
    var x = bitcast<u32>(seed);
    x = ((x >> 16u) ^ x) * 0x45d9f3bu;
    x = ((x >> 16u) ^ x) * 0x45d9f3bu;
    x = (x >> 16u) ^ x;
    return f32(x) / 4294967296.0;
}
```
