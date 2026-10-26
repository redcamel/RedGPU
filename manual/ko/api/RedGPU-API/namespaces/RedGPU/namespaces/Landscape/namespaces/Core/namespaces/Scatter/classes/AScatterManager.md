[**RedGPU API v4.4.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [Landscape](../../../../../README.md) / [Core](../../../README.md) / [Scatter](../README.md) / AScatterManager

# Abstract Class: AScatterManager\<TType, TOptions\>

Defined in: [src/landscape/core/scatter/AScatterManager.ts:26](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterManager.ts#L26)

지형 스캐터(식생, 잔디 등) 타입들의 등록, 생명주기, GPU 베이킹/컬링 업데이트 및 렌더링을 총괄하는 추상 매니저 클래스입니다.

::: warning
이 클래스는 추상 클래스이므로 직접 인스턴스를 생성할 수 없습니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
:::

## Extends

- [`RedGPUObject`](../../../../../../BaseObject/classes/RedGPUObject.md)

## Extended by

- [`FoliageManager`](../../../../Foliage/classes/FoliageManager.md)
- [`GrassManager`](../../../../Grass/classes/GrassManager.md)

## Type Parameters

| Type Parameter | Default type | Description |
| ------ | ------ | ------ |
| <a id="type-parameter-ttype"></a> `TType` *extends* [`AScatterType`](AScatterType.md) | [`AScatterType`](AScatterType.md) | 매니저가 관리하는 스캐터 타입 클래스 (`AScatterType`의 서브클래스) |
| <a id="type-parameter-toptions"></a> `TOptions` *extends* [`AScatterTypeInitOptions`](../interfaces/AScatterTypeInitOptions.md) | [`AScatterTypeInitOptions`](../interfaces/AScatterTypeInitOptions.md) | 스캐터 타입 생성 시 전달되는 초기화 옵션 인터페이스 (`AScatterTypeInitOptions`의 서브타입) |

## Constructors



***

### Constructor

> **new AScatterManager**\<`TType`, `TOptions`\>(`landscape`): `AScatterManager`\<`TType`, `TOptions`\>

Defined in: [src/landscape/core/scatter/AScatterManager.ts:44](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterManager.ts#L44)

`AScatterManager` 인스턴스를 초기화합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `landscape` | [`Landscape`](../../../../../classes/Landscape.md) | 이 스캐터 매니저를 소유하는 대상 `Landscape` 인스턴스 |

#### Returns

`AScatterManager`\<`TType`, `TOptions`\>

#### Overrides

[`RedGPUObject`](../../../../../../BaseObject/classes/RedGPUObject.md).[`constructor`](../../../../../../BaseObject/classes/RedGPUObject.md#constructor)

## Accessors



***

### enabled

#### Get Signature

> **get** **enabled**(): `boolean`

Defined in: [src/landscape/core/scatter/AScatterManager.ts:69](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterManager.ts#L69)

스캐터 매니저의 활성화 여부를 반환하거나 설정합니다.

##### Returns

`boolean`

활성화 여부

#### Set Signature

> **set** **enabled**(`val`): `void`

Defined in: [src/landscape/core/scatter/AScatterManager.ts:73](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterManager.ts#L73)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `val` | `boolean` |

##### Returns

`void`

***

***

### instanceCapacity

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** `abstract` **instanceCapacity**(): `number`

Defined in: [src/landscape/core/scatter/AScatterManager.ts:107](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterManager.ts#L107)

메가 버퍼에 확보된 최대 인스턴스 수용량(Capacity)을 반환합니다.

##### Returns

`number`

최대 인스턴스 수용량

***

***

### landscape

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **landscape**(): [`Landscape`](../../../../../classes/Landscape.md)

Defined in: [src/landscape/core/scatter/AScatterManager.ts:57](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterManager.ts#L57)

이 스캐터 매니저가 속한 `Landscape` 인스턴스를 반환합니다.

##### Returns

[`Landscape`](../../../../../classes/Landscape.md)

소유자 `Landscape` 인스턴스

***

***

### shadowDrawCalls

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **shadowDrawCalls**(): `number`

Defined in: [src/landscape/core/scatter/AScatterManager.ts:136](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterManager.ts#L136)

그림자 투사(`castShadow`)가 활성화된 모든 스캐터 타입의 총 그림자 패스 드로우콜 수를 반환합니다.

##### Returns

`number`

총 그림자 패스 드로우콜 수

***

***

### totalDrawCalls

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **totalDrawCalls**(): `number`

Defined in: [src/landscape/core/scatter/AScatterManager.ts:117](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterManager.ts#L117)

활성 상태에서 등록된 모든 스캐터 타입의 총 메인 패스 드로우콜 수를 반환합니다.

##### Returns

`number`

총 메인 패스 드로우콜 수

***

***

### totalInstanceCount

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** `abstract` **totalInstanceCount**(): `number`

Defined in: [src/landscape/core/scatter/AScatterManager.ts:97](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterManager.ts#L97)

할당된 전체 스캐터 인스턴스 수를 반환합니다.

##### Returns

`number`

전체 인스턴스 수

***

***

### types

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **types**(): `TType`[]

Defined in: [src/landscape/core/scatter/AScatterManager.ts:85](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterManager.ts#L85)

현재 등록된 모든 스캐터 타입(`TType[]`) 목록을 반환합니다.

##### Returns

`TType`[]

등록된 스캐터 타입 배열 (`TType[]`)

***

## Methods



***

### addType()

> `abstract` **addType**(`options`): `TType`

Defined in: [src/landscape/core/scatter/AScatterManager.ts:214](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterManager.ts#L214)

새로운 스캐터 타입을 생성하여 매니저에 등록합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options` | `TOptions` | 스캐터 타입 초기화 옵션 |

#### Returns

`TType`

생성 및 등록된 스캐터 타입 인스턴스

***

***

### clearTypes()

> **clearTypes**(): `void`

Defined in: [src/landscape/core/scatter/AScatterManager.ts:195](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterManager.ts#L195)

등록된 모든 스캐터 타입을 순차적으로 제거하고 내부 맵을 초기화합니다.

#### Returns

`void`

***

***

### computeTypeDrawCalls()

> `abstract` **computeTypeDrawCalls**(`type`): `number`

Defined in: [src/landscape/core/scatter/AScatterManager.ts:161](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterManager.ts#L161)

개별 스캐터 타입의 메인 렌더 패스 드로우콜 수를 계산합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `type` | `TType` | 드로우콜 수를 계산할 대상 스캐터 타입 |

#### Returns

`number`

해당 타입의 메인 패스 드로우콜 수

***

***

### computeTypeShadowDrawCalls()

> `abstract` **computeTypeShadowDrawCalls**(`type`): `number`

Defined in: [src/landscape/core/scatter/AScatterManager.ts:174](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterManager.ts#L174)

개별 스캐터 타입의 그림자 렌더 패스 드로우콜 수를 계산합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `type` | `TType` | 그림자 드로우콜 수를 계산할 대상 스캐터 타입 |

#### Returns

`number`

해당 타입의 그림자 패스 드로우콜 수

***

***

### destroy()

> `abstract` **destroy**(): `void`

Defined in: [src/landscape/core/scatter/AScatterManager.ts:275](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterManager.ts#L275)

매니저가 관리하는 모든 스캐터 타입과 GPU 리소스를 파기합니다.

#### Returns

`void`

***

***

### getTypeByName()

> **getTypeByName**(`name`): `TType`

Defined in: [src/landscape/core/scatter/AScatterManager.ts:187](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterManager.ts#L187)

고유 이름으로 등록된 스캐터 타입 인스턴스를 조회합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `name` | `string` | 조회할 스캐터 타입 이름 |

#### Returns

`TType`

일치하는 스캐터 타입 인스턴스 또는 존재하지 않을 경우 `undefined`

***

***

### rebakeAll()

> `abstract` **rebakeAll**(): `void`

Defined in: [src/landscape/core/scatter/AScatterManager.ts:233](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterManager.ts#L233)

등록된 모든 스캐터 타입의 인스턴스 배치를 처음부터 다시 베이킹하도록 요청합니다.

#### Returns

`void`

***

***

### registerTypeInternal()

> **registerTypeInternal**(`type`): `void`

Defined in: [src/landscape/core/scatter/AScatterManager.ts:285](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterManager.ts#L285)

스캐터 타입 인스턴스를 내부 배열 및 이름 맵(`Map<string, TType>`)에 등록합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `type` | `TType` | 등록할 스캐터 타입 인스턴스 |

#### Returns

`void`

***

***

### removeType()

> `abstract` **removeType**(`target`): `boolean`

Defined in: [src/landscape/core/scatter/AScatterManager.ts:227](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterManager.ts#L227)

지정된 스캐터 타입 인스턴스 또는 이름에 해당하는 타입을 매니저에서 제거합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `target` | `string` \| `TType` | 제거할 스캐터 타입 인스턴스 또는 타입 이름 문자열 |

#### Returns

`boolean`

제거 성공 여부

***

***

### render()

> `abstract` **render**(`view`, `passEncoder`): `void`

Defined in: [src/landscape/core/scatter/AScatterManager.ts:256](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterManager.ts#L256)

메인 렌더 패스에서 가시 스캐터 인스턴스들을 렌더링합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../../../../../Display/classes/View3D.md) | 현재 렌더링 중인 `View3D` 인스턴스 |
| `passEncoder` | `GPURenderPassEncoder` | 메인 렌더 패스 인코더 |

#### Returns

`void`

***

***

### renderShadow()

> `abstract` **renderShadow**(`view`, `passEncoder`): `void`

Defined in: [src/landscape/core/scatter/AScatterManager.ts:269](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterManager.ts#L269)

디렉셔널 그림자 렌더 패스에서 그림자 투사 스캐터 인스턴스들을 렌더링합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../../../../../Display/classes/View3D.md) | 현재 렌더링 중인 `View3D` 인스턴스 |
| `passEncoder` | `GPURenderPassEncoder` | 그림자 렌더 패스 인코더 |

#### Returns

`void`

***

***

### unregisterTypeInternal()

> **unregisterTypeInternal**(`target`): `TType`

Defined in: [src/landscape/core/scatter/AScatterManager.ts:302](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterManager.ts#L302)

내부 배열 및 이름 맵(`Map<string, TType>`)에서 대상 스캐터 타입의 등록을 해제하고 반환합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `target` | `string` \| `TType` | 등록 해제할 스캐터 타입 인스턴스 또는 타입 이름 문자열 |

#### Returns

`TType`

등록 해제된 스캐터 타입 인스턴스 또는 찾지 못한 경우 `null`

***

***

### update()

> `abstract` **update**(`renderViewStateData`): `void`

Defined in: [src/landscape/core/scatter/AScatterManager.ts:243](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterManager.ts#L243)

매 프레임 뷰 상태 데이터를 기반으로 스캐터 베이킹 및 GPU 컬링 파이프라인을 업데이트합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `renderViewStateData` | [`RenderViewStateData`](../../../../../../Display/namespaces/CoreView/classes/RenderViewStateData.md) | 현재 프레임의 뷰 렌더링 상태 데이터 |

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

[`RedGPUObject`](../../../../../../BaseObject/classes/RedGPUObject.md).[`name`](../../../../../../BaseObject/classes/RedGPUObject.md#name)

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
