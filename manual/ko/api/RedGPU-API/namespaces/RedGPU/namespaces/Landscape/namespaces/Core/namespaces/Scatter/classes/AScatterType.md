[**RedGPU API v4.4.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [Landscape](../../../../../README.md) / [Core](../../../README.md) / [Scatter](../README.md) / AScatterType

# Abstract Class: AScatterType\<TAllocation\>

Defined in: [src/landscape/core/scatter/AScatterType.ts:108](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterType.ts#L108)

지형 위에 분포되는 개별 스캐터(식생, 잔디 등) 타입의 공통 배치 속성 및 메가 버퍼 세그먼트 바인딩을 정의하는 추상 기반 클래스입니다.

::: warning
이 클래스는 추상 클래스이므로 직접 인스턴스를 생성할 수 없습니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
:::

## Extends

- [`RedGPUObject`](../../../../../../BaseObject/classes/RedGPUObject.md)

## Extended by

- [`Foliage`](../../../../Foliage/classes/Foliage.md)
- [`Grass`](../../../../Grass/classes/Grass.md)

## Type Parameters

| Type Parameter | Default type | Description |
| ------ | ------ | ------ |
| <a id="type-parameter-tallocation"></a> `TAllocation` *extends* [`ScatterBaseSegmentAllocation`](../interfaces/ScatterBaseSegmentAllocation.md) | [`ScatterBaseSegmentAllocation`](../interfaces/ScatterBaseSegmentAllocation.md) | 이 스캐터 타입에 바인딩되는 메가 버퍼 세그먼트 할당 정보 타입 (`ScatterBaseSegmentAllocation`의 서브타입) |

## Constructors



***

### Constructor

> **new AScatterType**\<`TAllocation`\>(`redGPUContext`, `name`, `typeId?`): `AScatterType`\<`TAllocation`\>

Defined in: [src/landscape/core/scatter/AScatterType.ts:145](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterType.ts#L145)

`AScatterType` 인스턴스를 초기화합니다.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../../../Context/classes/RedGPUContext.md) | `undefined` | `RedGPUContext` 인스턴스 |
| `name` | `string` | `undefined` | 스캐터 타입의 고유 이름 (비어 있지 않은 문자열 필수) |
| `typeId?` | `number` | `0` | 스캐터 타입의 초기 숫자 ID (기본값: `0`) |

#### Returns

`AScatterType`\<`TAllocation`\>

#### Throws

`name`이 비어 있거나 유효한 문자열이 아닌 경우 에러 발생

#### Overrides

[`RedGPUObject`](../../../../../../BaseObject/classes/RedGPUObject.md).[`constructor`](../../../../../../BaseObject/classes/RedGPUObject.md#constructor)

## Accessors



***

### allocation

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **allocation**(): `TAllocation`

Defined in: [src/landscape/core/scatter/AScatterType.ts:211](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterType.ts#L211)

메가 버퍼에서 이 타입에 할당된 세그먼트 정보(`TAllocation | null`)를 반환합니다.

##### Returns

`TAllocation`

세그먼트 할당 정보(`TAllocation`) 또는 미할당 시 `null`

***

***

### bottomOffset

#### Get Signature

> **get** **bottomOffset**(): `number`

Defined in: [src/landscape/core/scatter/AScatterType.ts:235](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterType.ts#L235)

지형 표면으로부터의 인스턴스 하단 높이 오프셋을 반환하거나 설정합니다.

##### Returns

`number`

하단 높이 오프셋

#### Set Signature

> **set** **bottomOffset**(`val`): `void`

Defined in: [src/landscape/core/scatter/AScatterType.ts:259](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterType.ts#L259)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `val` | `number` |

##### Returns

`void`

***

***

### castShadow

#### Get Signature

> **get** **castShadow**(): `boolean`

Defined in: [src/landscape/core/scatter/AScatterType.ts:414](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterType.ts#L414)

디렉셔널 라이트 그림자 투사 여부를 반환하거나 설정합니다.

##### Returns

`boolean`

그림자 투사 활성화 여부

#### Set Signature

> **set** **castShadow**(`val`): `void`

Defined in: [src/landscape/core/scatter/AScatterType.ts:438](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterType.ts#L438)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `val` | `boolean` |

##### Returns

`void`

***

***

### cullingDistance

#### Get Signature

> **get** **cullingDistance**(): `number`

Defined in: [src/landscape/core/scatter/AScatterType.ts:255](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterType.ts#L255)

메인 패스 인스턴스 가시 컬링 거리를 반환하거나 설정합니다 (`0` 이상).

##### Returns

`number`

메인 패스 가시 컬링 거리

#### Set Signature

> **set** **cullingDistance**(`val`): `void`

Defined in: [src/landscape/core/scatter/AScatterType.ts:279](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterType.ts#L279)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `val` | `number` |

##### Returns

`void`

***

***

### densityMultiplier

#### Get Signature

> **get** **densityMultiplier**(): `number`

Defined in: [src/landscape/core/scatter/AScatterType.ts:394](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterType.ts#L394)

기준 밀도에 곱해지는 밀도 배율을 반환하거나 설정합니다 (`0.0` 이상).

##### Returns

`number`

밀도 배율

#### Set Signature

> **set** **densityMultiplier**(`val`): `void`

Defined in: [src/landscape/core/scatter/AScatterType.ts:418](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterType.ts#L418)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `val` | `number` |

##### Returns

`void`

***

***

### densityPerHectare

#### Get Signature

> **get** **densityPerHectare**(): `number`

Defined in: [src/landscape/core/scatter/AScatterType.ts:374](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterType.ts#L374)

헥타르(10,000㎡)당 기준 인스턴스 밀도를 반환하거나 설정합니다 (`0.0` 이상).

##### Returns

`number`

헥타르당 기준 배치 밀도

#### Set Signature

> **set** **densityPerHectare**(`val`): `void`

Defined in: [src/landscape/core/scatter/AScatterType.ts:398](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterType.ts#L398)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `val` | `number` |

##### Returns

`void`

***

***

### densityScaleByWeight

#### Get Signature

> **get** **densityScaleByWeight**(): `boolean`

Defined in: [src/landscape/core/scatter/AScatterType.ts:354](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterType.ts#L354)

지형 레이어 가중치에 따라 인스턴스 스케일을 조절할지 여부를 반환하거나 설정합니다.

##### Returns

`boolean`

가중치 기반 스케일 조절 여부

#### Set Signature

> **set** **densityScaleByWeight**(`val`): `void`

Defined in: [src/landscape/core/scatter/AScatterType.ts:378](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterType.ts#L378)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `val` | `boolean` |

##### Returns

`void`

***

***

### groundBlendStrength

#### Get Signature

> **get** **groundBlendStrength**(): `number`

Defined in: [src/landscape/core/scatter/AScatterType.ts:434](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterType.ts#L434)

지형 표면과의 하단 블렌딩 강도(`0.0`~`1.0`)를 반환하거나 설정합니다.

##### Returns

`number`

하단 블렌딩 강도 (`0.0`~`1.0`)

#### Set Signature

> **set** **groundBlendStrength**(`val`): `void`

Defined in: [src/landscape/core/scatter/AScatterType.ts:461](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterType.ts#L461)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `val` | `number` |

##### Returns

`void`

***

***

### height

#### Get Signature

> **get** **height**(): `number`

Defined in: [src/landscape/core/scatter/AScatterType.ts:223](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterType.ts#L223)

스캐터 인스턴스의 기준 높이를 반환하거나 설정합니다 (`0.01` 이상).

##### Returns

`number`

인스턴스 기준 높이

#### Set Signature

> **set** **height**(`val`): `void`

Defined in: [src/landscape/core/scatter/AScatterType.ts:239](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterType.ts#L239)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `val` | `number` |

##### Returns

`void`

***

***

### maxSlope

#### Get Signature

> **get** **maxSlope**(): `number`

Defined in: [src/landscape/core/scatter/AScatterType.ts:334](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterType.ts#L334)

인스턴스 배치가 허용되는 최대 지형 경사각(도, `0.0`~`90.0`)을 반환하거나 설정합니다.

##### Returns

`number`

최대 지형 경사각 (단위: 도)

#### Set Signature

> **set** **maxSlope**(`val`): `void`

Defined in: [src/landscape/core/scatter/AScatterType.ts:358](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterType.ts#L358)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `val` | `number` |

##### Returns

`void`

***

***

### minSlope

#### Get Signature

> **get** **minSlope**(): `number`

Defined in: [src/landscape/core/scatter/AScatterType.ts:315](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterType.ts#L315)

인스턴스 배치가 허용되는 최소 지형 경사각(도, `0.0`~`90.0`)을 반환하거나 설정합니다.

##### Returns

`number`

최소 지형 경사각 (단위: 도)

#### Set Signature

> **set** **minSlope**(`val`): `void`

Defined in: [src/landscape/core/scatter/AScatterType.ts:338](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterType.ts#L338)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `val` | `number` |

##### Returns

`void`

***

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/landscape/core/scatter/AScatterType.ts:166](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterType.ts#L166)

스캐터 타입의 고유 이름을 반환합니다. 생성 이후에는 변경할 수 없습니다.

##### Returns

`string`

스캐터 타입의 고유 이름

#### Set Signature

> **set** **name**(`_value`): `void`

Defined in: [src/landscape/core/scatter/AScatterType.ts:170](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterType.ts#L170)

객체의 이름을 반환하거나 설정합니다. 미설정 시 기본 이름(`ClassName Instance N`)을 반환합니다.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `_value` | `string` |

##### Returns

`void`

객체 이름 문자열

#### Overrides

[`RedGPUObject`](../../../../../../BaseObject/classes/RedGPUObject.md).[`name`](../../../../../../BaseObject/classes/RedGPUObject.md#name)

***

***

### renderUnits

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** `abstract` **renderUnits**(): [`ScatterRenderUnit`](ScatterRenderUnit.md)[]

Defined in: [src/landscape/core/scatter/AScatterType.ts:201](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterType.ts#L201)

이 스캐터 타입을 구성하는 `ScatterRenderUnit` 배열을 반환합니다.

##### Returns

[`ScatterRenderUnit`](ScatterRenderUnit.md)[]

렌더 유닛 배열 (`ScatterRenderUnit[]`)

***

***

### shadowCullDistance

#### Get Signature

> **get** **shadowCullDistance**(): `number`

Defined in: [src/landscape/core/scatter/AScatterType.ts:275](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterType.ts#L275)

그림자 패스 인스턴스 컬링 거리를 반환하거나 설정합니다 (`0` 이상).

##### Returns

`number`

그림자 패스 컬링 거리

#### Set Signature

> **set** **shadowCullDistance**(`val`): `void`

Defined in: [src/landscape/core/scatter/AScatterType.ts:299](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterType.ts#L299)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `val` | `number` |

##### Returns

`void`

***

***

### targetLayer

#### Get Signature

> **get** **targetLayer**(): `string` \| `number`

Defined in: [src/landscape/core/scatter/AScatterType.ts:295](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterType.ts#L295)

배치 밀도 가중치를 참조할 대상 지형 레이어 이름 또는 인덱스를 반환하거나 설정합니다.

##### Returns

`string` \| `number`

대상 레이어 이름(`string`), 인덱스(`number`) 또는 `undefined`

#### Set Signature

> **set** **targetLayer**(`val`): `void`

Defined in: [src/landscape/core/scatter/AScatterType.ts:319](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterType.ts#L319)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `val` | `string` \| `number` |

##### Returns

`void`

***

***

### typeId

#### Get Signature

> **get** **typeId**(): `number`

Defined in: [src/landscape/core/scatter/AScatterType.ts:182](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterType.ts#L182)

스캐터 타입에 할당된 고유 숫자 ID를 반환하거나 설정합니다.

##### Returns

`number`

스캐터 타입 숫자 ID

#### Set Signature

> **set** **typeId**(`value`): `void`

Defined in: [src/landscape/core/scatter/AScatterType.ts:186](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterType.ts#L186)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

## Methods



***

### bindAllocation()

> **bindAllocation**(`allocation`): `void`

Defined in: [src/landscape/core/scatter/AScatterType.ts:454](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterType.ts#L454)

메가 버퍼 세그먼트 할당 정보를 이 스캐터 타입에 바인딩합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `allocation` | `TAllocation` | 바인딩할 세그먼트 할당 정보 또는 `null` |

#### Returns

`void`

***

***

### destroy()

> **destroy**(): `void`

Defined in: [src/landscape/core/scatter/AScatterType.ts:535](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterType.ts#L535)

스캐터 타입의 세그먼트 할당 참조를 해제합니다.

#### Returns

`void`

***

***

### onParameterChanged()

> `abstract` **onParameterChanged**(`prop`): `void`

Defined in: [src/landscape/core/scatter/AScatterType.ts:529](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterType.ts#L529)

스캐터 타입의 파라미터가 변경되었을 때 서브클래스에서 UBO 갱신 또는 리베이킹을 처리하기 위한 추상 훅 메서드입니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `prop` | `string` | 변경된 프로퍼티 이름 |

#### Returns

`void`

***

***

### setRawScatterProperties()

> **setRawScatterProperties**(`values`): `void`

Defined in: [src/landscape/core/scatter/AScatterType.ts:477](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterType.ts#L477)

`onParameterChanged` 콜백을 트리거하지 않고 스캐터 속성들의 내부 원시 값을 일괄 설정합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `values` | \{ `bottomOffset?`: `number`; `castShadow?`: `boolean`; `cullingDistance?`: `number`; `densityMultiplier?`: `number`; `densityPerHectare?`: `number`; `densityScaleByWeight?`: `boolean`; `groundBlendStrength?`: `number`; `height?`: `number`; `maxSlope?`: `number`; `minSlope?`: `number`; `shadowCullDistance?`: `number`; `targetLayer?`: `string` \| `number`; \} | 일괄 설정할 스캐터 속성 값 객체 |
| `values.bottomOffset?` | `number` | - |
| `values.castShadow?` | `boolean` | - |
| `values.cullingDistance?` | `number` | - |
| `values.densityMultiplier?` | `number` | - |
| `values.densityPerHectare?` | `number` | - |
| `values.densityScaleByWeight?` | `boolean` | - |
| `values.groundBlendStrength?` | `number` | - |
| `values.height?` | `number` | - |
| `values.maxSlope?` | `number` | - |
| `values.minSlope?` | `number` | - |
| `values.shadowCullDistance?` | `number` | - |
| `values.targetLayer?` | `string` \| `number` | - |

#### Returns

`void`

***

## 상속받은 속성

<details>
<summary>상속받은 속성 보기 (클릭하여 확장)</summary>

### antialiasingManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **antialiasingManager**(): [`AntialiasingManager`](../../../../../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:80](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L80)

안티앨리어싱 설정을 관리하는 `AntialiasingManager` 인스턴스를 반환합니다.

##### Returns

[`AntialiasingManager`](../../../../../../Antialiasing/classes/AntialiasingManager.md)

`AntialiasingManager` 인스턴스

#### Inherited from

[`RedGPUObject`](../../../../../../BaseObject/classes/RedGPUObject.md).[`antialiasingManager`](../../../../../../BaseObject/classes/RedGPUObject.md#antialiasingmanager)

***

***

### commandEncoderManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **commandEncoderManager**(): [`CommandEncoderManager`](../../../../../../CommandEncoderManager/classes/CommandEncoderManager.md)

Defined in: [src/base/RedGPUObject.ts:92](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L92)

WebGPU 커맨드 인코딩을 관리하는 `CommandEncoderManager` 인스턴스를 반환합니다.

##### Returns

[`CommandEncoderManager`](../../../../../../CommandEncoderManager/classes/CommandEncoderManager.md)

`CommandEncoderManager` 인스턴스

#### Inherited from

[`RedGPUObject`](../../../../../../BaseObject/classes/RedGPUObject.md).[`commandEncoderManager`](../../../../../../BaseObject/classes/RedGPUObject.md#commandencodermanager)

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

[`RedGPUObject`](../../../../../../BaseObject/classes/RedGPUObject.md).[`gpuDevice`](../../../../../../BaseObject/classes/RedGPUObject.md#gpudevice)

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

[`RedGPUObject`](../../../../../../BaseObject/classes/RedGPUObject.md).[`instanceId`](../../../../../../BaseObject/classes/RedGPUObject.md#instanceid)

***

***

### redGPUContext

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **redGPUContext**(): [`RedGPUContext`](../../../../../../Context/classes/RedGPUContext.md)

Defined in: [src/base/RedGPUObject.ts:44](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L44)

바인딩된 `RedGPUContext` 인스턴스를 반환합니다.

##### Returns

[`RedGPUContext`](../../../../../../Context/classes/RedGPUContext.md)

`RedGPUContext` 인스턴스

#### Inherited from

[`RedGPUObject`](../../../../../../BaseObject/classes/RedGPUObject.md).[`redGPUContext`](../../../../../../BaseObject/classes/RedGPUObject.md#redgpucontext)

***

***

### resourceManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **resourceManager**(): [`ResourceManager`](../../../../../../Resource/namespaces/Core/classes/ResourceManager.md)

Defined in: [src/base/RedGPUObject.ts:68](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L68)

전역 GPU 리소스를 관리하는 `ResourceManager` 인스턴스를 반환합니다.

##### Returns

[`ResourceManager`](../../../../../../Resource/namespaces/Core/classes/ResourceManager.md)

`ResourceManager` 인스턴스

#### Inherited from

[`RedGPUObject`](../../../../../../BaseObject/classes/RedGPUObject.md).[`resourceManager`](../../../../../../BaseObject/classes/RedGPUObject.md#resourcemanager)

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

[`RedGPUObject`](../../../../../../BaseObject/classes/RedGPUObject.md).[`uuid`](../../../../../../BaseObject/classes/RedGPUObject.md#uuid)

</details>
