[**RedGPU API v4.1.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [ShaderLibrary](../../../../../README.md) / [math](../../../README.md) / [hash](../README.md) / getHash1D

# Variable: getHash1D

> `const` **getHash1D**: `string` = `getHash1D_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:92](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/systemCodeManager/ShaderLibrary.ts#L92)

단일 시드값을 정수로 변환하여 1D 난수(0.0 ~ 1.0)를 생성합니다. (안정적 그리드 기반)

//

## Param

입력 시드값
//

## Returns

생성된 난수

```wgsl
fn getHash1D(seed: f32) -> f32 {
    var x = u32(abs(seed));
    x = ((x >> 16u) ^ x) * 0x45d9f3bu;
    x = ((x >> 16u) ^ x) * 0x45d9f3bu;
    x = (x >> 16u) ^ x;
    return f32(x) / 4294967296.0;
}
```
