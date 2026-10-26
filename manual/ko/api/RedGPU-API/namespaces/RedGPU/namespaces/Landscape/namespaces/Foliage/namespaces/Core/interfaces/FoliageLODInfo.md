[**RedGPU API v4.4.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [Landscape](../../../../../README.md) / [Foliage](../../../README.md) / [Core](../README.md) / FoliageLODInfo

# Interface: FoliageLODInfo

Defined in: [src/landscape/foliage/core/Foliage.ts:185](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/core/Foliage.ts#L185)

어셈블리 완료 후 GPU 컬링 및 렌더링에 사용되는 LOD 메타데이터 인터페이스입니다.

## Properties

### lodDistance

> **lodDistance**: `number`

Defined in: [src/landscape/foliage/core/Foliage.ts:195](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/core/Foliage.ts#L195)

해당 LOD 단계의 전환 거리 (미터 단위)

***

### lodIndex

> **lodIndex**: `number`

Defined in: [src/landscape/foliage/core/Foliage.ts:190](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/core/Foliage.ts#L190)

LOD 단계 인덱스

***

### renderUnitCount

> **renderUnitCount**: `number`

Defined in: [src/landscape/foliage/core/Foliage.ts:205](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/core/Foliage.ts#L205)

해당 LOD 단계에 속한 렌더 유닛 개수

***

### renderUnitOffset

> **renderUnitOffset**: `number`

Defined in: [src/landscape/foliage/core/Foliage.ts:200](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/core/Foliage.ts#L200)

렌더 유닛 배열 내 시작 오프셋
