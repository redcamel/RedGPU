[**RedGPU API v4.4.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Display](../../../README.md) / [CoreMesh](../README.md) / createMeshVertexUniformBuffers

# Function: createMeshVertexUniformBuffers()

> **createMeshVertexUniformBuffers**(`mesh`, `skin?`): `void`

Defined in: [src/display/mesh/core/createMeshVertexUniformBuffers.ts:22](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/core/createMeshVertexUniformBuffers.ts#L22)

메시의 버텍스 유니폼 버퍼와 바인드 그룹 레이아웃을 생성합니다.

::: warning
이 함수는 시스템에 의해 내부적으로 호출됩니다.<br/>직접 호출하지 마십시오.
:::

## Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `mesh` | [`Mesh`](../../../classes/Mesh.md) | `undefined` | 대상 Mesh 인스턴스 |
| `skin?` | `boolean` | `false` | 스키닝 사용 여부 (기본값: false) |

## Returns

`void`
