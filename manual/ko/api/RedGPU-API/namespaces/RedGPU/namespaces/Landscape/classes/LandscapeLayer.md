[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Landscape](../README.md) / LandscapeLayer

# Class: LandscapeLayer

Defined in: [src/landscape/LandscapeLayer.ts:131](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/LandscapeLayer.ts#L131)

지형 멀티 레이어 스플래팅에 사용되는 개별 재질 레이어의 텍스처, UV 변환, PBR 속성 및 가중치 채널을 정의하는 클래스입니다. `landscape.addLayer()`를 통해 내부적으로 자동 생성됩니다.

::: warning
이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
:::

### Example
```typescript
// 지형에 새로운 스플래팅 레이어 추가 및 참조
const rockLayer = landscape.addLayer({
    name: 'Rock',
    baseColorTexture: './assets/rock_diff.jpg',
    normalTexture: './assets/rock_norm.jpg',
    uvScale: [30, 30],
    roughness: 0.85
});
```

## See

[Multi-Layer Splatting example](https://redcamel.github.io/RedGPU/examples/3d/landscape/multiLayerSplatting/)

## Constructors

### Constructor

> **new LandscapeLayer**(`redGPUContextOrOptions`, `options?`): `LandscapeLayer`

Defined in: [src/landscape/LandscapeLayer.ts:188](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/LandscapeLayer.ts#L188)

`LandscapeLayer` 인스턴스를 생성합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContextOrOptions` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) \| [`LandscapeLayerOptions`](../interfaces/LandscapeLayerOptions.md) | `RedGPUContext` 인스턴스 또는 `LandscapeLayerOptions` 설정 객체 |
| `options?` | [`LandscapeLayerOptions`](../interfaces/LandscapeLayerOptions.md) | 첫 번째 인자로 `RedGPUContext`를 전달한 경우의 `LandscapeLayerOptions` 설정 객체 |

#### Returns

`LandscapeLayer`

## Properties

### onChange?

> `optional` **onChange?**: () => `void`

Defined in: [src/landscape/LandscapeLayer.ts:170](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/LandscapeLayer.ts#L170)

레이어의 텍스처 또는 베이킹 관련 속성이 변경될 때 호출되는 콜백 함수입니다.

#### Returns

`void`

***

### onUniformChange?

> `optional` **onUniformChange?**: () => `void`

Defined in: [src/landscape/LandscapeLayer.ts:175](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/LandscapeLayer.ts#L175)

VBT 리베이킹 없이 유니폼 버퍼 데이터만 갱신해야 할 때 호출되는 콜백 함수입니다.

#### Returns

`void`

***

### UNIFORM\_FLOAT\_COUNT

> <span class="readonly-badge">readonly</span> `static` **UNIFORM\_FLOAT\_COUNT**: `16` = `16`

Defined in: [src/landscape/LandscapeLayer.ts:165](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/LandscapeLayer.ts#L165)

단일 레이어 유니폼 구조체가 차지하는 `f32` 요소 개수(16 floats = 64 bytes)입니다.

## Accessors

### aoIntensity

#### Get Signature

> **get** **aoIntensity**(): `number`

Defined in: [src/landscape/LandscapeLayer.ts:573](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/LandscapeLayer.ts#L573)

레이어의 앰비언트 오클루전(AO) 강도를 반환하거나 설정합니다.

##### Returns

`number`

AO 강도

#### Set Signature

> **set** **aoIntensity**(`val`): `void`

Defined in: [src/landscape/LandscapeLayer.ts:552](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/LandscapeLayer.ts#L552)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `val` | `number` |

##### Returns

`void`

***

### baseColorTexture

#### Get Signature

> **get** **baseColorTexture**(): [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/landscape/LandscapeLayer.ts:316](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/LandscapeLayer.ts#L316)

레이어의 베이스 컬러(BaseColor) 텍스처를 반환하거나 설정합니다.

##### Returns

[`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

`BitmapTexture` 인스턴스 또는 `undefined`

#### Set Signature

> **set** **baseColorTexture**(`val`): `void`

Defined in: [src/landscape/LandscapeLayer.ts:292](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/LandscapeLayer.ts#L292)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `val` | `string` \| [`BitmapTexture`](../../Resource/classes/BitmapTexture.md) |

##### Returns

`void`

***

### enabled

#### Get Signature

> **get** **enabled**(): `boolean`

Defined in: [src/landscape/LandscapeLayer.ts:416](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/LandscapeLayer.ts#L416)

레이어 활성화 여부를 반환하거나 설정합니다.

##### Returns

`boolean`

활성화 상태 (`boolean`)

#### Set Signature

> **set** **enabled**(`val`): `void`

Defined in: [src/landscape/LandscapeLayer.ts:420](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/LandscapeLayer.ts#L420)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `val` | `boolean` |

##### Returns

`void`

***

### heightBlendFactor

#### Get Signature

> **get** **heightBlendFactor**(): `number`

Defined in: [src/landscape/LandscapeLayer.ts:585](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/LandscapeLayer.ts#L585)

높이 기반 레이어 블렌딩 대비 계수(범위: `0.0 ~ 5.0`)를 반환하거나 설정합니다.

##### Returns

`number`

높이 블렌드 계수

#### Set Signature

> **set** **heightBlendFactor**(`val`): `void`

Defined in: [src/landscape/LandscapeLayer.ts:589](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/LandscapeLayer.ts#L589)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `val` | `number` |

##### Returns

`void`

***

### name

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **name**(): `string`

Defined in: [src/landscape/LandscapeLayer.ts:288](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/LandscapeLayer.ts#L288)

레이어의 고유 이름을 반환합니다.

##### Returns

`string`

레이어 이름

***

### nearUVScaleMultiplier

#### Get Signature

> **get** **nearUVScaleMultiplier**(): `number`

Defined in: [src/landscape/LandscapeLayer.ts:474](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/LandscapeLayer.ts#L474)

근접 디테일 영역에 적용되는 UV 스케일 배율을 반환하거나 설정합니다. (최솟값: `0.1`)

##### Returns

`number`

근접 디테일 UV 스케일 배율

#### Set Signature

> **set** **nearUVScaleMultiplier**(`val`): `void`

Defined in: [src/landscape/LandscapeLayer.ts:478](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/LandscapeLayer.ts#L478)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `val` | `number` |

##### Returns

`void`

***

### normalIntensity

#### Get Signature

> **get** **normalIntensity**(): `number`

Defined in: [src/landscape/LandscapeLayer.ts:542](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/LandscapeLayer.ts#L542)

레이어의 노멀 맵 강도를 반환하거나 설정합니다.

##### Returns

`number`

노멀 맵 강도

#### Set Signature

> **set** **normalIntensity**(`val`): `void`

Defined in: [src/landscape/LandscapeLayer.ts:546](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/LandscapeLayer.ts#L546)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `val` | `number` |

##### Returns

`void`

***

### normalTexture

#### Get Signature

> **get** **normalTexture**(): [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/landscape/LandscapeLayer.ts:344](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/LandscapeLayer.ts#L344)

레이어의 노멀(Normal) 텍스처를 반환하거나 설정합니다.

##### Returns

[`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

`BitmapTexture` 인스턴스 또는 `undefined`

#### Set Signature

> **set** **normalTexture**(`val`): `void`

Defined in: [src/landscape/LandscapeLayer.ts:320](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/LandscapeLayer.ts#L320)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `val` | `string` \| [`BitmapTexture`](../../Resource/classes/BitmapTexture.md) |

##### Returns

`void`

***

### ormTexture

#### Get Signature

> **get** **ormTexture**(): [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/landscape/LandscapeLayer.ts:372](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/LandscapeLayer.ts#L372)

레이어의 ORM(Occlusion, Roughness, Metallic) 텍스처를 반환하거나 설정합니다.

##### Returns

[`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

`BitmapTexture` 인스턴스 또는 `undefined`

#### Set Signature

> **set** **ormTexture**(`val`): `void`

Defined in: [src/landscape/LandscapeLayer.ts:348](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/LandscapeLayer.ts#L348)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `val` | `string` \| [`BitmapTexture`](../../Resource/classes/BitmapTexture.md) |

##### Returns

`void`

***

### roughness

#### Get Signature

> **get** **roughness**(): `number`

Defined in: [src/landscape/LandscapeLayer.ts:524](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/LandscapeLayer.ts#L524)

레이어의 표면 거칠기(Roughness) 계수를 반환하거나 설정합니다.

##### Returns

`number`

거칠기 계수

#### Set Signature

> **set** **roughness**(`val`): `void`

Defined in: [src/landscape/LandscapeLayer.ts:528](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/LandscapeLayer.ts#L528)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `val` | `number` |

##### Returns

`void`

***

### stochasticScale

#### Get Signature

> **get** **stochasticScale**(): `number`

Defined in: [src/landscape/LandscapeLayer.ts:629](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/LandscapeLayer.ts#L629)

스토캐스틱 타일링 셀 스케일(최솟값: `0.01`)을 반환하거나 설정합니다.

##### Returns

`number`

스토캐스틱 타일링 스케일

#### Set Signature

> **set** **stochasticScale**(`val`): `void`

Defined in: [src/landscape/LandscapeLayer.ts:633](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/LandscapeLayer.ts#L633)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `val` | `number` |

##### Returns

`void`

***

### stochasticTiling

#### Get Signature

> **get** **stochasticTiling**(): `boolean`

Defined in: [src/landscape/LandscapeLayer.ts:609](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/LandscapeLayer.ts#L609)

반복 패턴 억제를 위한 스토캐스틱 타일링 활성화 여부를 반환하거나 설정합니다.

##### Returns

`boolean`

스토캐스틱 타일링 활성화 여부

#### Set Signature

> **set** **stochasticTiling**(`val`): `void`

Defined in: [src/landscape/LandscapeLayer.ts:613](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/LandscapeLayer.ts#L613)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `val` | `boolean` |

##### Returns

`void`

***

### uvOffset

#### Get Signature

> **get** **uvOffset**(): \[`number`, `number`\]

Defined in: [src/landscape/LandscapeLayer.ts:454](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/LandscapeLayer.ts#L454)

레이어 텍스처의 UV 오프셋 `[u, v]`를 반환하거나 설정합니다.

##### Returns

\[`number`, `number`\]

UV 오프셋 튜플 `[number, number]`

#### Set Signature

> **set** **uvOffset**(`val`): `void`

Defined in: [src/landscape/LandscapeLayer.ts:458](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/LandscapeLayer.ts#L458)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `val` | \[`number`, `number`\] |

##### Returns

`void`

***

### uvScale

#### Get Signature

> **get** **uvScale**(): \[`number`, `number`\]

Defined in: [src/landscape/LandscapeLayer.ts:434](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/LandscapeLayer.ts#L434)

레이어 텍스처의 UV 타일링 스케일 `[u, v]`를 반환하거나 설정합니다.

##### Returns

\[`number`, `number`\]

UV 스케일 튜플 `[number, number]`

#### Set Signature

> **set** **uvScale**(`val`): `void`

Defined in: [src/landscape/LandscapeLayer.ts:438](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/LandscapeLayer.ts#L438)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `val` | \[`number`, `number`\] |

##### Returns

`void`

***

### weightChannel

#### Get Signature

> **get** **weightChannel**(): [`LandscapeWeightMapChannel`](../type-aliases/LandscapeWeightMapChannel.md)

Defined in: [src/landscape/LandscapeLayer.ts:493](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/LandscapeLayer.ts#L493)

가중치 텍스처에서 참조하는 색상 채널 식별자를 반환하거나 설정합니다.

##### Returns

[`LandscapeWeightMapChannel`](../type-aliases/LandscapeWeightMapChannel.md)

가중치 채널 식별자 (`LandscapeWeightMapChannel`)

#### Set Signature

> **set** **weightChannel**(`val`): `void`

Defined in: [src/landscape/LandscapeLayer.ts:497](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/LandscapeLayer.ts#L497)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `val` | [`LandscapeWeightMapChannel`](../type-aliases/LandscapeWeightMapChannel.md) |

##### Returns

`void`

***

### weightChannelIndex

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **weightChannelIndex**(): `number`

Defined in: [src/landscape/LandscapeLayer.ts:512](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/LandscapeLayer.ts#L512)

현재 설정된 가중치 채널의 숫자 인덱스(0: R, 1: G, 2: B, 3: A)를 반환합니다.

##### Returns

`number`

채널 인덱스 (`0 ~ 3`)

***

### weightMapCPUSampler

#### Get Signature

> **get** **weightMapCPUSampler**(): [`LandscapeWeightMapCPUSampler`](../namespaces/Core/namespaces/Cache/classes/LandscapeWeightMapCPUSampler.md)

Defined in: [src/landscape/LandscapeLayer.ts:649](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/LandscapeLayer.ts#L649)

레이어의 CPU 측 가중치 맵 샘플러를 반환하거나 설정합니다.

##### Returns

[`LandscapeWeightMapCPUSampler`](../namespaces/Core/namespaces/Cache/classes/LandscapeWeightMapCPUSampler.md)

`LandscapeWeightMapCPUSampler` 인스턴스 또는 `undefined`

#### Set Signature

> **set** **weightMapCPUSampler**(`val`): `void`

Defined in: [src/landscape/LandscapeLayer.ts:653](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/LandscapeLayer.ts#L653)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `val` | [`LandscapeWeightMapCPUSampler`](../namespaces/Core/namespaces/Cache/classes/LandscapeWeightMapCPUSampler.md) |

##### Returns

`void`

***

### weightTexture

#### Get Signature

> **get** **weightTexture**(): [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/landscape/LandscapeLayer.ts:404](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/LandscapeLayer.ts#L404)

레이어의 스플래팅 가중치(Weight) 텍스처를 반환하거나 설정합니다. (지형 전체에서 단일 RGBA 가중치 맵 1장만 공유 지원)

##### Returns

[`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

`BitmapTexture` 인스턴스 또는 `undefined`

#### Set Signature

> **set** **weightTexture**(`val`): `void`

Defined in: [src/landscape/LandscapeLayer.ts:376](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/LandscapeLayer.ts#L376)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `val` | `string` \| [`BitmapTexture`](../../Resource/classes/BitmapTexture.md) |

##### Returns

`void`

## Methods

### getWeightAtUV()

> **getWeightAtUV**(`u`, `v`): `number`

Defined in: [src/landscape/LandscapeLayer.ts:718](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/LandscapeLayer.ts#L718)

지정된 정규화 지형 UV 좌표(`0.0 ~ 1.0`)에서 이 레이어의 스플래팅 가중치를 반환합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `u` | `number` | 정규화된 U 좌표 (`0.0 ~ 1.0`) |
| `v` | `number` | 정규화된 V 좌표 (`0.0 ~ 1.0`) |

#### Returns

`number`

샘플링된 가중치 값 (`0.0 ~ 1.0`)

***

### resolvePendingTextures()

> **resolvePendingTextures**(`context`): `void`

Defined in: [src/landscape/LandscapeLayer.ts:684](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/LandscapeLayer.ts#L684)

문자열 URL로 보류 중이던 텍스처 경로들을 주어진 `RedGPUContext`를 사용하여 `BitmapTexture` 인스턴스로 생성합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `context` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | 텍스처 생성에 사용할 `RedGPUContext` 인스턴스 |

#### Returns

`void`

***

### writeUniformData()

> **writeUniformData**(`targetBuffer`, `offset`): `void`

Defined in: [src/landscape/LandscapeLayer.ts:736](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/LandscapeLayer.ts#L736)

현재 레이어의 속성 데이터를 대상 `Float32Array` 유니폼 버퍼의 지정된 오프셋에 기록합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `targetBuffer` | `Float32Array` | 기록할 대상 `Float32Array` 버퍼 |
| `offset` | `number` | 기록을 시작할 배열 요소 인덱스 오프셋 |

#### Returns

`void`

***

### writeZeroUniformData()

> `static` **writeZeroUniformData**(`targetBuffer`, `offset`): `void`

Defined in: [src/landscape/LandscapeLayer.ts:672](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/LandscapeLayer.ts#L672)

대상 `Float32Array` 버퍼의 지정된 오프셋부터 단일 레이어 유니폼 영역(16 floats)을 0으로 초기화합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `targetBuffer` | `Float32Array` | 기록할 대상 `Float32Array` 버퍼 |
| `offset` | `number` | 기록을 시작할 배열 요소 인덱스 오프셋 |

#### Returns

`void`
