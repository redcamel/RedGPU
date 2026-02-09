[**RedGPU API v3.9.1-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Material](../../../README.md) / [Core](../README.md) / getFragmentBindGroupLayoutDescriptorFromShaderInfo

# Function: getFragmentBindGroupLayoutDescriptorFromShaderInfo()

> **getFragmentBindGroupLayoutDescriptorFromShaderInfo**(`SHADER_INFO`, `targetGroupIndex`): `object`

Defined in: [src/material/core/getBindGroupLayoutDescriptorFromShaderInfo.ts:116](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/material/core/getBindGroupLayoutDescriptorFromShaderInfo.ts#L116)


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
| `entries` | `GPUBindGroupLayoutEntry`[] | [src/material/core/getBindGroupLayoutDescriptorFromShaderInfo.ts:103](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/material/core/getBindGroupLayoutDescriptorFromShaderInfo.ts#L103) |
