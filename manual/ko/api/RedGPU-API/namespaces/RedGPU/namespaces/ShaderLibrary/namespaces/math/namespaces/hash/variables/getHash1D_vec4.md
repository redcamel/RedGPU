[**RedGPU API v4.1.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [ShaderLibrary](../../../../../README.md) / [math](../../../README.md) / [hash](../README.md) / getHash1D\_vec4

# Variable: getHash1D\_vec4

> `const` **getHash1D\_vec4**: `string` = `getHash1D_vec4_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:155](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/systemCodeManager/ShaderLibrary.ts#L155)

4D 벡터를 정수로 변환하여 1D 난수(0.0 ~ 1.0)를 생성합니다. (안정적 그리드 기반)

//

## Param

입력 4D 벡터
//

## Returns

생성된 난수

```wgsl
fn getHash1D_vec4(v: vec4<f32>) -> f32 {
    let q = vec4<u32>(abs(v));
    // 소수 곱셈을 이용한 정밀 비트 혼합
    var x = (q.x * 73856093u) ^ (q.y * 19349663u) ^ (q.z * 83492791u) ^ (q.w * 4000000007u);
    x = ((x >> 16u) ^ x) * 0x45d9f3bu;
    x = ((x >> 16u) ^ x) * 0x45d9f3bu;
    x = (x >> 16u) ^ x;
    return f32(x) / 4294967296.0;
}
```
