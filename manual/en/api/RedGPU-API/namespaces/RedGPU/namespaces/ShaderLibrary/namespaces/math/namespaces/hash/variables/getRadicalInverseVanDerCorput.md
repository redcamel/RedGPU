[**RedGPU API v4.1.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [ShaderLibrary](../../../../../README.md) / [math](../../../README.md) / [hash](../README.md) / getRadicalInverseVanDerCorput

# Variable: getRadicalInverseVanDerCorput

> `const` **getRadicalInverseVanDerCorput**: `string` = `getRadicalInverseVanDerCorput_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:366](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/systemCodeManager/ShaderLibrary.ts#L366)

Reverses the bits of an integer to return a floating-point number between 0 and 1 (Van der Corput sequence).

//

## Param

Input integer
//

## Returns

Generated floating-point number

```wgsl
fn getRadicalInverseVanDerCorput(bits_in: u32) -> f32 {
    var bits = bits_in;
    bits = (bits << 16u) | (bits >> 16u);
    bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
    bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
    bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
    bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
    return f32(bits) * 2.3283064365386963e-10;
}
```
