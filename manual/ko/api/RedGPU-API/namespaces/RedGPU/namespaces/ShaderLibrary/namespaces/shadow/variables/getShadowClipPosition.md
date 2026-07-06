[**RedGPU API v4.2.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [ShaderLibrary](../../../README.md) / [shadow](../README.md) / getShadowClipPosition

# Variable: getShadowClipPosition

> `const` **getShadowClipPosition**: `string` = `getShadowClipPosition_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:943](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/systemCodeManager/ShaderLibrary.ts#L943)

월드 좌표를 빛의 관점에서의 클립 공간(Clip Space) 좌표로 변환합니다. (Shadow Pass 전용)

//

## Param

월드 공간 상의 위치
//

## Param

빛의 View-Projection 행렬
//

## Returns

빛의 클립 공간 좌표 (vec4)

```wgsl
fn getShadowClipPosition(worldPosition: vec3<f32>, lightViewProjectionMatrix: mat4x4<f32>) -> vec4<f32> {
    // 월드 좌표를 빛의 공간으로 투영
    return lightViewProjectionMatrix * vec4<f32>(worldPosition, 1.0);
}
```
