[**RedGPU API v4.4.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Material](../../../README.md) / [Core](../README.md) / getComputeBindGroupLayoutDescriptorFromShaderInfo

# Function: getComputeBindGroupLayoutDescriptorFromShaderInfo()

> **getComputeBindGroupLayoutDescriptorFromShaderInfo**(`SHADER_INFO`, `targetGroupIndex`, `useMSAAOrOverride?`, `overrideEntries?`): `GPUBindGroupLayoutDescriptor`

Defined in: [src/material/core/getBindGroupLayoutDescriptorFromShaderInfo.ts:273](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/material/core/getBindGroupLayoutDescriptorFromShaderInfo.ts#L273)

Generates a bind group layout descriptor for the compute stage (GPUShaderStage.COMPUTE) from parsed shader information.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `SHADER_INFO` | `any` | Parsed WGSL shader information object |
| `targetGroupIndex` | `number` | Target bind group index |
| `useMSAAOrOverride?` | `boolean` \| `Record`\<`number`, `Partial`\<`GPUBindGroupLayoutEntry`\>\> | MSAA usage boolean flag or binding override map (`boolean \| Record<number, Partial<GPUBindGroupLayoutEntry>>`, optional) |
| `overrideEntries?` | `Record`\<`number`, `Partial`\<`GPUBindGroupLayoutEntry`\>\> | Entry map to override specific binding configurations (`Record<number, Partial<GPUBindGroupLayoutEntry>>`, optional) |

## Returns

`GPUBindGroupLayoutDescriptor`

GPUBindGroupLayoutDescriptor object for compute stage
