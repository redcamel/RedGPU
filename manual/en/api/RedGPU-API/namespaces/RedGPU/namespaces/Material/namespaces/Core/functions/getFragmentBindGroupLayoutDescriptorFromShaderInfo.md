[**RedGPU API v4.4.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Material](../../../README.md) / [Core](../README.md) / getFragmentBindGroupLayoutDescriptorFromShaderInfo

# Function: getFragmentBindGroupLayoutDescriptorFromShaderInfo()

> **getFragmentBindGroupLayoutDescriptorFromShaderInfo**(`SHADER_INFO`, `targetGroupIndex`, `overrideEntries?`): `GPUBindGroupLayoutDescriptor`

Defined in: [src/material/core/getBindGroupLayoutDescriptorFromShaderInfo.ts:218](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/getBindGroupLayoutDescriptorFromShaderInfo.ts#L218)

Generates a bind group layout descriptor for the fragment stage (GPUShaderStage.FRAGMENT) from parsed shader information.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `SHADER_INFO` | `any` | Parsed WGSL shader information object |
| `targetGroupIndex` | `number` | Target bind group index |
| `overrideEntries?` | `Record`\<`number`, `Partial`\<`GPUBindGroupLayoutEntry`\>\> | Entry map to override specific binding configurations (`Record<number, Partial<GPUBindGroupLayoutEntry>>`, optional) |

## Returns

`GPUBindGroupLayoutDescriptor`

GPUBindGroupLayoutDescriptor object for fragment stage
