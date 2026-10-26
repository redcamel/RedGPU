[**RedGPU API v4.4.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Material](../../../README.md) / [Core](../README.md) / getUnionBindGroupLayoutDescriptorFromShaderInfos

# Function: getUnionBindGroupLayoutDescriptorFromShaderInfos()

> **getUnionBindGroupLayoutDescriptorFromShaderInfos**(`stageInfoList`, `targetGroupIndex`, `overrideEntries?`): `GPUBindGroupLayoutDescriptor`

Defined in: [src/material/core/getBindGroupLayoutDescriptorFromShaderInfo.ts:19](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/getBindGroupLayoutDescriptorFromShaderInfo.ts#L19)

Generates a merged bind group layout descriptor for a specific group from multiple shader stage information (Vertex, Fragment, Compute, etc.).

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `stageInfoList` | `object`[] | List of parsed shader information and visibility per stage (`Array<{ shaderInfo: any, visibility: GPUFlagsConstant }>`) |
| `targetGroupIndex` | `number` | Target bind group index |
| `overrideEntries?` | `Record`\<`number`, `Partial`\<`GPUBindGroupLayoutEntry`\>\> | Entry map to override specific binding configurations (`Record<number, Partial<GPUBindGroupLayoutEntry>>`, optional) |

## Returns

`GPUBindGroupLayoutDescriptor`

Merged GPUBindGroupLayoutDescriptor object
