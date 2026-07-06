[**RedGPU API v4.1.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [ShaderLibrary](../../../../../README.md) / [math](../../../README.md) / [hash](../README.md) / getBitHash1D\_vec2

# Variable: getBitHash1D\_vec2

> `const` **getBitHash1D\_vec2**: `string` = `getBitHash1D_vec2_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:251](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/systemCodeManager/ShaderLibrary.ts#L251)

2D 벡터의 비트 구조를 보존하여 1D 난수(0.0 ~ 1.0)를 생성합니다. (초정밀)

//

## Param

입력 2D 좌표
//

## Returns

생성된 난수

```wgsl
fn getBitHash1D_vec2(coord: vec2<f32>) -> f32 {
    let q = bitcast<vec2<u32>>(coord);
    // 소수 곱셈을 이용한 정밀 비트 혼합
    var x = (q.x * 73856093u) ^ (q.y * 19349663u);
    x = ((x >> 16u) ^ x) * 0x45d9f3bu;
    x = ((x >> 16u) ^ x) * 0x45d9f3bu;
    x = (x >> 16u) ^ x;
    return f32(x) / 4294967296.0;
}
```
