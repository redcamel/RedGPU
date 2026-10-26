[**RedGPU API v4.4.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [ShaderLibrary](../../../../../README.md) / [math](../../../README.md) / [reconstruct](../README.md) / getViewNormalFromGNormalBuffer

# Variable: getViewNormalFromGNormalBuffer

> `const` **getViewNormalFromGNormalBuffer**: `string` = `getViewNormalFromGNormalBuffer_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:786](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/systemCodeManager/ShaderLibrary.ts#L786)

Reconstructs view space normal vector from G-Buffer data and camera matrix.

//

## Param

**gBufferNormal**

Normal data sampled from G-Buffer
//

## Param

**viewMatrix**

Camera matrix (View Matrix)
//

## Returns

Reconstructed view space normal vector

```wgsl
#redgpu_include math.reconstruct.getWorldNormalFromGNormalBuffer

fn getViewNormalFromGNormalBuffer(gBufferNormal: vec3<f32>, viewMatrix: mat4x4<f32>) -> vec3<f32> {
    let worldNormal = getWorldNormalFromGNormalBuffer(gBufferNormal);
    return normalize((viewMatrix * vec4<f32>(worldNormal, 0.0)).xyz);
}
```
