[**RedGPU API v4.4.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [Landscape](../../../../../README.md) / [Core](../../../README.md) / [Cache](../README.md) / LandscapeWeightMapCPUSampler

# Class: LandscapeWeightMapCPUSampler

Defined in: [src/landscape/core/cache/LandscapeWeightMapCPUSampler.ts:36](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/cache/LandscapeWeightMapCPUSampler.ts#L36)

지형 레이어의 가중치 맵 이미지를 CPU 메모리로 로드하여 이중 선형 보간 샘플링을 수행하는 클래스입니다.

::: warning
이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
:::

## Constructors

### Constructor

> **new LandscapeWeightMapCPUSampler**(): `LandscapeWeightMapCPUSampler`

#### Returns

`LandscapeWeightMapCPUSampler`

## Methods

### clear()

> **clear**(): `void`

Defined in: [src/landscape/core/cache/LandscapeWeightMapCPUSampler.ts:179](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/cache/LandscapeWeightMapCPUSampler.ts#L179)

캐시된 모든 가중치 맵 데이터와 진행 중인 로딩 상태를 초기화합니다.

#### Returns

`void`

***

### destroy()

> **destroy**(): `void`

Defined in: [src/landscape/core/cache/LandscapeWeightMapCPUSampler.ts:188](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/cache/LandscapeWeightMapCPUSampler.ts#L188)

샘플러의 내부 캐시 리소스를 해제합니다.

#### Returns

`void`

***

### getWeight()

> **getWeight**(`src`, `u`, `v`, `channelIndex?`): `number`

Defined in: [src/landscape/core/cache/LandscapeWeightMapCPUSampler.ts:140](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/cache/LandscapeWeightMapCPUSampler.ts#L140)

정규화된 UV 좌표(`0.0` ~ `1.0`)와 채널 인덱스에 해당하는 가중치 값을 이중 선형 보간하여 반환합니다.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `src` | `string` | `undefined` | 가중치 맵 이미지 경로(URL) |
| `u` | `number` | `undefined` | 정규화된 U 좌표 (`0.0` ~ `1.0`) |
| `v` | `number` | `undefined` | 정규화된 V 좌표 (`0.0` ~ `1.0`) |
| `channelIndex?` | `number` | `0` | 샘플링할 색상 채널 인덱스 (`0`: R, `1`: G, `2`: B, `3`: A, 기본값: `0`) |

#### Returns

`number`

샘플링된 가중치 값 (`0.0` ~ `1.0`)

***

### load()

> **load**(`src`): `Promise`\<[`WeightMapPixelData`](../interfaces/WeightMapPixelData.md)\>

Defined in: [src/landscape/core/cache/LandscapeWeightMapCPUSampler.ts:51](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/cache/LandscapeWeightMapCPUSampler.ts#L51)

지정된 이미지 경로의 가중치 맵 픽셀 데이터를 비동기로 로드하고 캐싱합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `src` | `string` | 가중치 맵 이미지 경로(URL) |

#### Returns

`Promise`\<[`WeightMapPixelData`](../interfaces/WeightMapPixelData.md)\>

로드된 픽셀 데이터 (`Promise<WeightMapPixelData | null>`)
