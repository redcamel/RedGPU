[**RedGPU API v4.3.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [ShaderLibrary](../../../../../README.md) / [entryPoint](../../../README.md) / [mesh](../README.md) / entryPointShadowVertex

# Variable: entryPointShadowVertex

> `const` **entryPointShadowVertex**: `string` = `meshEntryPointShadowVertex_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:2175](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/systemCodeManager/ShaderLibrary.ts#L2175)

그림자 맵 생성을 위한 버텍스 셰이더 엔트리 포인트입니다.

//

## Param

버텍스 입력 데이터
//

## Returns

그림자 맵 출력을 위한 데이터

```wgsl
#redgpu_include shadow.getShadowClipPosition
#redgpu_include systemStruct.OutputShadowData;

@vertex
fn entryPointShadowVertex(inputData: InputData) -> OutputShadowData {
    var output: OutputShadowData;

    let globalVertexData = globalVertexSSBO[inputData.globalVertexSlotIndex];
    // 시스템 Uniform 변수 가져오기
    let u_directionalLightProjectionViewMatrix = systemUniforms.directionalLightProjectionViewMatrix;
    let u_camera = systemUniforms.camera;
    let u_viewMatrix = u_camera.viewMatrix;
    let u_cameraPosition = u_camera.cameraPosition;

    // Vertex별 Uniform 변수 가져오기
    let u_modelMatrix = globalVertexData.matrixList.modelMatrix;

    // 입력 데이터
    let input_position = inputData.position;
    let input_vertexNormal = inputData.vertexNormal;
    let input_uv = inputData.uv;

    // 위치 변환 처리
    var position: vec4<f32>;
    position = u_modelMatrix * vec4<f32>(input_position, 1.0);

    // 디스플레이스먼트 텍스처 적용
    #redgpu_if useDisplacementTexture
    {
        let distance = distance(position.xyz, u_cameraPosition);
        let maxMip = f32(textureNumLevels(displacementTexture)) - 1.0;
        let mipLevel = clamp((distance / maxDistance) * maxMip, 0.0, maxMip);
        let displacedPosition = getDisplacementPosition(
            input_position,
            input_vertexNormal,
            displacementTexture,
            displacementTextureSampler,
            globalVertexData.displacementScale,
            input_uv,
            mipLevel
        );
        position = u_modelMatrix * vec4<f32>(displacedPosition, 1.0);
    }
    #redgpu_endIf

    // 최종 위치 계산 (그림자 맵 좌표계로 변환)
    output.position = getShadowClipPosition(position.xyz, u_directionalLightProjectionViewMatrix);

    return output;
}
```
