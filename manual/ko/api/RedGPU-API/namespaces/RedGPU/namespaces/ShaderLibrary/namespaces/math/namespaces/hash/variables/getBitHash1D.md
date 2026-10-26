[**RedGPU API v4.4.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [ShaderLibrary](../../../../../README.md) / [math](../../../README.md) / [hash](../README.md) / getBitHash1D

# Variable: getBitHash1D

> `const` **getBitHash1D**: `string` = `getBitHash1D_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:237](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/systemCodeManager/ShaderLibrary.ts#L237)

단일 시드값의 비트 구조를 보존하여 1D 난수(0.0 ~ 1.0)를 생성합니다. (초정밀)

//

## Param

**seed**

입력 시드값
//

## Returns

생성된 난수

```wgsl
fn getBitHash1D(seed: f32) -> f32 {
    var x = bitcast<u32>(seed);
    x = ((x >> 16u) ^ x) * 0x45d9f3bu;
    x = ((x >> 16u) ^ x) * 0x45d9f3bu;
    x = (x >> 16u) ^ x;
    return f32(x) / 4294967296.0;
}
```
