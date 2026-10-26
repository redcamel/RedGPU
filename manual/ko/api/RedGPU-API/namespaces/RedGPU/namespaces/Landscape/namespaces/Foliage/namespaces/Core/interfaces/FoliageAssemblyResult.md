[**RedGPU API v4.4.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [Landscape](../../../../../README.md) / [Foliage](../../../README.md) / [Core](../README.md) / FoliageAssemblyResult

# Interface: FoliageAssemblyResult

Defined in: [src/landscape/foliage/core/assembleFoliageRenderUnits.ts:153](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/core/assembleFoliageRenderUnits.ts#L153)

식생 메시 어셈블리 및 임포스터 베이킹 결과 데이터 인터페이스입니다.

## Properties

### boundingHeight

> **boundingHeight**: `number`

Defined in: [src/landscape/foliage/core/assembleFoliageRenderUnits.ts:178](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/core/assembleFoliageRenderUnits.ts#L178)

식생 전체 바운딩 높이(미터 단위)

***

### boundingRadius

> **boundingRadius**: `number`

Defined in: [src/landscape/foliage/core/assembleFoliageRenderUnits.ts:173](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/core/assembleFoliageRenderUnits.ts#L173)

식생 전체 바운딩 스피어 반경(미터 단위)

***

### lodInfoList

> **lodInfoList**: [`FoliageLODInfo`](FoliageLODInfo.md)[]

Defined in: [src/landscape/foliage/core/assembleFoliageRenderUnits.ts:168](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/core/assembleFoliageRenderUnits.ts#L168)

LOD 단계별 거리 및 렌더 유닛 범위 메타데이터 목록

***

### renderUnits

> **renderUnits**: [`FoliageRenderUnit`](../classes/FoliageRenderUnit.md)[]

Defined in: [src/landscape/foliage/core/assembleFoliageRenderUnits.ts:158](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/core/assembleFoliageRenderUnits.ts#L158)

메인 및 깊이 프리패스용 렌더 유닛 목록

***

### shadowMergedRenderUnits

> **shadowMergedRenderUnits**: [`FoliageRenderUnit`](../classes/FoliageRenderUnit.md)[]

Defined in: [src/landscape/foliage/core/assembleFoliageRenderUnits.ts:163](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/core/assembleFoliageRenderUnits.ts#L163)

그림자 패스 전용 병합 렌더 유닛 목록
