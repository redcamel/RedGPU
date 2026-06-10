[**RedGPU API v4.1.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [ShaderLibrary](../../../../../README.md) / [math](../../../README.md) / [direction](../README.md) / getReflectionVectorFromViewDirection

# Variable: getReflectionVectorFromViewDirection

> `const` **getReflectionVectorFromViewDirection**: `string` = `getReflectionVectorFromViewDirection_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:656](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/systemCodeManager/ShaderLibrary.ts#L656)

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
