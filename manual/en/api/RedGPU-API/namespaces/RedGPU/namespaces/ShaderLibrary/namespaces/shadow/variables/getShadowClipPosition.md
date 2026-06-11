[**RedGPU API v4.1.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [ShaderLibrary](../../../README.md) / [shadow](../README.md) / getShadowClipPosition

# Variable: getShadowClipPosition

> `const` **getShadowClipPosition**: `string` = `getShadowClipPosition_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:941](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/systemCodeManager/ShaderLibrary.ts#L941)

Converts world coordinates to clip space coordinates from the light's perspective. (For Shadow Pass)

//

## Param

Position in world space
//

## Param

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
