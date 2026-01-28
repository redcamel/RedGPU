[**RedGPU API v3.9.1-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Material](../../../README.md) / [Core](../README.md) / getFragmentBindGroupLayoutDescriptorFromShaderInfo

# Function: getFragmentBindGroupLayoutDescriptorFromShaderInfo()

> **getFragmentBindGroupLayoutDescriptorFromShaderInfo**(`SHADER_INFO`, `targetGroupIndex`): `object`

Defined in: [src/material/core/getBindGroupLayoutDescriptorFromShaderInfo.ts:97](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/material/core/getBindGroupLayoutDescriptorFromShaderInfo.ts#L97)


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
| `entries` | `GPUBindGroupLayoutEntry`[] | [src/material/core/getBindGroupLayoutDescriptorFromShaderInfo.ts:84](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/material/core/getBindGroupLayoutDescriptorFromShaderInfo.ts#L84) |
