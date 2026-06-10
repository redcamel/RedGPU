[**RedGPU API v4.1.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [ShaderLibrary](../../../../../README.md) / [math](../../../README.md) / [hash](../README.md) / getBitHash3D\_vec3

# Variable: getBitHash3D\_vec3

> `const` **getBitHash3D\_vec3**: `string` = `getBitHash3D_vec3_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:345](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/systemCodeManager/ShaderLibrary.ts#L345)

Generates a 3D random vector by preserving the bit structure of a 3D vector. (Ultra-precise)

//

## Param

Input 3D position
//

## Returns

Generated 3D random vector

```wgsl
fn getBitHash3D_vec3(position: vec3<f32>) -> vec3<f32> {
    var q = bitcast<vec3<u32>>(position);
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
