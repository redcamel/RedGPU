[**RedGPU API v4.4.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [Landscape](../../../../../README.md) / [Core](../../../README.md) / [Scatter](../README.md) / RawMeshNode

# Interface: RawMeshNode

Defined in: [src/landscape/core/scatter/assembleScatterRenderUnits.ts:25](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/assembleScatterRenderUnits.ts#L25)

계층 구조 순회를 통해 추출된 개별 원시 메시 노드의 지오메트리, 머티리얼 및 상대 변환 행렬 정보를 담는 인터페이스입니다.

## Properties

### currentRelativeMatrix

> **currentRelativeMatrix**: [`mat4`](../../../../../../Math/type-aliases/mat4.md)

Defined in: [src/landscape/core/scatter/assembleScatterRenderUnits.ts:40](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/assembleScatterRenderUnits.ts#L40)

루트 기준 누적 상대 변환 행렬 (`mat4`)

***

### geometry

> **geometry**: [`Geometry`](../../../../../../../classes/Geometry.md) \| [`Primitive`](../../../../../../Primitive/namespaces/Core/classes/Primitive.md)

Defined in: [src/landscape/core/scatter/assembleScatterRenderUnits.ts:30](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/assembleScatterRenderUnits.ts#L30)

메시에 연결된 `Geometry` 또는 `Primitive` 인스턴스

***

### material

> **material**: `any`

Defined in: [src/landscape/core/scatter/assembleScatterRenderUnits.ts:35](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/assembleScatterRenderUnits.ts#L35)

메시에 할당된 머티리얼 인스턴스

***

### normalMatrix

> **normalMatrix**: [`mat4`](../../../../../../Math/type-aliases/mat4.md)

Defined in: [src/landscape/core/scatter/assembleScatterRenderUnits.ts:45](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/assembleScatterRenderUnits.ts#L45)

법선 및 탄젠트 변환을 위한 역전치 법선 행렬 (`mat4`)

***

### rawStride

> **rawStride**: `number`

Defined in: [src/landscape/core/scatter/assembleScatterRenderUnits.ts:50](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/assembleScatterRenderUnits.ts#L50)

원본 정점 버퍼의 정점당 `Float32` 요소 개수
