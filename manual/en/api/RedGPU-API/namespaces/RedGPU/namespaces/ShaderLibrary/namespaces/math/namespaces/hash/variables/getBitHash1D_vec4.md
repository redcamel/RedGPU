[**RedGPU API v4.1.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [ShaderLibrary](../../../../../README.md) / [math](../../../README.md) / [hash](../README.md) / getBitHash1D\_vec4

# Variable: getBitHash1D\_vec4

> `const` **getBitHash1D\_vec4**: `string` = `getBitHash1D_vec4_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:291](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/systemCodeManager/ShaderLibrary.ts#L291)

Generates a 1D random number (0.0 ~ 1.0) by preserving the bit structure of a 4D vector. (Ultra-precise)

//

## Param

Input 4D vector
//

## Returns

Generated random number

```wgsl
fn getBitHash1D_vec4(v: vec4<f32>) -> f32 {
    var q = bitcast<vec4<u32>>(v);
    var x = (q.x * 73856093u) ^ (q.y * 19349663u) ^ (q.z * 83492791u) ^ (q.w * 4000000007u);
    x = ((x >> 16u) ^ x) * 0x45d9f3bu;
    x = ((x >> 16u) ^ x) * 0x45d9f3bu;
    x = (x >> 16u) ^ x;
    return f32(x) / 4294967296.0;
}
```
