[**RedGPU API v4.1.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [ShaderLibrary](../../../../../README.md) / [math](../../../README.md) / [hash](../README.md) / getHash1D\_vec3

# Variable: getHash1D\_vec3

> `const` **getHash1D\_vec3**: `string` = `getHash1D_vec3_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:136](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/systemCodeManager/ShaderLibrary.ts#L136)

Generates a 1D random number (0.0 ~ 1.0) by converting a 3D vector to integers. (Stable Grid-based)

//

## Param

Input 3D vector
//

## Returns

Generated random number

```wgsl
fn getHash1D_vec3(v: vec3<f32>) -> f32 {
    let q = vec3<u32>(abs(v));
    var x = (q.x * 73856093u) ^ (q.y * 19349663u) ^ (q.z * 83492791u);
    x = ((x >> 16u) ^ x) * 0x45d9f3bu;
    x = ((x >> 16u) ^ x) * 0x45d9f3bu;
    x = (x >> 16u) ^ x;
    return f32(x) / 4294967296.0;
}
```
