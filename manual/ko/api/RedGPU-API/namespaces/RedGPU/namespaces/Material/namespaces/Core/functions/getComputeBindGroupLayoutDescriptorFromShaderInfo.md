[**RedGPU API v4.0.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Material](../../../README.md) / [Core](../README.md) / getComputeBindGroupLayoutDescriptorFromShaderInfo

# Function: getComputeBindGroupLayoutDescriptorFromShaderInfo()

> **getComputeBindGroupLayoutDescriptorFromShaderInfo**(`SHADER_INFO`, `targetGroupIndex`, `useMSAA`): `object`

Defined in: [src/material/core/getBindGroupLayoutDescriptorFromShaderInfo.ts:145](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/material/core/getBindGroupLayoutDescriptorFromShaderInfo.ts#L145)

셰이더 정보로부터 컴퓨트 바인드 그룹 레이아웃 디스크립터를 생성합니다.


## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `SHADER_INFO` | `any` | 셰이더 정보
| `targetGroupIndex` | `number` | 타겟 그룹 인덱스
| `useMSAA` | `boolean` | MSAA 사용 여부

## Returns

`object`

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `entries` | `GPUBindGroupLayoutEntry`[] | [src/material/core/getBindGroupLayoutDescriptorFromShaderInfo.ts:103](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/material/core/getBindGroupLayoutDescriptorFromShaderInfo.ts#L103) |
