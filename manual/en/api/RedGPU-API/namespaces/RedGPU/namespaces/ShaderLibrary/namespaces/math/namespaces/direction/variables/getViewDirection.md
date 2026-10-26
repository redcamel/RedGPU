[**RedGPU API v4.4.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [ShaderLibrary](../../../../../README.md) / [math](../../../README.md) / [direction](../README.md) / getViewDirection

# Variable: getViewDirection

> `const` **getViewDirection**: `string` = `getViewDirection_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:644](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/systemCodeManager/ShaderLibrary.ts#L644)

Calculates the normalized view direction vector (vector toward the camera) using world position and camera position.

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

Normalized view direction vector

```wgsl
fn getViewDirection(worldPosition: vec3<f32>, cameraPosition: vec3<f32>) -> vec3<f32> {
    return normalize(cameraPosition - worldPosition);
}
```
