[**RedGPU API v4.5.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Material](../../../README.md) / [Core](../README.md) / getVertexBindGroupLayoutDescriptorFromShaderInfo

# Function: getVertexBindGroupLayoutDescriptorFromShaderInfo()

> **getVertexBindGroupLayoutDescriptorFromShaderInfo**(`SHADER_INFO`, `targetGroupIndex`, `overrideEntries?`): `GPUBindGroupLayoutDescriptor`

Defined in: [src/material/core/getBindGroupLayoutDescriptorFromShaderInfo.ts:244](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/core/getBindGroupLayoutDescriptorFromShaderInfo.ts#L244)

Generates a bind group layout descriptor for the vertex stage (GPUShaderStage.VERTEX) from parsed shader information.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `SHADER_INFO` | `any` | Parsed WGSL shader information object |
| `targetGroupIndex` | `number` | Target bind group index |
| `overrideEntries?` | `Record`\<`number`, `Partial`\<`GPUBindGroupLayoutEntry`\>\> | Entry map to override specific binding configurations (`Record<number, Partial<GPUBindGroupLayoutEntry>>`, optional) |

## Returns

`GPUBindGroupLayoutDescriptor`

GPUBindGroupLayoutDescriptor object for vertex stage
