[**RedGPU API v4.1.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [ShaderLibrary](../../../../../README.md) / [math](../../../README.md) / [direction](../README.md) / getReflectionVectorFromViewDirection

# Variable: getReflectionVectorFromViewDirection

> `const` **getReflectionVectorFromViewDirection**: `string` = `getReflectionVectorFromViewDirection_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:656](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/systemCodeManager/ShaderLibrary.ts#L656)

시선 방향(픽셀에서 카메라를 향하는 벡터)과 법선 벡터를 사용하여 정규화된 반사 방향 벡터를 계산합니다.

이 함수는 내부적으로 시선 방향을 반전시켜 reflect(-viewDir, normal) 연산을 수행합니다.

//

## Param

시선 방향 (픽셀 -> 카메라)
//

## Param

표면 법선 벡터
//

## Returns

정규화된 반사 방향 벡터

```wgsl
fn getReflectionVectorFromViewDirection(viewDirection: vec3<f32>, normal: vec3<f32>) -> vec3<f32> {
    return reflect(-viewDirection, normal);
}
```
