[**RedGPU API v4.1.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [ShaderLibrary](../../../../../README.md) / [math](../../../README.md) / [tnb](../README.md) / getTBNFromCotangent

# Variable: getTBNFromCotangent

> `const` **getTBNFromCotangent**: `string` = `getTBNFromCotangent_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:851](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/systemCodeManager/ShaderLibrary.ts#L851)

픽셀의 미분(Derivatives)을 사용하여 탄젠트와 비탄젠트를 동적으로 계산하고 TBN 행렬을 구축합니다.

//

## Param

보간된 법선 벡터
//

## Param

월드 공간의 픽셀 위치
//

## Param

픽셀의 UV 좌표
//

## Returns

3x3 TBN 행렬

```wgsl
fn getTBNFromCotangent(inputNormal: vec3<f32>, inputWorldPos: vec3<f32>, inputUV: vec2<f32>) -> mat3x3<f32> {
    // 픽셀 미분을 통한 위치 및 UV 변화량 계산
    let dp1 = dpdx(inputWorldPos);
    let dp2 = dpdy(inputWorldPos);
    let duv1 = dpdx(inputUV);
    let duv2 = dpdy(inputUV);

    // 연립 방정식을 풀어 탄젠트와 비탄젠트 방향 도출 (Schüler's technique)
    let dp2perp = cross(dp2, inputNormal);
    let dp1perp = cross(inputNormal, dp1);

    let tangent = dp2perp * duv1.x + dp1perp * duv2.x;
    let bitangent = dp2perp * duv1.y + dp1perp * duv2.y;

    // Gram-Schmidt 직교화 및 행렬 구성
    let invmax = inverseSqrt(max(dot(tangent, tangent), dot(bitangent, bitangent)));

    // glTF 노멀 맵 G 채널은 Y+이며, 이는 V가 감소하는 방향(위쪽)을 의미합니다.
    // Schüler 공식으로 계산된 bitangent는 V가 증가하는 방향(아래쪽)을 향하므로 부호를 반전시킵니다.
    return mat3x3<f32>(tangent * invmax, -bitangent * invmax, inputNormal);
}
```
