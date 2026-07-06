[**RedGPU API v4.1.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [ShaderLibrary](../../../../../README.md) / [math](../../../README.md) / [tnb](../README.md) / getNormalFromNormalMap

# Variable: getNormalFromNormalMap

> `const` **getNormalFromNormalMap**: `string` = `getNormalFromNormalMap_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:884](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/systemCodeManager/ShaderLibrary.ts#L884)

노멀 맵 데이터를 탄젠트 공간의 법선 벡터로 변환하고 TBN 행렬을 적용합니다.

//

## Param

노멀 맵에서 샘플링된 데이터 (RG 또는 RGB)
//

## Param

3x3 TBN 행렬
//

## Param

노멀 강도
//

## Returns

월드/뷰 공간의 정규화된 법선 벡터

```wgsl
fn getNormalFromNormalMap(sampledNormalColor: vec3<f32>, tbn: mat3x3<f32>, strength: f32) -> vec3<f32> {
    // 1. Unpack XY: [0, 1] -> [-1, 1]
    var n: vec2<f32> = sampledNormalColor.xy * 2.0 - 1.0;

    // WebGPU의 Top-Left UV(V+가 아래로 향함)와 표준 노멀 맵(Y+가 위로 향함) 사이의 방향성 불일치 해결을 위해 Y 기여도 반전
    n.y = -n.y;

    // 2. Apply Strength
    n *= strength;

    // 3. Z-Reconstruction: z = sqrt(1.0 - x^2 - y^2)
    let z: f32 = sqrt(max(0.0, 1.0 - dot(n, n)));

    // 4. Transform to World/View Space and Normalize
    return normalize(tbn * vec3<f32>(n, z));
}
```
