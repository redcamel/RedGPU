[**RedGPU API v4.6.0**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [ShaderLibrary](../../../../../README.md) / [entryPoint](../../../README.md) / [empty](../README.md) / entryPointShadowVertex

# Variable: entryPointShadowVertex

> `const` **entryPointShadowVertex**: `string` = `emptyEntryPointShadowVertex_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:2351](https://github.com/redcamel/RedGPU/blob/a7aa3608e4bb06382354064aa5b75e4f3525d77e/src/systemCodeManager/ShaderLibrary.ts#L2351)

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
