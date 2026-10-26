[**RedGPU API v4.4.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Material](../../../README.md) / [Core](../README.md) / getBindGroupLayoutDescriptorFromShaderInfo

# Function: getBindGroupLayoutDescriptorFromShaderInfo()

> **getBindGroupLayoutDescriptorFromShaderInfo**(`SHADER_INFO`, `targetGroupIndex`, `visibility`, `overrideEntries?`): `GPUBindGroupLayoutDescriptor`

Defined in: [src/material/core/getBindGroupLayoutDescriptorFromShaderInfo.ts:187](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/material/core/getBindGroupLayoutDescriptorFromShaderInfo.ts#L187)

Generates a bind group layout descriptor with the specified stage visibility from single shader information.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `SHADER_INFO` | `any` | Parsed WGSL shader information object |
| `targetGroupIndex` | `number` | Target bind group index |
| `visibility` | `number` | GPU shader stage visibility flag (GPUShaderStage) |
| `overrideEntries?` | `Record`\<`number`, `Partial`\<`GPUBindGroupLayoutEntry`\>\> | Entry map to override specific binding configurations (`Record<number, Partial<GPUBindGroupLayoutEntry>>`, optional) |

## Returns

`GPUBindGroupLayoutDescriptor`

Generated GPUBindGroupLayoutDescriptor object
