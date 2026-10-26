[**RedGPU API v4.4.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Material](../../../README.md) / [Core](../README.md) / getBindGroupLayoutDescriptorFromShaderInfo

# Function: getBindGroupLayoutDescriptorFromShaderInfo()

> **getBindGroupLayoutDescriptorFromShaderInfo**(`SHADER_INFO`, `targetGroupIndex`, `visibility`, `overrideEntries?`): `GPUBindGroupLayoutDescriptor`

Defined in: [src/material/core/getBindGroupLayoutDescriptorFromShaderInfo.ts:187](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/material/core/getBindGroupLayoutDescriptorFromShaderInfo.ts#L187)

단일 셰이더 정보로부터 지정된 스테이지 가시성을 가진 바인드 그룹 레이아웃 디스크립터를 생성합니다.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `SHADER_INFO` | `any` | 파싱된 WGSL 셰이더 정보 객체 |
| `targetGroupIndex` | `number` | 대상 바인드 그룹 인덱스 |
| `visibility` | `number` | GPU 셰이더 스테이지 가시성 플래그 (GPUShaderStage) |
| `overrideEntries?` | `Record`\<`number`, `Partial`\<`GPUBindGroupLayoutEntry`\>\> | 특정 바인딩 번호의 설정을 덮어쓸 엔트리 맵 (`Record<number, Partial<GPUBindGroupLayoutEntry>>`, 선택) |

## Returns

`GPUBindGroupLayoutDescriptor`

생성된 GPUBindGroupLayoutDescriptor 객체
