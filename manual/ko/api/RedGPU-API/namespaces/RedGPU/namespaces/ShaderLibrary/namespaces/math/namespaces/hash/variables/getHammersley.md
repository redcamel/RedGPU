[**RedGPU API v4.3.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [ShaderLibrary](../../../../../README.md) / [math](../../../README.md) / [hash](../README.md) / getHammersley

# Variable: getHammersley

> `const` **getHammersley**: `string` = `getHammersley_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:386](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/systemCodeManager/ShaderLibrary.ts#L386)

균일한 분포를 가지는 2D 준난수(Low-Discrepancy Sequence)를 생성합니다. (IBL 등 중요도 샘플링에 필수적입니다.)

//

## Param

인덱스
//

## Param

전체 샘플 수
//

## Returns

생성된 2D 준난수

```wgsl
#redgpu_include math.hash.getRadicalInverseVanDerCorput

fn getHammersley(i: u32, N: u32) -> vec2<f32> {
    return vec2<f32>(f32(i) / f32(N), getRadicalInverseVanDerCorput(i));
}
```
