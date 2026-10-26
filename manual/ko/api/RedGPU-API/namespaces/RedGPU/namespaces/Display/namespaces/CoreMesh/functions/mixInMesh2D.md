[**RedGPU API v4.4.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Display](../../../README.md) / [CoreMesh](../README.md) / mixInMesh2D

# Function: mixInMesh2D()

> **mixInMesh2D**\<`TBase`\>(`Base`): \{new (...`args`): `resultClass`; `prototype`: `resultClass`\<`any`\>; \} & `TBase`

Defined in: [src/display/mesh/core/mixInMesh2D.ts:60](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/core/mixInMesh2D.ts#L60)

기본 메쉬 클래스에 2D 전용 트랜스폼(위치, 스케일, 회전) 및 블렌드 모드 기능을 결합하는 믹스인 함수입니다.

## Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| <a id="type-parameter-tbase"></a> `TBase` *extends* new (...`args`) => `Mesh2DBase` | `Mesh2DBase`를 만족하는 생성자 타입 |

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `Base` | `TBase` | 확장할 기반 클래스 |

## Returns

\{new (...`args`): `resultClass`; `prototype`: `resultClass`\<`any`\>; \} & `TBase`

2D 메쉬 기능이 확장된 클래스
