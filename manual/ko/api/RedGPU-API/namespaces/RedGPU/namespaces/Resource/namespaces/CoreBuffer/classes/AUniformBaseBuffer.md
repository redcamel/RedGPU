[**RedGPU API v4.4.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Resource](../../../README.md) / [CoreBuffer](../README.md) / AUniformBaseBuffer

# Abstract Class: AUniformBaseBuffer

Defined in: [src/resources/buffer/core/AUniformBaseBuffer.ts:23](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/buffer/core/AUniformBaseBuffer.ts#L23)

유니폼 버퍼 리소스의 기본 추상 클래스입니다.

CPU 측 `ArrayBuffer`와 `Float32Array`/`Uint32Array` 뷰를 함께 보관합니다.

::: warning
이 클래스는 추상 클래스이므로 직접 인스턴스를 생성할 수 없습니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
:::

## Extends

- [`ABaseBuffer`](ABaseBuffer.md)

## Extended by

- [`StorageBuffer`](../../../classes/StorageBuffer.md)
- [`UniformBuffer`](../../../classes/UniformBuffer.md)

## Constructors



***

### Constructor

> `protected` **new AUniformBaseBuffer**(`redGPUContext`, `MANAGED_STATE_KEY`, `usage`, `data`, `label?`): `AUniformBaseBuffer`

Defined in: [src/resources/buffer/core/AUniformBaseBuffer.ts:49](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/buffer/core/AUniformBaseBuffer.ts#L49)

GPU 유니폼 버퍼를 생성하고 초기 데이터를 기록합니다.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) | `undefined` | RedGPUContext 인스턴스 |
| `MANAGED_STATE_KEY` | `string` | `undefined` | 리소스 매니저의 관리 상태 키 |
| `usage` | `number` | `undefined` | GPU 버퍼 사용 플래그 |
| `data` | `ArrayBuffer` | `undefined` | 초기 버퍼 데이터 (`ArrayBuffer`) |
| `label?` | `string` | `''` | 디버그용 레이블 (기본값: 빈 문자열) |

#### Returns

`AUniformBaseBuffer`

#### Overrides

[`ABaseBuffer`](ABaseBuffer.md).[`constructor`](ABaseBuffer.md#constructor)

## Properties



***

### \[GPU\_BUFFER\_DATA\_SYMBOL\]

> **\[GPU\_BUFFER\_DATA\_SYMBOL\]**: `ArrayBuffer`

Defined in: [src/resources/buffer/core/AUniformBaseBuffer.ts:24](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/buffer/core/AUniformBaseBuffer.ts#L24)

***

## Accessors



***

### data

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **data**(): `ArrayBuffer`

Defined in: [src/resources/buffer/core/AUniformBaseBuffer.ts:94](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/buffer/core/AUniformBaseBuffer.ts#L94)

CPU 측 버퍼 데이터를 반환합니다.

##### Returns

`ArrayBuffer`

버퍼 데이터 (`ArrayBuffer`)

***

***

### dataViewF32

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **dataViewF32**(): `Float32Array`

Defined in: [src/resources/buffer/core/AUniformBaseBuffer.ts:106](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/buffer/core/AUniformBaseBuffer.ts#L106)

버퍼 데이터의 `Float32Array` 뷰를 반환합니다.

##### Returns

`Float32Array`

`Float32Array` 뷰

***

***

### dataViewU32

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **dataViewU32**(): `Uint32Array`

Defined in: [src/resources/buffer/core/AUniformBaseBuffer.ts:118](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/buffer/core/AUniformBaseBuffer.ts#L118)

버퍼 데이터의 `Uint32Array` 뷰를 반환합니다.

##### Returns

`Uint32Array`

`Uint32Array` 뷰

***

***

### label

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **label**(): `string`

Defined in: [src/resources/buffer/core/AUniformBaseBuffer.ts:82](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/buffer/core/AUniformBaseBuffer.ts#L82)

버퍼 디버그 레이블을 반환합니다.

##### Returns

`string`

레이블 문자열

***

***

### size

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **size**(): `number`

Defined in: [src/resources/buffer/core/AUniformBaseBuffer.ts:130](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/buffer/core/AUniformBaseBuffer.ts#L130)

버퍼 크기(byte)를 반환합니다.

##### Returns

`number`

바이트 크기

#### Overrides

[`ABaseBuffer`](ABaseBuffer.md).[`size`](ABaseBuffer.md#size)

***

***

### uniformBufferDescriptor

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **uniformBufferDescriptor**(): `GPUBufferDescriptor`

Defined in: [src/resources/buffer/core/AUniformBaseBuffer.ts:142](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/buffer/core/AUniformBaseBuffer.ts#L142)

버퍼 생성에 사용된 디스크립터를 반환합니다.

##### Returns

`GPUBufferDescriptor`

`GPUBufferDescriptor` 객체

***

## Methods



***

### destroy()

> **destroy**(): `void`

Defined in: [src/resources/buffer/core/AUniformBaseBuffer.ts:150](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/buffer/core/AUniformBaseBuffer.ts#L150)

GPU 버퍼와 데이터 뷰를 해제합니다. 중복 호출 시 무시됩니다.

#### Returns

`void`

#### Overrides

[`ABaseBuffer`](ABaseBuffer.md).[`destroy`](ABaseBuffer.md#destroy)

***

***

### writeOnlyBuffer()

> **writeOnlyBuffer**(`target`, `value`): `void`

Defined in: [src/resources/buffer/core/AUniformBaseBuffer.ts:173](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/buffer/core/AUniformBaseBuffer.ts#L173)

지정한 유니폼 위치에 값을 GPU 버퍼로 직접 기록합니다.

boolean 값은 1 또는 0으로 변환됩니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `target` | `any` | 대상 유니폼 정보 (`View` 생성자와 `uniformOffset` 포함) |
| `value` | `any` | 기록할 값 (number, boolean 또는 배열) |

#### Returns

`void`

***

## 상속받은 속성

<details>
<summary>상속받은 속성 보기 (클릭하여 확장)</summary>

### \[GPU\_BUFFER\_CACHE\_KEY\]

> **\[GPU\_BUFFER\_CACHE\_KEY\]**: `string`

Defined in: [src/resources/buffer/core/ABaseBuffer.ts:23](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/buffer/core/ABaseBuffer.ts#L23)

#### Inherited from

[`ABaseBuffer`](ABaseBuffer.md).[`[GPU_BUFFER_CACHE_KEY]`](ABaseBuffer.md#gpu_buffer_cache_key)

***

***

### \[GPU\_BUFFER\_SYMBOL\]

> **\[GPU\_BUFFER\_SYMBOL\]**: `GPUBuffer`

Defined in: [src/resources/buffer/core/ABaseBuffer.ts:22](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/buffer/core/ABaseBuffer.ts#L22)

#### Inherited from

[`ABaseBuffer`](ABaseBuffer.md).[`[GPU_BUFFER_SYMBOL]`](ABaseBuffer.md#gpu_buffer_symbol)

***

### antialiasingManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **antialiasingManager**(): [`AntialiasingManager`](../../../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:80](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L80)

안티앨리어싱 설정을 관리하는 `AntialiasingManager` 인스턴스를 반환합니다.

##### Returns

[`AntialiasingManager`](../../../../Antialiasing/classes/AntialiasingManager.md)

`AntialiasingManager` 인스턴스

#### Inherited from

[`ABaseBuffer`](ABaseBuffer.md).[`antialiasingManager`](ABaseBuffer.md#antialiasingmanager)

***

***

### cacheKey

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **cacheKey**(): `string`

Defined in: [src/resources/buffer/core/ABaseBuffer.ts:57](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/buffer/core/ABaseBuffer.ts#L57)

버퍼 캐시 키를 반환합니다. 지정되지 않은 경우 uuid를 반환합니다.

##### Returns

`string`

캐시 키

#### Inherited from

[`ABaseBuffer`](ABaseBuffer.md).[`cacheKey`](ABaseBuffer.md#cachekey)

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

[`ABaseBuffer`](ABaseBuffer.md).[`commandEncoderManager`](ABaseBuffer.md#commandencodermanager)

***

***

### gpuBuffer

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **gpuBuffer**(): `GPUBuffer`

Defined in: [src/resources/buffer/core/ABaseBuffer.ts:69](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/buffer/core/ABaseBuffer.ts#L69)

내부 GPUBuffer 객체를 반환합니다.

##### Returns

`GPUBuffer`

GPUBuffer 객체

#### Inherited from

[`ABaseBuffer`](ABaseBuffer.md).[`gpuBuffer`](ABaseBuffer.md#gpubuffer)

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

[`ABaseBuffer`](ABaseBuffer.md).[`gpuDevice`](ABaseBuffer.md#gpudevice)

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

[`ABaseBuffer`](ABaseBuffer.md).[`instanceId`](ABaseBuffer.md#instanceid)

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

[`ABaseBuffer`](ABaseBuffer.md).[`name`](ABaseBuffer.md#name)

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

[`ABaseBuffer`](ABaseBuffer.md).[`redGPUContext`](ABaseBuffer.md#redgpucontext)

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

[`ABaseBuffer`](ABaseBuffer.md).[`resourceManager`](ABaseBuffer.md#resourcemanager)

***

***

### resourceManagerKey

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **resourceManagerKey**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:77](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/ResourceBase.ts#L77)

리소스 매니저 키를 반환합니다.

##### Returns

`string`

리소스 매니저 키 문자열

#### Inherited from

[`ABaseBuffer`](ABaseBuffer.md).[`resourceManagerKey`](ABaseBuffer.md#resourcemanagerkey)

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

[`ABaseBuffer`](ABaseBuffer.md).[`revision`](ABaseBuffer.md#revision)

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

[`ABaseBuffer`](ABaseBuffer.md).[`targetResourceManagedState`](ABaseBuffer.md#targetresourcemanagedstate)

***

***

### usage

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **usage**(): `number`

Defined in: [src/resources/buffer/core/ABaseBuffer.ts:81](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/buffer/core/ABaseBuffer.ts#L81)

GPU 버퍼 사용 플래그를 반환합니다.

##### Returns

`number`

GPUBufferUsageFlags 값

#### Inherited from

[`ABaseBuffer`](ABaseBuffer.md).[`usage`](ABaseBuffer.md#usage)

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

[`ABaseBuffer`](ABaseBuffer.md).[`uuid`](ABaseBuffer.md#uuid)

***

***

### videoMemorySize

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **videoMemorySize**(): `number`

Defined in: [src/resources/buffer/core/ABaseBuffer.ts:105](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/buffer/core/ABaseBuffer.ts#L105)

비디오 메모리 사용량(byte)을 반환합니다.

##### Returns

`number`

비디오 메모리 사용량

#### Inherited from

[`ABaseBuffer`](ABaseBuffer.md).[`videoMemorySize`](ABaseBuffer.md#videomemorysize)

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

[`ABaseBuffer`](ABaseBuffer.md).[`__addDirtyPipelineListener`](ABaseBuffer.md#__adddirtypipelinelistener)

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

[`ABaseBuffer`](ABaseBuffer.md).[`__removeDirtyPipelineListener`](ABaseBuffer.md#__removedirtypipelinelistener)

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

[`ABaseBuffer`](ABaseBuffer.md).[`notifyUpdate`](ABaseBuffer.md#notifyupdate)

***

</details>
