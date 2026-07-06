[**RedGPU API v4.2.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [ShaderLibrary](../../../../../README.md) / [math](../../../README.md) / [tnb](../README.md) / getTBNFromVertexTangent

# Variable: getTBNFromVertexTangent

> `const` **getTBNFromVertexTangent**: `string` = `getTBNFromVertexTangent_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:792](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/systemCodeManager/ShaderLibrary.ts#L792)

Constructs a TBN (Tangent, Bitangent, Normal) matrix using the normal and vertex tangent (vec4).

//

## Param

Normalized normal vector
//

## Param

Vertex tangent data
//

## Returns

3x3 TBN matrix

```wgsl
fn getTBNFromVertexTangent(inputNormal: vec3<f32>, inputVertexTangent: vec4<f32>) -> mat3x3<f32> {
    // Gram-Schmidt orthonormalization: Corrects the tangent to be perfectly perpendicular to the normal
    let tangent = normalize(inputVertexTangent.xyz - inputNormal * dot(inputVertexTangent.xyz, inputNormal));

    // Adheres to glTF standard and right-hand rule (N x T = B)
    let bitangent = cross(inputNormal, tangent) * inputVertexTangent.w;

    return mat3x3<f32>(tangent, bitangent, inputNormal);
}
```
