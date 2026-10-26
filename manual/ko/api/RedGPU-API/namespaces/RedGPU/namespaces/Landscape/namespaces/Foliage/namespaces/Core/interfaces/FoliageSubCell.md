[**RedGPU API v4.4.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [Landscape](../../../../../README.md) / [Foliage](../../../README.md) / [Core](../README.md) / FoliageSubCell

# Interface: FoliageSubCell

Defined in: [src/landscape/foliage/core/Foliage.ts:61](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/Foliage.ts#L61)

식생(Foliage) 스트리밍의 최소 공간 단위인 서브 셀(Sub-Cell) 상태 정보 인터페이스입니다.

## Properties

### centerX

> **centerX**: `number`

Defined in: [src/landscape/foliage/core/Foliage.ts:81](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/Foliage.ts#L81)

서브 셀 중심의 월드 X 좌표

***

### centerZ

> **centerZ**: `number`

Defined in: [src/landscape/foliage/core/Foliage.ts:86](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/Foliage.ts#L86)

서브 셀 중심의 월드 Z 좌표

***

### instanceCount

> **instanceCount**: `number`

Defined in: [src/landscape/foliage/core/Foliage.ts:91](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/Foliage.ts#L91)

서브 셀 내 배치될 유효 인스턴스 개수 (미계산 시 `-1`)

***

### isMounted

> **isMounted**: `boolean`

Defined in: [src/landscape/foliage/core/Foliage.ts:96](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/Foliage.ts#L96)

현재 GPU 메가 버퍼에 마운트되어 있는지 여부

***

### mountedSlotIndex

> **mountedSlotIndex**: `number`

Defined in: [src/landscape/foliage/core/Foliage.ts:101](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/Foliage.ts#L101)

마운트된 GPU 메가 버퍼 내 슬롯 시작 오프셋 (미마운트 시 `-1`)

***

### subCellKey

> **subCellKey**: `number`

Defined in: [src/landscape/foliage/core/Foliage.ts:66](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/Foliage.ts#L66)

서브 셀 그리드 좌표(`subCellX`, `subCellZ`)를 패킹한 고유 키

***

### subCellX

> **subCellX**: `number`

Defined in: [src/landscape/foliage/core/Foliage.ts:71](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/Foliage.ts#L71)

서브 셀의 그리드 X 인덱스

***

### subCellZ

> **subCellZ**: `number`

Defined in: [src/landscape/foliage/core/Foliage.ts:76](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/Foliage.ts#L76)

서브 셀의 그리드 Z 인덱스
