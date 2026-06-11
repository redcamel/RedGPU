[**RedGPU API v4.1.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [ShaderLibrary](../../../../../README.md) / [math](../../../README.md) / [reconstruct](../README.md) / getWorldPositionFromDepth

# Variable: getWorldPositionFromDepth

> `const` **getWorldPositionFromDepth**: `string` = `getWorldPositionFromDepth_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:704](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/systemCodeManager/ShaderLibrary.ts#L704)

깊이 정보를 바탕으로 월드 공간의 좌표를 복구합니다.

//

## Param

스크린 UV (0~1)
//

## Param

깊이 값 (0~1)
//

## Param

역투영카메라 행렬
//

## Returns

복구된 월드 공간 좌표

```wgsl
#redgpu_include math.reconstruct.getNDCFromDepth

fn getWorldPositionFromDepth(
    uv: vec2<f32>,
    depth: f32,
    inverseProjectionViewMatrix: mat4x4<f32>
) -> vec3<f32> {
    let ndc = getNDCFromDepth(uv, depth);
    let worldPos4 = inverseProjectionViewMatrix * vec4<f32>(ndc, 1.0);
    return worldPos4.xyz / worldPos4.w;
}
```
