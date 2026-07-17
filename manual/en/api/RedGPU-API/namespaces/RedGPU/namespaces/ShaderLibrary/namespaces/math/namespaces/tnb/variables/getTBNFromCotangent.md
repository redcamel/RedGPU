[**RedGPU API v4.3.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [ShaderLibrary](../../../../../README.md) / [math](../../../README.md) / [tnb](../README.md) / getTBNFromCotangent

# Variable: getTBNFromCotangent

> `const` **getTBNFromCotangent**: `string` = `getTBNFromCotangent_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:853](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/systemCodeManager/ShaderLibrary.ts#L853)

Dynamically calculates tangent and bitangent using pixel derivatives and constructs a TBN matrix.

//

## Param

Interpolated normal vector
//

## Param

World space pixel position
//

## Param

Pixel UV coordinates
//

## Returns

3x3 TBN matrix

```wgsl
fn getTBNFromCotangent(inputNormal: vec3<f32>, inputWorldPos: vec3<f32>, inputUV: vec2<f32>) -> mat3x3<f32> {
    // Calculate position and UV changes through pixel derivatives
    let dp1 = dpdx(inputWorldPos);
    let dp2 = dpdy(inputWorldPos);
    let duv1 = dpdx(inputUV);
    let duv2 = dpdy(inputUV);

    // Derive tangent and bitangent directions by solving simultaneous equations (Schüler's technique)
    let dp2perp = cross(dp2, inputNormal);
    let dp1perp = cross(inputNormal, dp1);

    let tangent = dp2perp * duv1.x + dp1perp * duv2.x;
    let bitangent = dp2perp * duv1.y + dp1perp * duv2.y;

    // Gram-Schmidt orthonormalization and matrix construction
    let invmax = inverseSqrt(max(dot(tangent, tangent), dot(bitangent, bitangent)));

    // glTF normal map G channel is Y+ (upwards), which corresponds to decreasing V.
    // The bitangent calculated by Schüler's formula points in the direction of increasing V (downwards), so we flip its sign.
    return mat3x3<f32>(tangent * invmax, -bitangent * invmax, inputNormal);
}
```
