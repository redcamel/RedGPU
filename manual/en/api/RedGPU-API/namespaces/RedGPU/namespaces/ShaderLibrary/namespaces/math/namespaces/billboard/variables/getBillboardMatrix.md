[**RedGPU API v4.3.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [ShaderLibrary](../../../../../README.md) / [math](../../../README.md) / [billboard](../README.md) / getBillboardMatrix

# Variable: getBillboardMatrix

> `const` **getBillboardMatrix**: `string` = `getBillboardMatrix_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:511](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/systemCodeManager/ShaderLibrary.ts#L511)

Calculates the billboard matrix.

//

## Param

Camera matrix
//

## Param

Model matrix
//

## Param

1u: Standard (accurate scale extraction), 0u: Fast scale (uses diagonal elements)
//

## Returns

Calculated billboard matrix

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
