[**RedGPU API v4.2.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [ShaderLibrary](../../../../../README.md) / [math](../../../README.md) / [hash](../README.md) / getBitHash3D\_vec3

# Variable: getBitHash3D\_vec3

> `const` **getBitHash3D\_vec3**: `string` = `getBitHash3D_vec3_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:347](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/systemCodeManager/ShaderLibrary.ts#L347)

3D 벡터의 비트 구조를 보존하여 3D 난수 벡터를 생성합니다. (초정밀)

//

## Param

입력 3D 위치
//

## Returns

생성된 3D 난수 벡터

```wgsl
fn getBitHash3D_vec3(position: vec3<f32>) -> vec3<f32> {
    var q = bitcast<vec3<u32>>(position);
    // 소수 곱셈을 이용한 정밀 비트 혼합 (일직선 패턴 방지)
    var x = (q.x * 73856093u) ^ (q.y * 19349663u) ^ (q.z * 83492791u);
    x = ((x >> 16u) ^ x) * 0x45d9f3bu;
    x = ((x >> 16u) ^ x) * 0x45d9f3bu;
    x = (x >> 16u) ^ x;

    let r = f32(x) / 4294967296.0;
    x = (x * 1103515245u + 12345u);
    let g = f32(x) / 4294967296.0;
    x = (x * 1103515245u + 12345u);
    let b = f32(x) / 4294967296.0;

    return vec3<f32>(r, g, b);
}
```
