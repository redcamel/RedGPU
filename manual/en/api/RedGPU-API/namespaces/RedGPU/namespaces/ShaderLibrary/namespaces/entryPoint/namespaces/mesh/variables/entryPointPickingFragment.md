[**RedGPU API v4.6.0**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [ShaderLibrary](../../../../../README.md) / [entryPoint](../../../README.md) / [mesh](../README.md) / entryPointPickingFragment

# Variable: entryPointPickingFragment

> `const` **entryPointPickingFragment**: `string` = `meshEntryPointPickingFragment_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:2173](https://github.com/redcamel/RedGPU/blob/a7aa3608e4bb06382354064aa5b75e4f3525d77e/src/systemCodeManager/ShaderLibrary.ts#L2173)

Fragment shader entry point for mesh picking.

//

## Param

**inputData**

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
