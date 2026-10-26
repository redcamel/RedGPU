[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Landscape](../README.md) / Landscape

# Class: Landscape

Defined in: [src/landscape/Landscape.ts:52](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/Landscape.ts#L52)

대규모 지형의 타일 스트리밍, GPU 기반 절두체/HZB 오클루전 컬링, 연속적 LOD 모핑, 멀티 레이어 스플래팅, 식생(`FoliageManager`) 및 잔디(`GrassManager`) 생태계를 통합 관리하는 핵심 클래스입니다.

***

### Example
```typescript
// 4000x4000 월드 크기의 지형 생성 및 씬에 등록
const landscape = new RedGPU.Landscape.Landscape(redGPUContext, 4000);
landscape.globalHeightmapUrl = './assets/heightmap.png';
landscape.heightScale = 600;
scene.landscape = landscape;
```

## See

- [Basic Terrain example](https://redcamel.github.io/RedGPU/examples/3d/landscape/basicTerrain/)
 - [Multi-Layer Splatting example](https://redcamel.github.io/RedGPU/examples/3d/landscape/multiLayerSplatting/)
 - [Tile Streaming example](https://redcamel.github.io/RedGPU/examples/3d/landscape/tileStreaming/)
 - [Procedural Grass example](https://redcamel.github.io/RedGPU/examples/3d/landscape/proceduralGrass/)
 - [Foliage and Impostors example](https://redcamel.github.io/RedGPU/examples/3d/landscape/foliageAndImpostors/)
 - [Landscape and Water example](https://redcamel.github.io/RedGPU/examples/3d/landscape/landscapeAndWater/)
 - [Open World Integration example](https://redcamel.github.io/RedGPU/examples/3d/landscape/openWorldIntegration/)

## Extends

- [`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md)

## Constructors



***

### Constructor

> **new Landscape**(`redGPUContext`, `worldSize?`): `Landscape`

Defined in: [src/landscape/Landscape.ts:109](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/Landscape.ts#L109)

`Landscape` 인스턴스를 생성합니다.

#### Example
```typescript
// 가로/세로 4000 크기의 지형 인스턴스 생성
const landscape = new RedGPU.Landscape.Landscape(redGPUContext, [4000, 4000]);
```

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | `undefined` | `RedGPUContext` 인스턴스 |
| `worldSize?` | `number` \| \[`number`, `number`\] | `2000` | 지형의 전체 월드 크기 (단일 숫자 또는 `[worldSizeX, worldSizeZ]` 튜플, 기본값: `2000`) |

#### Returns

`Landscape`

#### Overrides

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`constructor`](../../BaseObject/classes/RedGPUObject.md#constructor)

## Accessors



***

### baseColor

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **baseColor**(): [`ColorRGBA`](../../Color/classes/ColorRGBA.md)

Defined in: [src/landscape/Landscape.ts:561](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/Landscape.ts#L561)

지형 머티리얼의 기본 베이스 컬러(`ColorRGBA`)를 반환합니다.

##### Returns

[`ColorRGBA`](../../Color/classes/ColorRGBA.md)

`ColorRGBA` 인스턴스

***

***

### castHeightmapShadow

#### Get Signature

> **get** **castHeightmapShadow**(): `boolean`

Defined in: [src/landscape/Landscape.ts:755](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/Landscape.ts#L755)

하이트맵 레이마칭 기반의 지형 자체 그림자(Heightmap Self-Shadow) 활성화 여부를 반환하거나 설정합니다. (기본값: `false`)

##### Returns

`boolean`

하이트맵 자체 그림자 활성화 여부

#### Set Signature

> **set** **castHeightmapShadow**(`value`): `void`

Defined in: [src/landscape/Landscape.ts:759](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/Landscape.ts#L759)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `boolean` |

##### Returns

`void`

***

***

### componentCount

#### Get Signature

> **get** **componentCount**(): \[`number`, `number`\]

Defined in: [src/landscape/Landscape.ts:365](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/Landscape.ts#L365)

지형을 분할하는 X/Z축 타일(컴포넌트) 개수 `[countX, countZ]`를 반환하거나 설정합니다.

##### Returns

\[`number`, `number`\]

컴포넌트 개수 튜플 `[number, number]`

#### Set Signature

> **set** **componentCount**(`value`): `void`

Defined in: [src/landscape/Landscape.ts:369](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/Landscape.ts#L369)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` \| \[`number`, `number`\] |

##### Returns

`void`

***

***

### components

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **components**(): [`LandscapeComponent`](../namespaces/Core/namespaces/Spatial/classes/LandscapeComponent.md)[]

Defined in: [src/landscape/Landscape.ts:489](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/Landscape.ts#L489)

지형 공간 그리드에 속한 모든 `LandscapeComponent` 배열을 반환합니다.

##### Returns

[`LandscapeComponent`](../namespaces/Core/namespaces/Spatial/classes/LandscapeComponent.md)[]

`LandscapeComponent` 배열

***

***

### componentSizeQuads

#### Get Signature

> **get** **componentSizeQuads**(): `number`

Defined in: [src/landscape/Landscape.ts:432](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/Landscape.ts#L432)

일반 타일 컴포넌트의 한 변당 기본 쿼드(Quad) 분할 수를 반환하거나 설정합니다. (`LANDSCAPE_BASE_GRID_SIZE` 규격 값만 허용)

##### Returns

`number`

컴포넌트 한 변당 쿼드 개수

#### Set Signature

> **set** **componentSizeQuads**(`value`): `void`

Defined in: [src/landscape/Landscape.ts:436](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/Landscape.ts#L436)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### debuggerManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **debuggerManager**(): [`LandscapeDebuggerManager`](../namespaces/Debugger/classes/LandscapeDebuggerManager.md)

Defined in: [src/landscape/Landscape.ts:214](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/Landscape.ts#L214)

지형 디버그 시각화 및 와이어프레임 상태를 제어하는 `LandscapeDebuggerManager`를 반환합니다.

##### Returns

[`LandscapeDebuggerManager`](../namespaces/Debugger/classes/LandscapeDebuggerManager.md)

`LandscapeDebuggerManager` 인스턴스

***

***

### foliageManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **foliageManager**(): [`FoliageManager`](../namespaces/Foliage/classes/FoliageManager.md)

Defined in: [src/landscape/Landscape.ts:226](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/Landscape.ts#L226)

지형 위 식생(3D 메시) 산포를 관리하는 `FoliageManager`를 반환합니다.

##### Returns

[`FoliageManager`](../namespaces/Foliage/classes/FoliageManager.md)

`FoliageManager` 인스턴스

***

***

### globalHeightmapUrl

#### Get Signature

> **get** **globalHeightmapUrl**(): `string`

Defined in: [src/landscape/Landscape.ts:601](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/Landscape.ts#L601)

전체 지형에 걸쳐 기본 고도를 제공하는 전역 하이트맵 이미지 URL을 반환하거나 설정합니다.

##### Returns

`string`

전역 하이트맵 URL 문자열

#### Set Signature

> **set** **globalHeightmapUrl**(`val`): `void`

Defined in: [src/landscape/Landscape.ts:605](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/Landscape.ts#L605)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `val` | `string` |

##### Returns

`void`

***

***

### grassManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **grassManager**(): [`GrassManager`](../namespaces/Grass/classes/GrassManager.md)

Defined in: [src/landscape/Landscape.ts:238](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/Landscape.ts#L238)

지형 위 절차적 잔디 및 초목 클럼프를 관리하는 `GrassManager`를 반환합니다.

##### Returns

[`GrassManager`](../namespaces/Grass/classes/GrassManager.md)

`GrassManager` 인스턴스

***

***

### halfWorldSizeX

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **halfWorldSizeX**(): `number`

Defined in: [src/landscape/Landscape.ts:341](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/Landscape.ts#L341)

X축 월드 크기의 절반(`worldSizeX * 0.5`)을 반환합니다.

##### Returns

`number`

X축 월드 크기의 절반

***

***

### halfWorldSizeZ

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **halfWorldSizeZ**(): `number`

Defined in: [src/landscape/Landscape.ts:353](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/Landscape.ts#L353)

Z축 월드 크기의 절반(`worldSizeZ * 0.5`)을 반환합니다.

##### Returns

`number`

Z축 월드 크기의 절반

***

***

### hasValidScatterAtlas

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **hasValidScatterAtlas**(): `boolean`

Defined in: [src/landscape/Landscape.ts:687](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/Landscape.ts#L687)

식생 및 잔디 산포에 필요한 VHT/VBT 아틀라스와 로드된 타일이 모두 유효한 상태인지 여부를 반환합니다.

##### Returns

`boolean`

산포 아틀라스 유효 여부

***

***

### hasValidVbtAtlas

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **hasValidVbtAtlas**(): `boolean`

Defined in: [src/landscape/Landscape.ts:704](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/Landscape.ts#L704)

VBT 베이스 컬러 아틀라스와 로드된 타일이 유효한 상태인지 여부를 반환합니다.

##### Returns

`boolean`

VBT 아틀라스 유효 여부

***

***

### heightmapShadowDistance

#### Get Signature

> **get** **heightmapShadowDistance**(): `number`

Defined in: [src/landscape/Landscape.ts:774](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/Landscape.ts#L774)

하이트맵 자체 그림자 레이마칭의 최대 추적 거리(월드 단위, 최솟값: `10.0`, 기본값: `1000.0`)를 반환하거나 설정합니다.

##### Returns

`number`

하이트맵 그림자 최대 추적 거리

#### Set Signature

> **set** **heightmapShadowDistance**(`value`): `void`

Defined in: [src/landscape/Landscape.ts:778](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/Landscape.ts#L778)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### heightmapShadowSoftness

#### Get Signature

> **get** **heightmapShadowSoftness**(): `number`

Defined in: [src/landscape/Landscape.ts:812](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/Landscape.ts#L812)

하이트맵 자체 그림자 경계의 부드러움(Softness) 계수(최솟값: `0.1`, 기본값: `8.0`)를 반환하거나 설정합니다.

##### Returns

`number`

하이트맵 그림자 부드러움 계수

#### Set Signature

> **set** **heightmapShadowSoftness**(`value`): `void`

Defined in: [src/landscape/Landscape.ts:816](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/Landscape.ts#L816)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### heightmapShadowSteps

#### Get Signature

> **get** **heightmapShadowSteps**(): `number`

Defined in: [src/landscape/Landscape.ts:793](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/Landscape.ts#L793)

하이트맵 자체 그림자 레이마칭의 샘플링 스텝 수(범위: `4 ~ 64`, 기본값: `16`)를 반환하거나 설정합니다.

##### Returns

`number`

하이트맵 그림자 레이마칭 스텝 수

#### Set Signature

> **set** **heightmapShadowSteps**(`value`): `void`

Defined in: [src/landscape/Landscape.ts:797](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/Landscape.ts#L797)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### heightScale

#### Get Signature

> **get** **heightScale**(): `number`

Defined in: [src/landscape/Landscape.ts:409](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/Landscape.ts#L409)

정규화된 하이트맵 값(`0.0 ~ 1.0`)에 곱해지는 최대 고도 스케일(월드 단위, 기본값: `200.0`)을 반환하거나 설정합니다.

##### Returns

`number`

최대 높이 스케일

#### Set Signature

> **set** **heightScale**(`val`): `void`

Defined in: [src/landscape/Landscape.ts:413](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/Landscape.ts#L413)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `val` | `number` |

##### Returns

`void`

***

***

### instanceBuffer

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **instanceBuffer**(): `LandscapeInstanceBuffer`

Defined in: [src/landscape/Landscape.ts:190](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/Landscape.ts#L190)

타일 인스턴스 및 간접 드로우 GPU 버퍼를 관리하는 `LandscapeInstanceBuffer`를 반환합니다.

##### Returns

`LandscapeInstanceBuffer`

`LandscapeInstanceBuffer` 인스턴스

***

***

### invWorldSizeX

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **invWorldSizeX**(): `number`

Defined in: [src/landscape/Landscape.ts:317](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/Landscape.ts#L317)

X축 월드 크기의 역수(`1 / worldSizeX`)를 반환합니다.

##### Returns

`number`

X축 월드 크기의 역수

***

***

### invWorldSizeZ

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **invWorldSizeZ**(): `number`

Defined in: [src/landscape/Landscape.ts:329](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/Landscape.ts#L329)

Z축 월드 크기의 역수(`1 / worldSizeZ`)를 반환합니다.

##### Returns

`number`

Z축 월드 크기의 역수

***

***

### layers

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **layers**(): [`LandscapeLayer`](LandscapeLayer.md)[]

Defined in: [src/landscape/Landscape.ts:573](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/Landscape.ts#L573)

지형 머티리얼에 등록된 `LandscapeLayer` 배열을 반환합니다.

##### Returns

[`LandscapeLayer`](LandscapeLayer.md)[]

`LandscapeLayer` 배열

***

***

### lod0SizeQuads

#### Get Signature

> **get** **lod0SizeQuads**(): `number`

Defined in: [src/landscape/Landscape.ts:460](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/Landscape.ts#L460)

최고 해상도인 LOD 0 타일의 한 변당 쿼드(Quad) 분할 수를 반환하거나 설정합니다.

##### Returns

`number`

LOD 0 타일의 한 변당 쿼드 개수

#### Set Signature

> **set** **lod0SizeQuads**(`value`): `void`

Defined in: [src/landscape/Landscape.ts:464](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/Landscape.ts#L464)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### lodDistancesSq

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **lodDistancesSq**(): `number`[]

Defined in: [src/landscape/Landscape.ts:549](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/Landscape.ts#L549)

각 LOD 레벨 전환 임계 거리의 제곱값 배열을 반환합니다.

##### Returns

`number`[]

LOD 전환 거리 제곱값 배열 (`number[]`)

***

***

### lodMaxLevel

#### Get Signature

> **get** **lodMaxLevel**(): `number`

Defined in: [src/landscape/Landscape.ts:520](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/Landscape.ts#L520)

지형 메시에 사용할 최대 LOD 단계 수(범위: `1 ~ 8`, 기본값: `5`)를 반환하거나 설정합니다.

##### Returns

`number`

최대 LOD 단계 수

#### Set Signature

> **set** **lodMaxLevel**(`value`): `void`

Defined in: [src/landscape/Landscape.ts:524](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/Landscape.ts#L524)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### lodMetric

#### Get Signature

> **get** **lodMetric**(): `"distance"` \| `"screenSize"`

Defined in: [src/landscape/Landscape.ts:501](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/Landscape.ts#L501)

타일 LOD 결정 기준(`'distance'` 또는 `'screenSize'`, 기본값: `'screenSize'`)을 반환하거나 설정합니다.

##### Returns

`"distance"` \| `"screenSize"`

LOD 결정 기준 (`'distance' | 'screenSize'`)

#### Set Signature

> **set** **lodMetric**(`value`): `void`

Defined in: [src/landscape/Landscape.ts:505](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/Landscape.ts#L505)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `"distance"` \| `"screenSize"` |

##### Returns

`void`

***

***

### material

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **material**(): [`LandscapeMaterial`](LandscapeMaterial.md)

Defined in: [src/landscape/Landscape.ts:250](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/Landscape.ts#L250)

지형의 표면 레이어와 텍스처 블렌딩을 담당하는 `LandscapeMaterial`을 반환합니다.

##### Returns

[`LandscapeMaterial`](LandscapeMaterial.md)

`LandscapeMaterial` 인스턴스

***

***

### nearDetailDistance

#### Get Signature

> **get** **nearDetailDistance**(): `number`

Defined in: [src/landscape/Landscape.ts:585](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/Landscape.ts#L585)

근접 고해상도 텍스처 디테일이 적용되는 거리(월드 단위)를 반환하거나 설정합니다.

##### Returns

`number`

근접 디테일 블렌딩 거리

#### Set Signature

> **set** **nearDetailDistance**(`val`): `void`

Defined in: [src/landscape/Landscape.ts:589](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/Landscape.ts#L589)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `val` | `number` |

##### Returns

`void`

***

***

### receiveShadow

#### Get Signature

> **get** **receiveShadow**(): `boolean`

Defined in: [src/landscape/Landscape.ts:736](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/Landscape.ts#L736)

지형이 방향성 광원의 그림자 맵(Shadow Map)을 수신할지 여부를 반환하거나 설정합니다. (기본값: `true`)

##### Returns

`boolean`

그림자 수신 여부

#### Set Signature

> **set** **receiveShadow**(`value`): `void`

Defined in: [src/landscape/Landscape.ts:740](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/Landscape.ts#L740)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `boolean` |

##### Returns

`void`

***

***

### sharedGeometry

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **sharedGeometry**(): `LandscapeSharedGeometry`

Defined in: [src/landscape/Landscape.ts:178](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/Landscape.ts#L178)

지형 타일들이 공유하는 LOD 격자 지오메트리(`LandscapeSharedGeometry`)를 반환합니다.

##### Returns

`LandscapeSharedGeometry`

`LandscapeSharedGeometry` 인스턴스

***

***

### tileLoadedCount

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **tileLoadedCount**(): `number`

Defined in: [src/landscape/Landscape.ts:651](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/Landscape.ts#L651)

현재 로드가 완료되어 활성화된 지형 타일의 개수를 반환합니다.

##### Returns

`number`

로드 완료된 타일 개수

***

***

### tileLoadingRadius

#### Get Signature

> **get** **tileLoadingRadius**(): `number`

Defined in: [src/landscape/Landscape.ts:619](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/Landscape.ts#L619)

카메라 위치를 중심으로 고해상도 타일 하이트맵을 스트리밍 로드할 반경(월드 단위, 기본값: `2500.0`)을 반환하거나 설정합니다.

##### Returns

`number`

타일 스트리밍 로드 반경

#### Set Signature

> **set** **tileLoadingRadius**(`value`): `void`

Defined in: [src/landscape/Landscape.ts:623](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/Landscape.ts#L623)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### tileMaxLoadsPerFrame

#### Get Signature

> **get** **tileMaxLoadsPerFrame**(): `number`

Defined in: [src/landscape/Landscape.ts:635](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/Landscape.ts#L635)

단일 프레임당 동시에 디코딩 및 베이킹을 시작할 최대 타일 개수를 반환하거나 설정합니다.

##### Returns

`number`

프레임당 최대 타일 로드 개수

#### Set Signature

> **set** **tileMaxLoadsPerFrame**(`value`): `void`

Defined in: [src/landscape/Landscape.ts:639](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/Landscape.ts#L639)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### tileSize

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **tileSize**(): \[`number`, `number`\]

Defined in: [src/landscape/Landscape.ts:397](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/Landscape.ts#L397)

단일 타일(컴포넌트)의 월드 크기 `[tileSizeX, tileSizeZ]`를 반환합니다.

##### Returns

\[`number`, `number`\]

타일 크기 튜플 `[number, number]`

***

***

### tileUrlResolver

#### Get Signature

> **get** **tileUrlResolver**(): [`LandscapeTileUrlResolver`](../namespaces/Core/namespaces/Spatial/type-aliases/LandscapeTileUrlResolver.md)

Defined in: [src/landscape/Landscape.ts:720](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/Landscape.ts#L720)

타일 행/열 인덱스(`row`, `col`)를 기반으로 개별 타일 하이트맵 이미지 URL을 반환하는 리졸버 함수를 반환하거나 설정합니다.

##### Returns

[`LandscapeTileUrlResolver`](../namespaces/Core/namespaces/Spatial/type-aliases/LandscapeTileUrlResolver.md)

타일 URL 리졸버 함수 또는 `null`

#### Set Signature

> **set** **tileUrlResolver**(`resolver`): `void`

Defined in: [src/landscape/Landscape.ts:724](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/Landscape.ts#L724)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `resolver` | [`LandscapeTileUrlResolver`](../namespaces/Core/namespaces/Spatial/type-aliases/LandscapeTileUrlResolver.md) |

##### Returns

`void`

***

***

### vbtTextureView

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **vbtTextureView**(): `GPUTextureView`

Defined in: [src/landscape/Landscape.ts:675](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/Landscape.ts#L675)

가상 블렌드 텍스처(VBT) 베이스 컬러 아틀라스의 `GPUTextureView`를 반환합니다.

##### Returns

`GPUTextureView`

VBT 베이스 컬러 아틀라스 `GPUTextureView` 또는 `null`

***

***

### vertexShaderModule

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **vertexShaderModule**(): `GPUShaderModule`

Defined in: [src/landscape/Landscape.ts:202](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/Landscape.ts#L202)

지형 렌더링에 사용되는 정점 셰이더 모듈(`GPUShaderModule`)을 반환합니다.

##### Returns

`GPUShaderModule`

`GPUShaderModule` 인스턴스

***

***

### vhtTextureView

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **vhtTextureView**(): `GPUTextureView`

Defined in: [src/landscape/Landscape.ts:663](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/Landscape.ts#L663)

가상 하이트 텍스처(VHT) 아틀라스의 `GPUTextureView`를 반환합니다.

##### Returns

`GPUTextureView`

VHT 아틀라스 `GPUTextureView` 또는 `null`

***

***

### worldSize

#### Get Signature

> **get** **worldSize**(): \[`number`, `number`\]

Defined in: [src/landscape/Landscape.ts:262](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/Landscape.ts#L262)

지형의 전체 월드 크기 `[worldSizeX, worldSizeZ]`를 반환하거나 설정합니다.

##### Returns

\[`number`, `number`\]

월드 크기 튜플 `[number, number]`

#### Set Signature

> **set** **worldSize**(`value`): `void`

Defined in: [src/landscape/Landscape.ts:266](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/Landscape.ts#L266)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` \| \[`number`, `number`\] |

##### Returns

`void`

***

***

### worldSizeX

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **worldSizeX**(): `number`

Defined in: [src/landscape/Landscape.ts:293](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/Landscape.ts#L293)

지형의 X축 방향 전체 월드 크기를 반환합니다.

##### Returns

`number`

X축 월드 크기

***

***

### worldSizeZ

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **worldSizeZ**(): `number`

Defined in: [src/landscape/Landscape.ts:305](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/Landscape.ts#L305)

지형의 Z축 방향 전체 월드 크기를 반환합니다.

##### Returns

`number`

Z축 월드 크기

## Methods



***

### addLayer()

> **addLayer**(`options`): [`LandscapeLayer`](LandscapeLayer.md)

Defined in: [src/landscape/Landscape.ts:889](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/Landscape.ts#L889)

지형 머티리얼에 새로운 스플래팅 레이어(`LandscapeLayer`)를 생성하여 추가하고 반환합니다. PBR 재질 레이어는 최대 8개까지 등록할 수 있으며, 가중치 맵(`weightTexture`)은 지형 전체에서 단일 RGBA 텍스처 1장(4채널: `'R' | 'G' | 'B' | 'A'`)을 공유하여 사용합니다.

#### Example
```typescript
// 지형에 잔디 스플래팅 레이어 추가
const grassLayer = landscape.addLayer({
    name: 'Grass',
    baseColorTexture: './assets/grass_diff.jpg',
    normalTexture: './assets/grass_norm.jpg',
    uvScale: [25, 25]
});
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options` | [`LandscapeLayerOptions`](../interfaces/LandscapeLayerOptions.md) | 생성할 레이어의 설정 옵션 (`LandscapeLayerOptions`) |

#### Returns

[`LandscapeLayer`](LandscapeLayer.md)

생성되어 추가된 `LandscapeLayer` 인스턴스

***

***

### clearLayers()

> **clearLayers**(): `void`

Defined in: [src/landscape/Landscape.ts:920](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/Landscape.ts#L920)

지형 머티리얼에 등록된 모든 스플래팅 레이어를 제거합니다.

#### Returns

`void`

***

***

### destroy()

> **destroy**(): `void`

Defined in: [src/landscape/Landscape.ts:1052](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/Landscape.ts#L1052)

지형에 속한 모든 하위 매니저(식생, 잔디, 타일 스트리머, 컬러, 렌더러, 지오메트리 등)와 GPU 리소스를 해제합니다.

#### Returns

`void`

***

***

### getHeightAt()

> **getHeightAt**(`x`, `z`): `number`

Defined in: [src/landscape/Landscape.ts:844](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/Landscape.ts#L844)

지정된 월드 X, Z 좌표에서의 지형 표면 높이(Y 좌표, 월드 단위)를 CPU 하이트맵 캐시로부터 계산하여 반환합니다.

#### Example
```typescript
// 월드 (120, -45) 위치의 지형 고도 조회
const groundY = landscape.getHeightAt(120, -45);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `x` | `number` | 월드 X 좌표 |
| `z` | `number` | 월드 Z 좌표 |

#### Returns

`number`

보간된 지형 표면 높이 (월드 단위)

***

***

### getLayer()

> **getLayer**(`name`): [`LandscapeLayer`](LandscapeLayer.md)

Defined in: [src/landscape/Landscape.ts:935](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/Landscape.ts#L935)

지정된 이름을 가진 `LandscapeLayer`를 찾아 반환합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `name` | `string` | 조회할 레이어 이름 |

#### Returns

[`LandscapeLayer`](LandscapeLayer.md)

일치하는 `LandscapeLayer` 인스턴스 또는 `undefined`

***

***

### isTileLoaded()

> **isTileLoaded**(`row`, `col`): `boolean`

Defined in: [src/landscape/Landscape.ts:862](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/Landscape.ts#L862)

지정된 행(`row`)과 열(`col`) 인덱스의 지형 타일이 로드 완료되었는지 여부를 반환합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `row` | `number` | 타일 행(Z축) 인덱스 |
| `col` | `number` | 타일 열(X축) 인덱스 |

#### Returns

`boolean`

타일 로드 완료 여부

***

***

### removeLayer()

> **removeLayer**(`layer`): `boolean`

Defined in: [src/landscape/Landscape.ts:911](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/Landscape.ts#L911)

지정된 `LandscapeLayer` 인스턴스 또는 레이어 이름을 지형 머티리얼에서 제거합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `layer` | `string` \| [`LandscapeLayer`](LandscapeLayer.md) | 제거할 `LandscapeLayer` 인스턴스 또는 레이어 이름 |

#### Returns

`boolean`

제거 성공 여부

***

***

### render()

> **render**(`view`, `passEncoder?`): `void`

Defined in: [src/landscape/Landscape.ts:1044](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/Landscape.ts#L1044)

내부 `LandscapeRenderer`를 통해 지형 메시를 현재 렌더 패스에 렌더링합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | `any` | 렌더링 뷰 또는 `RenderViewStateData` 객체 |
| `passEncoder?` | `GPURenderPassEncoder` | 사용할 `GPURenderPassEncoder` (생략 시 `view`에서 추출) |

#### Returns

`void`

***

***

### update()

> **update**(`renderViewStateData`): `void`

Defined in: [src/landscape/Landscape.ts:948](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/Landscape.ts#L948)

매 프레임 카메라 뷰 상태를 기반으로 타일 스트리밍, GPU 컬링, 식생(`FoliageManager`) 및 잔디(`GrassManager`) 컴퓨트 패스를 갱신합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `renderViewStateData` | [`RenderViewStateData`](../../Display/namespaces/CoreView/classes/RenderViewStateData.md) | 현재 프레임의 뷰 및 절두체 상태 데이터 (`RenderViewStateData`) |

#### Returns

`void`

***

## 상속받은 속성

<details>
<summary>상속받은 속성 보기 (클릭하여 확장)</summary>

### antialiasingManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **antialiasingManager**(): [`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:80](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L80)

안티앨리어싱 설정을 관리하는 `AntialiasingManager` 인스턴스를 반환합니다.

##### Returns

[`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

`AntialiasingManager` 인스턴스

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`antialiasingManager`](../../BaseObject/classes/RedGPUObject.md#antialiasingmanager)

***

***

### commandEncoderManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **commandEncoderManager**(): [`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

Defined in: [src/base/RedGPUObject.ts:92](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L92)

WebGPU 커맨드 인코딩을 관리하는 `CommandEncoderManager` 인스턴스를 반환합니다.

##### Returns

[`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

`CommandEncoderManager` 인스턴스

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`commandEncoderManager`](../../BaseObject/classes/RedGPUObject.md#commandencodermanager)

***

***

### gpuDevice

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/base/RedGPUObject.ts:56](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L56)

컨텍스트에 할당된 논리적 WebGPU 디바이스(`GPUDevice`)를 반환합니다.

##### Returns

`GPUDevice`

`GPUDevice` 인스턴스

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`gpuDevice`](../../BaseObject/classes/RedGPUObject.md#gpudevice)

***

***

### instanceId

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **instanceId**(): `number`

Defined in: [src/base/BaseObject.ts:36](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/BaseObject.ts#L36)

클래스별로 순차 부여되는 고유 인스턴스 번호를 반환합니다.

##### Returns

`number`

클래스별 고유 인스턴스 번호

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`instanceId`](../../BaseObject/classes/RedGPUObject.md#instanceid)

***

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/base/BaseObject.ts:63](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/BaseObject.ts#L63)

객체의 이름을 반환하거나 설정합니다. 미설정 시 기본 이름(`ClassName Instance N`)을 반환합니다.

##### Returns

`string`

객체 이름 문자열

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/base/BaseObject.ts:70](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/BaseObject.ts#L70)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

##### Returns

`void`

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`name`](../../BaseObject/classes/RedGPUObject.md#name)

***

***

### redGPUContext

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **redGPUContext**(): [`RedGPUContext`](../../Context/classes/RedGPUContext.md)

Defined in: [src/base/RedGPUObject.ts:44](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L44)

바인딩된 `RedGPUContext` 인스턴스를 반환합니다.

##### Returns

[`RedGPUContext`](../../Context/classes/RedGPUContext.md)

`RedGPUContext` 인스턴스

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`redGPUContext`](../../BaseObject/classes/RedGPUObject.md#redgpucontext)

***

***

### resourceManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **resourceManager**(): [`ResourceManager`](../../Resource/namespaces/Core/classes/ResourceManager.md)

Defined in: [src/base/RedGPUObject.ts:68](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L68)

전역 GPU 리소스를 관리하는 `ResourceManager` 인스턴스를 반환합니다.

##### Returns

[`ResourceManager`](../../Resource/namespaces/Core/classes/ResourceManager.md)

`ResourceManager` 인스턴스

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`resourceManager`](../../BaseObject/classes/RedGPUObject.md#resourcemanager)

***

***

### uuid

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **uuid**(): `string`

Defined in: [src/base/BaseObject.ts:48](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/BaseObject.ts#L48)

객체의 고유 식별자(UUID)를 반환합니다.

##### Returns

`string`

객체의 UUID 문자열

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`uuid`](../../BaseObject/classes/RedGPUObject.md#uuid)

***

</details>
