[**RedGPU API v4.4.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Material](../../../README.md) / [Core](../README.md) / getVertexBindGroupLayoutDescriptorFromShaderInfo

# Function: getVertexBindGroupLayoutDescriptorFromShaderInfo()

> **getVertexBindGroupLayoutDescriptorFromShaderInfo**(`SHADER_INFO`, `targetGroupIndex`, `overrideEntries?`): `GPUBindGroupLayoutDescriptor`

Defined in: [src/material/core/getBindGroupLayoutDescriptorFromShaderInfo.ts:244](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/material/core/getBindGroupLayoutDescriptorFromShaderInfo.ts#L244)

파싱된 셰이더 정보로부터 버텍스 스테이지(GPUShaderStage.VERTEX)용 바인드 그룹 레이아웃 디스크립터를 생성합니다.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `SHADER_INFO` | `any` | 파싱된 WGSL 셰이더 정보 객체 |
| `targetGroupIndex` | `number` | 대상 바인드 그룹 인덱스 |
| `overrideEntries?` | `Record`\<`number`, `Partial`\<`GPUBindGroupLayoutEntry`\>\> | 특정 바인딩 번호의 설정을 덮어쓸 엔트리 맵 (`Record<number, Partial<GPUBindGroupLayoutEntry>>`, 선택) |

## Returns

`GPUBindGroupLayoutDescriptor`

버텍스용 GPUBindGroupLayoutDescriptor 객체
