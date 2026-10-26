[**RedGPU API v4.4.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [ShaderLibrary](../../../../../README.md) / [entryPoint](../../../README.md) / [empty](../README.md) / entryPointPickingVertex

# Variable: entryPointPickingVertex

> `const` **entryPointPickingVertex**: `string` = `emptyEntryPointPickingVertex_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:2329](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/systemCodeManager/ShaderLibrary.ts#L2329)

Empty vertex shader entry point for picking.

//

## Param

**inputData**

Vertex input data
//

## Returns

Vertex output data

```wgsl
@vertex
fn entryPointPickingVertex(inputData: InputData) -> VertexOutput {
    var output: VertexOutput;
    return output;
}
```
