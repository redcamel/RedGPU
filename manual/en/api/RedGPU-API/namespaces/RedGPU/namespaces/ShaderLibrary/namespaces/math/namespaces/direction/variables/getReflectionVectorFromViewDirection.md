[**RedGPU API v4.1.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [ShaderLibrary](../../../../../README.md) / [math](../../../README.md) / [direction](../README.md) / getReflectionVectorFromViewDirection

# Variable: getReflectionVectorFromViewDirection

> `const` **getReflectionVectorFromViewDirection**: `string` = `getReflectionVectorFromViewDirection_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:658](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/systemCodeManager/ShaderLibrary.ts#L658)

Calculates the normalized reflection direction vector using the view direction (vector from pixel to camera) and the normal vector.

This function internally negates the view direction to perform the reflect(-viewDir, normal) operation.

//

## Param

View direction (pixel -> camera)
//

## Param

Surface normal vector
//

## Returns

Normalized reflection direction vector

```wgsl
fn getReflectionVectorFromViewDirection(viewDirection: vec3<f32>, normal: vec3<f32>) -> vec3<f32> {
    return reflect(-viewDirection, normal);
}
```
