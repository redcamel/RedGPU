[**RedGPU API v4.1.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [ShaderLibrary](../../../../../README.md) / [math](../../../README.md) / [hash](../README.md) / getHammersley

# Variable: getHammersley

> `const` **getHammersley**: `string` = `getHammersley_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:386](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/systemCodeManager/ShaderLibrary.ts#L386)

Generates a uniformly distributed 2D quasi-random number (Low-Discrepancy Sequence). (Essential for importance sampling like IBL.)

//

## Param

Index
//

## Param

Total number of samples
//

## Returns

Generated 2D quasi-random number

```wgsl
#redgpu_include math.hash.getRadicalInverseVanDerCorput

fn getHammersley(i: u32, N: u32) -> vec2<f32> {
    return vec2<f32>(f32(i) / f32(N), getRadicalInverseVanDerCorput(i));
}
```
