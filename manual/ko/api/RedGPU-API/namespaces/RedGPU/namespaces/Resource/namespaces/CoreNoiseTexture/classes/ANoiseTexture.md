[**RedGPU API v4.4.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Resource](../../../README.md) / [CoreNoiseTexture](../README.md) / ANoiseTexture

# Abstract Class: ANoiseTexture

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:46](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L46)

::: warning직접 인스턴스 생성 금지
이 클래스는 추상 베이스 클래스로 설계되었으므로 직접 인스턴스를 생성할 수 없습니다.
구체적인 서브클래스(예: `SimplexTexture`)를 인스턴스화하여 사용하십시오.
:::

:::

노이즈 텍스처의 기반이 되는 추상 클래스입니다.

컴퓨트 셰이더를 사용하여 실시간으로 노이즈 패턴을 생성하는 기능을 제공합니다.

## Extends

- [`ManagementResourceBase`](../../Core/classes/ManagementResourceBase.md)

## Extended by

- [`SimplexTexture`](../../../classes/SimplexTexture.md)
- [`VoronoiTexture`](../../../classes/VoronoiTexture.md)

## Constructors



***

### Constructor

> **new ANoiseTexture**(`redGPUContext`, `width?`, `height?`, `define`, `useMipmap?`): `ANoiseTexture`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:90](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L90)

ANoiseTexture 인스턴스를 초기화합니다.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) | `undefined` | RedGPUContext 인스턴스 |
| `width?` | `number` | `1024` | 텍스처 너비 (기본값: 1024) |
| `height?` | `number` | `1024` | 텍스처 높이 (기본값: 1024) |
| `define` | [`NoiseDefine`](../interfaces/NoiseDefine.md) | `undefined` | 노이즈 정의 객체 |
| `useMipmap?` | `boolean` | `true` | 밉맵 사용 여부 (기본값: true) |

#### Returns

`ANoiseTexture`

#### Overrides

[`ManagementResourceBase`](../../Core/classes/ManagementResourceBase.md).[`constructor`](../../Core/classes/ManagementResourceBase.md#constructor)

## Properties



***

### mipLevelCount

> **mipLevelCount**: `number` = `1`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:47](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L47)

***

***

### src

> **src**: `string`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:49](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L49)

***

***

### useMipmap

> **useMipmap**: `boolean` = `true`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:48](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L48)

## Accessors



***

### animationSpeed

#### Get Signature

> **get** **animationSpeed**(): `number`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:132](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L132)

애니메이션 속도를 반환합니다.

##### Returns

`number`

#### Set Signature

> **set** **animationSpeed**(`value`): `void`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:144](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L144)

애니메이션 속도를 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 애니메이션 속도 |

##### Returns

`void`

***

***

### animationX

#### Get Signature

> **get** **animationX**(): `number`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:154](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L154)

X축 애니메이션 값을 반환합니다.

##### Returns

`number`

#### Set Signature

> **set** **animationX**(`value`): `void`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:166](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L166)

X축 애니메이션 값을 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | X축 애니메이션 값 |

##### Returns

`void`

***

***

### animationY

#### Get Signature

> **get** **animationY**(): `number`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:176](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L176)

Y축 애니메이션 값을 반환합니다.

##### Returns

`number`

#### Set Signature

> **set** **animationY**(`value`): `void`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:188](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L188)

Y축 애니메이션 값을 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Y축 애니메이션 값 |

##### Returns

`void`

***

***

### gpuTexture

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **gpuTexture**(): `GPUTexture`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:206](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L206)

GPUTexture 객체를 반환합니다.

##### Returns

`GPUTexture`

***

***

### resourceManagerKey

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **resourceManagerKey**(): `string`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:124](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L124)

리소스 매니저 상태 키를 반환합니다.

##### Returns

`string`

#### Overrides

[`ManagementResourceBase`](../../Core/classes/ManagementResourceBase.md).[`resourceManagerKey`](../../Core/classes/ManagementResourceBase.md#resourcemanagerkey)

***

***

### time

#### Get Signature

> **get** **time**(): `number`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:214](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L214)

현재 시간을 반환합니다.

##### Returns

`number`

#### Set Signature

> **set** **time**(`value`): `void`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:226](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L226)

현재 시간을 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 시간 (밀리초) |

##### Returns

`void`

***

***

### uniformInfo

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **uniformInfo**(): `any`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:198](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L198)

유니폼 정보를 반환합니다.

##### Returns

`any`

***

***

### videoMemorySize

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **videoMemorySize**(): `number`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:116](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L116)

비디오 메모리 사용량(byte)을 반환합니다.

##### Returns

`number`

## Methods



***

### destroy()

> **destroy**(): `void`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:285](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L285)

리소스를 파괴합니다.

#### Returns

`void`

***

***

### render()

> **render**(`time`): `void`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:277](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L277)

지정된 시간으로 노이즈를 렌더링합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `time` | `number` | 렌더링할 시간 |

#### Returns

`void`

***

***

### updateUniform()

> **updateUniform**(`name`, `value`): `void`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:243](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L243)

개별 유니폼 파라미터를 업데이트합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `name` | `string` | 유니폼 이름 |
| `value` | `any` | 설정할 값 |

#### Returns

`void`

***

***

### updateUniforms()

> **updateUniforms**(`uniforms`): `void`

Defined in: [src/resources/texture/noiseTexture/core/ANoiseTexture.ts:259](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/noiseTexture/core/ANoiseTexture.ts#L259)

여러 유니폼 파라미터를 일괄 업데이트합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `uniforms` | `Record`\<`string`, `any`\> | 업데이트할 유니폼 키-값 레코드 |

#### Returns

`void`

***

## 상속받은 속성

<details>
<summary>상속받은 속성 보기 (클릭하여 확장)</summary>

### antialiasingManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **antialiasingManager**(): [`AntialiasingManager`](../../../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:80](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L80)

안티앨리어싱 설정을 관리하는 `AntialiasingManager` 인스턴스를 반환합니다.

##### Returns

[`AntialiasingManager`](../../../../Antialiasing/classes/AntialiasingManager.md)

`AntialiasingManager` 인스턴스

#### Inherited from

[`ManagementResourceBase`](../../Core/classes/ManagementResourceBase.md).[`antialiasingManager`](../../Core/classes/ManagementResourceBase.md#antialiasingmanager)

***

***

### cacheKey

#### Get Signature

> **get** **cacheKey**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:61](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/ResourceBase.ts#L61)

캐시 키를 반환하거나 설정합니다.

##### Returns

`string`

캐시 키 문자열

#### Set Signature

> **set** **cacheKey**(`value`): `void`

Defined in: [src/resources/core/ResourceBase.ts:65](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/ResourceBase.ts#L65)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

##### Returns

`void`

#### Inherited from

[`ManagementResourceBase`](../../Core/classes/ManagementResourceBase.md).[`cacheKey`](../../Core/classes/ManagementResourceBase.md#cachekey)

***

***

### commandEncoderManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **commandEncoderManager**(): [`CommandEncoderManager`](../../../../CommandEncoderManager/classes/CommandEncoderManager.md)

Defined in: [src/base/RedGPUObject.ts:92](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L92)

WebGPU 커맨드 인코딩을 관리하는 `CommandEncoderManager` 인스턴스를 반환합니다.

##### Returns

[`CommandEncoderManager`](../../../../CommandEncoderManager/classes/CommandEncoderManager.md)

`CommandEncoderManager` 인스턴스

#### Inherited from

[`ManagementResourceBase`](../../Core/classes/ManagementResourceBase.md).[`commandEncoderManager`](../../Core/classes/ManagementResourceBase.md#commandencodermanager)

***

***

### gpuDevice

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/resources/core/ResourceBase.ts:89](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/ResourceBase.ts#L89)

연관된 GPUDevice를 반환합니다.

##### Returns

`GPUDevice`

GPUDevice 인스턴스

#### Inherited from

[`ManagementResourceBase`](../../Core/classes/ManagementResourceBase.md).[`gpuDevice`](../../Core/classes/ManagementResourceBase.md#gpudevice)

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

[`ManagementResourceBase`](../../Core/classes/ManagementResourceBase.md).[`instanceId`](../../Core/classes/ManagementResourceBase.md#instanceid)

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

[`ManagementResourceBase`](../../Core/classes/ManagementResourceBase.md).[`name`](../../Core/classes/ManagementResourceBase.md#name)

***

***

### redGPUContext

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **redGPUContext**(): [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md)

Defined in: [src/base/RedGPUObject.ts:44](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L44)

바인딩된 `RedGPUContext` 인스턴스를 반환합니다.

##### Returns

[`RedGPUContext`](../../../../Context/classes/RedGPUContext.md)

`RedGPUContext` 인스턴스

#### Inherited from

[`ManagementResourceBase`](../../Core/classes/ManagementResourceBase.md).[`redGPUContext`](../../Core/classes/ManagementResourceBase.md#redgpucontext)

***

***

### resourceManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **resourceManager**(): [`ResourceManager`](../../Core/classes/ResourceManager.md)

Defined in: [src/base/RedGPUObject.ts:68](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L68)

전역 GPU 리소스를 관리하는 `ResourceManager` 인스턴스를 반환합니다.

##### Returns

[`ResourceManager`](../../Core/classes/ResourceManager.md)

`ResourceManager` 인스턴스

#### Inherited from

[`ManagementResourceBase`](../../Core/classes/ManagementResourceBase.md).[`resourceManager`](../../Core/classes/ManagementResourceBase.md#resourcemanager)

***

***

### revision

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **revision**(): `number`

Defined in: [src/resources/core/ResourceBase.ts:49](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/ResourceBase.ts#L49)

리소스의 리비전(업데이트 횟수)을 반환합니다.

##### Returns

`number`

리소스 리비전 번호

#### Inherited from

[`ManagementResourceBase`](../../Core/classes/ManagementResourceBase.md).[`revision`](../../Core/classes/ManagementResourceBase.md#revision)

***

***

### targetResourceManagedState

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **targetResourceManagedState**(): [`ResourceStatusInfo`](../../Core/classes/ResourceStatusInfo.md)

Defined in: [src/resources/core/ManagementResourceBase.ts:50](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/ManagementResourceBase.ts#L50)

리소스의 관리 상태 정보를 반환합니다.

##### Returns

[`ResourceStatusInfo`](../../Core/classes/ResourceStatusInfo.md)

리소스 관리 상태 정보 객체

#### Inherited from

[`ManagementResourceBase`](../../Core/classes/ManagementResourceBase.md).[`targetResourceManagedState`](../../Core/classes/ManagementResourceBase.md#targetresourcemanagedstate)

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

[`ManagementResourceBase`](../../Core/classes/ManagementResourceBase.md).[`uuid`](../../Core/classes/ManagementResourceBase.md#uuid)

***

</details>


***

## 상속받은 메서드

<details>
<summary>상속받은 메서드 보기 (클릭하여 확장)</summary>

### \_\_addDirtyPipelineListener()

> **\_\_addDirtyPipelineListener**(`listener`): `void`

Defined in: [src/resources/core/ResourceBase.ts:102](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/ResourceBase.ts#L102)

리소스 변경 시 호출될 파이프라인 더티 리스너를 추가합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `listener` | () => `void` | 등록할 리스너 함수 |

#### Returns

`void`

#### Inherited from

[`ManagementResourceBase`](../../Core/classes/ManagementResourceBase.md).[`__addDirtyPipelineListener`](../../Core/classes/ManagementResourceBase.md#__adddirtypipelinelistener)

***

***

### \_\_removeDirtyPipelineListener()

> **\_\_removeDirtyPipelineListener**(`listener`): `void`

Defined in: [src/resources/core/ResourceBase.ts:115](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/ResourceBase.ts#L115)

등록된 파이프라인 더티 리스너를 제거합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `listener` | () => `void` | 제거할 리스너 함수 |

#### Returns

`void`

#### Inherited from

[`ManagementResourceBase`](../../Core/classes/ManagementResourceBase.md).[`__removeDirtyPipelineListener`](../../Core/classes/ManagementResourceBase.md#__removedirtypipelinelistener)

***

***

### notifyUpdate()

> **notifyUpdate**(`resetList?`): `void`

Defined in: [src/resources/core/ResourceBase.ts:131](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/ResourceBase.ts#L131)

리소스가 업데이트되었음을 등록된 리스너들에게 알립니다.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `resetList?` | `boolean` | `false` | 알림 실행 후 리스너 목록 초기화 여부 (기본값: false) |

#### Returns

`void`

#### Inherited from

[`ManagementResourceBase`](../../Core/classes/ManagementResourceBase.md).[`notifyUpdate`](../../Core/classes/ManagementResourceBase.md#notifyupdate)

***

</details>
