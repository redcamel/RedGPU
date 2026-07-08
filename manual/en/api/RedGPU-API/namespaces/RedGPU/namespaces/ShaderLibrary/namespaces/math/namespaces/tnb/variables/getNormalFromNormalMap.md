[**RedGPU API v4.1.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [ShaderLibrary](../../../../../README.md) / [math](../../../README.md) / [tnb](../README.md) / getNormalFromNormalMap

# Variable: getNormalFromNormalMap

> `const` **getNormalFromNormalMap**: `string` = `getNormalFromNormalMap_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:884](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/systemCodeManager/ShaderLibrary.ts#L884)

Converts normal map data to a tangent space normal vector and applies the TBN matrix.

//

## Param

Sampled data from normal map (RG or RGB)
//

## Param

3x3 TBN matrix
//

## Param

Normal strength
//

## Returns

Normalized normal vector in world/view space

```wgsl
fn getNormalFromNormalMap(sampledNormalColor: vec3<f32>, tbn: mat3x3<f32>, strength: f32) -> vec3<f32> {
    // 1. Unpack XY: [0, 1] -> [-1, 1]
    var n: vec2<f32> = sampledNormalColor.xy * 2.0 - 1.0;

    // Invert Y contribution to resolve the directional mismatch between WebGPU's Top-Left UV (V+ points down) and standard normal maps (Y+ points up)
    n.y = -n.y;

    // 2. Apply Strength
    n *= strength;

    // 3. Z-Reconstruction: z = sqrt(1.0 - x^2 - y^2)
    let z: f32 = sqrt(max(0.0, 1.0 - dot(n, n)));

    // 4. Transform to World/View Space and Normalize
    return normalize(tbn * vec3<f32>(n, z));
}
```
