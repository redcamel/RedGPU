[**RedGPU API v4.4.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Landscape](../../../README.md) / [Foliage](../README.md) / FoliageLODConfig

# Interface: FoliageLODConfig

Defined in: [src/landscape/foliage/core/Foliage.ts:162](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/Foliage.ts#L162)

식생(Foliage)의 개별 LOD(Level of Detail) 단계 구성을 정의하는 인터페이스입니다.

## Properties

### lodDistance?

> `optional` **lodDistance?**: `number`

Defined in: [src/landscape/foliage/core/Foliage.ts:172](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/Foliage.ts#L172)

해당 LOD 단계가 적용되는 최대 카메라 거리 (미터 단위)

***

### mesh

> **mesh**: [`Mesh`](../../../../Display/classes/Mesh.md) \| [`Mesh`](../../../../Display/classes/Mesh.md)[]

Defined in: [src/landscape/foliage/core/Foliage.ts:167](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/Foliage.ts#L167)

해당 LOD 단계에서 렌더링할 `Mesh` 또는 `Mesh` 배열

***

### receiveShadow?

> `optional` **receiveShadow?**: `boolean`

Defined in: [src/landscape/foliage/core/Foliage.ts:177](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/Foliage.ts#L177)

해당 LOD 단계의 그림자 수신 여부
