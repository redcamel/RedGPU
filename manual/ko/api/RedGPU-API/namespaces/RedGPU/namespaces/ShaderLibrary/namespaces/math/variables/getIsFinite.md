[**RedGPU API v4.2.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [ShaderLibrary](../../../README.md) / [math](../README.md) / getIsFinite

# Variable: getIsFinite

> `const` **getIsFinite**: `string` = `getIsFinite_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:474](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/systemCodeManager/ShaderLibrary.ts#L474)

단일 스칼라 값이 유한(Finite)한지 체크합니다. (NaN과 Inf 체크)

//

## Param

입력 스칼라 값
//

## Returns

유한 여부

```wgsl
fn getIsFiniteScalar(x: f32) -> bool {
    // NaN은 자기 자신과 같지 않고, Inf는 매우 큰 값
    return x == x && abs(x) < 1e30;
}

/**
 * vec3 벡터의 모든 채널이 유한(Finite)한지 체크합니다.
 * @param v 입력 vec3 벡터
 * @returns 채널별 유한 여부 (vec3<bool>)
 *
 */
fn getIsFiniteVec3(v: vec3<f32>) -> vec3<bool> {
    return vec3<bool>(
        v.x == v.x && abs(v.x) < 1e30,
        v.y == v.y && abs(v.y) < 1e30,
        v.z == v.z && abs(v.z) < 1e30
    );
}
```
