[**RedGPU API v4.1.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [ShaderLibrary](../../../../../README.md) / [math](../../../README.md) / [reconstruct](../README.md) / getWorldPositionFromDepth

# Variable: getWorldPositionFromDepth

> `const` **getWorldPositionFromDepth**: `string` = `getWorldPositionFromDepth_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:704](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/systemCodeManager/ShaderLibrary.ts#L704)

Reconstructs world space position from depth information.

//

## Param

Screen UV (0~1)
//

## Param

Depth value (0~1)
//

## Param

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
