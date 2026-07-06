[**RedGPU API v4.1.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [ShaderLibrary](../../../../../README.md) / [math](../../../README.md) / [hash](../README.md) / getBitHash1D\_vec3

# Variable: getBitHash1D\_vec3

> `const` **getBitHash1D\_vec3**: `string` = `getBitHash1D_vec3_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:272](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/systemCodeManager/ShaderLibrary.ts#L272)

3D 벡터의 비트 구조를 보존하여 1D 난수(0.0 ~ 1.0)를 생성합니다. (초정밀)

//

## Param

입력 3D 벡터
//

## Returns

생성된 난수

```wgsl
fn getBitHash1D_vec3(v: vec3<f32>) -> f32 {
    var q = bitcast<vec3<u32>>(v);
    // 소수 곱셈을 이용한 정밀 비트 혼합
    var x = (q.x * 73856093u) ^ (q.y * 19349663u) ^ (q.z * 83492791u);
    x = ((x >> 16u) ^ x) * 0x45d9f3bu;
    x = ((x >> 16u) ^ x) * 0x45d9f3bu;
    x = (x >> 16u) ^ x;
    return f32(x) / 4294967296.0;
}
```
