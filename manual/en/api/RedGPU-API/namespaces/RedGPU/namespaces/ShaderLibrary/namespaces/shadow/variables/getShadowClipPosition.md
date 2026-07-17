[**RedGPU API v4.3.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [ShaderLibrary](../../../README.md) / [shadow](../README.md) / getShadowClipPosition

# Variable: getShadowClipPosition

> `const` **getShadowClipPosition**: `string` = `getShadowClipPosition_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:943](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/systemCodeManager/ShaderLibrary.ts#L943)

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
