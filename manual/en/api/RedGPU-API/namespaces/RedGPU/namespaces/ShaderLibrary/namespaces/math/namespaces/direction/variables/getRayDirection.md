[**RedGPU API v4.6.0**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [ShaderLibrary](../../../../../README.md) / [math](../../../README.md) / [direction](../README.md) / getRayDirection

# Variable: getRayDirection

> `const` **getRayDirection**: `string` = `getRayDirection_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:659](https://github.com/redcamel/RedGPU/blob/a7aa3608e4bb06382354064aa5b75e4f3525d77e/src/systemCodeManager/ShaderLibrary.ts#L659)

Calculates the normalized ray direction vector (vector toward the pixel) using camera position and world position.

//

## Param

**worldPosition**

World space position
//

## Param

**cameraPosition**

Camera position in world space
//

## Returns

Normalized ray direction vector

```wgsl
fn getRayDirection(worldPosition: vec3<f32>, cameraPosition: vec3<f32>) -> vec3<f32> {
    return normalize(worldPosition - cameraPosition);
}
```
