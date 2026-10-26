[**RedGPU API v4.4.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [Landscape](../../../../../README.md) / [Core](../../../README.md) / [Scatter](../README.md) / ScatterRenderUnitInitOptions

# Interface: ScatterRenderUnitInitOptions

Defined in: [src/landscape/core/scatter/ScatterRenderUnit.ts:10](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/ScatterRenderUnit.ts#L10)

`ScatterRenderUnit` 인스턴스 초기화에 필요한 지오메트리, 인덱스 범위 및 머티리얼 옵션 인터페이스입니다.

## Properties

### baseColorTexture?

> `optional` **baseColorTexture?**: [`BitmapTexture`](../../../../../../Resource/classes/BitmapTexture.md)

Defined in: [src/landscape/core/scatter/ScatterRenderUnit.ts:75](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/ScatterRenderUnit.ts#L75)

베이스 컬러 텍스처 인스턴스 (선택적)

***

### firstIndex?

> `optional` **firstIndex?**: `number`

Defined in: [src/landscape/core/scatter/ScatterRenderUnit.ts:63](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/ScatterRenderUnit.ts#L63)

통합 인덱스 버퍼 내 시작 인덱스 오프셋 (기본값: `0`)

***

### geometry

> **geometry**: [`Geometry`](../../../../../../../classes/Geometry.md)

Defined in: [src/landscape/core/scatter/ScatterRenderUnit.ts:15](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/ScatterRenderUnit.ts#L15)

렌더링할 정점/인덱스 버퍼를 보유한 `Geometry` 인스턴스

***

### indexCount?

> `optional` **indexCount?**: `number`

Defined in: [src/landscape/core/scatter/ScatterRenderUnit.ts:27](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/ScatterRenderUnit.ts#L27)

드로우할 인덱스 개수 (생략 시 인덱스 버퍼에서 추론)

***

### indexFormat?

> `optional` **indexFormat?**: `GPUIndexFormat`

Defined in: [src/landscape/core/scatter/ScatterRenderUnit.ts:39](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/ScatterRenderUnit.ts#L39)

인덱스 버퍼 포맷 (기본값: `'uint32'`)

***

### indirectOffsetBytes?

> `optional` **indirectOffsetBytes?**: `number`

Defined in: [src/landscape/core/scatter/ScatterRenderUnit.ts:51](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/ScatterRenderUnit.ts#L51)

인다이렉트 드로우 버퍼 내 바이트 오프셋 (기본값: `0`)

***

### instanceBufferOffset?

> `optional` **instanceBufferOffset?**: `number`

Defined in: [src/landscape/core/scatter/ScatterRenderUnit.ts:57](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/ScatterRenderUnit.ts#L57)

컬링된 인스턴스 버퍼 내 시작 인스턴스 오프셋 (기본값: `0`)

***

### isIndexed?

> `optional` **isIndexed?**: `boolean`

Defined in: [src/landscape/core/scatter/ScatterRenderUnit.ts:33](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/ScatterRenderUnit.ts#L33)

인덱스 버퍼 사용 여부 (생략 시 지오메트리에서 추론)

***

### isMasked?

> `optional` **isMasked?**: `boolean`

Defined in: [src/landscape/core/scatter/ScatterRenderUnit.ts:87](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/ScatterRenderUnit.ts#L87)

알파 마스크(Alpha Cutoff) 머티리얼 여부 (기본값: `false`)

***

### lodIndex?

> `optional` **lodIndex?**: `number`

Defined in: [src/landscape/core/scatter/ScatterRenderUnit.ts:81](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/ScatterRenderUnit.ts#L81)

이 렌더 유닛이 속한 LOD 레벨 인덱스 (기본값: `0`)

***

### material?

> `optional` **material?**: `any`

Defined in: [src/landscape/core/scatter/ScatterRenderUnit.ts:69](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/ScatterRenderUnit.ts#L69)

이 렌더 유닛에 적용된 머티리얼 인스턴스 (선택적)

***

### strideBytes?

> `optional` **strideBytes?**: `number`

Defined in: [src/landscape/core/scatter/ScatterRenderUnit.ts:45](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/ScatterRenderUnit.ts#L45)

정점당 바이트 스트라이드 (기본값: `72`)

***

### vertexCount?

> `optional` **vertexCount?**: `number`

Defined in: [src/landscape/core/scatter/ScatterRenderUnit.ts:21](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/ScatterRenderUnit.ts#L21)

렌더 유닛의 정점 개수 (생략 시 지오메트리에서 추론)
