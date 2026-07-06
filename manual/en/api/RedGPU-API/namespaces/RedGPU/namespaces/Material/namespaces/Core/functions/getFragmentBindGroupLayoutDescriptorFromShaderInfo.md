[**RedGPU API v4.1.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Material](../../../README.md) / [Core](../README.md) / getFragmentBindGroupLayoutDescriptorFromShaderInfo

# Function: getFragmentBindGroupLayoutDescriptorFromShaderInfo()

> **getFragmentBindGroupLayoutDescriptorFromShaderInfo**(`SHADER_INFO`, `targetGroupIndex`): `object`

Defined in: [src/material/core/getBindGroupLayoutDescriptorFromShaderInfo.ts:118](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/material/core/getBindGroupLayoutDescriptorFromShaderInfo.ts#L118)

Generates a fragment bind group layout descriptor from shader information.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `SHADER_INFO` | `any` | Shader information |
| `targetGroupIndex` | `number` | Target group index |

## Returns

`object`

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `entries` | `GPUBindGroupLayoutEntry`[] | [src/material/core/getBindGroupLayoutDescriptorFromShaderInfo.ts:105](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/material/core/getBindGroupLayoutDescriptorFromShaderInfo.ts#L105) |
