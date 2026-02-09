[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Resource](../README.md) / StorageBuffer

# Class: StorageBuffer

Defined in: [src/resources/buffer/storageBuffer/StorageBuffer.ts:18](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/resources/buffer/storageBuffer/StorageBuffer.ts#L18)

Storage 버퍼를 관리하는 클래스입니다.


* ### Example
```typescript
const storageBuffer = new RedGPU.Resource.StorageBuffer(redGPUContext, data);
```

## Extends

- [`AUniformBaseBuffer`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md)

## Constructors

### Constructor

> **new StorageBuffer**(`redGPUContext`, `uniformData`, `label`, `cacheKey`): `StorageBuffer`

Defined in: [src/resources/buffer/storageBuffer/StorageBuffer.ts:41](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/resources/buffer/storageBuffer/StorageBuffer.ts#L41)

StorageBuffer 인스턴스를 생성합니다.


* ### Example
```typescript
const storageBuffer = new RedGPU.Resource.StorageBuffer(redGPUContext, data, 'MyStorageBuffer');
```

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | `undefined` | RedGPUContext 인스턴스
| `uniformData` | `ArrayBuffer` | `undefined` | 업로드할 `ArrayBuffer` 데이터
| `label` | `string` | `''` | 버퍼 레이블 (선택)
| `cacheKey` | `string` | `''` | 버퍼 캐시 키 (선택)

#### Returns

`StorageBuffer`

#### Overrides

[`AUniformBaseBuffer`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md).[`constructor`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md#constructor)

## Properties

### \[GPU\_BUFFER\_CACHE\_KEY\]

> **\[GPU\_BUFFER\_CACHE\_KEY\]**: `string`

Defined in: [src/resources/buffer/core/ABaseBuffer.ts:23](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/resources/buffer/core/ABaseBuffer.ts#L23)

#### Inherited from

[`AUniformBaseBuffer`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md).[`[GPU_BUFFER_CACHE_KEY]`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md#gpu_buffer_cache_key)

***

### \[GPU\_BUFFER\_DATA\_SYMBOL\]

> **\[GPU\_BUFFER\_DATA\_SYMBOL\]**: `ArrayBuffer`

Defined in: [src/resources/buffer/core/AUniformBaseBuffer.ts:21](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/resources/buffer/core/AUniformBaseBuffer.ts#L21)

#### Inherited from

[`AUniformBaseBuffer`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md).[`[GPU_BUFFER_DATA_SYMBOL]`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md#gpu_buffer_data_symbol)

***

### \[GPU\_BUFFER\_SYMBOL\]

> **\[GPU\_BUFFER\_SYMBOL\]**: `GPUBuffer`

Defined in: [src/resources/buffer/core/ABaseBuffer.ts:22](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/resources/buffer/core/ABaseBuffer.ts#L22)

#### Inherited from

[`AUniformBaseBuffer`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md).[`[GPU_BUFFER_SYMBOL]`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md#gpu_buffer_symbol)

## Accessors

### cacheKey

#### Get Signature

> **get** **cacheKey**(): `string`

Defined in: [src/resources/buffer/core/ABaseBuffer.ts:52](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/resources/buffer/core/ABaseBuffer.ts#L52)

캐시 키를 반환합니다.


##### Returns

`string`

#### Inherited from

[`AUniformBaseBuffer`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md).[`cacheKey`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md#cachekey)

***

### data

#### Get Signature

> **get** **data**(): `ArrayBuffer`

Defined in: [src/resources/buffer/core/AUniformBaseBuffer.ts:73](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/resources/buffer/core/AUniformBaseBuffer.ts#L73)

버퍼 데이터(`ArrayBuffer`)를 반환합니다.


##### Returns

`ArrayBuffer`

#### Inherited from

[`AUniformBaseBuffer`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md).[`data`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md#data)

***

### dataViewF32

#### Get Signature

> **get** **dataViewF32**(): `Float32Array`

Defined in: [src/resources/buffer/core/AUniformBaseBuffer.ts:81](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/resources/buffer/core/AUniformBaseBuffer.ts#L81)

버퍼 데이터를 `Float32Array` 뷰로 반환합니다.


##### Returns

`Float32Array`

#### Inherited from

[`AUniformBaseBuffer`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md).[`dataViewF32`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md#dataviewf32)

***

### dataViewU32

#### Get Signature

> **get** **dataViewU32**(): `Uint32Array`

Defined in: [src/resources/buffer/core/AUniformBaseBuffer.ts:89](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/resources/buffer/core/AUniformBaseBuffer.ts#L89)

버퍼 데이터를 `Uint32Array` 뷰로 반환합니다.


##### Returns

`Uint32Array`

#### Inherited from

[`AUniformBaseBuffer`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md).[`dataViewU32`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md#dataviewu32)

***

### gpuBuffer

#### Get Signature

> **get** **gpuBuffer**(): `GPUBuffer`

Defined in: [src/resources/buffer/core/ABaseBuffer.ts:60](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/resources/buffer/core/ABaseBuffer.ts#L60)

GPUBuffer 객체를 반환합니다.


##### Returns

`GPUBuffer`

#### Inherited from

[`AUniformBaseBuffer`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md).[`gpuBuffer`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md#gpubuffer)

***

### gpuDevice

#### Get Signature

> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/resources/core/ResourceBase.ts:106](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/resources/core/ResourceBase.ts#L106)

연관된 GPU 디바이스를 반환합니다.


##### Returns

`GPUDevice`

#### Inherited from

[`AUniformBaseBuffer`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md).[`gpuDevice`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md#gpudevice)

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:81](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/resources/core/ResourceBase.ts#L81)

인스턴스의 이름을 반환합니다. 이름이 없으면 클래스명과 ID로 생성합니다.


##### Returns

`string`

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/resources/core/ResourceBase.ts:90](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/resources/core/ResourceBase.ts#L90)

인스턴스의 이름을 설정합니다.


##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

##### Returns

`void`

#### Inherited from

[`AUniformBaseBuffer`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md).[`name`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md#name)

***

### redGPUContext

#### Get Signature

> **get** **redGPUContext**(): [`RedGPUContext`](../../Context/classes/RedGPUContext.md)

Defined in: [src/resources/core/ResourceBase.ts:114](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/resources/core/ResourceBase.ts#L114)

RedGPUContext 인스턴스를 반환합니다.


##### Returns

[`RedGPUContext`](../../Context/classes/RedGPUContext.md)

#### Inherited from

[`AUniformBaseBuffer`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md).[`redGPUContext`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md#redgpucontext)

***

### resourceManagerKey

#### Get Signature

> **get** **resourceManagerKey**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:73](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/resources/core/ResourceBase.ts#L73)

리소스 매니저 키를 반환합니다.


##### Returns

`string`

#### Inherited from

[`AUniformBaseBuffer`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md).[`resourceManagerKey`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md#resourcemanagerkey)

***

### size

#### Get Signature

> **get** **size**(): `number`

Defined in: [src/resources/buffer/core/AUniformBaseBuffer.ts:97](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/resources/buffer/core/AUniformBaseBuffer.ts#L97)

버퍼 크기를 반환합니다.


##### Returns

`number`

#### Inherited from

[`AUniformBaseBuffer`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md).[`size`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md#size)

***

### targetResourceManagedState

#### Get Signature

> **get** **targetResourceManagedState**(): [`ResourceStatusInfo`](../namespaces/Core/classes/ResourceStatusInfo.md)

Defined in: [src/resources/core/ManagementResourceBase.ts:45](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/resources/core/ManagementResourceBase.ts#L45)

리소스의 관리 상태 정보를 반환합니다.


##### Returns

[`ResourceStatusInfo`](../namespaces/Core/classes/ResourceStatusInfo.md)

#### Inherited from

[`AUniformBaseBuffer`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md).[`targetResourceManagedState`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md#targetresourcemanagedstate)

***

### uniformBufferDescriptor

#### Get Signature

> **get** **uniformBufferDescriptor**(): `GPUBufferDescriptor`

Defined in: [src/resources/buffer/core/AUniformBaseBuffer.ts:105](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/resources/buffer/core/AUniformBaseBuffer.ts#L105)

`GPUBufferDescriptor`를 반환합니다.


##### Returns

`GPUBufferDescriptor`

#### Inherited from

[`AUniformBaseBuffer`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md).[`uniformBufferDescriptor`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md#uniformbufferdescriptor)

***

### usage

#### Get Signature

> **get** **usage**(): `number`

Defined in: [src/resources/buffer/core/ABaseBuffer.ts:68](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/resources/buffer/core/ABaseBuffer.ts#L68)

GPUBufferUsageFlags를 반환합니다.


##### Returns

`number`

#### Inherited from

[`AUniformBaseBuffer`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md).[`usage`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md#usage)

***

### uuid

#### Get Signature

> **get** **uuid**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:98](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/resources/core/ResourceBase.ts#L98)

고유 식별자(UUID)를 반환합니다.


##### Returns

`string`

#### Inherited from

[`AUniformBaseBuffer`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md).[`uuid`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md#uuid)

***

### videoMemorySize

#### Get Signature

> **get** **videoMemorySize**(): `number`

Defined in: [src/resources/buffer/core/ABaseBuffer.ts:84](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/resources/buffer/core/ABaseBuffer.ts#L84)

비디오 메모리 사용량(byte)을 반환합니다.


##### Returns

`number`

#### Inherited from

[`AUniformBaseBuffer`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md).[`videoMemorySize`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md#videomemorysize)

## Methods

### \_\_addDirtyPipelineListener()

> **\_\_addDirtyPipelineListener**(`listener`): `void`

Defined in: [src/resources/core/ResourceBase.ts:125](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/resources/core/ResourceBase.ts#L125)

파이프라인이 더티해질 때 호출될 리스너를 추가합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `listener` | () => `void` | 리스너 함수

#### Returns

`void`

#### Inherited from

[`AUniformBaseBuffer`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md).[`__addDirtyPipelineListener`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md#__adddirtypipelinelistener)

***

### \_\_fireListenerList()

> **\_\_fireListenerList**(`resetList`): `void`

Defined in: [src/resources/core/ResourceBase.ts:152](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/resources/core/ResourceBase.ts#L152)

등록된 더티 리스너들을 실행합니다.


#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `resetList` | `boolean` | `false` | 실행 후 리스너 목록 초기화 여부 (기본값: false)

#### Returns

`void`

#### Inherited from

[`AUniformBaseBuffer`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md).[`__fireListenerList`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md#__firelistenerlist)

***

### \_\_removeDirtyPipelineListener()

> **\_\_removeDirtyPipelineListener**(`listener`): `void`

Defined in: [src/resources/core/ResourceBase.ts:137](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/resources/core/ResourceBase.ts#L137)

더티 파이프라인 리스너를 제거합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `listener` | () => `void` | 제거할 리스너 함수

#### Returns

`void`

#### Inherited from

[`AUniformBaseBuffer`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md).[`__removeDirtyPipelineListener`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md#__removedirtypipelinelistener)

***

### destroy()

> **destroy**(): `void`

Defined in: [src/resources/buffer/core/ABaseBuffer.ts:92](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/resources/buffer/core/ABaseBuffer.ts#L92)

리소스를 파괴합니다.


#### Returns

`void`

#### Inherited from

[`AUniformBaseBuffer`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md).[`destroy`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md#destroy)

***

### writeOnlyBuffer()

> **writeOnlyBuffer**(`target`, `value`): `void`

Defined in: [src/resources/buffer/core/AUniformBaseBuffer.ts:119](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/resources/buffer/core/AUniformBaseBuffer.ts#L119)

유니폼 버퍼에 데이터를 씁니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `target` | `any` | 대상 유니폼 정보 (View 생성자 및 오프셋 포함)
| `value` | `any` | 쓸 값

#### Returns

`void`

#### Inherited from

[`AUniformBaseBuffer`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md).[`writeOnlyBuffer`](../namespaces/CoreBuffer/classes/AUniformBaseBuffer.md#writeonlybuffer)
