[**RedGPU API v4.1.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [ShaderLibrary](../../../../../README.md) / [math](../../../README.md) / [reconstruct](../README.md) / getViewPositionFromDepth

# Variable: getViewPositionFromDepth

> `const` **getViewPositionFromDepth**: `string` = `getViewPositionFromDepth_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:729](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/systemCodeManager/ShaderLibrary.ts#L729)

Reconstructs view (camera) space position from depth information.

//

## Param

Screen UV (0~1)
//

## Param

Depth value (0~1)
//

## Param

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
