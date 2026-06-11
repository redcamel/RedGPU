[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Resource](../README.md) / VoronoiTexture

# Class: VoronoiTexture

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:59](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L59)

**`Experimental`**

Voronoi 노이즈 패턴을 생성하는 텍스처 클래스입니다.

셀룰러 패턴, 돌 텍스처, 크랙 패턴, 셀 ID 출력 등을 생성할 수 있습니다.

* ### Example
```typescript
const texture = new RedGPU.Resource.VoronoiTexture(redGPUContext);
```

## Extends

- [`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md)

## Constructors

### Constructor

> **new VoronoiTexture**(`redGPUContext`, `width?`, `height?`, `define?`, `useMipmap?`): `VoronoiTexture`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:90](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L90)

**`Experimental`**

VoronoiTexture 인스턴스를 생성합니다.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | `undefined` | RedGPUContext 인스턴스
| `width` | `number` | `1024` | 텍스처 가로 크기
| `height` | `number` | `1024` | 텍스처 세로 크기
| `define?` | [`NoiseDefine`](../namespaces/CoreNoiseTexture/interfaces/NoiseDefine.md) | `undefined` | 노이즈 정의 객체 (선택)
| `useMipmap?` | `boolean` | `true` | 밉맵 사용 여부 (기본값: true)

#### Returns

`VoronoiTexture`

#### Overrides

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`constructor`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#constructor)

## Properties

### cellIdColorIntensity

#### Get Signature

> **get** **cellIdColorIntensity**(): `number`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:322](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L322)

**`Experimental`**

셀 ID 색상 강도를 반환합니다.

##### Returns

`number`

- 색상 강도

#### Set Signature

> **set** **cellIdColorIntensity**(`value`): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:331](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L331)

**`Experimental`**

셀 ID 색상 강도를 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 설정할 색상 강도 (양수)

##### Returns

`void`

***

### distanceScale

#### Get Signature

> **get** **distanceScale**(): `number`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:157](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L157)

**`Experimental`**

거리 값의 스케일을 반환합니다.

##### Returns

`number`

- 거리 스케일 값

#### Set Signature

> **set** **distanceScale**(`value`): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:166](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L166)

**`Experimental`**

거리 값의 스케일을 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 설정할 거리 스케일 값 (양수)

##### Returns

`void`

***

### distanceType

#### Get Signature

> **get** **distanceType**(): `number`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:256](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L256)

**`Experimental`**

거리 계산 방식을 반환합니다.

##### Returns

`number`

- 거리 계산 방식

#### Set Signature

> **set** **distanceType**(`value`): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:265](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L265)

**`Experimental`**

거리 계산 방식을 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 거리 계산 방식 (VORONOI_DISTANCE_TYPE 내의 값)

##### Returns

`void`

***

### frequency

#### Get Signature

> **get** **frequency**(): `number`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:137](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L137)

**`Experimental`**

주파수(밀도/크기)를 반환합니다.

##### Returns

`number`

- 주파수 값

#### Set Signature

> **set** **frequency**(`value`): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:146](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L146)

**`Experimental`**

주파수(밀도/크기)를 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 설정할 주파수 값 (양수)

##### Returns

`void`

***

### jitter

#### Get Signature

> **get** **jitter**(): `number`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:302](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L302)

**`Experimental`**

지터(Jitter) 값(점들의 랜덤성 분포)을 반환합니다.

##### Returns

`number`

- 지터 값

#### Set Signature

> **set** **jitter**(`value`): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:311](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L311)

**`Experimental`**

지터(Jitter) 값(점들의 랜덤성 분포)을 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 설정할 지터 값 (0~1 범위의 양수)

##### Returns

`void`

***

### lacunarity

#### Get Signature

> **get** **lacunarity**(): `number`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:217](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L217)

**`Experimental`**

간극성(각 옥타브마다의 주파수 증가 비율)을 반환합니다.

##### Returns

`number`

- 간극성 값

#### Set Signature

> **set** **lacunarity**(`value`): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:226](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L226)

**`Experimental`**

간극성(각 옥타브마다의 주파수 증가 비율)을 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 설정할 간극성 값 (양수)

##### Returns

`void`

***

### octaves

#### Get Signature

> **get** **octaves**(): `number`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:177](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L177)

**`Experimental`**

옥타브 수(합성할 노이즈 레이어 개수)를 반환합니다.

##### Returns

`number`

- 옥타브 수

#### Set Signature

> **set** **octaves**(`value`): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:186](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L186)

**`Experimental`**

옥타브 수(합성할 노이즈 레이어 개수)를 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 설정할 옥타브 수 (1~8 범위의 정수)

##### Returns

`void`

***

### outputType

#### Get Signature

> **get** **outputType**(): `number`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:279](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L279)

**`Experimental`**

출력 타입을 반환합니다.

##### Returns

`number`

- 출력 타입

#### Set Signature

> **set** **outputType**(`value`): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:288](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L288)

**`Experimental`**

출력 타입을 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 출력 타입 (VORONOI_OUTPUT_TYPE 내의 값)

##### Returns

`void`

***

### persistence

#### Get Signature

> **get** **persistence**(): `number`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:197](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L197)

**`Experimental`**

지속성(각 옥타브마다의 진폭 감소 비율)을 반환합니다.

##### Returns

`number`

- 지속성 값

#### Set Signature

> **set** **persistence**(`value`): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:206](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L206)

**`Experimental`**

지속성(각 옥타브마다의 진폭 감소 비율)을 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 설정할 지속성 값 (0~1 범위의 양수)

##### Returns

`void`

***

### seed

#### Get Signature

> **get** **seed**(): `number`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:237](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L237)

**`Experimental`**

시드 값을 반환합니다.

##### Returns

`number`

- 시드 값

#### Set Signature

> **set** **seed**(`value`): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:246](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L246)

**`Experimental`**

시드 값을 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 설정할 시드 값

##### Returns

`void`

***

### applySettings()

> **applySettings**(`settings`): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:523](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L523)

**`Experimental`**

설정을 일괄 적용합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `settings` | `Partial`\<[`VoronoiSettings`](../interfaces/VoronoiSettings.md)\> | 적용할 설정의 일부 속성을 가진 객체

#### Returns

`void`

***

### getDistanceTypeName()

> **getDistanceTypeName**(): `string`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:541](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L541)

**`Experimental`**

현재 설정된 거리 타입의 이름 문자열을 반환합니다.

#### Returns

`string`

- 거리 타입 이름

***

### getOutputTypeName()

> **getOutputTypeName**(): `string`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:555](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L555)

**`Experimental`**

현재 설정된 출력 타입의 이름 문자열을 반환합니다.

#### Returns

`string`

- 출력 타입 이름

***

### getSettings()

> **getSettings**(): [`VoronoiSettings`](../interfaces/VoronoiSettings.md)

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:503](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L503)

**`Experimental`**

현재 적용된 모든 Voronoi 설정을 객체 형태로 반환합니다.

#### Returns

[`VoronoiSettings`](../interfaces/VoronoiSettings.md)

- 현재 설정 객체

***

### randomizeSeed()

> **randomizeSeed**(): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:341](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L341)

**`Experimental`**

시드를 랜덤한 값으로 변경합니다.

#### Returns

`void`

***

### setBiomeMapPattern()

> **setBiomeMapPattern**(): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:491](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L491)

**`Experimental`**

바이옴 맵 형태의 경계선 패턴 프리셋을 적용합니다.

#### Returns

`void`

***

### setCellIdColorOutput()

> **setCellIdColorOutput**(): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:413](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L413)

**`Experimental`**

출력 타입을 셀 ID 색상(각 셀마다 고유한 RGB 색상 할당) 방식으로 설정합니다.

#### Returns

`void`

***

### setCellIdOutput()

> **setCellIdOutput**(): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:405](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L405)

**`Experimental`**

출력 타입을 셀 ID(각 셀의 고유 ID값 수치화) 방식으로 설정합니다.

#### Returns

`void`

***

### setCellularPattern()

> **setCellularPattern**(): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:421](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L421)

**`Experimental`**

기본적인 셀룰러 패턴 프리셋을 적용합니다.

#### Returns

`void`

***

### setChebyshevDistance()

> **setChebyshevDistance**(): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:365](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L365)

**`Experimental`**

거리 계산 방식을 체비셰프(Chebyshev) 거리로 설정합니다.

#### Returns

`void`

***

### setCrackPattern()

> **setCrackPattern**(): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:389](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L389)

**`Experimental`**

출력 타입을 F2 - F1(크랙 패턴) 방식으로 설정합니다.

#### Returns

`void`

***

### setCrystalPattern()

> **setCrystalPattern**(): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:459](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L459)

**`Experimental`**

크리스탈 결정 무늬 프리셋을 적용합니다.

#### Returns

`void`

***

### setEuclideanDistance()

> **setEuclideanDistance**(): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:349](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L349)

**`Experimental`**

거리 계산 방식을 유클리드(Euclidean) 거리로 설정합니다.

#### Returns

`void`

***

### setF1Output()

> **setF1Output**(): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:373](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L373)

**`Experimental`**

출력 타입을 F1(가장 가까운 거리) 방식으로 설정합니다.

#### Returns

`void`

***

### setF2Output()

> **setF2Output**(): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:381](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L381)

**`Experimental`**

출력 타입을 F2(두 번째로 가까운 거리) 방식으로 설정합니다.

#### Returns

`void`

***

### setGridPattern()

> **setGridPattern**(): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:450](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L450)

**`Experimental`**

완벽한 격자(Grid) 패턴 프리셋을 적용합니다.

#### Returns

`void`

***

### setManhattanDistance()

> **setManhattanDistance**(): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:357](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L357)

**`Experimental`**

거리 계산 방식을 맨하탄(Manhattan) 거리로 설정합니다.

#### Returns

`void`

***

### setMosaicPattern()

> **setMosaicPattern**(): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:480](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L480)

**`Experimental`**

모자이크 타일 무늬 프리셋을 적용합니다.

#### Returns

`void`

***

### setOrganicPattern()

> **setOrganicPattern**(): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:441](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L441)

**`Experimental`**

유기체(Organic) 무늬 프리셋을 적용합니다.

#### Returns

`void`

***

### setSmoothBlend()

> **setSmoothBlend**(): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:397](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L397)

**`Experimental`**

출력 타입을 F1 + F2(부드러운 블렌딩) 방식으로 설정합니다.

#### Returns

`void`

***

### setStainedGlassPattern()

> **setStainedGlassPattern**(): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:469](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L469)

**`Experimental`**

스테인드글라스 무늬 프리셋을 적용합니다.

#### Returns

`void`

***

### setStonePattern()

> **setStonePattern**(): `void`

Defined in: [src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts:431](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/texture/noiseTexture/voronoi/VoronoiTexture.ts#L431)

**`Experimental`**

돌 질감 프리셋을 적용합니다.

#### Returns

`void`

***


***

## 상속받은 멤버

<details>
<summary>상속받은 속성 및 메서드 보기 (클릭하여 확장)</summary>

### mipLevelCount

> **mipLevelCount**: `number` = `1`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:39](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L39)

**`Experimental`**

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`mipLevelCount`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#miplevelcount)

***

### src

> **src**: `string`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:41](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L41)

**`Experimental`**

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`src`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#src)

***

### useMipmap

> **useMipmap**: `boolean` = `true`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:40](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L40)

**`Experimental`**

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`useMipmap`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#usemipmap)

## Accessors

### animationSpeed

#### Get Signature

> **get** **animationSpeed**(): `number`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:103](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L103)

**`Experimental`**

애니메이션 속도를 반환합니다.

##### Returns

`number`

#### Set Signature

> **set** **animationSpeed**(`value`): `void`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:108](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L108)

**`Experimental`**

애니메이션 속도를 설정합니다.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`animationSpeed`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#animationspeed)

***

### animationX

#### Get Signature

> **get** **animationX**(): `number`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:115](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L115)

**`Experimental`**

X축 애니메이션 값을 반환합니다.

##### Returns

`number`

#### Set Signature

> **set** **animationX**(`value`): `void`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:120](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L120)

**`Experimental`**

X축 애니메이션 값을 설정합니다.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`animationX`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#animationx)

***

### animationY

#### Get Signature

> **get** **animationY**(): `number`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:127](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L127)

**`Experimental`**

Y축 애니메이션 값을 반환합니다.

##### Returns

`number`

#### Set Signature

> **set** **animationY**(`value`): `void`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:132](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L132)

**`Experimental`**

Y축 애니메이션 값을 설정합니다.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`animationY`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#animationy)

***

### antialiasingManager

#### Get Signature

> **get** **antialiasingManager**(): [`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:76](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/base/RedGPUObject.ts#L76)

**`Experimental`**

안티앨리어싱 매니저 인스턴스를 반환합니다. (단축 경로)

##### Returns

[`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

AntialiasingManager 인스턴스

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`antialiasingManager`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#antialiasingmanager)

***

### cacheKey

#### Get Signature

> **get** **cacheKey**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:53](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/core/ResourceBase.ts#L53)

**`Experimental`**

캐시 키를 반환합니다.

##### Returns

`string`

#### Set Signature

> **set** **cacheKey**(`value`): `void`

Defined in: [src/resources/core/ResourceBase.ts:61](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/core/ResourceBase.ts#L61)

**`Experimental`**

캐시 키를 설정합니다.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

##### Returns

`void`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`cacheKey`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#cachekey)

***

### commandEncoderManager

#### Get Signature

> **get** **commandEncoderManager**(): [`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

Defined in: [src/base/RedGPUObject.ts:88](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/base/RedGPUObject.ts#L88)

**`Experimental`**

커맨드 인코더 매니저 인스턴스를 반환합니다. (단축 경로)

##### Returns

[`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

CommandEncoderManager 인스턴스

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`commandEncoderManager`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#commandencodermanager)

***

### gpuDevice

#### Get Signature

> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/resources/core/ResourceBase.ts:77](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/core/ResourceBase.ts#L77)

**`Experimental`**

연관된 GPU 디바이스를 반환합니다.

##### Returns

`GPUDevice`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`gpuDevice`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#gpudevice)

***

### gpuTexture

#### Get Signature

> **get** **gpuTexture**(): `GPUTexture`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:144](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L144)

**`Experimental`**

GPUTexture 객체를 반환합니다.

##### Returns

`GPUTexture`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`gpuTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#gputexture)

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/base/BaseObject.ts:58](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/base/BaseObject.ts#L58)

**`Experimental`**

객체의 이름을 반환합니다. 설정된 이름이 없으면 클래스명과 인스턴스 ID를 조합하여 자동으로 생성합니다.

##### Returns

`string`

객체 이름

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/base/BaseObject.ts:71](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/base/BaseObject.ts#L71)

**`Experimental`**

객체의 이름을 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` | 설정할 객체 이름

##### Returns

`void`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`name`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#name)

***

### redGPUContext

#### Get Signature

> **get** **redGPUContext**(): [`RedGPUContext`](../../Context/classes/RedGPUContext.md)

Defined in: [src/base/RedGPUObject.ts:40](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/base/RedGPUObject.ts#L40)

**`Experimental`**

RedGPUContext 인스턴스를 반환합니다.

##### Returns

[`RedGPUContext`](../../Context/classes/RedGPUContext.md)

RedGPUContext 인스턴스

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`redGPUContext`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#redgpucontext)

***

### resourceManager

#### Get Signature

> **get** **resourceManager**(): [`ResourceManager`](../namespaces/Core/classes/ResourceManager.md)

Defined in: [src/base/RedGPUObject.ts:64](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/base/RedGPUObject.ts#L64)

**`Experimental`**

리소스 매니저 인스턴스를 반환합니다. (단축 경로)

##### Returns

[`ResourceManager`](../namespaces/Core/classes/ResourceManager.md)

ResourceManager 인스턴스

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`resourceManager`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#resourcemanager)

***

### resourceManagerKey

#### Get Signature

> **get** **resourceManagerKey**(): `string`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:98](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L98)

**`Experimental`**

리소스 매니저 키

##### Returns

`string`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`resourceManagerKey`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#resourcemanagerkey)

***

### revision

#### Get Signature

> **get** **revision**(): `number`

Defined in: [src/resources/core/ResourceBase.ts:45](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/core/ResourceBase.ts#L45)

**`Experimental`**

리소스의 리비전(업데이트 횟수)을 반환합니다.

##### Returns

`number`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`revision`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#revision)

***

### targetResourceManagedState

#### Get Signature

> **get** **targetResourceManagedState**(): [`ResourceStatusInfo`](../namespaces/Core/classes/ResourceStatusInfo.md)

Defined in: [src/resources/core/ManagementResourceBase.ts:45](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/core/ManagementResourceBase.ts#L45)

**`Experimental`**

리소스의 관리 상태 정보를 반환합니다.

##### Returns

[`ResourceStatusInfo`](../namespaces/Core/classes/ResourceStatusInfo.md)

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`targetResourceManagedState`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#targetresourcemanagedstate)

***

### time

#### Get Signature

> **get** **time**(): `number`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:149](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L149)

**`Experimental`**

현재 시간을 반환합니다.

##### Returns

`number`

#### Set Signature

> **set** **time**(`value`): `void`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:154](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L154)

**`Experimental`**

현재 시간을 설정합니다.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`time`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#time)

***

### uniformInfo

#### Get Signature

> **get** **uniformInfo**(): `any`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:139](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L139)

**`Experimental`**

유니폼 정보를 반환합니다.

##### Returns

`any`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`uniformInfo`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#uniforminfo)

***

### uuid

#### Get Signature

> **get** **uuid**(): `string`

Defined in: [src/base/BaseObject.ts:46](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/base/BaseObject.ts#L46)

**`Experimental`**

객체의 고유 식별자(UUID)를 반환합니다.

##### Returns

`string`

UUID 문자열

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`uuid`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#uuid)

***

### videoMemorySize

#### Get Signature

> **get** **videoMemorySize**(): `number`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:93](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L93)

**`Experimental`**

비디오 메모리 사용량(byte)

##### Returns

`number`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`videoMemorySize`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#videomemorysize)

## Methods

### \_\_addDirtyPipelineListener()

> **\_\_addDirtyPipelineListener**(`listener`): `void`

Defined in: [src/resources/core/ResourceBase.ts:89](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/core/ResourceBase.ts#L89)

**`Experimental`**

파이프라인이 더티해질 때 호출될 리스너를 추가합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `listener` | () => `void` | 리스너 함수

#### Returns

`void`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`__addDirtyPipelineListener`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#__adddirtypipelinelistener)

***

### \_\_removeDirtyPipelineListener()

> **\_\_removeDirtyPipelineListener**(`listener`): `void`

Defined in: [src/resources/core/ResourceBase.ts:101](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/core/ResourceBase.ts#L101)

**`Experimental`**

리소스 업데이트 리스너를 제거합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `listener` | () => `void` | 제거할 리스너 함수

#### Returns

`void`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`__removeDirtyPipelineListener`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#__removedirtypipelinelistener)

***

### destroy()

> **destroy**(): `void`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:186](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L186)

**`Experimental`**

리소스를 파괴합니다.

#### Returns

`void`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`destroy`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#destroy)

***

### notifyUpdate()

> **notifyUpdate**(`resetList?`): `void`

Defined in: [src/resources/core/ResourceBase.ts:116](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/core/ResourceBase.ts#L116)

**`Experimental`**

리소스가 업데이트되었음을 등록된 리스너들에게 알립니다.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `resetList` | `boolean` | `false` | 실행 후 리스너 목록 초기화 여부 (기본값: false)

#### Returns

`void`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`notifyUpdate`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#notifyupdate)

***

### render()

> **render**(`time`): `void`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:181](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L181)

**`Experimental`**

지정된 시간으로 노이즈를 렌더링합니다.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `time` | `number` |

#### Returns

`void`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`render`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#render)

***

### updateUniform()

> **updateUniform**(`name`, `value`): `void`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:161](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L161)

**`Experimental`**

개별 유니폼 파라미터를 업데이트합니다.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `name` | `string` |
| `value` | `any` |

#### Returns

`void`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`updateUniform`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#updateuniform)

***

### updateUniforms()

> **updateUniforms**(`uniforms`): `void`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:170](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L170)

**`Experimental`**

여러 유니폼 파라미터를 일괄 업데이트합니다.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `uniforms` | `Record`\<`string`, `any`\> |

#### Returns

`void`

#### Inherited from

[`ANoiseTexture`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md).[`updateUniforms`](../namespaces/CoreNoiseTexture/classes/ANoiseTexture.md#updateuniforms)


</details>
