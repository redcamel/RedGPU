[**RedGPU API v4.4.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [Landscape](../../../../../README.md) / [Core](../../../README.md) / [Scatter](../README.md) / ScatterAssemblyResult

# Interface: ScatterAssemblyResult

Defined in: [src/landscape/core/scatter/assembleScatterRenderUnits.ts:125](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/assembleScatterRenderUnits.ts#L125)

`assembleScatterRenderUnits` 함수가 메시 계층을 병합하여 생성한 렌더 유닛, 통합 지오메트리 및 바운딩 볼륨 결과 인터페이스입니다.

## Properties

### boundingHeight

> **boundingHeight**: `number`

Defined in: [src/landscape/core/scatter/assembleScatterRenderUnits.ts:160](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/assembleScatterRenderUnits.ts#L160)

바운딩 박스의 전체 Y축 높이 (`maxY - minY`)

***

### boundingRadius

> **boundingRadius**: `number`

Defined in: [src/landscape/core/scatter/assembleScatterRenderUnits.ts:155](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/assembleScatterRenderUnits.ts#L155)

원점 기준 전체 정점의 최대 바운딩 구 반지름

***

### groups

> **groups**: [`AssembledMeshGroup`](AssembledMeshGroup.md)[]

Defined in: [src/landscape/core/scatter/assembleScatterRenderUnits.ts:130](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/assembleScatterRenderUnits.ts#L130)

머티리얼별로 병합된 메시 그룹(`AssembledMeshGroup[]`) 목록

***

### minY

> **minY**: `number`

Defined in: [src/landscape/core/scatter/assembleScatterRenderUnits.ts:170](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/assembleScatterRenderUnits.ts#L170)

정렬 후 바운딩 박스의 최소 Y 좌표

***

### renderUnits

> **renderUnits**: [`ScatterRenderUnit`](../classes/ScatterRenderUnit.md)[]

Defined in: [src/landscape/core/scatter/assembleScatterRenderUnits.ts:135](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/assembleScatterRenderUnits.ts#L135)

스캐터 렌더링에 사용할 `ScatterRenderUnit[]` 배열

***

### shadowMergedGeometry?

> `optional` **shadowMergedGeometry?**: [`Geometry`](../../../../../../../classes/Geometry.md)

Defined in: [src/landscape/core/scatter/assembleScatterRenderUnits.ts:165](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/assembleScatterRenderUnits.ts#L165)

그림자 패스용으로 병합된 위치 전용 `Geometry` 인스턴스 (생성 시)

***

### totalIndexCount

> **totalIndexCount**: `number`

Defined in: [src/landscape/core/scatter/assembleScatterRenderUnits.ts:150](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/assembleScatterRenderUnits.ts#L150)

병합된 전체 인덱스 개수

***

### totalVertexCount

> **totalVertexCount**: `number`

Defined in: [src/landscape/core/scatter/assembleScatterRenderUnits.ts:145](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/assembleScatterRenderUnits.ts#L145)

병합된 전체 정점 개수

***

### unifiedGeometry

> **unifiedGeometry**: [`Geometry`](../../../../../../../classes/Geometry.md)

Defined in: [src/landscape/core/scatter/assembleScatterRenderUnits.ts:140](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/assembleScatterRenderUnits.ts#L140)

모든 그룹의 정점/인덱스가 하나로 병합된 통합 `Geometry` 인스턴스
