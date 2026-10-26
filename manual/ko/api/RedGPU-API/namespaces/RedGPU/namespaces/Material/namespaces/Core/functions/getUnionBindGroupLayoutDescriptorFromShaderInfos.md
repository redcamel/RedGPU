[**RedGPU API v4.4.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Material](../../../README.md) / [Core](../README.md) / getUnionBindGroupLayoutDescriptorFromShaderInfos

# Function: getUnionBindGroupLayoutDescriptorFromShaderInfos()

> **getUnionBindGroupLayoutDescriptorFromShaderInfos**(`stageInfoList`, `targetGroupIndex`, `overrideEntries?`): `GPUBindGroupLayoutDescriptor`

Defined in: [src/material/core/getBindGroupLayoutDescriptorFromShaderInfo.ts:19](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/getBindGroupLayoutDescriptorFromShaderInfo.ts#L19)

여러 셰이더 스테이지 정보(Vertex, Fragment, Compute 등)로부터 특정 그룹의 바인드 그룹 레이아웃 디스크립터를 병합하여 생성합니다.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `stageInfoList` | `object`[] | 스테이지별 파싱된 셰이더 정보와 가시성 목록 (`Array<{ shaderInfo: any, visibility: GPUFlagsConstant }>`) |
| `targetGroupIndex` | `number` | 대상 바인드 그룹 인덱스 |
| `overrideEntries?` | `Record`\<`number`, `Partial`\<`GPUBindGroupLayoutEntry`\>\> | 특정 바인딩 번호의 설정을 덮어쓸 엔트리 맵 (`Record<number, Partial<GPUBindGroupLayoutEntry>>`, 선택) |

## Returns

`GPUBindGroupLayoutDescriptor`

병합된 GPUBindGroupLayoutDescriptor 객체
