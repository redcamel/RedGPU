[**RedGPU API v4.1.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [ShaderLibrary](../../../README.md) / [shadow](../README.md) / getShadowCoord

# Variable: getShadowCoord

> `const` **getShadowCoord**: `string` = `getShadowCoord_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:925](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/systemCodeManager/ShaderLibrary.ts#L925)

월드 좌표를 빛의 클립 공간 좌표(UV + Depth)로 변환합니다.

//

## Param

월드 공간 상의 위치
//

## Param

빛의 View-Projection 행렬
//

## Returns

그림자 맵 샘플링을 위한 vec3 좌표 (x, y: UV, z: Depth)

```wgsl
fn getShadowCoord(worldPosition: vec3<f32>, lightViewProjectionMatrix: mat4x4<f32>) -> vec3<f32> {
    // 1. 빛의 공간으로 변환 (Convert to light space)
    let posFromLight = lightViewProjectionMatrix * vec4<f32>(worldPosition, 1.0);

    // 2. 원근 분할 적용 (Apply perspective divide)
    // - 직교 투영(Directional)에서는 w가 1이지만, 원근 투영(Spot)을 위해 분할을 수행합니다.
    let shadowCoordNDC = posFromLight.xyz / posFromLight.w;

    // 3. NDC [-1, 1] 범위를 UV [0, 1] 범위로 변환
    // - WebGPU 표준: (x * 0.5 + 0.5), (y * -0.5 + 0.5)
    return vec3<f32>(
        shadowCoordNDC.xy * vec2<f32>(0.5, -0.5) + vec2<f32>(0.5, 0.5),
        shadowCoordNDC.z
    );
}
```
