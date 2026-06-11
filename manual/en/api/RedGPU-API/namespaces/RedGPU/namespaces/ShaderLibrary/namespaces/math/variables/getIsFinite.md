[**RedGPU API v4.1.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [ShaderLibrary](../../../README.md) / [math](../README.md) / getIsFinite

# Variable: getIsFinite

> `const` **getIsFinite**: `string` = `getIsFinite_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:472](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/systemCodeManager/ShaderLibrary.ts#L472)

Checks if a single scalar value is finite. (Checks for NaN and Inf)

//

## Param

Input scalar value
//

## Returns

Whether it is finite

```wgsl
fn getIsFiniteScalar(x: f32) -> bool {
    // NaN은 자기 자신과 같지 않고, Inf는 매우 큰 값
    return x == x && abs(x) < 1e30;
}

/**
 * Checks if all channels of a vec3 vector are finite.
 *
 * @param v Input vec3 vector
 * @returns Whether each channel is finite (vec3<bool>)
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
