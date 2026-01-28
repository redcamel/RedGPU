[**RedGPU API v3.9.1-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Resource](../../../README.md) / [CoreBuffer](../README.md) / AUniformBaseBuffer

# Abstract Class: AUniformBaseBuffer

Defined in: [src/resources/buffer/core/AUniformBaseBuffer.ts:20](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/buffer/core/AUniformBaseBuffer.ts#L20)

유니폼 버퍼 리소스의 기본 추상 클래스입니다.


::: warning
이 클래스는 추상 클래스이므로 직접 인스턴스를 생성할 수 없습니다.<br/>상속을 통해 사용하십시오.

:::

## Extends

- [`ABaseBuffer`](ABaseBuffer.md)

## Extended by

- [`StorageBuffer`](../../../classes/StorageBuffer.md)
- [`UniformBuffer`](../../../classes/UniformBuffer.md)

## Constructors

### Constructor

> `protected` **new AUniformBaseBuffer**(`redGPUContext`, `MANAGED_STATE_KEY`, `usage`, `data`, `label`): `AUniformBaseBuffer`

Defined in: [src/resources/buffer/core/AUniformBaseBuffer.ts:44](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/buffer/core/AUniformBaseBuffer.ts#L44)

AUniformBaseBuffer 인스턴스를 초기화합니다.


#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) | `undefined` | RedGPUContext 인스턴스
| `MANAGED_STATE_KEY` | `string` | `undefined` | 관리 상태 키
| `usage` | `number` | `undefined` | GPU 버퍼 사용 플래그
| `data` | `ArrayBuffer` | `undefined` | 버퍼에 할당할 데이터 (`ArrayBuffer`)
| `label` | `string` | `''` | 디버그용 레이블 (선택)

#### Returns

`AUniformBaseBuffer`

#### Overrides

[`ABaseBuffer`](ABaseBuffer.md).[`constructor`](ABaseBuffer.md#constructor)

## Properties

### \[GPU\_BUFFER\_CACHE\_KEY\]

> **\[GPU\_BUFFER\_CACHE\_KEY\]**: `string`

Defined in: [src/resources/buffer/core/ABaseBuffer.ts:23](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/buffer/core/ABaseBuffer.ts#L23)

#### Inherited from

[`ABaseBuffer`](ABaseBuffer.md).[`[GPU_BUFFER_CACHE_KEY]`](ABaseBuffer.md#gpu_buffer_cache_key)

***

### \[GPU\_BUFFER\_DATA\_SYMBOL\]

> **\[GPU\_BUFFER\_DATA\_SYMBOL\]**: `ArrayBuffer`

Defined in: [src/resources/buffer/core/AUniformBaseBuffer.ts:21](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/buffer/core/AUniformBaseBuffer.ts#L21)

***

### \[GPU\_BUFFER\_SYMBOL\]

> **\[GPU\_BUFFER\_SYMBOL\]**: `GPUBuffer`

Defined in: [src/resources/buffer/core/ABaseBuffer.ts:22](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/buffer/core/ABaseBuffer.ts#L22)

#### Inherited from

[`ABaseBuffer`](ABaseBuffer.md).[`[GPU_BUFFER_SYMBOL]`](ABaseBuffer.md#gpu_buffer_symbol)

## Accessors

### cacheKey

#### Get Signature

> **get** **cacheKey**(): `string`

Defined in: [src/resources/buffer/core/ABaseBuffer.ts:52](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/buffer/core/ABaseBuffer.ts#L52)

캐시 키를 반환합니다.


##### Returns

`string`

#### Inherited from

[`ABaseBuffer`](ABaseBuffer.md).[`cacheKey`](ABaseBuffer.md#cachekey)

***

### data

#### Get Signature

> **get** **data**(): `ArrayBuffer`

Defined in: [src/resources/buffer/core/AUniformBaseBuffer.ts:73](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/buffer/core/AUniformBaseBuffer.ts#L73)

버퍼 데이터(`ArrayBuffer`)를 반환합니다.


##### Returns

`ArrayBuffer`

***

### dataViewF32

#### Get Signature

> **get** **dataViewF32**(): `Float32Array`

Defined in: [src/resources/buffer/core/AUniformBaseBuffer.ts:81](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/buffer/core/AUniformBaseBuffer.ts#L81)

버퍼 데이터를 `Float32Array` 뷰로 반환합니다.


##### Returns

`Float32Array`

***

### dataViewU32

#### Get Signature

> **get** **dataViewU32**(): `Uint32Array`

Defined in: [src/resources/buffer/core/AUniformBaseBuffer.ts:89](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/buffer/core/AUniformBaseBuffer.ts#L89)

버퍼 데이터를 `Uint32Array` 뷰로 반환합니다.


##### Returns

`Uint32Array`

***

### gpuBuffer

#### Get Signature

> **get** **gpuBuffer**(): `GPUBuffer`

Defined in: [src/resources/buffer/core/ABaseBuffer.ts:60](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/buffer/core/ABaseBuffer.ts#L60)

GPUBuffer 객체를 반환합니다.


##### Returns

`GPUBuffer`

#### Inherited from

[`ABaseBuffer`](ABaseBuffer.md).[`gpuBuffer`](ABaseBuffer.md#gpubuffer)

***

### gpuDevice

#### Get Signature

> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/resources/core/ResourceBase.ts:106](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/core/ResourceBase.ts#L106)

연관된 GPU 디바이스를 반환합니다.


##### Returns

`GPUDevice`

#### Inherited from

[`ABaseBuffer`](ABaseBuffer.md).[`gpuDevice`](ABaseBuffer.md#gpudevice)

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:81](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/core/ResourceBase.ts#L81)

인스턴스의 이름을 반환합니다. 이름이 없으면 클래스명과 ID로 생성합니다.


##### Returns

`string`

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/resources/core/ResourceBase.ts:90](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/core/ResourceBase.ts#L90)

인스턴스의 이름을 설정합니다.


##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

##### Returns

`void`

#### Inherited from

[`ABaseBuffer`](ABaseBuffer.md).[`name`](ABaseBuffer.md#name)

***

### redGPUContext

#### Get Signature

> **get** **redGPUContext**(): [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md)

Defined in: [src/resources/core/ResourceBase.ts:114](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/core/ResourceBase.ts#L114)

RedGPUContext 인스턴스를 반환합니다.


##### Returns

[`RedGPUContext`](../../../../Context/classes/RedGPUContext.md)

#### Inherited from

[`ABaseBuffer`](ABaseBuffer.md).[`redGPUContext`](ABaseBuffer.md#redgpucontext)

***

### resourceManagerKey

#### Get Signature

> **get** **resourceManagerKey**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:73](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/core/ResourceBase.ts#L73)

리소스 매니저 키를 반환합니다.


##### Returns

`string`

#### Inherited from

[`ABaseBuffer`](ABaseBuffer.md).[`resourceManagerKey`](ABaseBuffer.md#resourcemanagerkey)

***

### size

#### Get Signature

> **get** **size**(): `number`

Defined in: [src/resources/buffer/core/AUniformBaseBuffer.ts:97](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/buffer/core/AUniformBaseBuffer.ts#L97)

버퍼 크기를 반환합니다.


##### Returns

`number`

#### Overrides

[`ABaseBuffer`](ABaseBuffer.md).[`size`](ABaseBuffer.md#size)

***

### targetResourceManagedState

#### Get Signature

> **get** **targetResourceManagedState**(): [`ResourceStatusInfo`](../../Core/classes/ResourceStatusInfo.md)

Defined in: [src/resources/core/ManagementResourceBase.ts:45](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/core/ManagementResourceBase.ts#L45)

리소스의 관리 상태 정보를 반환합니다.


##### Returns

[`ResourceStatusInfo`](../../Core/classes/ResourceStatusInfo.md)

#### Inherited from

[`ABaseBuffer`](ABaseBuffer.md).[`targetResourceManagedState`](ABaseBuffer.md#targetresourcemanagedstate)

***

### uniformBufferDescriptor

#### Get Signature

> **get** **uniformBufferDescriptor**(): `GPUBufferDescriptor`

Defined in: [src/resources/buffer/core/AUniformBaseBuffer.ts:105](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/buffer/core/AUniformBaseBuffer.ts#L105)

`GPUBufferDescriptor`를 반환합니다.


##### Returns

`GPUBufferDescriptor`

***

### usage

#### Get Signature

> **get** **usage**(): `number`

Defined in: [src/resources/buffer/core/ABaseBuffer.ts:68](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/buffer/core/ABaseBuffer.ts#L68)

GPUBufferUsageFlags를 반환합니다.


##### Returns

`number`

#### Inherited from

[`ABaseBuffer`](ABaseBuffer.md).[`usage`](ABaseBuffer.md#usage)

***

### uuid

#### Get Signature

> **get** **uuid**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:98](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/core/ResourceBase.ts#L98)

고유 식별자(UUID)를 반환합니다.


##### Returns

`string`

#### Inherited from

[`ABaseBuffer`](ABaseBuffer.md).[`uuid`](ABaseBuffer.md#uuid)

***

### videoMemorySize

#### Get Signature

> **get** **videoMemorySize**(): `number`

Defined in: [src/resources/buffer/core/ABaseBuffer.ts:84](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/buffer/core/ABaseBuffer.ts#L84)

비디오 메모리 사용량(byte)을 반환합니다.


##### Returns

`number`

#### Inherited from

[`ABaseBuffer`](ABaseBuffer.md).[`videoMemorySize`](ABaseBuffer.md#videomemorysize)

## Methods

### \_\_addDirtyPipelineListener()

> **\_\_addDirtyPipelineListener**(`listener`): `void`

Defined in: [src/resources/core/ResourceBase.ts:125](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/core/ResourceBase.ts#L125)

파이프라인이 더티해질 때 호출될 리스너를 추가합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `listener` | () => `void` | 리스너 함수

#### Returns

`void`

#### Inherited from

[`ABaseBuffer`](ABaseBuffer.md).[`__addDirtyPipelineListener`](ABaseBuffer.md#__adddirtypipelinelistener)

***

### \_\_fireListenerList()

> **\_\_fireListenerList**(`resetList`): `void`

Defined in: [src/resources/core/ResourceBase.ts:152](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/core/ResourceBase.ts#L152)

등록된 더티 리스너들을 실행합니다.


#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `resetList` | `boolean` | `false` | 실행 후 리스너 목록 초기화 여부 (기본값: false)

#### Returns

`void`

#### Inherited from

[`ABaseBuffer`](ABaseBuffer.md).[`__fireListenerList`](ABaseBuffer.md#__firelistenerlist)

***

### \_\_removeDirtyPipelineListener()

> **\_\_removeDirtyPipelineListener**(`listener`): `void`

Defined in: [src/resources/core/ResourceBase.ts:137](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/core/ResourceBase.ts#L137)

더티 파이프라인 리스너를 제거합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `listener` | () => `void` | 제거할 리스너 함수

#### Returns

`void`

#### Inherited from

[`ABaseBuffer`](ABaseBuffer.md).[`__removeDirtyPipelineListener`](ABaseBuffer.md#__removedirtypipelinelistener)

***

### destroy()

> **destroy**(): `void`

Defined in: [src/resources/buffer/core/ABaseBuffer.ts:92](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/buffer/core/ABaseBuffer.ts#L92)

리소스를 파괴합니다.


#### Returns

`void`

#### Inherited from

[`ABaseBuffer`](ABaseBuffer.md).[`destroy`](ABaseBuffer.md#destroy)

***

### writeOnlyBuffer()

> **writeOnlyBuffer**(`target`, `value`): `void`

Defined in: [src/resources/buffer/core/AUniformBaseBuffer.ts:119](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/buffer/core/AUniformBaseBuffer.ts#L119)

유니폼 버퍼에 데이터를 씁니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `target` | `any` | 대상 유니폼 정보 (View 생성자 및 오프셋 포함)
| `value` | `any` | 쓸 값

#### Returns

`void`
