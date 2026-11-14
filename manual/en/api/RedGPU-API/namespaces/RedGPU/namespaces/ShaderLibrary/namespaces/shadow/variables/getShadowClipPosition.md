[**RedGPU API v4.5.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [ShaderLibrary](../../../README.md) / [shadow](../README.md) / getShadowClipPosition

# Variable: getShadowClipPosition

> `const` **getShadowClipPosition**: `string` = `getShadowClipPosition_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:963](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/systemCodeManager/ShaderLibrary.ts#L963)

Converts world coordinates to clip space coordinates from the light's perspective. (For Shadow Pass)

//

## Param

**worldPosition**

Position in world space
//

## Param

**lightViewProjectionMatrix**

Light's View-Projection matrix
//

## Returns

Light's clip space coordinates (vec4)

```wgsl
fn getShadowClipPosition(worldPosition: vec3<f32>, lightViewProjectionMatrix: mat4x4<f32>) -> vec4<f32> {
    // Projects world coordinates into light space
    return lightViewProjectionMatrix * vec4<f32>(worldPosition, 1.0);
}
```
