[**RedGPU API v4.1.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [ShaderLibrary](../../../README.md) / [shadow](../README.md) / getShadowCoord

# Variable: getShadowCoord

> `const` **getShadowCoord**: `string` = `getShadowCoord_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:923](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/systemCodeManager/ShaderLibrary.ts#L923)

Converts world coordinates to light's clip space coordinates (UV + Depth).

//

## Param

Position in world space
//

## Param

Light's View-Projection matrix
//

## Returns

vec3 coordinates for shadow map sampling (x, y: UV, z: Depth)

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
