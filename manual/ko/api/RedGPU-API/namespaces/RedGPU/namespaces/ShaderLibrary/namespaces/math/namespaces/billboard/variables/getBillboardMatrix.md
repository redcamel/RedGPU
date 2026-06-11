[**RedGPU API v4.1.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [ShaderLibrary](../../../../../README.md) / [math](../../../README.md) / [billboard](../README.md) / getBillboardMatrix

# Variable: getBillboardMatrix

> `const` **getBillboardMatrix**: `string` = `getBillboardMatrix_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:509](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/systemCodeManager/ShaderLibrary.ts#L509)

빌보드 행렬을 계산합니다.

//

## Param

카메라 행렬
//

## Param

모델 행렬
//

## Param

1u: 표준 (정확한 스케일 추출), 0u: 빠른 스케일 (대각 성분 사용)
//

## Returns

계산된 빌보드 행렬

```wgsl
fn getBillboardMatrix(viewMatrix: mat4x4<f32>, modelMatrix: mat4x4<f32>, useStandardScale: u32) -> mat4x4<f32> {
    var resultMatrix = viewMatrix * modelMatrix;

    if (useStandardScale == 1u) {
        // [표준 모드] 회전이 포함된 행렬에서도 정확한 스케일 추출 (length 연산 포함)
        let scaleX = length(modelMatrix[0].xyz);
        let scaleY = length(modelMatrix[1].xyz);
        let scaleZ = length(modelMatrix[2].xyz);

        resultMatrix[0] = vec4<f32>(scaleX, 0.0, 0.0, resultMatrix[0].w);
        resultMatrix[1] = vec4<f32>(0.0, scaleY, 0.0, resultMatrix[1].w);
        resultMatrix[2] = vec4<f32>(0.0, 0.0, scaleZ, resultMatrix[2].w);
    } else {
        // [빠른 모드] 대각 성분을 직접 사용하여 회전 제거 (파티클 등 최적화용)
        resultMatrix[0] = vec4<f32>(modelMatrix[0][0], 0.0, 0.0, resultMatrix[0].w);
        resultMatrix[1] = vec4<f32>(0.0, modelMatrix[1][1], 0.0, resultMatrix[1].w);
        resultMatrix[2] = vec4<f32>(0.0, 0.0, modelMatrix[2][2], resultMatrix[2].w);
    }

    return resultMatrix;
}
```
