[**RedGPU API v4.6.0**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [ShaderLibrary](../../../../../README.md) / [math](../../../README.md) / [direction](../README.md) / getViewDirection

# Variable: getViewDirection

> `const` **getViewDirection**: `string` = `getViewDirection_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:643](https://github.com/redcamel/RedGPU/blob/a7aa3608e4bb06382354064aa5b75e4f3525d77e/src/systemCodeManager/ShaderLibrary.ts#L643)

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
