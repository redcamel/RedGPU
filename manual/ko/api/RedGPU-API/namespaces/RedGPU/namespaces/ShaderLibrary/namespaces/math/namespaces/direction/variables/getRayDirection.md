[**RedGPU API v4.4.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [ShaderLibrary](../../../../../README.md) / [math](../../../README.md) / [direction](../README.md) / getRayDirection

# Variable: getRayDirection

> `const` **getRayDirection**: `string` = `getRayDirection_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:660](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/systemCodeManager/ShaderLibrary.ts#L660)

카메라 위치와 월드 좌표를 사용하여 정규화된 광선 방향 벡터(픽셀을 향하는 벡터)를 계산합니다.

//

## Param

**worldPosition**

월드 공간의 좌표
//

## Param

**cameraPosition**

카메라의 월드 위치
//

## Returns

정규화된 광선 방향 벡터

```wgsl
fn getRayDirection(worldPosition: vec3<f32>, cameraPosition: vec3<f32>) -> vec3<f32> {
    return normalize(worldPosition - cameraPosition);
}
```
