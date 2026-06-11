[**RedGPU API v4.1.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [ShaderLibrary](../../../../../README.md) / [entryPoint](../../../README.md) / [mesh](../README.md) / entryPointPickingFragment

# Variable: entryPointPickingFragment

> `const` **entryPointPickingFragment**: `string` = `meshEntryPointPickingFragment_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:2082](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/systemCodeManager/ShaderLibrary.ts#L2082)

Fragment shader entry point for mesh picking.

//

## Param

Fragment input data
//

## Returns

Picking ID (location 0)

```wgsl
@fragment
fn entryPointPickingFragment(inputData: InputData) -> @location(0) vec4<f32> {
    var finalColor:vec4<f32> = inputData.pickingId;
    return finalColor;
}
```
