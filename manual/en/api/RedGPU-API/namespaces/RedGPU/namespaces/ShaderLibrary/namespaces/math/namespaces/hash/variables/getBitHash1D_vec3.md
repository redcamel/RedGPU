[**RedGPU API v4.1.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [ShaderLibrary](../../../../../README.md) / [math](../../../README.md) / [hash](../README.md) / getBitHash1D\_vec3

# Variable: getBitHash1D\_vec3

> `const` **getBitHash1D\_vec3**: `string` = `getBitHash1D_vec3_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:272](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/systemCodeManager/ShaderLibrary.ts#L272)

Generates a 1D random number (0.0 ~ 1.0) by preserving the bit structure of a 3D vector. (Ultra-precise)

//

## Param

Input 3D vector
//

## Returns

Generated random number

```wgsl
fn getBitHash1D_vec3(v: vec3<f32>) -> f32 {
    var q = bitcast<vec3<u32>>(v);
    var x = (q.x * 73856093u) ^ (q.y * 19349663u) ^ (q.z * 83492791u);
    x = ((x >> 16u) ^ x) * 0x45d9f3bu;
    x = ((x >> 16u) ^ x) * 0x45d9f3bu;
    x = (x >> 16u) ^ x;
    return f32(x) / 4294967296.0;
}
```
