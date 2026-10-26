[**RedGPU API v4.4.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [Landscape](../../../../../README.md) / [Core](../../../README.md) / [Scatter](../README.md) / AScatterTypeInitOptions

# Interface: AScatterTypeInitOptions

Defined in: [src/landscape/core/scatter/AScatterType.ts:13](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterType.ts#L13)

스캐터 타입 생성 시 공통으로 전달되는 초기화 옵션 인터페이스입니다.

## Extended by

- [`FoliageOptions`](../../../../Foliage/interfaces/FoliageOptions.md)
- [`GrassOptions`](../../../../Grass/interfaces/GrassOptions.md)

## Properties

### bottomOffset?

> `optional` **bottomOffset?**: `number`

Defined in: [src/landscape/core/scatter/AScatterType.ts:36](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterType.ts#L36)

지형 표면 대비 인스턴스 하단 높이 오프셋 (기본값: `0.0`)

***

### castShadow?

> `optional` **castShadow?**: `boolean`

Defined in: [src/landscape/core/scatter/AScatterType.ts:48](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterType.ts#L48)

디렉셔널 라이트 그림자 투사 활성화 여부 (기본값: `true`)

***

### cullingDistance?

> `optional` **cullingDistance?**: `number`

Defined in: [src/landscape/core/scatter/AScatterType.ts:24](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterType.ts#L24)

카메라로부터 인스턴스가 컬링되는 최대 가시 거리 (기본값: `200.0`)

***

### densityMultiplier?

> `optional` **densityMultiplier?**: `number`

Defined in: [src/landscape/core/scatter/AScatterType.ts:84](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterType.ts#L84)

기준 밀도에 곱해지는 밀도 배율 (기본값: `1.0`)

***

### densityPerHectare?

> `optional` **densityPerHectare?**: `number`

Defined in: [src/landscape/core/scatter/AScatterType.ts:78](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterType.ts#L78)

헥타르(10,000㎡)당 기준 배치 밀도 (기본값: `1000.0`)

***

### densityScaleByWeight?

> `optional` **densityScaleByWeight?**: `boolean`

Defined in: [src/landscape/core/scatter/AScatterType.ts:72](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterType.ts#L72)

레이어 가중치에 비례하여 인스턴스 스케일을 조절할지 여부 (기본값: `true`)

***

### groundBlendStrength?

> `optional` **groundBlendStrength?**: `number`

Defined in: [src/landscape/core/scatter/AScatterType.ts:90](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterType.ts#L90)

지형 표면 색상 및 법선과의 하단 블렌딩 강도 (`0.0`~`1.0`, 기본값: `1.0`)

***

### height?

> `optional` **height?**: `number`

Defined in: [src/landscape/core/scatter/AScatterType.ts:42](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterType.ts#L42)

인스턴스의 기준 높이 (기본값: `1.0`)

***

### maxSlope?

> `optional` **maxSlope?**: `number`

Defined in: [src/landscape/core/scatter/AScatterType.ts:66](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterType.ts#L66)

인스턴스가 배치될 수 있는 최대 지형 경사각 (단위: 도, 기본값: `45.0`)

***

### minSlope?

> `optional` **minSlope?**: `number`

Defined in: [src/landscape/core/scatter/AScatterType.ts:60](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterType.ts#L60)

인스턴스가 배치될 수 있는 최소 지형 경사각 (단위: 도, 기본값: `0.0`)

***

### name

> **name**: `string`

Defined in: [src/landscape/core/scatter/AScatterType.ts:18](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterType.ts#L18)

스캐터 타입의 고유 식별 이름

***

### shadowCullDistance?

> `optional` **shadowCullDistance?**: `number`

Defined in: [src/landscape/core/scatter/AScatterType.ts:30](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterType.ts#L30)

그림자 패스에서 인스턴스가 컬링되는 최대 거리 (기본값: `50.0`)

***

### targetLayer?

> `optional` **targetLayer?**: `string` \| `number`

Defined in: [src/landscape/core/scatter/AScatterType.ts:54](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterType.ts#L54)

배치 밀도를 참조할 대상 지형 레이어의 이름 또는 인덱스
