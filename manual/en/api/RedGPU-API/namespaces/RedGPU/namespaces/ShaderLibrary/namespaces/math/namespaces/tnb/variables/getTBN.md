[**RedGPU API v4.5.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [ShaderLibrary](../../../../../README.md) / [math](../../../README.md) / [tnb](../README.md) / getTBN

# Variable: getTBN

> `const` **getTBN**: `string` = `getTBN_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:833](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/systemCodeManager/ShaderLibrary.ts#L833)

Constructs a perfectly orthonormal TBN (Tangent, Bitangent, Normal) matrix using a normal and an arbitrary tangent vector.

//

## Param

**inputNormal**

Normalized normal vector
//

## Param

**inputTangent**

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
