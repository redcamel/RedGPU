[**RedGPU API v4.5.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [ShaderLibrary](../../../../../README.md) / [math](../../../README.md) / [reconstruct](../README.md) / getWorldPositionFromDepth

# Variable: getWorldPositionFromDepth

> `const` **getWorldPositionFromDepth**: `string` = `getWorldPositionFromDepth_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:726](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/systemCodeManager/ShaderLibrary.ts#L726)

Reconstructs world space position from depth information.

//

## Param

**uv**

Screen UV (0~1)
//

## Param

**depth**

Depth value (0~1)
//

## Param

**inverseProjectionViewMatrix**

Inverse Projection-View matrix
//

## Returns

Reconstructed world space position

```wgsl
#redgpu_include math.reconstruct.getNDCFromDepth

fn getWorldPositionFromDepth(
    uv: vec2<f32>,
    depth: f32,
    inverseProjectionViewMatrix: mat4x4<f32>
) -> vec3<f32> {
    let ndc = getNDCFromDepth(uv, depth);
    let worldPos4 = inverseProjectionViewMatrix * vec4<f32>(ndc, 1.0);
    return worldPos4.xyz / worldPos4.w;
}
```
