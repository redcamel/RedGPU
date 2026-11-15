[**RedGPU API v4.5.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [ShaderLibrary](../../../../../README.md) / [entryPoint](../../../README.md) / [empty](../README.md) / entryPointShadowVertex

# Variable: entryPointShadowVertex

> `const` **entryPointShadowVertex**: `string` = `emptyEntryPointShadowVertex_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:2351](https://github.com/redcamel/RedGPU/blob/02c1984aa4d4459730423af2aefb6e6d17516878/src/systemCodeManager/ShaderLibrary.ts#L2351)

Empty vertex shader entry point for shadow map generation.

//

## Param

**inputData**

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
