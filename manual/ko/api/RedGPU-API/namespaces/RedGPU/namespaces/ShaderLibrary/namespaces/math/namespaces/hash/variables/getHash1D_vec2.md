[**RedGPU API v4.1.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [ShaderLibrary](../../../../../README.md) / [math](../../../README.md) / [hash](../README.md) / getHash1D\_vec2

# Variable: getHash1D\_vec2

> `const` **getHash1D\_vec2**: `string` = `getHash1D_vec2_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:115](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/systemCodeManager/ShaderLibrary.ts#L115)

2D 좌표를 정수로 변환하여 1D 난수(0.0 ~ 1.0)를 생성합니다. (안정적 그리드 기반)

//

## Param

입력 2D 좌표
//

## Returns

생성된 난수

```wgsl
fn getHash1D_vec2(coord: vec2<f32>) -> f32 {
    let q = vec2<u32>(abs(coord));
    // 소수 곱셈을 이용한 정밀 비트 혼합
    var x = (q.x * 73856093u) ^ (q.y * 19349663u);
    x = ((x >> 16u) ^ x) * 0x45d9f3bu;
    x = ((x >> 16u) ^ x) * 0x45d9f3bu;
    x = (x >> 16u) ^ x;
    return f32(x) / 4294967296.0;
}
```
