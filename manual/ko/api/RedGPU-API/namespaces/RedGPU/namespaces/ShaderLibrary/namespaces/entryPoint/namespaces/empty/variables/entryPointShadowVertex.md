[**RedGPU API v4.4.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [ShaderLibrary](../../../../../README.md) / [entryPoint](../../../README.md) / [empty](../README.md) / entryPointShadowVertex

# Variable: entryPointShadowVertex

> `const` **entryPointShadowVertex**: `string` = `emptyEntryPointShadowVertex_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:2348](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/systemCodeManager/ShaderLibrary.ts#L2348)

비어있는 그림자 맵 버텍스 셰이더 엔트리 포인트입니다.

//

## Param

**inputData**

버텍스 입력 데이터
//

## Returns

그림자 맵 출력 데이터

```wgsl
#redgpu_include systemStruct.OutputShadowData;

@vertex
fn entryPointShadowVertex(inputData: InputData) -> OutputShadowData {
    var output: OutputShadowData;
    return output;
}
```
