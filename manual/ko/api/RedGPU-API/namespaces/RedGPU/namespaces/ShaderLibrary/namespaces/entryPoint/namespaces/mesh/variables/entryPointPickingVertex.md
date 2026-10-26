[**RedGPU API v4.4.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [ShaderLibrary](../../../../../README.md) / [entryPoint](../../../README.md) / [mesh](../README.md) / entryPointPickingVertex

# Variable: entryPointPickingVertex

> `const` **entryPointPickingVertex**: `string` = `meshEntryPointPickingVertex_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:2153](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/systemCodeManager/ShaderLibrary.ts#L2153)

메쉬 피킹 버텍스 셰이더 엔트리 포인트입니다.

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
    let input_position = inputData.position;
    let globalVertexData = globalVertexSSBO[inputData.globalVertexSlotIndex];
    let u_modelMatrix = globalVertexData.matrixList.modelMatrix;
    let u_projectionMatrix = systemUniforms.projection.projectionMatrix;
    let u_projectionViewMatrix = systemUniforms.projection.projectionViewMatrix;
    let u_camera = systemUniforms.camera;
    let u_viewMatrix = u_camera.viewMatrix;
    let position = u_modelMatrix * vec4<f32>(input_position, 1.0);
    let relPos = position.xyz - u_camera.cameraPosition;
    let viewPos = (u_viewMatrix * vec4<f32>(relPos, 0.0)).xyz;
    output.position = u_projectionMatrix * vec4<f32>(viewPos, 1.0);
    output.pickingId = unpack4x8unorm(globalVertexData.pickingId);
    return output;
}
```
