[**RedGPU API v4.6.0**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [ShaderLibrary](../../../../../README.md) / [math](../../../README.md) / [direction](../README.md) / getReflectionVectorFromViewDirection

# Variable: getReflectionVectorFromViewDirection

> `const` **getReflectionVectorFromViewDirection**: `string` = `getReflectionVectorFromViewDirection_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:678](https://github.com/redcamel/RedGPU/blob/a7aa3608e4bb06382354064aa5b75e4f3525d77e/src/systemCodeManager/ShaderLibrary.ts#L678)

Calculates the normalized reflection direction vector using the view direction (vector from pixel to camera) and the normal vector.

This function internally negates the view direction to perform the reflect(-viewDir, normal) operation.

//

## Param

**viewDirection**

View direction (pixel -> camera)
//

## Param

**normal**

Surface normal vector
//

## Returns

Normalized reflection direction vector

```wgsl
fn getReflectionVectorFromViewDirection(viewDirection: vec3<f32>, normal: vec3<f32>) -> vec3<f32> {
    return reflect(-viewDirection, normal);
}
```
