[**RedGPU API v3.9.1-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Material](../../../README.md) / [Core](../README.md) / getComputeBindGroupLayoutDescriptorFromShaderInfo

# Function: getComputeBindGroupLayoutDescriptorFromShaderInfo()

> **getComputeBindGroupLayoutDescriptorFromShaderInfo**(`SHADER_INFO`, `targetGroupIndex`, `useMSAA`): `object`

Defined in: [src/material/core/getBindGroupLayoutDescriptorFromShaderInfo.ts:145](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/material/core/getBindGroupLayoutDescriptorFromShaderInfo.ts#L145)


Generates a compute bind group layout descriptor from shader information.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `SHADER_INFO` | `any` | Shader information |
| `targetGroupIndex` | `number` | Target group index |
| `useMSAA` | `boolean` | Whether to use MSAA |

## Returns

`object`

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `entries` | `GPUBindGroupLayoutEntry`[] | [src/material/core/getBindGroupLayoutDescriptorFromShaderInfo.ts:103](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/material/core/getBindGroupLayoutDescriptorFromShaderInfo.ts#L103) |
