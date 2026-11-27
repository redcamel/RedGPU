[**RedGPU API v4.6.0**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [ShaderLibrary](../../../../../README.md) / [math](../../../README.md) / [hash](../README.md) / getHash1D\_vec3

# Variable: getHash1D\_vec3

> `const` **getHash1D\_vec3**: `string` = `getHash1D_vec3_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:142](https://github.com/redcamel/RedGPU/blob/a7aa3608e4bb06382354064aa5b75e4f3525d77e/src/systemCodeManager/ShaderLibrary.ts#L142)

Generates a 1D random number (0.0 ~ 1.0) by converting a 3D vector to integers. (Stable Grid-based)

//

## Param

**v**

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
