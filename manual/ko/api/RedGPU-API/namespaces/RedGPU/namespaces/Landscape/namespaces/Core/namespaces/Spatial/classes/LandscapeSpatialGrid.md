[**RedGPU API v4.4.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [Landscape](../../../../../README.md) / [Core](../../../README.md) / [Spatial](../README.md) / LandscapeSpatialGrid

# Class: LandscapeSpatialGrid

Defined in: [src/landscape/core/spatial/LandscapeSpatialGrid.ts:14](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/spatial/LandscapeSpatialGrid.ts#L14)

지형(Landscape)의 전체 월드 영역을 2D 타일 그리드로 분할하고 공간 질의(Spatial Query)를 처리하는 클래스입니다.

::: warning
이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
:::

## Constructors

### Constructor

> **new LandscapeSpatialGrid**(`tileCountX`, `tileCountZ`, `tileSizeX`, `tileSizeZ`): `LandscapeSpatialGrid`

Defined in: [src/landscape/core/spatial/LandscapeSpatialGrid.ts:47](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/spatial/LandscapeSpatialGrid.ts#L47)

`LandscapeSpatialGrid` 인스턴스를 생성합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `tileCountX` | `number` | 가로(X) 방향 타일 개수 |
| `tileCountZ` | `number` | 세로(Z) 방향 타일 개수 |
| `tileSizeX` | `number` | 단일 타일의 가로(X) 월드 크기 |
| `tileSizeZ` | `number` | 단일 타일의 세로(Z) 월드 크기 |

#### Returns

`LandscapeSpatialGrid`

## Accessors

### componentCount

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **componentCount**(): \[`number`, `number`\]

Defined in: [src/landscape/core/spatial/LandscapeSpatialGrid.ts:77](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/spatial/LandscapeSpatialGrid.ts#L77)

타일 컴포넌트 개수 튜플(`[tileCountX, tileCountZ]`)을 반환합니다.

##### Returns

\[`number`, `number`\]

타일 컴포넌트 개수 튜플 (`[number, number]`)

***

### flatCells

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **flatCells**(): [`LandscapeComponent`](LandscapeComponent.md)[]

Defined in: [src/landscape/core/spatial/LandscapeSpatialGrid.ts:149](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/spatial/LandscapeSpatialGrid.ts#L149)

그리드 내 모든 타일 컴포넌트의 1차원 배열(`Array<LandscapeComponent>`)을 반환합니다.

##### Returns

[`LandscapeComponent`](LandscapeComponent.md)[]

타일 컴포넌트 1차원 배열 (`Array<LandscapeComponent>`)

***

### halfWorldSizeX

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **halfWorldSizeX**(): `number`

Defined in: [src/landscape/core/spatial/LandscapeSpatialGrid.ts:209](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/spatial/LandscapeSpatialGrid.ts#L209)

전체 지형 가로 월드 크기의 절반(`worldSizeX / 2`)을 반환합니다.

##### Returns

`number`

전체 지형 가로 월드 크기의 절반

***

### halfWorldSizeZ

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **halfWorldSizeZ**(): `number`

Defined in: [src/landscape/core/spatial/LandscapeSpatialGrid.ts:221](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/spatial/LandscapeSpatialGrid.ts#L221)

전체 지형 세로 월드 크기의 절반(`worldSizeZ / 2`)을 반환합니다.

##### Returns

`number`

전체 지형 세로 월드 크기의 절반

***

### invWorldSizeX

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **invWorldSizeX**(): `number`

Defined in: [src/landscape/core/spatial/LandscapeSpatialGrid.ts:125](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/spatial/LandscapeSpatialGrid.ts#L125)

전체 지형 가로 월드 크기의 역수(`1 / worldSizeX`)를 반환합니다.

##### Returns

`number`

가로 월드 크기의 역수

***

### invWorldSizeZ

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **invWorldSizeZ**(): `number`

Defined in: [src/landscape/core/spatial/LandscapeSpatialGrid.ts:137](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/spatial/LandscapeSpatialGrid.ts#L137)

전체 지형 세로 월드 크기의 역수(`1 / worldSizeZ`)를 반환합니다.

##### Returns

`number`

세로 월드 크기의 역수

***

### tileCountX

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **tileCountX**(): `number`

Defined in: [src/landscape/core/spatial/LandscapeSpatialGrid.ts:161](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/spatial/LandscapeSpatialGrid.ts#L161)

가로(X) 방향 타일 개수를 반환합니다.

##### Returns

`number`

가로(X) 방향 타일 개수

***

### tileCountZ

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **tileCountZ**(): `number`

Defined in: [src/landscape/core/spatial/LandscapeSpatialGrid.ts:173](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/spatial/LandscapeSpatialGrid.ts#L173)

세로(Z) 방향 타일 개수를 반환합니다.

##### Returns

`number`

세로(Z) 방향 타일 개수

***

### tileSize

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **tileSize**(): \[`number`, `number`\]

Defined in: [src/landscape/core/spatial/LandscapeSpatialGrid.ts:89](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/spatial/LandscapeSpatialGrid.ts#L89)

단일 타일의 월드 크기 튜플(`[tileSizeX, tileSizeZ]`)을 반환합니다.

##### Returns

\[`number`, `number`\]

단일 타일 월드 크기 튜플 (`[number, number]`)

***

### tileSizeX

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **tileSizeX**(): `number`

Defined in: [src/landscape/core/spatial/LandscapeSpatialGrid.ts:185](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/spatial/LandscapeSpatialGrid.ts#L185)

단일 타일의 가로(X) 월드 크기를 반환합니다.

##### Returns

`number`

단일 타일 가로(X) 월드 크기

***

### tileSizeZ

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **tileSizeZ**(): `number`

Defined in: [src/landscape/core/spatial/LandscapeSpatialGrid.ts:197](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/spatial/LandscapeSpatialGrid.ts#L197)

단일 타일의 세로(Z) 월드 크기를 반환합니다.

##### Returns

`number`

단일 타일 세로(Z) 월드 크기

***

### worldSize

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **worldSize**(): \[`number`, `number`\]

Defined in: [src/landscape/core/spatial/LandscapeSpatialGrid.ts:65](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/spatial/LandscapeSpatialGrid.ts#L65)

전체 지형의 월드 크기 튜플(`[worldSizeX, worldSizeZ]`)을 반환합니다.

##### Returns

\[`number`, `number`\]

전체 지형 월드 크기 튜플 (`[number, number]`)

***

### worldSizeX

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **worldSizeX**(): `number`

Defined in: [src/landscape/core/spatial/LandscapeSpatialGrid.ts:101](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/spatial/LandscapeSpatialGrid.ts#L101)

전체 지형의 가로(X) 월드 크기를 반환합니다.

##### Returns

`number`

전체 지형 가로(X) 월드 크기

***

### worldSizeZ

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **worldSizeZ**(): `number`

Defined in: [src/landscape/core/spatial/LandscapeSpatialGrid.ts:113](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/spatial/LandscapeSpatialGrid.ts#L113)

전체 지형의 세로(Z) 월드 크기를 반환합니다.

##### Returns

`number`

전체 지형 세로(Z) 월드 크기

## Methods

### getActiveComponentsInRadius()

> **getActiveComponentsInRadius**(`camX`, `camZ`, `tileLoadingRadius`, `outArray`): `number`

Defined in: [src/landscape/core/spatial/LandscapeSpatialGrid.ts:357](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/spatial/LandscapeSpatialGrid.ts#L357)

주어진 카메라 월드 좌표 반경 내에 포함되는 활성 타일 컴포넌트들을 검색하여 출력 배열에 담습니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `camX` | `number` | 기준 중심(카메라) 월드 X 좌표 |
| `camZ` | `number` | 기준 중심(카메라) 월드 Z 좌표 |
| `tileLoadingRadius` | `number` | 검색 반경 (월드 단위) |
| `outArray` | [`LandscapeComponent`](LandscapeComponent.md)[] | 검색된 `LandscapeComponent` 목록이 채워질 재사용 배열 (`Array<LandscapeComponent>`) |

#### Returns

`number`

반경 내에서 검색된 타일 컴포넌트의 개수

***

### getCellCoordinates()

> **getCellCoordinates**(`x`, `z`, `outBuffer`): `void`

Defined in: [src/landscape/core/spatial/LandscapeSpatialGrid.ts:329](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/spatial/LandscapeSpatialGrid.ts#L329)

월드 `(x, z)` 좌표를 그리드 셀 좌표(`[col, row]`)로 변환하여 출력 버퍼에 기록합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `x` | `number` | 월드 X 좌표 |
| `z` | `number` | 월드 Z 좌표 |
| `outBuffer` | `Int32Array` | `[col, row]` 결과를 저장할 길이가 2 이상인 `Int32Array` 버퍼 |

#### Returns

`void`

***

### getComponent()

> **getComponent**(`row`, `col`): [`LandscapeComponent`](LandscapeComponent.md)

Defined in: [src/landscape/core/spatial/LandscapeSpatialGrid.ts:310](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/spatial/LandscapeSpatialGrid.ts#L310)

지정된 행(Row)과 열(Column) 인덱스에 위치한 타일 컴포넌트를 반환합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `row` | `number` | 행(Z) 인덱스 |
| `col` | `number` | 열(X) 인덱스 |

#### Returns

[`LandscapeComponent`](LandscapeComponent.md)

해당 위치의 `LandscapeComponent` 또는 범위를 벗어난 경우 `null`

***

### rebuildTiles()

> **rebuildTiles**(`onTileCreated?`): `void`

Defined in: [src/landscape/core/spatial/LandscapeSpatialGrid.ts:261](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/spatial/LandscapeSpatialGrid.ts#L261)

현재 그리드 설정에 맞춰 모든 `LandscapeComponent` 타일 인스턴스를 재생성합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `onTileCreated?` | (`comp`, `index`) => `void` | 각 타일 컴포넌트가 생성될 때 호출되는 콜백 함수 (선택) |

#### Returns

`void`

***

### setConfig()

> **setConfig**(`tileCountX`, `tileCountZ`, `tileSizeX`, `tileSizeZ`): `void`

Defined in: [src/landscape/core/spatial/LandscapeSpatialGrid.ts:242](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/spatial/LandscapeSpatialGrid.ts#L242)

그리드의 타일 개수 및 타일 크기 설정을 변경하고 기존 셀 목록을 초기화합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `tileCountX` | `number` | 가로(X) 방향 타일 개수 |
| `tileCountZ` | `number` | 세로(Z) 방향 타일 개수 |
| `tileSizeX` | `number` | 단일 타일의 가로(X) 월드 크기 |
| `tileSizeZ` | `number` | 단일 타일의 세로(Z) 월드 크기 |

#### Returns

`void`
