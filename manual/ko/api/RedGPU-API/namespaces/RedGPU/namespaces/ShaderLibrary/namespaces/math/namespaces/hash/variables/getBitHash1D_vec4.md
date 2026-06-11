[**RedGPU API v4.1.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [ShaderLibrary](../../../../../README.md) / [math](../../../README.md) / [hash](../README.md) / getBitHash1D\_vec4

# Variable: getBitHash1D\_vec4

> `const` **getBitHash1D\_vec4**: `string` = `getBitHash1D_vec4_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:291](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/systemCodeManager/ShaderLibrary.ts#L291)

4D 벡터의 비트 구조를 보존하여 1D 난수(0.0 ~ 1.0)를 생성합니다. (초정밀)

//

## Param

입력 4D 벡터
//

## Returns

생성된 난수

```wgsl
fn getBitHash1D_vec4(v: vec4<f32>) -> f32 {
    var q = bitcast<vec4<u32>>(v);
    // 소수 곱셈을 이용한 정밀 비트 혼합
    var x = (q.x * 73856093u) ^ (q.y * 19349663u) ^ (q.z * 83492791u) ^ (q.w * 4000000007u);
    x = ((x >> 16u) ^ x) * 0x45d9f3bu;
    x = ((x >> 16u) ^ x) * 0x45d9f3bu;
    x = (x >> 16u) ^ x;
    return f32(x) / 4294967296.0;
}
```
