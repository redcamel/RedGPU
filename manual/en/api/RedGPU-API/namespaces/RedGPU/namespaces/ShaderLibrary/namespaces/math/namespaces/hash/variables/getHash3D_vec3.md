[**RedGPU API v4.1.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [ShaderLibrary](../../../../../README.md) / [math](../../../README.md) / [hash](../README.md) / getHash3D\_vec3

# Variable: getHash3D\_vec3

> `const` **getHash3D\_vec3**: `string` = `getHash3D_vec3_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:211](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/systemCodeManager/ShaderLibrary.ts#L211)

Generates a 3D random vector by converting a 3D position to integers. (Stable Grid-based)

//

## Param

Input 3D position
//

## Returns

Generated 3D random vector

```wgsl
fn getHash3D_vec3(position: vec3<f32>) -> vec3<f32> {
    var q = vec3<u32>(abs(position));
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
