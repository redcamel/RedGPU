[**RedGPU API v4.3.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [ShaderLibrary](../../../../../README.md) / [math](../../../README.md) / [tnb](../README.md) / getTBN

# Variable: getTBN

> `const` **getTBN**: `string` = `getTBN_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:813](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/systemCodeManager/ShaderLibrary.ts#L813)

Constructs a perfectly orthonormal TBN (Tangent, Bitangent, Normal) matrix using a normal and an arbitrary tangent vector.

//

## Param

Normalized normal vector
//

## Param

Tangent vector (does not need to be perpendicular to normal)
//

## Returns

3x3 Orthonormal TBN matrix

```wgsl
fn getTBN(inputNormal: vec3<f32>, inputTangent: vec3<f32>) -> mat3x3<f32> {
    // Gram-Schmidt orthonormalization
    let tangent = normalize(inputTangent - inputNormal * dot(inputTangent, inputNormal));
    // Standard right-handed basis formation (N x T = B)
    let bitangent = cross(inputNormal, tangent);
    return mat3x3<f32>(tangent, bitangent, inputNormal);
}
```
