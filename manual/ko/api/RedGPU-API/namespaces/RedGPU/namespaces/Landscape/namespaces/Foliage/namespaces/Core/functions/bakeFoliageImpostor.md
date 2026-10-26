[**RedGPU API v4.4.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [Landscape](../../../../../README.md) / [Foliage](../../../README.md) / [Core](../README.md) / bakeFoliageImpostor

# Function: bakeFoliageImpostor()

> **bakeFoliageImpostor**(`redGPUContext`, `renderUnits`, `bakeName?`): [`FoliageBakeResult`](../interfaces/FoliageBakeResult.md)

Defined in: [src/landscape/foliage/core/baking/impostor/bakeFoliageImpostor.ts:217](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/core/baking/impostor/bakeFoliageImpostor.ts#L217)

지정된 렌더 유닛 목록을 반구형 팔면체(Hemi-Octahedral) 격자 시점에서 렌더링하여 원거리 임포스터용 아틀라스 텍스처(BaseColor, Normal, ORM)를 베이킹합니다.

## Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../../../Context/classes/RedGPUContext.md) | `undefined` | `RedGPUContext` 인스턴스 |
| `renderUnits` | [`FoliageRenderUnit`](../classes/FoliageRenderUnit.md)[] | `undefined` | 베이킹 대상 원본 렌더 유닛 배열 |
| `bakeName?` | `string` | `'Foliage'` | 생성될 GPU 리소스 라벨 접두사 (기본값: `'Foliage'`) |

## Returns

[`FoliageBakeResult`](../interfaces/FoliageBakeResult.md)

베이킹된 아틀라스 텍스처들과 바운딩 치수 정보(`FoliageBakeResult`)
