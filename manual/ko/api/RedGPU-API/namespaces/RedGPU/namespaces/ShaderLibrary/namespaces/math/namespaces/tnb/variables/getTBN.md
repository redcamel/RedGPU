[**RedGPU API v4.1.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [ShaderLibrary](../../../../../README.md) / [math](../../../README.md) / [tnb](../README.md) / getTBN

# Variable: getTBN

> `const` **getTBN**: `string` = `getTBN_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:811](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/systemCodeManager/ShaderLibrary.ts#L811)

법선(Normal)과 임의의 탄젠트(Tangent) 벡터를 사용하여 완전한 직교 기저(Orthonormal Basis)인 TBN 행렬을 구축합니다.

//

## Param

정규화된 법선 벡터
//

## Param

탄젠트 벡터 (법선과 수직이 아니어도 됨)
//

## Returns

3x3 직교 TBN 행렬

```wgsl
fn getTBN(inputNormal: vec3<f32>, inputTangent: vec3<f32>) -> mat3x3<f32> {
    // Gram-Schmidt orthonormalization
    let tangent = normalize(inputTangent - inputNormal * dot(inputTangent, inputNormal));
    // 표준적인 오른손 좌표계 기저 형성 (N x T = B)
    let bitangent = cross(inputNormal, tangent);
    return mat3x3<f32>(tangent, bitangent, inputNormal);
}
```
