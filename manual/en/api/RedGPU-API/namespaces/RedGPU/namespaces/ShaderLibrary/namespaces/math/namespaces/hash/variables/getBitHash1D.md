[**RedGPU API v4.1.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [ShaderLibrary](../../../../../README.md) / [math](../../../README.md) / [hash](../README.md) / getBitHash1D

# Variable: getBitHash1D

> `const` **getBitHash1D**: `string` = `getBitHash1D_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:228](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/systemCodeManager/ShaderLibrary.ts#L228)

Generates a 1D random number (0.0 ~ 1.0) by preserving the bit structure of a single seed value. (Ultra-precise)

//

## Param

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
