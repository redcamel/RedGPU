[**RedGPU API v4.4.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [Landscape](../../../../../README.md) / [Core](../../../README.md) / [Scatter](../README.md) / ScatterBaseSegmentAllocation

# Interface: ScatterBaseSegmentAllocation

Defined in: [src/landscape/core/scatter/AScatterMegaBuffer.ts:50](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterMegaBuffer.ts#L50)

메가 버퍼 내에서 단일 스캐터 타입에 할당된 세그먼트 오프셋 및 용량 정보를 담는 인터페이스입니다.

## Properties

### culledBaseOffset

> **culledBaseOffset**: `number`

Defined in: [src/landscape/core/scatter/AScatterMegaBuffer.ts:75](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterMegaBuffer.ts#L75)

컬링된(Culled) 인스턴스 버퍼 내 시작 인스턴스 오프셋

***

### indirectBaseOffset

> **indirectBaseOffset**: `number`

Defined in: [src/landscape/core/scatter/AScatterMegaBuffer.ts:80](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterMegaBuffer.ts#L80)

인다이렉트 드로우 버퍼 내 시작 슬롯 오프셋

***

### instanceCount

> **instanceCount**: `number`

Defined in: [src/landscape/core/scatter/AScatterMegaBuffer.ts:90](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterMegaBuffer.ts#L90)

현재 실제로 활성화된 인스턴스 개수

***

### maxInstances

> **maxInstances**: `number`

Defined in: [src/landscape/core/scatter/AScatterMegaBuffer.ts:65](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterMegaBuffer.ts#L65)

워크그룹 크기로 정렬된 최대 인스턴스 수용 개수

***

### name?

> `optional` **name?**: `string`

Defined in: [src/landscape/core/scatter/AScatterMegaBuffer.ts:60](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterMegaBuffer.ts#L60)

할당된 스캐터 타입의 이름 (선택적)

***

### rawBaseOffset

> **rawBaseOffset**: `number`

Defined in: [src/landscape/core/scatter/AScatterMegaBuffer.ts:70](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterMegaBuffer.ts#L70)

원시(Raw) 인스턴스 버퍼 내 시작 인스턴스 오프셋

***

### renderUnitCount

> **renderUnitCount**: `number`

Defined in: [src/landscape/core/scatter/AScatterMegaBuffer.ts:85](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterMegaBuffer.ts#L85)

이 세그먼트가 사용하는 렌더 유닛(서브메시/LOD) 슬롯 개수

***

### typeId

> **typeId**: `number`

Defined in: [src/landscape/core/scatter/AScatterMegaBuffer.ts:55](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterMegaBuffer.ts#L55)

할당된 스캐터 타입의 숫자 ID
