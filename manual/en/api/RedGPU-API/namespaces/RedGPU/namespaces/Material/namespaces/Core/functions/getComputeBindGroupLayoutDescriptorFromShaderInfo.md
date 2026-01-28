[**RedGPU API v3.9.1-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Material](../../../README.md) / [Core](../README.md) / getComputeBindGroupLayoutDescriptorFromShaderInfo

# Function: getComputeBindGroupLayoutDescriptorFromShaderInfo()

> **getComputeBindGroupLayoutDescriptorFromShaderInfo**(`SHADER_INFO`, `targetGroupIndex`, `useMSAA`): `object`

Defined in: [src/material/core/getBindGroupLayoutDescriptorFromShaderInfo.ts:126](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/material/core/getBindGroupLayoutDescriptorFromShaderInfo.ts#L126)


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
| `entries` | `GPUBindGroupLayoutEntry`[] | [src/material/core/getBindGroupLayoutDescriptorFromShaderInfo.ts:84](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/material/core/getBindGroupLayoutDescriptorFromShaderInfo.ts#L84) |
