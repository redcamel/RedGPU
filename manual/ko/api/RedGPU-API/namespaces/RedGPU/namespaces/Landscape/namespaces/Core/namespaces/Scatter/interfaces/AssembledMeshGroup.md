[**RedGPU API v4.4.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [Landscape](../../../../../README.md) / [Core](../../../README.md) / [Scatter](../README.md) / AssembledMeshGroup

# Interface: AssembledMeshGroup

Defined in: [src/landscape/core/scatter/assembleScatterRenderUnits.ts:59](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/assembleScatterRenderUnits.ts#L59)

동일 머티리얼 기준으로 병합된 서브메시 그룹의 지오메트리 및 인덱스 범위 정보를 담는 인터페이스입니다.

## Properties

### firstIndex

> **firstIndex**: `number`

Defined in: [src/landscape/core/scatter/assembleScatterRenderUnits.ts:84](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/assembleScatterRenderUnits.ts#L84)

통합 인덱스 버퍼 내 시작 인덱스 오프셋

***

### geometry

> **geometry**: [`Geometry`](../../../../../../../classes/Geometry.md)

Defined in: [src/landscape/core/scatter/assembleScatterRenderUnits.ts:69](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/assembleScatterRenderUnits.ts#L69)

병합된 통합 또는 그룹 `Geometry` 인스턴스

***

### indexCount

> **indexCount**: `number`

Defined in: [src/landscape/core/scatter/assembleScatterRenderUnits.ts:79](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/assembleScatterRenderUnits.ts#L79)

그룹 내 총 인덱스 개수

***

### material

> **material**: `any`

Defined in: [src/landscape/core/scatter/assembleScatterRenderUnits.ts:64](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/assembleScatterRenderUnits.ts#L64)

그룹에 적용된 머티리얼 인스턴스

***

### vertexCount

> **vertexCount**: `number`

Defined in: [src/landscape/core/scatter/assembleScatterRenderUnits.ts:74](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/assembleScatterRenderUnits.ts#L74)

그룹 내 총 정점 개수
