[**RedGPU API v4.1.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [ShaderLibrary](../../../../../README.md) / [math](../../../README.md) / [hash](../README.md) / getHammersley

# Variable: getHammersley

> `const` **getHammersley**: `string` = `getHammersley_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:384](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/systemCodeManager/ShaderLibrary.ts#L384)

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
