[**RedGPU API v4.3.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [ShaderLibrary](../../../../../README.md) / [math](../../../README.md) / [reconstruct](../README.md) / getViewPositionFromDepth

# Variable: getViewPositionFromDepth

> `const` **getViewPositionFromDepth**: `string` = `getViewPositionFromDepth_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:731](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/systemCodeManager/ShaderLibrary.ts#L731)

깊이 정보를 바탕으로 뷰(카메라) 공간의 좌표를 복구합니다.

//

## Param

스크린 UV (0~1)
//

## Param

깊이 값 (0~1)
//

## Param

역투영 행렬
//

## Returns

복구된 뷰 공간 좌표

```wgsl
#redgpu_include math.reconstruct.getNDCFromDepth

fn getViewPositionFromDepth(
    uv: vec2<f32>,
    depth: f32,
    inverseProjectionMatrix: mat4x4<f32>
) -> vec3<f32> {
    let ndc = getNDCFromDepth(uv, depth);
    let viewPos4 = inverseProjectionMatrix * vec4<f32>(ndc, 1.0);
    return viewPos4.xyz / viewPos4.w;
}
```
