[**RedGPU API v4.1.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [ShaderLibrary](../../../../../README.md) / [math](../../../README.md) / [hash](../README.md) / getHash2D\_vec2

# Variable: getHash2D\_vec2

> `const` **getHash2D\_vec2**: `string` = `getHash2D_vec2_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:181](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/systemCodeManager/ShaderLibrary.ts#L181)

2D 좌표를 정수로 변환하여 2D 난수 벡터를 생성합니다. (안정적 그리드 기반)

//

## Param

입력 2D 좌표
//

## Returns

생성된 2D 난수 벡터

```wgsl
fn getHash2D_vec2(coord: vec2<f32>) -> vec2<f32> {
    var q = vec2<u32>(abs(coord));
    // 소수 곱셈을 이용한 정밀 비트 혼합
    var x = (q.x * 1597334677u) ^ (q.y * 3812015801u);
    x = ((x >> 16u) ^ x) * 0x45d9f3bu;
    x = ((x >> 16u) ^ x) * 0x45d9f3bu;
    x = (x >> 16u) ^ x;

    let r = f32(x) / 4294967296.0;
    x = (x * 1103515245u + 12345u);
    let g = f32(x) / 4294967296.0;

    return vec2<f32>(r, g);
}
```
