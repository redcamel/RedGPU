[**RedGPU API v4.2.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [ShaderLibrary](../../../../../README.md) / [entryPoint](../../../README.md) / [empty](../README.md) / entryPointShadowVertex

# Variable: entryPointShadowVertex

> `const` **entryPointShadowVertex**: `string` = `emptyEntryPointShadowVertex_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:2278](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/systemCodeManager/ShaderLibrary.ts#L2278)

Empty vertex shader entry point for shadow map generation.

//

## Param

Vertex input data
//

## Returns

Shadow map output data

```wgsl
#redgpu_include systemStruct.OutputShadowData;

@vertex
fn entryPointShadowVertex(inputData: InputData) -> OutputShadowData {
    var output: OutputShadowData;
    return output;
}
```
