[**RedGPU API v4.3.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [ShaderLibrary](../../../../../README.md) / [entryPoint](../../../README.md) / [mesh](../README.md) / entryPointPickingFragment

# Variable: entryPointPickingFragment

> `const` **entryPointPickingFragment**: `string` = `meshEntryPointPickingFragment_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:2113](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/systemCodeManager/ShaderLibrary.ts#L2113)

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
