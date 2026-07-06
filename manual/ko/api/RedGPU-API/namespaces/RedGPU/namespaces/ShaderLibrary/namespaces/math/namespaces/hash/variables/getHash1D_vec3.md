[**RedGPU API v4.1.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [ShaderLibrary](../../../../../README.md) / [math](../../../README.md) / [hash](../README.md) / getHash1D\_vec3

# Variable: getHash1D\_vec3

> `const` **getHash1D\_vec3**: `string` = `getHash1D_vec3_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:136](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/systemCodeManager/ShaderLibrary.ts#L136)

3D 벡터를 정수로 변환하여 1D 난수(0.0 ~ 1.0)를 생성합니다. (안정적 그리드 기반)

//

## Param

입력 3D 벡터
//

## Returns

생성된 난수

```wgsl
fn getHash1D_vec3(v: vec3<f32>) -> f32 {
    let q = vec3<u32>(abs(v));
    // 소수 곱셈을 이용한 정밀 비트 혼합
    var x = (q.x * 73856093u) ^ (q.y * 19349663u) ^ (q.z * 83492791u);
    x = ((x >> 16u) ^ x) * 0x45d9f3bu;
    x = ((x >> 16u) ^ x) * 0x45d9f3bu;
    x = (x >> 16u) ^ x;
    return f32(x) / 4294967296.0;
}
```
