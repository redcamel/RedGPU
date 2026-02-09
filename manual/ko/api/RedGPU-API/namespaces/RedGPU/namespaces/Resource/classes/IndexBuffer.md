[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Resource](../README.md) / IndexBuffer

# Class: IndexBuffer

Defined in: [src/resources/buffer/indexBuffer/IndexBuffer.ts:19](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/resources/buffer/indexBuffer/IndexBuffer.ts#L19)

인덱스 버퍼를 관리하는 클래스입니다.


* ### Example
```typescript
const indexBuffer = new RedGPU.Resource.IndexBuffer(redGPUContext, [0, 1, 2]);
```

## Extends

- [`ABaseBuffer`](../namespaces/CoreBuffer/classes/ABaseBuffer.md)

## Constructors

### Constructor

> **new IndexBuffer**(`redGPUContext`, `data`, `usage`, `cacheKey`): `IndexBuffer`

Defined in: [src/resources/buffer/indexBuffer/IndexBuffer.ts:59](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/resources/buffer/indexBuffer/IndexBuffer.ts#L59)

IndexBuffer 인스턴스를 생성합니다.


* ### Example
```typescript
const indexBuffer = new RedGPU.Resource.IndexBuffer(redGPUContext, [0, 1, 2], GPUBufferUsage.INDEX, 'MyIndexBuffer');
```

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | `undefined` | RedGPUContext 인스턴스
| `data` | `NumberArray` | `undefined` | 인덱스 데이터 (`Array<number>` 또는 `Uint32Array`)
| `usage` | `number` | `...` | GPUBufferUsageFlags (기본값: `GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST`)
| `cacheKey` | `string` | `''` | 버퍼 캐시 키 (옵션)

#### Returns

`IndexBuffer`

#### Overrides

[`ABaseBuffer`](../namespaces/CoreBuffer/classes/ABaseBuffer.md).[`constructor`](../namespaces/CoreBuffer/classes/ABaseBuffer.md#constructor)

## Properties

### \[GPU\_BUFFER\_CACHE\_KEY\]

> **\[GPU\_BUFFER\_CACHE\_KEY\]**: `string`

Defined in: [src/resources/buffer/core/ABaseBuffer.ts:23](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/resources/buffer/core/ABaseBuffer.ts#L23)

#### Inherited from

[`ABaseBuffer`](../namespaces/CoreBuffer/classes/ABaseBuffer.md).[`[GPU_BUFFER_CACHE_KEY]`](../namespaces/CoreBuffer/classes/ABaseBuffer.md#gpu_buffer_cache_key)

***

### \[GPU\_BUFFER\_DATA\_SYMBOL\]

> **\[GPU\_BUFFER\_DATA\_SYMBOL\]**: `Uint32Array`

Defined in: [src/resources/buffer/indexBuffer/IndexBuffer.ts:24](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/resources/buffer/indexBuffer/IndexBuffer.ts#L24)

인덱스 데이터가 저장되는 내부 버퍼입니다.


***

### \[GPU\_BUFFER\_SYMBOL\]

> **\[GPU\_BUFFER\_SYMBOL\]**: `GPUBuffer`

Defined in: [src/resources/buffer/core/ABaseBuffer.ts:22](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/resources/buffer/core/ABaseBuffer.ts#L22)

#### Inherited from

[`ABaseBuffer`](../namespaces/CoreBuffer/classes/ABaseBuffer.md).[`[GPU_BUFFER_SYMBOL]`](../namespaces/CoreBuffer/classes/ABaseBuffer.md#gpu_buffer_symbol)

## Accessors

### cacheKey

#### Get Signature

> **get** **cacheKey**(): `string`

Defined in: [src/resources/buffer/core/ABaseBuffer.ts:52](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/resources/buffer/core/ABaseBuffer.ts#L52)

캐시 키를 반환합니다.


##### Returns

`string`

#### Inherited from

[`ABaseBuffer`](../namespaces/CoreBuffer/classes/ABaseBuffer.md).[`cacheKey`](../namespaces/CoreBuffer/classes/ABaseBuffer.md#cachekey)

***

### data

#### Get Signature

> **get** **data**(): `NumberArray`

Defined in: [src/resources/buffer/indexBuffer/IndexBuffer.ts:108](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/resources/buffer/indexBuffer/IndexBuffer.ts#L108)

인덱스 데이터를 반환합니다.


##### Returns

`NumberArray`

***

### format

#### Get Signature

> **get** **format**(): `GPUIndexFormat`

Defined in: [src/resources/buffer/indexBuffer/IndexBuffer.ts:84](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/resources/buffer/indexBuffer/IndexBuffer.ts#L84)

GPU 인덱스 형식을 반환합니다.


##### Returns

`GPUIndexFormat`

***

### gpuBuffer

#### Get Signature

> **get** **gpuBuffer**(): `GPUBuffer`

Defined in: [src/resources/buffer/core/ABaseBuffer.ts:60](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/resources/buffer/core/ABaseBuffer.ts#L60)

GPUBuffer 객체를 반환합니다.


##### Returns

`GPUBuffer`

#### Inherited from

[`ABaseBuffer`](../namespaces/CoreBuffer/classes/ABaseBuffer.md).[`gpuBuffer`](../namespaces/CoreBuffer/classes/ABaseBuffer.md#gpubuffer)

***

### gpuDevice

#### Get Signature

> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/resources/core/ResourceBase.ts:106](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/resources/core/ResourceBase.ts#L106)

연관된 GPU 디바이스를 반환합니다.


##### Returns

`GPUDevice`

#### Inherited from

[`ABaseBuffer`](../namespaces/CoreBuffer/classes/ABaseBuffer.md).[`gpuDevice`](../namespaces/CoreBuffer/classes/ABaseBuffer.md#gpudevice)

***

### indexCount

#### Get Signature

> **get** **indexCount**(): `number`

Defined in: [src/resources/buffer/indexBuffer/IndexBuffer.ts:100](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/resources/buffer/indexBuffer/IndexBuffer.ts#L100)

인덱스 개수를 반환합니다.


##### Returns

`number`

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:81](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/resources/core/ResourceBase.ts#L81)

인스턴스의 이름을 반환합니다. 이름이 없으면 클래스명과 ID로 생성합니다.


##### Returns

`string`

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/resources/core/ResourceBase.ts:90](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/resources/core/ResourceBase.ts#L90)

인스턴스의 이름을 설정합니다.


##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

##### Returns

`void`

#### Inherited from

[`ABaseBuffer`](../namespaces/CoreBuffer/classes/ABaseBuffer.md).[`name`](../namespaces/CoreBuffer/classes/ABaseBuffer.md#name)

***

### redGPUContext

#### Get Signature

> **get** **redGPUContext**(): [`RedGPUContext`](../../Context/classes/RedGPUContext.md)

Defined in: [src/resources/core/ResourceBase.ts:114](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/resources/core/ResourceBase.ts#L114)

RedGPUContext 인스턴스를 반환합니다.


##### Returns

[`RedGPUContext`](../../Context/classes/RedGPUContext.md)

#### Inherited from

[`ABaseBuffer`](../namespaces/CoreBuffer/classes/ABaseBuffer.md).[`redGPUContext`](../namespaces/CoreBuffer/classes/ABaseBuffer.md#redgpucontext)

***

### resourceManagerKey

#### Get Signature

> **get** **resourceManagerKey**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:73](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/resources/core/ResourceBase.ts#L73)

리소스 매니저 키를 반환합니다.


##### Returns

`string`

#### Inherited from

[`ABaseBuffer`](../namespaces/CoreBuffer/classes/ABaseBuffer.md).[`resourceManagerKey`](../namespaces/CoreBuffer/classes/ABaseBuffer.md#resourcemanagerkey)

***

### size

#### Get Signature

> **get** **size**(): `number`

Defined in: [src/resources/buffer/core/ABaseBuffer.ts:76](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/resources/buffer/core/ABaseBuffer.ts#L76)

버퍼의 크기(byte)를 반환합니다.


##### Returns

`number`

#### Inherited from

[`ABaseBuffer`](../namespaces/CoreBuffer/classes/ABaseBuffer.md).[`size`](../namespaces/CoreBuffer/classes/ABaseBuffer.md#size)

***

### targetResourceManagedState

#### Get Signature

> **get** **targetResourceManagedState**(): [`ResourceStatusInfo`](../namespaces/Core/classes/ResourceStatusInfo.md)

Defined in: [src/resources/core/ManagementResourceBase.ts:45](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/resources/core/ManagementResourceBase.ts#L45)

리소스의 관리 상태 정보를 반환합니다.


##### Returns

[`ResourceStatusInfo`](../namespaces/Core/classes/ResourceStatusInfo.md)

#### Inherited from

[`ABaseBuffer`](../namespaces/CoreBuffer/classes/ABaseBuffer.md).[`targetResourceManagedState`](../namespaces/CoreBuffer/classes/ABaseBuffer.md#targetresourcemanagedstate)

***

### triangleCount

#### Get Signature

> **get** **triangleCount**(): `number`

Defined in: [src/resources/buffer/indexBuffer/IndexBuffer.ts:92](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/resources/buffer/indexBuffer/IndexBuffer.ts#L92)

삼각형 개수를 반환합니다.


##### Returns

`number`

***

### usage

#### Get Signature

> **get** **usage**(): `number`

Defined in: [src/resources/buffer/core/ABaseBuffer.ts:68](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/resources/buffer/core/ABaseBuffer.ts#L68)

GPUBufferUsageFlags를 반환합니다.


##### Returns

`number`

#### Inherited from

[`ABaseBuffer`](../namespaces/CoreBuffer/classes/ABaseBuffer.md).[`usage`](../namespaces/CoreBuffer/classes/ABaseBuffer.md#usage)

***

### uuid

#### Get Signature

> **get** **uuid**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:98](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/resources/core/ResourceBase.ts#L98)

고유 식별자(UUID)를 반환합니다.


##### Returns

`string`

#### Inherited from

[`ABaseBuffer`](../namespaces/CoreBuffer/classes/ABaseBuffer.md).[`uuid`](../namespaces/CoreBuffer/classes/ABaseBuffer.md#uuid)

***

### videoMemorySize

#### Get Signature

> **get** **videoMemorySize**(): `number`

Defined in: [src/resources/buffer/core/ABaseBuffer.ts:84](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/resources/buffer/core/ABaseBuffer.ts#L84)

비디오 메모리 사용량(byte)을 반환합니다.


##### Returns

`number`

#### Inherited from

[`ABaseBuffer`](../namespaces/CoreBuffer/classes/ABaseBuffer.md).[`videoMemorySize`](../namespaces/CoreBuffer/classes/ABaseBuffer.md#videomemorysize)

## Methods

### \_\_addDirtyPipelineListener()

> **\_\_addDirtyPipelineListener**(`listener`): `void`

Defined in: [src/resources/core/ResourceBase.ts:125](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/resources/core/ResourceBase.ts#L125)

파이프라인이 더티해질 때 호출될 리스너를 추가합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `listener` | () => `void` | 리스너 함수

#### Returns

`void`

#### Inherited from

[`ABaseBuffer`](../namespaces/CoreBuffer/classes/ABaseBuffer.md).[`__addDirtyPipelineListener`](../namespaces/CoreBuffer/classes/ABaseBuffer.md#__adddirtypipelinelistener)

***

### \_\_fireListenerList()

> **\_\_fireListenerList**(`resetList`): `void`

Defined in: [src/resources/core/ResourceBase.ts:152](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/resources/core/ResourceBase.ts#L152)

등록된 더티 리스너들을 실행합니다.


#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `resetList` | `boolean` | `false` | 실행 후 리스너 목록 초기화 여부 (기본값: false)

#### Returns

`void`

#### Inherited from

[`ABaseBuffer`](../namespaces/CoreBuffer/classes/ABaseBuffer.md).[`__fireListenerList`](../namespaces/CoreBuffer/classes/ABaseBuffer.md#__firelistenerlist)

***

### \_\_removeDirtyPipelineListener()

> **\_\_removeDirtyPipelineListener**(`listener`): `void`

Defined in: [src/resources/core/ResourceBase.ts:137](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/resources/core/ResourceBase.ts#L137)

더티 파이프라인 리스너를 제거합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `listener` | () => `void` | 제거할 리스너 함수

#### Returns

`void`

#### Inherited from

[`ABaseBuffer`](../namespaces/CoreBuffer/classes/ABaseBuffer.md).[`__removeDirtyPipelineListener`](../namespaces/CoreBuffer/classes/ABaseBuffer.md#__removedirtypipelinelistener)

***

### changeData()

> **changeData**(`data`): `void`

Defined in: [src/resources/buffer/indexBuffer/IndexBuffer.ts:125](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/resources/buffer/indexBuffer/IndexBuffer.ts#L125)

인덱스 버퍼의 데이터를 변경합니다.


* ### Example
```typescript
indexBuffer.changeData([3, 4, 5]);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `data` | `NumberArray` | 새로운 인덱스 데이터 (`Array<number>` 또는 `Uint32Array`)

#### Returns

`void`

***

### destroy()

> **destroy**(): `void`

Defined in: [src/resources/buffer/core/ABaseBuffer.ts:92](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/resources/buffer/core/ABaseBuffer.ts#L92)

리소스를 파괴합니다.


#### Returns

`void`

#### Inherited from

[`ABaseBuffer`](../namespaces/CoreBuffer/classes/ABaseBuffer.md).[`destroy`](../namespaces/CoreBuffer/classes/ABaseBuffer.md#destroy)
