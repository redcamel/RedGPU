[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Math](../README.md) / calculateTangents

# Function: calculateTangents()

> **calculateTangents**(`vertices`, `normals`, `uvs`, `indices`): `Float32Array`

Defined in: [src/math/calculateTangents.ts:131](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/math/calculateTangents.ts#L131)

MikkTSpace 알고리즘 기반으로 정점 탄젠트 벡터를 계산하여 새로운 배열로 반환합니다. (순수 수학 유틸리티)

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `vertices` | `number`[] \| `Float32Array`\<`ArrayBufferLike`\> | 정점 위치 배열
| `normals` | `number`[] \| `Float32Array`\<`ArrayBufferLike`\> | 노멀 벡터 배열
| `uvs` | `number`[] \| `Float32Array`\<`ArrayBufferLike`\> | UV 좌표 배열
| `indices` | `number`[] \| `Uint32Array`\<`ArrayBufferLike`\> | 인덱스 데이터

## Returns

`Float32Array`

계산된 탄젠트 배열
