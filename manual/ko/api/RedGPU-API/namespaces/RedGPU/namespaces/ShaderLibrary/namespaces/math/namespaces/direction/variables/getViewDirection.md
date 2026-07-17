[**RedGPU API v4.1.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [ShaderLibrary](../../../../../README.md) / [math](../../../README.md) / [direction](../README.md) / getViewDirection

# Variable: getViewDirection

> `const` **getViewDirection**: `string` = `getViewDirection_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:623](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/systemCodeManager/ShaderLibrary.ts#L623)

월드 좌표와 카메라 위치를 사용하여 정규화된 시선 방향 벡터(카메라를 향하는 벡터)를 계산합니다.

//

## Param

월드 공간의 좌표
//

## Param

카메라의 월드 위치
//

## Returns

정규화된 시선 방향 벡터

```wgsl
fn getViewDirection(worldPosition: vec3<f32>, cameraPosition: vec3<f32>) -> vec3<f32> {
    return normalize(cameraPosition - worldPosition);
}
```
