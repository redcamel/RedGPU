[**RedGPU API v4.4.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [ShaderLibrary](../../../../../README.md) / [math](../../../README.md) / [tnb](../README.md) / getTBNFromVertexTangent

# Variable: getTBNFromVertexTangent

> `const` **getTBNFromVertexTangent**: `string` = `getTBNFromVertexTangent_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:813](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/systemCodeManager/ShaderLibrary.ts#L813)

법선(Normal)과 버텍스 탄젠트(vec4)를 사용하여 TBN(Tangent, Bitangent, Normal) 행렬을 구축합니다.

//

## Param

**inputNormal**

정규화된 법선 벡터
//

## Param

**inputVertexTangent**

버텍스 탄젠트 데이터 (xyz: 방향, w: 방향성)
//

## Returns

3x3 TBN 행렬

```wgsl
fn getTBNFromVertexTangent(inputNormal: vec3<f32>, inputVertexTangent: vec4<f32>) -> mat3x3<f32> {
    // Gram-Schmidt 직교화: 탄젠트가 법선과 정확히 수직이 되도록 보정
    let tangent = normalize(inputVertexTangent.xyz - inputNormal * dot(inputVertexTangent.xyz, inputNormal));

    // glTF 표준 및 오른손 법칙 준수 (N x T = B)
    let bitangent = cross(inputNormal, tangent) * inputVertexTangent.w;

    return mat3x3<f32>(tangent, bitangent, inputNormal);
}
```
