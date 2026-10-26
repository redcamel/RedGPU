[**RedGPU API v4.4.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [Landscape](../../../../../README.md) / [Core](../../../README.md) / [Spatial](../README.md) / LandscapeComponent

# Class: LandscapeComponent

Defined in: [src/landscape/core/spatial/LandscapeComponent.ts:12](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/spatial/LandscapeComponent.ts#L12)

지형(Landscape) 공간 그리드를 구성하는 개별 타일 컴포넌트 데이터를 관리하는 클래스입니다.

::: warning
이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
:::

## Constructors

### Constructor

> **new LandscapeComponent**(`worldX?`, `worldZ?`, `componentX?`, `componentZ?`, `minHeightNorm?`, `maxHeightNorm?`): `LandscapeComponent`

Defined in: [src/landscape/core/spatial/LandscapeComponent.ts:44](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/spatial/LandscapeComponent.ts#L44)

`LandscapeComponent` 인스턴스를 생성합니다.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `worldX?` | `number` | `0` | 타일 중심의 월드 X 좌표 |
| `worldZ?` | `number` | `0` | 타일 중심의 월드 Z 좌표 |
| `componentX?` | `number` | `0` | 그리드 내 타일의 열(Column) 인덱스 |
| `componentZ?` | `number` | `0` | 그리드 내 타일의 행(Row) 인덱스 |
| `minHeightNorm?` | `number` | `0.0` | 정규화된 최소 높이값 (`0.0` ~ `1.0`) |
| `maxHeightNorm?` | `number` | `1.0` | 정규화된 최대 높이값 (`0.0` ~ `1.0`) |

#### Returns

`LandscapeComponent`

## Accessors

### componentX

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **componentX**(): `number`

Defined in: [src/landscape/core/spatial/LandscapeComponent.ts:105](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/spatial/LandscapeComponent.ts#L105)

그리드 내 타일의 열(Column) 인덱스를 반환합니다.

##### Returns

`number`

타일 열(X) 인덱스

***

### componentZ

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **componentZ**(): `number`

Defined in: [src/landscape/core/spatial/LandscapeComponent.ts:117](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/spatial/LandscapeComponent.ts#L117)

그리드 내 타일의 행(Row) 인덱스를 반환합니다.

##### Returns

`number`

타일 행(Z) 인덱스

***

### key

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **key**(): `string`

Defined in: [src/landscape/core/spatial/LandscapeComponent.ts:69](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/spatial/LandscapeComponent.ts#L69)

타일 컴포넌트를 식별하는 고유 키(`{componentZ}_{componentX}`)를 반환합니다.

##### Returns

`string`

타일 고유 식별 키 문자열

***

### maxHeightNorm

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **maxHeightNorm**(): `number`

Defined in: [src/landscape/core/spatial/LandscapeComponent.ts:141](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/spatial/LandscapeComponent.ts#L141)

타일의 정규화된 최대 높이값을 반환합니다.

##### Returns

`number`

정규화된 최대 높이값 (`0.0` ~ `1.0`)

***

### minHeightNorm

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **minHeightNorm**(): `number`

Defined in: [src/landscape/core/spatial/LandscapeComponent.ts:129](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/spatial/LandscapeComponent.ts#L129)

타일의 정규화된 최소 높이값을 반환합니다.

##### Returns

`number`

정규화된 최소 높이값 (`0.0` ~ `1.0`)

***

### worldX

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **worldX**(): `number`

Defined in: [src/landscape/core/spatial/LandscapeComponent.ts:81](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/spatial/LandscapeComponent.ts#L81)

타일 중심의 월드 X 좌표를 반환합니다.

##### Returns

`number`

타일 중심 월드 X 좌표

***

### worldZ

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **worldZ**(): `number`

Defined in: [src/landscape/core/spatial/LandscapeComponent.ts:93](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/spatial/LandscapeComponent.ts#L93)

타일 중심의 월드 Z 좌표를 반환합니다.

##### Returns

`number`

타일 중심 월드 Z 좌표

## Methods

### setHeightBounds()

> **setHeightBounds**(`minHeightNorm`, `maxHeightNorm`): `void`

Defined in: [src/landscape/core/spatial/LandscapeComponent.ts:156](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/spatial/LandscapeComponent.ts#L156)

타일의 정규화된 최소 및 최대 높이 경계값을 설정합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `minHeightNorm` | `number` | 정규화된 최소 높이값 |
| `maxHeightNorm` | `number` | 정규화된 최대 높이값 |

#### Returns

`void`
