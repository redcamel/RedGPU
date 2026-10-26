[**RedGPU API v4.4.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [Landscape](../../../../../README.md) / [Foliage](../../../README.md) / [Core](../README.md) / assembleFoliageRenderUnits

# Function: assembleFoliageRenderUnits()

> **assembleFoliageRenderUnits**(`redGPUContext`, `options`, `slotPooler?`): [`FoliageAssemblyResult`](../interfaces/FoliageAssemblyResult.md)

Defined in: [src/landscape/foliage/core/assembleFoliageRenderUnits.ts:199](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/assembleFoliageRenderUnits.ts#L199)

식생 옵션에 정의된 LOD 메시들을 병합하고 팔면체 임포스터를 베이킹하여 렌더 유닛 리스트를 조립합니다.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../../../Context/classes/RedGPUContext.md) | `RedGPUContext` 인스턴스 |
| `options` | [`FoliageOptions`](../../../interfaces/FoliageOptions.md) | 식생 생성 및 LOD 구성 옵션 |
| `slotPooler?` | [`FoliageSlotPooler`](../classes/FoliageSlotPooler.md) | 렌더 유닛 동적 유니폼 슬롯 풀러 (선택) |

## Returns

[`FoliageAssemblyResult`](../interfaces/FoliageAssemblyResult.md)

조립된 렌더 유닛, 그림자 유닛, LOD 정보 및 바운딩 치수를 담은 결과 객체(`FoliageAssemblyResult`)
