[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Resource](../README.md) / VoronoiTexture

# Class: VoronoiTexture

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:64](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L64)

**`Experimental`**

컴퓨트 셰이더로 Voronoi(셀룰러) 노이즈 패턴을 생성하는 텍스처입니다.

***

### Example
```typescript
const texture = new RedGPU.Resource.VoronoiTexture(redGPUContext);
texture.setCrackPattern();
```

## See

[Voronoi noise texture example](https://redcamel.github.io/RedGPU/examples/3d/noiseTexture/voronoi/basic/)

## Extends

- [`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md)

## Constructors



***

### Constructor

> **new VoronoiTexture**(`redGPUContext`, `width?`, `height?`, `define?`, `useMipmap?`): `VoronoiTexture`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:101](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L101)

**`Experimental`**

VoronoiTexture 인스턴스를 생성합니다.

#### Example
```typescript
const texture = new RedGPU.Resource.VoronoiTexture(redGPUContext, 512, 512);
```

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | `undefined` | RedGPUContext 인스턴스 |
| `width?` | `number` | `1024` | 텍스처 너비 (기본값: 1024) |
| `height?` | `number` | `1024` | 텍스처 높이 (기본값: 1024) |
| `define?` | [`NoiseDefine`](../namespaces/CoreNoiseTexture/interfaces/NoiseDefine.md) | `undefined` | 셰이더 로직을 확장하는 노이즈 정의 객체 (선택) |
| `useMipmap?` | `boolean` | `true` | 밉맵 사용 여부 (기본값: true) |

#### Returns

`VoronoiTexture`

#### Overrides

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`constructor`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#constructor)

## Properties



## Accessors



***

### cellIdColorIntensity

#### Get Signature

> **get** **cellIdColorIntensity**(): `number`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:324](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L324)

**`Experimental`**

`CELL_ID_COLOR` 출력 시 적용되는 셀 색상 강도입니다. (양수, 기본값: 1.0)

##### Returns

`number`

색상 강도

#### Set Signature

> **set** **cellIdColorIntensity**(`value`): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:328](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L328)

**`Experimental`**

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### distanceScale

#### Get Signature

> **get** **distanceScale**(): `number`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:169](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L169)

**`Experimental`**

출력 거리 값에 곱해지는 스케일입니다. (양수, 기본값: 1.0)

##### Returns

`number`

거리 스케일 값

#### Set Signature

> **set** **distanceScale**(`value`): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:173](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L173)

**`Experimental`**

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### distanceType

#### Get Signature

> **get** **distanceType**(): `number`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:261](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L261)

**`Experimental`**

거리 계산 방식입니다. `VORONOI_DISTANCE_TYPE` 값만 허용됩니다.

##### Throws

허용되지 않은 값을 설정하면 에러가 발생합니다.

##### Returns

`number`

거리 계산 방식 값

#### Set Signature

> **set** **distanceType**(`value`): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:265](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L265)

**`Experimental`**

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### frequency

#### Get Signature

> **get** **frequency**(): `number`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:151](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L151)

**`Experimental`**

셀 밀도를 결정하는 주파수입니다. (양수, 기본값: 8.0)

##### Returns

`number`

주파수 값

#### Set Signature

> **set** **frequency**(`value`): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:155](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L155)

**`Experimental`**

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### jitter

#### Get Signature

> **get** **jitter**(): `number`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:306](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L306)

**`Experimental`**

셀 중심점의 무작위 분포 정도입니다. (0~1, 0이면 완전한 격자, 기본값: 1.0)

##### Returns

`number`

지터 값

#### Set Signature

> **set** **jitter**(`value`): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:310](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L310)

**`Experimental`**

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### lacunarity

#### Get Signature

> **get** **lacunarity**(): `number`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:223](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L223)

**`Experimental`**

옥타브마다 적용되는 주파수 증가 비율입니다. (양수, 기본값: 2.0)

##### Returns

`number`

간극성 값

#### Set Signature

> **set** **lacunarity**(`value`): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:227](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L227)

**`Experimental`**

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### octaves

#### Get Signature

> **get** **octaves**(): `number`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:187](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L187)

**`Experimental`**

합성할 노이즈 레이어(옥타브) 수입니다. (정수 1~8, 기본값: 1)

##### Returns

`number`

옥타브 수

#### Set Signature

> **set** **octaves**(`value`): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:191](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L191)

**`Experimental`**

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### outputType

#### Get Signature

> **get** **outputType**(): `number`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:285](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L285)

**`Experimental`**

출력 타입입니다. `VORONOI_OUTPUT_TYPE` 값만 허용됩니다.

##### Throws

허용되지 않은 값을 설정하면 에러가 발생합니다.

##### Returns

`number`

출력 타입 값

#### Set Signature

> **set** **outputType**(`value`): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:289](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L289)

**`Experimental`**

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### persistence

#### Get Signature

> **get** **persistence**(): `number`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:205](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L205)

**`Experimental`**

옥타브마다 적용되는 진폭 감소 비율입니다. (0~1, 기본값: 0.5)

##### Returns

`number`

지속성 값

#### Set Signature

> **set** **persistence**(`value`): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:209](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L209)

**`Experimental`**

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### seed

#### Get Signature

> **get** **seed**(): `number`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:241](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L241)

**`Experimental`**

노이즈 패턴의 시드 값입니다.

##### Returns

`number`

시드 값

#### Set Signature

> **set** **seed**(`value`): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:245](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L245)

**`Experimental`**

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

## Methods



***

### applySettings()

> **applySettings**(`settings`): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:531](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L531)

**`Experimental`**

전달된 속성만 골라 일괄 적용합니다. 각 값은 해당 setter의 유효성 검사를 거칩니다.

#### Example
```typescript
texture.applySettings({frequency: 4.0, jitter: 0.5});
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `settings` | `Partial`\<[`VoronoiSettings`](../interfaces/VoronoiSettings.md)\> | 적용할 설정 (`Partial<VoronoiSettings>`) |

#### Returns

`void`

***

***

### getDistanceTypeName()

> **getDistanceTypeName**(): `string`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:552](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L552)

**`Experimental`**

현재 거리 계산 방식의 이름을 반환합니다.

#### Returns

`string`

거리 타입 이름 (알 수 없으면 'Unknown')

***

***

### getOutputTypeName()

> **getOutputTypeName**(): `string`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:569](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L569)

**`Experimental`**

현재 출력 타입의 이름을 반환합니다.

#### Returns

`string`

출력 타입 이름 (알 수 없으면 'Unknown')

***

***

### getSettings()

> **getSettings**(): [`VoronoiSettings`](../interfaces/VoronoiSettings.md)

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:503](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L503)

**`Experimental`**

현재 설정 값을 새 객체로 반환합니다.

#### Returns

[`VoronoiSettings`](../interfaces/VoronoiSettings.md)

현재 설정 객체

***

***

### randomizeSeed()

> **randomizeSeed**(): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:338](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L338)

**`Experimental`**

시드를 0~1000 범위의 무작위 값으로 변경합니다.

#### Returns

`void`

***

***

### setBiomeMapPattern()

> **setBiomeMapPattern**(): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:488](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L488)

**`Experimental`**

바이옴 맵 프리셋을 적용합니다. (Cell ID, Euclidean, jitter 0.8, frequency 4.0)

#### Returns

`void`

***

***

### setCellIdColorOutput()

> **setCellIdColorOutput**(): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:410](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L410)

**`Experimental`**

출력 타입을 셀 ID 색상(셀별 고유 RGB 색상)으로 설정합니다.

#### Returns

`void`

***

***

### setCellIdOutput()

> **setCellIdOutput**(): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:402](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L402)

**`Experimental`**

출력 타입을 셀 ID(셀별 고유 그레이스케일 값)로 설정합니다.

#### Returns

`void`

***

***

### setCellularPattern()

> **setCellularPattern**(): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:418](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L418)

**`Experimental`**

셀룰러 패턴 프리셋을 적용합니다. (F1, Euclidean, jitter 1.0)

#### Returns

`void`

***

***

### setChebyshevDistance()

> **setChebyshevDistance**(): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:362](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L362)

**`Experimental`**

거리 계산 방식을 체비셰프(Chebyshev)로 설정합니다.

#### Returns

`void`

***

***

### setCrackPattern()

> **setCrackPattern**(): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:386](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L386)

**`Experimental`**

출력 타입을 F2 - F1(셀 경계 강조, 크랙 패턴)으로 설정합니다.

#### Returns

`void`

***

***

### setCrystalPattern()

> **setCrystalPattern**(): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:456](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L456)

**`Experimental`**

크리스탈 무늬 프리셋을 적용합니다. (F2 - F1, Chebyshev, jitter 0.9)

#### Returns

`void`

***

***

### setEuclideanDistance()

> **setEuclideanDistance**(): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:346](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L346)

**`Experimental`**

거리 계산 방식을 유클리드(Euclidean)로 설정합니다.

#### Returns

`void`

***

***

### setF1Output()

> **setF1Output**(): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:370](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L370)

**`Experimental`**

출력 타입을 F1(가장 가까운 점까지의 거리)로 설정합니다.

#### Returns

`void`

***

***

### setF2Output()

> **setF2Output**(): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:378](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L378)

**`Experimental`**

출력 타입을 F2(두 번째로 가까운 점까지의 거리)로 설정합니다.

#### Returns

`void`

***

***

### setGridPattern()

> **setGridPattern**(): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:447](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L447)

**`Experimental`**

격자 패턴 프리셋을 적용합니다. (jitter 0.0, Euclidean)

#### Returns

`void`

***

***

### setManhattanDistance()

> **setManhattanDistance**(): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:354](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L354)

**`Experimental`**

거리 계산 방식을 맨해튼(Manhattan)으로 설정합니다.

#### Returns

`void`

***

***

### setMosaicPattern()

> **setMosaicPattern**(): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:477](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L477)

**`Experimental`**

모자이크 타일 프리셋을 적용합니다. (Cell ID Color, Manhattan, jitter 0.3, 색상 강도 1.0)

#### Returns

`void`

***

***

### setOrganicPattern()

> **setOrganicPattern**(): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:438](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L438)

**`Experimental`**

유기체 무늬 프리셋을 적용합니다. (Manhattan, jitter 0.6)

#### Returns

`void`

***

***

### setSmoothBlend()

> **setSmoothBlend**(): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:394](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L394)

**`Experimental`**

출력 타입을 F1 + F2(부드러운 블렌딩)로 설정합니다.

#### Returns

`void`

***

***

### setStainedGlassPattern()

> **setStainedGlassPattern**(): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:466](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L466)

**`Experimental`**

스테인드글라스 프리셋을 적용합니다. (Cell ID Color, Euclidean, jitter 0.7, 색상 강도 0.8)

#### Returns

`void`

***

***

### setStonePattern()

> **setStonePattern**(): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:428](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L428)

**`Experimental`**

돌 질감 프리셋을 적용합니다. (F2 - F1, Euclidean, jitter 0.8)

#### Returns

`void`

***

***

## 상속받은 속성

<details>
<summary>상속받은 속성 보기 (클릭하여 확장)</summary>

### mipLevelCount

> **mipLevelCount**: `number` = `1`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:47](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L47)

**`Experimental`**

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`mipLevelCount`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#miplevelcount)

***

***

### src

> **src**: `string`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:49](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L49)

**`Experimental`**

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`src`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#src)

***

***

### useMipmap

> **useMipmap**: `boolean` = `true`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:48](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L48)

**`Experimental`**

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`useMipmap`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#usemipmap)

***

### animationSpeed

#### Get Signature

> **get** **animationSpeed**(): `number`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:132](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L132)

**`Experimental`**

애니메이션 속도를 반환합니다.

##### Returns

`number`

#### Set Signature

> **set** **animationSpeed**(`value`): `void`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:144](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L144)

**`Experimental`**

애니메이션 속도를 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 애니메이션 속도 |

##### Returns

`void`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`animationSpeed`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#animationspeed)

***

***

### animationX

#### Get Signature

> **get** **animationX**(): `number`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:154](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L154)

**`Experimental`**

X축 애니메이션 값을 반환합니다.

##### Returns

`number`

#### Set Signature

> **set** **animationX**(`value`): `void`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:166](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L166)

**`Experimental`**

X축 애니메이션 값을 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | X축 애니메이션 값 |

##### Returns

`void`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`animationX`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#animationx)

***

***

### animationY

#### Get Signature

> **get** **animationY**(): `number`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:176](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L176)

**`Experimental`**

Y축 애니메이션 값을 반환합니다.

##### Returns

`number`

#### Set Signature

> **set** **animationY**(`value`): `void`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:188](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L188)

**`Experimental`**

Y축 애니메이션 값을 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Y축 애니메이션 값 |

##### Returns

`void`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`animationY`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#animationy)

***

***

### antialiasingManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **antialiasingManager**(): [`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:80](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L80)

**`Experimental`**

안티앨리어싱 설정을 관리하는 `AntialiasingManager` 인스턴스를 반환합니다.

##### Returns

[`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

`AntialiasingManager` 인스턴스

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`antialiasingManager`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#antialiasingmanager)

***

***

### cacheKey

#### Get Signature

> **get** **cacheKey**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:61](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/ResourceBase.ts#L61)

**`Experimental`**

캐시 키를 반환하거나 설정합니다.

##### Returns

`string`

캐시 키 문자열

#### Set Signature

> **set** **cacheKey**(`value`): `void`

Defined in: [src/resources/core/ResourceBase.ts:65](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/ResourceBase.ts#L65)

**`Experimental`**

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

##### Returns

`void`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`cacheKey`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#cachekey)

***

***

### commandEncoderManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **commandEncoderManager**(): [`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

Defined in: [src/base/RedGPUObject.ts:92](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L92)

**`Experimental`**

WebGPU 커맨드 인코딩을 관리하는 `CommandEncoderManager` 인스턴스를 반환합니다.

##### Returns

[`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

`CommandEncoderManager` 인스턴스

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`commandEncoderManager`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#commandencodermanager)

***

***

### gpuDevice

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/resources/core/ResourceBase.ts:89](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/ResourceBase.ts#L89)

**`Experimental`**

연관된 GPUDevice를 반환합니다.

##### Returns

`GPUDevice`

GPUDevice 인스턴스

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`gpuDevice`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#gpudevice)

***

***

### gpuTexture

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **gpuTexture**(): `GPUTexture`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:206](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L206)

**`Experimental`**

GPUTexture 객체를 반환합니다.

##### Returns

`GPUTexture`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`gpuTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#gputexture)

***

***

### instanceId

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **instanceId**(): `number`

Defined in: [src/base/BaseObject.ts:36](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/BaseObject.ts#L36)

**`Experimental`**

클래스별로 순차 부여되는 고유 인스턴스 번호를 반환합니다.

##### Returns

`number`

클래스별 고유 인스턴스 번호

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`instanceId`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#instanceid)

***

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/base/BaseObject.ts:63](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/BaseObject.ts#L63)

**`Experimental`**

객체의 이름을 반환하거나 설정합니다. 미설정 시 기본 이름(`ClassName Instance N`)을 반환합니다.

##### Returns

`string`

객체 이름 문자열

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/base/BaseObject.ts:70](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/BaseObject.ts#L70)

**`Experimental`**

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

##### Returns

`void`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`name`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#name)

***

***

### redGPUContext

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **redGPUContext**(): [`RedGPUContext`](../../Context/classes/RedGPUContext.md)

Defined in: [src/base/RedGPUObject.ts:44](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L44)

**`Experimental`**

바인딩된 `RedGPUContext` 인스턴스를 반환합니다.

##### Returns

[`RedGPUContext`](../../Context/classes/RedGPUContext.md)

`RedGPUContext` 인스턴스

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`redGPUContext`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#redgpucontext)

***

***

### resourceManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **resourceManager**(): [`ResourceManager`](../namespaces/Core/classes/ResourceManager.md)

Defined in: [src/base/RedGPUObject.ts:68](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L68)

**`Experimental`**

전역 GPU 리소스를 관리하는 `ResourceManager` 인스턴스를 반환합니다.

##### Returns

[`ResourceManager`](../namespaces/Core/classes/ResourceManager.md)

`ResourceManager` 인스턴스

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`resourceManager`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#resourcemanager)

***

***

### resourceManagerKey

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **resourceManagerKey**(): `string`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:124](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L124)

**`Experimental`**

리소스 매니저 상태 키를 반환합니다.

##### Returns

`string`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`resourceManagerKey`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#resourcemanagerkey)

***

***

### revision

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **revision**(): `number`

Defined in: [src/resources/core/ResourceBase.ts:49](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/ResourceBase.ts#L49)

**`Experimental`**

리소스의 리비전(업데이트 횟수)을 반환합니다.

##### Returns

`number`

리소스 리비전 번호

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`revision`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#revision)

***

***

### targetResourceManagedState

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **targetResourceManagedState**(): [`ResourceStatusInfo`](../namespaces/Core/classes/ResourceStatusInfo.md)

Defined in: [src/resources/core/ManagementResourceBase.ts:50](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/ManagementResourceBase.ts#L50)

**`Experimental`**

리소스의 관리 상태 정보를 반환합니다.

##### Returns

[`ResourceStatusInfo`](../namespaces/Core/classes/ResourceStatusInfo.md)

리소스 관리 상태 정보 객체

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`targetResourceManagedState`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#targetresourcemanagedstate)

***

***

### time

#### Get Signature

> **get** **time**(): `number`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:214](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L214)

**`Experimental`**

현재 시간을 반환합니다.

##### Returns

`number`

#### Set Signature

> **set** **time**(`value`): `void`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:226](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L226)

**`Experimental`**

현재 시간을 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 시간 (밀리초) |

##### Returns

`void`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`time`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#time)

***

***

### uniformInfo

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **uniformInfo**(): `any`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:198](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L198)

**`Experimental`**

유니폼 정보를 반환합니다.

##### Returns

`any`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`uniformInfo`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#uniforminfo)

***

***

### uuid

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **uuid**(): `string`

Defined in: [src/base/BaseObject.ts:48](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/BaseObject.ts#L48)

**`Experimental`**

객체의 고유 식별자(UUID)를 반환합니다.

##### Returns

`string`

객체의 UUID 문자열

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`uuid`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#uuid)

***

***

### videoMemorySize

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **videoMemorySize**(): `number`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:116](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L116)

**`Experimental`**

비디오 메모리 사용량(byte)을 반환합니다.

##### Returns

`number`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`videoMemorySize`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#videomemorysize)

</details>


***

## 상속받은 메서드

<details>
<summary>상속받은 메서드 보기 (클릭하여 확장)</summary>

### \_\_addDirtyPipelineListener()

> **\_\_addDirtyPipelineListener**(`listener`): `void`

Defined in: [src/resources/core/ResourceBase.ts:102](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/ResourceBase.ts#L102)

**`Experimental`**

리소스 변경 시 호출될 파이프라인 더티 리스너를 추가합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `listener` | () => `void` | 등록할 리스너 함수 |

#### Returns

`void`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`__addDirtyPipelineListener`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#__adddirtypipelinelistener)

***

***

### \_\_removeDirtyPipelineListener()

> **\_\_removeDirtyPipelineListener**(`listener`): `void`

Defined in: [src/resources/core/ResourceBase.ts:115](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/ResourceBase.ts#L115)

**`Experimental`**

등록된 파이프라인 더티 리스너를 제거합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `listener` | () => `void` | 제거할 리스너 함수 |

#### Returns

`void`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`__removeDirtyPipelineListener`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#__removedirtypipelinelistener)

***

***

### destroy()

> **destroy**(): `void`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:285](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L285)

**`Experimental`**

리소스를 파괴합니다.

#### Returns

`void`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`destroy`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#destroy)

***

***

### notifyUpdate()

> **notifyUpdate**(`resetList?`): `void`

Defined in: [src/resources/core/ResourceBase.ts:131](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/ResourceBase.ts#L131)

**`Experimental`**

리소스가 업데이트되었음을 등록된 리스너들에게 알립니다.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `resetList?` | `boolean` | `false` | 알림 실행 후 리스너 목록 초기화 여부 (기본값: false) |

#### Returns

`void`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`notifyUpdate`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#notifyupdate)

***

***

### render()

> **render**(`time`): `void`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:277](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L277)

**`Experimental`**

지정된 시간으로 노이즈를 렌더링합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `time` | `number` | 렌더링할 시간 |

#### Returns

`void`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`render`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#render)

***

***

### updateUniform()

> **updateUniform**(`name`, `value`): `void`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:243](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L243)

**`Experimental`**

개별 유니폼 파라미터를 업데이트합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `name` | `string` | 유니폼 이름 |
| `value` | `any` | 설정할 값 |

#### Returns

`void`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`updateUniform`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#updateuniform)

***

***

### updateUniforms()

> **updateUniforms**(`uniforms`): `void`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:259](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L259)

**`Experimental`**

여러 유니폼 파라미터를 일괄 업데이트합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `uniforms` | `Record`\<`string`, `any`\> | 업데이트할 유니폼 키-값 레코드 |

#### Returns

`void`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`updateUniforms`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#updateuniforms)

</details>
