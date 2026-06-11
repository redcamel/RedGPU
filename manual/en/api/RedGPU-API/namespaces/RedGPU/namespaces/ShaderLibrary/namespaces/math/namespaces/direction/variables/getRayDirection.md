[**RedGPU API v4.1.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [ShaderLibrary](../../../../../README.md) / [math](../../../README.md) / [direction](../README.md) / getRayDirection

# Variable: getRayDirection

> `const` **getRayDirection**: `string` = `getRayDirection_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:637](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/systemCodeManager/ShaderLibrary.ts#L637)

Calculates the normalized ray direction vector (vector toward the pixel) using camera position and world position.

//

## Param

World space position
//

## Param

Camera position in world space
//

## Returns

Normalized ray direction vector

```wgsl
fn getRayDirection(worldPosition: vec3<f32>, cameraPosition: vec3<f32>) -> vec3<f32> {
    return normalize(worldPosition - cameraPosition);
}
```
