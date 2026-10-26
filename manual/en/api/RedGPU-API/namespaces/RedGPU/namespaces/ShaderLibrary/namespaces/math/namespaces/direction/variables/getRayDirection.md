[**RedGPU API v4.4.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [ShaderLibrary](../../../../../README.md) / [math](../../../README.md) / [direction](../README.md) / getRayDirection

# Variable: getRayDirection

> `const` **getRayDirection**: `string` = `getRayDirection_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:660](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/systemCodeManager/ShaderLibrary.ts#L660)

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
