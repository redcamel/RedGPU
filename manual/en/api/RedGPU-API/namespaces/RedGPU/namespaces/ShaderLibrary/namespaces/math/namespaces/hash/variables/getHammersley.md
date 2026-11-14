[**RedGPU API v4.5.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [ShaderLibrary](../../../../../README.md) / [math](../../../README.md) / [hash](../README.md) / getHammersley

# Variable: getHammersley

> `const` **getHammersley**: `string` = `getHammersley_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:392](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/systemCodeManager/ShaderLibrary.ts#L392)

Generates a uniformly distributed 2D quasi-random number (Low-Discrepancy Sequence). (Essential for importance sampling like IBL.)

//

## Param

**i**

Index
//

## Param

**N**

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
