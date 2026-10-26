[**RedGPU API v4.4.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [ShaderLibrary](../../../../../README.md) / [math](../../../README.md) / [reconstruct](../README.md) / getViewPositionFromDepth

# Variable: getViewPositionFromDepth

> `const` **getViewPositionFromDepth**: `string` = `getViewPositionFromDepth_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:752](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/systemCodeManager/ShaderLibrary.ts#L752)

Reconstructs view (camera) space position from depth information.

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

**inverseProjectionMatrix**

Inverse Projection matrix
//

## Returns

Reconstructed view space position

```wgsl
#redgpu_include math.reconstruct.getNDCFromDepth

fn getViewPositionFromDepth(
    uv: vec2<f32>,
    depth: f32,
    inverseProjectionMatrix: mat4x4<f32>
) -> vec3<f32> {
    let ndc = getNDCFromDepth(uv, depth);
    let viewPos4 = inverseProjectionMatrix * vec4<f32>(ndc, 1.0);
    return viewPos4.xyz / viewPos4.w;
}
```
