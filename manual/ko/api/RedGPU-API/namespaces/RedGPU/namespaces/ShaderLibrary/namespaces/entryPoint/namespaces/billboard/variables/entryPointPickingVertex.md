[**RedGPU API v4.4.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [ShaderLibrary](../../../../../README.md) / [entryPoint](../../../README.md) / [billboard](../README.md) / entryPointPickingVertex

# Variable: entryPointPickingVertex

> `const` **entryPointPickingVertex**: `string` = `billboardEntryPointPickingVertex_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:2309](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/systemCodeManager/ShaderLibrary.ts#L2309)

빌보드용 피킹 버텍스 셰이더 엔트리 포인트입니다.

//

## Param

**inputData**

버텍스 입력 데이터
//

## Returns

버텍스 출력 데이터

```wgsl
@vertex
fn entryPointPickingVertex(inputData: InputData) -> VertexOutput {
    var output: VertexOutput;
    let u_resolution = systemUniforms.resolution;
    let globalVertexData = globalVertexSSBO[inputData.globalVertexSlotIndex];
    #redgpu_if disableJitter
        let u_projectionMatrix = systemUniforms.projection.noneJitterProjectionMatrix;
    #redgpu_else
        let u_projectionMatrix = systemUniforms.projection.projectionMatrix;
    #redgpu_endIf

    let u_viewMatrix = systemUniforms.camera.viewMatrix;
    let u_modelMatrix = globalVertexData.matrixList.modelMatrix;
    let u_useBillboard = vertexUniforms.useBillboard;
    let u_usePixelSize = vertexUniforms.usePixelSize;
    let u_pixelSize = vertexUniforms.pixelSize;
    let u_renderRatioX = vertexUniforms.renderRatioX;
    let u_renderRatioY = vertexUniforms.renderRatioY;

    var ratioScaleMatrix: mat4x4<f32> = mat4x4<f32>(
        u_renderRatioX, 0, 0, 0,
        0, u_renderRatioY, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    );

    if (u_useBillboard == 1) {
        let billboardMatrix = getBillboardMatrix(u_viewMatrix, u_modelMatrix, 1u);

        if (u_usePixelSize == 1) {
            let viewPositionCenter = billboardMatrix * vec4<f32>(0.0, 0.0, 0.0, 1.0);
            let clipCenter = u_projectionMatrix * viewPositionCenter;
            let scaleX = (u_pixelSize / u_resolution.x) * 2.0 * u_renderRatioX;
            let scaleY = (u_pixelSize / u_resolution.y) * 2.0 * u_renderRatioY;

            output.position = vec4<f32>(
                clipCenter.xy + inputData.position.xy * vec2<f32>(scaleX, scaleY) * clipCenter.w,
                clipCenter.zw
            );
        } else {
            output.position = u_projectionMatrix * billboardMatrix * ratioScaleMatrix * vec4<f32>(inputData.position, 1.0);
        }
    } else {
        if (u_usePixelSize == 1) {
            let viewPositionCenter = u_viewMatrix * u_modelMatrix * vec4<f32>(0.0, 0.0, 0.0, 1.0);
            let clipCenter = u_projectionMatrix * viewPositionCenter;
            let pixelWorldScale = (u_pixelSize / u_resolution.y) * (2.0 * clipCenter.w / abs(u_projectionMatrix[1][1]));
            let pixelRatioScaleMatrix = mat4x4<f32>(
                u_renderRatioX * pixelWorldScale, 0, 0, 0,
                0, u_renderRatioY * pixelWorldScale, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1
            );
            output.position = u_projectionMatrix * u_viewMatrix * u_modelMatrix * pixelRatioScaleMatrix * vec4<f32>(inputData.position, 1.0);
        } else {
            output.position = u_projectionMatrix * u_viewMatrix * u_modelMatrix * ratioScaleMatrix * vec4<f32>(inputData.position, 1.0);
        }
    }

    output.pickingId = unpack4x8unorm(globalVertexData.pickingId);
    return output;
}
```
