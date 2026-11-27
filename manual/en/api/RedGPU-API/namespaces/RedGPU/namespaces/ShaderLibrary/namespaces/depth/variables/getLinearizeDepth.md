[**RedGPU API v4.6.0**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [ShaderLibrary](../../../README.md) / [depth](../README.md) / getLinearizeDepth

# Variable: getLinearizeDepth

> `const` **getLinearizeDepth**: `string` = `getLinearizeDepth_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:2044](https://github.com/redcamel/RedGPU/blob/a7aa3608e4bb06382354064aa5b75e4f3525d77e/src/systemCodeManager/ShaderLibrary.ts#L2044)

Recovers non-linear depth values into linear distances. (Stable Version)

//

## Param

**depthSample**

Depth value sampled from texture (0~1)
//

## Param

**near**

Camera near plane distance
//

## Param

**far**

Camera far plane distance
//

## Returns

Linearized distance value

```wgsl
#redgpu_include math.EPSILON

fn getLinearizeDepth(depthSample : f32, near : f32, far : f32) -> f32 {
    let d = clamp(depthSample, 0.0, 1.0);
    return (near * far) / max(EPSILON, far - d * (far - near));
}
```
